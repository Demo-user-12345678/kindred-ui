import {
  CreateTableCommand,
  DescribeTableCommand,
  DynamoDBClient,
  ResourceNotFoundException,
  waitUntilTableExists,
} from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, GetCommand, PutCommand, ScanCommand } from '@aws-sdk/lib-dynamodb'
import { awsCredentialsProvider } from '@vercel/functions/oidc'

const region = process.env.AWS_REGION
const table_name = process.env.DYNAMODB_TABLE_NAME || 'kindred-confirmations'
const partition_key = process.env.DYNAMODB_TABLE_PARTITION_KEY || 'id'
const sort_key = process.env.DYNAMODB_TABLE_SORT_KEY

const client = new DynamoDBClient({
  region,
  credentials: awsCredentialsProvider({
    roleArn: process.env.AWS_ROLE_ARN,
    clientConfig: { region },
  }),
})

export const dynamodb = DynamoDBDocumentClient.from(client, {
  marshallOptions: { removeUndefinedValues: true },
})

export const table = table_name

let table_ready: Promise<void> | undefined

async function ensure_table() {
  if (!table_ready) {
    table_ready = (async () => {
      try {
        await client.send(new DescribeTableCommand({ TableName: table }))
      } catch (error) {
        if (!(error instanceof ResourceNotFoundException)) throw error

        const key_schema = [
          { AttributeName: partition_key, KeyType: 'HASH' as const },
          ...(sort_key ? [{ AttributeName: sort_key, KeyType: 'RANGE' as const }] : []),
        ]
        await client.send(new CreateTableCommand({
          TableName: table,
          KeySchema: key_schema,
          AttributeDefinitions: key_schema.map(({ AttributeName }) => ({
            AttributeName,
            AttributeType: 'S' as const,
          })),
          BillingMode: 'PAY_PER_REQUEST',
          SSESpecification: { Enabled: true },
          DeletionProtectionEnabled: true,
        }))
        await waitUntilTableExists({ client, maxWaitTime: 60 }, { TableName: table })
      }
    })().catch((error) => {
      table_ready = undefined
      throw error
    })
  }

  return table_ready
}

export function key_for(id: string) {
  return sort_key ? { [partition_key]: id, [sort_key]: 'APP' } : { [partition_key]: id }
}

export async function save_item(item: Record<string, unknown>) {
  await ensure_table()
  await dynamodb.send(new PutCommand({
    TableName: table,
    Item: item,
    ConditionExpression: `attribute_not_exists(#pk)`,
    ExpressionAttributeNames: { '#pk': partition_key },
  }))
}

export async function read_item(id: string) {
  await ensure_table()
  const result = await dynamodb.send(new GetCommand({ TableName: table, Key: key_for(id) }))
  return result.Item ?? null
}

export async function read_all_items() {
  await ensure_table()
  const result = await dynamodb.send(new ScanCommand({ TableName: table }))
  return result.Items ?? []
}

import {
  CreateTableCommand,
  DescribeTableCommand,
  DynamoDBClient,
  ResourceInUseException,
  waitUntilTableExists,
} from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, GetCommand, PutCommand, ScanCommand } from '@aws-sdk/lib-dynamodb'
import { awsCredentialsProvider } from '@vercel/functions/oidc'

const table_name = process.env.DYNAMODB_TABLE_NAME
const partition_key = process.env.DYNAMODB_TABLE_PARTITION_KEY || 'id'
const sort_key = process.env.DYNAMODB_TABLE_SORT_KEY
const region = process.env.AWS_REGION || 'us-east-1'
const role_arn = process.env.AWS_ROLE_ARN

const client = new DynamoDBClient({
  region,
  credentials: awsCredentialsProvider({
    roleArn: role_arn || '',
    clientConfig: { region },
  }),
})

export const dynamodb = DynamoDBDocumentClient.from(client, {
  marshallOptions: { removeUndefinedValues: true },
})

export const table = table_name

let table_ready: Promise<void> | undefined

export async function ensure_table() {
  if (!table_ready) {
    table_ready = (async () => {
      try {
        await client.send(new DescribeTableCommand({ TableName: table_name }))
      } catch (error) {
        if (!(error instanceof ResourceInUseException) && (error as { name?: string }).name !== 'ResourceNotFoundException') {
          throw error
        }
        try {
          await client.send(new CreateTableCommand({
            TableName: table_name,
            BillingMode: 'PAY_PER_REQUEST',
            AttributeDefinitions: [
              { AttributeName: partition_key, AttributeType: 'S' },
              ...(sort_key ? [{ AttributeName: sort_key, AttributeType: 'S' as const }] : []),
            ],
            KeySchema: [
              { AttributeName: partition_key, KeyType: 'HASH' },
              ...(sort_key ? [{ AttributeName: sort_key, KeyType: 'RANGE' as const }] : []),
            ],
            DeletionProtectionEnabled: true,
          }))
        } catch (create_error) {
          if (!(create_error instanceof ResourceInUseException)) throw create_error
        }
        await waitUntilTableExists({ client, maxWaitTime: 30 }, { TableName: table_name })
      }
    })()
  }
  return table_ready
}

export function key_for(id: string) {
  return sort_key ? { [partition_key]: id, [sort_key]: 'APP' } : { [partition_key]: id }
}

export async function save_item(item: Record<string, unknown>) {
  await ensure_table()
  await dynamodb.send(new PutCommand({ TableName: table, Item: item }))
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

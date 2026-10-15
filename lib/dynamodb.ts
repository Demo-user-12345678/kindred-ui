import {
  CreateTableCommand,
  DynamoDBClient,
  DescribeTableCommand,
  ResourceNotFoundException,
} from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, GetCommand, PutCommand, ScanCommand } from '@aws-sdk/lib-dynamodb'
import { awsCredentialsProvider } from '@vercel/functions/oidc'

const region = process.env.AWS_REGION || 'us-east-1'
const table_name = process.env.DYNAMODB_TABLE_NAME || 'kindred-confirmations'
const partition_key = process.env.DYNAMODB_TABLE_PARTITION_KEY || 'id'
const sort_key = process.env.DYNAMODB_TABLE_SORT_KEY

const client = new DynamoDBClient({
  region,
  credentials: awsCredentialsProvider({
    roleArn: process.env.AWS_ROLE_ARN || '',
    clientConfig: { region },
  }),
})

let table_ready: Promise<void> | undefined

export async function ensure_table() {
  if (!table_ready) {
    table_ready = (async () => {
      try {
        await client.send(new DescribeTableCommand({ TableName: table_name }))
      } catch (error) {
        if (!(error instanceof ResourceNotFoundException)) throw error

        await client.send(new CreateTableCommand({
          TableName: table_name,
          AttributeDefinitions: [
            { AttributeName: partition_key, AttributeType: 'S' },
            ...(sort_key ? [{ AttributeName: sort_key, AttributeType: 'S' as const }] : []),
          ],
          KeySchema: [
            { AttributeName: partition_key, KeyType: 'HASH' },
            ...(sort_key ? [{ AttributeName: sort_key, KeyType: 'RANGE' as const }] : []),
          ],
          BillingMode: 'PAY_PER_REQUEST',
          SSESpecification: { Enabled: true },
        }))

        let status = 'CREATING'
        while (status !== 'ACTIVE') {
          await new Promise((resolve) => setTimeout(resolve, 500))
          const result = await client.send(new DescribeTableCommand({ TableName: table_name }))
          status = result.Table?.TableStatus ?? 'CREATING'
        }
      }
    })()
  }

  return table_ready
}

export const table_name_for_logs = table_name

export const dynamodb = DynamoDBDocumentClient.from(client, {
  marshallOptions: { removeUndefinedValues: true },
})

export const table = table_name

export function key_for(id: string) {
  return sort_key ? { [partition_key]: id, [sort_key]: 'APP' } : { [partition_key]: id }
}

export async function save_item(item: Record<string, unknown>, prevent_overwrite = false) {
  await dynamodb.send(new PutCommand({
    TableName: table,
    Item: item,
    ...(prevent_overwrite ? { ConditionExpression: `attribute_not_exists(#partition_key)` } : {}),
    ...(prevent_overwrite ? { ExpressionAttributeNames: { '#partition_key': partition_key } } : {}),
  }))
}

export async function read_item(id: string) {
  const result = await dynamodb.send(new GetCommand({ TableName: table, Key: key_for(id) }))
  return result.Item ?? null
}

export async function read_all_items() {
  const result = await dynamodb.send(new ScanCommand({ TableName: table }))
  return result.Items ?? []
}

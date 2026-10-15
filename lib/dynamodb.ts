import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, GetCommand, PutCommand, ScanCommand } from '@aws-sdk/lib-dynamodb'
import { awsCredentialsProvider } from '@vercel/functions/oidc'

const aws_region = process.env.AWS_REGION || 'us-east-1'
const table_name = process.env.DYNAMODB_TABLE_NAME
const partition_key = process.env.DYNAMODB_TABLE_PARTITION_KEY || 'id'
const sort_key = process.env.DYNAMODB_TABLE_SORT_KEY

const client = new DynamoDBClient({
  region: aws_region,
  credentials: awsCredentialsProvider({
    roleArn: process.env.AWS_ROLE_ARN,
    clientConfig: { region: aws_region },
  }),
})

export const dynamodb = DynamoDBDocumentClient.from(client, {
  marshallOptions: { removeUndefinedValues: true },
})

export const table = table_name

export function key_for(id: string) {
  return sort_key ? { [partition_key]: id, [sort_key]: 'APP' } : { [partition_key]: id }
}

export async function save_item(item: Record<string, unknown>) {
  await dynamodb.send(new PutCommand({ TableName: table, Item: item }))
}

export async function read_item(id: string) {
  const result = await dynamodb.send(new GetCommand({ TableName: table, Key: key_for(id) }))
  return result.Item ?? null
}

export async function read_all_items() {
  const result = await dynamodb.send(new ScanCommand({ TableName: table }))
  return result.Items ?? []
}

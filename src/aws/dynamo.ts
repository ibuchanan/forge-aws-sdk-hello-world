//import config from "../config";

export async function provisionDynamoDBtable(name: string) {
  console.log(`DynamoDB table ${name} already exists`);
  console.log(`DynamoDB table ${name} does not exist. Creating...`);
  console.log(`Created DynamoDB table named: ${name}`);
}

export async function deleteDynamoDBtable(name: string) {
  console.log(`DynamoDB table ${name} does not exist`);
  console.log(`DynamoDB table ${name} exists. Deleting...`);
  console.log(`Deleted DynamoDB table named: ${name}`);
}

export async function storeRecordInDynamoDBtable(
  table: string,
  content: string,
) {
  console.log(`Adding record to DynamoDB table ${table}...`);
  console.log(`Added record: ${content}`);
}

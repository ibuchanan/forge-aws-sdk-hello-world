import config from "../config";
import {
  DynamoDBClient,
  ListTablesCommand,
  CreateTableCommand,
  DeleteTableCommand,
  PutItemCommand,
} from "@aws-sdk/client-dynamodb";

const ddbClient = new DynamoDBClient({
  region: config.AWS_DEFAULT_REGION,
  credentials: {
    accessKeyId: config.AWS_ACCESS_KEY_ID,
    secretAccessKey: config.AWS_SECRET_ACCESS_KEY,
  },
});

async function isExistingTable(name: string) {
  const ListTablesOutput = await ddbClient.send(new ListTablesCommand({}));
  // console.log(`ListTablesOutput: ${JSON.stringify(ListTablesOutput)}`);
  const matchingName = ListTablesOutput.TableNames?.filter(
    (table) => table === name,
  );
  const isExisting =
    typeof matchingName !== "undefined" && matchingName.length > 0;
  console.log(`Table ${name} does${isExisting ? " " : " not "}exist`);
  return isExisting;
}

export async function provisionDynamoDBtable(name: string) {
  // Check if the Amazon DynamoDB table already exists
  if (await isExistingTable(name)) {
    console.log(
      `DynamoDB table ${name} already exists. No need to recreate it.`,
    );
    return;
  }
  console.log(`DynamoDB table ${name} does not exist. Creating...`);
  const command = new CreateTableCommand({
    TableName: name,
    // For more information about data types,
    // see https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.NamingRulesDataTypes.html#HowItWorks.DataTypes and
    // https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Programming.LowLevelAPI.html#Programming.LowLevelAPI.DataTypeDescriptors
    AttributeDefinitions: [
      {
        AttributeName: "Content",
        AttributeType: "S",
      },
    ],
    KeySchema: [
      {
        AttributeName: "Content",
        KeyType: "HASH",
      },
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 1,
      WriteCapacityUnits: 1,
    },
  });

  const response = await ddbClient.send(command);
  // console.log(`DynamoDB response: ${JSON.stringify(response)}`);
  console.log(
    `Created DynamoDB table named: ${response.TableDescription?.TableName}`,
  );
}

export async function deleteDynamoDBtable(name: string) {
  // Check if the Amazon DynamoDB table already exists
  if (!(await isExistingTable(name))) {
    console.log(`DynamoDB table ${name} does not exist. Nothing to clean up.`);
    return;
  }
  console.log(`DynamoDB table ${name} exists. Deleting...`);
  await ddbClient.send(new DeleteTableCommand({ TableName: name }));
  console.log(`Deleted DynamoDB table named: ${name}`);
}

export async function storeRecordInDynamoDBtable(
  table: string,
  content: string,
) {
  // Check if the Amazon DynamoDB table already exists
  if (!(await isExistingTable(table))) {
    console.log(
      `DynamoDB table ${table} does not exist. Can't store any content.`,
    );
    return;
  }
  console.log(`Adding record to DynamoDB table ${table}...`);
  const command = new PutItemCommand({
    TableName: table,
    // For more information about data types,
    // see https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.NamingRulesDataTypes.html#HowItWorks.DataTypes and
    // https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Programming.LowLevelAPI.html#Programming.LowLevelAPI.DataTypeDescriptors
    Item: {
      Content: { S: content },
    },
  });

  const response = await ddbClient.send(command);
  // console.log(`DynamoDB response: ${JSON.stringify(response)}`);
  console.log(
    `Added record (${response.$metadata.httpStatusCode}): ${content}`,
  );
}

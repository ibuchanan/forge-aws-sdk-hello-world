import config from "../config";
import {
  SNSClient,
  paginateListTopics,
  CreateTopicCommand,
  DeleteTopicCommand,
  PublishCommand,
} from "@aws-sdk/client-sns";

// The configuration object (`{}`) is required. If the region and credentials
// are omitted, the SDK uses your local configuration if it exists.
const snsClient = new SNSClient({
  region: config.AWS_DEFAULT_REGION,
  credentials: {
    accessKeyId: config.AWS_ACCESS_KEY_ID,
    secretAccessKey: config.AWS_SECRET_ACCESS_KEY,
  },
});

async function findUniqueArnOrNullForName(name: string) {
  // You can also use `ListTopicsCommand`, but to use that command you must
  // handle the pagination yourself. You can do that by sending the `ListTopicsCommand`
  // with the `NextToken` parameter from the previous request.
  const paginatedTopics = paginateListTopics({ client: snsClient }, {});
  const topics = [];

  for await (const page of paginatedTopics) {
    if (page.Topics?.length) {
      topics.push(...page.Topics);
    }
  }
  // console.log(`Topic list: ${JSON.stringify(topics)}`);
  const matchingName = topics.filter((topic) => topic.TopicArn?.endsWith(name));
  console.log(`Found ${matchingName.length} topic(s) matching name`);
  var result = null;
  if (
    typeof matchingName !== "undefined" &&
    matchingName.length === 1 &&
    typeof matchingName[0].TopicArn !== "undefined"
  ) {
    result = matchingName[0].TopicArn;
  }
  console.log(`Found ARN: ${result}`);
  return result;
}

export async function provisionSNStopic(name: string) {
  // Check if the Amazon SNS topic already exists
  if (typeof (await findUniqueArnOrNullForName(name)) === "string") {
    console.log(`SNS topic ${name} already exists. No need to recreate it.`);
    return;
  }
  console.log(`SNS topic ${name} does not exist. Creating...`);
  const response = await snsClient.send(new CreateTopicCommand({ Name: name }));
  // console.log(`SNS response: ${JSON.stringify(response)}`);
  console.log(`Created SNS topic: ${response.TopicArn}`);
}

export async function deleteSNStopic(name: string) {
  const topicArn = await findUniqueArnOrNullForName(name);
  if (typeof topicArn !== "string") {
    console.log(`SNS topic ${name} does not exist. Nothing to clean up.`);
    return;
  }
  console.log(`SNS topic ${name} exists. Deleting...`);
  await snsClient.send(new DeleteTopicCommand({ TopicArn: topicArn }));
  console.log(`Deleted SNS topic named: ${name}`);
}

export async function sendMessageInSNStopic(topic: string, content: string) {
  const topicArn = await findUniqueArnOrNullForName(topic);
  if (typeof topic !== "string") {
    console.log(`SNS topic ${topic} does not exist. Can't send any content.`);
    return;
  }
  console.log(`Sending message to SNS topic ${topic}...`);
  const response = await snsClient.send(
    new PublishCommand({
      Message: content,
      TopicArn: topicArn as string,
    }),
  );
  // console.log(`SNS response: ${JSON.stringify(response)}`);
  console.log(
    `Sent Message (${response.$metadata.httpStatusCode}): ${response.MessageId}`,
  );
}

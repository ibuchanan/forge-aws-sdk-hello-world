//import config from "../config";

export async function provisionSNStopic(name: string) {
  console.log(`SNS topic ${name} already exists`);
  console.log(`SNS topic ${name} does not exist. Creating...`);
  console.log(`Created SNS topic named: ${name}`);
}

export async function deleteSNStopic(name: string) {
  console.log(`SNS topic ${name} already exists`);
  console.log(`SNS topic ${name} does not exist. Creating...`);
  console.log(`Created SNS topic named: ${name}`);
}

export async function sendMessageInSNStopic(topic: string, content: string) {
  console.log(`Sending message to SNS topic ${topic}...`);
  console.log(`Sent Message: ${content}`);
}

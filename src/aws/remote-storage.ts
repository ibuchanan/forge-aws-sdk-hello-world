import config from "../config";
import { storeFileInS3bucket } from "./s3";
import { storeRecordInDynamoDBtable } from "./dynamo";
import { sendMessageInSNStopic } from "./sns";

export async function storeTenantData(id: string, content: string) {
  const resourceName = config.APP_NAME + id;
  await storeFileInS3bucket(resourceName, content);
  await storeRecordInDynamoDBtable(resourceName, content);
  await sendMessageInSNStopic(resourceName, content);
}

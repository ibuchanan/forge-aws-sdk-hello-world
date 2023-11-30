import config from "../config";
import { provisionS3bucket, deleteS3bucket } from "./s3";
import { provisionDynamoDBtable, deleteDynamoDBtable } from "./dynamo";
import { provisionSNStopic, deleteSNStopic } from "./sns";

export async function provisionForTenant(id: string) {
  const resourceName = config.APP_NAME + id;
  await provisionS3bucket(resourceName);
  await provisionDynamoDBtable(resourceName);
  await provisionSNStopic(resourceName);
}

export async function deprovisionForTenant(id: string) {
  const resourceName = config.APP_NAME + id;
  await deleteS3bucket(resourceName);
  await deleteDynamoDBtable(resourceName);
  await deleteSNStopic(resourceName);
}

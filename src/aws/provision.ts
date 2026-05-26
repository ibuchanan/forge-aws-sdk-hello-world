import config from '../config'
import { provisionS3bucket, deleteS3bucket } from './s3'
import { provisionDynamoDBtable, deleteDynamoDBtable } from './dynamo'
import { provisionSNStopic, deleteSNStopic } from './sns'

export async function provisionForTenant(id: string) {
  const resourceName = `${config.APP_NAME}-${id}`
  await Promise.all([
    provisionS3bucket(resourceName),
    provisionDynamoDBtable(resourceName),
    provisionSNStopic(resourceName),
  ])
}

export async function deprovisionForTenant(id: string) {
  const resourceName = `${config.APP_NAME}-${id}`
  await Promise.all([
    deleteS3bucket(resourceName),
    deleteDynamoDBtable(resourceName),
    deleteSNStopic(resourceName),
  ])
}

import config from "./config";
import {
  S3Client,
  PutObjectCommand,
  CreateBucketCommand,
  DeleteObjectCommand,
  DeleteBucketCommand,
  paginateListObjectsV2,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { z } from "zod";

export const BucketSchema = z.object({
  /*
    https://docs.aws.amazon.com/AmazonS3/latest/userguide/bucketnamingrules.html
    */
  name: z
    .string()
    .min(3)
    .max(63)
    .regex(
      new RegExp("(?!(^xn--|.+-s3alias$))^[a-z0-9][a-z0-9-]{1,61}[a-z0-9]$")
    ),
  content: z.string().min(1),
});

export type Bucket = z.infer<typeof BucketSchema>;

export async function s3lifecycle(bucket: Bucket) {
  console.log(bucket);

  // A region and credentials can be declared explicitly. For example
  // `new S3Client({ region: 'us-east-1', credentials: {...} })` would
  //initialize the client with those settings. However, the SDK will
  // use your local configuration and credentials if those properties
  // are not defined here.
  console.log("create s3Client");
  const s3Client = new S3Client({
    region: config.AWS_DEFAULT_REGION,
    credentials: {
      accessKeyId: config.AWS_ACCESS_KEY_ID,
      secretAccessKey: config.AWS_SECRET_ACCESS_KEY,
    },
  });

  // Create an Amazon S3 bucket. The epoch timestamp is appended
  // to the name to make it unique.
  const bucketName = bucket.name;
  console.log(bucketName);
  await s3Client.send(
    new CreateBucketCommand({
      Bucket: bucketName,
    })
  );

  // Put an object into an Amazon S3 bucket.
  console.log(`write: ${bucket.content.slice(0, 4)}...`);
  await s3Client.send(
    new PutObjectCommand({
      Bucket: bucketName,
      Key: "content.txt",
      Body: bucket.content,
    })
  );

  // Read the object.
  console.log("read content");
  const { Body } = await s3Client.send(
    new GetObjectCommand({
      Bucket: bucketName,
      Key: "content.txt",
    })
  );

  console.log(await Body?.transformToString());

  // And then cleanup with resource deletion.
  // Create an async iterator over lists of objects in a bucket.
  console.log("clean up `bucketName`");
  const paginator = paginateListObjectsV2(
    { client: s3Client },
    { Bucket: bucketName }
  );
  for await (const page of paginator) {
    const objects = page.Contents;
    if (objects) {
      // For every object in each page, delete it.
      for (const object of objects) {
        console.log(JSON.stringify(object));
        await s3Client.send(
          new DeleteObjectCommand({ Bucket: bucketName, Key: object.Key })
        );
      }
    }
  }

  // Once all the objects are gone, the bucket can be deleted.
  console.log("delete `bucketName`");
  await s3Client.send(new DeleteBucketCommand({ Bucket: bucketName }));

  return true;
}

import {
  S3Client,
  PutObjectCommand,
  CreateBucketCommand,
  DeleteObjectCommand,
  DeleteBucketCommand,
  paginateListObjectsV2,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import ice from 'node-icecream';
import { z } from 'zod';
import config from "./config";

// ic() is like console.log(), but better.
const ic = ice({});

const BucketSchema = z.object({
  /*
  https://docs.aws.amazon.com/AmazonS3/latest/userguide/bucketnamingrules.html
  */
  name: z.string().min(3).max(63).regex(new RegExp("(?!(^xn--|.+-s3alias$))^[a-z0-9][a-z0-9-]{1,61}[a-z0-9]$")),
  content: z.string().min(1),
});

type Bucket = z.infer<typeof BucketSchema>;


async function s3lifecycle(bucket: Bucket) {
  ic(bucket);

  // A region and credentials can be declared explicitly. For example
  // `new S3Client({ region: 'us-east-1', credentials: {...} })` would
  //initialize the client with those settings. However, the SDK will
  // use your local configuration and credentials if those properties
  // are not defined here.
  ic("create s3Client");
  const s3Client = new S3Client({
    region: config.AWS_DEFAULT_REGION,
    credentials: {
      accessKeyId: config.AWS_ACCESS_KEY_ID,
      secretAccessKey: config.AWS_SECRET_ACCESS_KEY,
    }
  });

  // Create an Amazon S3 bucket. The epoch timestamp is appended
  // to the name to make it unique.
  const bucketName = `forge-bucket-${Date.now()}`;
  ic(bucketName);
  await s3Client.send(
    new CreateBucketCommand({
      Bucket: bucket.name,
    })
  );

  // Put an object into an Amazon S3 bucket.
  ic(`write: ${bucket.content.slice(0, 4)}...`);
  await s3Client.send(
    new PutObjectCommand({
      Bucket: bucketName,
      Key: "content.txt",
      Body: bucket.content,
    })
  );

  // Read the object.
  ic("read content")
  const { Body } = await s3Client.send(
    new GetObjectCommand({
      Bucket: bucketName,
      Key: "content.txt",
    })
  );

  ic(await Body?.transformToString());

  // And then cleanup with resource deletion.
  // Create an async iterator over lists of objects in a bucket.
  ic("clean up `bucketName`");
  const paginator = paginateListObjectsV2(
    { client: s3Client },
    { Bucket: bucketName }
  );
  for await (const page of paginator) {
    const objects = page.Contents;
    if (objects) {
      // For every object in each page, delete it.
      for (const object of objects) {
        ic(object);
        await s3Client.send(
          new DeleteObjectCommand({ Bucket: bucketName, Key: object.Key })
        );
      }
    }
  }

  // Once all the objects are gone, the bucket can be deleted.
  ic("delete `bucketName`");
  await s3Client.send(new DeleteBucketCommand({ Bucket: bucketName }));

  return true;
}

export default async function listener(req: any) {
  ic();
  try {
    const body = JSON.parse(req.body);
    ic(body);
    const s3response = await s3lifecycle(BucketSchema.parse(body));
    ic(s3response);
    return {
      body: "Success: Message updated\n",
      headers: { "Content-Type": ["application/json"] },
      statusCode: 200,
      statusText: "OK",
    };
  } catch (error) {
    ic(error);
    return {
      body: error + "\n",
      headers: { "Content-Type": ["application/json"] },
      statusCode: 400,
      statusText: "Bad Request",
    }
  }
}


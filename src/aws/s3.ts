import config from "../config";
import {
  S3Client,
  ListBucketsCommand,
  CreateBucketCommand,
  paginateListObjectsV2,
  DeleteObjectCommand,
  DeleteBucketCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";

// A region and credentials can be declared explicitly. For example
// `new S3Client({ region: 'us-east-1', credentials: {...} })` would
// initialize the client with those settings. However, the SDK will
// use your local configuration and credentials if those properties
// are not defined here.
const s3Client = new S3Client({
  region: config.AWS_DEFAULT_REGION,
  credentials: {
    accessKeyId: config.AWS_ACCESS_KEY_ID,
    secretAccessKey: config.AWS_SECRET_ACCESS_KEY,
  },
});

export async function provisionS3bucket(name: string) {
  // Check if the Amazon S3 bucket already exists
  const ListBucketsOutput = await s3Client.send(new ListBucketsCommand({}));
  // { // ListBucketsOutput
  //   Buckets: [ // Buckets
  //     { // Bucket
  //       Name: "STRING_VALUE",
  //       CreationDate: new Date("TIMESTAMP"),
  //     },
  //   ],
  //   Owner: { // Owner
  //     DisplayName: "STRING_VALUE",
  //     ID: "STRING_VALUE",
  //   },
  // };
  console.log(`ListBucketsOutput: ${JSON.stringify(ListBucketsOutput)}`);
  const matchingName = ListBucketsOutput.Buckets?.filter(
    (bucket) => bucket.Name === name,
  );
  if (typeof matchingName !== "undefined" && matchingName.length > 0) {
    console.log(`S3 bucket ${name} already exists`);
    return;
  }

  console.log(`S3 bucket ${name} does not exist. Creating...`);
  // Create the Amazon S3 bucket.
  await s3Client.send(
    new CreateBucketCommand({
      Bucket: name,
    }),
  );
  console.log(`Created S3 bucket named: ${name}`);
}

export async function deleteS3bucket(name: string) {
  // Check if the Amazon S3 bucket already exists
  const ListBucketsOutput = await s3Client.send(new ListBucketsCommand({}));
  // { // ListBucketsOutput
  //   Buckets: [ // Buckets
  //     { // Bucket
  //       Name: "STRING_VALUE",
  //       CreationDate: new Date("TIMESTAMP"),
  //     },
  //   ],
  //   Owner: { // Owner
  //     DisplayName: "STRING_VALUE",
  //     ID: "STRING_VALUE",
  //   },
  // };
  console.log(`ListBucketsOutput: ${JSON.stringify(ListBucketsOutput)}`);
  const matchingName = ListBucketsOutput.Buckets?.filter(
    (bucket) => bucket.Name === name,
  );
  if (typeof matchingName !== "undefined" && matchingName.length === 0) {
    console.log(`S3 bucket ${name} does not exist. Nothing to clean up.`);
    return;
  }

  // Cleanup with resource deletion.
  // Create an async iterator over lists of objects in a bucket.
  console.log(`S3 bucket ${name} does exist. Removing objects...`);
  const paginator = paginateListObjectsV2(
    { client: s3Client },
    { Bucket: name },
  );
  for await (const page of paginator) {
    const objects = page.Contents;
    if (objects) {
      // For every object in each page, delete it.
      for (const object of objects) {
        console.log(JSON.stringify(object));
        await s3Client.send(
          new DeleteObjectCommand({ Bucket: name, Key: object.Key }),
        );
      }
    }
  }
  console.log(`Removed objects from S3 bucket ${name}.`);

  // Once all the objects are gone, the bucket can be deleted.
  console.log("Deleting `bucketName`...");
  await s3Client.send(new DeleteBucketCommand({ Bucket: name }));
  console.log(`Deleted S3 bucket ${name}.`);
}

export async function storeFileInS3bucket(bucket: string, content: string) {
  // Put an object into an Amazon S3 bucket.
  console.log(`write: ${content.slice(0, 4)}...`);
  await s3Client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: "content.txt",
      Body: content,
    }),
  );
}
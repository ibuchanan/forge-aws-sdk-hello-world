import dotenv from "dotenv";

dotenv.config();

console.log(process.env);

import { z } from "zod";

/*
https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-envvars.html
AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE
AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
AWS_DEFAULT_REGION=us-west-2
*/
const envSchema = z.object({
  AWS_DEFAULT_REGION: z.string().min(1),
  AWS_ACCESS_KEY_ID: z.string().min(1),
  AWS_SECRET_ACCESS_KEY: z.string().min(1),
});

const awsConfig = envSchema.parse({
  AWS_DEFAULT_REGION: process.env.AWS_DEFAULT_REGION,
  AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
});

console.log(typeof awsConfig, awsConfig);
/*
const awsConfig = envSchema.parse({
  AWS_DEFAULT_REGION: "us-west-2",
  AWS_ACCESS_KEY_ID: "AKIAIOSFODNN7EXAMPLE",
  AWS_SECRET_ACCESS_KEY: "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY",
});
*/
export default awsConfig;

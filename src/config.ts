import { z } from "zod";

/*
https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-envvars.html
AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE
AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
AWS_DEFAULT_REGION=us-west-2
*/
const envSchema = z.object({
  APP_NAME: z.string().min(1),
  AWS_DEFAULT_REGION: z.string().min(1),
  AWS_ACCESS_KEY_ID: z.string().min(1),
  AWS_SECRET_ACCESS_KEY: z.string().min(1),
});

/*
Configuration happens in the Forge runtime.
Variables must be set using `forge variables set $key $value`.
Mapping from .env to Forge variables is handled by npm scripts.
*/
const config = envSchema.parse({
  APP_NAME: "forge-aws-demo",
  AWS_DEFAULT_REGION: process.env.AWS_DEFAULT_REGION,
  AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
});

console.log(`Configuration found in env vars for ${Object.keys(config)}`);

export default config;

# The Atlassian Forge AWS SDK Demo

[![Apache 2.0 license](https://img.shields.io/badge/license-Apache%202.0-blue.svg?style=flat-square)](LICENSE)

A proof-of-concept Forge app demonstrating how to call the AWS SDK for JavaScript from the native Node.js runtime. It provisions S3, DynamoDB, and SNS resources per-tenant via webtriggers, and sends Jira issue summaries to AWS from a Jira issue panel.

**Not production-ready.** See [Known limitations](#known-limitations) before building on this.

Built with:

- [Atlassian Forge](https://go.atlassian.com/forge) — if this is your first Forge app, start with a simpler hello-world first
- [Native Node.js Runtime](https://go.atlassian.com/runtime) (previously "Runtime v2")
- [AWS SDK for JavaScript v3](https://aws.amazon.com/sdk-for-javascript/)
- [TypeScript](https://www.typescriptlang.org/docs/handbook/typescript-tooling-in-5-minutes.html)

Questions? Join the [Atlassian developer community](https://community.developer.atlassian.com/c/forge/).

## Prerequisites

- A Forge account and [Forge CLI](https://developer.atlassian.com/platform/forge/getting-started/) installed
- A [Jira Cloud developer site](http://go.atlassian.com/cloud-dev)
- An AWS account with credentials that can create S3 buckets, DynamoDB tables, and SNS topics
- Node.js 24

## Quickstart

The easiest way to try this is to [fork the repo](https://github.com/ibuchanan/forge-aws-sdk-hello-world/fork) and [open a Codespace](https://docs.github.com/en/codespaces/overview). The devcontainer handles Node.js setup automatically.

### 1. Set environment variables

```bash
npm run first-time        # copies .env.example → .env and runs forge register
```

Edit `.env` with your credentials:

```bash
FORGE_EMAIL=
FORGE_API_TOKEN=
FORGE_DEV_SITE=
AWS_DEFAULT_REGION=
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
```

### 2. Install dependencies

```bash
npm install
```

### 3. Deploy

```bash
npm run deploy            # sets Forge variables from .env, then forge deploy
npm run forge:install     # installs the app into your Jira Cloud dev site
```

### 4. Provision AWS resources

```bash
npm run provision         # calls the provision webtrigger to create S3/DynamoDB/SNS per tenant
```

Then open any Jira issue — the **AWS** panel appears in the right sidebar. Click **Send to AWS** to push the issue summary to all three AWS services.

To clean up:

```bash
npm run deprovision       # calls the deprovision webtrigger to delete AWS resources
```

## Common workflows

| Script | What it does |
|---|---|
| `npm run build` | Compiles TypeScript to `dist/` |
| `npm run check` | Full static check: TypeScript, dotenv, Biome lint, format, and `forge lint` |
| `npm run lint:fix` | Auto-fixes Biome lint and format issues |
| `npm run deploy` | Syncs `.env` to Forge variables and deploys |
| `npm run forge:tunnel` | Starts `forge tunnel` for live log streaming |
| `npm run forge:logs` | Tails recent Forge function logs |
| `npm run provision` | Provisions S3 bucket, DynamoDB table, and SNS topic for the dev site tenant |
| `npm run deprovision` | Deletes previously provisioned AWS resources |

## How it works

```
Jira issue panel (UI Kit)
  └── invoke('sendToAws')
        └── panel resolver (Forge backend)
              ├── GET /rest/api/3/issue/:key?fields=summary  (Forge Jira API)
              └── storeTenantData(cloudId, summary)
                    ├── S3: PutObject → content.txt
                    ├── DynamoDB: PutItem → Content attribute
                    └── SNS: Publish → topic message

Webtrigger (HTTP POST from external provisioning script)
  └── provisionForTenant / deprovisionForTenant
        ├── S3 bucket  (create / delete)
        ├── DynamoDB table  (create / delete)
        └── SNS topic  (create / delete)

App lifecycle trigger (installed / upgraded events)
  └── logs installation metadata
```

AWS credentials are passed to the app as Forge environment variables and read at runtime via `process.env`. No credentials are stored in source.

## Known limitations

This is a demo. Before using this pattern in production, address the following:

**DynamoDB table listing is unbounded.** `ListTablesCommand` is called on every provision/deprovision/store operation with no `Limit` and no pagination. AWS truncates results beyond 100 tables, making the existence check unreliable in accounts with many tables. Fix: use `DescribeTableCommand` directly by table name instead.

**AWS clients initialise at module cold-start.** `DynamoDBClient`, `S3Client`, and `SNSClient` are instantiated at module scope, along with credential validation. This means any Forge function that imports the AWS modules — including the lifecycle handler — will fail at cold-start if AWS environment variables are missing or invalid.

**Webtrigger endpoints are unauthenticated.** The provision and deprovision webtriggers accept any POST request without verifying the caller. Add caller authentication before exposing these in a shared environment.

**S3 object deletion is sequential.** `deleteS3bucket` deletes objects one at a time in a loop. For buckets with many objects, use `DeleteObjectsCommand` to batch-delete up to 1,000 objects per request.

**Classic Jira scope.** The app declares `read:jira-work` (a coarse classic scope). A production app should use the granular scope `read:issue:jira` instead.

## Contributions

Contributions are welcome! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for details.

## License

Copyright (c) 2023-2026 Atlassian US., Inc.
Apache 2.0 licensed, see [LICENSE](LICENSE) file.

[![With ❤️ from Atlassian](https://raw.githubusercontent.com/atlassian-internal/oss-assets/master/banner-with-thanks-light.png)](https://www.atlassian.com)

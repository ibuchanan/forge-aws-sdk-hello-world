# The Atlassian Forge AWS SDK Demo

[![Apache 2.0 license](https://img.shields.io/badge/license-Apache%202.0-blue.svg?style=flat-square)](LICENSE)

This repo is a proof-of-concept Forge app using:

- **Atlassian Forge**. If this is your first Forge app, [try a simple "hello world" app first](https://go.atlassian.com/forge)
- **Native Node.js Runtime** (previously known as "Runtime v2"). [Learn more from the Atlassian documentation](https://go.atlassian.com/runtime)
- Interested in the AWS SDK for JavaScript? [Learn more from the AWS documentation](aws.amazon.com/sdk-for-javascript)
- **TypeScript**. If you aren't familiar with the TypeScript toolchain, it only takes [5 minutes learn learn](https://www.typescriptlang.org/docs/handbook/typescript-tooling-in-5-minutes.html).

Questions? Join the conversation in [the Atlassian developer community](https://community.developer.atlassian.com/c/forge/)

## Exploring the app

The easiest way to get started is to [fork the repo](https://github.com/ibuchanan/forge-aws-sdk-hello-world/fork)
and [spin up a CodeSpace](https://docs.github.com/en/codespaces/overview).
If you haven't already set up a cloud developer site for Jira Cloud,
go to http://go.atlassian.com/cloud-dev
and create a site using the email address associated with your Atlassian account.

The following tasks assume what CodeSpace provides automatically.
If you run locally on your machine,
you may have to tune settings to fit your environment.

### Set environment variables

Copy `.env.example` as `.env`.
Edit `.env` with your credentials for
[Forge](https://developer.atlassian.com/platform/forge/getting-started/#using-environment-variables-to-login) and
[AWS](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-envvars.html#envvars-set).
Comments in the `.env` will cause warnings when linting
so you can remove them from your own copy.

```bash
FORGE_EMAIL=
FORGE_API_TOKEN=
FORGE_DEV_SITE=
AWS_DEFAULT_REGION=
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
```

### Install dependencies

```bash
npm install
```

### Forge app dev loop

For the sake of quick & easy access to the demo,
the Forge CLI is installed as a _local_ dependency
and wrapped with `npm-script` commands.
Run the following with `npm run ...`

<dl>
  <dt><code>first-time</code></dt>
  <dd>Performs <code>forge register</code> and creates a copy of <code>.env</code> if you haven't done so already</dd>
  <dt><code>build</code></dt>
  <dd>Transpiles the Typescript files</dd>
  <dt><code>lint</code></dt>
  <dd>Checks the syntax of the code, including <code>forge lint</code></dd>
  <dt><code>deploy</code></dt>
  <dd>Copies <code>.env</code> variables into the default Forge environment using <code>forge variable set $key $value</code> and deploys using <code>forge deploy</code></dd>
  <dt><code>forge:tunnel</code></dt>
  <dd>Runs <code>forge tunnel</code> so you can read logs locally as the app runs</dd>
  <dt><code>forge:install</code></dt>
  <dd>Runs <code>forge install</code> so you can install the app into your test instance</dd>
  <dt><code>provision</code></dt>
  <dd>Finds the <code>clientId</code> for <code>FORGE_DEV_SITE</code>, reads the webtrigger URL, and makes an HTTP request to the webtrigger URL that will provision AWS resources</dd>
  <dt><code>deprovision</code></dt>
  <dd>Delete previously provisioned AWS resources</dd>
</dl>

## Contributions

Contributions to the Atlassian Forge AWS SDK Demo are welcome!
Please see [CONTRIBUTING.md](CONTRIBUTING.md) for details.

## License

Copyright (c) 2023 Atlassian US., Inc.
Apache 2.0 licensed, see [LICENSE](LICENSE) file.

[![With ❤️ from Atlassian](https://raw.githubusercontent.com/atlassian-internal/oss-assets/master/banner-with-thanks-light.png)](https://www.atlassian.com)

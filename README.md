# The Atlassian Forge AWS SDK Demo

[![Apache 2.0 license](https://img.shields.io/badge/license-Apache%202.0-blue.svg?style=flat-square)](LICENSE)

Example Forge app using native Node.js runtime and AWS SDK for JavaScript

* Just getting started with Atlassian Forge? [Try a simple "hello world" app first](https://go.atlassian.com/forge)
* Interested in the new runtime? [Learn more from the Atlassian documentation](https://go.atlassian.com/runtime)
* Interested in the AWS SDK for JavaScript? [Learn more from the AWS documentation](aws.amazon.com/sdk-for-javascript)
* Questions? Join the conversation in [the Atlassian developer community](https://community.developer.atlassian.com/c/forge/)

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

Edit `.bashrc` to include:

```bash
export FORGE_EMAIL=
export FORGE_API_TOKEN=
export AWS_DEFAULT_REGION=
export AWS_ACCESS_KEY_ID=
export AWS_SECRET_ACCESS_KEY=
```

### Install dependencies

```bash
npm install
```

### Forge app dev loop

For the sake of quick & easy access to the demo,
the Forge CLI is installed as a _local_ dependency
and wrapped with `npm-script` commands.

```bash
npm run forge-register
npm run build
npm run forge-deploy
npm run forge-install
npm run forge-install-list
npm run forge-webtrigger
npm run provision -- ...
```

## Contributions

Contributions to [Project name] are welcome!
Please see [CONTRIBUTING.md](CONTRIBUTING.md) for details. 

## License

Copyright (c) 2023 Atlassian US., Inc.
Apache 2.0 licensed, see [LICENSE](LICENSE) file.

[![With ❤️ from Atlassian](https://raw.githubusercontent.com/atlassian-internal/oss-assets/master/banner-with-thanks-light.png)](https://www.atlassian.com)

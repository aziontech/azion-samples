# Edge Application ChatGPT Plugin

Template Edge Application ChatGPT Plugin on Azion

## Prerequisites

Before use template, ensure that you have the following prerequisites:

- Azion account [visit the sing-up page](https://manager.azion.com/signup/)
- OpenAI Account [visit the sing-up](https://platform.openai.com/signup?launch)
- Consult the [documentation](https://openai.com/blog/chatgpt-plugins) for publishing your plugin


> 1. [Create an Azion account](#Create-an-Azion-account)
> 2. [Azion Personal token](#Azion-Personal-token)
> 3. [Add Secrets Github](#Add-Secrets-Github)
> 4. [Deploy on Azion](#Deploy-on-Azion)
> 5. [Get URL and Install Plugin ](#Get-URL-and-Install-Plugin)


## Create an Azion account

To create an Azion account, just [visit the sing-up page](https://manager.azion.com/signup/) at [Azion's homepage](https://www.azion.com/en/).


### Azion Personal token

Create your Azion personal token by visiting the [Personal Token creating page](https://manager.azion.com/iam/personal-tokens)


### Add Secrets Github

Accessing your secrets [Add Secrets](https://docs.github.com/en/actions/security-guides/encrypted-secrets)

Add the Personal Token to the `secrets`:

```bash
    AZION_PERSONAL_TOKEN=<value>
```

### Deploy on Azion

For automatic deployment, create a pull request to the **main** branch.

#### Routes

- `{your-domain}/.well-known/ai-plugin.json` Plugin config
- `{your-domain}/openapi.json` OpenApi specification
- `{your-domain}/search` Search repositories on Github


### Get URL and Install Plugin

Retrieve your domain url created in Azion and insert it in your plugin installation

Folder config

After deploy access [azion/azion.json](./azion/azion.json)
> This file will be automatically created on your first deploy (pull request to main branch)

Ex:

```json
{
  "application": {
   ...
  },
  "domain": {
  ...
    "url": "123.map.azionedge.net" // your URL to insert plugin manifest Important (https://)
  },
  "function": {
   ...
    "file": "worker/function.js"
  }
}

```

On Actions

Ex:

```bash

✅ edge-computing-actions

Run jcbsfilho/edge-computing-deploy@vx
⚡️ info      Create config file
⚡️ info      Starting Create New Application!
⚡️ info      Edge Application created!
⚡️ info      Edge Function created!
⚡️ info      Edge Domain created!
⚡️ info      Commit configuration 'azion/azion.json'!
⚡️ info      Domain url: https://123445.map.azionedge.net
✔  success   Done!

```

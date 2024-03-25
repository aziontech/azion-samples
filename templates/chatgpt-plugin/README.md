# ChatGPT Plugin template

**ChatGPT Plugin** is a template designed by Azion to enable a quick and simple creation of ChatGPT plugins that run directly on the edge. With this template, you can implement the default setup, which completes a search within the GitHub repositories of a given account, or customize new plugins according to your needs. 

This repository is an example of the new GitHub repository created during the deployment. For a more detailed step-by-step to deploy this template through Azion's platform, check the [How to create a custom plugin with ChatGPT Plugin template](https://www.azion.com/en/documentation/products/guides/chatgpt-plugin/) guide.

---

## Usage information

To use this template, you must [sign in on Azion Console](https://console.azion.com/login).

> If you haven't an account, go to the [signup page](https://console.azion.com/signup) to complete the registration.

To successfully deploy this template, you need to provide the information to configure your Azion application, as requested in the **Settings** tab on the template's page.

For a more detailed step-by-step on using this template and requirements, check the [How to create a custom plugin with ChatGPT Plugin template](https://www.azion.com/en/documentation/products/guides/chatgpt-plugin/) guide.

### Requirements

- Create a [Chat OpenAI account](https://chat.openai.com/).
  - It must be eligible to develop plugins.
- Generate your [GitHub personal token](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens#creating-a-personal-access-token-classic).
- Enable [Edge Functions](https://www.azion.com/en/documentation/products/guides/billing-and-subscriptions/) in your Azion account.

---

## Customizing the plugin

The default setup of this template completes a search within the GitHub repositories of a given account. If you want to maintain this configuration, skip to the [Registering your plugin](#registering-your-plugin) section.

To customize your plugin with another use case, you'll need to do it through the new GitHub repository created during the deployment.

To customize your ChatGPT plugin, proceed as follows:

1. Access your **ChatGPT Plugin** repository on GitHub.
2. In the **function** folder, open the **index.ts** file and add your API routes for the plugin. It must looks similar to this:

```ts
{your-domain}/well-known/api-plugin.json // your plugin configuration.
{your-domain}/openapi.json // your OpenApi specification.
{your-domain}/search // to search repositories on GitHub.
```

3. In the **schemas** folder, change the **openapi.json** file with the new schema of your API. Follow this example:

```json
  "components": {
    "schemas": {
      "getAllReposResponse": {
        "type": "object",
        "properties": {
          "name": {
            "type": "string"
          },
          "description": {
            "type": "string"
          },
          "url": {
            "type": "string"
          },
          "stars": {
            "type": "string"
          }
        }
      }
    }
  }
```

4. Still in the **schemas** folder, change your plugin data in the **api-plugin.json** file. It must looks similar to this:

```json
{
  "schema_version": "v1",
  "name_for_human": "GitHub Repositories Search",
  "name_for_model": "github_repositories_search",
  "description_for_human": "GitHub Repositories Search plugin for ChatGPT.",
  "description_for_model": "GitHub Repositories Search plugin for ChatGPT.",
  "auth": {
    "type": "none"
  },
  "api": {
    "type": "openapi",
    "url": "/openapi.json"
  },
  "logo_url": "http://www.example.com/static/images/logo/my-logo-600x600.png",
  "contact_email": "support@example.com",
  "legal_info_url": "http://www.example.com/legal"
}
```

5. Add your **Azion personal token** to the repository's *Secrets*. Read more about [getting an Azion personal token](https://www.azion.com/en/documentation/products/guides/personal-tokens/).
  - Do it following this format: `AZION_PERSONAL_TOKEN=<value>`

6. Create a pull request for the main branch to implement the changes.

This template also includes an automation for [continuous deployment](#continuous-deployment) in the **github/workflows/main.yml** file.

---

## Registering your plugin

The last step is registering your plugin on the *ChatGPT Plugin Store*.

To do so:

1. Log in to [ChatGPT User Interface](https://chat.openai.com/).
2. In the Plugin Store, select the **Develop your own plugin** option to register your new plugin.
3. Complete the information in the registration step.

Done. Your plugin is now ready for use.

**Important**: your OpenAI account must be eligible to develop plugins to register a new one.

---

## Continuous deployment

Once the template is deployed, you can edit and update your args and code, as well as implement a continuous deployment workflow. However, you'll need first to *declare secrets on your project's GitHub repository* to complete the second build with the changes. When the second build is completed, you'll be able to manage your project with a continuous deployment workflow and edit the args as desired.

To do so, open your **ChatGPT Plugin** repository in GitHub. Then, go to **Settings** > **Secrets and variables** > **Action** to [add your variables](https://docs.github.com/en/actions/security-guides/encrypted-secrets), following these instructions:

1. Add the Azion Personal Token to the *secrets*:
- Read [how to generate an Azion Personal Token](https://www.azion.com/en/documentation/products/guides/personal-tokens/) in the documentation.

```bash
    AZION_PERSONAL_TOKEN=<value>
```

2. Add the environments for use in the action workflow in the **main.yml** file, included in the **.github/workflows** folder of your repository:

```yml
  - name: edge-...
    id: azion_edge
    ...
    with:
        ....
        azionPersonalToken: ${{ secrets.AZION_PERSONAL_TOKEN }}
        ....

```

3. Access the file **azion/azion.json** to add the ChatGPT Plugin details. This file will be automatically created on your first deploy.

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

4. Open a pull request to merge the changes to the main branch and start the automatic deployment.

Now, your project is ready to work with a continuous deployment workflow, updating instantly any changes in the application or the repository. 

---

## Management

Considering that this initial setup may not be optimal for your specific edge application, all settings can be customized any time you need by using [Azion Console)](https://console.azion.com/).

To manage and edit your edge application’s settings, read the documentation about [managing edge applications](https://www.azion.com/en/documentation/products/edge-application/first-steps/) for more details.

### Custom domain

The edge application created during the deployment has an assigned Azion domain to make it accessible through the browser. The domain has the following format: `xxxxxxxxxx.map.azionedge.net`. However, you can add a custom domain for users to access your edge application through it. Go to the [Domains](https://www.azion.com/en/documentation/products/guides/configure-a-domain/) documentation to read more about it.

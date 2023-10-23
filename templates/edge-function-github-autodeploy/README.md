# Edge Function Github AutoDeploy

Azion **Edge Function GitHub AutoDeploy** simplifies the deployment of edge functions integrated with Github Actions directly on the edge of the network.

By using this template, you only need to code your edge function, and the deployment is done through GitHub Actions. It accelerates your workflow and guarantees a continuous deployment to keep your project up to date.

This repository is an example of the new GitHub repository created during the deployment. For a more detailed step-by-step to deploy this template via Azion Real-Time Manager (RTM), check the [How to deploy edge functions with Edge Function GitHub AutoDeploy](https://www.azion.com/en/documentation/products/guides/edge-function-github-autodeploy/) guide.

---

## Usage information

To start using this template, you need to: 

1. Access [Real-Time Manager (RTM)](https://manager.azion.com/).
- If you don’t have an account yet, create a new one [by visiting the sign-up page](https://manager.azion.com/signup/).
2. On the homepage, select the **Start with a template** option.
3. Find the **Edge Function GitHub AutoDeploy** card and select it.
4. Click the **Settings** tab to configure the template. 

### Settings

To successfully deploy this template, you must provide the information to configure your application. Fields identified with an asterisk are mandatory.

- **Application Name** *: the name of your edge application. It's used to identify and manage your application within Azion's platform.
  - Use a unique and easy-to-remember name. If the name has already been used, the platform returns an error message.
- **GitHub Personal Token** *: your GitHub personal token.

While generating your GitHub personal token, grant that your **scope** has the permissions to authorize an OAuth app or a personal token to access public and private repositories, including read and write access to code. You must also enable the **workflow** option to add and update GitHub Actions workflow files.

Note that permissions can be scoped either to a user or an organization or to a repository. Read the [Creating a personal access token documentation](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens#creating-a-personal-access-token-classic) for more information.

After completing all the information, click the **Next** button, located in the bottom-right corner. This will start the deployment process.

For a more detailed step-by-step on declaring your secrets and using this template, check the [How to deploy edge functions with Edge Function GitHub AutoDeploy](https://www.azion.com/en/documentation/products/guides/edge-function-github-autodeploy/) guide.

### Important

To guarantee the optimal performance of this template, you must activate the following Azion product:

[Edge Functions](https://www.azion.com/en/documentation/products/edge-application/edge-functions/)

You need to activate this product separately via Real-Time Manager (RTM). Review the [Azion documentation](https://www.azion.com/en/documentation/products/guides/edge-function-github-autodeploy/) to do so. If this product is activated, the execution of this template could generate usage-related costs. Check the [pricing page](https://www.azion.com/en/pricing/) for more information. 

---

## Continuous deployment

Once the template is deployed, you can also edit and update your args and code, as well as implement a continuous deployment workflow. However, you'll need first to declare secrets on your project's GitHub repository to complete the second build with the changes. When the second build is completed, you'll be able to manage your project with a continuous deployment workflow and edit the args as desired.

To do so, open your new **Edge Function GitHub AutoDeploy** repository on GitHub. Then, go to **Settings** > **Secrets and variables** > **Action** to [add your variables](https://docs.github.com/en/actions/security-guides/encrypted-secrets), following these instructions:

1. Add the Azion personal token to the *secrets*:
- Read [how to generate an Azion personal token](https://www.azion.com/en/documentation/products/accounts/personal-tokens/) in the documentation.

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

3. Open a pull request to merge the changes to the main branch and start the automatic deployment.

Now, your project is ready to work with a continuous deployment workflow, updating instantly any changes in the application or the repository. 

### Adding a custom domain

The new edge application has an assigned Azion domain to make it accessible through the browser, with the following format: `xxxxxxxxxx.map.azionedge.net`. However, you can add a custom domain for users to access your edge application through it.

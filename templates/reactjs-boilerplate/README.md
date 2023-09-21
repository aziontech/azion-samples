# React Boilerplate

The Azion React Boilerplate is designed to simplify and enhance the deployment process for React.js applications directly on the edge of the network.

This repository is an example of the new GitHub repository created during the deployment. For a more detailed step-by-step to deploy this template via Azion Real-Time Manager (RTM), check the [How to deploy edge applications with the React Boilerplate](https://www.azion.com/en/documentation/products/guides/react-boilerplate/) guide.

This template uses React version 18.2.0.

## Usage Information

To start using this template, you need to: 

1. Access [Azion Real-Time Manager (RTM)](https://manager.azion.com/).
  - If you don’t have an account yet, create a new one [by visiting the sign-up page](https://manager.azion.com/signup/).
2. On the homepage, select the **Start with a template** option.
3. Find the **React boilerplate** card and select it.
4. Click the **Settings tab** to configure the template.

## Settings

To successfully deploy this template, you must provide the information to configure your Azion application and others. Fields identified with an asterisk are mandatory.

  * **Application Name***: the name of your edge application on Azion.
  * **GitHub Personal Token***: your GitHub personal token.
    * GitHub tokens are linked with the scope of the accounts and, in the case of corporate accounts, organization owners can restrict access. While generating your personal token, consider your scope and the level of access (classic or fine-grain) you're providing. Read the [Creating a personal access token](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens#creating-a-personal-access-token-classic) documentation for more information.

After filling out the form, click the **Next** button to start the deployment process.

Once the template is deployed, you can edit and update your args and code. However, you'll need to declare secrets on your project's GitHub repository first to complete the second build with these changes. When the second build is completed, you can manage your project with a continuous deployment workflow.

For a more detailed step-by-step on declaring your secrets and using this template, check the [How to deploy edge applications with the React Boilerplate](https://www.azion.com/en/documentation/products/guides/react-boilerplate/) guide for more details.

## Important

To guarantee the optimal performance of this template, it's necessary to activate the following Azion products:

* [Edge Functions](https://www.azion.com/en/documentation/products/edge-application/edge-functions/#edge-functions-management)

You need to activate the products separately via RTM. Review the [Azion documentation](https://www.azion.com/en/documentation/products/guides/react-boilerplate/) to do so.

If these products are activated, the execution of this template could generate usage-related costs. Check the [pricing page](https://www.azion.com/en/pricing/) for more information. 


## Continuous deployment

Once the template is deployed, you can edit and update your args and code, as well as implement a continuous deployment workflow. However, you'll need first to *declare secrets on your project's GitHub repository* to complete the second build with the changes. When the second build is completed, you'll be able to manage your project with a continuous deployment workflow and edit the args as desired.

To do so, open your repository in GitHub. Then, go to **Settings** > **Secrets and variables** > **Action** to [add your variables](https://docs.github.com/en/actions/security-guides/encrypted-secrets), following these instructions:

1. Add the Azion Personal Token to the *secrets*:
- Read [how to generate an Azion Personal Token](/en/documentation/products/accounts/personal-tokens/) in the documentation.

```bash
    AZION_PERSONAL_TOKEN=<value>
```

Environments for use in the action workflow:

```yml
  - name: edge-...
    id: azion_edge
    ...
    with:
        ....
        azionPersonalToken: ${{ secrets.AZION_PERSONAL_TOKEN }}
        ....

```

2. Open a pull request to merge the changes to the main branch and start the automatic deployment.

Now your project is ready to work with a continuous deployment workflow, updating instantly any changes in the application or the repository. 

### Adding a custom domain

The edge application created during the deployment has an assigned Azion domain to make it accessible through the browser. The domain has the following format: `xxxxxxxxxx.map.azionedge.net`. However, you can add a custom domain for users to access your edge application through it.
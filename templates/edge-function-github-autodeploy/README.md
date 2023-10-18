# Edge Function Github AutoDeploy

The **Edge Function Github AutoDeploy** template is an automation designed to deploy a database directly on the edge while enabling the configuration of custom messages that will be delivered according to the user's geographical location.

This repository is an example of the new GitHub repository created during the deployment. For a more detailed step-by-step to deploy this template via Azion Real-Time Manager (RTM), check the [How to use the Edge Function Github AutoDeploy EdgeDeploy template through Azion](https://www.azion.com/en/documentation/products/guides/edge-function-github-autodeploy/) guide.

---

## Requirements

Before using this template, you need to:

1. Generate your GitHub personal token.
* While generating your personal token, grant that your scope has the permissions to authorize an OAuth app or a personal token to access to public and private repositories, including read and write access to code.You must also enable the workflow option to allow adding and updating GitHub Actions workflow files.

Note that permissions can be scoped either to a user or an organization or to a repository. Read the [Creating a personal access token](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens#creating-a-personal-access-token-classic) documentation for more information.

---

## Usage information

To start using the **Edge Function Github AutoDeploy** template, proceed as follows:

1. Access [Real-Time Manager (RTM)](https://manager.azion.com/).
- If you don’t have an account yet, create a new one [by visiting the sign-up page](https://manager.azion.com/signup/).
2. On the homepage, select the **Start with a template** option.
3. Find the Edge Function Github AutoDeploy card and select it.
4. Click the **Settings** tab to open the configuration section.

---

## Settings

In the configuration form, you must provide the information to configure your Azion application. Fill in the presented fields. 

Fields identified with an asterisk are mandatory.

- **Application Name** *: the name of your edge application. It's used to identify and manage your application within Azion's platform.
  - Use a unique and easy-to-remember name. If the name has already been used, the platform returns an error message.
- **GitHub Personal Token** *: your GitHub personal token.

After completing all the information, click the **Next** button, located in the bottom-right corner. This will start the deployment process.

Edge Function Github AutoDeploy creates a new Azion edge application and its domain. It also creates an edge function to provide the arguments for the geolocation, and a new repository in your GitHub account based on a [public template](https://github.com/aziontech/azion-samples/tree/dev/templates/edge-function-github-autodeploy).

 In this template we are using the library [date-fns](https://www.npmjs.com/package/date-fns) to check based on the date if today is Friday.

---

##Important

To guarantee the optimal performance of this template, it's necessary to activate the following Azion product:

* [Edge Functions](https://www.azion.com/en/documentation/products/edge-application/edge-functions/)

You must activate this product separately via RTM. To do so, review the [Azion documentation](https://www.azion.com/en/documentation/products/guides/chatgpt-plugin/).

If this product is activated, the execution of this template could generate usage-related costs. Check the [pricing page](https://www.azion.com/en/pricing/) for more information.
 

---

### Continuous deployment

Once the template is deployed, you can edit and update your args and code in the edge function, as well as implement a continuous deployment workflow. However, you'll need first to *declare secrets on your project's GitHub repository* to complete the second build with the changes. When the second build is finished, you'll be able to manage your project with a continuous deployment workflow and edit the args as desired.

To do so, open your **Edge Function Github AutoDeploy EdgeDeploy** repository on GitHub. Then, go to **Settings** > **Secrets and variables** > **Action to add your variables**, following these instructions:

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

Now your project is ready to work with a continuous deployment workflow, updating instantly any changes in the application or the repository. 

### Custom domain

The edge application created during the deployment has an assigned Azion domain to make it accessible through the browser. The domain has the following format: `xxxxxxxxxx.map.azionedge.net`. However, you can add a custom domain for users to access your edge application through it. Go to the [Domains](https://www.azion.com/en/documentation/products/edge-application/domains/) documentation to read more about it.

# Edge Function Github AutoDeploy

Azion **Edge Function GitHub AutoDeploy** is a template that allows you to deploy edge functions integrated with Github Actions directly on the edge of the network.

By using this template, you just need to create your edge function with an edge application, and the continuous deployment is done through GitHub Actions. It accelerates your workflows and guarantees keeping your project up to date.

---

## Getting the template

To start using the **Edge Function GitHub AutoDeploy** template, proceed as follows:

1. Access [Real-Time Manager (RTM)](https://manager.azion.com/).
- If you don’t have an account yet, create a new one [by visiting the sign-up page](https://manager.azion.com/signup/).
2. On the homepage, select the **Start with a template** option.
3. Find the **Edge Function GitHub AutoDeploy** card and select it.
4. Click the **Settings** tab to open the configuration form. 

---

## Setting up the template

In the configuration form, you must provide the information to configure your new application, which will include the edge function. Fill in the presented fields. 

Fields identified with an asterisk are mandatory.

- **Application Name** *: the name of your edge application. It's used to identify and manage your application within Azion's platform.
  - Use a unique and easy-to-remember name. If the name has already been used, the platform returns an error message.
- **GitHub Personal Token** *: your GitHub personal token.

While generating your GitHub personal token, grant your **scope** with permissions to authorize an OAuth app or a personal token to access public and private repositories, including read and write access to code. You must also enable the **workflow** option to allow adding and updating GitHub Actions workflow files. 

Note that permissions can be scoped either to a user or an organization or to a repository. Read the [Creating a personal access token documentation](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens#creating-a-personal-access-token-classic) for more information.

After completing all the information, click the **Next** button, located in the bottom-right corner. This will start the deployment process.

---

## Deploying the template

You'll be able to follow the deployment process through a window showing off the logs. When it's complete, the *deployment* page appears, confirming the edge application has been successfully created.

This page shows you the following sections:

   - **Access your Edge Application** section includes the link to visit and explore your edge application.
   - **Build Summary** contains the application's name and function.
   - The **Deployment details** tab can be opened to access the logs related to the deployment.
   - **What do you want to do next?** provides recommendations regarding advanced options to enhance your edge application: **Customize Domain**, **Manage Edge Application**, **View Edge Application Metrics**, **View Edge Application Logs**, and the **Back to Home** button.

The link to the edge application allows you to see it on the browser. However, ​​it takes a certain time to propagate and configure the application in Azion’s edge locations. It may be necessary to wait a few minutes for the URL to be activated and for the application page to be effectively displayed in the browser.

### Key configurations

The application undergoes an optimized build process, emphasizing optimal performance and efficiency, employing **Azion Edge Platform** resources.

Afeter the deployment, it creates a [GitHub repository](https://github.com/aziontech/azion-samples/tree/dev/templates/edge-function-github-autodeploy) to manage the source code and then it installs all required dependencies and multiple configurations to set up the edge application, the domain to host your project, and an edge function for custom logic.

The script also commits deployment details to the user's GitHub repository, including information related to the version deployed and the timestamp of the deployment.

If you want to know more on how to edit and customize your project's settings, go to the [Managing the template](#managing-the-template) section.

Additionally, to guarantee the optimal performance of this template, you must activate the following Azion product:

[Edge Functions](https://www.azion.com/en/documentation/products/edge-application/edge-functions/)

You must activate this product separately via RTM. To do so:

1. [Access RTM](https://manager.azion.com/).
2. On the upper-left corner, select the three horizontal lines to open the **Products menu**.
3. In the **BUILD** section, select **Edge Application**.
4. You'll be redirected to the **Edge Application** page.
- It lists all the edge applications you've created. 
5. Find the edge application related to your template and select it. 
6. In the **Main Settings** tab, find the **Edge Application Modules** section and active the switch for **Edge Functions**.

If this product is activated, the execution of this template could generate usage-related costs. Check the [pricing page](https://www.azion.com/en/pricing/) for more information. 

---

## Managing the template

To manage and edit your edge application's settings via Real-Time Manager (RTM), follow these steps:

1. [Access RTM](https://manager.azion.com/).
2. On the upper-left corner, select the three horizontal lines to open the **Products menu**.
3. In the **BUILD** section, select **Edge Application**.
4. You'll be redirected to the **Edge Application** page.
- It lists all the edge applications you've created. 
5. Find the edge application related to the **Edge Function GitHub AutoDeploy** template and select it. 
- The list is organized alphabetically. You can also use the **search bar** located in the upper-left corner of the list; currently, it filters only by **Application Name**.

After selecting the edge application you’ll work on, you’ll be directed to a page containing all the settings you can configure.

Read the documentation about [managing edge applications](https://www.azion.com/en/documentation/products/edge-application/first-steps/) for more details.

### Continuous deployment

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
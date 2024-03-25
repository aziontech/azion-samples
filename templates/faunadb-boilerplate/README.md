# Fauna DB Boilerplate

The **Fauna DB Boilerplate** template is an automation designed to deploy a database directly on the edge while enabling the configuration of creating, retrieving, updating, and deleting items in a Fauna DB collection called `Posts`.

This repository is an example of the new GitHub repository created during the deployment. For a more detailed step-by-step to deploy this template through Azion's platform, check the [How to use the Fauna DB Boilerplate template through Azion](https://www.azion.com/en/documentation/products/guides/faunadb-boilerplate/) guide.

---

## Usage information

To use this template, you must [sign in on Azion Console](https://console.azion.com/login).

> If you haven't created an account, go to the [signup page](https://console.azion.com/signup) to complete the registration.

To successfully deploy this template, you need to provide the information to configure your Azion application, as requested in the **Settings** tab on the template's page.

For a more detailed step-by-step on using this template and requirements, check the [How to use the Fauna DB Boilerplate template through Azion](https://www.azion.com/en/documentation/products/guides/faunadb-boilerplate/) guide.

### Requirements

- Create a [Fauna account](https://dashboard.fauna.com/register).
- Create a database in the [Fauna Dashboard](https://docs.fauna.com/fauna/current/get_started/dashboard) and populate it with `demo data`, selecting this option while creating.
- Create a new [collection](https://docs.fauna.com/fauna/current/cookbook/data_model/collections) named `Posts` within your database to use with this template.
- Generate a [Fauna secret key](https://docs.fauna.com/fauna/v4/security/keys?lang=shell) for your database.
- Generate your [GitHub personal token](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens#creating-a-personal-access-token-classic).
- Enable [Edge Functions and Application Accelerator](https://www.azion.com/en/documentation/products/guides/billing-and-subscriptions/) in your Azion account.

---

## Continuous deployment

Once the template is deployed, you can edit and update your args and code in the edge function, as well as implement a continuous deployment workflow. However, you'll need first to *declare secrets on your project's GitHub repository* to complete the second build with the changes. When the second build is finished, you'll be able to manage your project with a continuous deployment workflow and edit the args as desired.

To do so, open your **Fauna DB Boilerplate EdgeDeploy** repository on GitHub. Then, go to **Settings** > **Secrets and variables** > **Action to add your variables**, following these instructions:

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

3. Add the Redis Database access credentials to the *secrets*, being:

- **FAUNA_SECRET**: the key to access your Fauna DB database using REST.
  - In the Databases list on the Home page, select your database. This takes you to the Explorer page with your database highlighted.
  - Hover over the database name to reveal the Keys icon. Click the key icon.
  - In the Keys dialog, click CREATE KEY.
  - The Database name is already populated. Choose Admin or Server Role and enter an optional Key Name.
  - Click the SAVE button.
  - Copy the KEY’S SECRET and paste on `FAUNA_SECRET`


```bash
    FAUNA_SECRET=<value>
```

4. Add the environments for use in the action workflow in the **main.yml** file, included in the **.github/workflows** folder of your repository:

```yml
 - name: Create args file
    run: |
        ...
        "FAUNA_SECRET": "${{ secrets.FAUNA_SECRET }}",
        ...
```

5. Open a pull request to merge the changes to the main branch and start the automatic deployment.

Now your project is ready to work with a continuous deployment workflow, updating instantly any changes in the application or the repository. 

--- 

## Management

Considering that this initial setup may not be optimal for your specific edge application, all settings can be customized any time you need by using [Azion Console)](https://console.azion.com/).

To manage and edit your edge application’s settings, read the documentation about [managing edge applications](https://www.azion.com/en/documentation/products/edge-application/first-steps/) for more details.

### Custom domain

The edge application created during the deployment has an assigned Azion domain to make it accessible through the browser. The domain has the following format: `xxxxxxxxxx.map.azionedge.net`. However, you can add a custom domain for users to access your edge application through it. Go to the [Domains](https://www.azion.com/en/documentation/products/guides/configure-a-domain/) documentation to read more about it.

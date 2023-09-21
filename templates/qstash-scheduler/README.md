# How to use the QStash Scheduler template through Azion

The QStash EdgeFunction Scheduler template is designed to set up and manage a custom edge function, which receives a user-configured schedule and dispatches it through QStash, a message queue and task scheduler for serverless runtimes.

## Requirements

Before using this template, you need to:

1. Create an Upstash account.
2.  In the Upstash Console, get your Current Signing Key, Next Signing Key, and QStash Token within the QStash tab.
3. Generate your GitHub personal token.

While generating your GitHub personal token, grant that your scope has the permissions to authorize an OAuth app or a personal token to access to public and private repositories, including read and write access to code.You must also enable the workflow option to allow adding and updating GitHub Actions workflow files. Note that permissions can be scoped either to a user or an organization or to a repository. Read the Creating a personal access token documentation for more information.


## Getting the template

To start using the **QStash EdgeFunction Scheduler** template, proceed as follows:

1. Access [Real-Time Manager (RTM)](https://manager.azion.com/).
- If you don’t have an account yet, create a new one [by visiting the sign-up page](https://manager.azion.com/signup/).
2. On the homepage, select the **Start with a template** option.
3. Find the **QStash Scheduler** card and select it.
4. Click the **Settings** tab to open the configuration section. 



## Setting up the template

In the configuration form, you must provide the information to configure your Azion application. Fill in the presented fields. 

Fields identified with an asterisk are mandatory.


- **Application Name** *: the name of your edge application. It's used to identify and manage your application within Azion's platform.
  - Use a unique and easy-to-remember name. If the name has already been used, the platform returns an error message.
- **QStash Current Signing Key** *: a string to sign all messages sent to the destination.
    - Go to your Upstash Console and copy the `QSTASH_CURRENT_SIGNING_KEY`.
- **QStash Next Signing Key** *:  a string used to sign messages after you have rotated your signing keys.
  - Go to your Upstash Console and copy the `QSTASH_NEXT_SIGNING_KEY`.
- **GitHub Personal Token** *: your GitHub personal token.

After completing all the information, click the **Next** button, located in the bottom-right corner. This will start the deployment process.

Copy and save the domain of your application provided in this stage. You'll need it to [configuring your scheduled tasks](configuring-your-scheduled-tasks) later. If you want to use your own domain, review the [adding a custom domain](#adding-a-custom-domain) section.

## Deploying the template

During the deployment, you'll be able to follow the process through a window showing off the logs. When it's complete, the *deployment* page appears, confirming the edge application for your project has been successfully created.

This page shows you the following sections:

   - **Access your Edge Application** section includes the link to visit and explore your edge application.
   - **Build Summary** contains the application's name and function.
   - The **Deployment details** tab can be opened to access the logs related to the deployment. 
   - **What do you want to do next?** provides recommendations regarding advanced options to enhance your edge application: **Customize Domain**, **Manage Edge Application**, **View Edge Application Metrics**, **View Edge Application Logs**, and the **Back to Home** button.

By clicking the link of the edge application, you can view how it looks on the browser. However, ​​it takes a certain time to propagate and configure the application in Azion’s edge locations. It may be necessary to wait a few minutes for the URL to be activated and for the application page to be effectively displayed in the browser.

## Key configurations

When deployed, this template creates an edge function built with the arguments provided by the user. It also creates a new GitHub repository that includes an automation to enable continuous deployment. Additionally, the template creates and instantiates an edge application and its custom domain to ease the interaction with the edge function.


To guarantee the optimal performance of this template, the following Azion products must be activated in your account:

[Edge Functions](https://www.azion.com/en/documentation/products/edge-application/edge-functions/)

You must activate these products separately via RTM. To do so:

1. [Access RTM](https://manager.azion.com/).
2. On the upper-left corner, select the three horizontal lines to open the **Products menu**.
3. In the **BUILD** section, select **Edge Application**.
4. You'll be redirected to the **Edge Application** page.
- It lists all the edge applications you've created. 
5. Find the edge application related to your template and select it. 
6. In the **Main Settings** tab, find the **Edge Application Modules** section and active the switch for the product you want to enable.

If these products are activated, the execution of this template could generate usage-related costs. Check the pricing page for more information.

Any cost generated by Qstash usage will be processed and billed separately on the Upstash platform. Visit the QStash documentation for more details. 

### Scheduling tasks
After the deployment is finished and propagated, you're able to start scheduling tasks.

The tasks must be scheduled in any format that can be transmitted in the HTTP request. For example: json, xml, binary. The examples below are using JSON.


To do so, you have two options:

### Via terminal

1. Get your application domain.
2. In the Upstash Console, copy the `QSTASH_TOKEN` within the QStash tab.
3. In your development environment, open the terminal.
4. Make an HTTP POST request to the specified URL to schedule your messages.

Use the following exemples for your request, according to the interval required:


#### Once

```bash
curl --request POST "https://qstash.upstash.io/v1/publish/{add your domain here}" \
     -H "Authorization: Bearer { change here token rest}" \
     -H "Content-Type: application/json" \
     -d "{ \"hello\": \"world\"}"
```
#### Every Minute

```bash
curl --request POST "https://qstash.upstash.io/v1/publish/{add your domain here}" \
     -H "Authorization: Bearer {add your QStash token here}" \
     -H "Content-Type: application/json" \
     -H "Upstash-Cron: * * * * *" \
     -d "{ \"hello\": \"world\"}"
```
#### Every 10 Minutes

```bash
curl --request POST "https://qstash.upstash.io/v1/publish/{add your domain here}" \
     -H "Authorization: Bearer {add your QStash token here}" \
     -H "Content-Type: application/json" \
     -H "Upstash-Cron: */10 * * * *" \
     -d "{ \"hello\": \"world\"}"
```
#### Every Hour

```bash
curl --request POST "https://qstash.upstash.io/v1/publish/{add your domain here}" \
     -H "Authorization: Bearer {add your QStash token here}" \
     -H "Content-Type: application/json" \
     -H "Upstash-Cron: 0 * * * *" \
     -d "{ \"hello\": \"world\"}"
```

Done. Your task is scheduled and will be executed according to the defined scheduling. Your scheduled tasks are visible in the Upstash Console, within the QStash tab, for your review and monitoring.

### Via Upstash console

1. Copy your Azion application domain.
2. Go to the [Upstash Console](https://console.upstash.com/qstash) and open the **QStash** tab.
3. Complete the form with the requested information.
4. In the type field, select **Scheduled** and choose the delay. 
5. Alternatively, select Once to send an immediate and unique message.
6. Click the **Schedule** button.

Done. Your task is scheduled and visible in the **Scheduled Jobs** section for your review and monitoring.


You can also publish them using REST API. For more information, read the QStash documentation.

## Managing the template

Considering that this initial setup may not be optimal for your specific edge application, all settings can be customized any time you need by using Azion Real-Time Manager (RTM). Once the template is deployed, you also have full control over customizing your Upstash account and QStash configurations.

To manage and edit your edge application's settings, follow these steps:

## Access RTM.

On the upper-left corner, select the three horizontal lines to open the **Products menu**.
In the **BUILD** section, select **Edge Application**.
You'll be redirected to the **Edge Application** page.
It lists all the edge applications you've created. 
Find the edge application relate to the Qstash Scheduler template and select it. 
  The list is organized alphabetically. You can also use the **search bar** located in the upper-left corner of the list; currently, it filters only by **Application Name**.

After selecting the edge application you’ll work on, you’ll be directed to a page containing all the settings you can configure.

Read the documentation about managing edge applications for more details. For specific Upstash or QStash-related questions, check the Upstash documentation.


### Continuous deployment

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

2. Add the Upstash Signing Keys to the *secrets*, being:

- **QSTASH_CURRENT_SIGNING_KEY**: a string to sign all messages sent to the destination.
- Go to your Upstash Console and copy the `QSTASH_CURRENT_SIGNING_KEY` in the QStash tab.
- **QSTASH_NEXT_SIGNING_KEY**: a string used to sign messages after you have rotated your signing keys.
- Go to your Upstash Console and copy the `QSTASH_NEXT_SIGNING_KEY` in the QStash tab.

```bash
QSTASH_CURRENT_SIGNING_KEY=<value>
QSTASH_NEXT_SIGNING_KEY=<value>
```

Environments for use in the action workflow:

```yml
 - name: Create args file
    run: |
        ...
       "QSTASH_CURRENT_SIGNING_KEY": "${{ secrets.QSTASH_CURRENT_SIGNING_KEY }}",
        "QSTASH_NEXT_SIGNING_KEY": "${{ secrets.QSTASH_NEXT_SIGNING_KEY }}"
        ...
```
3. Open a pull request to merge the changes to the main branch and start the automatic deployment.

Now your project is ready to work with a continuous deployment workflow, updating instantly any changes in the application or the repository. 

### Adding a custom domain

The edge application created during the deployment has an assigned Azion domain to make it accessible through the browser. The domain has the following format: `xxxxxxxxxx.map.azionedge.net`. However, you can add a custom domain for users to access your edge application through it.


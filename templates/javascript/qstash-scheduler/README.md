# QStash EdgeFunction Scheduler

The **QStash EdgeFunction Scheduler** template is designed to set up and manage a custom edge function, which receives a user-configured schedule and dispatches it through [QStash](https://upstash.com/docs/qstash/overall/getstarted, a message queue and task scheduler for serverless runtimes.

This repository is an example of the new GitHub repository created during the deployment. For a more detailed step-by-step to deploy this template via Azion Real-Time Manager (RTM), check the [How to use the QStash EdgeFunction Scheduler template through Azion](https://www.azion.com/en/documentation/products/guides/qstash-edge-function-scheduler/) guide.

---

##  Deploy Your Own

Deploy your own QStash project with Azion.

[![Deploy Button](/static/button.png)](https://console.azion.com/create/upstash/qstash-edgefunction-scheduler "Deploy with Azion")

---

## Usage information

To use this template, you must [sign in on Azion Console](https://console.azion.com/login).

> If you haven't created an account, go to the [signup page](https://console.azion.com/signup) to complete the registration.

To successfully deploy this template, you need to provide the information to configure your Azion application, as requested in the **Settings** tab on the template's page.

For a more detailed step-by-step on using this template and requirements, check the [How to use the QStash EdgeFunction Scheduler template through Azion](https://www.azion.com/en/documentation/products/guides/qstash-edge-function-scheduler/) guide.

### Requirements

Before using this template, you need to:

1. Create an [Upstash account](https://console.upstash.com/login).
2. In the [Upstash Console](https://console.upstash.com/qstash), get your **Current Signing Key**, **Next Signing Key**, and **QStash Token** within the **QStash** tab.
3. Generate your [GitHub personal token](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens#creating-a-personal-access-token-classic).
4. Enable [Edge Functions](https://www.azion.com/en/documentation/products/guides/billing-and-subscriptions/) in your Azion account.

---

## Scheduling tasks

After the deployment is finished and propagated, you're able to start scheduling tasks. The tasks must be scheduled in any format that can be transmitted in the HTTP request. For example: json, xml, binary. The examples below are using JSON.

To do so, you have two options:

### Via terminal

1. Get your application domain.
2. In the Upstash Console, copy the `QSTASH_TOKEN` within the QStash tab.
3. In your development environment, open the terminal.
4. Make an HTTP POST request to the specified URL to schedule your messages.

Use the following exemples for your request, according to the interval required:

### Via terminal

1. Get your application domain.
2. In the [Upstash Console](https://console.upstash.com/qstash), copy the `QSTASH_TOKEN` from the **QStash** tab.
3. In your development environment, open the terminal.
4. Make an HTTP POST request to the specified URL to schedule your messages.

Use the following exemples for your request, according to the interval required:

#### Once

```bash
curl --request POST "https://qstash.upstash.io/v1/publish/{add your domain here}" \
     -H "Authorization: Bearer {add your QStash token here}" \
     -H "Content-Type: application/json" \
     -d "{ \"hello\": \"world\"}"
```

#### Every minute

```bash
curl --request POST "https://qstash.upstash.io/v1/publish/{add your domain here}" \
     -H "Authorization: Bearer {add your QStash token here}" \
     -H "Content-Type: application/json" \
     -H "Upstash-Cron: * * * * *" \
     -d "{ \"hello\": \"world\"}"
```

#### Every 10 minutes

```bash
curl --request POST "https://qstash.upstash.io/v1/publish/{add your domain here}" \
     -H "Authorization: Bearer {add your QStash token here}" \
     -H "Content-Type: application/json" \
     -H "Upstash-Cron: */10 * * * *" \
     -d "{ \"hello\": \"world\"}"
```

#### Every hour

```bash
curl --request POST "https://qstash.upstash.io/v1/publish/{add your domain here}" \
     -H "Authorization: Bearer {add your QStash token here}" \
     -H "Content-Type: application/json" \
     -H "Upstash-Cron: 0 * * * *" \
     -d "{ \"hello\": \"world\"}"
```

Where:

| Flag | Description |
|---|---|
| `--request POST` | Specifies the method of request sent. In this case, a HTTP POST method to post or schedule a HTTP message. |
| `-H "Authorization"` | Provides authorization information through a token for authentication. You must add your QStash token here. |
| `-H "Content-Type"` | Specifies the content type of the request body. In this case, JSON format. |
| `-H "Upstash-Cron"` | Schedules a cron-like job in Upstash, allowing you to automate tasks at specific intervals. |
| `-d` | Provides the data for the request body, including the JSON payload. The backslashes (`\`) before the double quotes (`"`) are used to ensure that the quotes are treated as part of the data within the JSON payload. |

Done. Your task is scheduled and will be executed according to the defined scheduling.

Your scheduled tasks are visible in the [Upstash Console](https://console.upstash.com/qstash), within the **QStash** tab, for your review and monitoring.

### Via Upstash console

1. Copy your Azion application domain.
2. Go to the [Upstash Console](https://console.upstash.com/qstash) and open the **QStash** tab.
3. Complete the form with the requested information.
- In the type field, select **Scheduled** and choose the delay. 
- Alternatively, select **Once** to send an immediate and unique message.
6. Click the **Schedule** button.

Done. Your task is scheduled and visible in the **Scheduled Jobs** section for your review and monitoring.

You can also publish them using a REST API request. For more information, read the [QStash documentation](https://upstash.com/docs/qstash/api/messages/create).

---

### Continuous deployment

Once the template is deployed, you can edit and update your args and code, as well as implement a continuous deployment workflow. However, you'll need first to *declare secrets on your project's GitHub repository* to complete the second build with the changes. When the second build is completed, you'll be able to manage your project with a continuous deployment workflow and edit the args as desired.

To do so, open your repository in GitHub. Then, go to **Settings** > **Secrets and variables** > **Action** to [add your variables](https://docs.github.com/en/actions/security-guides/encrypted-secrets), following these instructions:

1. Add the Azion personal token to the *secrets*:
    - Read [how to generate an Azion personal token](https://www.azion.com/en/documentation/products/accounts/personal-tokens/) in the documentation.

```bash
    AZION_PERSONAL_TOKEN=<value>
```

2. Add the environments for use in the action workflow in the **main.yml** file, included in the **.github/workflows** folder of your repository:

```yml title=".github/workflows/main.yml"
  - name: edge-...
    id: azion_edge
    ...
    with:
        ....
        azionPersonalToken: ${{ secrets.AZION_PERSONAL_TOKEN }}
        ....

```

3. Add the Upstash Signing Keys to the *secrets*, being:

- **QSTASH_CURRENT_SIGNING_KEY**: a string to sign all messages sent to the destination.
- Go to your Upstash Console and copy the `QSTASH_CURRENT_SIGNING_KEY` in the **QStash** tab.
- **QSTASH_NEXT_SIGNING_KEY**: a string used to sign messages after you've rotated your signing keys.
    - Go to your Upstash Console and copy the `QSTASH_NEXT_SIGNING_KEY` from the **QStash** tab.

```bash
QSTASH_CURRENT_SIGNING_KEY=<value>
QSTASH_NEXT_SIGNING_KEY=<value>
```

4. Add the environments for use in the action workflow in the **main.yml** file, included in the **.github/workflows** folder of your repository:

```yml title=".github/workflows/main.yml"
 - name: Create args file
    run: |
        ...
       "QSTASH_CURRENT_SIGNING_KEY": "${{ secrets.QSTASH_CURRENT_SIGNING_KEY }}",
        "QSTASH_NEXT_SIGNING_KEY": "${{ secrets.QSTASH_NEXT_SIGNING_KEY }}"
        ...
```

5. Open a pull request to merge the changes to the main branch and start the automatic deployment.

Now, your project is ready to work with a continuous deployment workflow, updating instantly any changes in the application or the repository. 

---

## Management

Considering that this initial setup may not be optimal for your specific edge application, all settings can be customized any time you need by using Azion Real-Time Manager (RTM). Once the template is deployed, you also have full control over customizing your Upstash account and QStash configurations.

To manage and edit your edge application’s settings, read the documentation about [managing edge applications](https://www.azion.com/en/documentation/products/edge-application/first-steps/) for more details. To manage and edit your edge application’s settings, read the documentation about [managing edge applications](https://www.azion.com/en/documentation/products/edge-application/first-steps/) for more details.

### Custom domain

The edge application created during the deployment has an assigned Azion domain to make it accessible through the browser. The domain has the following format: `xxxxxxxxxx.map.azionedge.net`. However, you can add a custom domain for users to access your edge application through it. Go to the [Domains](https://www.azion.com/en/documentation/products/guides/configure-a-domain/) documentation to read more about it.

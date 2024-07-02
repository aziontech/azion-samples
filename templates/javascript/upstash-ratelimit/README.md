## Upstash Rate Limiting template

The **Upstash Rate Limiting** template helps you to implement rate limiting in a serverless environment, without requiring extensive manual setup. This template includes configurations for limiting requests and window limit.

It works in conjunction with Azion **Edge Functions**, being possible to adjust the initial setup based on the args. Additionally, this template creates a new GitHub repository that allows a continuous deployment workflow. This way, you're able to further configure and customize further the setup to attend to your needs, obtaining easy management and delivery of your personalized content.

This repository is an example of the new GitHub repository created during the deployment. For a more detailed step-by-step to deploy this template via Azion Real-Time Manager (RTM), check the [How to deploy the Upstash Rate Limiting template through Azion](https://www.azion.com/en/documentation/products/guides/upstash-rate-limiting/) guide.

---

## Usage information

To use this template, you must [sign in on Azion Console](https://console.azion.com/login).

> If you haven't created an account, go to the [signup page](https://console.azion.com/signup) to complete the registration.

To successfully deploy this template, you need to provide the information to configure your Azion application, as requested in the **Settings** tab on the template's page.

For a more detailed step-by-step on using this template and requirements, check the [How to deploy the Upstash Rate Limiting template through Azion](https://www.azion.com/en/documentation/products/guides/upstash-rate-limiting/) guide.

### Requirements

To start using this template, you need to: 

1. Create an [Upstash account](https://console.upstash.com/login).
2. Create a Global Database for the best available edge latency in the [Upstash Console](https://console.upstash.com/).
3. Generate your [GitHub personal token]((https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens#creating-a-personal-access-token-classic)).
4. Enable [Edge Functions](https://www.azion.com/en/documentation/products/guides/billing-and-subscriptions/) in your Azion account.

---

### Continuous deployment

The template args can also be updated and it's possible to implement a continuous deployment workflow. However, you'll need first to declare secrets on your project's GitHub repository to successfully complete the second build with the changes. Once this second build is completed, you'll be able to manage your project with a continuous deployment workflow and edit the args as desired.

To do so, open your **Upstash Rate Limit** repository on GitHub. Then, go to **Settings** > **Secrets and variables** > **Action** to [add your variables](https://docs.github.com/en/actions/security-guides/encrypted-secrets), following these instructions:

1. Add the Azion personal token to the *secrets*:
- Read [how to generate an Azion Personal Token](https://www.azion.com/en/documentation/products/accounts/personal-tokens/) in the documentation.

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

- **UPSTASH_REDIS_REST_URL**: the URL to access your Upstash database using REST.
  - Go to your Upstash Console and copy the `UPSTASH_REDIS_REST_URL` in your database page.
- **UPSTASH_REDIS_REST_TOKEN**: the token to authorize access to your Upstash database using REST.
  - Go to your Upstash Console and copy the `UPSTASH_REDIS_REST_TOKEN` in your database page.
- **UPSTASH_LIMIT**: the maximum number of requests. Example: `6`.
- **UPSTASH_LIMIT_WINDOW**: the time window for new requests. Example: `10 s`. (can be used: "ms" | "s" | "m" | "h" | "d").

```bash
    UPSTASH_REDIS_REST_URL=<value>
    UPSTASH_REDIS_REST_TOKEN=<value>
    UPSTASH_LIMIT=6
    UPSTASH_LIMIT_WINDOW=10 s // "ms" | "s" | "m" | "h" | "d";
```

4. Add the environments for use in the action workflow in the **main.yml** file, included in the **.github/workflows** folder of your repository:

```yml
 - name: Create args file
    run: |
        ...
        "UPSTASH_REDIS_REST_URL": "${{ secrets.UPSTASH_REDIS_REST_URL }}",
        "UPSTASH_REDIS_REST_TOKEN": "${{ secrets.UPSTASH_REDIS_REST_TOKEN }}",
        "UPSTASH_LIMIT": "${{ secrets.UPSTASH_LIMIT }}",
        "UPSTASH_LIMIT_WINDOW": "${{ secrets.UPSTASH_LIMIT_WINDOW }}"
        ...
```

5. Open a pull request with the changes to the main branch and start the automatic deployment.

Now, your project is ready to work with a continuous deployment workflow, updating instantly any changes in the application or the repository. 

---

## Management

Considering the initial setup may not be optimal for your specific web application, all settings can be customized any time you need using Azion Real-Time Manager (RTM). Once the template is deployed, you also have full control over customizing your Upstash account and database.

To manage and edit your edge application’s settings, read the documentation about [managing edge applications](https://www.azion.com/en/documentation/products/edge-application/first-steps/) for more details. 

### Custom domain

The edge application created during the deployment has an assigned Azion domain to make it accessible through the browser. The domain has the following format: `xxxxxxxxxx.map.azionedge.net`. However, you can add a custom domain for users to access your edge application through it. Go to the [Domains](https://www.azion.com/en/documentation/products/edge-application/domains/) documentation to read more about it.

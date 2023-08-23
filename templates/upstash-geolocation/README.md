# How to deploy the Upstash GeoLocation EdgeDeploy template by using GitHub Actions

The **Upstash GeoLocation EdgeDeploy** template displays a personalized greeting message based on the customer's location, enhancing the user experience. By using Redis, you'll upload the greeting messages from Upstash.

---

> - [Requirements](#requirements-requirements)
> - [Deploying to the edge](#deploying-to-the-edge-deploy-edge)
>   - [Through Marketplace](#through-azion-marketplace-marketplace)
>   - [By using Github Actions](#by-using-github-actions-github-actions)

---

## Requirements {#requirements}

Before using this template:

- Create an Azion account [visiting the sign-up page](https://manager.azion.com/signup/).
- Create an [Upstash account](https://console.upstash.com/login).
- Create a Global Database for the best available edge latency in the [Upstash Console](https://console.upstash.com/).

When you're ready, open your Upstash Global Database and, in the CLI tab, add your greetings:

```bash
Welcome to Upstash CLI

set BR "Olá, tudo bem!"
OK
set GB "Ey up?"
OK
set US "Yo, what’s up?"
OK
set IN "Namaste"
OK
```

---

## Deploying to the edge {#deploy-edge}

To perform the deployment of this template, you have two ways:
- Through [Azion Marketplace](#through-azion-marketplace-marketplace).
- By using [GitHub Actions](#by-using-github-actions-github-actions).

### Through Azion Marketplace {#marketplace}

Azion Marketplace is a digital catalog that offers solutions to deploy directly to the edge. To start using this template via Real-Time Manager (RTM), Azion's configuration platform, read the [How to deploy the Upstash GeoLocation EdgeDeploy template through Azion Marketplace](link to guide, wip) guide.

Scopes define the access for personal tokens. [Read more about OAuth scopes.](https://docs.github.com/apps/building-oauth-apps/scopes-for-oauth-apps/)

Requeried:

- repo
- workflow

---

### By using Github Actions {#github-actions}

To deploy the Azion Upstash Rate Limiting template by using Github Actions, create first a new repository based on the template. To do so, click the **Use template** button in this repository page, and then select the **Create new repository** option.

When the new repository is created, [add your secrets](https://docs.github.com/en/actions/security-guides/encrypted-secrets), following these instructions:

1. Add the Azion Personal Token to the *secrets*:
- Read [how to generate an Azion Personal Token](https://www.azion.com/en/documentation/products/accounts/personal-tokens/) in the documentation.

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


2. Add the Redis Database access credentials to the `secrets`, being:


- **UPSTASH_REDIS_REST_URL**: the URL to access your Upstash database using REST.
- Go to your Upstash Console and copy the UPSTASH_REDIS_REST_URL in your database page.
- **UPSTASH_REDIS_REST_TOKEN**: the token to authorize access to your Upstash database using REST.
	- Go to your Upstash Console and copy the UPSTASH_REDIS_REST_TOKEN in your database page.

```bash
    UPSTASH_REDIS_REST_URL=<value>
    UPSTASH_REDIS_REST_TOKEN=<value>;
```

Environments for use in the action workflow:

```yml
 - name: Create args file
    run: |
        ...
        "UPSTASH_REDIS_REST_URL": "${{ secrets.UPSTASH_REDIS_REST_URL }}",
        "UPSTASH_REDIS_REST_TOKEN": "${{ secrets.UPSTASH_REDIS_REST_TOKEN }}";
        ...
```

Finally, open a pull request with the changes to the main branch and start the automatic deployment. Now, your project is ready to work with a continuous deployment workflow, updating instantly any changes in the application or the repository. 

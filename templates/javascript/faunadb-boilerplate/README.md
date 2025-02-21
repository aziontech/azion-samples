# Fauna DB Boilerplate

The **Fauna DB Boilerplate** template is an automation designed to deploy a database directly on the edge while enabling the configuration of creating, retrieving, updating, and deleting items in a Fauna DB collection called `Posts`.

This repository is an example of the new GitHub repository created during the deployment. For a more detailed step-by-step to deploy this template through Azion's platform, check the [How to use the Fauna DB Boilerplate template through Azion](https://www.azion.com/en/documentation/products/guides/faunadb-boilerplate/) guide.

---

## Requirements

Before using this template, you need to:

- Create a [Fauna account](https://dashboard.fauna.com/register).
- Create a database in the [Fauna Dashboard](https://docs.fauna.com/fauna/current/get_started/dashboard) and populate it with `demo data`, selecting this option while creating.
- Create a new [collection](https://docs.fauna.com/fauna/current/cookbook/data_model/collections) named `Posts` within your database to use with this template.
- Generate a [Fauna secret key](https://docs.fauna.com/fauna/v4/security/keys?lang=shell) for your database.
- Have a [GitHub account](https://github.com/signup).
  - Every push will be deployed automatically to the main branch in this repository to keep your project updated.

> **Note**: this template uses [Application Accelerator](https://www.azion.com/en/documentation/products/build/edge-application/application-accelerator/) and [Edge Functions](https://www.azion.com/en/documentation/products/build/edge-application/edge-functions/) and it could generate usage-related costs. Check the [pricing page](https://www.azion.com/en/pricing/) for more information.

---

## Deploy your own

Deploy your own Fauna project with Azion.

[![Deploy Button](https://www.azion.com/button.svg)](https://console.azion.com/create/fauna/faunadb-boilerplate "Deploy with Azion")

For a more detailed step-by-step, check the [documentation](https://www.azion.com/en/documentation/products/guides/faunadb-boilerplate/). You can also learn how to deploy this template by watching [this video](https://youtu.be/QqVUr6RKCnY?feature=shared) on Azion's YouTube channel.
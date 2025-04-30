# Next.js App + Middleware

The **Next.js App + Middleware** accelerates the deployment of a Next.js application with custom configurations, App Router, and a middleware to run it directly on the edge. This template deploys a basic Next.js application containing a domain to access the Single-Page Application (SPA), an [Edge Storage configuration](https://www.azion.com/en/documentation/products/store/edge-storage/), cache settings, Gzip compression, and Rules Engine rules to improve the performance and delivery of static files. Additionally, it creates a new GitHub repository, including a GitHub Action to enable a continuous development workflow and keep your application up to date.

**Next.js App + Middleware** creates files to implement the [App Router format](https://nextjs.org/docs/app), with the index page, edge API routing, and Custom Route Handler created in the new repository during the deployment. It also includes a [middleware](https://nextjs.org/docs/app/building-your-application/routing/middleware) that allows you to modify the response for a request and control different aspects of the application, such as performing redirects, setting headers, and others.

This repository is an example of the new GitHub repository created during the deployment. For a more detailed step-by-step to deploy this template through Azion's platform, check the [How to deploy the Next.js App + Middleware template](https://www.azion.com/en/documentation/products/guides/nextjs-app-middleware/) guide.

Next.js App + Middleware uses Next version `13.5.9`.

---

## Requirements

Before using this template, you need to:

- Have a [GitHub account](https://github.com/signup).
  - Every push will be deployed automatically to the main branch in this repository to keep your project updated.

> **Note**: this template uses [Application Accelerator](https://www.azion.com/en/documentation/products/build/edge-application/application-accelerator/) and [Edge Functions](https://www.azion.com/en/documentation/products/build/edge-application/edge-functions/), and it could generate usage-related costs. Check the [pricing page](https://www.azion.com/en/pricing/) for more information.

---

## Deploy your own

Deploy your own Next.js project with Azion.

[![Deploy Button](https://www.azion.com/button.svg)](https://console.azion.com/create/nextjs/nextjs-app-middleware "Deploy with Azion")

For a more detailed step-by-step, check the [documentation](https://www.azion.com/en/documentation/products/guides/nextjs-app-middleware/).

# Next.js Static Boilerplate

The **Next.js Static Boilerplate** provides an automation solution to simplify and enhance the deployment of Next.js Static applications directly on the edge of the network. By using this boilerplate, you can accelerate your workflow for building user interfaces and web applications.

This repository is an example of the new GitHub repository created during the deployment. For a more detailed step-by-step to deploy this template, check the [How to deploy edge applications with the Next.js Static Boilerplate](https://www.azion.com/en/documentation/products/guides/nextjs-static-boilerplate/) guide.

This template uses Next.js version `14.2.25`.

---

## Requirements

Before using this template, you need to:

- Have a [GitHub account](https://github.com/signup).
  - Every push will be deployed automatically to the main branch in this repository to keep your project updated.

> **Note**: this template uses [Edge Functions](https://www.azion.com/en/documentation/products/build/edge-application/edge-functions/) and it could generate usage-related costs. Check the [pricing page](https://www.azion.com/en/pricing/) for more information.

---

## Deploy your own

Deploy your own Next.js project with Azion.

[![Deploy Button](https://www.azion.com/button.svg)](https://console.azion.com/create/nextjs/next-static-boilerplate "Deploy with Azion")

For a more detailed step-by-step, check the [documentation](https://www.azion.com/en/documentation/products/guides/nextjs-static-boilerplate/).

---

## Static Exports

Next.js enables starting as a static site or Single-Page Application (SPA), then later optionally upgrading to use features that require a server. More details [Next Static Export](https://nextjs.org/docs/app/building-your-application/deploying/static-exports).

### Supported Features
- Server Components
- Client Components
- Image Optimization
  - Image Optimization through next/image can be used with a static export by defining a custom image loader in next.config.js.
- Route Handlers
- Browser APIs

### Unsupported Features

Features that require a Node.js server, or dynamic logic that cannot be computed during the build process, are not supported:
- Dynamic Routes with dynamicParams: true
- Dynamic Routes without generateStaticParams()
- Route Handlers that rely on Request 
- Cookies
- Rewrites
- Redirects
- Headers
- Middleware
- Incremental Static Regeneration
- Image Optimization (with the default loader)
- Draft Mode

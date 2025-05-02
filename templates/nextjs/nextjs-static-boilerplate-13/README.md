# Next.js Static Boilerplate

The **Next.js Static Boilerplate** is designed to simplify and enhance the deployment process for Next.js Static.js applications directly on the edge of the network.

This repository is an example of the new GitHub repository created during the deployment. For a more detailed step-by-step to deploy this template, check the [How to deploy edge applications with the Next.js Static Boilerplate](https://www.azion.com/en/documentation/products/guides/nextjs-static-boilerplate/) guide.

This template uses Next.js version `13.5.9`.

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

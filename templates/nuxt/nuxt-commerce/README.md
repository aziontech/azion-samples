# Nuxt Commerce

A high-performance, server-rendered E-commerce app built with Nuxt & Shopify.

This template uses Nuxt UI, Image & Scripts optimization, Hybrid Rendering, SEO and more.

<details>
<summary>Features</summary>

Nuxt Commerce comes with several useful features out of the box:

1. [Nuxt UI](https://ui.nuxt.com/) - A UI Library for Modern Web Apps.
2. [GraphQL Client](https://nuxt-graphql-client.web.app/) - Minimal GraphQL Client + Code Generation
3. [Image Optimization](https://image.nuxtjs.org/) - Resize and transform your images using built-in optimizer or your favorite images CDN
4. [Scripts](https://scripts.nuxt.com/) - Load third-party scripts with better performance, privacy, security and DX
5. [Hybrid rendering](https://nuxt.com/docs/guide/concepts/rendering#hybrid-rendering) - Set different caching rules and rendering modes per route using Route Rules
6. [SEO](https://nuxtseo.com/) - Simple configuration for Sitemap.xml, Robots.txt, Meta, and OG Images
7. [JSON-LD](https://json-ld.org/) - Lightweight Linked Data format for products
</details>

## Start here

You will need to use the environment variables [defined in `.env.example`](.env.example) to run Nuxt Commerce.

> Note: You should not commit your `.env` file or it will expose secrets that will allow others to control your Shopify store.

```bash
pnpm install
copy .env.example .env
pnpm run dev
```

Your app should now be running on [localhost:3000](http://localhost:3000/).

## Integrations

If you wish to add an integration with 3rd Party service like Content Management System, Search Engine, or Payment Provider, you can do so by using the regular Nuxt module approach.

Create a new folder in the `modules` directory named as your integration (i.e `storyblok`) and inside of it, and `index.ts` file.

<details>
<summary>Why this approach?</summary>

_Normally, you could just install the modules and plugins directly inside the global `nuxt.config.ts` but as your application grows, it could become much harder to maintain the project. By following the `modules` approach defined by Nuxt you can easily extract domain code into separate module that wraps components, composables, types, and overall integration configuration_

</details>

## Deploying to Azion

Deploy your own Next.js AI Chatbot with Azion.

[![Deploy Button](https://www.azion.com/button.svg)](https://console.azion.com/create/azion-community/nextjs-ai-chatbot "Deploy with Azion")

For a more detailed step-by-step on using templates via Azion Console, check the [documentation](https://www.azion.com/en/documentation/products/use-a-template-via-azion-console/).

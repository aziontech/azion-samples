## Azion, Next.js Commerce, and Shopify Integration Guide

This guide explains how to use the **Azion + Next.js Commerce** template to build a high‑performance, headless Shopify storefront running at the Azion Platform.

You will:

- **Create and configure** a Shopify storefront
- **Connect** the Next.js Commerce template to your Shopify store
- **Run locally** for development
- **Deploy to Azion** to serve your storefront from the Azion Platform

**Azion**.

---

## 1. Prerequisites

Before you start, make sure you have:

- **Azion**
  - An Azion account with access to the **Azion Console**
  - Permission to create **Applications**, **Functions**, and **Custom Domain**

- **Shopify**
  - A Shopify store (can be a development store)
  - Admin access to install apps and configure themes

- **Local development**
  - Node.js 18+ and `pnpm` installed
  - Git installed (optional but recommended)

---

## 2. Configure Shopify

This project uses Shopify as the commerce backend (products, collections, carts, checkout) and Next.js Commerce as the headless storefront. Follow these high‑level steps in Shopify:

### 2.1 Create a Shopify store (if needed)

If you do not have a store yet:

- Sign in to [Shopify](https://www.shopify.com/)
- Create a new store (or a development store)

You can use any theme for your storefront – the Next.js Commerce app will act as the **headless storefront**, while Shopify manages products, checkout, orders, and admin.

### 2.2 Create a private/custom app for API access

Next.js Commerce interacts with Shopify using the Storefront API and Admin API (depending on the configuration). In your Shopify admin:

1. Go to **Settings → Apps and sales channels**
2. Click **Develop apps** (enable if necessary)
3. Create a new custom app (for example, `Azion Next.js Commerce`)
4. Under **Configuration**, enable the required API scopes, such as:
   - Storefront API access to products, collections, menus, and checkout
   - (Optional) Admin API scopes for content that requires it
5. Install the app in your store
6. Copy the **Storefront API token**, **Admin API token** (if used), and the **Storefront API URL**

You will use these values as environment variables in your Next.js Commerce project.

### 2.3 Configure basic store settings

Inside Shopify, configure at least:

- **Store name and branding** (logo, colors)
- **Currencies and payment providers**
- **Shipping and tax settings**

These settings are used by Shopify at checkout and will be reflected in the customer experience when redirecting to or embedding the checkout.

---

## 3. Set up the Next.js Commerce project

This template is a Next.js App Router application already wired to use Shopify as a provider, with the structure adapted to run on Azion.

From the root of this template:

```bash
pnpm install
```

Then create a `.env` file (do **not** commit this file) and configure the environment variables required by the Shopify provider. For example:

```bash
SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
SHOPIFY_STOREFRONT_API_TOKEN=xxx
SHOPIFY_STOREFRONT_API_VERSION=2024-01
# Optional / if used by your implementation
SHOPIFY_ADMIN_API_TOKEN=xxx
SHOPIFY_ADMIN_API_VERSION=2024-01
```

> Check the `lib/shopify` implementation (or the provider configuration in this template) for the exact list of required environment variables.

Now run the project locally:

```bash
pnpm dev
```

Your app should now be running on [http://localhost:3000](http://localhost:3000).

Visit the site and confirm that:

- Products and collections are loading from your Shopify store
- Product detail pages render correctly
- Cart and checkout flows behave as expected

Once everything works locally, you are ready to deploy to Azion.

---

## 4. Deploying to Azion

Deploy your own Next.js Commerce + Shopify project with Azion.

[![Deploy Button](https://www.azion.com/button.svg)](https://console.azion.com/create/azion-community/nextjs-commerce-shopify "Deploy with Azion")

For a more detailed step-by-step on using templates via Azion Console, check the [documentation](https://www.azion.com/en/documentation/products/use-a-template-via-azion-console/).

---

## 5. Webhooks and cache invalidation (optional)

To keep your storefront always up‑to‑date with Shopify changes (for example, product updates, price changes), you can configure **Shopify webhooks** and integrate them with Azion.

Typical steps:

1. Expose an API or Edge Function route in your Next.js Commerce app that handles revalidation or cache purging
2. Configure a **secret** shared between Shopify and your webhook handler
3. In Shopify admin, go to **Settings → Notifications → Webhooks** (or the appropriate section)
4. Add webhooks for events like **Products update**, **Collections update**, etc.
5. Point the webhook URL to your Azion hostname (for example, `https://store.example.com/api/webhooks/shopify`)

In your webhook handler, you can use:

- Application‑level revalidation (Next.js `revalidatePath`, `revalidateTag`, or ISR, depending on your implementation)
- Azion‑level cache purge APIs, if you need to explicitly clear edge cache

> The exact integration will depend on how caching and ISR are configured in this template.

---

## 6. Local development vs. production on Azion

You can continue iterating locally with:

```bash
pnpm dev
```

When you push changes to the branch connected to Azion:

- Azion automatically builds your Next.js Commerce app
- New code and assets are deployed as a new version
- Traffic is gradually served from the updated edge version once activation completes

Best practices:

- Use **feature branches** and preview deployments (if configured) before merging to production
- Keep **Shopify API versions** up‑to‑date and aligned between local and Azion environments
- Store secrets only in environment variable stores (local `.env`, Azion Variables/Secrets)

---

## 7. Troubleshooting

- **Blank pages or errors fetching products**
  - Verify `SHOPIFY_STORE_DOMAIN` and API tokens
  - Check that the necessary Storefront API scopes are enabled for your Shopify app

- **Errors only in production on Azion**
  - Confirm that all environment variables are set in Azion and match your local `.env`
  - Check Azion logs for your Edge Function to see runtime errors

- **Caching issues / stale content**
  - Review cache policies on your Edge Application
  - Implement explicit revalidation or cache purge on relevant events (for example, via webhooks)

If you continue having issues, consult the Azion documentation for **Edge Applications**, **Edge Functions**, and **Domains**, or reach out to Azion support.

---

## 8. Next steps

Once your Azion + Next.js Commerce + Shopify storefront is live, you can:

- Integrate analytics or observability tools supported by Azion
- Add A/B testing or personalization at the edge
- Fine‑tune caching strategies per route (PLP, PDP, search, cart) using Azion's Rules Engine

This template should give you a solid, high‑performance starting point for building a global headless commerce experience on Azion.


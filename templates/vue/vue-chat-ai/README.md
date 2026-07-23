# Vue Chat AI

A simple AI chat built with **Nuxt 3**, **@tanstack/ai** and the Azion Nitro preset.

Supports streaming responses from OpenAI, Anthropic and Azion Copilot.

## Prerequisites

- Node.js v18 or higher

## Running locally

```bash
pnpm install
pnpm dev
```

Your app should now be running on [localhost:3000](http://localhost:3000/).

## Building the embeddable web component

```bash
pnpm build:wc
```

Outputs `public/widget/azion-chat-widget.{es,iife}.js`. Load in any host page:

```html
<script type="module" src="/widget/azion-chat-widget.es.js"></script>
<azion-chat-widget api-url="/api/chat"></azion-chat-widget>
```

## Deploying to Azion

Deploy your own Vue Chat AI with Azion.

[![Deploy Button](https://www.azion.com/button.svg)](https://console.azion.com/create/azion-community/vue-chat-ai "Deploy with Azion")

For a more detailed step-by-step on using templates via Azion Console, check the [documentation](https://www.azion.com/en/documentation/products/use-a-template-via-azion-console/).

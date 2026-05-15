# Architecture — azion-samples

## Overview

Official template and sample repository for the Azion CLI. Contains ready-to-deploy project templates for 27+ web frameworks and 18 edge function samples. Used by `azion init` to scaffold new projects on the Azion Edge Platform.

## Repository Structure

```
azion-samples/
├── templates/                  Framework project templates (27 types)
│   ├── nextjs/                 Next.js variants (18 sub-templates)
│   ├── astro/                  Astro variants (34 sub-templates)
│   ├── react/                  React variants
│   ├── vue/                    Vue variants
│   ├── angular/                Angular variant
│   ├── svelte/                 Svelte/SvelteKit
│   ├── nuxt/                   Nuxt variant
│   ├── gatsby/                 Gatsby variant
│   ├── hugo/                   Hugo variant
│   ├── jekyll/                 Jekyll variant
│   ├── docusaurus/             Docusaurus variant
│   ├── hexo/                   Hexo variant
│   ├── eleventy/               11ty variant
│   ├── vitepress/              VitePress variant
│   ├── hono/                   Hono variant
│   ├── rustwasm/               Rust WebAssembly
│   ├── emscripten/             C/C++ WebAssembly
│   └── ...
├── samples/                    Edge function samples (18 types)
│   ├── edge-functions-*/       Firewall & application functions
│   ├── stripe-webhooks/        Stripe integration
│   ├── websocket/              WebSocket pattern
│   ├── wasm/                   WebAssembly sample
│   ├── qr-code/                QR code generation
│   ├── file-upload/            File handling
│   └── ...
└── docs/
    └── release-diagram.md      Release flow documentation
```

## Template Anatomy

Each template contains:

```
template-name/
├── info.json               Metadata (name, description, preset, mode)
├── azion.config.cjs        Azion build/deploy configuration
├── package.json            Dependencies and scripts
├── src/                    Application source code
└── [framework files]       Framework-specific config
```

**info.json** defines how the CLI presents the template:
```json
{
  "name": "Template Display Name",
  "message": "Short description",
  "preset": "framework-name",
  "mode": "deliver|compute"
}
```

**azion.config.cjs** defines edge deployment:
- Build preset (javascript, jekyll, svelte, etc.)
- Edge functions (names and paths)
- Application routing rules
- Workload deployment configuration

## CLI Integration

```
azion init
    │
    ├── 1. Query Templates API (cron-synced from this repo)
    ├── 2. User selects framework/template
    ├── 3. Clone selected template into project directory
    ├── 4. Install dependencies
    └── 5. Optional: azion dev / azion deploy
```

## Release Flow

1. PR merged to `dev` branch
2. Templates API cron job syncs repo hourly to marketplace
3. CLI `azion init` fetches updated template list
4. Console marketplace updated (manual config for new templates)

## Covered Frameworks

| Category | Frameworks |
|----------|-----------|
| React ecosystem | React, Next.js, Gatsby, Preact |
| Vue ecosystem | Vue, Nuxt, VitePress, VuePress |
| Other JS | Angular, Svelte, Astro, Qwik, Stencil, Hono, Eleventy |
| SSG | Hugo, Jekyll, Docusaurus, Hexo |
| Non-JS | Rust WebAssembly, C/C++ Emscripten |
| Specialized | AI Studio, Commerce (FastStore) |

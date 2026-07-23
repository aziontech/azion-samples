/**
 * This file was automatically generated based on your preset configuration.
 *
 * For better type checking and IntelliSense:
 * 1. Install azion as dev dependency:
 *    npm install -D azion
 *
 * 2. Use defineConfig:
 *    import { defineConfig } from 'azion'
 *
 * 3. Replace the configuration with defineConfig:
 *    export default defineConfig({
 *      // Your configuration here
 *    })
 *
 * For more configuration options, visit:
 * https://github.com/aziontech/lib/tree/main/packages/config
 */

export default {
  build: {
    preset: 'nuxt',
    polyfills: true
  },
  origin: [
    {
      name: 'origin-storage-default',
      type: 'object_storage'
    }
  ],
  functions: [
    {
      name: 'handler',
      path: '.edge/worker.dev.js'
    }
  ],
  rules: {
    request: [
      {
        name: 'Nuxt Static Assets',
        match: '^\\/_nuxt\\/',
        behavior: {
          setOrigin: {
            name: 'origin-storage-default',
            type: 'object_storage'
          },
          deliver: true
        }
      },
      {
        name: 'Redirect to index.html for Subpaths',
        match: '^(?!.*/$)(?![sS]*.[a-zA-Z0-9]+$).*',
        behavior: {
          rewrite: '${uri}/index.html'
        }
      },
      {
        name: 'Redirect to index.html',
        match: '.*/$',
        behavior: {
          rewrite: '${uri}index.html'
        }
      },
      {
        name: 'Execute Nuxt Function when starts with /api/_content',
        description:
          'Handle @nuxt/content API requests - executes Nuxt function for content management endpoints. Remove this rule if your project does not use the @nuxt/content library.',
        criteria: [
          {
            variable: '${uri}',
            operator: 'starts_with',
            conditional: 'if',
            inputValue: '/api/_content'
          }
        ],
        behavior: {
          runFunction: 'handler',
          forwardCookies: true,
          deliver: true
        }
      },
      {
        name: 'Deliver Static Assets',
        match:
          '.(jpg|jpeg|png|gif|bmp|webp|svg|ico|ttf|otf|woff|woff2|eot|pdf|doc|docx|xls|xlsx|ppt|pptx|mp4|webm|mp3|wav|ogg|css|js|json|xml|html|txt|csv|zip|rar|7z|tar|gz|webmanifest|map|md|yaml|yml)$',
        behavior: {
          setOrigin: {
            name: 'origin-storage-default',
            type: 'object_storage'
          },
          deliver: true
        }
      },
      {
        name: 'Execute Edge Function',
        match: '^/',
        behavior: {
          runFunction: 'handler',
          forwardCookies: true
        }
      }
    ]
  }
}

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

module.exports = {
  build: {
    preset: 'opennextjs',
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
      path: '.edge/worker.js'
    }
  ],
  rules: {
    request: [
      {
        name: 'Set storage origin for all requests _next_static',
        match: '^\\/_next\\/static\\/',
        behavior: {
          setOrigin: {
            name: 'origin-storage-default',
            type: 'object_storage'
          },
          deliver: true
        }
      },
      {
        name: 'Deliver Static Assets',
        match:
          '.(css|js|ttf|woff|woff2|pdf|svg|jpg|jpeg|gif|bmp|png|ico|mp4|json)$',
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

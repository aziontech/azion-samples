/**
 * This file was automatically generated based on your preset configuration.
 *
 * For better type checking and IntelliSense:
 * 1. Install azion config as dev dependency:
 *    npm install -D @aziontech/config
 *
 * 2. Use defineConfig:
 *    import { defineConfig } from '@aziontech/config'
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
  storage: [
    {
      name: 'ethereal-meishodoto',
      prefix: '20260608141623',
      dir: './.edge/assets',
      workloadsAccess: 'read_write'
    }
  ],
  connectors: [
    {
      name: 'ethereal-meishodoto',
      active: true,
      type: 'storage',
      attributes: {
        bucket: 'ethereal-meishodoto',
        prefix: '20260608141623'
      }
    }
  ],
  functions: [
    {
      name: 'ethereal-meishodoto',
      path: './functions/worker.js',
      bindings: {
        storage: {
          bucket: 'ethereal-meishodoto',
          prefix: '20260608141623'
        }
      }
    }
  ],
  applications: [
    {
      name: 'ethereal-meishodoto',
      cache: [
        {
          name: 'ethereal-meishodoto',
          browser: {
            maxAgeSeconds: 7200
          },
          edge: {
            maxAgeSeconds: 7200
          }
        }
      ],
      rules: {
        request: [
          {
            name: 'Set storage origin for all requests _next_static and set cache policy',
            description:
              'Serve Next.js static assets through edge connector and set cache policy',
            active: true,
            criteria: [
              [
                {
                  variable: '${uri}',
                  conditional: 'if',
                  operator: 'matches',
                  argument: '^/_next/static/'
                }
              ]
            ],
            behaviors: [
              {
                type: 'set_connector',
                attributes: {
                  value: 'ethereal-meishodoto'
                }
              },
              {
                type: 'set_cache_policy',
                attributes: {
                  value: 'ethereal-meishodoto'
                }
              },
              {
                type: 'deliver'
              }
            ]
          },
          {
            name: 'Deliver Static Assets and set cache policy',
            description:
              'Serve static assets through edge connector and set cache policy',
            active: true,
            criteria: [
              [
                {
                  variable: '${uri}',
                  conditional: 'if',
                  operator: 'matches',
                  argument:
                    '.(css|js|ttf|woff|woff2|pdf|svg|jpg|jpeg|gif|bmp|png|ico|mp4|json)$'
                }
              ]
            ],
            behaviors: [
              {
                type: 'set_connector',
                attributes: {
                  value: 'ethereal-meishodoto'
                }
              },
              {
                type: 'set_cache_policy',
                attributes: {
                  value: 'ethereal-meishodoto'
                }
              },
              {
                type: 'deliver'
              }
            ]
          },
          {
            name: 'Execute Function',
            description: 'Execute function for all requests',
            active: true,
            criteria: [
              [
                {
                  variable: '${uri}',
                  conditional: 'if',
                  operator: 'matches',
                  argument: '^/'
                }
              ]
            ],
            behaviors: [
              {
                type: 'run_function',
                attributes: {
                  value: 'ethereal-meishodoto'
                }
              },
              {
                type: 'forward_cookies'
              }
            ]
          }
        ]
      },
      functionsInstances: [
        {
          name: 'ethereal-meishodoto',
          ref: 'ethereal-meishodoto'
        }
      ]
    }
  ],
  workloads: [
    {
      name: 'ethereal-meishodoto',
      active: true,
      infrastructure: 1,
      deployments: [
        {
          name: 'ethereal-meishodoto',
          current: true,
          active: true,
          strategy: {
            type: 'default',
            attributes: {
              application: 'ethereal-meishodoto'
            }
          }
        }
      ]
    }
  ]
}

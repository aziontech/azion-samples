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

export default {
  build: {
    preset: 'nitro',
    polyfills: true
  },
  storage: [
    {
      name: 'insightful-aphrodite',
      prefix: '20260608123921',
      dir: './.output/public',
      workloadsAccess: 'read_write'
    }
  ],
  connectors: [
    {
      name: 'insightful-aphrodite',
      active: true,
      type: 'storage',
      attributes: {
        bucket: 'insightful-aphrodite',
        prefix: '20260608123921'
      }
    }
  ],
  functions: [
    {
      name: 'insightful-aphrodite',
      path: './functions/index.js',
      bindings: {
        storage: {
          bucket: 'insightful-aphrodite',
          prefix: '20260608123921'
        }
      }
    }
  ],
  applications: [
    {
      name: 'insightful-aphrodite',
      cache: [
        {
          name: 'insightful-aphrodite',
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
            name: 'Redirect to index.html for Subpaths',
            description: 'Handle subpath requests by rewriting to index.html',
            active: true,
            criteria: [
              [
                {
                  variable: '${uri}',
                  conditional: 'if',
                  operator: 'matches',
                  argument: '^(?!.*/$)(?![sS]*.[a-zA-Z0-9]+$).*'
                }
              ]
            ],
            behaviors: [
              {
                type: 'set_connector',
                attributes: {
                  value: 'insightful-aphrodite'
                }
              },
              {
                type: 'rewrite_request',
                attributes: {
                  value: '${uri}/index.html'
                }
              }
            ]
          },
          {
            name: 'Redirect to index.html',
            description: 'Handle directory requests by rewriting to index.html',
            active: true,
            criteria: [
              [
                {
                  variable: '${uri}',
                  conditional: 'if',
                  operator: 'matches',
                  argument: '.*/$'
                }
              ]
            ],
            behaviors: [
              {
                type: 'set_connector',
                attributes: {
                  value: 'insightful-aphrodite'
                }
              },
              {
                type: 'rewrite_request',
                attributes: {
                  value: '${uri}index.html'
                }
              }
            ]
          },
          {
            name: 'Deliver Static Assets and set cache policy',
            description:
              'Deliver static assets directly from storage and set cache policy',
            active: true,
            criteria: [
              [
                {
                  variable: '${uri}',
                  conditional: 'if',
                  operator: 'matches',
                  argument:
                    '.(jpg|jpeg|png|gif|bmp|webp|svg|ico|ttf|otf|woff|woff2|eot|pdf|doc|docx|xls|xlsx|ppt|pptx|mp4|webm|mp3|wav|ogg|css|js|json|xml|html|txt|csv|zip|rar|7z|tar|gz|webmanifest|map|md|yaml|yml)$'
                }
              ]
            ],
            behaviors: [
              {
                type: 'set_connector',
                attributes: {
                  value: 'insightful-aphrodite'
                }
              },
              {
                type: 'set_cache_policy',
                attributes: {
                  value: 'insightful-aphrodite'
                }
              },
              {
                type: 'deliver'
              }
            ]
          },
          {
            name: 'Execute Nitro Function',
            description: 'Execute Nitro function for all requests',
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
                  value: 'insightful-aphrodite'
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
          name: 'insightful-aphrodite',
          ref: 'insightful-aphrodite'
        }
      ]
    }
  ],
  workloads: [
    {
      name: 'insightful-aphrodite',
      active: true,
      infrastructure: 1,
      deployments: [
        {
          name: 'insightful-aphrodite',
          current: true,
          active: true,
          strategy: {
            type: 'default',
            attributes: {
              application: 'insightful-aphrodite'
            }
          }
        }
      ]
    }
  ]
}

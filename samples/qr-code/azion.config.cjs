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
    preset: 'javascript',
    polyfills: true
  },
  functions: [
    {
      name: 'qr-code',
      path: './functions/index.js'
    }
  ],
  applications: [
    {
      name: 'qr-code',
      rules: {
        request: [
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
                  value: 'qr-code'
                }
              }
            ]
          }
        ]
      },
      functionsInstances: [
        {
          name: 'qr-code',
          ref: 'qr-code'
        }
      ]
    }
  ],
  workloads: [
    {
      name: 'qr-code',
      active: true,
      infrastructure: 1,
      deployments: [
        {
          name: 'qr-code',
          current: true,
          active: true,
          strategy: {
            type: 'default',
            attributes: {
              application: 'qr-code'
            }
          }
        }
      ]
    }
  ]
}

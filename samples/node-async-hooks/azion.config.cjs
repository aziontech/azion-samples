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
      name: 'node-async-hooks',
      path: './functions/index.js'
    }
  ],
  applications: [
    {
      name: 'node-async-hooks',
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
                  value: 'node-async-hooks'
                }
              }
            ]
          }
        ]
      },
      functionsInstances: [
        {
          name: 'node-async-hooks',
          ref: 'node-async-hooks'
        }
      ]
    }
  ],
  workloads: [
    {
      name: 'node-async-hooks',
      active: true,
      infrastructure: 1,
      deployments: [
        {
          name: 'node-async-hooks',
          current: true,
          active: true,
          strategy: {
            type: 'default',
            attributes: {
              application: 'node-async-hooks'
            }
          }
        }
      ]
    }
  ]
}

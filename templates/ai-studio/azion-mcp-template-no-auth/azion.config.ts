/**
 * This file was automatically generated based on your preset configuration.
 *
 * For better type checking and IntelliSense:
 * 1. Install azion as dev dependency:
 *    npm install -D azion
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
    preset: "typescript",
    polyfills: true,
    entry: "./src/index.ts",
  },
  functions: [
    {
      name: "$FUNCTION_NAME",
      path: "./functions/index.js",
    },
  ],
  applications: [
    {
      name: "$APPLICATION_NAME",
      rules: {
        request: [
          {
            name: "Execute Function",
            description: "Execute function for all requests",
            active: true,
            criteria: [
              [
                {
                  variable: "${uri}",
                  conditional: "if",
                  operator: "matches",
                  argument: "^/",
                },
              ],
            ],
            behaviors: [
              {
                type: "run_function",
                attributes: {
                  value: "$FUNCTION_NAME",
                },
              },
            ],
          },
        ],
      },
      functionsInstances: [
        {
          name: "$FUNCTION_INSTANCE_NAME",
          ref: "$FUNCTION_NAME",
        },
      ],
    },
  ],
  workloads: [
    {
      name: "$WORKLOAD_NAME",
      active: true,
      infrastructure: 1,
      protocols: {
        http: {
          versions: ["http1", "http2"],
          httpPorts: [80],
          httpsPorts: [443],
          quicPorts: null,
        },
      },
      deployments: [
        {
          name: "$DEPLOYMENT_NAME",
          current: true,
          active: true,
          strategy: {
            type: "default",
            attributes: {
              application: "$APPLICATION_NAME",
            },
          },
        },
      ],
    },
  ],
};

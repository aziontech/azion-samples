export default {
  build: {
    entry: 'src/main.ts',
    worker: true,
    preset: 'typescript'
  },
  workloads: [
    {
      name: '$WORKLOAD_NAME',
      active: true,
      infrastructure: 1,
      protocols: {
        http: {
          versions: ['http1', 'http2'],
          httpPorts: [80],
          httpsPorts: [443],
          quicPorts: null
        }
      },
      deployments: [
        {
          name: '$DEPLOYMENT_NAME',
          current: true,
          active: true,
          strategy: {
            type: 'default',
            attributes: {
              application: '$APPLICATION_NAME'
            }
          }
        }
      ]
    }
  ],
  functions: [
    {
      name: '$FUNCTION_NAME',
      path: 'functions/main.js'
    }
  ],
  applications: [
    {
      name: '$APPLICATION_NAME',
      rules: {
        request: [
          {
            name: 'Execute Edge Function',
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
                  value: '$FUNCTION_NAME'
                }
              }
            ]
          }
        ],
        response: [
          {
            name: 'CORS headers',
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
                type: 'add_response_header',
                attributes: {
                  value: 'Access-Control-Allow-Methods: POST, OPTIONS'
                }
              },
              {
                type: 'add_response_header',
                attributes: {
                  value: 'Access-Control-Request-Method: POST, OPTIONS'
                }
              },
              {
                type: 'add_response_header',
                attributes: {
                  value:
                    'Access-Control-Allow-Headers: Content-Type, Authorization'
                }
              },
              {
                type: 'add_response_header',
                attributes: {
                  value: 'Allow: POST, OPTIONS'
                }
              },
              {
                type: 'add_response_header',
                attributes: {
                  value: 'Content-Type: application/json'
                }
              },
              {
                type: 'add_response_header',
                attributes: {
                  value: 'Access-Control-Allow-Credentials: true'
                }
              }
            ]
          }
        ]
      },
      functionsInstances: [
        {
          name: '$FUNCTION_INSTANCE_NAME',
          ref: '$FUNCTION_NAME',
          active: true
        }
      ]
    }
  ]
}
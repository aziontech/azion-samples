import { defineConfig } from 'azion';

export default defineConfig({
  build: {
    entry: 'src/main.ts',
    preset: 'typescript'
  },
  functions: [
    {
      name: 'my-typescript-function',
      path: '.edge/functions/main.ts',
    },
  ],
  rules: {
    request: [
      {
        name: 'Execute Edge Function',
        match: '^\\/',
        behavior: {
          runFunction: 'my-typescript-function',
        },
      },
    ],
    response: [
      {
        name: "CORS headers",
        active: true,
        match: "^\\/",
        behavior: {
          setHeaders: [
            "Access-Control-Allow-Methods: POST, OPTIONS",
            "Access-Control-Request-Method: POST, OPTIONS",
            "Access-Control-Allow-Headers: Content-Type, Authorization",
            "Allow: POST, OPTIONS",
            "Content-Type: application/json",
            "Access-Control-Allow-Credentials: true",
          ],
        },
      },
    ]
  },
});

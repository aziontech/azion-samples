import { defineConfig } from 'azion';

export default defineConfig({
  build: {
    entry: 'src/index.ts',
    preset: 'typescript'
  },
  functions: [
    {
      name: 'my-typescript-function',
      path: '.edge/functions/index.ts',
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
    ]
  },
});

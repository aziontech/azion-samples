import { defineConfig } from 'azion';

export default defineConfig({
  build: {
    builder: 'esbuild',
    polyfills: true,
    preset: {
      name: 'next',
    },
  },
});

import { defineConfig } from 'azion';

export default defineConfig({
  build: {
    bundler: 'esbuild',
    polyfills: true,
    preset: 'next',
  },
});

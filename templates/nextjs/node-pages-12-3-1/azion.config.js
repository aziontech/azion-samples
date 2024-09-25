import { defineConfig } from 'azion';

module.exports = defineConfig({
  build: {
    builder: 'esbuild',
    polyfills: true,
    preset: {
      name: 'next',
    },
  },
});

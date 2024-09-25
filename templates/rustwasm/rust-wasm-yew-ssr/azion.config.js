import { defineConfig } from 'azion';

module.exports = defineConfig({
  build: {
    polyfills: false,
    worker: false,
    preset: {
      name: 'rustwasm',
    },
  },
});

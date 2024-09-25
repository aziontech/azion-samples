import { defineConfig } from 'azion';

module.exports = defineConfig({
  build: {
    entry: 'main.js',
    preset: {
      name: 'javascript',
    },
    polyfills: true,
  },
});

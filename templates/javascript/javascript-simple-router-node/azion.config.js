import { defineConfig } from 'azion';

export default defineConfig({
  build: {
    entry: 'main.js',
    polyfills: true,
    preset: {
      name: 'javascript',
    },
  },
});

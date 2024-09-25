import { defineConfig } from 'azion';

export default defineConfig({
  build: {
    entry: 'main.js',
    preset: {
      name: 'javascript',
    },
  },
});

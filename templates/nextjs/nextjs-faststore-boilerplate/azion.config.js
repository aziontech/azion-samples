import { defineConfig } from 'azion';

module.exports = defineConfig({
  build: {
    builder: 'esbuild',
    preset: {
      name: 'next',
    },
  },
});

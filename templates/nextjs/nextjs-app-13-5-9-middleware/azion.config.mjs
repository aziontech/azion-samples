import { defineConfig } from 'azion';

export default defineConfig({
  build: {
    bundler: 'esbuild',
    preset: 'next',
  },
});

import { defineConfig } from 'azion';

export default defineConfig({
  build: {
    builder: 'esbuild',
    preset: 'next',
  },
});

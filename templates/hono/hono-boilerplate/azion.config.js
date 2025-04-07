import { defineConfig } from 'azion';

export default defineConfig({
  build: {
    entry: 'src/index.ts',
    worker: true,
    preset: 'typescript',
  },
});

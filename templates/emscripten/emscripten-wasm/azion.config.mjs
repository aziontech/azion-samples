import { defineConfig } from 'azion';

export default defineConfig({
  build: {
    polyfills: false,
    worker: false,
    preset: {
      name: 'emscripten',
    },
  },
});

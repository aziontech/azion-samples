import { defineConfig } from "azion";

export default defineConfig({
  build: {
    entry: "src/index.ts",
    preset: 'typescript',
    worker: true,
    polyfills: true
  }
});

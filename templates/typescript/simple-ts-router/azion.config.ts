import { defineConfig } from "azion";

export default defineConfig({
  build: {
    entry: "main.ts",
    preset: {
      name: "typescript",
    },
  },
});

import { defineConfig } from "azion";

export default defineConfig({
  build: {
    entry: "src/main.ts",
    worker: true,
    preset: 'typescript',
  },
  functions:[{
    name:"main",
    path:".edge/worker.js"
  }],
  rules: {
    request: [
      {
        name: "Execute Edge Function",
        active: true,
        match: "^\\/",
        behavior: {
            runFunction:"main"
        },
      },
    ],
    response: [
      {
        name: "CORS headers",
        active: true,
        match: "^\\/",
        behavior: {
          setHeaders: [
            "Access-Control-Allow-Origin: *",
            "Access-Control-Allow-Methods: POST, OPTIONS",
            "Access-Control-Request-Method: POST, OPTIONS",
            "Access-Control-Allow-Headers: Content-Type, Authorization",
            "Allow: POST, OPTIONS",
            "Content-Type: application/json",
            "Access-Control-Allow-Credentials: true",
          ],
        },
      },
    ],
  },
});
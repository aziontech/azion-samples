import { defineConfig } from "azion";

export default defineConfig({
  build: {
    entry: "main.ts",
    preset: 'typescript',
  },
  rules: {
    request: [
      {
        name: "Execute Edge Function",
        active: true,
        match: "^\\/",
        behavior: {
            runFunction:{
              path: ".edge/worker.js"
            }
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
            "Access-Control-Allow-Methods: GET, POST, HEAD, OPTIONS",
            "Access-Control-Request-Method: POST, GET, OPTIONS, HEAD",
            "Access-Control-Allow-Headers: Content-Type, Authorization",
            "Allow: POST, GET, OPTIONS, HEAD",
            "Content-Type: application/json",
            "Access-Control-Allow-Credentials: true",
          ],
        },
      },
    ],
  },
});
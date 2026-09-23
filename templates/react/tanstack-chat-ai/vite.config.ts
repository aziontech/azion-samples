import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import { defineConfig } from "vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

import { nitro } from "nitro/vite";

import { createRequire } from "module";
const require = createRequire(import.meta.url);

export default defineConfig(() => {
  return {
    server: {
      port: 3000,
    },
    resolve: {
      tsconfigPaths: true,
    },
    plugins: [
      tailwindcss(),
      nitro({
        preset: require.resolve("@aziontech/presets/nitro/preset"),
      }),
      tanstackStart(),
      viteReact(),
    ],
  };
});

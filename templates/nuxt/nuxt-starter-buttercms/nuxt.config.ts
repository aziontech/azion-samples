import { defineNuxtConfig } from "nuxt/config";

// https://v3.nuxtjs.org/docs/directory-structure/nuxt.config
export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      API_KEY: process.env.NUXT_ENV_BUTTER_API_TOKEN,
      PREVIEW: process.env.NUXT_ENV_BUTTER_PREVIEW ?? "true",
    },
  },
  css: [
    "~/assets/css/bootstrap.min.css",
    "~/assets/css/main.css",
    "~/assets/css/lineicons.css",
    "~/assets/css/tiny-slider.css",
  ],
  vite: {
    optimizeDeps: {
      exclude: ["plugins/ButterCMS.ts"],
    },
  },
});

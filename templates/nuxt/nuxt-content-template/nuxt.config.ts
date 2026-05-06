// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  app: {
    head: {
      charset: "utf-8",
      viewport: "width=device-width, initial-scale=1.0",
      title: "Nuxt Content Template",
      meta: [
        {
          name: "description",
          content:
            "A hand-crafted feature-rich document driven template powered by Nuxt and Nuxt Content.",
        },
      ],
      link: [
        {
          rel: "icon",
          type: "image/svg+xml",
          href: "/nuxt.svg",
        },
      ],
      htmlAttrs: {
        lang: "en",
      },
      bodyAttrs: {
        class: "dark:bg-slate-800 dark:text-gray-50 text-gray-800",
      },
    },
  },
  modules: [
    "@nuxt/content",
    "@nuxtjs/tailwindcss",
    "@nuxtjs/color-mode",
    "@nuxtjs/i18n",
    "@nuxt/image",
    "@nuxtjs/sitemap",
    "@nuxtjs/robots",
  ],
  tailwindcss: {
    configPath: "./tailwind.config.js",
    cssPath: "./assets/css/styles.scss",
    viewer: false,
  },
  content: {
    documentDriven: true,
    highlight: {
      theme: {
        default: "github-light",
        dark: "github-dark",
      },
      preload: ["cpp", "csharp", "rust", "wenyan", "yaml", "latex"],
    },
    markdown: {
      remarkPlugins: ["remark-math"],
      rehypePlugins: ["rehype-mathjax"],
    },
  },
  colorMode: { classSuffix: "" },
  i18n: {
    restructureDir: false,
    locales: [
      {
        code: "en",
        files: ["en.json"],
      },
      {
        code: "fr",
        files: ["fr.json"],
      },
    ],
    langDir: "locales",
    lazy: true,
    defaultLocale: "en",
    strategy: "no_prefix",
    compilation: {
      strictMessage: false,
    },
  },
  runtimeConfig: {
    public: {
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || "https://example.com",
      siteName: "Nuxt Content Template",
      siteDescription:
        "A Nuxt3 template built specifically for documentations and blogs.",
      language: "en",
    },
  },
  nitro: {
    preset: require.resolve("@aziontech/presets/nuxt/ssr"),
    rollupConfig: {
      external: ["jsdom"],
    },
  },
});

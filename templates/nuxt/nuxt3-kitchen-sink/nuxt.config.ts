// https://nuxt.com/docs/api/configuration/nuxt-config

import { createRequire } from 'module';
const require = createRequire(import.meta.url);

export default defineNuxtConfig({
  modules: ['@nuxt/content', '@nuxtjs/tailwindcss'],
  vue: {
    compilerOptions: {
      isCustomElement: (tag) => ['UseFetchDemo'].includes(tag),
    },
  },
  components: {
    global: true,
    dirs: ['~/components'],
  },
  content: {
    // https://content.nuxtjs.org/api/configuration
    highlight: {
      preload: ['javascript', 'vue', 'html'],
      theme: 'monokai',
    },
  },
  nitro: {
    preset: require.resolve('azion/preset/nuxt/ssr'),
  },
});

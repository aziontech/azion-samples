import { createRequire } from 'node:module'
import tailwindcss from '@tailwindcss/vite'

const require = createRequire(import.meta.url)

export default defineNuxtConfig({
  compatibilityDate: '2025-01-01',
  ssr: true,
  devServer: {
    port: 3000,
  },
  css: [
    '@aziontech/theme',
    '@aziontech/icons',
    '~/assets/styles/app.css',
  ],
  nitro: {
    preset: require.resolve('@aziontech/presets/nuxt/ssr'),
  },
  app: {
    pageTransition: { name: 'fade', mode: 'out-in' },
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      title: 'AI Chat · Azion',
      htmlAttrs: {
        'data-theme': 'dark',
      },
      link: [
        { rel: 'icon', href: '/favicon.ico' },
      ],
    },
  },
  typescript: {
    strict: true,
  },
  vite: {
    plugins: [tailwindcss()],
  },
})

import { defineConfig } from 'astro/config';
import vue from '@astrojs/vue';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

import { astroDocsExpressiveCode } from './src/integrations/expressive-code.js';

const productionBuild = import.meta.env.PROD;

export default defineConfig({
  site: 'https://www.azion.com/',
  build: {
    assets: '_astro',
    inlineStylesheets: 'always',
  },
  integrations: [
    astroDocsExpressiveCode(),
    tailwind({ applyBaseStyles: false }),
    vue({ appEntrypoint: '/src/_vue.config.js' }),
    sitemap()
  ],
  compressHTML: productionBuild ? true : false,
  trailingSlash: 'always',
  vite: {
    ssrBuild: true,
    server: {
      fs: {
        allow: ['..']
      }
    },
    ssr: {
      noExternal: [
        '@astrojs/vue',
        '@aziontech/azion-web-kit'
      ],
      external: [
        'algoliasearch',
        'instantsearch.js',
        'vue-instantsearch/vue3/es',
      ]
    }
  }
});

import { viteBundler } from '@vuepress/bundler-vite'
import { catalogPlugin } from '@vuepress/plugin-catalog'
import { markdownImagePlugin } from '@vuepress/plugin-markdown-image'
import { markdownMathPlugin } from '@vuepress/plugin-markdown-math'
import { shikiPlugin } from '@vuepress/plugin-shiki'
import { defaultTheme } from '@vuepress/theme-default'
import { slug as slugify } from 'github-slugger'
import process from 'node:process'
import { defineUserConfig } from 'vuepress'
import { mdEnhancePlugin } from 'vuepress-plugin-md-enhance'
import { searchProPlugin } from 'vuepress-plugin-search-pro'
import { getDirname, path } from 'vuepress/utils'

const __dirname = getDirname(import.meta.url)
const isProd = process.env.NODE_ENV === 'production'
const ROOT_PATH = path.resolve(__dirname, '../..')
const CURRENT_PATH = path.resolve(__dirname, '.')
const USER_NAME = 'Sun-ZhenXing'
const BASE_PATH = '/vuepress-solid-template/'

export default defineUserConfig({
  alias: {
    '@': CURRENT_PATH,
  },
  //base: BASE_PATH,
  bundler: viteBundler({
    // BUG: https://github.com/mermaid-js/mermaid/issues/4320
    viteOptions: {
      optimizeDeps: {
        include: [
          'mermaid',
        ],
      },
      css: {
        preprocessorOptions: {
          scss: { api: 'modern-compiler' },
        },
      },
    },
  }),
  description: 'Best VuePress Template',
  head: [
    ['link', { href: `${BASE_PATH}favicon.svg`, rel: 'icon' }],
  ],
  lang: 'en-US',
  markdown: {
    anchor: {
      level: [1, 2, 3, 4, 5, 6],
      slugify,
    },
    importCode: {
      handleImportPath: str => str
        .replace(/^\//, ROOT_PATH.replace(/(?:\\|\/)?$/, '/'))
        .replace(/^@\//, CURRENT_PATH.replace(/(?:\\|\/)?$/, '/')),
    },
  },
  plugins: [
    mdEnhancePlugin({
      align: true,
      attrs: true,
      component: true,
      delay: 200,
      footnote: true,
      gfm: true,
      include: {
        resolvePath: (file) => {
          if (file.startsWith('@/'))
            return file.replace(/^@\//, CURRENT_PATH)
          if (file.startsWith('/'))
            return file.replace(/^\//, ROOT_PATH.replace(/(?:\\|\/)?$/, '/'))
          return file
        },
      },
      linkify: false,
      mark: true,
      mermaid: true,
      stylize: [
        {
          matcher: '@recommend',
          replacer: ({ tag }) => {
            if (tag === 'em') {
              return {
                attrs: { type: 'tip' },
                content: 'Recommend',
                tag: 'Badge',
              }
            }
          },
        },
      ],
      sub: true,
      sup: true,
      tasklist: true,
      vPre: true,
    }, false),
    searchProPlugin({}),
    catalogPlugin({}),
    markdownImagePlugin({
      lazyload: true,
      figure: true,
    }),
    markdownMathPlugin({
      type: 'katex',
      copy: true,
    }),
    shikiPlugin({ theme: 'dark-plus' }),
  ],
  theme: defaultTheme({
    docsDir: 'docs',
    logo: '/favicon.svg',
    navbar: [
      {
        children: [
          {
            link: '/demo/',
            text: 'Vuepress Solid Template',
          },
        ],
        text: 'Demo for Vuepress Solid',
      },
    ],
    repo: `${USER_NAME}${BASE_PATH}`,
    sidebar: {
      '/demo/': [
        {
          children: [
            '/demo/page01.md',
            '/demo/page02.md',
          ],
          text: 'Demo',
        },
      ],
    },
    themePlugins: {
      git: isProd,
      hint: {
        alert: true,
      },
      tab: {
        tabs: true,
        codeTabs: true,
      },
    },
  }),
  title: 'VuePress Solid Template',
})

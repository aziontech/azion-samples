import { dateSorter } from "@vuepress/helper";
import { hopeTheme } from "vuepress-theme-hope";

import { enNavbar, zhNavbar } from "./navbar/index.js";
import { enSidebar, zhSidebar } from "./sidebar/index.js";

export default hopeTheme(
  {
    hostname: "https://your.domain",

    author: {
      name: "Your name",
      url: "https://your.domain",
    },

    iconAssets: "fontawesome-with-brands",

    logo: "https://theme-hope-assets.vuejs.press/logo.svg",

    repo: "vuepress-theme-hope/online-demo",
    docsDir: "blog",

    blog: {
      medias: {
        Baidu: "https://example.com",
        BiliBili: "https://example.com",
        Bitbucket: "https://example.com",
        Dingding: "https://example.com",
        Discord: "https://example.com",
        Dribbble: "https://example.com",
        Email: "mailto:info@example.com",
        Evernote: "https://example.com",
        Facebook: "https://example.com",
        Flipboard: "https://example.com",
        Gitee: "https://example.com",
        GitHub: "https://example.com",
        Gitlab: "https://example.com",
        Gmail: "mailto:info@example.com",
        Instagram: "https://example.com",
        Lark: "https://example.com",
        Lines: "https://example.com",
        Linkedin: "https://example.com",
        Pinterest: "https://example.com",
        Pocket: "https://example.com",
        QQ: "https://example.com",
        Qzone: "https://example.com",
        Reddit: "https://example.com",
        Rss: "https://example.com",
        Steam: "https://example.com",
        Twitter: "https://example.com",
        Wechat: "https://example.com",
        Weibo: "https://example.com",
        Whatsapp: "https://example.com",
        Youtube: "https://example.com",
        Zhihu: "https://example.com",
        VuePressThemeHope: {
          icon: "https://theme-hope-assets.vuejs.press/logo.svg",
          link: "https://theme-hope.vuejs.press",
        },
      },
    },

    locales: {
      "/": {
        // Navbar
        navbar: enNavbar,

        // Sidebar
        sidebar: enSidebar,

        footer: "Default footer",

        displayFooter: true,

        blog: {
          description: "A FrontEnd programmer",
          intro: "/intro.html",
        },

        blogLocales: {
          tutorial: "Tutorial",
        },

        metaLocales: {
          editLink: "Edit this page on GitHub",
        },
      },

      /**
       * Chinese locale config
       */
      "/zh/": {
        // Navbar
        navbar: zhNavbar,

        // Sidebar
        sidebar: zhSidebar,

        footer: "默认页脚",

        displayFooter: true,

        blog: {
          description: "一个前端开发者",
          intro: "/zh/intro.html",
        },

        blogLocales: {
          tutorial: "教程",
        },

        // Page meta
        metaLocales: {
          editLink: "在 GitHub 上编辑此页",
        },
      },
    },

    encrypt: {
      config: {
        "/demo/encrypt.html": ["1234"],
        "/zh/demo/encrypt.html": ["1234"],
      },
    },

    // enable it to preview all changes in time
    // hotReload: true,

    plugins: {
      blog: {
        type: [
          {
            key: "tutorial",
            filter: (page): boolean =>
              Boolean(page.filePathRelative?.includes("demo/")),
            sorter: (pageA, pageB): number =>
              dateSorter(pageA.frontmatter.date, pageB.frontmatter.date),
            layout: "BlogType",
          },
        ],
      },

      // install @waline/client before enabling it
      // WARNING: This is a test server for demo only.
      // You should create and use your own comment service in production.
      // comment: {
      //   provider: "Waline",
      //   serverURL: "https://waline-comment.vuejs.press",
      // },

      components: {
        components: ["Badge", "VPCard"],
      },

      markdownImage: {
        figure: true,
        lazyload: true,
        size: true,
      },

      // install katex or before enabling it
      // markdownMath: {
      //   type: "katex" // or "mathjax"
      // },

      markdownTab: true,

      // All features are enabled for demo, only preserve features you need here
      mdEnhance: {
        align: true,
        attrs: true,
        component: true,
        demo: true,
        include: true,
        mark: true,
        spoiler: true,
        stylize: [
          {
            matcher: "Recommended",
            replacer: ({ tag }) => {
              if (tag === "em")
                return {
                  tag: "Badge",
                  attrs: { type: "tip" },
                  content: "Recommended",
                };
            },
          },
        ],
        sub: true,
        sup: true,
        tasklist: true,
        vPre: true,

        // install chart.js before enabling it
        // chart: true,

        // insert component easily

        // install echarts before enabling it
        // echarts: true,

        // install flowchart.ts before enabling it
        // flowchart: true,

        // gfm requires mathjax-full to provide tex support
        // gfm: true,

        // install mermaid before enabling it
        // mermaid: true,

        // playground: {
        //   presets: ["ts", "vue"],
        // },

        // install @vue/repl before enabling it
        // vuePlayground: true,
      },

      // uncomment these if you want a PWA
      // pwa: {
      //   favicon: "/favicon.ico",
      //   cacheHTML: true,
      //   cacheImage: true,
      //   appendBase: true,
      //   apple: {
      //     icon: "/assets/icon/apple-icon-152.png",
      //     statusBarColor: "black",
      //   },
      //   msTile: {
      //     image: "/assets/icon/ms-icon-144.png",
      //     color: "#ffffff",
      //   },
      //   manifest: {
      //     icons: [
      //       {
      //         src: "/assets/icon/chrome-mask-512.png",
      //         sizes: "512x512",
      //         purpose: "maskable",
      //         type: "image/png",
      //       },
      //       {
      //         src: "/assets/icon/chrome-mask-192.png",
      //         sizes: "192x192",
      //         purpose: "maskable",
      //         type: "image/png",
      //       },
      //       {
      //         src: "/assets/icon/chrome-512.png",
      //         sizes: "512x512",
      //         type: "image/png",
      //       },
      //       {
      //         src: "/assets/icon/chrome-192.png",
      //         sizes: "192x192",
      //         type: "image/png",
      //       },
      //     ],
      //     shortcuts: [
      //       {
      //         name: "Demo",
      //         short_name: "Demo",
      //         url: "/demo/",
      //         icons: [
      //           {
      //             src: "/assets/icon/guide-maskable.png",
      //             sizes: "192x192",
      //             purpose: "maskable",
      //             type: "image/png",
      //           },
      //         ],
      //       },
      //     ],
      //   },

      // install @vuepress/plugin-revealjs before enabling it
      // revealjs: {
      //   plugins: ["highlight", "math", "search", "notes", "zoom"],
      // },
    },
  },
  { custom: true },
);

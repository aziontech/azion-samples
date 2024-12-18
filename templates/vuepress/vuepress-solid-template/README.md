# *Solid*: a VuePress 2 Template

![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/Sun-ZhenXing/vuepress-solid-template/deploy-docs.yml?branch=main)

🌐 [**中文文档**](./README.zh.md) | 🚀 [**Demo Page**](https://blog.alexsun.top/vuepress-solid-template/)

## *Solid* is not *Solid.js*! *Solid* is a VuePress2-powered static site generator

Best VuePress2 Template. Get a beautiful and configured default theme document in a minute.

Features:

- 🎉 VuePress 2 (Vue 3 + Vite 5 + TypeScript)
- ✨ [VuePress MarkDown Enhance](https://vuepress-theme-hope.github.io/v2/md-enhance/)
  - 📖 Support LaTeX math formulas (use [KaTeX](https://katex.org/))
  - 📈 [Mermaid](https://theme-hope.vuejs.press/guide/markdown/mermaid.html) (**optional**, installed by default)
  - 💡 [chartjs](https://vuepress-theme-hope.github.io/v2/md-enhance/guide/chart/chartjs.html) (**optional**, please refer to the [VuePress MarkDown Enhance](https://vuepress-theme-hope.github.io/v2/md-enhance/))
  - 📊 [Echarts](https://theme-hope.vuejs.press/guide/markdown/echarts.html) (**optional**, please refer to the [VuePress MarkDown Enhance](https://vuepress-theme-hope.github.io/v2/md-enhance/))
  - 🎞️ [Presentation](https://theme-hope.vuejs.press/guide/markdown/revealjs.html) (use `reveal.js`, **optional**, please refer to the [VuePress MarkDown Enhance](https://vuepress-theme-hope.github.io/v2/md-enhance/))
  - 📐 [Flowchart](https://theme-hope.vuejs.press/guide/markdown/flowchart.html) (**optional**, please refer to the [VuePress MarkDown Enhance](https://vuepress-theme-hope.github.io/v2/md-enhance/))
- 📋 Copy code support
- 📜 Auto catalog generation
- 🔍 Static search support
- 🎇 Auto format

## 1. Start

```bash
git clone https://github.com/Sun-ZhenXing/vuepress-solid-template
cd vuepress-solid-template
pnpm i
pnpm dev
```

The only thing you need to do is to configure `docs/.vuepress/config.ts`:

1. change `USER_NAME` to yours.
2. change `BASE_PATH` to your repo name.

## 2. Uploading code to remote repo

Change `${YOUR_REPO}` to the address of your remote repository.

```bash
cd vuepress-my-docs
rm -rf .git && git init && git add .
git commit -m "init from Sun-ZhenXing/vuepress-solid-template"
git remote add origin ${YOUR_REPO}
git branch -M main
git push -u origin main
```

## 3. Build

Build with `pnpm`:

```bash
pnpm i
pnpm build
```

You can find the generated static files in `docs/.vuepress/dist`.

Build with Docker:

```bash
docker build -t vuepress-solid-template .
docker run -itd -p 80:80 vuepress-solid-template
```

Now you can visit <http://localhost> to see your document.

## 4. How to config GitHub Pages?

If you don't want it, reomve `.github/workflows/` file.

When building in GitHub Actions for the first time, an error will be reported and an email will be sent to you. Don't panic because you haven't set up GitHub Pages yet.

If you need to open GitHub Pages:

1. Open your GitHub repo page
2. Click `Settings`
3. Click `Actions`, then click `General`
4. Find `Workflow permissions`, select `Read and write permissions`, save
5. If you have not successfully executed GitHub Actions at this time, you need to manually execute them once. Open the actions you just created and click `re-run all jobs`
6. Click `Pages` on the sidebar, goto `Build and deployment`
7. Config as `Branch: gh-pages /(root)`, or force HTTPS, save

It will create **GitHub Pages** automatically.

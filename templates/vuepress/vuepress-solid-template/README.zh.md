# *Solid*: 一个 VuePress 2 模板

![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/Sun-ZhenXing/vuepress-solid-template/deploy-docs.yml?branch=main)

🚀 [立刻查看 Demo 页面](https://blog.alexsun.top/vuepress-solid-template/).

## **Solid** 不是 **Solid.js**！VuePress2 是 Vue3 驱动的静态网站生成器

最佳 VuePress2 模板，在几分钟之内获得一个精美的、已经配置好的默认主题文档。

特征：

- 🎉 VuePress 2 (Vue 3 + Vite 5 + TypeScript)
- ✨ [VuePress MarkDown Enhance](https://vuepress-theme-hope.github.io/v2/md-enhance/)
  - 📖 支持 LaTeX 数学公式（使用 [KaTeX](https://katex.org/)）
  - 📈 [Mermaid](https://theme-hope.vuejs.press/guide/markdown/mermaid.html)（**可选**，默认安装）
  - 💡 [chartjs](https://vuepress-theme-hope.github.io/v2/md-enhance/guide/chart/chartjs.html)（**可选**，请参考 [VuePress MarkDown Enhance](https://vuepress-theme-hope.github.io/v2/md-enhance/)）
  - 📊 [Echarts](https://theme-hope.vuejs.press/guide/markdown/echarts.html)（**可选**，请参考 [VuePress MarkDown Enhance](https://vuepress-theme-hope.github.io/v2/md-enhance/)）
  - 🎞️ [Presentation](https://theme-hope.vuejs.press/guide/markdown/revealjs.html)（使用 `reveal.js`，**可选**，请参考 [VuePress MarkDown Enhance](https://vuepress-theme-hope.github.io/v2/md-enhance/)）
  - 📐 [Flowchart](https://theme-hope.vuejs.press/guide/markdown/flowchart.html)（**可选**，请参考 [VuePress MarkDown Enhance](https://vuepress-theme-hope.github.io/v2/md-enhance/)）
  - 📋 代码复制支持
  - 📜 自动生成目录
  - 🔍 静态搜索支持
  - 🎇 自动格式化

## 1. 开始

```bash
git clone https://github.com/Sun-ZhenXing/vuepress-solid-template
cd vuepress-solid-template
pnpm i
pnpm dev
```

你唯一要做的是 `docs/.vuepress/config.ts`：

1. 将 `USER_NAME` 修改为你的用户名
2. 将 `BASE_PATH` 修改为你的仓库路径

## 2. 上传代码到远程仓库

将 `${YOUR_REPO}` 改为你的远程仓库地址。

```bash
cd vuepress-my-docs
rm -rf .git && git init && git add .
git commit -m "init from Sun-ZhenXing/vuepress-solid-template"
git remote add origin ${YOUR_REPO}
git branch -M main
git push -u origin main
```

## 3. 构建

使用 `pnpm` 构建：

```bash
pnpm i
pnpm build
```

内容将生成在 `docs/.vuepress/dist` 下。

使用 Docker 构建：

```bash
docker build -t vuepress-solid-template .
docker run -itd -p 80:80 vuepress-solid-template
```

现在你可以访问 <http://localhost> 来查看你的文档。

## 4. 如何设置 GitHub Pages？

如果你不需要，可以删除 `.github/workflows/` 下的文件。

第一次在 GitHub Actions 中构建时会报错并发邮件给你，不要惊慌，这是因为你还没有设置 GitHub Pages。

如果你想打开 GitHub Pages：

1. GitHub 打开你的项目主页页面
2. 点击 `Settings`
3. 点击 `Actions`，然后点击 `General`
4. 找到 `Workflow permissions`，然后选中 `Read and write permissions`，保存
5. 如果此时你还没有成功执行过 GitHub Actions，那么你需要手动执行一次，打开刚刚的 Actions，点击 `re-run all jobs`
6. 然后点击侧边栏的 `Pages`，然后到 `Build and deployment` 下面
7. 设置 `Branch: gh-pages /(root)`，可选的 HTTPS，保存

这将自动创建 **GitHub Pages**。

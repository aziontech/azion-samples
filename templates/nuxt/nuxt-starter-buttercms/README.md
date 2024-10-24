![recommended node version](https://img.shields.io/badge/node-v16-green)

# Nuxt.js + ButterCMS Starter Project

This Nuxt.js starter project fully integrates with dynamic sample content from your ButterCMS account, including main menu, pages, blog posts, categories, and tags, all with a beautiful, custom theme with already-implemented search functionality. All of the included sample content is automatically created in your account dashboard when you sign up for a free trial of ButterCMS.

## 1. Installation

First, clone the repo and install the dependencies by running `npm install`
```shell
git clone https://github.com/ButterCMS/nuxtjs-starter-buttercms
cd nuxtjs-starter-buttercms
npm install
```

## 2. Set API Token

To fetch your ButterCMS content, add your API token as an environment variable.

```bash
$ echo 'NUXT_ENV_BUTTER_API_TOKEN=<Your API Token>' >> .env
```

## 3. Run local server

To view the app in the browser, you'll need to run the local development server:

```bash
$ npm run dev
```

Congratulations! Your starter project is now live at [http://localhost:3000/](http://localhost:3000/).

## 4. Previewing Draft Changes
By default, your starter project is set up to allow previewing of draft changes saved in your ButterCMS.com account. To disable this functionality, set the following value in your .env file: NUXT_ENV_BUTTER_PREVIEW=false
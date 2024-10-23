![recommended node version](https://img.shields.io/badge/node-v16-green)

# Vue.js + ButterCMS Starter Project

This Vue.js starter project fully integrates with dynamic sample content from your ButterCMS account, including main menu, pages, blog posts, categories, and tags, all with a beautiful, custom theme with already-implemented search functionality. All of the included sample content is automatically created in your account dashboard when you sign up for a free trial of ButterCMS.

You can view a [live demo hosted on Vercel](http://vuejs-starter-buttercms.vercel.app/), or you can click the button below to deploy your own copy of our starter project to the provider of your choice.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FButterCMS%2Fvuejs-starter-buttercms&env=VITE_APP_BUTTER_CMS_API_KEY&envDescription=Your%20ButterCMS%20API%20Token&envLink=https%3A%2F%2Fbuttercms.com%2Fsettings%2F&project-name=vuejs-starter-buttercms&repo-name=vuejs-starter-buttercms&redirect-url=https%3A%2F%2Fbuttercms.com%2Fonboarding%2Fvercel-starter-deploy-callback%2F&production-deploy-hook=Deploy%20Triggered%20from%20ButterCMS&demo-title=ButterCMS%20Vue.js%20Starter%20Demo&demo-description=Fully%20integrated%20with%20your%20ButterCMS%20account&demo-url=http%3A%2F%2Fvuejs-starter-buttercms.vercel.app%2F&repository-name=vuejs-starter-buttercms&demo-image=https://cdn.buttercms.com/r0tGK8xFRti2iRKBJ0eY)
[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/ButterCMS/vuejs-starter-buttercms&env%5BVITE_APP_BUTTER_CMS_API_KEY%5D=check%20https://buttercms.com/settings)

## 1. Installation

First, clone the repo and install the dependencies by running `npm install`
```shell
git clone https://github.com/ButterCMS/vuejs-starter-buttercms
cd vuejs-starter-buttercms
npm install
```

### 2. Set API Token

To fetch your ButterCMS content, add your API token as an environment variable.

```bash
$ echo 'VITE_APP_BUTTER_CMS_API_KEY=<Your API Token>' >> .env
```

### 3. Run local server

To view the app in the browser, you'll need to run the local development server:

```bash
$ npm run start
```

Congratulations! Your starter project is now live at [http://localhost:3000/](http://localhost:3000/).

## 4. Deploy
Deploy your Vue.js app using Vercel, the creators of Next.js, or with Heroku. With the click of a button, you'll create a copy of our starter project in your Git provider account, instantly deploy it, and institute a full content workflow connected to your ButterCMS account. Smooth.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FButterCMS%2Fvuejs-starter-buttercms&env=VITE_APP_BUTTER_CMS_API_KEY&envDescription=Your%20ButterCMS%20API%20Token&envLink=https%3A%2F%2Fbuttercms.com%2Fsettings%2F&project-name=vuejs-starter-buttercms&repo-name=vuejs-starter-buttercms&redirect-url=https%3A%2F%2Fbuttercms.com%2Fonboarding%2Fvercel-starter-deploy-callback%2F&production-deploy-hook=Deploy%20Triggered%20from%20ButterCMS&demo-title=ButterCMS%20Vue.js%20Starter%20Demo&demo-description=Fully%20integrated%20with%20your%20ButterCMS%20account&demo-url=http%3A%2F%2Fvuejs-starter-buttercms.vercel.app%2F&repository-name=vuejs-starter-buttercms&demo-image=https://cdn.buttercms.com/r0tGK8xFRti2iRKBJ0eY)
[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/ButterCMS/vuejs-starter-buttercms&env%5BVITE_APP_BUTTER_CMS_API_KEY%5D=check%20https://buttercms.com/settings)

## 5. Previewing Draft Changes
By default, your starter project is set up to allow previewing of draft changes saved in your ButterCMS.com account. To disable this functionality, set the following value in your .env file: VITE_APP_BUTTER_CMS_PREVIEW=false
# Gatsby + ButterCMS Starter Project

This Gatsby starter project fully integrates with dynamic sample content from your ButterCMS account, including main menu, pages, blog posts, categories, and tags, and all with a beautiful, custom theme with already-implemented search functionality. All of the included sample content is automatically created in your account dashboard when you sign up for a free trial of ButterCMS.

[![Deploy with Heroku](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/ButterCMS/gatsbyjs-starter-buttercms&env%5BBUTTER_CMS_API_KEY%5D=check%20https://buttercms.com/settings)

### 1. Installation

First, clone the repo and install the dependencies by running `npm install`

```bash
git clone https://github.com/ButterCMS/gatsbyjs-starter-buttercms.git
cd gatsbyjs-starter-buttercms
npm install
```

### 2. Set API Token

To fetch your ButterCMS content, add your API token as an environment variable.

```bash
$ echo 'BUTTER_CMS_API_KEY=<Your API Token>' >> .env
```

### 3. Run local server

To view the app in the browser, you'll need to run the local development server:

```bash
$ npm run develop
```

Congratulations! Your starter project is now live at [http://localhost:8000/](http://localhost:8000/).

### 4. Webhooks

In order for your deployed app to pull in content changes from your ButterCMS account, you'll need to follow your hosting provider's steps for setting up webhooks. The ButterCMS webhook settings are located at https://buttercms.com/webhooks/. 

### 5. Previewing Draft Changes

By default, your starter project is set up to allow previewing of draft changes saved in your ButterCMS.com account. To disable this functionality, set the following value in your .env file: BUTTER_CMS_PREVIEW=false

Note that if you deployed with heroku and you want to use the iframe previewing ability on the ButterCMS.com website, you'll need to include trailing slashes when specifying your URLS in
[your ButterCMS.com settings](https://buttercms.com/settings/previews).

```
mydomain.com/blog/<slug>   <-- Won't work for previewing
mydomain.com/blog/<slug>/  <-- Will work for previewing.
```


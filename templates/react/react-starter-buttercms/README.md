![recommended node version](https://img.shields.io/badge/node-v16-green)

# React + ButterCMS Starter Project

This React starter project fully integrates with dynamic sample content from your ButterCMS account, including main menu, pages, blog posts, categories, and tags, all with a beautiful, custom theme with already-implemented search functionality. All of the included sample content is automatically created in your account dashboard when you sign up for a free trial of ButterCMS.

## 1. Installation

First, clone the repo and install the dependencies by running `npm install`

```bash
git clone https://github.com/ButterCMS/react-starter-buttercms.git
cd react-starter-buttercms
npm install
```

## 2. Set API Token

To fetch your ButterCMS content, add your API token as an environment variable.

```bash
$ echo 'REACT_APP_BUTTER_CMS_API_KEY=<Your API Token>' >> .env
```

## 3. Run local server

To view the app in the browser, you'll need to run the local development server:

```bash
$ npm run start
```

Congratulations! Your starter project is now live at [http://localhost:3000/](http://localhost:3000/).

## 4. Webhooks

The ButterCMS webhook settings are located at https://buttercms.com/webhooks/

## 5. Previewing Draft Changes

By default, your starter project is set up to allow previewing of draft changes saved in your ButterCMS.com account. To disable this functionality, set the following value in your .env file: REACT_APP_BUTTER_CMS_PREVIEW=false

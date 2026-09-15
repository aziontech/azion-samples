![recommended node version](https://img.shields.io/badge/node-v22-green)

# Angular + ButterCMS Starter Project

This Angular starter project fully integrates with dynamic sample content from your ButterCMS account, including main menu, pages, blog posts, categories, and tags, all with a beautiful, custom theme with already-implemented search functionality. All of the included sample content is automatically created in your account dashboard when you sign up for a free trial of ButterCMS.


## Technical Details and Requirements

### Browser Compatibility

The application targets ES2022, which is supported by all modern browsers. For specific browser support, see the [Angular browser support guide](https://angular.dev/reference/versions).


## 1. Installation

First, clone the repo and install the dependencies by running `npm install`

```bash
git clone https://github.com/ButterCMS/angular-starter-buttercms
cd angular-starter-buttercms
npm install
```

### 2. Set API Token

To fetch your ButterCMS content, add your API token as an environment variable.

```bash
$ echo 'NG_APP_ANGULAR_BUTTER_CMS_API_KEY=<Your API Token>' >> .env
```

### 3. Run local server

To view the app in the browser, you'll need to run the local development server:

```bash
$ npm run start
```

Congratulations! Your starter project is now live at [http://localhost:4200/](http://localhost:4200/).

## 4. Deploy on Azion

Deploy your Angular app using Azion with a single click, you'll create a copy of our starter project in your Git provider account, instantly deploy it, and institute a full content workflow connected to your ButterCMS account. Smooth.

[![Deploy Button](https://www.azion.com/button.svg)](https://console.azion.com/create/buttercms/angular-starter "Deploy with Azion")

### 5. Webhooks

The ButterCMS webhook settings are located at https://buttercms.com/webhooks/

### 6. Previewing Draft Changes

By default, your starter project is set up to allow previewing of draft changes saved in your ButterCMS.com account. To disable this functionality, set the following value in your .env file: NG_APP_ANGULAR_BUTTER_CMS_PREVIEW=false

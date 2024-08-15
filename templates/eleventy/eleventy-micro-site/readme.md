![Microsite GitHub Banner](./assets/banner.jpg)

Opinionated micro front-end that can be used to _create a one-pager_.  Great for landing pages or sign-up pages. It uses the static site generator [Eleventy (11ty)][11ty] under the hood and sets _common 11ty defaults_.

## Features ✨

* Inlines and minifies CSS using [`clean-css`][css]
* Inlines and minifies JavaScript using [`terser`][terser]
* Includes a `metadata.json` [global data file][data]
* Includes a `base.njk` [layout template][layout]
* Includes a `assets folder` for [static files][copy] (images, fonts etc.)

> This is a _*skeleton project_ so it doesn't include any components or basic styling. It's a _*bring your own_ front-end.

## Usage

1. Update the `metadata.json` file with your own site details
2. Edit the `index.njk` file and start coding your website!

##  Deploy Your Own

Deploy your own 11ty project with Azion.

[![Deploy Button](/static/button.png)](https://console.azion.com/create/11ty/11ty-micro-site "Deploy with Azion")

## Project Structure

```
micro-site/
├── _site/                // output folder of 11ty
├── _data/
│   └── metadata.json     // metadata for the website
├── _includes/
│   ├── style.css         // minified and inlined
│   ├── script.js         // minified and inlined
│   └── base.njk          // base layout
├── assets/               // passtrough copy
├── index.njk/            // landing page
└── .eleventy.js          // 11ty configurations
```

## Roadmap

- [ ] Image optimization with `eleventy-image`
- [ ] Asset caching with `eleventy-cache-assets`
- [ ] Syntax highlighting support with `eleventy-plugin-syntaxhiglight`
## License

[MIT][license] © [Danny de Vries][author]

[11ty]: https://www.11ty.io/]
[nunjucks]: https://mozilla.github.io/nunjucks/
[deploy]: https://app.netlify.com/start/deploy?repository=https://github.com/voightco/micro-site
[css]: https://github.com/jakubpawlowicz/clean-css
[terser]: https://github.com/terser/terser
[data]: https://www.11ty.dev/docs/data/
[layout]: https://www.11ty.dev/docs/layouts/
[copy]: https://www.11ty.dev/docs/copy/
[author]: https://github.com/dandevri
[license]: license

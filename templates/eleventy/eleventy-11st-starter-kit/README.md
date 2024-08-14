# 📦 11st-Starter-Kit

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

[11ty](https://www.11ty.dev/), powered by [Vite](https://vitejs.dev/)
with [Tailwind CSS](https://tailwindcss.com) and
[Alpine.js](https://github.com/alpinejs/alpine/).

##  Deploy Your Own

Deploy your own 11ty project with Azion.

[![Deploy Button](/static/button.png)](https://console.azion.com/create/11ty/11ty-stater-kit "Deploy with Azion")


## Code Quality

By default `CSS` and `JavaScript` is getting linted with every commit.

You can lint manually by running `npm run lint` and if errors occur you can try to fix them automatically by running `npm run format`.

With every pull request it is checked if the code can be build without errors and afterwards `CSS` and `JavaScript` is getting linted.

Additionally each page is audited by Lighthouse which can take some time. You can find the performance budget for this audit in the file `./budget.json`.

## License

This project is open source and available under the [MIT License](LICENSE).

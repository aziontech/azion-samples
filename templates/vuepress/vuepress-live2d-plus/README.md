# vuepress-plugin-live2d-plus

## 简介

vuepress-plugin-live2d-plus 是一个基于 Vuepress 2.x 的插件，它可以帮助你集成Live2D看板娘。

## 提示
已支持vuepress@2.0.0-beta.51版本

## 安装

```bash
npm install -D vuepress-plugin-live2d-plus
yarn add -D vuepress-plugin-live2d-plus
```


## 用法

.vuepress/config.js文件中使用插件

```js
import { live2dPlugin } from 'vuepress-plugin-live2d-plus'

plugins: [
  live2dPlugin()
]
```

自定义参数

```js
plugins: [
  live2dPlugin({
    enable: true,
    model: {
      url: 'https://raw.githubusercontent.com/iCharlesZ/vscode-live2d-models/master/model-library/hibiki/hibiki.model.json'
    },
    display: {
      position: 'right',
      width: '135px',
      height: '300px',
      xOffset: '35px',
      yOffset: '5px'
    },
    mobile: {
      show: true
    },
    react: {
      opacity: 0.8
    }
  })
]
```


## 模型
使用了 [vscode-live2d-models](https://github.com/iCharlesZ/vscode-live2d-models#url) 中的模型，把 `model.url` 改为指定的模型地址即可。


## 感谢
vuepress-plugin-live2d-plus 参考了 [vuepress-plugin-helper-live2d](https://github.com/JoeyBling/vuepress-plugin-helper-live2d)


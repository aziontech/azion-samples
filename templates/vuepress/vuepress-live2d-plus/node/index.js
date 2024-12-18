import { path, getDirname } from '@vuepress/utils'

const __dirname = getDirname(import.meta.url)

const defaultLive2dOptions = {
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
}

export const live2dPlugin = (live2dOptions = {}, app) => {
  return {
    name: 'vuepress-plugin-live2d-plus',
    clientConfigFile: path.resolve(__dirname, '../client/config.js'),
    define: {
      __LIVE2D_OPTIONS__: { ...defaultLive2dOptions, ...live2dOptions }
    }
  }
}

export default live2dPlugin

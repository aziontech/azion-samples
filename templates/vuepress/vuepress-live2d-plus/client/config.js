import { defineClientConfig } from '@vuepress/client'
import { onMounted } from 'vue'
import Live2d from './components/live2d'
import './styles/index.scss'

const live2dOptions = __LIVE2D_OPTIONS__

export default defineClientConfig({
  enhance({ app }) {},
  setup() {
    onMounted(() => {
      init()
    })

    function init() {
      setTimeout(() => {
        if (!document) return
        Live2d.init({ live2dOptions })
      }, 500)
    }
  },
  rootComponents: []
})

/**
 * ==== styles block ====
 */
import 'primeicons/primeicons.css'
import 'primeflex/primeflex.css'
import './assets/main.css'
import 'azion-theme'
import './assets/icons/azionicons.scss'
import './assets/markdown.css'

/** ====================== */

import { createApp } from 'vue'
import PrimeVue from 'primevue/config'
import Tooltip from 'primevue/tooltip'
import ToastService from 'primevue/toastservice'
import App from './App.vue'

const getConfigDefaults = () => ({
  theme: import.meta.env.VITE_THEME || 'light',
  serverUrl: {
    url: import.meta.env.VITE_COPILOT_ENDPOINT
  },
  suggestionsOptions: [
    {
      icon: 'pi pi-question-circle',
      title: 'How can you help me?',
      context: 'How can you help me?'
    }
  ],
  title: import.meta.env.VITE_TITLE || '',
  subTitle: import.meta.env.VITE_SUBTITLE || '',
  isOpenByDefault: true,
  isMaximizedByDefault: true,
  previewText: import.meta.env.VITE_PREVIEW_TEXT || '',
  footerDisclaimer: import.meta.env.VITE_FOOTER_DISCLAIMER || ''
})

const CONFIG_DEFAULT = getConfigDefaults()

const app = createApp(App, CONFIG_DEFAULT)

document.documentElement.className = `azion azion-${CONFIG_DEFAULT.theme}`

document.title = CONFIG_DEFAULT.title || 'Copilot'

app.use(PrimeVue)
app.directive('tooltip', Tooltip)
app.use(ToastService)

app.mount('#app')

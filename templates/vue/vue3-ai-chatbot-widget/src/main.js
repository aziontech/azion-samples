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
import { AuthService } from './services/auth'

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
  footerDisclaimer: import.meta.env.VITE_FOOTER_DISCLAIMER || '',
  clerkPublicKey: import.meta.env.VITE_CLERK_PUBLISHABLE_KEY,
  authMode: import.meta.env.VITE_AUTH_MODE
})

const CONFIG_DEFAULT = getConfigDefaults()

document.documentElement.className = `azion azion-${CONFIG_DEFAULT.theme}`
document.title = CONFIG_DEFAULT.title || 'Copilot'

async function init() {
  const authService = new AuthService({
    authMode: CONFIG_DEFAULT.authMode,
    copilotBackend: CONFIG_DEFAULT.serverUrl.url,
    clerkPublicKey: CONFIG_DEFAULT.clerkPublicKey
  })

  try {
    const user = await authService.signIn()
    if (user) {
      mountMainApp()
    }
  } catch (error) {
    console.error('Authentication error:', error)
  }
}

function mountMainApp() {
  const app = createApp(App, CONFIG_DEFAULT)
  app.use(PrimeVue)
  app.directive('tooltip', Tooltip)
  app.use(ToastService)
  app.mount('#app')
}

// Add this to handle the redirect
if (window.location.hash.includes('__clerk_status=active')) {
  console.log('Detected Clerk redirect, reloading...')
  window.location.hash = ''
  window.location.reload()
} else {
  init()
}



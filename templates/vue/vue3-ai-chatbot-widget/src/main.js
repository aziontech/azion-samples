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
      icon: 'pi pi-bolt',
      title: 'How do I create an Edge Application?',
      context: 'How do I create an Edge Application?'
    },
    {
      icon: 'pi pi-code',
      title: 'How do I write an Edge Function?',
      context: 'How do I write an Edge Function?'
    },
    {
      icon: 'pi pi-shield',
      title: 'What is Azion WAF?',
      context: 'What is Azion WAF?'
    },
    {
      icon: 'pi pi-database',
      title: 'How do I configure Cache Rules?',
      context: 'How do I configure Cache Rules?'
    }
  ],
  title: import.meta.env.VITE_TITLE || 'Azion Docs Assistant',
  subTitle: import.meta.env.VITE_SUBTITLE || 'Answers based on Azion documentation.',
  isOpenByDefault: true,
  isMaximizedByDefault: true,
  previewText: import.meta.env.VITE_PREVIEW_TEXT || 'Ask about Azion docs…',
  footerDisclaimer:
    import.meta.env.VITE_FOOTER_DISCLAIMER ||
    'This assistant only answers questions about Azion documentation. Verify important information.',
  clerkPublicKey: import.meta.env.VITE_CLERK_PUBLIC_KEY,
  authMode: import.meta.env.VITE_AUTH_MODE
})

const CONFIG_DEFAULT = getConfigDefaults()

document.documentElement.className = `azion azion-${CONFIG_DEFAULT.theme}`
document.title = CONFIG_DEFAULT.title || 'Azion Docs Assistant'

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



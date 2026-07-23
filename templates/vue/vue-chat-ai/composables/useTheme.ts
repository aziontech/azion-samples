import { ref } from 'vue'

export type ThemeMode = 'light' | 'dark'

const KEY = 'ai_theme'
const mode = ref<ThemeMode>('dark')

function apply(next: ThemeMode) {
  if (typeof document === 'undefined') return
  document.documentElement.setAttribute('data-theme', next)
}

export function useTheme() {
  function set(next: ThemeMode) {
    mode.value = next
    apply(next)
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(KEY, next)
    }
  }

  function toggle() {
    set(mode.value === 'dark' ? 'light' : 'dark')
  }

  function hydrate() {
    if (typeof localStorage === 'undefined') return
    const saved = localStorage.getItem(KEY) as ThemeMode | null
    const next: ThemeMode = saved === 'light' || saved === 'dark' ? saved : 'dark'
    mode.value = next
    apply(next)
  }

  return { mode, set, toggle, hydrate }
}

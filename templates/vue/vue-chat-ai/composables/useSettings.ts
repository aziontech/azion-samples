import { onMounted, ref } from 'vue'

export type Provider = 'openai' | 'anthropic' | 'copilot-azion'
export type AzionAuthType = 'cookie' | 'token'

export interface Settings {
  provider: Provider
  model: string
  apiKey: string
  azionAuthType: AzionAuthType
}

const AZION_MODELS = ['azion-copilot']

const OPENAI_MODELS = [
  'gpt-5.5',
  'gpt-4.1',
  'gpt-4.1-mini',
  'gpt-4.1-nano',
  'gpt-4o',
  'gpt-4o-mini',
  'o3',
  'o4-mini',
  'o3-mini',
]

const ANTHROPIC_MODELS = [
  'claude-opus-4-7',
  'claude-sonnet-4-6',
  'claude-haiku-4-5-20251001',
  'claude-opus-4-5',
  'claude-sonnet-4-5',
]

export const MODELS: Record<Provider, string[]> = {
  openai: OPENAI_MODELS,
  anthropic: ANTHROPIC_MODELS,
  'copilot-azion': AZION_MODELS,
}

const DEFAULT_MODELS: Record<Provider, string> = {
  openai: 'gpt-5.5',
  anthropic: 'claude-sonnet-4-6',
  'copilot-azion': 'azion-copilot',
}

function load<T>(key: string, fallback: T): T {
  if (typeof localStorage === 'undefined') return fallback
  try {
    const v = localStorage.getItem(key)
    return v !== null ? (JSON.parse(v) as T) : fallback
  } catch {
    return fallback
  }
}

function save(key: string, value: unknown) {
  if (typeof localStorage === 'undefined') return
  localStorage.setItem(key, JSON.stringify(value))
}

export function useSettings() {
  const provider = ref<Provider>('openai')
  const model = ref<string>(DEFAULT_MODELS.openai)
  const apiKey = ref<string>('')
  const azionAuthType = ref<AzionAuthType>('cookie')

  onMounted(() => {
    const savedProvider = load<Provider>('ai_provider', 'openai')
    provider.value = savedProvider
    model.value = load<string>('ai_model', DEFAULT_MODELS[savedProvider])
    apiKey.value = load<string>('ai_key', '')
    azionAuthType.value = load<AzionAuthType>('azion_auth_type', 'cookie')
  })

  function setProvider(p: Provider) {
    provider.value = p
    save('ai_provider', p)
    const defaultModel = DEFAULT_MODELS[p]
    model.value = defaultModel
    save('ai_model', defaultModel)
  }

  function setModel(m: string) {
    model.value = m
    save('ai_model', m)
  }

  function setApiKey(k: string) {
    apiKey.value = k
    save('ai_key', k)
  }

  function setAzionAuthType(t: AzionAuthType) {
    azionAuthType.value = t
    save('azion_auth_type', t)
  }

  return {
    provider,
    model,
    apiKey,
    azionAuthType,
    setProvider,
    setModel,
    setApiKey,
    setAzionAuthType,
  }
}

export type UseSettings = ReturnType<typeof useSettings>

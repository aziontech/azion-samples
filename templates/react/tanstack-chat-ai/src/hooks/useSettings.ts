import { useEffect, useState } from 'react'

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
  try {
    const v = localStorage.getItem(key)
    return v !== null ? (JSON.parse(v) as T) : fallback
  } catch {
    return fallback
  }
}

function save(key: string, value: unknown) {
  localStorage.setItem(key, JSON.stringify(value))
}

export function useSettings() {
  const [provider, setProviderState] = useState<Provider>('openai')
  const [model, setModelState] = useState<string>(DEFAULT_MODELS['openai'])
  const [apiKey, setApiKeyState] = useState<string>('')
  const [azionAuthType, setAzionAuthTypeState] = useState<AzionAuthType>('cookie')

  useEffect(() => {
    const savedProvider = load<Provider>('ai_provider', 'openai')
    const savedModel = load<string>('ai_model', DEFAULT_MODELS[savedProvider])
    const savedApiKey = load<string>('ai_key', '')
    const savedAzionAuthType = load<AzionAuthType>('azion_auth_type', 'cookie')
    setProviderState(savedProvider)
    setModelState(savedModel)
    setApiKeyState(savedApiKey)
    setAzionAuthTypeState(savedAzionAuthType)
  }, [])

  function setProvider(p: Provider) {
    setProviderState(p)
    save('ai_provider', p)
    const defaultModel = DEFAULT_MODELS[p]
    setModelState(defaultModel)
    save('ai_model', defaultModel)
  }

  function setModel(m: string) {
    setModelState(m)
    save('ai_model', m)
  }

  function setApiKey(k: string) {
    setApiKeyState(k)
    save('ai_key', k)
  }

  function setAzionAuthType(t: AzionAuthType) {
    setAzionAuthTypeState(t)
    save('azion_auth_type', t)
  }

  return { provider, model, apiKey, azionAuthType, setProvider, setModel, setApiKey, setAzionAuthType }
}

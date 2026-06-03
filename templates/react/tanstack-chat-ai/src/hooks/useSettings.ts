import { useEffect, useState } from 'react'

export type Provider = 'openai' | 'anthropic'

export interface Settings {
  provider: Provider
  model: string
  apiKey: string
}

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
}

const DEFAULT_MODELS: Record<Provider, string> = {
  openai: 'gpt-5.5',
  anthropic: 'claude-sonnet-4-6',
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

  useEffect(() => {
    const savedProvider = load<Provider>('ai_provider', 'openai')
    const savedModel = load<string>('ai_model', DEFAULT_MODELS[savedProvider])
    const savedApiKey = load<string>('ai_key', '')
    setProviderState(savedProvider)
    setModelState(savedModel)
    setApiKeyState(savedApiKey)
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

  return { provider, model, apiKey, setProvider, setModel, setApiKey }
}

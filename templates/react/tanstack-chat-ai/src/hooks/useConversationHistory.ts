import { useCallback, useEffect, useState } from 'react'
import type { UIMessage } from '@tanstack/ai/client'

export interface SavedConversation {
  id: string
  title: string
  timestamp: number
  messages: UIMessage[]
}

const KEY = 'ai_conversations'

function load(): SavedConversation[] {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? (JSON.parse(raw) as SavedConversation[]) : []
  } catch {
    return []
  }
}

function persist(convs: SavedConversation[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(convs))
  } catch {
    // quota exceeded or private mode
  }
}

function makeTitle(messages: UIMessage[]): string {
  const first = messages.find((m) => m.role === 'user')
  if (!first) return 'New conversation'
  const text = first.parts
    .filter((p) => p.type === 'text')
    .map((p) => ('content' in p ? String(p.content) : ''))
    .join(' ')
    .trim()
  return text.length > 64 ? text.slice(0, 64) + '…' : text || 'New conversation'
}

export function useConversationHistory() {
  const [conversations, setConversations] = useState<SavedConversation[]>([])

  useEffect(() => {
    setConversations(load())
  }, [])

  const save = useCallback((id: string, messages: UIMessage[]) => {
    if (messages.length === 0) return
    const title = makeTitle(messages)
    setConversations((prev) => {
      const exists = prev.some((c) => c.id === id)
      const updated = exists
        ? prev.map((c) =>
            c.id === id ? { ...c, messages, title, timestamp: Date.now() } : c,
          )
        : [{ id, title, timestamp: Date.now(), messages }, ...prev]
      persist(updated)
      return updated
    })
  }, [])

  const remove = useCallback((id: string) => {
    setConversations((prev) => {
      const updated = prev.filter((c) => c.id !== id)
      persist(updated)
      return updated
    })
  }, [])

  return { conversations, save, remove }
}

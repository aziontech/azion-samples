<script setup lang="ts">
import { computed } from 'vue'
import type { SavedConversation } from '~/composables/useConversationHistory'

const props = defineProps<{
  open: boolean
  conversations: SavedConversation[]
  currentId: string
}>()

const emit = defineEmits<{
  close: []
  load: [conv: SavedConversation]
  delete: [id: string]
  new: []
}>()

function relativeTime(ts: number): string {
  const diff = Date.now() - ts
  const m = Math.floor(diff / 60000)
  const h = Math.floor(diff / 3600000)
  const d = Math.floor(diff / 86400000)
  if (m < 1) return 'agora'
  if (m < 60) return `${m}min atrás`
  if (h < 24) return `${h}h atrás`
  return `${d}d atrás`
}

const sortedConvs = computed(() =>
  [...props.conversations].sort((a, b) => b.timestamp - a.timestamp),
)

function msgCount(conv: SavedConversation) {
  return conv.messages.filter((m) => m.role === 'user' || m.role === 'assistant').length
}
</script>

<template>
  <div v-if="open" class="fixed inset-0 z-50 flex">
    <div
      class="absolute inset-0 bg-[var(--bg-backdrop)]"
      @click="emit('close')"
    />

    <div
      class="relative h-full w-full max-w-[320px] bg-[var(--bg-surface)] border-r border-[var(--border-muted)] flex flex-col shadow-[var(--shadow-md)]"
    >
      <!-- Header -->
      <div
        class="flex items-center justify-between px-[var(--spacing-5)] h-14 border-b border-[var(--border-muted)] flex-shrink-0"
      >
        <span class="font-mono text-body-xxs text-[var(--text-default)] tracking-widest uppercase">
          Histórico
        </span>
        <div class="flex gap-[var(--spacing-2)] items-center">
          <button
            class="flex items-center gap-[var(--spacing-1)] bg-transparent border border-[var(--primary)] rounded-[var(--shape-flat)] text-[var(--primary-contrast)] text-body-xxs font-mono tracking-wider cursor-pointer px-[var(--spacing-3)] py-[var(--spacing-1)] transition-colors hover:bg-[var(--primary-mask)]"
            @click="emit('new')"
          >
            + NOVA
          </button>
          <button
            class="bg-transparent border-0 text-[var(--text-muted)] cursor-pointer text-body-md leading-none p-[var(--spacing-1)] transition-colors hover:text-[var(--text-default)]"
            @click="emit('close')"
          >
            ✕
          </button>
        </div>
      </div>

      <!-- List -->
      <div class="flex-1 overflow-y-auto py-[var(--spacing-2)]">
        <p
          v-if="conversations.length === 0"
          class="text-center px-[var(--spacing-5)] py-[var(--spacing-10)] font-mono text-body-xxs text-[var(--text-disabled)] tracking-wide uppercase"
        >
          Nenhuma conversa salva
        </p>
        <div
          v-for="conv in sortedConvs"
          :key="conv.id"
          class="hist-item flex items-center pr-[var(--spacing-3)] pl-[var(--spacing-4)] transition-colors"
          :class="conv.id === currentId ? 'bg-[var(--primary-mask)] hist-item--current' : 'bg-transparent hover:bg-[var(--bg-hover)]'"
          :style="{ borderLeft: `2px solid ${conv.id === currentId ? 'var(--primary)' : 'transparent'}` }"
        >
          <button
            class="flex-1 bg-transparent border-0 py-[var(--spacing-3)] text-left cursor-pointer overflow-hidden min-w-0"
            @click="emit('load', conv)"
          >
            <div
              class="text-body-sm overflow-hidden text-ellipsis whitespace-nowrap mb-[var(--spacing-1)]"
              :class="conv.id === currentId ? 'text-[var(--text-default)]' : 'text-[var(--text-default)] opacity-80'"
            >
              {{ conv.title }}
            </div>
            <div class="text-body-xxs font-mono text-[var(--text-muted)] tracking-wide">
              {{ relativeTime(conv.timestamp) }} · {{ msgCount(conv) }} msgs
            </div>
          </button>
          <button
            title="Excluir conversa"
            class="bg-transparent border-0 text-[var(--text-disabled)] cursor-pointer p-[var(--spacing-1)] flex-shrink-0 transition-colors leading-none text-body-xs hover:text-[var(--danger)]"
            @click.stop="emit('delete', conv.id)"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

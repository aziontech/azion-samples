<script setup lang="ts">
import { computed, ref } from 'vue'
import type { SavedConversation } from '~/composables/useConversationHistory'

const props = defineProps<{
  isOpen: boolean
  conversations: SavedConversation[]
  currentId: string
}>()

const emit = defineEmits<{
  toggle: []
  newChat: []
  load: [conv: SavedConversation]
  delete: [id: string]
  openSettings: []
}>()

interface Group { label: string; items: SavedConversation[] }

const searchQuery = ref('')

const filteredConversations = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  if (!q) return props.conversations
  return props.conversations.filter((c) => c.title.toLowerCase().includes(q))
})

const groups = computed<Group[]>(() => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const todayTs = today.getTime()
  const yesterdayTs = todayTs - 86400000
  const sevenDaysAgoTs = todayTs - 7 * 86400000
  const thirtyDaysAgoTs = todayTs - 30 * 86400000

  const sorted = [...filteredConversations.value].sort((a, b) => b.timestamp - a.timestamp)

  // Current chat synthetic group: only if the active id exists as a saved conversation
  const currentItem = sorted.find((c) => c.id === props.currentId)
  const rest = currentItem ? sorted.filter((c) => c.id !== props.currentId) : sorted

  const todayItems = rest.filter((c) => c.timestamp >= todayTs)
  const yesterdayItems = rest.filter((c) => c.timestamp >= yesterdayTs && c.timestamp < todayTs)
  const prev7Items = rest.filter((c) => c.timestamp >= sevenDaysAgoTs && c.timestamp < yesterdayTs)
  const prev30Items = rest.filter((c) => c.timestamp >= thirtyDaysAgoTs && c.timestamp < sevenDaysAgoTs)
  const olderItems = rest.filter((c) => c.timestamp < thirtyDaysAgoTs)

  const out: Group[] = []
  if (currentItem) out.push({ label: 'CURRENT CHAT', items: [currentItem] })
  if (todayItems.length) out.push({ label: 'TODAY', items: todayItems })
  if (yesterdayItems.length) out.push({ label: 'YESTERDAY', items: yesterdayItems })
  if (prev7Items.length) out.push({ label: 'LAST 7 DAYS', items: prev7Items })
  if (prev30Items.length) out.push({ label: 'LAST 30 DAYS', items: prev30Items })

  const monthMap = new Map<string, SavedConversation[]>()
  for (const conv of olderItems) {
    const key = new Date(conv.timestamp).toLocaleString('en-US', { month: 'long', year: 'numeric' }).toUpperCase()
    if (!monthMap.has(key)) monthMap.set(key, [])
    monthMap.get(key)!.push(conv)
  }
  monthMap.forEach((items, label) => out.push({ label, items }))

  return out
})

const hoveredId = ref<string | null>(null)
</script>

<template>
  <div
    class="h-full bg-[var(--bg-surface)] flex flex-col overflow-hidden transition-[width] duration-200 ease-out flex-shrink-0"
    :class="isOpen ? 'w-[260px] border-r border-[var(--border-muted)]' : 'w-0'"
  >
    <!-- AZION wordmark at top -->
    <div class="p-[var(--spacing-4)] flex items-center justify-between flex-shrink-0">
      <svg width="90" height="18" viewBox="0 0 90 18" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M86.637 0L85.1445 7.79033L87.861 11.1671L90 0H86.637ZM72.5099 0L69.1465 17.561H72.5111L74.8163 5.52224L84.5333 17.561H86.637L87.0518 15.4112L74.6131 0H72.5099Z" fill="currentColor" style="color: var(--primary);" />
        <path fill-rule="evenodd" clip-rule="evenodd" d="M51.6563 0L48.293 17.561H65.7833L69.1466 0H51.6563ZM54.3884 3.31794H65.1392L63.0467 14.243H52.296L54.3884 3.31794Z" fill="currentColor" style="color: var(--primary);" />
        <path fill-rule="evenodd" clip-rule="evenodd" d="M45.0001 0L41.707 17.561H44.9994L48.2924 0H45.0001Z" fill="currentColor" style="color: var(--primary);" />
        <path fill-rule="evenodd" clip-rule="evenodd" d="M24.217 0L23.5814 3.31801H35.1962L21.3511 14.9756L20.8535 17.561H38.3437L38.9793 14.243H27.3646L41.2126 2.58289L41.7072 0H24.217Z" fill="currentColor" style="color: var(--primary);" />
        <path fill-rule="evenodd" clip-rule="evenodd" d="M18.2868 0L0.490892 14.9821L0 17.561H2.5639L16.349 5.96141L14.1271 17.561H17.4898L20.8537 0H18.2868Z" fill="currentColor" style="color: var(--primary);" />
      </svg>
      <button
        title="Fechar barra lateral"
        class="w-8 h-8 flex items-center justify-center bg-transparent border-0 rounded-[var(--shape-button)] text-[var(--text-muted)] cursor-pointer transition-colors flex-shrink-0 hover:bg-[var(--bg-hover)] hover:text-[var(--text-default)]"
        @click="emit('toggle')"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>
    </div>

    <!-- Search input pill -->
    <div class="mx-[var(--spacing-3)] flex-shrink-0">
      <div class="flex items-center h-9 bg-[var(--bg-canvas)] rounded-full px-[var(--spacing-3)] gap-[var(--spacing-2)]">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: var(--text-muted);">
          <circle cx="11" cy="11" r="7" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search"
          class="flex-1 bg-transparent border-0 outline-none text-body-sm text-[var(--text-default)]"
        />
      </div>
    </div>

    <!-- + New chat button -->
    <button
      class="mx-[var(--spacing-3)] mt-[var(--spacing-2)] px-[var(--spacing-3)] py-[var(--spacing-2)] rounded-[var(--shape-elements)] bg-transparent border-0 cursor-pointer text-body-sm text-[var(--text-default)] flex items-center gap-[var(--spacing-2)] transition-colors hover:bg-[var(--bg-hover)] flex-shrink-0"
      @click="emit('newChat')"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="16" />
        <line x1="8" y1="12" x2="16" y2="12" />
      </svg>
      New chat
    </button>

    <!-- History list -->
    <div class="flex-1 overflow-y-auto py-[var(--spacing-1)]">
      <p
        v-if="groups.length === 0"
        class="text-center px-[var(--spacing-4)] py-[var(--spacing-8)] text-body-xs text-[var(--text-disabled)] font-mono tracking-wide m-0"
      >
        Nenhuma conversa
      </p>
      <div v-for="group in groups" :key="group.label">
        <div
          class="px-[var(--spacing-3)] pt-[var(--spacing-4)] pb-[var(--spacing-1)] text-body-xxs text-[var(--text-muted)] tracking-wider uppercase select-none whitespace-nowrap"
        >
          {{ group.label }}
        </div>
        <div
          v-for="conv in group.items"
          :key="conv.id"
          class="flex items-center mx-[var(--spacing-2)] px-[var(--spacing-2)] py-[var(--spacing-2)] rounded-[var(--shape-elements)] gap-[var(--spacing-2)] transition-colors"
          :class="[
            conv.id === currentId
              ? 'bg-[var(--bg-hover)]'
              : hoveredId === conv.id
                ? 'bg-[var(--bg-hover)]'
                : 'bg-transparent',
          ]"
          @mouseenter="hoveredId = conv.id"
          @mouseleave="hoveredId = null"
        >
          <span
            class="w-1.5 h-1.5 rounded-full flex-shrink-0"
            :class="conv.id === currentId ? 'bg-[var(--text-default)]' : 'bg-[var(--text-muted)]'"
          />
          <button
            class="flex-1 bg-transparent border-0 text-left cursor-pointer overflow-hidden min-w-0 p-0"
            @click="emit('load', conv)"
          >
            <div
              class="text-body-sm overflow-hidden text-ellipsis whitespace-nowrap"
              :class="conv.id === currentId ? 'text-[var(--text-default)]' : 'text-[var(--text-default)] opacity-80'"
              style="line-height: 1.4;"
            >
              {{ conv.title }}
            </div>
          </button>
          <button
            title="Excluir"
            class="delete-btn bg-transparent border-0 text-[var(--text-muted)] cursor-pointer p-[var(--spacing-1)] flex-shrink-0 transition-colors rounded-[var(--shape-flat)] flex items-center justify-center hover:text-[var(--danger)]"
            :style="{ opacity: hoveredId === conv.id ? 1 : 0, pointerEvents: hoveredId === conv.id ? 'auto' : 'none' }"
            @click.stop="emit('delete', conv.id)"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- User profile card at bottom -->
    <div class="border-t border-[var(--border-muted)] p-[var(--spacing-3)] flex-shrink-0">
      <div class="flex items-center gap-[var(--spacing-2)] rounded-[var(--shape-elements)] bg-[var(--bg-canvas)] p-[var(--spacing-2)]">
        <div
          class="w-8 h-8 rounded-full bg-[var(--bg-surface)] flex items-center justify-center flex-shrink-0 text-body-xs font-medium text-[var(--text-default)]"
        >
          RU
        </div>
        <div class="flex-1 min-w-0">
          <div class="text-body-sm text-[var(--text-default)] overflow-hidden text-ellipsis whitespace-nowrap" style="line-height: 1.2;">
            Rafael Umman
          </div>
          <div class="text-body-xxs text-[var(--text-muted)] overflow-hidden text-ellipsis whitespace-nowrap" style="line-height: 1.2;">
            email@gmail.com
          </div>
        </div>
        <button
          title="Configurações"
          class="w-7 h-7 flex items-center justify-center bg-transparent border-0 rounded-[var(--shape-button)] text-[var(--text-muted)] cursor-pointer transition-colors flex-shrink-0 hover:bg-[var(--bg-hover)] hover:text-[var(--text-default)]"
          @click="emit('openSettings')"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="18 15 12 9 6 15" />
            <polyline points="18 21 12 15 6 21" transform="translate(0 -12)" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

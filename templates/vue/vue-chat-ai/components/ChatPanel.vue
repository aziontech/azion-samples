<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useChat, fetchServerSentEvents } from '@tanstack/ai-vue'
import ChatInput from './ChatInput.vue'
import MessageList from './MessageList.vue'
import Sidebar from './Sidebar.vue'
import SettingsDrawer from './SettingsDrawer.vue'
import type { UseSettings } from '~/composables/useSettings'
import { useConversationHistory, type SavedConversation } from '~/composables/useConversationHistory'
import { useTheme } from '~/composables/useTheme'

const theme = useTheme()

const props = withDefaults(
  defineProps<{
    settings: UseSettings
    apiUrl?: string
  }>(),
  { apiUrl: '/api/chat' },
)

const SUGGESTIONS = [
  'Como criar uma Edge Application?',
  'Como escrever uma Edge Function?',
  'O que é o Azion WAF?',
  'Como configurar Cache Rules?',
]

function newId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`
}

const settingsOpen = ref(false)
const sidebarOpen = ref(true)
const currentConvId = ref('')

onMounted(() => {
  currentConvId.value = newId()
})

const history = useConversationHistory()

const connection = fetchServerSentEvents(props.apiUrl, async () => ({
  headers: {
    'X-Api-Key': props.settings.apiKey.value,
    'X-Provider': props.settings.provider.value,
    'X-Model': props.settings.model.value,
    'X-Azion-Auth-Type': props.settings.azionAuthType.value,
  },
}))

const { messages, sendMessage, setMessages, isLoading, stop, reload, clear, error } = useChat({ connection })

const noKey = computed(() => !props.settings.apiKey.value.trim())

const displayMessages = computed(() =>
  messages.value.filter((m) => m.role === 'user' || m.role === 'assistant'),
)
const hasMessages = computed(() => displayMessages.value.length > 0)
const lastIsAssistant = computed(
  () => displayMessages.value[displayMessages.value.length - 1]?.role === 'assistant',
)

watch(
  displayMessages,
  (msgs) => {
    if (msgs.length > 0) {
      history.save(currentConvId.value, msgs)
    }
  },
  { deep: true },
)

function handleLoadConversation(conv: SavedConversation) {
  setMessages(conv.messages)
  currentConvId.value = conv.id
}

function handleNewConversation() {
  clear()
  currentConvId.value = newId()
}

function handleSend(text: string) {
  sendMessage({ content: text })
}

function suggestionClick(s: string) {
  if (!noKey.value) handleSend(s)
}

const providerLabel = computed(() =>
  props.settings.provider.value === 'openai'
    ? 'OpenAI'
    : props.settings.provider.value === 'anthropic'
      ? 'Anthropic'
      : 'Azion Copilot',
)
</script>

<template>
  <div class="flex h-full overflow-hidden bg-[var(--bg-canvas)]">
    <Sidebar
      :is-open="sidebarOpen"
      :conversations="history.conversations.value"
      :current-id="currentConvId"
      @toggle="sidebarOpen = !sidebarOpen"
      @new-chat="handleNewConversation"
      @load="handleLoadConversation"
      @delete="history.remove"
      @open-settings="settingsOpen = true"
    />

    <!-- Main area -->
    <div class="flex-1 flex flex-col overflow-hidden min-w-0">
      <!-- EMPTY STATE -->
      <div
        v-if="!hasMessages"
        class="flex-1 flex flex-col items-center justify-center px-[var(--spacing-5)] pt-[var(--spacing-6)] pb-[var(--spacing-10)] relative"
        style="animation: fadeInEmpty 0.25s ease;"
      >
        <button
          v-if="!sidebarOpen"
          title="Abrir barra lateral"
          class="absolute top-[var(--spacing-4)] left-[var(--spacing-4)] w-9 h-9 flex items-center justify-center bg-transparent border-0 rounded-[var(--shape-button)] text-[var(--text-muted)] cursor-pointer transition-colors hover:bg-[var(--bg-hover)] hover:text-[var(--text-default)]"
          @click="sidebarOpen = true"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>

        <button
          :title="theme.mode.value === 'dark' ? 'Modo claro' : 'Modo escuro'"
          class="absolute top-[var(--spacing-4)] right-[var(--spacing-4)] w-9 h-9 flex items-center justify-center bg-transparent border-0 rounded-[var(--shape-button)] text-[var(--text-muted)] cursor-pointer transition-colors hover:bg-[var(--bg-hover)] hover:text-[var(--text-default)]"
          @click="theme.toggle()"
        >
          <svg v-if="theme.mode.value === 'dark'" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
          </svg>
          <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          </svg>
        </button>

        <h1 class="text-heading-lg text-[var(--text-default)] m-0 mb-[var(--spacing-2)] text-center tracking-tight">
          Documentação Azion
        </h1>
        <p class="text-body-sm text-[var(--text-muted)] m-0 mb-[var(--spacing-2)] text-center max-w-[520px]">
          Respondo dúvidas sobre a documentação da Azion.
        </p>
        <a
          href="https://www.azion.com/en/documentation/"
          target="_blank"
          rel="noopener"
          class="text-body-xs text-[var(--primary)] hover:underline mb-[var(--spacing-6)] inline-flex items-center gap-[var(--spacing-1)]"
        >
          Ver documentação completa
          <svg width="12" height="12" viewBox="0 0 14 14" fill="currentColor" aria-hidden="true">
            <path d="M6.997.813a.53.53 0 0 1 0 1.061H2.755a.884.884 0 0 0-.884.884v8.484a.884.884 0 0 0 .884.884h8.484a.885.885 0 0 0 .884-.884V7a.53.53 0 0 1 1.06 0v4.242a1.946 1.946 0 0 1-1.944 1.944H2.755A1.945 1.945 0 0 1 .81 11.242V2.758A1.945 1.945 0 0 1 2.755.813h4.242Zm5.656 0c.04.001.077.006.115.015a.529.529 0 0 1 .416.703v2.64a.539.539 0 0 1-.53.531.538.538 0 0 1-.531-.53V2.647L8.411 6.293a.524.524 0 0 1-.353.177.53.53 0 0 1-.354-.884l3.712-3.712h-1.59a.53.53 0 0 1 0-1.06h2.827Z" />
          </svg>
        </a>

        <div class="w-full max-w-[720px]">
          <ChatInput
            :is-loading="isLoading"
            :disabled="noKey"
            :disabled-reason="noKey ? 'Configure sua chave de API em Settings para começar' : undefined"
            @send="handleSend"
            @stop="stop"
          />
        </div>

        <!-- Suggestions -->
        <div class="flex flex-wrap gap-[var(--spacing-2)] justify-center mt-[var(--spacing-3)]">
          <button
            v-for="s in SUGGESTIONS"
            :key="s"
            :disabled="noKey"
            class="suggestion-btn text-body-sm px-[var(--spacing-4)] py-[var(--spacing-2)] rounded-full transition-colors"
            :class="noKey
              ? 'bg-[var(--bg-hover)] border border-[var(--border-muted)] text-[var(--text-disabled)] cursor-not-allowed'
              : 'bg-[var(--bg-hover)] border border-[var(--border-muted)] text-[var(--text-default)] cursor-pointer hover:bg-[var(--primary-mask)] hover:border-[var(--primary)] hover:text-[var(--primary-contrast)]'"
            @click="suggestionClick(s)"
          >
            {{ s }}
          </button>
        </div>

        <!-- Settings shortcut -->
        <button
          v-if="noKey"
          class="mt-[var(--spacing-5)] flex items-center gap-[var(--spacing-1)] bg-transparent border border-[var(--primary)] rounded-[var(--shape-button)] text-[var(--primary-contrast)] text-body-xs font-mono tracking-wider cursor-pointer px-[var(--spacing-3)] py-[var(--spacing-1)] transition-colors hover:bg-[var(--primary-mask)]"
          @click="settingsOpen = true"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
          ABRIR SETTINGS
        </button>
      </div>

      <!-- ACTIVE STATE -->
      <div
        v-else
        class="flex-1 flex flex-col overflow-hidden"
        style="animation: fadeInChat 0.25s ease;"
      >
        <!-- Thin header -->
        <header
          class="h-[52px] flex items-center justify-between px-[var(--spacing-4)] border-b border-[var(--border-muted)] flex-shrink-0 bg-[var(--bg-canvas)]"
        >
          <div class="flex items-center gap-[var(--spacing-2)]">
            <button
              v-if="!sidebarOpen"
              title="Abrir barra lateral"
              class="w-8 h-8 flex items-center justify-center bg-transparent border-0 rounded-[var(--shape-button)] text-[var(--text-muted)] cursor-pointer transition-colors hover:bg-[var(--bg-hover)] hover:text-[var(--text-default)]"
              @click="sidebarOpen = true"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
            <span class="text-body-xs text-[var(--text-muted)]">
              Docs Assistant · {{ providerLabel }}<template v-if="settings.provider.value !== 'copilot-azion'"> · {{ settings.model.value }}</template>
            </span>
            <a
              href="https://www.azion.com/en/documentation/"
              target="_blank"
              rel="noopener"
              class="text-body-xs text-[var(--primary)] hover:underline hidden sm:inline-flex items-center gap-[var(--spacing-1)]"
            >
              Docs
              <svg width="10" height="10" viewBox="0 0 14 14" fill="currentColor" aria-hidden="true">
                <path d="M6.997.813a.53.53 0 0 1 0 1.061H2.755a.884.884 0 0 0-.884.884v8.484a.884.884 0 0 0 .884.884h8.484a.885.885 0 0 0 .884-.884V7a.53.53 0 0 1 1.06 0v4.242a1.946 1.946 0 0 1-1.944 1.944H2.755A1.945 1.945 0 0 1 .81 11.242V2.758A1.945 1.945 0 0 1 2.755.813h4.242Zm5.656 0c.04.001.077.006.115.015a.529.529 0 0 1 .416.703v2.64a.539.539 0 0 1-.53.531.538.538 0 0 1-.531-.53V2.647L8.411 6.293a.524.524 0 0 1-.353.177.53.53 0 0 1-.354-.884l3.712-3.712h-1.59a.53.53 0 0 1 0-1.06h2.827Z" />
              </svg>
            </a>
          </div>

          <div class="flex items-center gap-[var(--spacing-2)]">
            <button
              title="Nova conversa"
              class="new-btn flex items-center gap-[var(--spacing-1)] bg-transparent border border-[var(--border-muted)] rounded-[var(--shape-button)] text-[var(--text-muted)] text-body-xs font-mono tracking-wider cursor-pointer px-[var(--spacing-2)] py-[var(--spacing-1)] transition-colors hover:border-[var(--primary)] hover:text-[var(--primary-contrast)]"
              @click="handleNewConversation"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 20h9" />
                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
              </svg>
              NOVA
            </button>
            <button
              :title="theme.mode.value === 'dark' ? 'Modo claro' : 'Modo escuro'"
              class="w-8 h-8 flex items-center justify-center bg-transparent border-0 rounded-[var(--shape-button)] text-[var(--text-muted)] cursor-pointer transition-colors hover:bg-[var(--bg-hover)] hover:text-[var(--text-default)]"
              @click="theme.toggle()"
            >
              <svg v-if="theme.mode.value === 'dark'" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
              </svg>
              <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            </button>
            <button
              title="Configurações"
              class="w-8 h-8 flex items-center justify-center bg-transparent border-0 rounded-[var(--shape-button)] text-[var(--text-muted)] cursor-pointer transition-colors hover:bg-[var(--bg-hover)] hover:text-[var(--text-default)]"
              @click="settingsOpen = true"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="3" />
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
              </svg>
            </button>
          </div>
        </header>

        <!-- Error banner -->
        <div
          v-if="error"
          class="px-[var(--spacing-6)] py-[var(--spacing-2)] bg-[var(--danger-mask,var(--bg-hover))] border-b border-[var(--danger-border)] flex items-center gap-[var(--spacing-2)] flex-shrink-0"
        >
          <span class="text-[var(--danger)] text-body-xxs">✕</span>
          <span class="font-mono text-body-xxs text-[var(--danger-contrast)] tracking-wide flex-1">
            {{ error.message }}
          </span>
          <button
            v-if="lastIsAssistant && !isLoading"
            class="bg-transparent border border-[var(--danger-border)] rounded-[var(--shape-button)] text-[var(--danger)] text-body-xxs font-mono tracking-wider cursor-pointer px-[var(--spacing-2)] py-[var(--spacing-1)]"
            @click="reload()"
          >
            RETRY
          </button>
        </div>

        <MessageList :messages="displayMessages" :is-loading="isLoading" />

        <!-- Regenerate toolbar -->
        <div
          v-if="!isLoading && !error && lastIsAssistant"
          class="py-[var(--spacing-1)] flex justify-center flex-shrink-0"
        >
          <button
            class="flex items-center gap-[var(--spacing-1)] bg-transparent border border-[var(--border-muted)] rounded-[var(--shape-button)] text-[var(--text-muted)] text-body-xxs font-mono tracking-wider cursor-pointer px-[var(--spacing-3)] py-[var(--spacing-1)] transition-colors hover:border-[var(--primary)] hover:text-[var(--primary-contrast)]"
            @click="reload()"
          >
            <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
              <path fill-rule="evenodd" d="M8 3a5 5 0 104.546 2.914.5.5 0 00-.908-.417A4 4 0 118 4V3z" clip-rule="evenodd" />
              <path d="M8 4.466V.534a.25.25 0 00-.41-.192L5.23 2.308a.25.25 0 000 .384l2.36 1.966A.25.25 0 008 4.466z" />
            </svg>
            REGENERAR
          </button>
        </div>

        <ChatInput
          :is-loading="isLoading"
          :disabled="noKey"
          :disabled-reason="noKey ? 'Configure sua chave de API em Settings para começar' : undefined"
          @send="handleSend"
          @stop="stop"
        />
      </div>
    </div>
  </div>

  <SettingsDrawer :open="settingsOpen" :settings="settings" @close="settingsOpen = false" />
</template>

<style>
@keyframes fadeInChat {
  from { opacity: 0; transform: translateY(6px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes fadeInEmpty {
  from { opacity: 0; }
  to   { opacity: 1; }
}
</style>

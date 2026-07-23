<script setup lang="ts">
import { nextTick, ref, watch } from 'vue'
import MarkdownIt from 'markdown-it'
import type { UIMessage, TextPart, ThinkingPart, ToolCallPart, ToolResultPart } from '@tanstack/ai/client'

const props = defineProps<{
  messages: UIMessage[]
  isLoading: boolean
}>()

const containerRef = ref<HTMLDivElement | null>(null)
const userScrolledUp = ref(false)
const hasNewWhileAway = ref(false)
let lastMessageCount = 0

const md = new MarkdownIt({ html: false, linkify: true, breaks: false })

function onScroll() {
  const el = containerRef.value
  if (!el) return
  const away = el.scrollHeight - el.scrollTop - el.clientHeight > 80
  userScrolledUp.value = away
  if (!away) hasNewWhileAway.value = false
}

function scrollToBottom(smooth = true) {
  const el = containerRef.value
  if (!el) return
  el.scrollTo({ top: el.scrollHeight, behavior: smooth ? 'smooth' : 'auto' })
  hasNewWhileAway.value = false
}

watch(
  () => [props.messages, props.isLoading],
  async () => {
    const count = props.messages.length
    const grew = count > lastMessageCount
    lastMessageCount = count
    const lastMsg = props.messages[props.messages.length - 1]
    if (lastMsg?.role === 'user') {
      userScrolledUp.value = false
      hasNewWhileAway.value = false
    } else if (grew && userScrolledUp.value) {
      hasNewWhileAway.value = true
    }
    await nextTick()
    if (!userScrolledUp.value) {
      const el = containerRef.value
      if (el) el.scrollTop = el.scrollHeight
    }
  },
  { deep: true, immediate: true },
)

function textPartsOf(msg: UIMessage): TextPart[] {
  return msg.parts.filter((p) => p.type === 'text') as TextPart[]
}

function fullTextOf(msg: UIMessage): string {
  return textPartsOf(msg).map((p) => p.content).join('\n\n')
}

function renderMd(content: string): string {
  return md.render(content)
}

const copiedIds = ref<Set<string>>(new Set())

function handleCopy(msg: UIMessage) {
  navigator.clipboard.writeText(fullTextOf(msg)).then(() => {
    const s = new Set(copiedIds.value)
    s.add(msg.id)
    copiedIds.value = s
    setTimeout(() => {
      const s2 = new Set(copiedIds.value)
      s2.delete(msg.id)
      copiedIds.value = s2
    }, 2000)
  })
}

const thinkingOpen = ref<Record<string, boolean>>({})
function toggleThinking(key: string) {
  thinkingOpen.value = { ...thinkingOpen.value, [key]: !thinkingOpen.value[key] }
}

function asText(p: unknown): TextPart { return p as TextPart }
function asThinking(p: unknown): ThinkingPart { return p as ThinkingPart }
function asToolCall(p: unknown): ToolCallPart { return p as ToolCallPart }
function asToolResult(p: unknown): ToolResultPart { return p as ToolResultPart }
</script>

<template>
  <div class="relative flex-1 flex flex-col overflow-hidden">
  <div
    ref="containerRef"
    class="flex-1 overflow-y-auto bg-[var(--bg-canvas)]"
    @scroll="onScroll"
  >
    <div class="max-w-[760px] mx-auto px-[var(--spacing-6)] pt-[var(--spacing-8)] pb-[var(--spacing-4)] flex flex-col">
      <div v-for="msg in messages" :key="msg.id" class="mb-[var(--spacing-7)]">
        <!-- User -->
        <div v-if="msg.role === 'user'" class="flex justify-end">
          <div
            class="ml-auto max-w-[80%] bg-[var(--bg-contrast)] text-[var(--bg-canvas)] rounded-[var(--shape-card)] px-[var(--spacing-4)] py-[var(--spacing-2)] text-body-md whitespace-pre-wrap break-words"
            style="line-height: 1.6;"
          >
            <span v-for="(p, i) in textPartsOf(msg)" :key="i">{{ p.content }}</span>
          </div>
        </div>

        <!-- Assistant -->
        <div v-else class="msg-assistant flex flex-col">
          <div class="flex items-start gap-[var(--spacing-3)] mb-[var(--spacing-3)]">
            <div
              class="w-8 h-8 rounded-[var(--shape-elements)] bg-[var(--bg-surface)] flex items-center justify-center flex-shrink-0"
            >
              <svg width="16" height="16" viewBox="0 0 21 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M18.2868 0L0.490892 14.9821L0 17.561H2.5639L16.349 5.96141L14.1271 17.561H17.4898L20.8537 0H18.2868Z" fill="currentColor" style="color: var(--primary);" />
              </svg>
            </div>
            <div class="flex flex-col min-w-0">
              <div class="text-body-md font-medium text-[var(--text-default)]" style="line-height: 1.2;">
                Azion Copilot
              </div>
              <div class="text-body-xs text-[var(--text-muted)]" style="line-height: 1.2;">
                Response ready
              </div>
            </div>
          </div>
          <div class="msg-assistant-content flex-1 min-w-0">
            <template v-for="(part, i) in msg.parts" :key="i">
              <!-- text -->
              <div
                v-if="part.type === 'text'"
                class="prose-azion"
                v-html="renderMd(asText(part).content)"
              />
              <!-- thinking -->
              <div v-else-if="part.type === 'thinking'" class="mb-[var(--spacing-2)]">
                <button
                  class="flex items-center gap-[var(--spacing-1)] bg-transparent border-0 cursor-pointer py-[var(--spacing-1)] text-[var(--text-muted)] text-body-xxs font-mono tracking-wider uppercase"
                  @click="toggleThinking(`${msg.id}-${i}`)"
                >
                  <span class="text-body-xxs">{{ thinkingOpen[`${msg.id}-${i}`] ? '▼' : '▶' }}</span>
                  Thinking
                </button>
                <div
                  v-if="thinkingOpen[`${msg.id}-${i}`]"
                  class="mt-[var(--spacing-1)] px-[var(--spacing-3)] py-[var(--spacing-2)] bg-[var(--bg-hover)] border border-[var(--border-muted)] rounded-[var(--shape-elements)] text-body-sm text-[var(--text-muted)] font-mono whitespace-pre-wrap break-words"
                  style="line-height: 1.6;"
                >
                  {{ asThinking(part).content }}
                </div>
              </div>
              <!-- tool-call -->
              <div
                v-else-if="part.type === 'tool-call'"
                class="inline-flex items-center gap-[var(--spacing-1)] px-[var(--spacing-2)] py-[var(--spacing-1)] bg-[var(--info-mask,var(--bg-hover))] border border-[var(--info-border)] rounded-[var(--shape-elements)] mb-[var(--spacing-1)] text-body-xxs font-mono text-[var(--info)] tracking-wide"
              >
                <span class="opacity-60">⚙</span>
                {{ asToolCall(part).name }}
              </div>
              <!-- tool-result -->
              <div
                v-else-if="part.type === 'tool-result'"
                class="inline-flex items-center gap-[var(--spacing-1)] px-[var(--spacing-2)] py-[var(--spacing-1)] rounded-[var(--shape-elements)] mb-[var(--spacing-1)] text-body-xxs font-mono tracking-wide border"
                :class="asToolResult(part).state === 'error'
                  ? 'bg-[var(--bg-hover)] border-[var(--danger-border)] text-[var(--danger)]'
                  : 'bg-[var(--bg-hover)] border-[var(--success-border)] text-[var(--success)]'"
              >
                <span class="opacity-60">{{ asToolResult(part).state === 'error' ? '✗' : '✓' }}</span>
                Result
              </div>
            </template>

            <button
              v-if="fullTextOf(msg)"
              :title="copiedIds.has(msg.id) ? 'Copiado!' : 'Copiar'"
              :class="copiedIds.has(msg.id) ? 'copy-btn copy-btn--done' : 'copy-btn'"
              class="flex items-center gap-[var(--spacing-1)] mt-[var(--spacing-1)] bg-transparent border-0 cursor-pointer py-[var(--spacing-1)] text-body-xxs font-mono tracking-wide"
              @click="handleCopy(msg)"
            >
              <svg v-if="copiedIds.has(msg.id)" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <svg v-else width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="9" y="9" width="13" height="13" rx="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
              {{ copiedIds.has(msg.id) ? 'Copiado' : 'Copiar' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Streaming indicator -->
      <div v-if="isLoading" class="flex gap-[var(--spacing-3)] items-start mb-[var(--spacing-7)]">
        <div
          class="w-8 h-8 rounded-[var(--shape-elements)] bg-[var(--bg-surface)] flex items-center justify-center flex-shrink-0"
        >
          <svg width="16" height="16" viewBox="0 0 21 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M18.2868 0L0.490892 14.9821L0 17.561H2.5639L16.349 5.96141L14.1271 17.561H17.4898L20.8537 0H18.2868Z" fill="currentColor" style="color: var(--primary);" />
          </svg>
        </div>
        <div class="flex gap-[var(--spacing-1)] items-center pt-[var(--spacing-1)]">
          <span
            v-for="delay in [0, 150, 300]"
            :key="delay"
            class="w-[5px] h-[5px] rounded-full bg-[var(--primary)] inline-block"
            :style="{ animation: `azion-pulse 1.2s ease-in-out ${delay}ms infinite` }"
          />
        </div>
      </div>
    </div>
  </div>

    <Transition name="fade-up">
      <button
        v-if="userScrolledUp"
        type="button"
        :title="hasNewWhileAway ? 'Nova mensagem' : 'Voltar ao fim'"
        class="absolute bottom-[var(--spacing-4)] left-1/2 -translate-x-1/2 inline-flex items-center gap-[var(--spacing-2)] bg-[var(--bg-surface-raised)] border border-[var(--border-muted)] text-[var(--text-default)] text-body-xs rounded-full px-[var(--spacing-3)] py-[var(--spacing-2)] shadow-[var(--shadow-md)] cursor-pointer transition-colors hover:bg-[var(--bg-hover)]"
        @click="scrollToBottom()"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="6 9 12 15 18 9" />
        </svg>
        <span v-if="hasNewWhileAway">Nova mensagem</span>
      </button>
    </Transition>
  </div>
</template>

<style>
@keyframes azion-pulse {
  0%, 80%, 100% { opacity: 0.2; transform: scale(0.8); }
  40% { opacity: 1; transform: scale(1); }
}
.fade-up-enter-active,
.fade-up-leave-active {
  transition: opacity 180ms ease, transform 180ms ease;
}
.fade-up-enter-from,
.fade-up-leave-to {
  opacity: 0;
  transform: translate(-50%, 8px);
}
.fade-up-enter-to,
.fade-up-leave-from {
  opacity: 1;
  transform: translate(-50%, 0);
}
.msg-assistant-content,
.msg-assistant-content * {
  -webkit-user-select: text !important;
  user-select: text !important;
}
.msg-assistant-content button {
  -webkit-user-select: none !important;
  user-select: none !important;
  cursor: pointer;
}
.copy-btn {
  color: var(--text-muted);
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.15s ease, color 0.15s ease;
}
.msg-assistant:hover .copy-btn {
  opacity: 1;
  pointer-events: auto;
}
.copy-btn--done {
  color: var(--primary) !important;
  opacity: 1 !important;
  pointer-events: auto !important;
}
.copy-btn:hover {
  color: var(--text-default) !important;
}

/* Markdown styling for .prose-azion */
.prose-azion p {
  margin: 0 0 var(--spacing-3);
  color: var(--text-default);
  line-height: 1.7;
}
.prose-azion h1 {
  font-weight: 600;
  color: var(--text-default);
  margin: var(--spacing-5) 0 var(--spacing-2);
}
.prose-azion h2 {
  font-weight: 600;
  color: var(--text-default);
  margin: var(--spacing-4) 0 var(--spacing-1);
}
.prose-azion h3 {
  font-weight: 600;
  color: var(--text-default);
  margin: var(--spacing-3) 0 var(--spacing-1);
}
.prose-azion ul,
.prose-azion ol {
  margin: var(--spacing-1) 0 var(--spacing-3);
  padding-left: var(--spacing-5);
  color: var(--text-default);
  line-height: 1.7;
}
.prose-azion li { margin-bottom: var(--spacing-1); }
.prose-azion blockquote {
  margin: var(--spacing-2) 0;
  padding-left: var(--spacing-3);
  border-left: 2px solid var(--primary);
  color: var(--text-muted);
  font-style: italic;
}
.prose-azion strong { font-weight: 600; color: var(--text-default); }
.prose-azion em { color: var(--text-default); }
.prose-azion a { color: var(--primary); text-decoration: none; }
.prose-azion hr {
  border: none;
  border-top: 1px solid var(--border-muted);
  margin: var(--spacing-3) 0;
}
.prose-azion pre {
  margin: var(--spacing-3) 0;
  padding: var(--spacing-3) var(--spacing-4);
  background: var(--bg-surface);
  border: 1px solid var(--border-muted);
  border-radius: var(--shape-elements);
  overflow-x: auto;
  font-family: monospace;
  line-height: 1.6;
  color: var(--text-default);
}
.prose-azion pre code {
  background: transparent;
  border: none;
  padding: 0;
  color: var(--text-default);
}
.prose-azion code {
  font-family: monospace;
  font-size: 0.88em;
  background: var(--primary-mask);
  border: 1px solid var(--primary);
  border-radius: var(--shape-flat);
  padding: 1px var(--spacing-1);
  color: var(--primary-contrast);
}
</style>

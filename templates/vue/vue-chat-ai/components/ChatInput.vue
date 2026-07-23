<script setup lang="ts">
import { computed, ref } from 'vue'
import { useAudioRecorder } from '~/composables/useAudioRecorder'

interface AttachedFile { name: string; content: string }

const props = defineProps<{
  isLoading: boolean
  disabled: boolean
  disabledReason?: string
}>()

const emit = defineEmits<{
  send: [text: string]
  stop: []
}>()

const MAX_SIZE = 32 * 1024
const ACCEPTED = '.txt,.md,.ts,.tsx,.js,.jsx,.py,.json,.yaml,.yml,.html,.css,.sql,.sh,.csv,.xml,.toml,.go,.rs,.java,.kt,.swift,.rb,.php,.c,.cpp,.h'

const textareaRef = ref<HTMLTextAreaElement | null>(null)
const fileInputRef = ref<HTMLInputElement | null>(null)
const attachedFiles = ref<AttachedFile[]>([])

function handleTranscript(text: string) {
  const el = textareaRef.value
  if (!el) return
  el.value = el.value ? `${el.value} ${text}` : text
  el.style.height = 'auto'
  el.style.height = Math.min(el.scrollHeight, 160) + 'px'
  el.focus()
}

const { isRecording, supported: micSupported, start: startRec, stop: stopRec } = useAudioRecorder(handleTranscript)

function handleKeyDown(e: KeyboardEvent) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()
    submit()
  }
}

function submit() {
  const userText = textareaRef.value?.value.trim() ?? ''
  if ((!userText && attachedFiles.value.length === 0) || props.isLoading || props.disabled) return

  const fileBlocks = attachedFiles.value
    .map((f) => `[Arquivo: ${f.name}]\n\`\`\`\n${f.content}\n\`\`\``)
    .join('\n\n')

  const fullText = fileBlocks
    ? userText ? `${fileBlocks}\n\n${userText}` : fileBlocks
    : userText

  emit('send', fullText)

  if (textareaRef.value) {
    textareaRef.value.value = ''
    textareaRef.value.style.height = 'auto'
  }
  attachedFiles.value = []
}

async function handleFileChange(e: Event) {
  const target = e.target as HTMLInputElement
  const files = Array.from(target.files ?? [])
  const added: AttachedFile[] = []
  const skipped: string[] = []

  for (const file of files) {
    if (file.size > MAX_SIZE) {
      skipped.push(file.name)
      continue
    }
    try {
      const content = await file.text()
      added.push({ name: file.name, content })
    } catch {
      // skip unreadable files
    }
  }

  if (skipped.length > 0) {
    alert(`Arquivos ignorados (limite 32KB): ${skipped.join(', ')}`)
  }

  const existing = new Set(attachedFiles.value.map((f) => f.name))
  attachedFiles.value = [...attachedFiles.value, ...added.filter((f) => !existing.has(f.name))]

  if (target) target.value = ''
}

function removeFile(name: string) {
  attachedFiles.value = attachedFiles.value.filter((x) => x.name !== name)
}

function toggleMic() {
  if (isRecording.value) stopRec()
  else startRec()
}

function onTextareaInput(e: Event) {
  const el = e.currentTarget as HTMLTextAreaElement
  el.style.height = 'auto'
  el.style.height = Math.min(el.scrollHeight, 160) + 'px'
}

const canSend = computed(() => !props.disabled && !props.isLoading)
</script>

<template>
  <div class="bg-[var(--bg-canvas)] px-[var(--spacing-5)] pt-[var(--spacing-3)] pb-[var(--spacing-3)] flex-shrink-0">
    <p
      v-if="disabledReason"
      class="text-body-xxs font-mono text-[var(--text-muted)] mb-[var(--spacing-2)] text-center tracking-wide"
    >
      {{ disabledReason }}
    </p>

    <!-- Rounded input container: two rows -->
    <div
      class="chat-input-shell max-w-[720px] mx-auto bg-[var(--bg-surface)] border border-[var(--border-muted)] rounded-[var(--shape-card)] transition-colors p-[var(--spacing-3)] flex flex-col gap-[var(--spacing-2)]"
    >
      <!-- File chips -->
      <div
        v-if="attachedFiles.length > 0"
        class="flex flex-wrap gap-[var(--spacing-1)]"
      >
        <div
          v-for="f in attachedFiles"
          :key="f.name"
          class="flex items-center gap-[var(--spacing-1)] px-[var(--spacing-2)] py-[var(--spacing-1)] bg-[var(--primary-mask)] border border-[var(--primary)] rounded-[var(--shape-button)] text-body-xxs font-mono text-[var(--primary-contrast)] tracking-wide"
        >
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
          </svg>
          <span class="max-w-[160px] overflow-hidden text-ellipsis whitespace-nowrap">
            {{ f.name }}
          </span>
          <button
            class="chip-remove bg-transparent border-0 text-[var(--primary-contrast)] cursor-pointer p-0 pl-[var(--spacing-1)] leading-none text-body-xs opacity-60 transition-opacity hover:opacity-100"
            @click="removeFile(f.name)"
          >
            ×
          </button>
        </div>
      </div>

      <!-- Row 1: Textarea (full width) -->
      <textarea
        ref="textareaRef"
        :rows="1"
        :disabled="disabled || isLoading"
        :placeholder="
          disabled
            ? 'Configure a chave de API em Settings para começar.'
            : isLoading
            ? 'Gerando resposta…'
            : 'Pergunte sobre a documentação da Azion…'
        "
        class="w-full bg-transparent border-0 text-body-md resize-none outline-none min-h-[40px] max-h-[160px] overflow-y-auto"
        :class="disabled ? 'text-[var(--text-muted)]' : 'text-[var(--text-default)]'"
        style="line-height: 1.5;"
        @keydown="handleKeyDown"
        @input="onTextareaInput"
      />

      <input
        ref="fileInputRef"
        type="file"
        :accept="ACCEPTED"
        multiple
        class="hidden"
        @change="handleFileChange"
      />

      <!-- Row 2: Left tools + right actions -->
      <div class="flex items-center justify-between gap-[var(--spacing-2)]">
        <div class="flex items-center gap-[var(--spacing-1)]">
          <button
            title="Anexar arquivo"
            :disabled="!canSend"
            class="w-8 h-8 flex items-center justify-center flex-shrink-0 bg-transparent border-0 rounded-[var(--shape-elements)] transition-colors text-heading-md font-light leading-none"
            :class="canSend
              ? 'text-[var(--text-muted)] cursor-pointer hover:bg-[var(--bg-hover)] hover:text-[var(--text-default)]'
              : 'text-[var(--text-disabled)] cursor-not-allowed'"
            @click="fileInputRef?.click()"
          >
            +
          </button>
        </div>

        <div class="flex items-center gap-[var(--spacing-1)]">
          <!-- Mic button -->
          <button
            v-if="micSupported"
            :disabled="disabled"
            :title="isRecording ? 'Parar gravação' : 'Entrada de voz'"
            class="w-8 h-8 flex items-center justify-center flex-shrink-0 rounded-[var(--shape-elements)] transition-colors"
            :class="[
              isRecording
                ? 'bg-[var(--danger-mask,var(--bg-hover))] border border-[var(--danger-border)] text-[var(--danger)]'
                : disabled
                  ? 'bg-transparent border-0 text-[var(--text-disabled)] cursor-not-allowed'
                  : 'bg-transparent border-0 text-[var(--text-muted)] cursor-pointer hover:bg-[var(--bg-hover)] hover:text-[var(--text-default)]',
            ]"
            :style="isRecording ? { animation: 'mic-pulse 1.2s ease-in-out infinite' } : undefined"
            @click="toggleMic"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z" />
              <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
              <line x1="12" x2="12" y1="19" y2="22" />
            </svg>
          </button>

          <!-- Send / Stop -->
          <button
            v-if="isLoading"
            title="Parar geração"
            class="w-8 h-8 flex items-center justify-center flex-shrink-0 bg-[var(--bg-contrast)] border-0 rounded-[var(--shape-elements)] cursor-pointer text-[var(--text-contrast)] transition-colors hover:bg-[var(--bg-hover)]"
            @click="emit('stop')"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
              <rect x="1" y="1" width="10" height="10" rx="2" />
            </svg>
          </button>
          <button
            v-else
            title="Enviar"
            :disabled="disabled"
            class="w-8 h-8 flex items-center justify-center flex-shrink-0 border-0 rounded-[var(--shape-elements)] transition-colors"
            :class="disabled
              ? 'bg-[var(--bg-disabled)] text-[var(--text-muted)] cursor-not-allowed'
              : 'bg-[var(--bg-contrast)] text-[var(--text-contrast)] cursor-pointer hover:opacity-90'"
            @click="submit"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M8 1L8 15M8 1L3 6M8 1L13 6"
                stroke="currentColor"
                stroke-width="1.8"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <p class="text-center text-body-xxs text-[var(--text-disabled)] mt-[var(--spacing-2)] font-mono tracking-wide">
      Powered by Azion · Keys are never stored server-side
    </p>
  </div>
</template>

<style>
@keyframes mic-pulse {
  0%, 100% { box-shadow: 0 0 0 0 transparent; }
  50% { box-shadow: 0 0 0 4px var(--danger-mask, transparent); }
}
.chat-input-shell:focus-within {
  border-color: var(--primary);
}
</style>

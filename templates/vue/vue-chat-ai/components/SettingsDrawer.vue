<script setup lang="ts">
import { onBeforeUnmount, ref, watch } from 'vue'
import type { Provider, AzionAuthType, UseSettings } from '~/composables/useSettings'
import { MODELS } from '~/composables/useSettings'

const props = defineProps<{
  open: boolean
  settings: UseSettings
}>()

const emit = defineEmits<{ close: [] }>()

const showKey = ref(false)

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && props.open) emit('close')
}

watch(
  () => props.open,
  (open) => {
    if (typeof window === 'undefined') return
    if (open) window.addEventListener('keydown', onKeydown)
    else window.removeEventListener('keydown', onKeydown)
  },
)

onBeforeUnmount(() => {
  if (typeof window !== 'undefined') window.removeEventListener('keydown', onKeydown)
})

const providers: Provider[] = ['openai', 'anthropic', 'copilot-azion']
const authTypes: AzionAuthType[] = ['cookie', 'token']

function providerLabel(p: Provider) {
  return p === 'openai' ? 'OpenAI' : p === 'anthropic' ? 'Anthropic' : 'Azion'
}
</script>

<template>
  <div class="fixed inset-0 z-50 flex" :class="open ? 'pointer-events-auto' : 'pointer-events-none'">
    <Transition name="fade">
      <div
        v-if="open"
        class="absolute inset-0 bg-[var(--bg-backdrop)]"
        @click="emit('close')"
      />
    </Transition>

    <Transition name="drawer-slide">
    <div
      v-if="open"
      class="relative ml-auto h-full w-full max-w-[360px] bg-[var(--bg-surface)] border-l border-[var(--border-muted)] flex flex-col shadow-[var(--shadow-md)]"
    >
      <!-- Header -->
      <div
        class="flex items-center justify-between px-[var(--spacing-6)] h-14 border-b border-[var(--border-muted)] flex-shrink-0"
      >
        <span class="font-mono text-body-xxs text-[var(--text-default)] tracking-widest uppercase">
          Settings
        </span>
        <button
          class="bg-transparent border-0 text-[var(--text-muted)] cursor-pointer text-body-md leading-none p-[var(--spacing-1)] transition-colors hover:text-[var(--text-default)]"
          @click="emit('close')"
        >
          ✕
        </button>
      </div>

      <!-- Body -->
      <div class="flex-1 overflow-y-auto p-[var(--spacing-6)] flex flex-col gap-[var(--spacing-7)]">
        <!-- Provider -->
        <div>
          <p class="font-mono text-body-xxs text-[var(--text-muted)] tracking-widest uppercase mb-[var(--spacing-2)]">
            Provider
          </p>
          <div class="grid grid-cols-3 gap-[var(--spacing-2)]">
            <button
              v-for="p in providers"
              :key="p"
              class="px-[var(--spacing-3)] py-[var(--spacing-2)] rounded-[var(--shape-flat)] text-body-xs font-mono tracking-wide cursor-pointer transition-colors border"
              :class="settings.provider.value === p
                ? 'border-[var(--primary)] bg-[var(--primary-mask)] text-[var(--primary-contrast)]'
                : 'border-[var(--border-muted)] bg-[var(--bg-hover)] text-[var(--text-muted)] hover:border-[var(--border-default)] hover:text-[var(--text-default)]'"
              @click="settings.setProvider(p)"
            >
              {{ providerLabel(p) }}
            </button>
          </div>
        </div>

        <!-- Auth Type — only for Azion Copilot -->
        <div v-if="settings.provider.value === 'copilot-azion'">
          <p class="font-mono text-body-xxs text-[var(--text-muted)] tracking-widest uppercase mb-[var(--spacing-2)]">
            Auth Type
          </p>
          <div class="grid grid-cols-2 gap-[var(--spacing-2)]">
            <button
              v-for="t in authTypes"
              :key="t"
              class="px-[var(--spacing-3)] py-[var(--spacing-2)] rounded-[var(--shape-flat)] text-body-xs font-mono tracking-wide cursor-pointer transition-colors border"
              :class="settings.azionAuthType.value === t
                ? 'border-[var(--primary)] bg-[var(--primary-mask)] text-[var(--primary-contrast)]'
                : 'border-[var(--border-muted)] bg-[var(--bg-hover)] text-[var(--text-muted)] hover:border-[var(--border-default)] hover:text-[var(--text-default)]'"
              @click="settings.setAzionAuthType(t)"
            >
              {{ t === 'cookie' ? 'Cookie (azsid)' : 'API Token' }}
            </button>
          </div>
        </div>

        <!-- Model — hidden for Azion Copilot -->
        <div v-if="settings.provider.value !== 'copilot-azion'">
          <p class="font-mono text-body-xxs text-[var(--text-muted)] tracking-widest uppercase mb-[var(--spacing-2)]">
            Model
          </p>
          <select
            :value="settings.model.value"
            class="model-select w-full bg-[var(--bg-surface-raised)] border border-[var(--border-muted)] rounded-[var(--shape-flat)] px-[var(--spacing-3)] py-[var(--spacing-2)] text-body-sm text-[var(--text-default)] outline-none cursor-pointer appearance-none pr-[var(--spacing-8)]"
            @change="(e) => settings.setModel((e.target as HTMLSelectElement).value)"
          >
            <option
              v-for="m in (MODELS[settings.provider.value] ?? [])"
              :key="m"
              :value="m"
              class="bg-[var(--bg-surface-raised)]"
            >
              {{ m }}
            </option>
          </select>
        </div>

        <!-- API Key -->
        <div>
          <p class="font-mono text-body-xxs text-[var(--text-muted)] tracking-widest uppercase mb-[var(--spacing-2)]">
            {{
              settings.provider.value === 'copilot-azion'
                ? (settings.azionAuthType.value === 'cookie' ? 'Cookie (azsid)' : 'API Token')
                : 'API Key'
            }}
          </p>
          <div class="relative">
            <input
              :type="showKey ? 'text' : 'password'"
              :value="settings.apiKey.value"
              :placeholder="
                settings.provider.value === 'openai' ? 'sk-…'
                : settings.provider.value === 'anthropic' ? 'sk-ant-…'
                : settings.azionAuthType.value === 'cookie' ? 'azsid cookie value'
                : 'API token'
              "
              class="apikey-input w-full bg-[var(--bg-surface-raised)] border border-[var(--border-muted)] rounded-[var(--shape-flat)] py-[var(--spacing-2)] pl-[var(--spacing-3)] pr-[var(--spacing-20)] text-body-sm font-mono text-[var(--text-default)] outline-none box-border transition-colors"
              @input="(e) => settings.setApiKey((e.target as HTMLInputElement).value)"
            />
            <div class="absolute right-[var(--spacing-2)] top-1/2 -translate-y-1/2 flex gap-[var(--spacing-1)]">
              <button
                class="bg-transparent border-0 text-[var(--text-muted)] text-body-xxs font-mono tracking-wide cursor-pointer px-[var(--spacing-1)] py-[2px] transition-colors hover:text-[var(--text-default)]"
                @click="showKey = !showKey"
              >
                {{ showKey ? 'HIDE' : 'SHOW' }}
              </button>
              <button
                v-if="settings.apiKey.value"
                class="bg-transparent border-0 text-[var(--text-muted)] text-body-xxs font-mono tracking-wide cursor-pointer px-[var(--spacing-1)] py-[2px] transition-colors hover:text-[var(--danger)]"
                @click="settings.setApiKey('')"
              >
                CLR
              </button>
            </div>
          </div>
          <p class="mt-[var(--spacing-2)] text-body-xxs font-mono text-[var(--text-disabled)] tracking-wide" style="line-height: 1.5;">
            Stored in browser localStorage. Never sent to any server other than the selected
            provider's API.
          </p>
        </div>
      </div>

      <!-- Footer status -->
      <div class="px-[var(--spacing-6)] py-[var(--spacing-4)] border-t border-[var(--border-muted)] flex-shrink-0">
        <div
          class="flex items-center gap-[var(--spacing-2)] px-[var(--spacing-3)] py-[var(--spacing-2)] rounded-[var(--shape-flat)] border"
          :class="settings.apiKey.value
            ? 'border-[var(--primary)] bg-[var(--primary-mask)]'
            : 'border-[var(--border-muted)] bg-[var(--bg-hover)]'"
        >
          <span
            class="w-[5px] h-[5px] rounded-full flex-shrink-0"
            :class="settings.apiKey.value ? 'bg-[var(--primary)]' : 'bg-[var(--text-disabled)]'"
          />
          <span
            class="font-mono text-body-xxs tracking-wide"
            :class="settings.apiKey.value ? 'text-[var(--primary-contrast)]' : 'text-[var(--text-muted)]'"
          >
            {{
              settings.apiKey.value
                ? `READY · ${settings.provider.value === 'openai' ? 'OPENAI' : settings.provider.value === 'anthropic' ? 'ANTHROPIC' : 'AZION'}${settings.provider.value !== 'copilot-azion' ? ` / ${settings.model.value}` : ''}`
                : settings.provider.value === 'copilot-azion' ? 'ENTER THE AZSID COOKIE TO START' : 'ENTER AN API KEY TO START'
            }}
          </span>
        </div>
      </div>
    </div>
    </Transition>
  </div>
</template>

<style scoped>
.model-select {
  background-image: url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%23808080' stroke-width='1.2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right var(--spacing-3) center;
  transition: border-color 0.15s ease;
}
.model-select:focus {
  border-color: var(--primary);
}
.apikey-input:focus {
  border-color: var(--primary);
}
</style>

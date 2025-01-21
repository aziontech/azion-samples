<template>
  <div
    class="h-[700px] w-[500px] rounded border surface-border bottom-[80px] right-0 transition-transform duration-500 fixed ease-in-out"
    :class="{
      'translate-x-full': !chatVisible,
      'translate-x-[-20px]': chatVisible
    }"
  >
    <div class="h-full flex flex-col">
      <Toolbar class="border-noround border-x-none w-full pl-6 pr-8 py-3 z-10 border-top-none">
        <template #start>
          <div class="flex flex-1 flex-row gap-3 items-center">
            <h3 class="text-color text-lg font-medium flex gap-3 break-all">
              {{ props.title || 'Azion Copilot' }}
            </h3>
            <PrimeTag
              v-tooltip.bottom="tooltipMessage"
              value="Preview"
              class="h-fit"
            />
          </div>
        </template>
        <div class="flex gap-3">
          <PrimeButton
            icon="pi pi-eraser"
            outlined
            class="surface-border h-8 w-8"
            aria-label="New chat"
            v-tooltip.bottom="'New chat'"
            @click="clearChat"
          />
          <PrimeButton
            icon="pi pi-external-link"
            outlined
            class="surface-border h-8 w-8"
            aria-label="Open a chat in new tab"
            v-tooltip.bottom="'Open a chat in new tab'"
            @click="openChatInNewTab"
          />
          <PrimeButton
            icon="pi pi-times"
            outlined
            class="surface-border h-8 w-8"
            aria-label="Close"
            v-tooltip.bottom="'Close'"
            @click="closeSidebar"
          />
        </div>
      </Toolbar>
      <div
        class="flex flex-auto flex-col overflow-x-hidden p-6 pt-3 custom-scroll"
        :class="{ 'justify-center gap-6': !getStartConversation }"
        ref="chatContainer"
      >
        <div
          class="self-stretch py-3 flex-col justify-start items-center gap-10 flex"
          v-if="!getStartConversation"
          :class="{ 'justify-center': !getStartConversation }"
        >
          <Welcome
            :title="props.title"
            :subTitle="props.subTitle"
          />

          <div class="justify-center items-start gap-3 inline-flex">
            <Suggestions />
          </div>

          <slot name="chatSuggestions" />
        </div>
        <div
          class="h-full px-3"
          v-else
        >
          <ChatMessages />
        </div>
      </div>
      <ChatInput :title="props.title" class="p-6" />
    </div>
  </div>
  <div class="fixed bottom-4 right-4">
    <PrimeButton
      rounded
      class="!w-[64px] !h-[64px] p-6"
      @click="toggleChat"
    >
      <template #icon>
        <i
          v-if="chatVisible"
          class="pi pi-times text-0 text-2xl"
        />
        <i
          v-else
          class="ai ai-ask-azion text-0 text-2xl"
        />
      </template>
    </PrimeButton>
  </div>
</template>

<script setup>
  import PrimeButton from 'primevue/button'
  import PrimeTag from 'primevue/tag'
  import Toolbar from 'primevue/toolbar'
  import Welcome from './components/chat-welcome.vue'
  import ChatInput from './components/chat-input.vue'
  import ChatMessages from './components/chat-list-messages.vue'
  import Suggestions from './components/chat-suggestions.vue'
  import { nextTick, ref, watch } from 'vue'
  import { useChat } from './composables/useChat'

  defineOptions({
    name: 'AzionAiChatLayout'
  })

  const props = defineProps({
    user: Object,
    suggestionsOptions: Array,
    title: String,
    subTitle: String,
    serverUrl: String
  })

  const tooltipMessage =
    'Copilot is in preview mode and can make mistakes. Consider verifying important information.'

  const { messages, getStartConversation, clearChat } = useChat({
    apiUrl: props.serverUrl,
    suggestions: props.suggestionsOptions
  })

  const chatContainer = ref(null)
  const chatVisible = ref(false)

  const scrollToBottom = () => {
    if (chatContainer.value) {
      chatContainer.value.scrollTop = chatContainer.value.scrollHeight
    }
  }

  watch(
    () => messages,
    async () => {
      await nextTick()
      scrollToBottom()
    },
    { deep: true, flush: 'post' }
  )

  watch(
    () => props.invokeClearChat,
    (newValue) => {
      if (newValue) {
        clearChat()
      }
    },
    { immediate: true }
  )

  const toggleChat = () => {
    chatVisible.value = !chatVisible.value
  }
</script>

<style>
  .custom-scroll::-webkit-scrollbar {
    width: 8px;
  }

  .custom-scroll::-webkit-scrollbar-thumb {
    background-color: var(--surface-500);
    border-radius: 4px;
  }
</style>

<template>
  <div
    class="flex flex-col gap-6 p-6 flex-1"
    :class="{ 'justify-center gap-6': !hasMessages, 'overflow-y-auto custom-scroll': hasMessages }"
    ref="chatContainer"
  >
    <div
      class="flex-col justify-start items-center gap-10 flex"
      v-if="!hasMessages"
    >
      <Welcome
        :title="chatWidget.title"
        :subTitle="chatWidget.subTitle"
      />

      <Suggestions
        :listSuggestions="chatWidget.suggestionsOptions"
        @sendSuggestion="props.sendMessage"
        v-if="chatWidget.suggestionsOptions"
      />
    </div>
    <div
      class="h-full custom-scroll h-20rem"
      v-else
    >
      <MessagesDisplay
        :messages="props.messages"
        :sendFeedback="props.sendFeedback"
      />
    </div>
  </div>
</template>

<script setup>
  import Welcome from '../welcome.vue'
  import MessagesDisplay from '../messages-display.vue'
  import Suggestions from '../suggestions.vue'
  import { computed, inject, nextTick, ref, watch } from 'vue'

  defineOptions({
    name: 'AzionAiChatLayout'
  })

  const props = defineProps({
    messages: {
      type: Array,
      default: () => []
    },
    sendMessage: {
      type: Function,
      required: true
    },
    sendFeedback: {
      type: Function,
      default: () => () => {}
    }
  })
  const chatWidget = inject('chatWidget')

  const hasMessages = computed(() => props.messages?.length)

  const chatContainer = ref(null)
  const scrollToBottom = () => {
    if (chatContainer.value) {
      chatContainer.value.scrollTop = chatContainer.value.scrollHeight
    }
  }

  watch(
    () => props.messages,
    async () => {
      await nextTick()
      scrollToBottom()
    },
    { deep: true, flush: 'post' }
  )
</script>

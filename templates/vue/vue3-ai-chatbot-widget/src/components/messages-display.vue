<template>
  <div class="flex flex-col text-sm mx-auto flex-1 gap-4 md:max-w-3xl markdown pb-6">
    <MessageItem
      v-for="(message, index) in props.messages"
      :key="index"
      :last="index === props.messages.length - 1"
      :message="message"
      :sendFeedback="props.sendFeedback"
    />
  </div>
</template>

<script setup>
  import MessageItem from './message-item.vue'

  const props = defineProps({
    messages: {
      type: Array,
      default: () => []
    },
    sendFeedback: {
      type: Function,
      default: () => () => {}
    }
  })
</script>

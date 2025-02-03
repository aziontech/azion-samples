<template>
  <div
    class="fixed bottom-4 right-4"
    v-if="!hiddenButton"
  >
    <PrimeButton
      rounded
      class="text-3xl !w-[64px] !h-[64px] p-6"
      @click="toggleChatVisibility"
    >
      <template #icon>
        <i
          :class="['pi', iconClass]"
          class="text-0 text-2xl"
        />
      </template>
    </PrimeButton>
  </div>
</template>

<script setup>
  import PrimeButton from 'primevue/button'
  import { computed, inject, ref } from 'vue'

  defineOptions({
    name: 'FloatButton'
  })

  const chatWidget = inject('chatWidget')

  const hiddenButton = ref(false)

  const iconClass = computed(() => (chatWidget.isOpenChat ? 'pi-times' : 'ai ai-ask-azion'))

  const toggleChatVisibility = () => {
    chatWidget.isOpenChat = !chatWidget.isOpenChat
  }
</script>

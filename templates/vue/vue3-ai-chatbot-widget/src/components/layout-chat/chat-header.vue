<template>
  <Toolbar class="border-noround border-x-none w-full pl-6 pr-8 py-3 z-10 border-top-none">
    <template #start>
      <div class="flex flex-1 flex-row gap-3 items-center">
        <h3 class="text-color text-lg font-medium flex gap-3 break-all">
          {{ chatWidget.title || 'Copilot' }}
        </h3>
        <PrimeTag
          v-tooltip.bottom="chatWidget.previewText"
          value="Preview"
          class="h-fit"
        />
      </div>
    </template>
    <template #end>
      <slot name="actions">
        <div class="flex gap-2">
          <PrimeButton
            icon="pi pi-eraser"
            outlined
            class="surface-border h-8 w-8"
            aria-label="New chat"
            v-tooltip.bottom="'New chat'"
            @click="emit('clearChat')"
          />
          <PrimeButton
            :icon="computedMaximizeProps.icon"
            outlined
            class="surface-border h-8 w-8 hidden md:flex"
            :aria-label="computedMaximizeProps.text"
            v-tooltip.bottom="computedMaximizeProps.text"
            @click="toggleMaximize"
          />
          <PrimeButton
            icon="pi pi-times"
            outlined
            :class="classButtonClose"
            class="surface-border h-8 w-8"
            aria-label="Close"
            v-tooltip.bottom="'Close'"
            @click="emit('closeChat')"
          />
        </div>
      </slot>
    </template>
  </Toolbar>
</template>

<script setup>
  import PrimeButton from 'primevue/button'
  import Toolbar from 'primevue/toolbar'
  import PrimeTag from 'primevue/tag'
  import { computed, inject } from 'vue'

  defineOptions({
    name: 'AzionAiChatLayout'
  })

  const emit = defineEmits(['clearChat', 'closeChat'])

  const chatWidget = inject('chatWidget')

  const classButtonClose = computed(() => ({
    'md:hidden': !chatWidget.isMaximizedChat
  }))

  const computedMaximizeProps = computed(() => ({
    icon: chatWidget.isMaximizedChat
      ? 'pi pi-arrow-down-left-and-arrow-up-right-to-center'
      : 'pi pi-arrow-up-right-and-arrow-down-left-from-center',
    text: chatWidget.isMaximizedChat ? 'Minimize chat' : 'Maximize chat'
  }))

  const toggleMaximize = () => {
    chatWidget.isMaximizedChat = !chatWidget.isMaximizedChat
  }
</script>

<template>
  <Transition
    enter-active-class="transition-all duration-300 ease-out"
    enter-from-class="translate-x-full opacity-0 scale-95"
    enter-to-class="translate-x-0 opacity-100 scale-100"
    leave-active-class="transition-all duration-300 ease-in"
    leave-from-class="translate-x-0 opacity-100 scale-100"
    leave-to-class="translate-x-full opacity-0 scale-95"
  >
    <div
      v-if="chatWidget.isOpenChat || chatWidget.isClosing"
      :class="[
        ...chatClass,
        { 'pointer-events-none': showAuthOverlay },
        'fixed right-0 z-[55] border surface-ground surface-border transition-transform ease-in-out max-md:w-full max-md:h-full max-md:top-0 max-md:right-0'
      ]"
      @transitionend="onTransitionEnd"
    >
      <div class="h-full flex flex-col">
        <ChatHeader
          @clearChat="resetChat"
          @closeChat="closeChat"
        />
        <ChatBody
          :messages="messages"
          :sendMessage="sendMessage"
          :sendFeedback="sendFeedback"
        />
        <ChatFooter
          class="px-6 pt-0 pb-3"
          :sendMessage="sendMessage"
          :cancelMessage="cancelMessage"
          :loading="isProcessingRequest"
        />
      </div>
    </div>
  </Transition>

  <!-- Auth overlay - only show for basic auth -->
  <Transition
    enter-active-class="transition-all duration-300 ease-out"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition-all duration-300 ease-in"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div v-if="showAuthOverlay" 
         class="fixed inset-0 z-[60] bg-black/50 flex items-center justify-center">
      <BasicAuthWindow :onSubmit="handleBasicAuthSubmit" />
    </div>
  </Transition>
</template>

<script setup>
  import { computed, inject, ref } from 'vue'
  import ChatHeader from './chat-header.vue'
  import ChatBody from './chat-body.vue'
  import ChatFooter from './chat-footer.vue'
  import BasicAuthWindow from '../BasicAuthWindow.vue'
  import { useAzionCopilot } from '../../composables/useAzionCopilot'
  import { AuthService } from '../../services/auth'
  import { CONSTANTS } from '../../core'

  const chatWidget = inject('chatWidget')
  const showAuthOverlay = ref(false)

  defineOptions({ name: 'layout-chat' })

  const { messages, sendMessage, cancelMessage, resetChat, isProcessingRequest, sendFeedback, copilot } =
    useAzionCopilot({ server: chatWidget.serverUrl, authMode: chatWidget.authMode })

  copilot.on(CONSTANTS.EVENTS.AUTH_REQUIRED, async () => {
    if (chatWidget.authMode === 'basic') {
      showAuthOverlay.value = true
    } else if (chatWidget.authMode === 'clerk') {
      await handleClerkAuth()
    }
  })

  const handleBasicAuthSubmit = async (password) => {

    const authService = new AuthService({
      authMode: 'basic',
      copilotBackend: chatWidget.serverUrl.url
    })
    
    const result = await authService.fetchBasicAuth(password)
    if (result.token) {
      copilot.setAuthToken(result.token)
      showAuthOverlay.value = false
    }
  }

  const handleClerkAuth = async () => {
    const authService = new AuthService({
      authMode: 'clerk',
      copilotBackend: chatWidget.serverUrl.url,
      clerkPublicKey: chatWidget.clerkPublicKey
    })
    
    const user = await authService.clerkSignIn()
    if (user) {
      showAuthOverlay.value = false
    }
  }

  const closeChat = () => {
    chatWidget.isClosing = true
  }

  const onTransitionEnd = () => {
    if (chatWidget.isClosing) {
      chatWidget.isOpenChat = false
      chatWidget.isClosing = false
    }
  }

  const chatClass = computed(() => [
    'transition-all duration-300 ease-in-out backdrop-blur-sm',
    chatWidget.isMaximizedChat
      ? 'w-full h-full top-0'
      : 'w-[500px] h-[700px] bottom-[80px] rounded-lg shadow-lg right-5',
    chatWidget.isClosing ? 'translate-x-full opacity-0 scale-95' : ''
  ])
</script>
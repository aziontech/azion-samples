import { ref } from 'vue'
import { AzionCopilot, CONSTANTS } from '../core'

export function useAzionCopilot(config) {
  const copilot = new AzionCopilot(config)
  
  const token = sessionStorage.getItem('copilot_auth_token')
  if (token) {
    copilot.setAuthToken(token)
  }

  const messages = ref([])
  const isProcessingRequest = ref(false)

  copilot.on(CONSTANTS.EVENTS.MESSAGE, (event) => {
    if (event.type === 'update') {
      messages.value = event.messages
    }
  })

  const sendMessage = async (content) => {
    isProcessingRequest.value = true // Início do envio
    try {
      await copilot.sendMessage(content)
    } finally {
      isProcessingRequest.value = false // Fim do envio
    }
  }

  const cancelMessage = () => {
    copilot.cancelMessage()
  }

  const resetChat = () => {
    copilot.resetChat()
  }

  const sendFeedback = async ({ runId, feedback, comments }) => {
    await copilot.sendFeedback(runId, feedback, comments)
  }

  return {
    messages,
    sendMessage,
    sendFeedback,
    resetChat,
    isProcessingRequest,
    cancelMessage,
    copilot
  }
}

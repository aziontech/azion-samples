import { defineCustomElement } from 'vue'
import ChatCE from './ChatCE.ce.vue'

const AzionChatWidget = defineCustomElement(ChatCE)

if (!customElements.get('azion-chat-widget')) {
  customElements.define('azion-chat-widget', AzionChatWidget)
}

export { AzionChatWidget }

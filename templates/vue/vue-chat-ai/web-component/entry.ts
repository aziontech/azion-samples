import { defineCustomElement } from 'vue'
import ChatCE from './ChatCE.ce.vue'
// `@aziontech/theme` resolves to a CSS file (Tailwind + design tokens + fonts).
// `?inline` gets it back as a plain string instead of a `<link>`/emitted asset,
// so it can be injected straight into the widget's shadow root below — a
// stylesheet in the host document's <head> would never reach inside the
// shadow boundary.
import themeStyles from '@aziontech/theme?inline'

const AzionChatWidget = defineCustomElement(ChatCE, {
  styles: [themeStyles],
})

if (!customElements.get('azion-chat-widget')) {
  customElements.define('azion-chat-widget', AzionChatWidget)
}

export { AzionChatWidget }

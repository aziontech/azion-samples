<template>
  <article
    class="chat-message flex gap-3 max-w-[48rem]"
    :class="classRoleApply"
  >
    <div
      v-if="isAssistant"
      class="flex gap-3 mt-1"
    >
      <Avatar />
    </div>
    <div class="message-content">
      <div v-if="!isAssistant">
        <div
          v-html="formattedMessage"
          class="formatted-content"
        />
      </div>
      <div v-else>
        <ActionsMessage
          :message="props.message"
          :is-last-message="props.last"
          @submitFeedback="props.sendFeedback"
        >
          <div
            v-html="formattedMessage"
            class="formatted-content"
          />
          <div
            class="mt-3"
            v-if="messageReadingStatus"
          >
            <div class="animate-blink bg-primary rounded-full w-3 h-3" />
          </div>
        </ActionsMessage>
      </div>
    </div>
  </article>
</template>

<script setup>
  import { computed, onMounted } from 'vue'
  import Avatar from './avatar.vue'
  import ActionsMessage from './actions-message.vue'
  import { marked } from 'marked'
  import hljs from 'highlight.js'
  import { CONSTANTS } from '../core'

  const props = defineProps({
    message: {
      type: Object,
      required: true
    },
    last: {
      type: Boolean,
      default: false
    },
    sendFeedback: {
      type: Function,
      default: () => () => {}
    }
  })

  const highlightCode = (code, language) => {
    const codeString = String(code)

    if (language && hljs.getLanguage(language)) {
      try {
        const result = hljs.highlight(codeString, {
          language,
          ignoreIllegals: true
        })
        return result.value
      } catch (err) {
        console.error('Language highlight error:', err)
      }
    }

    return codeString
  }

  const handleCopy = async (code) => {
    try {
      await navigator.clipboard.writeText(decodeURIComponent(code))
      return true
    } catch (err) {
      console.error('Copy failed:', err)
      return false
    }
  }

  const renderer = new marked.Renderer()

  renderer.code = ({ text, lang }) => {
    const highlightedCode = highlightCode(text, lang)
    return `
    <div class="code-block border surface-border rounded-lg">
      <div class="flex items-center justify-between px-4 py-2 border-b surface-300 surface-border">
        <div class="text-sm font-semibold">
          ${lang ? lang.toUpperCase() : 'CODE'} 
        </div>

        <button 
          class="copy-button text-sm font-semibold has-copy"
          data-code="${encodeURIComponent(text)}" 
          @click="handleCodeCopy($event)">
          <i class="pi pi-copy has-copy" @click="handleCodeCopy($event)"></i>
        </button>
      </div>
      <pre class="pt-0"><code class="hljs ${lang || ''}">${highlightedCode}</code></pre>
    </div>
  `
  }

  renderer.link = ({ href, text }) => {
    return `<a href="${href}" target="_blank" rel="noopener noreferrer">${text}</a>`
  }

  marked.setOptions({
    renderer,
    gfm: true,
    breaks: true
  })

  const handleCodeCopy = async (event) => {
    let button = event.target

    if (button.tagName.toLowerCase() === 'i') {
      button = button.parentElement
    }

    const code = button.getAttribute('data-code') || ''

    if (await handleCopy(code)) {
      button.classList.add('copied')

      setTimeout(() => {
        button.classList.remove('copied')
      }, 1000)
    }
  }

  const formattedMessage = computed(() => {
    try {
      return marked(String(props.message.content || ''))
    } catch (err) {
      console.error('Marked parsing error:', err)
      return String(props.message.content || '')
    }
  })

  const isAssistant = computed(() => props.message.role === 'assistant')
  const messageReadingStatus = computed(
    () => props.message.status === CONSTANTS.STATUS.MESSAGES.RESPONDING
  )

  const classRole = {
    user: 'surface-300 ml-auto break-words w-fit rounded-lg h-fit px-4 py-3',
    assistant: 'mr-auto w-full mt-3'
  }

  const classRoleApply = classRole[props.message.role]

  onMounted(() => {
    document.addEventListener('click', (event) => {
      const target = event.target
      if (target.classList.contains('has-copy')) {
        handleCodeCopy(event)
      }
    })
  })
</script>

<style lang="scss">
  .chat-message {
    font-size: 16px;
  }

  .chat-message .message-content {
    width: auto;
    overscroll-behavior: none;
    max-width: 100%;
    overflow: hidden;
    background-color: transparent;
  }

  .chat-message .code-block {
    position: relative;
    margin: 1em 0;
    background: #282a36;
  }

  .chat-message a {
    color: var(--text-color-link);
  }

  .chat-message hr {
    margin: 1em 0;
  }

  .chat-message pre {
    margin: 0;
    padding: 1.5em 1em 1em;
    overflow-x: auto;
    background: transparent;
  }

  .chat-message pre code {
    display: block;
    padding: 0.5em;
    color: #f8f8f2;
    font-family: 'Fira Code', monospace;
    font-size: 0.9em;
    line-height: 1.5;
    background: transparent;
  }

  .chat-message .copy-button {
    padding: 0.3em 0.6em;
    font-size: 0.75rem;
    background-color: rgb(243, 101, 43, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .chat-message .copy-button:hover {
    background-color: rgb(243, 101, 43, 1);
  }

  .chat-message .copy-button.copied {
    background-color: #4caf50;
    border-color: #45a049;
  }

  .hljs-keyword {
    color: #ff79c6;
  }
  .hljs-string {
    color: #f1fa8c;
  }
  .hljs-comment {
    color: #b599e0;
  }
  .hljs-function {
    color: #50fa7b;
  }
  .hljs-number {
    color: #bd93f9;
  }
  .hljs-operator {
    color: #ff79c6;
  }
  .hljs-class {
    color: #8be9fd;
  }
  .hljs-variable {
    color: #f8f8f2;
  }
  .hljs-title {
    color: #50fa7b;
  }
  .hljs-params {
    color: #f8f8f2;
  }

  .chat-message pre::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  .chat-message pre::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 4px;
  }

  .chat-message pre::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 4px;
  }

  @keyframes copySuccess {
    0% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.1);
    }
    100% {
      transform: scale(1);
    }
  }

  .copy-button.copied {
    animation: copySuccess 0.3s ease-in-out;
  }

  @media (max-width: 768px) {
    .chat-message pre {
      font-size: 0.8em;
    }

    .chat-message .copy-button {
      opacity: 1;
      font-size: 0.7em;
    }
  }
</style>

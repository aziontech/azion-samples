<script setup lang="ts">
import Chat from '../components/Chat.vue'

defineProps<{ apiUrl?: string }>()
</script>

<template>
  <div class="azion-chat-widget-root">
    <Chat :api-url="apiUrl" />
  </div>
</template>

<style>
:host {
  display: block;
  width: 100%;
  height: 100%;
  contain: content;
}
* {
  box-sizing: border-box;
}
.azion-chat-widget-root {
  height: 100%;
  font-family: 'Sora', system-ui, -apple-system, sans-serif;
  -webkit-font-smoothing: antialiased;
}
.azion-chat-widget-root ::-webkit-scrollbar {
  width: 4px;
  height: 4px;
}
.azion-chat-widget-root ::-webkit-scrollbar-track {
  background: transparent;
}
.azion-chat-widget-root ::-webkit-scrollbar-thumb {
  background: #353040;
  border-radius: 4px;
}
.azion-chat-widget-root ::-webkit-scrollbar-thumb:hover {
  background: #524BBB;
}
</style>

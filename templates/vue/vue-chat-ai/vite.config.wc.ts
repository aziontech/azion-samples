import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

// Standalone build of the chat UI as a <azion-chat-widget> custom element,
// meant to be embedded in non-Vue hosts (e.g. a React or plain HTML app)
// via <script>. Outputs into public/widget so the Nuxt/Nitro server (and
// the Azion static-asset delivery rule) serves it alongside /api/chat.
// Run with: pnpm build:wc
export default defineConfig({
  plugins: [
    vue({
      // Only files matching *.ce.vue are compiled as custom elements;
      // sub-components (Chat.vue, ChatPanel.vue, ...) stay as normal SFCs.
      customElement: /\.ce\.vue$/,
    }),
  ],
  resolve: {
    alias: {
      '~': fileURLToPath(new URL('.', import.meta.url)),
      '@': fileURLToPath(new URL('.', import.meta.url)),
    },
  },
  // This build's outDir lives inside publicDir; disable Vite's publicDir
  // copy step for this config so it doesn't try to reconcile the two.
  publicDir: false,
  build: {
    outDir: 'public/widget',
    emptyOutDir: true,
    lib: {
      entry: 'web-component/entry.ts',
      name: 'AzionChatWidget',
      formats: ['es', 'iife'],
      fileName: (format) => `azion-chat-widget.${format}.js`,
    },
    cssCodeSplit: false,
  },
})

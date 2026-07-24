import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath, URL } from 'node:url'

// Standalone build of the chat UI as a <azion-chat-widget> custom element,
// meant to be embedded in non-Vue hosts (e.g. a React or plain HTML app)
// via <script>. Outputs into public/widget so the Nuxt/Nitro server (and
// the Azion static-asset delivery rule) serves it alongside /api/chat.
// Run with: pnpm build:wc
export default defineConfig({
  plugins: [
    tailwindcss(),
    vue({
      // Every SFC in this build is compiled in customElement mode (not just
      // ChatCE.ce.vue) so each nested component's <style> — including the
      // Tailwind utility classes Vue's compiler resolves for it — is
      // collected as an inlined style string and injected into the widget's
      // shadow root, instead of being extracted into an external stylesheet
      // that a shadow DOM boundary would never load.
      customElement: /\.vue$/,
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

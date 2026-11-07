import { defineConfig } from "vite";
import viteReact from "@vitejs/plugin-react";

// Standalone build of the chat UI as a <azion-chat-widget> custom element,
// meant to be embedded in non-React hosts (e.g. a Vue app) via <script>.
// Outputs into public/widget so the TanStack Start/Nitro server (and the
// Azion static-asset delivery rule) serves it alongside /api/chat.
// Run with: pnpm build:wc
export default defineConfig({
  plugins: [viteReact()],
  // This build's outDir lives inside publicDir; disable Vite's publicDir
  // copy step for this config so it doesn't try to reconcile the two.
  publicDir: false,
  build: {
    outDir: "public/widget",
    emptyOutDir: true,
    lib: {
      entry: "src/web-component.tsx",
      name: "AzionChatWidget",
      formats: ["es", "iife"],
      fileName: (format) => `azion-chat-widget.${format}.js`,
    },
    rollupOptions: {
      output: {
        // Bundle React in — the host app (Vue) has no React runtime to share.
        codeSplitting: false,
      },
    },
    cssCodeSplit: false,
  },
});

import tailwindcss from '@tailwindcss/vite';
import compress from 'astro-compress';
import { defineConfig } from 'astro/config';
import { visualizer } from 'rollup-plugin-visualizer';

// https://astro.build/config
export default defineConfig({
  integrations: [compress()],
  vite: {
    plugins: [tailwindcss(), visualizer()],
  },
});

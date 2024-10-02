const azion = require('azion');
const { defineConfig } = azion;

module.exports = defineConfig({
  build: {
    preset: {
      name: 'svelte',
    },
  },
});

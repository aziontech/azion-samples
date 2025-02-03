<template>
  <div class="azion azion-theme dark">
    <layout-chat />
    <floatButton />
  </div>
</template>

<script setup>
  import floatButton from '../components/float-button.vue'
  import layoutChat from '../components/layout-chat/index.vue'

  defineOptions({
    name: 'widget-azion-copilot'
  })
</script>

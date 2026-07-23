<script setup lang="ts">
import ChatPanel from './ChatPanel.vue'
import { useSettings } from '~/composables/useSettings'

defineProps<{ apiUrl?: string }>()

const settings = useSettings()
</script>

<template>
  <ChatPanel :settings="settings" :api-url="apiUrl" />
</template>

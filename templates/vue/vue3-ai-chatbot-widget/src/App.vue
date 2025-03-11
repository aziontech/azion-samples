<template>
  <Widget />
</template>

<script setup>
  import { provide, reactive } from 'vue'
  import Widget from './view/Widget.vue'

  const props = defineProps({
    user: Object,
    suggestionsOptions: Array,
    title: String,
    subTitle: String,
    serverUrl: Object,
    isOpenByDefault: Boolean,
    isMaximizedByDefault: Boolean,
    previewText: String,
    footerDisclaimer: String,
    authMode: String,
    clerkPublicKey: String
  })

  const chatWidget = reactive({
    user: props.user,
    suggestionsOptions: props.suggestionsOptions,
    title: props.title,
    subTitle: props.subTitle,
    serverUrl: props.serverUrl,
    isOpenChat: props.isOpenByDefault,
    isMaximizedChat: props.isMaximizedByDefault,
    previewText: props.previewText,
    footerDisclaimer: props.footerDisclaimer,
    authMode: props.authMode,
    clerkPublicKey: props.clerkPublicKey
  })

  provide('chatWidget', chatWidget)
</script>

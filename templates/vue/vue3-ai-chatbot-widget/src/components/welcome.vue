<template>
  <div>
    <h1 class="font-roboto text-3xl font-medium leading-9 text-center text-color">
      <template v-if="!title">
        Welcome to <span class="text-orange-500"> Copilot! </span>
      </template>
      <template v-else>
        {{ title }}
      </template>
    </h1>
    <p class="text-center text-2xl text-color-secondary mt-2">
      {{ subTitle }}
    </p>
  </div>
</template>
<script setup>
  defineProps({
    title: String,
    subTitle: {
      type: String,
      default: 'How can I help you today?'
    }
  })
</script>

<template>
  <Teleport to="head">
    <title>{{ title }}</title>
    <meta name="description" :content="description" />
    <meta v-if="image" name="image" :content="image" />
  </Teleport>
</template>

<script setup>
defineProps(["title", "description", "image"]);
</script>

<style scoped></style>

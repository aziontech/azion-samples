<template>
  <home-view :slug="route.params.slug"/>
</template>

<script setup>
import HomeView from "@/views/HomeView";
const route = useRoute()
</script>

<style scoped>

</style>
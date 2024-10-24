<template>
  <blog-posts-list :blog-posts="data.posts" />
</template>

<script setup>
import BlogPostsList from "@/components/BlogSections/BlogPostsList";
import {onMounted} from "vue";

const heading = inject('heading')
const headerText = inject('headerText')
heading.value = headerText.value = "All Blog Posts";

const {$butterCMS} = useNuxtApp()
const {data, refresh} = await useAsyncData('tag', async () => {
  const response = await $butterCMS?.post.list({})
  return {
    posts: response.data.data
  }
})
onMounted(refresh)

</script>

<style scoped>

</style>
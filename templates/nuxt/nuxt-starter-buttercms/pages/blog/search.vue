<template>
  <blog-posts-list :blog-posts="data.posts" />
</template>

<script setup>
import {butterCMS} from "@/plugins/ButterCMS";
import BlogPostsList from "@/components/BlogSections/BlogPostsList";
import {inject} from "vue";

const route = useRoute()
const heading = inject('heading')
const seoTitle = inject('seoTitle')
const headerText = inject('headerText')

const filter = String(route.query["q"])
seoTitle.value = `search results for ${filter}`
heading.value = "Search Results"
headerText.value = "Search: " + filter;

const {data} = await useAsyncData('search', async () => {
  const response = await butterCMS.post.search(filter)
  return {
    posts: response.data.data
  }
})
</script>

<style scoped>

</style>
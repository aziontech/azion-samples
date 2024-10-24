<template>
  <blog-posts-list :blog-posts="data.posts" />
</template>

<script setup>

import BlogPostsList from "@/components/BlogSections/BlogPostsList";
import {inject, onMounted} from "vue";
import {useApiError} from "@/composables/hooks";
import {getBlogTag} from "@/utils/service";

const {$butterCMS} = useNuxtApp()
const route = useRoute()
const { setError } = useApiError();

const slug = route.params.tag;

const heading = inject('heading')
const seoTitle = inject('seoTitle')
const headerText = inject('headerText')

heading.value = "Blog Posts by Tag";

const {data, refresh} = await useAsyncData('tag', async () => {
  const filter = { tag_slug: slug }
  const response = await $butterCMS?.post.list(filter)
  return {
    posts: response.data.data
  }
})
onMounted(refresh)

try{
  const tag = await getBlogTag(slug)
  headerText.value = "Tag: " + tag.name
  seoTitle.value = 'tag: ' + tag.name
} catch(e) {
  setError(e)
}

</script>

<style scoped>

</style>
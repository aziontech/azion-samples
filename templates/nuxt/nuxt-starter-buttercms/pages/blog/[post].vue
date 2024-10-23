<template>
  <div>
    <single-article :article="data.article" />
    <seo
      :title="data.article.title"
      :description="data.article.meta_description"
      :image="data.article.featured_image"
    />
  </div>
</template>

<script setup>
import SingleArticle from "@/components/BlogSections/SingleArticle";
import {inject, onMounted} from 'vue'

const heading = inject('heading')
const headerText = inject('headerText')

const route = useRoute()
const {$butterCMS} = useNuxtApp()
const {data, refresh} = await useAsyncData('article', async () => {
  const slug = route.params.post;
  const response = await $butterCMS.post.retrieve(slug);
  const article = response.data.data;
  heading.value = headerText.value = article.title
  return { article }
})
onMounted(refresh)

</script>

<style scoped>

</style>
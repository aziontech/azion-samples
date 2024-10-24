<script setup>
import BlogPostsList from "@/components/BlogSections/BlogPostsList";
import {inject, nextTick, onMounted, watch} from "vue";
import {getBlogCategory} from "@/utils/service";
import {useApiError} from "@/composables/hooks";

const props = defineProps(['params'])
const route = useRoute()
const {$butterCMS} = useNuxtApp()
const slug = route.params.category;

const { setError } = useApiError();

const heading = inject('heading')
const seoTitle = inject('seoTitle')
const headerText = inject('headerText')

heading.value = "Blog Posts by Category"

const {data, refresh} = await useAsyncData('tag', async () => {
  const filter = { category_slug: slug }
  const response = await $butterCMS?.post.list(filter)
  return {
    posts: response.data.data
  }
})
onMounted(refresh)
getBlogCategory(slug)
  .then((category) => {
    headerText.value = "Category: " + category.name;
    seoTitle.value = "category: " + category.name;
  })
  .catch((e) => setError(e));
</script>

<template>
  <blog-posts-list :blog-posts="data.posts" />
</template>
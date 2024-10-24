<template>
  <spinner v-show="loading"/>
  <seo
    :title="article.title"
    :description="article.meta_description"
    :image="article.featured_image"
  />
  <blog-header
    :heading="article.title"
    :links="basicBlogLinks"
    :text="article.title"
  />
  <blog-content-container>
    <single-article v-if="article" :article="article" />
  </blog-content-container>
</template>

<script setup>
import { useRoute } from "vue-router";
import { onMounted, ref } from "vue";
import BlogHeader from "../components/BlogSections/BlogHeader.vue";
import { butterCMS } from "@/utils/ButterCMS";
import BlogContentContainer from "../components/BlogSections/BlogContentContainer.vue";
import SingleArticle from "../components/BlogSections/SingleArticle.vue";
import { basicBlogLinks } from "@/utils";
import Seo from "@/components/Seo.vue";
import Spinner from "@/components/Spinner.vue";

const article = ref({});
const loading = ref(true)
const route = useRoute();
onMounted(async () => {
  const slug = route.params.article;
  const response = await butterCMS.post.retrieve(slug);
  article.value = response.data.data;
  loading.value = false
});
</script>

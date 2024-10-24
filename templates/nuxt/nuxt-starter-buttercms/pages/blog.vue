<template>
  <div>
    <blog-header :heading="heading" :links="headerLinks" :text="headerText" />
    <blog-content-container>
      <NuxtPage :params="route.params"/>
    </blog-content-container>
    <seo
      :title="`Sample Blog - ${seoTitle}`"
      :description="`Sample blog powered by ButterCMS, showing ${seoTitle}`"
    />
  </div>
</template>

<script setup>
import {basicBlogLinks} from "@/utils";
import {useRoute} from "vue-router";
import BlogHeader from "@/components/BlogSections/BlogHeader.vue";
import {computed, provide, ref, watch} from "vue";
import Seo from "@/components/Seo.vue";
import BlogContentContainer from "@/components/BlogSections/BlogContentContainer";
import {useApiError} from "@/composables/hooks";

const { setError } = useApiError();
const route = useRoute();
const headerText = ref("");
const heading = ref("");
const headerLinks = ref(basicBlogLinks);
const seoTitle = ref("");

provide('heading', heading)
provide('headerText', headerText)
provide('headerLinks', headerLinks)
provide('seoTitle', seoTitle)

const isMainBlogPage = computed(() =>
    Object.keys(route.params).length === 0 &&
    Object.keys(route.query).length === 0)

const resolveBlogLinks = () => {
  if(isMainBlogPage.value){
    headerLinks.value = [basicBlogLinks[0]];
    seoTitle.value = `All Posts`;
  } else headerLinks.value = basicBlogLinks
}

watch(route, resolveBlogLinks)
resolveBlogLinks()
</script>

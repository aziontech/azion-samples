<script setup>
import {inject, onMounted} from "vue";
import HeroSection from "@/components/HomepageSections/HeroSection.vue";
import TwoColumnWithImageSection from "@/components/HomepageSections/TwoColumnWithImageSection.vue";
import FeaturesSection from "@/components/HomepageSections/FeaturesSection.vue";
import BlogSection from "@/components/HomepageSections/BlogSection.vue";
import TestimonialsSection from "../components/HomepageSections/TestimonialsSection";
import {useApiError} from "../composables/hooks";
import Seo from "../components/Seo";

const { $butterCMS } = useNuxtApp()
const { setError } = useApiError();
const { handleMounted } = inject("layout")

const props = defineProps(['slug'])

const {data} = await useAsyncData('home-data', async () => {
  const pageSlug = props.slug ?? "landing-page-with-components";
  try{
    const page = await $butterCMS?.page.retrieve(
      "landing-page",
      pageSlug
    );
    const pageData = page?.data.data;
    const posts = await $butterCMS?.post.list({ page: 1, page_size: 2 });
    const blogPosts = posts?.data.data;
    return {
      pageData,
      blogPosts
    }
  } catch (e) {
    setError(e)
    return null
  }
}, {lazy: false})


onMounted(() => {
  handleMounted()
})

</script>

<template>
  <div>
    <seo v-bind="data.pageData.fields.seo" />
    <template v-for="(item, index) in data.pageData.fields.body">
      <hero-section
        v-if="item.type === 'hero'"
        :key="index"
        :fields="item.fields"
      />
      <two-column-with-image-section
        v-if="item.type === 'two_column_with_image'"
        :key="index"
        :fields="item.fields"
      />
      <features-section
        v-if="item.type === 'features'"
        :key="index"
        :fields="item.fields"
      />
      <client-only>
        <testimonials-section
          v-if="item.type === 'testimonials'"
          :key="index"
          :fields="item.fields"
        />
      </client-only>
    </template>
    <blog-section :blog-posts="data.blogPosts" />
  </div>
</template>

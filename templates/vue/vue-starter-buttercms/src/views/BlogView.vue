<template>
  <spinner v-show="loading" />
  <div v-show="!loading">
    <seo
      :title="`Sample Blog - ${seoTitle}`"
      :description="`Sample blog powered by ButterCMS, showing ${seoTitle}`"
    />
    <blog-header :heading="heading" :links="headerLinks" :text="headerText" />
    <blog-content-container>
      <blog-posts-list :blog-posts="posts" />
    </blog-content-container>
  </div>
</template>

<script setup>
import { basicBlogLinks } from "@/utils";
import { useApiError, useBlogPosts } from "@/utils/hooks";
import { useRoute } from "vue-router";
import BlogHeader from "../components/BlogSections/BlogHeader.vue";
import BlogContentContainer from "../components/BlogSections/BlogContentContainer.vue";
import BlogPostsList from "../components/BlogSections/BlogPostsList.vue";
import { ref, watch } from "vue";
import { getBlogCategory, getBlogTag } from "@/utils/service";
import Seo from "@/components/Seo.vue";
import Spinner from "@/components/Spinner.vue";

const { setError } = useApiError();
const route = useRoute();
const headerText = ref("");
const heading = ref("");
const filter = ref({});
const headerLinks = ref([]);
const seoTitle = ref("");

const loadData = () => {
  headerLinks.value = basicBlogLinks;
  if ("category" in route.params) {
    const slug = route.params.category;
    heading.value = "Blog Posts by Category";
    filter.value = { category_slug: slug };
    getBlogCategory(slug)
      .then((category) => {
        headerText.value = "Category: " + category.name;
        seoTitle.value = "Category: " + category.name;
      })
      .catch((e) => setError(e));
  } else if ("tag" in route.params) {
    const slug = route.params.tag;
    heading.value = "Blog Posts by Tag";
    filter.value = { tag_slug: slug };
    getBlogTag(slug)
      .then((tag) => {
        headerText.value = "Tag: " + tag.name;
        seoTitle.value = "Tag: " + tag.name;
      })
      .catch((e) => setError(e));
  } else if ("q" in route.query) {
    filter.value = String(route.query["q"]);
    heading.value = "Search Results";
    headerText.value = "Search: " + route.query["q"];
    seoTitle.value = `search results for ${filter.value}`;
  } else {
    headerText.value = heading.value = "All Blog Posts";
    headerLinks.value = [basicBlogLinks[0]];
    filter.value = {};
    seoTitle.value = `All Posts`;
  }
};
try {
  loadData();
} catch (e) {
  setError(e);
}
watch(route, loadData);
const { posts, loading } = useBlogPosts(filter);
</script>

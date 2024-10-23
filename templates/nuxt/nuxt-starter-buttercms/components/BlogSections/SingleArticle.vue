<template>
  <div class="single-post">
    <div class="single-post-meta">
      <h2 class="single-post-header">{{ article.title }}</h2>
      <ul class="single-post-meta-info">
        <li v-if="article.author">
          <a href="#">
            <img :src="article.author.profile_image || placeholder" alt="#" />
            {{ article.author.first_name }} {{ article.author.last_name }}
          </a>
        </li>
        <li>
          <a href="#">
            <i class="lni lni-calendar"></i>
            {{ formatTime(article.published) }}
          </a>
        </li>
        <li>
          <router-link
            v-for="tag in article.tags"
            :key="tag.slug"
            :to="`/blog/tag/${tag.slug}/`"
            class="tag"
          >
            <i class="lni lni-tag"></i>
            {{ tag.name }}
          </router-link>
        </li>
      </ul>
    </div>

    <div class="single-post-thumbnail" v-if="article.featured_image">
      <img :src="article.featured_image" :alt="article.featured_image_alt" />
    </div>

    <div class="single-post-body" v-html="article.body" />
  </div>
</template>

<script setup>
import { formatTime } from "@/utils";
import placeholder from "@/assets/images/placeholder.png";

defineProps(["article"]);
</script>

<style scoped>
.tag{
  padding-right: 10px;
}
</style>

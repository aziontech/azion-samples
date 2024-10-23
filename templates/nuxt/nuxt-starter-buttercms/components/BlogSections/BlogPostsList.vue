<template>
  <div class="row">
    <zero-data v-if="blogPosts.length === 0" />
    <div
      v-else
      v-for="post in blogPosts"
      :key="post.slug"
      class="col-12 col-lg-6"
    >
      <div class="blog-roll-card">
        <div class="blog-roll-card-meta">
          <h2 class="blog-roll-card-header">
            <nuxt-link :to="`/blog/${post.slug}/`">
              {{ post.title }}
            </nuxt-link>
          </h2>
          <ul class="blog-roll-card-meta-info">
            <li>
              <a href="#">
                <img :src="post.author.profile_image || placeholder" alt="#" />
                {{ post.author.first_name }} {{ post.author.last_name }}
              </a>
            </li>
            <li>
              <a href="#"
                ><i class="lni lni-calendar"></i>
                {{ formatTime(post.published) }}</a
              >
            </li>
            <li>
              <nuxt-link
                v-for="tag in post.tags"
                :key="tag.slug"
                :to="`/blog/tag/${tag.slug}/`"
                class="tag"
              >
                <i class="lni lni-tag"></i> {{ tag.name }}
              </nuxt-link>
            </li>
          </ul>
        </div>
        <div class="single-post-thumbnail" v-if="post.featured_image">
          <img :src="post.featured_image" :alt="post.featured_image_alt" />
        </div>
        <div class="blog-roll-card-body">
          <p>{{ post.summary }}</p>
        </div>
        <div class="blog-roll-card-footer text-center">
          <nuxt-link :to="`/blog/${post.slug}/`" class="main-btn btn-hover"
            >Read More</nuxt-link
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import ZeroData from "../ZeroData.vue";
import { formatTime } from "@/utils";
import placeholder from "@/assets/images/placeholder.png";

defineProps(["blogPosts"]);
</script>

<style scoped>
.tag{
  padding-right: 10px;
}
</style>

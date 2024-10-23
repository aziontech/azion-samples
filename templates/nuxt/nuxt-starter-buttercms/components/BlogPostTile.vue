<template>
  <div class="col-lg-4 col-md-8 col-sm-10">
    <div class="single-blog">
      <div v-if="featured_image" class="blog-header">
        <img
          class="img-fluid"
          loading="lazy"
          :src="featured_image"
          :alt="featured_image_alt"
        />
      </div>
      <div class="blog-body">
        <h5 class="package-name">
          <router-link :to="`/blog/${slug}/`">{{ title }}</router-link>
        </h5>
        <p>{{ summary }}</p>
      </div>
      <div class="blog-footer">
        <router-link :to="`/blog/${slug}/`" class="main-btn btn-hover"
          >Read More</router-link
        >
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps([
  "featured_image",
  "featured_image_alt",
  "slug",
  "title",
  "summary",
]);
</script>

<style scoped></style>

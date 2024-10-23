<template>
  <section id="blog" class="blog-section">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-lg-6 col-md-10">
          <div class="section-title text-center">
            <h2>Latest Blog Posts</h2>
            <p>
              Butter also has a built in blog engine which makes it dead simple
              to launch a new company blog.
            </p>
            <p>
              <nuxt-link class="main-btn btn-hover mt-5" to="/blog/">
                View All Blog Posts
              </nuxt-link>
            </p>
          </div>
        </div>
      </div>
      <div class="row justify-content-center">
        <blog-post-tile
          v-for="(blogPost, index) in blogPosts"
          :key="index"
          v-bind="blogPost"
        />
      </div>
    </div>
  </section>
</template>

<script setup>
import BlogPostTile from "@/components/BlogPostTile.vue";

defineProps(["blogPosts"]);
</script>

<style scoped></style>

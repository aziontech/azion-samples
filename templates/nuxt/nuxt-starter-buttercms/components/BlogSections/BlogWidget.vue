<template>
  <div>
    <div class="sidebar blog-grid-page">
      <div class="widget search-widget">
        <h5 class="widget-title">Search This Site</h5>
        <form action="/blog/search/" method="get">
          <input type="text" name="q" placeholder="Search Here..." />
          <button type="submit"><i class="lni lni-search-alt"></i></button>
        </form>
      </div>
    </div>

    <div class="widget categories-widget">
      <h5 class="widget-title">Categories</h5>
      <ul class="categories-list">
        <li v-for="category in categories" :key="category.slug">
          <nuxt-link :to="`/blog/category/${category.slug}/`">
            {{ category.name }}
          </nuxt-link>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
defineProps(["categories"]);
</script>

<style scoped></style>

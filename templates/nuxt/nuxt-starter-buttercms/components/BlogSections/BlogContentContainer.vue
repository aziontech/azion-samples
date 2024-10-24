<template>
  <section class="blog-posts">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-12 col-lg-8 blog-roll-cards">
          <slot />
        </div>
        <aside class="col-12 col-lg-4">
          <blog-widget :categories="categories" />
        </aside>
      </div>
    </div>
  </section>
</template>

<script setup>
import BlogWidget from "./BlogWidget.vue";
import {useCategories} from "@/composables/hooks";

const { categories } = useCategories();
</script>

<style scoped></style>

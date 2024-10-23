<template>
  <section id="blog-roll" class="blog-roll-nav">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-12">
          <div class="section-title text-center">
            <h2>{{ heading }}</h2>
            <ul class="breadcrumb-nav">
              <li v-for="link in links" :key="link.to">
                <router-link :to="link.to">{{ link.text }}</router-link>
              </li>
              <li>{{ text }}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
defineProps(["heading", "links", "text"]);
</script>

<style scoped></style>

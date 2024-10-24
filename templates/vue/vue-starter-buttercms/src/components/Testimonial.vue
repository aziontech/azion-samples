<template>
  <div class="single-testimonial">
    <div class="quote">
      <i class="lni lni-quotation"></i>
    </div>
    <div class="content">
      <p>{{ testimonial.quote }}</p>
    </div>
    <div class="info">
      <h6>{{ testimonial.name }}</h6>
      <p>{{ testimonial.title }}</p>
    </div>
  </div>
</template>

<script setup>
defineProps(["testimonial"]);
</script>

<style scoped></style>

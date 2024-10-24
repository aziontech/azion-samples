<template>
  <a
    href="#"
    class="scroll-top btn-hover d-flex"
    :class="{ 'd-none': !isVisible }"
  >
    <i class="lni lni-chevron-up"></i>
  </a>
</template>

<script setup>
import { onMounted, ref } from "vue";

const isVisible = ref(false);
onMounted(() => {
  const onScroll = (event) => {
    isVisible.value =
      document.body.scrollTop > 50 || document.documentElement.scrollTop > 50;
  };

  window.document.addEventListener("scroll", onScroll, { passive: true });
  return () => window.document.removeEventListener("scroll", onScroll);
});
</script>

<style scoped></style>

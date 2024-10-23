<template>
  <section :id="fields.scroll_anchor_id" class="testimonial-section mt-100">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-xl-7 col-lg-9">
          <div class="testimonial-active-wrapper">
            <div class="section-title text-center">
              <h2 class="mb-20">{{ fields.headline }}</h2>
            </div>
            <div class="testimonial-active">
              <testimonial
                v-for="(testimonial, index) in fields.testimonial"
                :key="index"
                :testimonial="testimonial"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { onMounted } from "vue";
import Testimonial from "@/components/Testimonial";
import {useNuxtApp} from "#app";

defineProps(["fields"]);
const {$tns} = useNuxtApp()

onMounted(() => {
  if (typeof window !== "undefined") {
    $tns({
      container: ".testimonial-active",
      autoplay: true,
      autoplayTimeout: 5000,
      autoplayButtonOutput: false,
      mouseDrag: true,
      gutter: 0,
      nav: false,
      navPosition: "bottom",
      controls: true,
      controlsText: [
        '<i class="lni lni-chevron-left"></i>',
        '<i class="lni lni-chevron-right"></i>',
      ],
      items: 1,
    });
  }
});
</script>

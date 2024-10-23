<template>
  <section :id="props.fields.scroll_anchor_id" class="feature-section">
    <div class="container">
      <div class="row">
        <div class="col-lg-5 col-md-10">
          <div class="section-title mb-60">
            <h2 class="mb-20">{{ props.fields.headline }}</h2>
            <p>{{ props.fields.subheadline }}</p>
          </div>
        </div>

        <div class="col-lg-7">
          <div class="row">
            <feature
              v-for="(feature, index) in fields.features"
              :key="index"
              :feature="feature"
            />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import Feature from "@/components/Feature.vue";

const props = defineProps(["fields"]);
</script>

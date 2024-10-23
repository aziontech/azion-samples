<template>
  <section :id="fields.scroll_anchor_id" class="cta-section">
    <div class="container">
      <div class="row">
        <div class="col-lg-6 order-last order-lg-first">
          <div class="cta-image" :class="`${fields.image_position}-image`">
            <img :src="fields.image" alt="" />
          </div>
        </div>
        <div class="col-lg-6">
          <div class="cta-content-wrapper">
            <div class="section-title">
              <h2 class="mb-20">{{ fields.headline }}</h2>
              <div v-html="fields.subheadline"></div>
              <a
                :href="fields.button_url"
                class="main-btn btn-hover border-btn mt-30"
                target="_blank"
                >{{ fields.button_label }}</a
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const props = defineProps(["fields"]);
</script>

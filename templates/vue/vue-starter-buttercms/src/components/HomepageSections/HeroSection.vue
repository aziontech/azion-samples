<template>
  <section :id="props.fields.scroll_anchor_id" class="hero-section">
    <div class="container">
      <div class="row align-items-center">
        <div class="col-xl-6 col-lg-6 col-md-10">
          <div class="hero-content">
            <h1>{{ props.fields.headline }}</h1>
            <p>{{ props.fields.subheadline }}</p>

            <a
              :href="props.fields.button_url"
              target="_blank"
              rel="noreferrer"
              class="main-btn btn-hover"
              >{{ props.fields.button_label }}</a
            >
            <a
              href="https://buttercms.com/join/"
              target="_blank"
              rel="noreferrer"
              >Need an account?</a
            >
          </div>
        </div>

        <div class="col-xxl-6 col-xl-6 col-lg-6">
          <div class="hero-image text-center text-lg-end">
            <img :src="props.fields.image" alt="" />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const props = defineProps(["fields"]);
</script>

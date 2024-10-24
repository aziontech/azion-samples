<template>
  <section id="home" class="hero-section">
    <div class="container">
      <div class="row align-items-center">
        <div class="col-xl-6 col-lg-6 col-md-10">
          <div class="hero-content">
            <h1>Configure your ButterCMS API Token</h1>
            <p>Please add NUXT_ENV_BUTTER_API_TOKEN to your <i>.env</i> file. Set the value as your Butter API Token.</p>
            <a
              target="_blank"
              rel="noreferrer"
              href="https://buttercms.com/join/"
              class="main-btn btn-hover"
            >
              Get your free API token
            </a>
          </div>
        </div>
        <div class="col-xxl-6 col-xl-6 col-lg-6">
          <img
            width="300"
            src="https://cdn.buttercms.com/9bPtzdJ6QSWkySNjlmyR"
            alt=""
          />
          <div class="hero-image text-center text-lg-end"></div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: "NoApiKeyView",
};
</script>

<style scoped></style>

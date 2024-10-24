<script setup>
import NoApiKeyView from "@/views/NoApiKeyView.vue";
import Layout from "@/containers/Layout.vue";
import { useApiError, useMenuItems } from "@/utils/hooks";
import ApiTokenNotFound from "@/components/ApiTokenNotFound.vue";
import Spinner from "@/components/Spinner.vue";

const apiKeyExists = !!import.meta.env.VITE_APP_BUTTER_CMS_API_KEY;

const { items, loading } = useMenuItems();
const { error } = useApiError();
</script>

<template>
  <spinner v-if="loading"/>
  <no-api-key-view v-else-if="!apiKeyExists" />
  <api-token-not-found v-else-if="error" />
  <Layout :menu-items="items" v-else>
    <RouterView />
  </Layout>
</template>

<style>
@import "@/assets/css/bootstrap.min.css";
@import "@/assets/css/main.css";
@import "@/assets/css/lineicons.css";
@import "@/assets/css/tiny-slider.css";
</style>

<script setup>
import {nextTick, onMounted, onUnmounted, provide, ref} from "vue";
import { useRoute } from "vue-router";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ScrollToTop from "../components/ScrollToTop";
import Spinner from "../components/Spinner";
import {useApiError, useMenuItems} from "../composables/hooks";
import NoApiKeyView from "../views/NoApiKeyView";
import ApiTokenNotFound from "../components/ApiTokenNotFound";

const activeLink = ref("");
const route = useRoute();
const { items, loading } = useMenuItems();
const {error} = useApiError()
const config = useRuntimeConfig();

const apiKeyExists = !!config.API_KEY

onMounted(() => {
  window.addEventListener("load", scrollToSection);
  window.document.addEventListener("scroll", onScroll, { passive: true });
});

onUnmounted(() => {
  window.removeEventListener("load", scrollToSection);
  window.document.removeEventListener("scroll", onScroll);
});

const onScroll = () => {
  const sections = document.querySelectorAll(".page-scroll");
  const scrollPos =
    window.pageYOffset ||
    document.documentElement.scrollTop ||
    document.body.scrollTop;

  for (let currLink of sections) {
    const currLinkHref = currLink.getAttribute("href");
    const val = currLinkHref?.replace("/", "");
    const refElement = document.querySelector(String(val));
    const scrollTopMinus = scrollPos + 73;

    if (
      refElement &&
      refElement.offsetTop <= scrollTopMinus &&
      refElement.offsetTop + refElement.offsetHeight > scrollTopMinus
    ) {
      activeLink.value = String(currLinkHref);
    }
  }
};

const scrollToSection = async () => {
  await nextTick();
  if (route.hash) {
    const elementToScrollId = route.hash.slice(1);
    let elem = document.getElementById(elementToScrollId);
    if (elem) elem.scrollIntoView({ behavior: "smooth" });
  } else {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }
};

function handleMounted() {
  scrollToSection()
}

provide("layout", {
  handleMounted
})

</script>

<template>
  <div>
    <no-api-key-view v-if="!apiKeyExists" />
    <spinner v-else-if="loading"/>
    <api-token-not-found v-else-if="error" />
    <div v-else>
      <Header :menu-items="items" :active-link="activeLink"/>
      <slot/>
      <ScrollToTop/>
      <Footer :menu-items="items" :active-link="activeLink"/>
    </div>
  </div>
</template>
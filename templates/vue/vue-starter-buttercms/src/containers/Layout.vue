<script setup>
import Header from "@/containers/Header.vue";
import {nextTick, onMounted, onUnmounted, provide, ref} from "vue";
import ScrollToTop from "@/components/ScrollToTop.vue";
import Footer from "@/containers/Footer.vue";
import { useRoute } from "vue-router";

defineProps(["menuItems"]);

const activeLink = ref("");
const route = useRoute();

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
  <Header :menu-items="menuItems" :active-link="activeLink" />
  <slot/>
  <ScrollToTop />
  <Footer :menu-items="menuItems" :active-link="activeLink" />
</template>

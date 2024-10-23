import {defineNuxtPlugin, useRuntimeConfig} from "#app";
import Butter from "buttercms";
import {butterCMS} from "~/plugins/ButterCMS";


export default defineNuxtPlugin(nuxtApp => {
  nuxtApp.$router.options.scrollBehavior = () => {
    return { left: 0, top: 0, behavior: 'auto' }
  }
})
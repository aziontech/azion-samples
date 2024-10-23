import Butter, {ButterStatic} from "buttercms";
import {defineNuxtPlugin, useRuntimeConfig} from "#app";

export let butterCMS:ButterStatic | undefined = undefined;

export default defineNuxtPlugin(nuxtApp => {
  const config = useRuntimeConfig();
  try {
    const apiKey = String(config.API_KEY);
    const preview = config.PREVIEW !== "false";
    butterCMS = Butter(apiKey, preview);
  } catch (error) {
    console.error(error);
  }

  nuxtApp.provide('butterCMS', butterCMS)
})


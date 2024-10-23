import {defineNuxtPlugin} from "#app";
import {tns} from 'tiny-slider'

export default defineNuxtPlugin(nuxtApp => {
  nuxtApp.provide('tns', tns)
})
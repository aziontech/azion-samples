<template>
  <div
    class="justify-center items-start gap-3 inline-flex max-h-[25rem] overflow-y-auto custom-scroll p-1"
  >
    <div class="flex flex-wrap justify-center gap-3">
      <Card
        class="p-4 w-52 cursor-pointer select-none"
        v-for="(suggestion, index) in props.listSuggestions"
        :key="index"
        @click="emit('sendSuggestion', suggestion.context)"
      >
        <template #title>
          <span
            class="text-orange-500"
            :class="suggestion.icon || 'pi pi-question-circle'"
          />
        </template>
        <template #content>
          <p class="text-xs sm:text-sm text-color-secondary">
            {{ suggestion.title }}
          </p>
        </template>
      </Card>
    </div>
  </div>
</template>

<script setup>
  import Card from 'primevue/card'
  const emit = defineEmits(['sendSuggestion'])

  const props = defineProps({
    listSuggestions: {
      type: Array,
      default: () => []
    }
  })
</script>

<script setup lang="ts">
defineProps<{ error?: Error | { message?: string } }>()
</script>

<template>
  <div class="p-[var(--spacing-6)] bg-[var(--bg-canvas)] min-h-screen font-mono">
    <div class="text-body-sm text-[var(--danger)] mb-[var(--spacing-3)]">
      <strong>Error:</strong> {{ error?.message ?? 'Unknown error' }}
    </div>
    <NuxtLink
      to="/"
      class="text-body-sm text-[var(--primary)] no-underline mt-[var(--spacing-4)] inline-block"
    >
      Go home
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
</script>

<template>
  <div class="p-[var(--spacing-6)] bg-[var(--bg-canvas)] min-h-screen font-mono text-center flex flex-col items-center justify-center">
    <p class="text-heading-2xl text-[var(--text-disabled)] mb-[var(--spacing-3)]">404</p>
    <p class="text-body-sm text-[var(--text-muted)] mb-[var(--spacing-5)]">Page not found</p>
    <NuxtLink to="/" class="text-body-xs text-[var(--primary)] no-underline tracking-wider">
      GO HOME
    </NuxtLink>
  </div>
</template>

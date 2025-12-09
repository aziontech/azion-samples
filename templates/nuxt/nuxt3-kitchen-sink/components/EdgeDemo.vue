<script setup>
const { data: info } = await useAsyncData(() =>
  globalThis.$fetch('/api/info', {
    headers: useRequestHeaders(['x-forwarded-for', 'user-agent']),
  })
);
const generatedAt = useState(() => new Date().toISOString());
</script>

<template>
  <div class="bg-light p-6 rounded">
    <div>Hello from the Edge!</div>
    <div>
      Your IP address: <span>{{ info.ip }}</span>
    </div>
    <div>
      Your User Agent: <span>{{ info.ua }}</span>
    </div>
    <div>
      Generated at: <span>{{ generatedAt }}</span>
    </div>
  </div>
</template>
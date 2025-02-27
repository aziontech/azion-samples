<template>
  <div class="auth-modal-overlay">
    <div class="auth-modal">
      <h2>Authentication Required</h2>
      <form class="auth-form" @submit.prevent="handleSubmit">
        <div v-if="error" class="error-message">
          {{ error }}
        </div>
        <div v-if="loading" class="loading-message">
          Loading...
        </div>
        <input 
          type="password" 
          v-model="password" 
          placeholder="Enter password"
          :disabled="loading"
          autofocus
        />
        <button 
          type="submit"
          :disabled="loading"
        >
          {{ loading ? 'Signing in...' : 'Sign In' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  onSubmit: {
    type: Function,
    required: true
  }
})

const password = ref('')
const loading = ref(false)
const error = ref('')

const handleSubmit = async () => {
  if (!password.value) {
    error.value = 'Password is required'
    return
  }
  
  loading.value = true
  error.value = ''
  
  try {
    await props.onSubmit(password.value)
  } catch (err) {
    error.value = err.message || 'Invalid password'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
@import '../assets/auth-modal.css';
</style> 
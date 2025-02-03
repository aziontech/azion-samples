<template>
  <div>
    <div class="group">
      <slot></slot>
      <div
        class="relative w-full"
        :class="{
          'opacity-0 group-hover:opacity-100 transition-opacity duration-300':
            !isLastMessage && !isMobile
        }"
        v-if="isMessageCompleted"
      >
        <div
          v-if="currentState === 'initial'"
          class="flex items-center gap-3 w-fit mt-1 p-1"
        >
          <PrimeButton
            icon="pi pi-copy"
            outlined
            size="small"
            @click="copyMessage"
          />
        </div>
      </div>
    </div>
    <div
      v-if="currentState === 'feedback'"
      class="mt-5 p-3 rounded-lg border border-gray-300"
      ref="feedbackSection"
    >
      <div class="mb-3 text-sm">What was the issue with this response?</div>
      <div class="flex flex-col gap-2">
        <div
          v-for="option in feedbackOptions"
          :key="option.value"
          class="flex items-center p-2 rounded cursor-pointer"
          @click="selectFeedbackOption(option.value)"
        >
          <RadioButton
            :modelValue="selectedOption"
            :value="option.value"
            :name="option.value"
          />
          <label
            :for="option.value"
            class="ml-2 text-sm cursor-pointer"
          >
            {{ option.label }}
          </label>
        </div>

        <div
          class="mt-2"
          v-if="selectedOption == 'other'"
        >
          <Textarea
            v-model="additionalComment"
            placeholder="Additional comments (optional)"
            rows="2"
            class="w-full text-sm"
            autoResize
          />
        </div>
        <div class="flex justify-end gap-2 mt-3">
          <PrimeButton
            label="Cancel"
            text
            size="small"
            @click="resetFeedback"
          />
          <PrimeButton
            label="Submit feedback"
            size="small"
            @click="handleFeedbackSubmission"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { ref, onMounted, watch, nextTick, computed } from 'vue'
  import { useToast } from 'primevue/usetoast'
  import PrimeButton from 'primevue/button'
  import RadioButton from 'primevue/radiobutton'
  import Textarea from 'primevue/textarea'
  import { CONSTANTS } from '../core'

  defineOptions({
    name: 'ActionsMessage'
  })

  const emit = defineEmits(['submitFeedback'])

  const props = defineProps({
    message: {
      type: Object,
      required: true
    },
    isLastMessage: {
      type: Boolean,
      default: false
    }
  })

  const toast = useToast()
  const isMobile = ref(false)
  const currentState = ref('initial')
  const feedback = ref('')
  const selectedOption = ref('')
  const additionalComment = ref('')
  const feedbackSection = ref(null)

  const feedbackOptions = [
    { label: 'Incorrect or inaccurate information', value: 'inaccurate' },
    { label: 'Not helpful for my question', value: 'not_helpful' },
    { label: 'Unclear or confusing response', value: 'unclear' },
    { label: 'Harmful or inappropriate content', value: 'harmful' },
    { label: 'Other', value: 'other' }
  ]

  onMounted(() => {
    checkIfMobile()
    window.addEventListener('resize', checkIfMobile)
  })

  watch(currentState, (newState) => {
    if (newState === 'feedback') {
      nextTick(() => {
        const section = feedbackSection.value
        section?.scrollIntoView({ behavior: 'smooth' })
      })
    }
  })

  const checkIfMobile = () => {
    isMobile.value = window.innerWidth <= 768
  }

  const isMessageCompleted = computed(() => {
    return props.message.status === CONSTANTS.STATUS.MESSAGES.COMPLETED
  })

  const copyMessage = async () => {
    try {
      await navigator.clipboard.writeText(props.message.content)
      toast.add({
        severity: 'success',
        summary: 'Copied',
        detail: 'Message copied to clipboard',
        life: 2000
      })
    } catch (err) {
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to copy message',
        life: 2000
      })
    }
  }

  const handleFeedback = (isTypeFeedback) => {
    if (isTypeFeedback) {
      feedback.value = CONSTANTS.STATUS.FEEDBACK.LIKE
      handleFeedbackSubmission()
    } else {
      feedback.value = CONSTANTS.STATUS.FEEDBACK.DISLIKE
      currentState.value = 'feedback'
    }
  }

  const selectFeedbackOption = (value) => {
    selectedOption.value = value
    additionalComment.value = ''
  }

  const resetFeedback = () => {
    currentState.value = 'initial'
    feedback.value = ''
    selectedOption.value = ''
    additionalComment.value = ''
  }

  const handleFeedbackSubmission = () => {
    const selectedFeedbackOption = feedbackOptions.find(
      (option) => option.value === selectedOption.value
    )

    const messageFeedback = additionalComment.value
      ? `${selectedFeedbackOption?.label}: ${additionalComment.value}`
      : selectedFeedbackOption?.label

    emit('submitFeedback', {
      runId: props.message.id,
      feedback: feedback.value,
      comments: messageFeedback
    })

    resetFeedback()
  }
</script>

<style scoped>
  .message-feedback-wrapper.is-last {
    opacity: 100;
  }
</style>

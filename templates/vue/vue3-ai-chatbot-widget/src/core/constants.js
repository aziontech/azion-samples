export const CONSTANTS = {
  SERVER: {
    DEFAULT: {
      url: '',
      conversation: '/chat/completions',
      feedback: '/feedback'
    }
  },
  MESSAGES: {
    SYSTEM: {
      ERROR: 'Sorry, something went wrong.',
      FEEDBACK: 'Thank you for your feedback.'
    }
  },
  STATUS: {
    MESSAGES: {
      RESPONDING: 'responding',
      ERROR: 'error',
      COMPLETED: 'completed',
      CANCELED: 'canceled'
    },
    FEEDBACK: {
      LIKE: 'like',
      DISLIKE: 'dislike',
      NEUTRAL: 'neutral'
    }
  },
  WINDOW_EVENT: {
    NAMESPACE: 'azionCopilot'
  },
  EVENTS: {
    MESSAGE: 'message',
    ERROR: 'error',
    CLEAR: 'clear',
    CANCEL: 'cancel',
    FEEDBACK: 'feedback',
    AUTH_REQUIRED: 'auth_required'
  }
}

import { CONSTANTS } from './constants'
import { EventEmitter } from './events'

export class AzionCopilot {
  constructor(config = {}) {
    this.messages = []
    this.sessionId = crypto.randomUUID()
    this.events = new EventEmitter()
    this.authToken = null
    this.authMode = config.authMode

    this.serverConfig = {
      ...CONSTANTS.SERVER.DEFAULT,
      ...config.server
    }

    this.config = {
      server: this.serverConfig,
      stream: config.stream ?? true,
      historyMessages: config.historyMessages || []
    }

    this.messages = this.createHistoryMessages(this.config.historyMessages)
    this.setupWindowListener()
  }

  createHistoryMessages(messages) {
    return messages.map((msg) => ({
      ...msg,
      id: msg.id || crypto.randomUUID(),
      status: CONSTANTS.STATUS.MESSAGES.COMPLETED,
      feedback:
        msg.role === 'assistant'
          ? (msg.feedback ?? { completed: false, rating: CONSTANTS.STATUS.FEEDBACK.NEUTRAL })
          : msg.feedback
    }))
  }

  setupWindowListener() {
    window.addEventListener('message', (event) => {
      if (event.data?.type === CONSTANTS.WINDOW_EVENT.NAMESPACE) {
        this.sendMessage(event.data.message).catch((error) => {
          this.events.emit(CONSTANTS.EVENTS.ERROR, error)
        })
      }
    })
  }

  createInitialMessage(content) {
    return {
      id: crypto.randomUUID(),
      role: 'user',
      content,
      status: CONSTANTS.STATUS.MESSAGES.COMPLETED
    }
  }

  createAssistantMessage() {
    return {
      role: 'assistant',
      content: '',
      status: CONSTANTS.STATUS.MESSAGES.RESPONDING,
      feedback: {
        completed: false,
        rating: CONSTANTS.STATUS.FEEDBACK.NEUTRAL
      }
    }
  }

  emitMessagesUpdate() {
    this.events.emit(CONSTANTS.EVENTS.MESSAGE, {
      type: 'update',
      messages: [...this.messages]
    })
  }

  async handleStreamResponse(response, message) {
    const reader = response.body?.getReader()
    if (!reader) {
      throw new Error('No reader available in stream response')
    }

    const decoder = new TextDecoder('utf-8')
    let fullContent = ''

    try {
      let reading = true
      while (reading) {
        if (!this.currentRequest) {
          throw new Error('Request was cancelled')
        }
        const { done, value } = await reader.read()
        reading = !done

        if (done) {
          const updatedMessage = {
            ...message,
            content: fullContent,
            status: CONSTANTS.STATUS.MESSAGES.COMPLETED
          }

          this.messages[this.messages.length - 1] = updatedMessage

          this.emitMessagesUpdate()
          break
        }

        const chunk = decoder.decode(value)

        chunk
          .split('\n')
          .map((line) => line.replace(/^data: /, '').trim())
          .filter((line) => line && line !== '[DONE]')
          .forEach((line) => {
            try {
              const parsedLine = JSON.parse(line)
              const { choices, id } = parsedLine
              const content = choices[0]?.delta?.content

              if (content) {
                fullContent += content

                const updatedMessage = {
                  ...message,
                  id,
                  content: fullContent
                }

                this.messages[this.messages.length - 1] = updatedMessage


                this.emitMessagesUpdate()
              }
            } catch (error) {
              console.error('Error processing stream chunk:', error)
            }
          })
      }
    } catch (error) {
      if (error.name !== 'AbortError') {
        const errorMessage = {
          ...message,
          status: CONSTANTS.STATUS.MESSAGES.ERROR,
          content: fullContent
        }

        this.messages[this.messages.length - 1] = errorMessage

        this.emitMessagesUpdate()
        throw error
      }
    } finally {
      reader.releaseLock()
      this.currentRequest = null
    }
  }

  async sendMessage(content) {
    const userMessage = this.createInitialMessage(content)
    const assistantMessage = this.createAssistantMessage()

    const messageQueue = [...this.messages, userMessage]
    this.messages = [...this.messages, userMessage, assistantMessage]
    this.emitMessagesUpdate()

    this.currentRequest = new AbortController()
    try {
      const headers = { 
        'Content-Type': 'application/json',
      }
      
      const shouldIncludeCredentials = this.authMode === 'clerk' || this.authMode === 'basic'

      if (this.authToken && this.authMode === 'basic') {
        headers['Authorization'] = `Bearer ${this.authToken}`
      }

      if (this.authMode === 'clerk') {
        headers['Authorization'] = `Bearer ${document.cookie.split('__session=')[1]?.split(';')[0]}`
      }

      const response = await fetch(`${this.serverConfig.url}${this.serverConfig.conversation}`, {
        method: 'POST',
        credentials: shouldIncludeCredentials ? 'include' : 'omit',
        headers,
        body: JSON.stringify({
          messages: messageQueue,
          stream: this.config.stream,
          session_id: this.sessionId
        }),
        signal: this.currentRequest.signal
      })

      if (!response.ok) {
        if (response.status === 401) {
          this.events.emit(CONSTANTS.EVENTS.AUTH_REQUIRED)
          throw new Error('Authentication required')
        }
        assistantMessage.status = CONSTANTS.STATUS.MESSAGES.ERROR
        assistantMessage.content = CONSTANTS.MESSAGES.SYSTEM.ERROR

        this.messages[this.messages.length - 1] = { ...assistantMessage }

        this.emitMessagesUpdate()
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      if (this.config.stream) {
        await this.handleStreamResponse(response, assistantMessage)
      } else {
        const data = await response.json()
        const completedMessage = {
          ...assistantMessage,
          content: data.content,
          status: CONSTANTS.STATUS.MESSAGES.COMPLETED
        }

        this.messages[this.messages.length - 1] = completedMessage

        this.emitMessagesUpdate()
      }

      return assistantMessage
    } catch (error) {
      if (error.name !== 'AbortError') {
        const errorMessage = {
          ...assistantMessage,
          status: CONSTANTS.STATUS.MESSAGES.ERROR
        }

        this.messages[this.messages.length - 1] = errorMessage

        this.emitMessagesUpdate()
        throw error
      }
      throw error
    }
  }

  cancelMessage() {
    this.currentRequest?.abort()
    this.currentRequest = null

    const lastAssistantMessage = [...this.messages]
      .reverse()
      .find((m) => m.role === 'assistant' && m.status === CONSTANTS.STATUS.MESSAGES.RESPONDING)

    if (lastAssistantMessage) {
      lastAssistantMessage.status = CONSTANTS.STATUS.MESSAGES.CANCELED
      lastAssistantMessage.content += '\n'

      const index = this.messages.findIndex((m) => m.id === lastAssistantMessage.id)
      if (index !== -1) {
        this.messages[index] = { ...lastAssistantMessage }
      }

      this.emitMessagesUpdate()
    }

    this.events.emit(CONSTANTS.EVENTS.CANCEL)
  }

  async sendFeedback(messageId, rating, comments) {
    try {
      const message = this.messages.find((m) => m.id === messageId)
      if (!message) {
        throw new Error('Message not found')
      }
      if (!message.feedback) {
        throw new Error('Message does not support feedback')
      }
      if (message.status !== CONSTANTS.STATUS.MESSAGES.COMPLETED) {
        throw new Error('Can only provide feedback for completed messages')
      }

      const feedbackData = {
        runId: messageId,
        feedback: rating === CONSTANTS.STATUS.FEEDBACK.LIKE,
        comments
      }

      const headers = { 
        'Content-Type': 'application/json',
      }

      const shouldIncludeCredentials = this.authMode === 'clerk' || this.authMode === 'basic'

      if (this.authToken && this.authMode === 'basic') {
        headers['Authorization'] = `Bearer ${this.authToken}`
      }

      if (this.authMode === 'clerk') {
        headers['Authorization'] = `Bearer ${document.cookie.split('__session=')[1]?.split(';')[0]}`
      }

      const response = await fetch(`${this.serverConfig.url}${this.serverConfig.feedback}`, {
        method: 'POST',
        credentials: shouldIncludeCredentials ? 'include' : 'omit',
        headers,
        body: JSON.stringify(feedbackData)
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const updatedMessage = {
        ...message,
        feedback: {
          ...message.feedback,
          completed: true,
          rating,
          comments
        }
      }

      const index = this.messages.findIndex((m) => m.id === messageId)
      if (index !== -1) {
        this.messages[index] = updatedMessage
      }

      this.emitMessagesUpdate()
      this.events.emit(CONSTANTS.EVENTS.FEEDBACK, {
        messageId,
        feedback: updatedMessage.feedback
      })
    } catch (error) {
      this.events.emit(CONSTANTS.EVENTS.ERROR, error)
      throw error
    }
  }

  resetChat() {
    this.cancelMessage()
    this.messages = []
    this.sessionId = crypto.randomUUID()
    this.emitMessagesUpdate()
    this.events.emit(CONSTANTS.EVENTS.CLEAR)
  }

  async replyMessage() {
    const lastUserMessage = [...this.messages].reverse().find((m) => m.role === 'user')

    if (lastUserMessage) {
      await this.sendMessage(lastUserMessage.content)
    } else {
      throw new Error('No previous user message found')
    }
  }

  gets = {
    Messages: () => [...this.messages],
    SessionId: () => this.sessionId,
    Server: () => ({ ...this.serverConfig }),
    Stream: () => this.config.stream
  }

  sets = {
    Messages: (messages) => {
      this.messages = [...messages]
      this.emitMessagesUpdate()
    },
    Server: (config) => {
      this.serverConfig = { ...config }
    },
    Stream: (stream) => {
      this.config.stream = stream
    },
    SessionId: (id) => {
      this.sessionId = id
    }
  }

  on(event, callback) {
    return this.events.on(event, callback)
  }

  setAuthToken(token) {
    this.authToken = token
  }
}

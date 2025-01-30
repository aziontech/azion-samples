import { CONSTANTS } from './constants'
export function EventEmitter() {
  this.events = new Map()

  this.on = function(event, callback) {
    if (!this.events.has(event)) {
      this.events.set(event, [])
    }

    this.events.get(event).push(callback)

    return () => {
      const callbacks = this.events.get(event)
      if (callbacks) {
        const index = callbacks.indexOf(callback)
        if (index !== -1) {
          callbacks.splice(index, 1)
        }
      }
    }
  }

  this.emit = function(event, data) {
    const callbacks = this.events.get(event)
    if (callbacks) {
      callbacks.forEach((callback) => callback(data))
    }

    window.dispatchEvent(
      new CustomEvent(`${CONSTANTS.WINDOW_EVENT.NAMESPACE}:${event}`, {
        detail: data
      })
    )
  }
}

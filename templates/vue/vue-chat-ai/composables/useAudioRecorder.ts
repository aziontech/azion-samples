import { onMounted, ref } from 'vue'

type SpeechRecognitionEventLike = {
  resultIndex: number
  results: ArrayLike<{
    isFinal: boolean
    0: { transcript: string }
  }>
}

type SpeechRec = {
  continuous: boolean
  interimResults: boolean
  lang: string
  onresult: ((e: SpeechRecognitionEventLike) => void) | null
  onerror: (() => void) | null
  onend: (() => void) | null
  start(): void
  stop(): void
}

function getSR(): (new () => SpeechRec) | null {
  if (typeof window === 'undefined') return null
  return (
    (window as any).SpeechRecognition ??
    (window as any).webkitSpeechRecognition ??
    null
  )
}

export function useAudioRecorder(onTranscript: (text: string) => void) {
  const isRecording = ref(false)
  const supported = ref(false)
  let rec: SpeechRec | null = null

  onMounted(() => {
    supported.value = getSR() !== null
  })

  function start(): boolean {
    const SR = getSR()
    if (!SR) return false

    const instance = new SR()
    instance.continuous = true
    instance.interimResults = false
    instance.lang = navigator.language || 'pt-BR'

    instance.onresult = (e) => {
      let delta = ''
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const result = e.results[i]
        if (result.isFinal) delta += result[0].transcript
      }
      const trimmed = delta.trim()
      if (trimmed) onTranscript(trimmed)
    }
    instance.onerror = () => {
      isRecording.value = false
    }
    instance.onend = () => {
      isRecording.value = false
    }
    instance.start()

    rec = instance
    isRecording.value = true
    return true
  }

  function stop() {
    rec?.stop()
    rec = null
    isRecording.value = false
  }

  return { isRecording, supported, start, stop }
}

import { onMounted, ref } from 'vue'

type SpeechRec = {
  continuous: boolean
  interimResults: boolean
  lang: string
  onresult: ((e: any) => void) | null
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

    instance.onresult = (e: any) => {
      const transcript = Array.from(e.results as any[])
        .map((r: any) => r[0].transcript)
        .join(' ')
        .trim()
      if (transcript) onTranscript(transcript)
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

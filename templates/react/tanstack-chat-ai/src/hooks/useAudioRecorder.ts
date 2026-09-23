import { useEffect, useRef, useState } from 'react'

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
  return (window as any).SpeechRecognition ?? (window as any).webkitSpeechRecognition ?? null
}

export function useAudioRecorder(onTranscript: (text: string) => void) {
  const [isRecording, setIsRecording] = useState(false)
  const [supported, setSupported] = useState(false)
  const recRef = useRef<SpeechRec | null>(null)

  useEffect(() => {
    setSupported(getSR() !== null)
  }, [])

  function start(): boolean {
    const SR = getSR()
    if (!SR) return false

    const rec = new SR()
    rec.continuous = true
    rec.interimResults = false
    rec.lang = navigator.language || 'pt-BR'

    rec.onresult = (e: any) => {
      const transcript = Array.from(e.results as any[])
        .map((r: any) => r[0].transcript)
        .join(' ')
        .trim()
      if (transcript) onTranscript(transcript)
    }
    rec.onerror = () => setIsRecording(false)
    rec.onend = () => setIsRecording(false)
    rec.start()

    recRef.current = rec
    setIsRecording(true)
    return true
  }

  function stop() {
    recRef.current?.stop()
    recRef.current = null
    setIsRecording(false)
  }

  return { isRecording, supported, start, stop }
}

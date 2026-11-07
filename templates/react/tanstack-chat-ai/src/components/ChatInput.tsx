import { useRef, useState, type KeyboardEvent, type ChangeEvent } from 'react'
import { useAudioRecorder } from '../hooks/useAudioRecorder'

interface AttachedFile {
  name: string
  content: string
}

interface Props {
  onSend: (text: string) => void
  onStop: () => void
  isLoading: boolean
  disabled: boolean
  disabledReason?: string
}

// 32KB limit — stays safely within Azion edge function body limits
const MAX_SIZE = 32 * 1024
const ACCEPTED = '.txt,.md,.ts,.tsx,.js,.jsx,.py,.json,.yaml,.yml,.html,.css,.sql,.sh,.csv,.xml,.toml,.go,.rs,.java,.kt,.swift,.rb,.php,.c,.cpp,.h'

export function ChatInput({ onSend, onStop, isLoading, disabled, disabledReason }: Props) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([])

  function handleTranscript(text: string) {
    const el = textareaRef.current
    if (!el) return
    el.value = el.value ? `${el.value} ${text}` : text
    el.style.height = 'auto'
    el.style.height = Math.min(el.scrollHeight, 160) + 'px'
    el.focus()
  }

  const { isRecording, supported: micSupported, start: startRec, stop: stopRec } = useAudioRecorder(handleTranscript)

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      submit()
    }
  }

  function submit() {
    const userText = textareaRef.current?.value.trim() ?? ''
    if ((!userText && attachedFiles.length === 0) || isLoading || disabled) return

    const fileBlocks = attachedFiles
      .map((f) => `[Arquivo: ${f.name}]\n\`\`\`\n${f.content}\n\`\`\``)
      .join('\n\n')

    const fullText = fileBlocks
      ? userText ? `${fileBlocks}\n\n${userText}` : fileBlocks
      : userText

    onSend(fullText)

    if (textareaRef.current) {
      textareaRef.current.value = ''
      textareaRef.current.style.height = 'auto'
    }
    setAttachedFiles([])
  }

  async function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? [])
    const added: AttachedFile[] = []
    const skipped: string[] = []

    for (const file of files) {
      if (file.size > MAX_SIZE) {
        skipped.push(file.name)
        continue
      }
      try {
        const content = await file.text()
        added.push({ name: file.name, content })
      } catch {
        // skip unreadable files
      }
    }

    if (skipped.length > 0) {
      alert(`Arquivos ignorados (limite 32KB): ${skipped.join(', ')}`)
    }

    setAttachedFiles((prev) => {
      const existing = new Set(prev.map((f) => f.name))
      return [...prev, ...added.filter((f) => !existing.has(f.name))]
    })

    if (e.target) e.target.value = ''
  }

  function toggleMic() {
    if (isRecording) stopRec()
    else startRec()
  }

  const canSend = !disabled && !isLoading

  return (
    <div
      style={{
        background: '#111111',
        padding: '12px 20px 20px',
        flexShrink: 0,
      }}
    >
      {disabledReason && (
        <p
          style={{
            fontSize: '11px',
            fontFamily: 'monospace',
            color: '#666666',
            marginBottom: '10px',
            textAlign: 'center',
            letterSpacing: '0.04em',
          }}
        >
          {disabledReason}
        </p>
      )}

      {/* Rounded input container */}
      <div
        style={{
          maxWidth: '720px',
          margin: '0 auto',
          background: '#1C1C1C',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '16px',
          overflow: 'hidden',
          transition: 'border-color 0.15s ease',
        }}
        onFocusCapture={(e) => {
          e.currentTarget.style.borderColor = 'rgba(254,96,31,0.35)'
        }}
        onBlurCapture={(e) => {
          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'
        }}
      >
        {/* File chips inside the container */}
        {attachedFiles.length > 0 && (
          <div
            style={{
              padding: '10px 12px 0',
              display: 'flex',
              flexWrap: 'wrap',
              gap: '6px',
            }}
          >
            {attachedFiles.map((f) => (
              <div
                key={f.name}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  padding: '3px 8px 3px 8px',
                  background: 'rgba(254,96,31,0.1)',
                  border: '0.8px solid rgba(254,96,31,0.28)',
                  borderRadius: '6px',
                  fontSize: '11px',
                  fontFamily: 'monospace',
                  color: '#FF8E4D',
                  letterSpacing: '0.02em',
                }}
              >
                <FileIcon />
                <span style={{ maxWidth: '160px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {f.name}
                </span>
                <button
                  onClick={() => setAttachedFiles((p) => p.filter((x) => x.name !== f.name))}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#FF8E4D',
                    cursor: 'pointer',
                    padding: '0 0 0 2px',
                    lineHeight: 1,
                    opacity: 0.6,
                    fontSize: '12px',
                    transition: 'opacity 0.15s',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.opacity = '1' }}
                  onMouseLeave={(e) => { e.currentTarget.style.opacity = '0.6' }}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Input row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '4px 8px 4px 4px',
            gap: '4px',
          }}
        >
          {/* + / Attach button */}
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={!canSend}
            title="Anexar arquivo"
            style={{
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              background: 'transparent',
              border: 'none',
              borderRadius: '10px',
              color: canSend ? '#4D4D4D' : '#2D2D2D',
              cursor: canSend ? 'pointer' : 'not-allowed',
              transition: 'all 0.15s ease',
              fontSize: '22px',
              fontWeight: 300,
              lineHeight: 1,
            }}
            onMouseEnter={(e) => {
              if (canSend) {
                e.currentTarget.style.background = 'rgba(255,255,255,0.06)'
                e.currentTarget.style.color = '#FCFCFC'
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent'
              e.currentTarget.style.color = canSend ? '#4D4D4D' : '#2D2D2D'
            }}
          >
            +
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept={ACCEPTED}
            multiple
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />

          {/* Textarea */}
          <textarea
            ref={textareaRef}
            rows={1}
            disabled={disabled || isLoading}
            onKeyDown={handleKeyDown}
            placeholder={
              disabled
                ? 'Configure a chave de API em Settings…'
                : isLoading
                ? 'Gerando…'
                : 'Pergunte alguma coisa'
            }
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              padding: '10px 4px',
              fontSize: '15px',
              color: disabled ? '#4D4D4D' : '#FCFCFC',
              fontFamily: "'Sora', sans-serif",
              resize: 'none',
              outline: 'none',
              minHeight: '40px',
              maxHeight: '160px',
              overflowY: 'auto',
              lineHeight: '1.5',
            }}
            onInput={(e) => {
              const el = e.currentTarget
              el.style.height = 'auto'
              el.style.height = Math.min(el.scrollHeight, 160) + 'px'
            }}
          />

          {/* Mic button */}
          {micSupported && (
            <button
              onClick={toggleMic}
              disabled={disabled}
              title={isRecording ? 'Parar gravação' : 'Entrada de voz'}
              style={{
                width: '36px',
                height: '36px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                background: isRecording ? 'rgba(255,77,77,0.15)' : 'transparent',
                border: isRecording ? '0.8px solid rgba(255,77,77,0.4)' : 'none',
                borderRadius: '10px',
                color: isRecording ? '#FF4D4D' : (disabled ? '#2D2D2D' : '#4D4D4D'),
                cursor: disabled ? 'not-allowed' : 'pointer',
                transition: 'all 0.15s ease',
                animation: isRecording ? 'mic-pulse 1.2s ease-in-out infinite' : 'none',
              }}
              onMouseEnter={(e) => {
                if (!disabled && !isRecording) {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.06)'
                  e.currentTarget.style.color = '#FCFCFC'
                }
              }}
              onMouseLeave={(e) => {
                if (!isRecording) {
                  e.currentTarget.style.background = 'transparent'
                  e.currentTarget.style.color = disabled ? '#2D2D2D' : '#4D4D4D'
                }
              }}
            >
              <MicIcon />
            </button>
          )}

          {/* Send / Stop button */}
          {isLoading ? (
            <button
              onClick={onStop}
              title="Parar geração"
              style={{
                width: '36px',
                height: '36px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                background: '#FCFCFC',
                border: 'none',
                borderRadius: '10px',
                cursor: 'pointer',
                color: '#0D0D0D',
                transition: 'background 0.15s ease',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = '#E0E0E0' }}
              onMouseLeave={(e) => { e.currentTarget.style.background = '#FCFCFC' }}
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
                <rect x="1" y="1" width="10" height="10" rx="2" />
              </svg>
            </button>
          ) : (
            <button
              onClick={submit}
              disabled={disabled}
              title="Enviar"
              style={{
                width: '36px',
                height: '36px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                background: disabled ? 'rgba(255,255,255,0.08)' : '#FCFCFC',
                border: 'none',
                borderRadius: '10px',
                cursor: disabled ? 'not-allowed' : 'pointer',
                color: disabled ? '#4D4D4D' : '#0D0D0D',
                transition: 'background 0.15s ease',
              }}
              onMouseEnter={(e) => {
                if (!disabled) e.currentTarget.style.background = '#E0E0E0'
              }}
              onMouseLeave={(e) => {
                if (!disabled) e.currentTarget.style.background = '#FCFCFC'
              }}
            >
              <SendIcon />
            </button>
          )}
        </div>
      </div>

      <style>{`
        @keyframes mic-pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(255,77,77,0); }
          50% { box-shadow: 0 0 0 4px rgba(255,77,77,0.15); }
        }
      `}</style>

      <p
        style={{
          textAlign: 'center',
          fontSize: '11px',
          color: '#2A2A2A',
          marginTop: '10px',
          fontFamily: 'monospace',
          letterSpacing: '0.03em',
        }}
      >
        Powered by Azion · Keys are never stored server-side
      </p>
    </div>
  )
}

function SendIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M8 1L8 15M8 1L3 6M8 1L13 6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function MicIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z" />
      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
      <line x1="12" x2="12" y1="19" y2="22" />
    </svg>
  )
}

function FileIcon() {
  return (
    <svg
      width="10"
      height="10"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
    </svg>
  )
}

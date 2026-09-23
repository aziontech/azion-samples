import { useEffect, useRef, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import type { UIMessage, TextPart, ThinkingPart, ToolCallPart, ToolResultPart } from '@tanstack/ai/client'

interface Props {
  messages: UIMessage[]
  isLoading: boolean
}

export function MessageList({ messages, isLoading }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const userScrolledUp = useRef(false)

  function onScroll() {
    const el = containerRef.current
    if (!el) return
    userScrolledUp.current = el.scrollHeight - el.scrollTop - el.clientHeight > 80
  }

  useEffect(() => {
    const lastMsg = messages[messages.length - 1]
    if (lastMsg?.role === 'user') userScrolledUp.current = false
    if (!userScrolledUp.current) {
      const el = containerRef.current
      if (el) el.scrollTop = el.scrollHeight
    }
  }, [messages, isLoading])

  return (
    <div
      ref={containerRef}
      onScroll={onScroll}
      style={{ flex: 1, overflowY: 'auto', background: '#111111' }}
    >
      <div
        style={{
          maxWidth: '760px',
          margin: '0 auto',
          padding: '32px 24px 16px',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {messages.map((msg) => (
          <div key={msg.id} style={{ marginBottom: '28px' }}>
            {msg.role === 'user' ? (
              /* User message — right-aligned bubble */
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <div
                  style={{
                    maxWidth: '72%',
                    background: 'rgba(254,96,31,0.12)',
                    border: '0.8px solid rgba(254,96,31,0.24)',
                    borderRadius: '18px 18px 4px 18px',
                    padding: '12px 16px',
                    color: '#FFB180',
                    fontSize: '15px',
                    lineHeight: '1.6',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                    fontFamily: "'Sora', sans-serif",
                  }}
                >
                  {msg.parts
                    .filter((p) => p.type === 'text')
                    .map((p, i) => (
                      <span key={i}>{(p as TextPart).content}</span>
                    ))}
                </div>
              </div>
            ) : (
              /* Assistant message — left-aligned, no bubble, with icon */
              <AssistantMessage msg={msg} />
            )}
          </div>
        ))}

        {/* Streaming indicator */}
        {isLoading && (
          <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', marginBottom: '28px' }}>
            <div
              style={{
                width: '26px',
                height: '26px',
                borderRadius: '6px',
                background: 'rgba(254,96,31,0.12)',
                border: '0.8px solid rgba(254,96,31,0.24)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <AzionStarIcon />
            </div>
            <div style={{ display: 'flex', gap: '4px', alignItems: 'center', paddingTop: '4px' }}>
              {[0, 150, 300].map((delay) => (
                <span
                  key={delay}
                  style={{
                    width: '5px',
                    height: '5px',
                    borderRadius: '50%',
                    background: '#FE601F',
                    display: 'inline-block',
                    animation: `azion-pulse 1.2s ease-in-out ${delay}ms infinite`,
                  }}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes azion-pulse {
          0%, 80%, 100% { opacity: 0.2; transform: scale(0.8); }
          40% { opacity: 1; transform: scale(1); }
        }
        .msg-assistant-content,
        .msg-assistant-content * {
          -webkit-user-select: text !important;
          user-select: text !important;
        }
        .msg-assistant-content button {
          -webkit-user-select: none !important;
          user-select: none !important;
          cursor: pointer;
        }
        .copy-btn {
          color: #4D4D4D;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.15s ease, color 0.15s ease;
        }
        .msg-assistant:hover .copy-btn {
          opacity: 1;
          pointer-events: auto;
        }
        .copy-btn--done {
          color: #FE601F !important;
          opacity: 1 !important;
          pointer-events: auto !important;
        }
        .copy-btn:hover {
          color: #FCFCFC !important;
        }
      `}</style>
    </div>
  )
}

function AssistantMessage({ msg }: { msg: UIMessage }) {
  const [copied, setCopied] = useState(false)

  const fullText = msg.parts
    .filter((p) => p.type === 'text')
    .map((p) => (p as TextPart).content)
    .join('\n\n')

  function handleCopy() {
    navigator.clipboard.writeText(fullText).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div className="msg-assistant" style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
      <div
        style={{
          width: '26px',
          height: '26px',
          borderRadius: '6px',
          background: 'rgba(254,96,31,0.12)',
          border: '0.8px solid rgba(254,96,31,0.24)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          marginTop: '1px',
        }}
      >
        <AzionStarIcon />
      </div>
      <div className="msg-assistant-content" style={{ flex: 1, minWidth: 0 }}>
        {msg.parts.map((part, i) => {
          if (part.type === 'text')
            return <TextRenderer key={i} part={part as TextPart} />
          if (part.type === 'thinking')
            return <ThinkingRenderer key={i} part={part as ThinkingPart} />
          if (part.type === 'tool-call')
            return <ToolCallRenderer key={i} part={part as ToolCallPart} />
          if (part.type === 'tool-result')
            return <ToolResultRenderer key={i} part={part as ToolResultPart} />
          return null
        })}
        {fullText && (
          <button
            onClick={handleCopy}
            title={copied ? 'Copiado!' : 'Copiar'}
            className={copied ? 'copy-btn copy-btn--done' : 'copy-btn'}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              marginTop: '6px',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: '4px 0',
              fontSize: '11px',
              fontFamily: 'monospace',
              letterSpacing: '0.04em',
            }}
          >
            {copied ? <CheckIcon /> : <CopyIcon />}
            {copied ? 'Copiado' : 'Copiar'}
          </button>
        )}
      </div>
    </div>
  )
}

function TextRenderer({ part }: { part: TextPart }) {
  return (
    <div className="prose-azion">
      <ReactMarkdown
        components={{
          p: ({ children }) => (
            <p style={{ margin: '0 0 12px', color: '#E5E5E5', fontSize: '15px', lineHeight: '1.7', fontFamily: "'Sora', sans-serif" }}>
              {children}
            </p>
          ),
          code: ({ children, className }) => {
            const isBlock = className?.startsWith('language-')
            const lang = className?.replace('language-', '') ?? ''
            if (isBlock) {
              return (
                <div style={{ margin: '12px 0' }}>
                  {lang && (
                    <div
                      style={{
                        padding: '4px 12px',
                        background: '#1A1A1A',
                        borderRadius: '4px 4px 0 0',
                        borderTop: '0.8px solid rgba(255,255,255,0.08)',
                        borderLeft: '0.8px solid rgba(255,255,255,0.08)',
                        borderRight: '0.8px solid rgba(255,255,255,0.08)',
                        fontFamily: 'monospace',
                        fontSize: '10px',
                        color: '#666666',
                        letterSpacing: '0.06em',
                        textTransform: 'uppercase',
                      }}
                    >
                      {lang}
                    </div>
                  )}
                  <pre
                    style={{
                      margin: 0,
                      padding: '14px 16px',
                      background: '#0D0D0D',
                      border: '0.8px solid rgba(255,255,255,0.08)',
                      borderRadius: lang ? '0 0 4px 4px' : '4px',
                      overflowX: 'auto',
                      fontFamily: 'monospace',
                      fontSize: '13px',
                      lineHeight: '1.6',
                      color: '#FCFCFC',
                    }}
                  >
                    <code>{children}</code>
                  </pre>
                </div>
              )
            }
            return (
              <code
                style={{
                  fontFamily: 'monospace',
                  fontSize: '0.88em',
                  background: 'rgba(254,96,31,0.08)',
                  border: '0.8px solid rgba(254,96,31,0.16)',
                  borderRadius: '3px',
                  padding: '1px 5px',
                  color: '#FF8E4D',
                }}
              >
                {children}
              </code>
            )
          },
          pre: ({ children }) => <>{children}</>,
          h1: ({ children }) => (
            <h1 style={{ fontSize: '20px', fontWeight: 600, color: '#FCFCFC', margin: '20px 0 8px', fontFamily: "'Sora', sans-serif" }}>
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 style={{ fontSize: '17px', fontWeight: 600, color: '#FCFCFC', margin: '16px 0 6px', fontFamily: "'Sora', sans-serif" }}>
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#FCFCFC', margin: '12px 0 4px', fontFamily: "'Sora', sans-serif" }}>
              {children}
            </h3>
          ),
          ul: ({ children }) => (
            <ul style={{ margin: '4px 0 12px', paddingLeft: '20px', color: '#E5E5E5', fontSize: '15px', lineHeight: '1.7', fontFamily: "'Sora', sans-serif" }}>
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol style={{ margin: '4px 0 12px', paddingLeft: '20px', color: '#E5E5E5', fontSize: '15px', lineHeight: '1.7', fontFamily: "'Sora', sans-serif" }}>
              {children}
            </ol>
          ),
          li: ({ children }) => <li style={{ marginBottom: '4px' }}>{children}</li>,
          blockquote: ({ children }) => (
            <blockquote
              style={{
                margin: '8px 0',
                paddingLeft: '12px',
                borderLeft: '2px solid rgba(254,96,31,0.4)',
                color: '#999999',
                fontStyle: 'italic',
              }}
            >
              {children}
            </blockquote>
          ),
          strong: ({ children }) => <strong style={{ fontWeight: 600, color: '#FCFCFC' }}>{children}</strong>,
          em: ({ children }) => <em style={{ color: '#B2B2B2' }}>{children}</em>,
          a: ({ href, children }) => (
            <a href={href} target="_blank" rel="noopener noreferrer" style={{ color: '#FE601F', textDecoration: 'none' }}>
              {children}
            </a>
          ),
          hr: () => <hr style={{ border: 'none', borderTop: '0.8px solid rgba(255,255,255,0.08)', margin: '12px 0' }} />,
        }}
      >
        {part.content}
      </ReactMarkdown>
    </div>
  )
}

function ThinkingRenderer({ part }: { part: ThinkingPart }) {
  const [open, setOpen] = useState(false)
  return (
    <div style={{ marginBottom: '8px' }}>
      <button
        onClick={() => setOpen((v) => !v)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          padding: '4px 0',
          color: '#4D4D4D',
          fontSize: '11px',
          fontFamily: 'monospace',
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
        }}
      >
        <span style={{ fontSize: '8px' }}>{open ? '▼' : '▶'}</span>
        Thinking
      </button>
      {open && (
        <div
          style={{
            marginTop: '6px',
            padding: '10px 14px',
            background: 'rgba(255,255,255,0.02)',
            border: '0.8px solid rgba(255,255,255,0.06)',
            borderRadius: '4px',
            fontSize: '13px',
            color: '#4D4D4D',
            fontFamily: 'monospace',
            lineHeight: '1.6',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
          }}
        >
          {part.content}
        </div>
      )}
    </div>
  )
}

function ToolCallRenderer({ part }: { part: ToolCallPart }) {
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: '4px 10px',
        background: 'rgba(138,132,236,0.08)',
        border: '0.8px solid rgba(138,132,236,0.2)',
        borderRadius: '4px',
        marginBottom: '6px',
        fontSize: '11px',
        fontFamily: 'monospace',
        color: '#8A84EC',
        letterSpacing: '0.04em',
      }}
    >
      <span style={{ opacity: 0.6 }}>⚙</span>
      {part.name}
    </div>
  )
}

function ToolResultRenderer({ part }: { part: ToolResultPart }) {
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: '4px 10px',
        background: part.state === 'error' ? 'rgba(255,77,77,0.08)' : 'rgba(38,217,104,0.08)',
        border: `0.8px solid ${part.state === 'error' ? 'rgba(255,77,77,0.2)' : 'rgba(38,217,104,0.2)'}`,
        borderRadius: '4px',
        marginBottom: '6px',
        fontSize: '11px',
        fontFamily: 'monospace',
        color: part.state === 'error' ? '#FF4D4D' : '#26D968',
        letterSpacing: '0.04em',
      }}
    >
      <span style={{ opacity: 0.6 }}>{part.state === 'error' ? '✗' : '✓'}</span>
      Result
    </div>
  )
}

function AzionStarIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 20 20" fill="none">
      <path
        d="M10 2L12.4 7.6L18 8.2L14 12.4L15.2 18L10 15.2L4.8 18L6 12.4L2 8.2L7.6 7.6L10 2Z"
        stroke="#FE601F"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function CopyIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="9" width="13" height="13" rx="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

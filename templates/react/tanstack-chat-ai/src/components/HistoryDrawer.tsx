import type { SavedConversation } from '../hooks/useConversationHistory'

interface Props {
  open: boolean
  onClose: () => void
  conversations: SavedConversation[]
  currentId: string
  onLoad: (conv: SavedConversation) => void
  onDelete: (id: string) => void
  onNew: () => void
}

function relativeTime(ts: number): string {
  const diff = Date.now() - ts
  const m = Math.floor(diff / 60000)
  const h = Math.floor(diff / 3600000)
  const d = Math.floor(diff / 86400000)
  if (m < 1) return 'agora'
  if (m < 60) return `${m}min atrás`
  if (h < 24) return `${h}h atrás`
  return `${d}d atrás`
}

export function HistoryDrawer({ open, onClose, conversations, currentId, onLoad, onDelete, onNew }: Props) {
  if (!open) return null

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex' }}>
      <div
        style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.7)' }}
        onClick={onClose}
      />

      <div
        style={{
          position: 'relative',
          height: '100%',
          width: '100%',
          maxWidth: '320px',
          background: '#0A0A0A',
          borderRight: '0.8px solid rgba(255,255,255,0.08)',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '24px 0 48px rgba(0,0,0,0.6)',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 20px',
            height: '56px',
            borderBottom: '0.8px solid rgba(255,255,255,0.08)',
            flexShrink: 0,
          }}
        >
          <span
            style={{
              fontFamily: 'monospace',
              fontSize: '11px',
              color: '#B2B2B2',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}
          >
            Histórico
          </span>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <button
              onClick={onNew}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                background: 'transparent',
                border: '0.8px solid rgba(254,96,31,0.3)',
                borderRadius: '4px',
                color: '#FF8E4D',
                fontSize: '10px',
                fontFamily: 'monospace',
                letterSpacing: '0.06em',
                cursor: 'pointer',
                padding: '4px 10px',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(254,96,31,0.6)' }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(254,96,31,0.3)' }}
            >
              + NOVA
            </button>
            <button
              onClick={onClose}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#4D4D4D',
                cursor: 'pointer',
                fontSize: '16px',
                lineHeight: 1,
                padding: '4px',
                transition: 'color 0.15s ease',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = '#FCFCFC' }}
              onMouseLeave={(e) => { e.currentTarget.style.color = '#4D4D4D' }}
            >
              ✕
            </button>
          </div>
        </div>

        {/* List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '8px 0' }}>
          {conversations.length === 0 && (
            <p
              style={{
                textAlign: 'center',
                padding: '40px 20px',
                fontFamily: 'monospace',
                fontSize: '11px',
                color: '#333333',
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
              }}
            >
              Nenhuma conversa salva
            </p>
          )}
          {conversations
            .slice()
            .sort((a, b) => b.timestamp - a.timestamp)
            .map((conv) => {
              const isActive = conv.id === currentId
              const msgCount = conv.messages.filter(
                (m) => m.role === 'user' || m.role === 'assistant',
              ).length
              return (
                <div
                  key={conv.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '0 12px 0 18px',
                    borderLeft: isActive ? '2px solid #FE601F' : '2px solid transparent',
                    background: isActive ? 'rgba(254,96,31,0.06)' : 'transparent',
                    transition: 'background 0.15s ease',
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) e.currentTarget.style.background = 'rgba(255,255,255,0.03)'
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) e.currentTarget.style.background = 'transparent'
                  }}
                >
                  <button
                    onClick={() => onLoad(conv)}
                    style={{
                      flex: 1,
                      background: 'transparent',
                      border: 'none',
                      padding: '12px 0',
                      textAlign: 'left',
                      cursor: 'pointer',
                      overflow: 'hidden',
                      minWidth: 0,
                    }}
                  >
                    <div
                      style={{
                        fontSize: '13px',
                        fontFamily: "'Sora', sans-serif",
                        color: isActive ? '#FCFCFC' : '#B2B2B2',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        marginBottom: '4px',
                      }}
                    >
                      {conv.title}
                    </div>
                    <div
                      style={{
                        fontSize: '10px',
                        fontFamily: 'monospace',
                        color: '#4D4D4D',
                        letterSpacing: '0.04em',
                      }}
                    >
                      {relativeTime(conv.timestamp)} · {msgCount} msgs
                    </div>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onDelete(conv.id)
                    }}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: '#2D2D2D',
                      cursor: 'pointer',
                      padding: '6px',
                      flexShrink: 0,
                      transition: 'color 0.15s ease',
                      lineHeight: 1,
                      fontSize: '12px',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = '#FF4D4D' }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = '#2D2D2D' }}
                    title="Excluir conversa"
                  >
                    ✕
                  </button>
                </div>
              )
            })}
        </div>
      </div>
    </div>
  )
}

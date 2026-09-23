import { useState } from 'react'
import type { SavedConversation } from '../hooks/useConversationHistory'

interface SidebarProps {
  isOpen: boolean
  onToggle: () => void
  conversations: SavedConversation[]
  currentId: string
  onNewChat: () => void
  onLoad: (conv: SavedConversation) => void
  onDelete: (id: string) => void
  onOpenSettings: () => void
}

type Group = { label: string; items: SavedConversation[] }

function groupByTime(conversations: SavedConversation[]): Group[] {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const todayTs = today.getTime()
  const yesterdayTs = todayTs - 86400000
  const sevenDaysAgoTs = todayTs - 7 * 86400000
  const thirtyDaysAgoTs = todayTs - 30 * 86400000

  const sorted = [...conversations].sort((a, b) => b.timestamp - a.timestamp)

  const todayItems = sorted.filter((c) => c.timestamp >= todayTs)
  const yesterdayItems = sorted.filter((c) => c.timestamp >= yesterdayTs && c.timestamp < todayTs)
  const prev7Items = sorted.filter((c) => c.timestamp >= sevenDaysAgoTs && c.timestamp < yesterdayTs)
  const prev30Items = sorted.filter((c) => c.timestamp >= thirtyDaysAgoTs && c.timestamp < sevenDaysAgoTs)
  const olderItems = sorted.filter((c) => c.timestamp < thirtyDaysAgoTs)

  const groups: Group[] = []
  if (todayItems.length) groups.push({ label: 'Hoje', items: todayItems })
  if (yesterdayItems.length) groups.push({ label: 'Ontem', items: yesterdayItems })
  if (prev7Items.length) groups.push({ label: 'Últimos 7 dias', items: prev7Items })
  if (prev30Items.length) groups.push({ label: 'Últimos 30 dias', items: prev30Items })

  const monthMap = new Map<string, SavedConversation[]>()
  for (const conv of olderItems) {
    const key = new Date(conv.timestamp).toLocaleString('pt-BR', { month: 'long', year: 'numeric' })
    if (!monthMap.has(key)) monthMap.set(key, [])
    monthMap.get(key)!.push(conv)
  }
  monthMap.forEach((items, label) => groups.push({ label, items }))

  return groups
}

export function Sidebar({
  isOpen,
  onToggle,
  conversations,
  currentId,
  onNewChat,
  onLoad,
  onDelete,
  onOpenSettings,
}: SidebarProps) {
  const groups = groupByTime(conversations)

  return (
    <div
      style={{
        width: isOpen ? '260px' : '0px',
        height: '100%',
        background: '#0A0A0A',
        borderRight: isOpen ? '0.8px solid rgba(255,255,255,0.08)' : 'none',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        transition: 'width 0.2s ease',
        flexShrink: 0,
      }}
    >
      {/* Top row: toggle + new chat */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 12px 8px',
          flexShrink: 0,
        }}
      >
        <SidebarIconBtn onClick={onToggle} title="Fechar barra lateral">
          <HamburgerIcon />
        </SidebarIconBtn>
        <SidebarIconBtn onClick={onNewChat} title="Nova conversa">
          <ComposeIcon />
        </SidebarIconBtn>
      </div>

      {/* History list */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '4px 0' }}>
        {groups.length === 0 ? (
          <p
            style={{
              textAlign: 'center',
              padding: '32px 16px',
              fontSize: '12px',
              color: '#333333',
              fontFamily: 'monospace',
              letterSpacing: '0.04em',
              margin: 0,
            }}
          >
            Nenhuma conversa
          </p>
        ) : (
          groups.map((group) => (
            <div key={group.label}>
              <div
                style={{
                  padding: '8px 12px 4px',
                  fontSize: '11px',
                  fontWeight: 600,
                  color: '#4D4D4D',
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                  userSelect: 'none',
                  whiteSpace: 'nowrap',
                }}
              >
                {group.label}
              </div>
              {group.items.map((conv) => (
                <ConvItem
                  key={conv.id}
                  conv={conv}
                  isActive={conv.id === currentId}
                  onLoad={onLoad}
                  onDelete={onDelete}
                />
              ))}
            </div>
          ))
        )}
      </div>

      {/* Bottom: logo + settings */}
      <div
        style={{
          borderTop: '0.8px solid rgba(255,255,255,0.06)',
          padding: '10px 12px',
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <AzionLogoSmall />
        <SidebarIconBtn onClick={onOpenSettings} title="Configurações">
          <GearIcon />
        </SidebarIconBtn>
      </div>
    </div>
  )
}

function ConvItem({
  conv,
  isActive,
  onLoad,
  onDelete,
}: {
  conv: SavedConversation
  isActive: boolean
  onLoad: (c: SavedConversation) => void
  onDelete: (id: string) => void
}) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: '0 8px 0 12px',
        background: isActive ? 'rgba(254,96,31,0.08)' : hovered ? 'rgba(255,255,255,0.04)' : 'transparent',
        borderLeft: `2px solid ${isActive ? '#FE601F' : 'transparent'}`,
        transition: 'background 0.12s ease',
      }}
    >
      <button
        onClick={() => onLoad(conv)}
        style={{
          flex: 1,
          background: 'transparent',
          border: 'none',
          padding: '8px 4px 8px 0',
          textAlign: 'left',
          cursor: 'pointer',
          overflow: 'hidden',
          minWidth: 0,
        }}
      >
        <div
          style={{
            fontSize: '14px',
            color: isActive ? '#FCFCFC' : '#B2B2B2',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            lineHeight: '1.4',
            fontFamily: "'Sora', sans-serif",
          }}
        >
          {conv.title}
        </div>
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation()
          onDelete(conv.id)
        }}
        title="Excluir"
        style={{
          opacity: hovered ? 1 : 0,
          pointerEvents: hovered ? 'auto' : 'none',
          background: 'transparent',
          border: 'none',
          color: '#4D4D4D',
          cursor: 'pointer',
          padding: '4px',
          flexShrink: 0,
          transition: 'all 0.12s ease',
          borderRadius: '4px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        onMouseEnter={(e) => { e.currentTarget.style.color = '#FF4D4D' }}
        onMouseLeave={(e) => { e.currentTarget.style.color = '#4D4D4D' }}
      >
        <TrashIcon />
      </button>
    </div>
  )
}

function SidebarIconBtn({
  children,
  onClick,
  title,
}: {
  children: React.ReactNode
  onClick: () => void
  title?: string
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      style={{
        width: '36px',
        height: '36px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'transparent',
        border: 'none',
        borderRadius: '8px',
        color: '#666666',
        cursor: 'pointer',
        transition: 'all 0.12s ease',
        flexShrink: 0,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = 'rgba(255,255,255,0.08)'
        e.currentTarget.style.color = '#FCFCFC'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'transparent'
        e.currentTarget.style.color = '#666666'
      }}
    >
      {children}
    </button>
  )
}

function HamburgerIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  )
}

function ComposeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
    </svg>
  )
}

function GearIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  )
}

function TrashIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
    </svg>
  )
}

function AzionLogoSmall() {
  return (
    <svg width="72" height="14" viewBox="0 0 90 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fillRule="evenodd" clipRule="evenodd" d="M86.637 0L85.1445 7.79033L87.861 11.1671L90 0H86.637ZM72.5099 0L69.1465 17.561H72.5111L74.8163 5.52224L84.5333 17.561H86.637L87.0518 15.4112L74.6131 0H72.5099Z" fill="#F3652B" />
      <path fillRule="evenodd" clipRule="evenodd" d="M51.6563 0L48.293 17.561H65.7833L69.1466 0H51.6563ZM54.3884 3.31794H65.1392L63.0467 14.243H52.296L54.3884 3.31794Z" fill="#F3652B" />
      <path fillRule="evenodd" clipRule="evenodd" d="M45.0001 0L41.707 17.561H44.9994L48.2924 0H45.0001Z" fill="#F3652B" />
      <path fillRule="evenodd" clipRule="evenodd" d="M24.217 0L23.5814 3.31801H35.1962L21.3511 14.9756L20.8535 17.561H38.3437L38.9793 14.243H27.3646L41.2126 2.58289L41.7072 0H24.217Z" fill="#F3652B" />
      <path fillRule="evenodd" clipRule="evenodd" d="M18.2868 0L0.490892 14.9821L0 17.561H2.5639L16.349 5.96141L14.1271 17.561H17.4898L20.8537 0H18.2868Z" fill="#F3652B" />
    </svg>
  )
}

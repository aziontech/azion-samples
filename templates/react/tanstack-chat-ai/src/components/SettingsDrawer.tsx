import { useState } from 'react'
import type { Provider, AzionAuthType, Settings } from '../hooks/useSettings'
import { MODELS } from '../hooks/useSettings'

interface Props {
  open: boolean
  onClose: () => void
  settings: Settings & {
    setProvider: (p: Provider) => void
    setModel: (m: string) => void
    setApiKey: (k: string) => void
    setAzionAuthType: (t: AzionAuthType) => void
  }
}

export function SettingsDrawer({ open, onClose, settings }: Props) {
  const [showKey, setShowKey] = useState(false)

  if (!open) return null

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex' }}>
      {/* Backdrop */}
      <div
        style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.7)' }}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        style={{
          position: 'relative',
          marginLeft: 'auto',
          height: '100%',
          width: '100%',
          maxWidth: '360px',
          background: '#0A0A0A',
          borderLeft: '0.8px solid rgba(255,255,255,0.08)',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '-24px 0 48px rgba(0,0,0,0.6)',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 24px',
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
            Settings
          </span>
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

        {/* Body */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '28px',
          }}
        >
          {/* Provider */}
          <div>
            <p
              style={{
                fontFamily: 'monospace',
                fontSize: '10px',
                color: '#4D4D4D',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                marginBottom: '10px',
              }}
            >
              Provider
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
              {(['openai', 'anthropic', 'copilot-azion'] as Provider[]).map((p) => {
                const active = settings.provider === p
                const label = p === 'openai' ? 'OpenAI' : p === 'anthropic' ? 'Anthropic' : 'Azion'
                return (
                  <button
                    key={p}
                    onClick={() => settings.setProvider(p)}
                    style={{
                      padding: '8px 12px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      fontFamily: 'monospace',
                      letterSpacing: '0.04em',
                      border: active
                        ? '0.8px solid rgba(254,96,31,0.6)'
                        : '0.8px solid rgba(255,255,255,0.08)',
                      background: active
                        ? 'rgba(254,96,31,0.12)'
                        : 'rgba(255,255,255,0.03)',
                      color: active ? '#FF8E4D' : '#666666',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                    onMouseEnter={(e) => {
                      if (!active) {
                        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.16)'
                        e.currentTarget.style.color = '#B2B2B2'
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!active) {
                        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'
                        e.currentTarget.style.color = '#666666'
                      }
                    }}
                  >
                    {label}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Auth Type — only for Azion Copilot */}
          {settings.provider === 'copilot-azion' && (
            <div>
              <p
                style={{
                  fontFamily: 'monospace',
                  fontSize: '10px',
                  color: '#4D4D4D',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  marginBottom: '10px',
                }}
              >
                Auth Type
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                {(['cookie', 'token'] as AzionAuthType[]).map((t) => {
                  const active = settings.azionAuthType === t
                  return (
                    <button
                      key={t}
                      onClick={() => settings.setAzionAuthType(t)}
                      style={{
                        padding: '8px 12px',
                        borderRadius: '4px',
                        fontSize: '12px',
                        fontFamily: 'monospace',
                        letterSpacing: '0.04em',
                        border: active
                          ? '0.8px solid rgba(254,96,31,0.6)'
                          : '0.8px solid rgba(255,255,255,0.08)',
                        background: active
                          ? 'rgba(254,96,31,0.12)'
                          : 'rgba(255,255,255,0.03)',
                        color: active ? '#FF8E4D' : '#666666',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                      }}
                      onMouseEnter={(e) => {
                        if (!active) {
                          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.16)'
                          e.currentTarget.style.color = '#B2B2B2'
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!active) {
                          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'
                          e.currentTarget.style.color = '#666666'
                        }
                      }}
                    >
                      {t === 'cookie' ? 'Cookie (azsid)' : 'API Token'}
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* Model — hidden for Azion Copilot (single model, no selection needed) */}
          {settings.provider !== 'copilot-azion' && (
            <div>
              <p
                style={{
                  fontFamily: 'monospace',
                  fontSize: '10px',
                  color: '#4D4D4D',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  marginBottom: '10px',
                }}
              >
                Model
              </p>
              <select
                value={settings.model}
                onChange={(e) => settings.setModel(e.target.value)}
                style={{
                  width: '100%',
                  background: '#1A1A1A',
                  border: '0.8px solid rgba(255,255,255,0.1)',
                  borderRadius: '4px',
                  padding: '10px 12px',
                  fontSize: '13px',
                  fontFamily: "'Sora', sans-serif",
                  color: '#FCFCFC',
                  outline: 'none',
                  cursor: 'pointer',
                  appearance: 'none',
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%23666666' stroke-width='1.2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 12px center',
                  paddingRight: '32px',
                }}
                onFocus={(e) => { e.currentTarget.style.borderColor = 'rgba(254,96,31,0.4)' }}
                onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)' }}
              >
                {(MODELS[settings.provider] ?? []).map((m) => (
                  <option key={m} value={m} style={{ background: '#1A1A1A' }}>
                    {m}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* API Key */}
          <div>
            <p
              style={{
                fontFamily: 'monospace',
                fontSize: '10px',
                color: '#4D4D4D',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                marginBottom: '10px',
              }}
            >
              {settings.provider === 'copilot-azion'
                ? settings.azionAuthType === 'cookie' ? 'Cookie (azsid)' : 'API Token'
                : 'API Key'}
            </p>
            <div style={{ position: 'relative' }}>
              <input
                type={showKey ? 'text' : 'password'}
                value={settings.apiKey}
                onChange={(e) => settings.setApiKey(e.target.value)}
                placeholder={
                  settings.provider === 'openai' ? 'sk-…'
                  : settings.provider === 'anthropic' ? 'sk-ant-…'
                  : settings.azionAuthType === 'cookie' ? 'azsid cookie value'
                  : 'API token'
                }
                style={{
                  width: '100%',
                  background: '#1A1A1A',
                  border: '0.8px solid rgba(255,255,255,0.1)',
                  borderRadius: '4px',
                  padding: '10px 80px 10px 12px',
                  fontSize: '13px',
                  fontFamily: 'monospace',
                  color: '#FCFCFC',
                  outline: 'none',
                  boxSizing: 'border-box',
                  transition: 'border-color 0.15s ease',
                }}
                onFocus={(e) => { e.currentTarget.style.borderColor = 'rgba(254,96,31,0.4)' }}
                onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)' }}
              />
              <div
                style={{
                  position: 'absolute',
                  right: '8px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  display: 'flex',
                  gap: '4px',
                }}
              >
                <button
                  onClick={() => setShowKey((s) => !s)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#4D4D4D',
                    fontSize: '10px',
                    fontFamily: 'monospace',
                    letterSpacing: '0.04em',
                    cursor: 'pointer',
                    padding: '2px 4px',
                    transition: 'color 0.15s ease',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = '#B2B2B2' }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = '#4D4D4D' }}
                >
                  {showKey ? 'HIDE' : 'SHOW'}
                </button>
                {settings.apiKey && (
                  <button
                    onClick={() => settings.setApiKey('')}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: '#4D4D4D',
                      fontSize: '10px',
                      fontFamily: 'monospace',
                      letterSpacing: '0.04em',
                      cursor: 'pointer',
                      padding: '2px 4px',
                      transition: 'color 0.15s ease',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = '#FF4D4D' }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = '#4D4D4D' }}
                  >
                    CLR
                  </button>
                )}
              </div>
            </div>
            <p
              style={{
                marginTop: '8px',
                fontSize: '11px',
                fontFamily: 'monospace',
                color: '#333333',
                lineHeight: '1.5',
                letterSpacing: '0.02em',
              }}
            >
              Stored in browser localStorage. Never sent to any server other than the selected
              provider's API.
            </p>
          </div>
        </div>

        {/* Footer status */}
        <div
          style={{
            padding: '16px 24px',
            borderTop: '0.8px solid rgba(255,255,255,0.08)',
            flexShrink: 0,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 14px',
              borderRadius: '4px',
              border: settings.apiKey
                ? '0.8px solid rgba(254,96,31,0.24)'
                : '0.8px solid rgba(255,255,255,0.06)',
              background: settings.apiKey
                ? 'rgba(254,96,31,0.06)'
                : 'rgba(255,255,255,0.02)',
            }}
          >
            <span
              style={{
                width: '5px',
                height: '5px',
                borderRadius: '50%',
                background: settings.apiKey ? '#FE601F' : '#333333',
                flexShrink: 0,
              }}
            />
            <span
              style={{
                fontFamily: 'monospace',
                fontSize: '11px',
                color: settings.apiKey ? '#FF8E4D' : '#4D4D4D',
                letterSpacing: '0.04em',
              }}
            >
              {settings.apiKey
                ? `READY · ${settings.provider === 'openai' ? 'OPENAI' : settings.provider === 'anthropic' ? 'ANTHROPIC' : 'AZION'}${settings.provider !== 'copilot-azion' ? ` / ${settings.model}` : ''}`
                : settings.provider === 'copilot-azion' ? 'ENTER THE AZSID COOKIE TO START' : 'ENTER AN API KEY TO START'}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

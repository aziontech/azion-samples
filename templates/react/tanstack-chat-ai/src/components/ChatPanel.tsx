import { useEffect, useMemo, useRef, useState } from "react";
import { useChat, fetchServerSentEvents } from "@tanstack/ai-react";
import { MessageList } from "./MessageList";
import { ChatInput } from "./ChatInput";
import { SettingsDrawer } from "./SettingsDrawer";
import { Sidebar } from "./Sidebar";
import {
  useConversationHistory,
  type SavedConversation,
} from "../hooks/useConversationHistory";
import type { Settings, Provider, AzionAuthType } from "../hooks/useSettings";

interface Props {
  settings: Settings & {
    setProvider: (p: Provider) => void;
    setModel: (m: string) => void;
    setApiKey: (k: string) => void;
    setAzionAuthType: (t: AzionAuthType) => void;
  };
  apiUrl?: string;
}

function newId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
}

const SUGGESTIONS = [
  "Explique um conceito",
  "Escreva um código",
  "Resuma um texto",
  "Ajude-me a criar",
];

export function ChatPanel({ settings, apiUrl = "/api/chat" }: Props) {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentConvId, setCurrentConvId] = useState("");

  useEffect(() => {
    setCurrentConvId(newId());
  }, []);
  const settingsRef = useRef(settings);
  settingsRef.current = settings;

  const history = useConversationHistory();

  const connection = useRef(
    fetchServerSentEvents(apiUrl, async () => ({
      headers: {
        "X-Api-Key": settingsRef.current.apiKey,
        "X-Provider": settingsRef.current.provider,
        "X-Model": settingsRef.current.model,
        "X-Azion-Auth-Type": settingsRef.current.azionAuthType,
      },
    })),
  ).current;

  const {
    messages,
    sendMessage,
    setMessages,
    isLoading,
    stop,
    reload,
    clear,
    error,
  } = useChat({ connection });

  const noKey = !settings.apiKey.trim();

  const displayMessages = useMemo(
    () => messages.filter((m) => m.role === "user" || m.role === "assistant"),
    [messages],
  );
  const hasMessages = displayMessages.length > 0;
  const lastIsAssistant =
    displayMessages[displayMessages.length - 1]?.role === "assistant";

  useEffect(() => {
    if (displayMessages.length > 0) {
      history.save(currentConvId, displayMessages);
    }
  }, [displayMessages, currentConvId]);

  function handleLoadConversation(conv: SavedConversation) {
    setMessages(conv.messages);
    setCurrentConvId(conv.id);
  }

  function handleNewConversation() {
    clear();
    setCurrentConvId(newId());
  }

  function handleSend(text: string) {
    sendMessage({ content: text });
  }

  return (
    <>
      <style>{`
        @keyframes fadeInChat {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInEmpty {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
      `}</style>

      <div
        style={{
          display: "flex",
          height: "100%",
          overflow: "hidden",
          background: "#111111",
        }}
      >
        <Sidebar
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen((v) => !v)}
          conversations={history.conversations}
          currentId={currentConvId}
          onNewChat={handleNewConversation}
          onLoad={handleLoadConversation}
          onDelete={history.remove}
          onOpenSettings={() => setSettingsOpen(true)}
        />

        {/* Main area */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            minWidth: 0,
          }}
        >
          {!hasMessages ? (
            /* ── EMPTY STATE ── */
            <div
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "24px 20px 40px",
                position: "relative",
                animation: "fadeInEmpty 0.25s ease",
              }}
            >
              {/* Hamburger toggle when sidebar is closed */}
              {!sidebarOpen && (
                <button
                  onClick={() => setSidebarOpen(true)}
                  title="Abrir barra lateral"
                  style={{
                    position: "absolute",
                    top: "16px",
                    left: "16px",
                    width: "36px",
                    height: "36px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "transparent",
                    border: "none",
                    borderRadius: "8px",
                    color: "#666666",
                    cursor: "pointer",
                    transition: "all 0.12s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.08)";
                    e.currentTarget.style.color = "#FCFCFC";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.color = "#666666";
                  }}
                >
                  <HamburgerIcon />
                </button>
              )}

              <h1
                style={{
                  fontSize: "30px",
                  fontWeight: 600,
                  color: "#FCFCFC",
                  margin: "0 0 32px",
                  textAlign: "center",
                  letterSpacing: "-0.02em",
                  fontFamily: "'Sora', sans-serif",
                }}
              >
                No que você está pensando hoje?
              </h1>

              {/* Centered input */}
              <div style={{ width: "100%", maxWidth: "720px" }}>
                <ChatInput
                  onSend={handleSend}
                  onStop={stop}
                  isLoading={isLoading}
                  disabled={noKey}
                  disabledReason={
                    noKey
                      ? "Configure sua chave de API em Settings para começar"
                      : undefined
                  }
                />
              </div>

              {/* Suggestion chips */}
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "8px",
                  justifyContent: "center",
                  marginTop: "12px",
                }}
              >
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => !noKey && handleSend(s)}
                    disabled={noKey}
                    style={{
                      padding: "8px 16px",
                      background: "rgba(255,255,255,0.05)",
                      border: "0.8px solid rgba(255,255,255,0.1)",
                      borderRadius: "999px",
                      color: noKey ? "#333333" : "#B2B2B2",
                      fontSize: "14px",
                      fontFamily: "'Sora', sans-serif",
                      cursor: noKey ? "not-allowed" : "pointer",
                      transition: "all 0.15s ease",
                    }}
                    onMouseEnter={(e) => {
                      if (!noKey) {
                        e.currentTarget.style.background =
                          "rgba(254,96,31,0.1)";
                        e.currentTarget.style.borderColor =
                          "rgba(254,96,31,0.3)";
                        e.currentTarget.style.color = "#FF8E4D";
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background =
                        "rgba(255,255,255,0.05)";
                      e.currentTarget.style.borderColor =
                        "rgba(255,255,255,0.1)";
                      e.currentTarget.style.color = noKey
                        ? "#333333"
                        : "#B2B2B2";
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>

              {/* Settings shortcut */}
              {noKey && (
                <button
                  onClick={() => setSettingsOpen(true)}
                  style={{
                    marginTop: "20px",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    background: "transparent",
                    border: "0.8px solid rgba(254,96,31,0.3)",
                    borderRadius: "6px",
                    color: "#FF8E4D",
                    fontSize: "12px",
                    fontFamily: "monospace",
                    letterSpacing: "0.05em",
                    cursor: "pointer",
                    padding: "6px 14px",
                    transition: "all 0.15s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "rgba(254,96,31,0.6)";
                    e.currentTarget.style.background = "rgba(254,96,31,0.08)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "rgba(254,96,31,0.3)";
                    e.currentTarget.style.background = "transparent";
                  }}
                >
                  <GearIcon /> ABRIR SETTINGS
                </button>
              )}
            </div>
          ) : (
            /* ── ACTIVE STATE ── */
            <div
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
                animation: "fadeInChat 0.25s ease",
              }}
            >
              {/* Thin header */}
              <header
                style={{
                  height: "52px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "0 16px",
                  borderBottom: "0.8px solid rgba(255,255,255,0.06)",
                  flexShrink: 0,
                  background: "#111111",
                }}
              >
                <div
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  {!sidebarOpen && (
                    <button
                      onClick={() => setSidebarOpen(true)}
                      title="Abrir barra lateral"
                      style={{
                        width: "32px",
                        height: "32px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: "transparent",
                        border: "none",
                        borderRadius: "6px",
                        color: "#666666",
                        cursor: "pointer",
                        transition: "all 0.12s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background =
                          "rgba(255,255,255,0.08)";
                        e.currentTarget.style.color = "#FCFCFC";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "transparent";
                        e.currentTarget.style.color = "#666666";
                      }}
                    >
                      <HamburgerIcon />
                    </button>
                  )}
                  <span
                    style={{
                      fontSize: "14px",
                      fontWeight: 500,
                      color: "#666666",
                      fontFamily: "'Sora', sans-serif",
                    }}
                  >
                    {settings.provider === "openai" ? "OpenAI" : settings.provider === "anthropic" ? "Anthropic" : "Azion Copilot"}
                    {settings.provider !== "copilot-azion" && ` · ${settings.model}`}
                  </span>
                </div>

                <div
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <button
                    onClick={handleNewConversation}
                    title="Nova conversa"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                      background: "transparent",
                      border: "0.8px solid rgba(255,255,255,0.08)",
                      borderRadius: "6px",
                      color: "#666666",
                      fontSize: "12px",
                      fontFamily: "monospace",
                      letterSpacing: "0.04em",
                      cursor: "pointer",
                      padding: "5px 10px",
                      transition: "all 0.15s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = "rgba(254,96,31,0.3)";
                      e.currentTarget.style.color = "#FF8E4D";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor =
                        "rgba(255,255,255,0.08)";
                      e.currentTarget.style.color = "#666666";
                    }}
                  >
                    <ComposeSmallIcon /> NOVA
                  </button>
                  <button
                    onClick={() => setSettingsOpen(true)}
                    title="Configurações"
                    style={{
                      width: "32px",
                      height: "32px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: "transparent",
                      border: "none",
                      borderRadius: "6px",
                      color: "#666666",
                      cursor: "pointer",
                      transition: "all 0.12s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background =
                        "rgba(255,255,255,0.08)";
                      e.currentTarget.style.color = "#FCFCFC";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "transparent";
                      e.currentTarget.style.color = "#666666";
                    }}
                  >
                    <GearIcon />
                  </button>
                </div>
              </header>

              {/* Error banner */}
              {error && (
                <div
                  style={{
                    padding: "8px 24px",
                    background: "rgba(255,77,77,0.06)",
                    borderBottom: "0.8px solid rgba(255,77,77,0.2)",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    flexShrink: 0,
                  }}
                >
                  <span style={{ color: "#FF4D4D", fontSize: "11px" }}>✕</span>
                  <span
                    style={{
                      fontFamily: "monospace",
                      fontSize: "11px",
                      color: "#FF8080",
                      letterSpacing: "0.03em",
                      flex: 1,
                    }}
                  >
                    {error.message}
                  </span>
                  {lastIsAssistant && !isLoading && (
                    <button
                      onClick={() => reload()}
                      style={{
                        background: "transparent",
                        border: "0.8px solid rgba(255,77,77,0.3)",
                        borderRadius: "4px",
                        color: "#FF4D4D",
                        fontSize: "10px",
                        fontFamily: "monospace",
                        letterSpacing: "0.06em",
                        cursor: "pointer",
                        padding: "3px 8px",
                      }}
                    >
                      RETRY
                    </button>
                  )}
                </div>
              )}

              <MessageList messages={displayMessages} isLoading={isLoading} />

              {/* Regenerate toolbar */}
              {!isLoading && !error && lastIsAssistant && (
                <div
                  style={{
                    padding: "6px 0",
                    display: "flex",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <button
                    onClick={() => reload()}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                      background: "transparent",
                      border: "0.8px solid rgba(255,255,255,0.08)",
                      borderRadius: "6px",
                      color: "#666666",
                      fontSize: "11px",
                      fontFamily: "monospace",
                      letterSpacing: "0.05em",
                      cursor: "pointer",
                      padding: "5px 12px",
                      transition: "all 0.15s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = "rgba(254,96,31,0.3)";
                      e.currentTarget.style.color = "#FF8E4D";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor =
                        "rgba(255,255,255,0.08)";
                      e.currentTarget.style.color = "#666666";
                    }}
                  >
                    <ReloadIcon /> REGENERAR
                  </button>
                </div>
              )}

              <ChatInput
                onSend={handleSend}
                onStop={stop}
                isLoading={isLoading}
                disabled={noKey}
                disabledReason={
                  noKey
                    ? "Configure sua chave de API em Settings para começar"
                    : undefined
                }
              />
            </div>
          )}
        </div>
      </div>

      <SettingsDrawer
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        settings={settings}
      />
    </>
  );
}

function HamburgerIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}

function GearIcon() {
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
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  );
}

function ReloadIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
      <path
        fillRule="evenodd"
        d="M8 3a5 5 0 104.546 2.914.5.5 0 00-.908-.417A4 4 0 118 4V3z"
        clipRule="evenodd"
      />
      <path d="M8 4.466V.534a.25.25 0 00-.41-.192L5.23 2.308a.25.25 0 000 .384l2.36 1.966A.25.25 0 008 4.466z" />
    </svg>
  );
}

function ComposeSmallIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
    </svg>
  );
}

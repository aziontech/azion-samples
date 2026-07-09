import { i as __toESM } from "../_runtime.mjs";
import { n as require_react, t as useChat } from "../_libs/react+tanstack__ai-react.mjs";
import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { r as fetchServerSentEvents } from "../_libs/@tanstack/ai-client+[...].mjs";
import { t as Markdown } from "../_libs/react-markdown+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/chat.index-CwvwRyxW.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var MODELS = {
	openai: [
		"gpt-5.5",
		"gpt-4.1",
		"gpt-4.1-mini",
		"gpt-4.1-nano",
		"gpt-4o",
		"gpt-4o-mini",
		"o3",
		"o4-mini",
		"o3-mini"
	],
	anthropic: [
		"claude-opus-4-7",
		"claude-sonnet-4-6",
		"claude-haiku-4-5-20251001",
		"claude-opus-4-5",
		"claude-sonnet-4-5"
	],
	"copilot-azion": ["azion-copilot"]
};
var DEFAULT_MODELS = {
	openai: "gpt-5.5",
	anthropic: "claude-sonnet-4-6",
	"copilot-azion": "azion-copilot"
};
function load$1(key, fallback) {
	try {
		const v = localStorage.getItem(key);
		return v !== null ? JSON.parse(v) : fallback;
	} catch {
		return fallback;
	}
}
function save(key, value) {
	localStorage.setItem(key, JSON.stringify(value));
}
function useSettings() {
	const [provider, setProviderState] = (0, import_react.useState)("openai");
	const [model, setModelState] = (0, import_react.useState)(DEFAULT_MODELS["openai"]);
	const [apiKey, setApiKeyState] = (0, import_react.useState)("");
	const [azionAuthType, setAzionAuthTypeState] = (0, import_react.useState)("cookie");
	(0, import_react.useEffect)(() => {
		const savedProvider = load$1("ai_provider", "openai");
		const savedModel = load$1("ai_model", DEFAULT_MODELS[savedProvider]);
		const savedApiKey = load$1("ai_key", "");
		const savedAzionAuthType = load$1("azion_auth_type", "cookie");
		setProviderState(savedProvider);
		setModelState(savedModel);
		setApiKeyState(savedApiKey);
		setAzionAuthTypeState(savedAzionAuthType);
	}, []);
	function setProvider(p) {
		setProviderState(p);
		save("ai_provider", p);
		const defaultModel = DEFAULT_MODELS[p];
		setModelState(defaultModel);
		save("ai_model", defaultModel);
	}
	function setModel(m) {
		setModelState(m);
		save("ai_model", m);
	}
	function setApiKey(k) {
		setApiKeyState(k);
		save("ai_key", k);
	}
	function setAzionAuthType(t) {
		setAzionAuthTypeState(t);
		save("azion_auth_type", t);
	}
	return {
		provider,
		model,
		apiKey,
		azionAuthType,
		setProvider,
		setModel,
		setApiKey,
		setAzionAuthType
	};
}
function MessageList({ messages, isLoading }) {
	const containerRef = (0, import_react.useRef)(null);
	const userScrolledUp = (0, import_react.useRef)(false);
	function onScroll() {
		const el = containerRef.current;
		if (!el) return;
		userScrolledUp.current = el.scrollHeight - el.scrollTop - el.clientHeight > 80;
	}
	(0, import_react.useEffect)(() => {
		if (messages[messages.length - 1]?.role === "user") userScrolledUp.current = false;
		if (!userScrolledUp.current) {
			const el = containerRef.current;
			if (el) el.scrollTop = el.scrollHeight;
		}
	}, [messages, isLoading]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		ref: containerRef,
		onScroll,
		style: {
			flex: 1,
			overflowY: "auto",
			background: "#111111"
		},
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			style: {
				maxWidth: "760px",
				margin: "0 auto",
				padding: "32px 24px 16px",
				display: "flex",
				flexDirection: "column"
			},
			children: [messages.map((msg) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				style: { marginBottom: "28px" },
				children: msg.role === "user" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					style: {
						display: "flex",
						justifyContent: "flex-end"
					},
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						style: {
							maxWidth: "72%",
							background: "rgba(254,96,31,0.12)",
							border: "0.8px solid rgba(254,96,31,0.24)",
							borderRadius: "18px 18px 4px 18px",
							padding: "12px 16px",
							color: "#FFB180",
							fontSize: "15px",
							lineHeight: "1.6",
							whiteSpace: "pre-wrap",
							wordBreak: "break-word",
							fontFamily: "'Sora', sans-serif"
						},
						children: msg.parts.filter((p) => p.type === "text").map((p, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: p.content }, i))
					})
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AssistantMessage, { msg })
			}, msg.id)), isLoading && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				style: {
					display: "flex",
					gap: "12px",
					alignItems: "flex-start",
					marginBottom: "28px"
				},
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					style: {
						width: "26px",
						height: "26px",
						borderRadius: "6px",
						background: "rgba(254,96,31,0.12)",
						border: "0.8px solid rgba(254,96,31,0.24)",
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						flexShrink: 0
					},
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AzionStarIcon, {})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					style: {
						display: "flex",
						gap: "4px",
						alignItems: "center",
						paddingTop: "4px"
					},
					children: [
						0,
						150,
						300
					].map((delay) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: {
						width: "5px",
						height: "5px",
						borderRadius: "50%",
						background: "#FE601F",
						display: "inline-block",
						animation: `azion-pulse 1.2s ease-in-out ${delay}ms infinite`
					} }, delay))
				})]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("style", { children: `
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
      ` })]
	});
}
function AssistantMessage({ msg }) {
	const [copied, setCopied] = (0, import_react.useState)(false);
	const fullText = msg.parts.filter((p) => p.type === "text").map((p) => p.content).join("\n\n");
	function handleCopy() {
		navigator.clipboard.writeText(fullText).then(() => {
			setCopied(true);
			setTimeout(() => setCopied(false), 2e3);
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "msg-assistant",
		style: {
			display: "flex",
			gap: "12px",
			alignItems: "flex-start"
		},
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			style: {
				width: "26px",
				height: "26px",
				borderRadius: "6px",
				background: "rgba(254,96,31,0.12)",
				border: "0.8px solid rgba(254,96,31,0.24)",
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				flexShrink: 0,
				marginTop: "1px"
			},
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AzionStarIcon, {})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "msg-assistant-content",
			style: {
				flex: 1,
				minWidth: 0
			},
			children: [msg.parts.map((part, i) => {
				if (part.type === "text") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextRenderer, { part }, i);
				if (part.type === "thinking") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThinkingRenderer, { part }, i);
				if (part.type === "tool-call") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToolCallRenderer, { part }, i);
				if (part.type === "tool-result") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToolResultRenderer, { part }, i);
				return null;
			}), fullText && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				onClick: handleCopy,
				title: copied ? "Copiado!" : "Copiar",
				className: copied ? "copy-btn copy-btn--done" : "copy-btn",
				style: {
					display: "flex",
					alignItems: "center",
					gap: "5px",
					marginTop: "6px",
					background: "transparent",
					border: "none",
					cursor: "pointer",
					padding: "4px 0",
					fontSize: "11px",
					fontFamily: "monospace",
					letterSpacing: "0.04em"
				},
				children: [copied ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CheckIcon, {}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CopyIcon, {}), copied ? "Copiado" : "Copiar"]
			})]
		})]
	});
}
function TextRenderer({ part }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "prose-azion",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Markdown, {
			components: {
				p: ({ children }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					style: {
						margin: "0 0 12px",
						color: "#E5E5E5",
						fontSize: "15px",
						lineHeight: "1.7",
						fontFamily: "'Sora', sans-serif"
					},
					children
				}),
				code: ({ children, className }) => {
					const isBlock = className?.startsWith("language-");
					const lang = className?.replace("language-", "") ?? "";
					if (isBlock) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						style: { margin: "12px 0" },
						children: [lang && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							style: {
								padding: "4px 12px",
								background: "#1A1A1A",
								borderRadius: "4px 4px 0 0",
								borderTop: "0.8px solid rgba(255,255,255,0.08)",
								borderLeft: "0.8px solid rgba(255,255,255,0.08)",
								borderRight: "0.8px solid rgba(255,255,255,0.08)",
								fontFamily: "monospace",
								fontSize: "10px",
								color: "#666666",
								letterSpacing: "0.06em",
								textTransform: "uppercase"
							},
							children: lang
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
							style: {
								margin: 0,
								padding: "14px 16px",
								background: "#0D0D0D",
								border: "0.8px solid rgba(255,255,255,0.08)",
								borderRadius: lang ? "0 0 4px 4px" : "4px",
								overflowX: "auto",
								fontFamily: "monospace",
								fontSize: "13px",
								lineHeight: "1.6",
								color: "#FCFCFC"
							},
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", { children })
						})]
					});
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
						style: {
							fontFamily: "monospace",
							fontSize: "0.88em",
							background: "rgba(254,96,31,0.08)",
							border: "0.8px solid rgba(254,96,31,0.16)",
							borderRadius: "3px",
							padding: "1px 5px",
							color: "#FF8E4D"
						},
						children
					});
				},
				pre: ({ children }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children }),
				h1: ({ children }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					style: {
						fontSize: "20px",
						fontWeight: 600,
						color: "#FCFCFC",
						margin: "20px 0 8px",
						fontFamily: "'Sora', sans-serif"
					},
					children
				}),
				h2: ({ children }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					style: {
						fontSize: "17px",
						fontWeight: 600,
						color: "#FCFCFC",
						margin: "16px 0 6px",
						fontFamily: "'Sora', sans-serif"
					},
					children
				}),
				h3: ({ children }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					style: {
						fontSize: "15px",
						fontWeight: 600,
						color: "#FCFCFC",
						margin: "12px 0 4px",
						fontFamily: "'Sora', sans-serif"
					},
					children
				}),
				ul: ({ children }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					style: {
						margin: "4px 0 12px",
						paddingLeft: "20px",
						color: "#E5E5E5",
						fontSize: "15px",
						lineHeight: "1.7",
						fontFamily: "'Sora', sans-serif"
					},
					children
				}),
				ol: ({ children }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
					style: {
						margin: "4px 0 12px",
						paddingLeft: "20px",
						color: "#E5E5E5",
						fontSize: "15px",
						lineHeight: "1.7",
						fontFamily: "'Sora', sans-serif"
					},
					children
				}),
				li: ({ children }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
					style: { marginBottom: "4px" },
					children
				}),
				blockquote: ({ children }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("blockquote", {
					style: {
						margin: "8px 0",
						paddingLeft: "12px",
						borderLeft: "2px solid rgba(254,96,31,0.4)",
						color: "#999999",
						fontStyle: "italic"
					},
					children
				}),
				strong: ({ children }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
					style: {
						fontWeight: 600,
						color: "#FCFCFC"
					},
					children
				}),
				em: ({ children }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("em", {
					style: { color: "#B2B2B2" },
					children
				}),
				a: ({ href, children }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
					href,
					target: "_blank",
					rel: "noopener noreferrer",
					style: {
						color: "#FE601F",
						textDecoration: "none"
					},
					children
				}),
				hr: () => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("hr", { style: {
					border: "none",
					borderTop: "0.8px solid rgba(255,255,255,0.08)",
					margin: "12px 0"
				} })
			},
			children: part.content
		})
	});
}
function ThinkingRenderer({ part }) {
	const [open, setOpen] = (0, import_react.useState)(false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		style: { marginBottom: "8px" },
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			onClick: () => setOpen((v) => !v),
			style: {
				display: "flex",
				alignItems: "center",
				gap: "6px",
				background: "transparent",
				border: "none",
				cursor: "pointer",
				padding: "4px 0",
				color: "#4D4D4D",
				fontSize: "11px",
				fontFamily: "monospace",
				letterSpacing: "0.06em",
				textTransform: "uppercase"
			},
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				style: { fontSize: "8px" },
				children: open ? "▼" : "▶"
			}), "Thinking"]
		}), open && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			style: {
				marginTop: "6px",
				padding: "10px 14px",
				background: "rgba(255,255,255,0.02)",
				border: "0.8px solid rgba(255,255,255,0.06)",
				borderRadius: "4px",
				fontSize: "13px",
				color: "#4D4D4D",
				fontFamily: "monospace",
				lineHeight: "1.6",
				whiteSpace: "pre-wrap",
				wordBreak: "break-word"
			},
			children: part.content
		})]
	});
}
function ToolCallRenderer({ part }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		style: {
			display: "inline-flex",
			alignItems: "center",
			gap: "6px",
			padding: "4px 10px",
			background: "rgba(138,132,236,0.08)",
			border: "0.8px solid rgba(138,132,236,0.2)",
			borderRadius: "4px",
			marginBottom: "6px",
			fontSize: "11px",
			fontFamily: "monospace",
			color: "#8A84EC",
			letterSpacing: "0.04em"
		},
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			style: { opacity: .6 },
			children: "⚙"
		}), part.name]
	});
}
function ToolResultRenderer({ part }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		style: {
			display: "inline-flex",
			alignItems: "center",
			gap: "6px",
			padding: "4px 10px",
			background: part.state === "error" ? "rgba(255,77,77,0.08)" : "rgba(38,217,104,0.08)",
			border: `0.8px solid ${part.state === "error" ? "rgba(255,77,77,0.2)" : "rgba(38,217,104,0.2)"}`,
			borderRadius: "4px",
			marginBottom: "6px",
			fontSize: "11px",
			fontFamily: "monospace",
			color: part.state === "error" ? "#FF4D4D" : "#26D968",
			letterSpacing: "0.04em"
		},
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			style: { opacity: .6 },
			children: part.state === "error" ? "✗" : "✓"
		}), "Result"]
	});
}
function AzionStarIcon() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
		width: "12",
		height: "12",
		viewBox: "0 0 20 20",
		fill: "none",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
			d: "M10 2L12.4 7.6L18 8.2L14 12.4L15.2 18L10 15.2L4.8 18L6 12.4L2 8.2L7.6 7.6L10 2Z",
			stroke: "#FE601F",
			strokeWidth: "1.5",
			strokeLinejoin: "round"
		})
	});
}
function CopyIcon() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		width: "12",
		height: "12",
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: "currentColor",
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
			x: "9",
			y: "9",
			width: "13",
			height: "13",
			rx: "2"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" })]
	});
}
function CheckIcon() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
		width: "12",
		height: "12",
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: "currentColor",
		strokeWidth: "2.5",
		strokeLinecap: "round",
		strokeLinejoin: "round",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("polyline", { points: "20 6 9 17 4 12" })
	});
}
function getSR() {
	if (typeof window === "undefined") return null;
	return window.SpeechRecognition ?? window.webkitSpeechRecognition ?? null;
}
function useAudioRecorder(onTranscript) {
	const [isRecording, setIsRecording] = (0, import_react.useState)(false);
	const [supported, setSupported] = (0, import_react.useState)(false);
	const recRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		setSupported(getSR() !== null);
	}, []);
	function start() {
		const SR = getSR();
		if (!SR) return false;
		const rec = new SR();
		rec.continuous = true;
		rec.interimResults = false;
		rec.lang = navigator.language || "pt-BR";
		rec.onresult = (e) => {
			const transcript = Array.from(e.results).map((r) => r[0].transcript).join(" ").trim();
			if (transcript) onTranscript(transcript);
		};
		rec.onerror = () => setIsRecording(false);
		rec.onend = () => setIsRecording(false);
		rec.start();
		recRef.current = rec;
		setIsRecording(true);
		return true;
	}
	function stop() {
		recRef.current?.stop();
		recRef.current = null;
		setIsRecording(false);
	}
	return {
		isRecording,
		supported,
		start,
		stop
	};
}
var MAX_SIZE = 32 * 1024;
var ACCEPTED = ".txt,.md,.ts,.tsx,.js,.jsx,.py,.json,.yaml,.yml,.html,.css,.sql,.sh,.csv,.xml,.toml,.go,.rs,.java,.kt,.swift,.rb,.php,.c,.cpp,.h";
function ChatInput({ onSend, onStop, isLoading, disabled, disabledReason }) {
	const textareaRef = (0, import_react.useRef)(null);
	const fileInputRef = (0, import_react.useRef)(null);
	const [attachedFiles, setAttachedFiles] = (0, import_react.useState)([]);
	function handleTranscript(text) {
		const el = textareaRef.current;
		if (!el) return;
		el.value = el.value ? `${el.value} ${text}` : text;
		el.style.height = "auto";
		el.style.height = Math.min(el.scrollHeight, 160) + "px";
		el.focus();
	}
	const { isRecording, supported: micSupported, start: startRec, stop: stopRec } = useAudioRecorder(handleTranscript);
	function handleKeyDown(e) {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			submit();
		}
	}
	function submit() {
		const userText = textareaRef.current?.value.trim() ?? "";
		if (!userText && attachedFiles.length === 0 || isLoading || disabled) return;
		const fileBlocks = attachedFiles.map((f) => `[Arquivo: ${f.name}]\n\`\`\`\n${f.content}\n\`\`\``).join("\n\n");
		onSend(fileBlocks ? userText ? `${fileBlocks}\n\n${userText}` : fileBlocks : userText);
		if (textareaRef.current) {
			textareaRef.current.value = "";
			textareaRef.current.style.height = "auto";
		}
		setAttachedFiles([]);
	}
	async function handleFileChange(e) {
		const files = Array.from(e.target.files ?? []);
		const added = [];
		const skipped = [];
		for (const file of files) {
			if (file.size > MAX_SIZE) {
				skipped.push(file.name);
				continue;
			}
			try {
				const content = await file.text();
				added.push({
					name: file.name,
					content
				});
			} catch {}
		}
		if (skipped.length > 0) alert(`Arquivos ignorados (limite 32KB): ${skipped.join(", ")}`);
		setAttachedFiles((prev) => {
			const existing = new Set(prev.map((f) => f.name));
			return [...prev, ...added.filter((f) => !existing.has(f.name))];
		});
		if (e.target) e.target.value = "";
	}
	function toggleMic() {
		if (isRecording) stopRec();
		else startRec();
	}
	const canSend = !disabled && !isLoading;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		style: {
			background: "#111111",
			padding: "12px 20px 20px",
			flexShrink: 0
		},
		children: [
			disabledReason && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				style: {
					fontSize: "11px",
					fontFamily: "monospace",
					color: "#666666",
					marginBottom: "10px",
					textAlign: "center",
					letterSpacing: "0.04em"
				},
				children: disabledReason
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				style: {
					maxWidth: "720px",
					margin: "0 auto",
					background: "#1C1C1C",
					border: "1px solid rgba(255,255,255,0.1)",
					borderRadius: "16px",
					overflow: "hidden",
					transition: "border-color 0.15s ease"
				},
				onFocusCapture: (e) => {
					e.currentTarget.style.borderColor = "rgba(254,96,31,0.35)";
				},
				onBlurCapture: (e) => {
					e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
				},
				children: [attachedFiles.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					style: {
						padding: "10px 12px 0",
						display: "flex",
						flexWrap: "wrap",
						gap: "6px"
					},
					children: attachedFiles.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						style: {
							display: "flex",
							alignItems: "center",
							gap: "5px",
							padding: "3px 8px 3px 8px",
							background: "rgba(254,96,31,0.1)",
							border: "0.8px solid rgba(254,96,31,0.28)",
							borderRadius: "6px",
							fontSize: "11px",
							fontFamily: "monospace",
							color: "#FF8E4D",
							letterSpacing: "0.02em"
						},
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileIcon, {}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								style: {
									maxWidth: "160px",
									overflow: "hidden",
									textOverflow: "ellipsis",
									whiteSpace: "nowrap"
								},
								children: f.name
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setAttachedFiles((p) => p.filter((x) => x.name !== f.name)),
								style: {
									background: "transparent",
									border: "none",
									color: "#FF8E4D",
									cursor: "pointer",
									padding: "0 0 0 2px",
									lineHeight: 1,
									opacity: .6,
									fontSize: "12px",
									transition: "opacity 0.15s"
								},
								onMouseEnter: (e) => {
									e.currentTarget.style.opacity = "1";
								},
								onMouseLeave: (e) => {
									e.currentTarget.style.opacity = "0.6";
								},
								children: "×"
							})
						]
					}, f.name))
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					style: {
						display: "flex",
						alignItems: "center",
						padding: "4px 8px 4px 4px",
						gap: "4px"
					},
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => fileInputRef.current?.click(),
							disabled: !canSend,
							title: "Anexar arquivo",
							style: {
								width: "36px",
								height: "36px",
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
								flexShrink: 0,
								background: "transparent",
								border: "none",
								borderRadius: "10px",
								color: canSend ? "#4D4D4D" : "#2D2D2D",
								cursor: canSend ? "pointer" : "not-allowed",
								transition: "all 0.15s ease",
								fontSize: "22px",
								fontWeight: 300,
								lineHeight: 1
							},
							onMouseEnter: (e) => {
								if (canSend) {
									e.currentTarget.style.background = "rgba(255,255,255,0.06)";
									e.currentTarget.style.color = "#FCFCFC";
								}
							},
							onMouseLeave: (e) => {
								e.currentTarget.style.background = "transparent";
								e.currentTarget.style.color = canSend ? "#4D4D4D" : "#2D2D2D";
							},
							children: "+"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							ref: fileInputRef,
							type: "file",
							accept: ACCEPTED,
							multiple: true,
							style: { display: "none" },
							onChange: handleFileChange
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
							ref: textareaRef,
							rows: 1,
							disabled: disabled || isLoading,
							onKeyDown: handleKeyDown,
							placeholder: disabled ? "Configure a chave de API em Settings…" : isLoading ? "Gerando…" : "Pergunte alguma coisa",
							style: {
								flex: 1,
								background: "transparent",
								border: "none",
								padding: "10px 4px",
								fontSize: "15px",
								color: disabled ? "#4D4D4D" : "#FCFCFC",
								fontFamily: "'Sora', sans-serif",
								resize: "none",
								outline: "none",
								minHeight: "40px",
								maxHeight: "160px",
								overflowY: "auto",
								lineHeight: "1.5"
							},
							onInput: (e) => {
								const el = e.currentTarget;
								el.style.height = "auto";
								el.style.height = Math.min(el.scrollHeight, 160) + "px";
							}
						}),
						micSupported && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: toggleMic,
							disabled,
							title: isRecording ? "Parar gravação" : "Entrada de voz",
							style: {
								width: "36px",
								height: "36px",
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
								flexShrink: 0,
								background: isRecording ? "rgba(255,77,77,0.15)" : "transparent",
								border: isRecording ? "0.8px solid rgba(255,77,77,0.4)" : "none",
								borderRadius: "10px",
								color: isRecording ? "#FF4D4D" : disabled ? "#2D2D2D" : "#4D4D4D",
								cursor: disabled ? "not-allowed" : "pointer",
								transition: "all 0.15s ease",
								animation: isRecording ? "mic-pulse 1.2s ease-in-out infinite" : "none"
							},
							onMouseEnter: (e) => {
								if (!disabled && !isRecording) {
									e.currentTarget.style.background = "rgba(255,255,255,0.06)";
									e.currentTarget.style.color = "#FCFCFC";
								}
							},
							onMouseLeave: (e) => {
								if (!isRecording) {
									e.currentTarget.style.background = "transparent";
									e.currentTarget.style.color = disabled ? "#2D2D2D" : "#4D4D4D";
								}
							},
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MicIcon, {})
						}),
						isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: onStop,
							title: "Parar geração",
							style: {
								width: "36px",
								height: "36px",
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
								flexShrink: 0,
								background: "#FCFCFC",
								border: "none",
								borderRadius: "10px",
								cursor: "pointer",
								color: "#0D0D0D",
								transition: "background 0.15s ease"
							},
							onMouseEnter: (e) => {
								e.currentTarget.style.background = "#E0E0E0";
							},
							onMouseLeave: (e) => {
								e.currentTarget.style.background = "#FCFCFC";
							},
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
								width: "12",
								height: "12",
								viewBox: "0 0 12 12",
								fill: "currentColor",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
									x: "1",
									y: "1",
									width: "10",
									height: "10",
									rx: "2"
								})
							})
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: submit,
							disabled,
							title: "Enviar",
							style: {
								width: "36px",
								height: "36px",
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
								flexShrink: 0,
								background: disabled ? "rgba(255,255,255,0.08)" : "#FCFCFC",
								border: "none",
								borderRadius: "10px",
								cursor: disabled ? "not-allowed" : "pointer",
								color: disabled ? "#4D4D4D" : "#0D0D0D",
								transition: "background 0.15s ease"
							},
							onMouseEnter: (e) => {
								if (!disabled) e.currentTarget.style.background = "#E0E0E0";
							},
							onMouseLeave: (e) => {
								if (!disabled) e.currentTarget.style.background = "#FCFCFC";
							},
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SendIcon, {})
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("style", { children: `
        @keyframes mic-pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(255,77,77,0); }
          50% { box-shadow: 0 0 0 4px rgba(255,77,77,0.15); }
        }
      ` }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				style: {
					textAlign: "center",
					fontSize: "11px",
					color: "#2A2A2A",
					marginTop: "10px",
					fontFamily: "monospace",
					letterSpacing: "0.03em"
				},
				children: "Powered by Azion · Keys are never stored server-side"
			})
		]
	});
}
function SendIcon() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
		width: "16",
		height: "16",
		viewBox: "0 0 16 16",
		fill: "none",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
			d: "M8 1L8 15M8 1L3 6M8 1L13 6",
			stroke: "currentColor",
			strokeWidth: "1.8",
			strokeLinecap: "round",
			strokeLinejoin: "round"
		})
	});
}
function MicIcon() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		width: "16",
		height: "16",
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: "currentColor",
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M19 10v2a7 7 0 0 1-14 0v-2" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
				x1: "12",
				x2: "12",
				y1: "19",
				y2: "22"
			})
		]
	});
}
function FileIcon() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		width: "10",
		height: "10",
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: "currentColor",
		strokeWidth: "2.5",
		strokeLinecap: "round",
		strokeLinejoin: "round",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("polyline", { points: "14 2 14 8 20 8" })]
	});
}
function SettingsDrawer({ open, onClose, settings }) {
	const [showKey, setShowKey] = (0, import_react.useState)(false);
	if (!open) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		style: {
			position: "fixed",
			inset: 0,
			zIndex: 50,
			display: "flex"
		},
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			style: {
				position: "absolute",
				inset: 0,
				background: "rgba(0,0,0,0.7)"
			},
			onClick: onClose
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			style: {
				position: "relative",
				marginLeft: "auto",
				height: "100%",
				width: "100%",
				maxWidth: "360px",
				background: "#0A0A0A",
				borderLeft: "0.8px solid rgba(255,255,255,0.08)",
				display: "flex",
				flexDirection: "column",
				boxShadow: "-24px 0 48px rgba(0,0,0,0.6)"
			},
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					style: {
						display: "flex",
						alignItems: "center",
						justifyContent: "space-between",
						padding: "0 24px",
						height: "56px",
						borderBottom: "0.8px solid rgba(255,255,255,0.08)",
						flexShrink: 0
					},
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						style: {
							fontFamily: "monospace",
							fontSize: "11px",
							color: "#B2B2B2",
							letterSpacing: "0.08em",
							textTransform: "uppercase"
						},
						children: "Settings"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: onClose,
						style: {
							background: "transparent",
							border: "none",
							color: "#4D4D4D",
							cursor: "pointer",
							fontSize: "16px",
							lineHeight: 1,
							padding: "4px",
							transition: "color 0.15s ease"
						},
						onMouseEnter: (e) => {
							e.currentTarget.style.color = "#FCFCFC";
						},
						onMouseLeave: (e) => {
							e.currentTarget.style.color = "#4D4D4D";
						},
						children: "✕"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					style: {
						flex: 1,
						overflowY: "auto",
						padding: "24px",
						display: "flex",
						flexDirection: "column",
						gap: "28px"
					},
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							style: {
								fontFamily: "monospace",
								fontSize: "10px",
								color: "#4D4D4D",
								letterSpacing: "0.1em",
								textTransform: "uppercase",
								marginBottom: "10px"
							},
							children: "Provider"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							style: {
								display: "grid",
								gridTemplateColumns: "repeat(3, 1fr)",
								gap: "8px"
							},
							children: [
								"openai",
								"anthropic",
								"copilot-azion"
							].map((p) => {
								const active = settings.provider === p;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => settings.setProvider(p),
									style: {
										padding: "8px 12px",
										borderRadius: "4px",
										fontSize: "12px",
										fontFamily: "monospace",
										letterSpacing: "0.04em",
										border: active ? "0.8px solid rgba(254,96,31,0.6)" : "0.8px solid rgba(255,255,255,0.08)",
										background: active ? "rgba(254,96,31,0.12)" : "rgba(255,255,255,0.03)",
										color: active ? "#FF8E4D" : "#666666",
										cursor: "pointer",
										transition: "all 0.15s ease"
									},
									onMouseEnter: (e) => {
										if (!active) {
											e.currentTarget.style.borderColor = "rgba(255,255,255,0.16)";
											e.currentTarget.style.color = "#B2B2B2";
										}
									},
									onMouseLeave: (e) => {
										if (!active) {
											e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
											e.currentTarget.style.color = "#666666";
										}
									},
									children: p === "openai" ? "OpenAI" : p === "anthropic" ? "Anthropic" : "Azion"
								}, p);
							})
						})] }),
						settings.provider === "copilot-azion" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							style: {
								fontFamily: "monospace",
								fontSize: "10px",
								color: "#4D4D4D",
								letterSpacing: "0.1em",
								textTransform: "uppercase",
								marginBottom: "10px"
							},
							children: "Auth Type"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							style: {
								display: "grid",
								gridTemplateColumns: "1fr 1fr",
								gap: "8px"
							},
							children: ["cookie", "token"].map((t) => {
								const active = settings.azionAuthType === t;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => settings.setAzionAuthType(t),
									style: {
										padding: "8px 12px",
										borderRadius: "4px",
										fontSize: "12px",
										fontFamily: "monospace",
										letterSpacing: "0.04em",
										border: active ? "0.8px solid rgba(254,96,31,0.6)" : "0.8px solid rgba(255,255,255,0.08)",
										background: active ? "rgba(254,96,31,0.12)" : "rgba(255,255,255,0.03)",
										color: active ? "#FF8E4D" : "#666666",
										cursor: "pointer",
										transition: "all 0.15s ease"
									},
									onMouseEnter: (e) => {
										if (!active) {
											e.currentTarget.style.borderColor = "rgba(255,255,255,0.16)";
											e.currentTarget.style.color = "#B2B2B2";
										}
									},
									onMouseLeave: (e) => {
										if (!active) {
											e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
											e.currentTarget.style.color = "#666666";
										}
									},
									children: t === "cookie" ? "Cookie (azsid)" : "API Token"
								}, t);
							})
						})] }),
						settings.provider !== "copilot-azion" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							style: {
								fontFamily: "monospace",
								fontSize: "10px",
								color: "#4D4D4D",
								letterSpacing: "0.1em",
								textTransform: "uppercase",
								marginBottom: "10px"
							},
							children: "Model"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
							value: settings.model,
							onChange: (e) => settings.setModel(e.target.value),
							style: {
								width: "100%",
								background: "#1A1A1A",
								border: "0.8px solid rgba(255,255,255,0.1)",
								borderRadius: "4px",
								padding: "10px 12px",
								fontSize: "13px",
								fontFamily: "'Sora', sans-serif",
								color: "#FCFCFC",
								outline: "none",
								cursor: "pointer",
								appearance: "none",
								backgroundImage: `url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%23666666' stroke-width='1.2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
								backgroundRepeat: "no-repeat",
								backgroundPosition: "right 12px center",
								paddingRight: "32px"
							},
							onFocus: (e) => {
								e.currentTarget.style.borderColor = "rgba(254,96,31,0.4)";
							},
							onBlur: (e) => {
								e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
							},
							children: (MODELS[settings.provider] ?? []).map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: m,
								style: { background: "#1A1A1A" },
								children: m
							}, m))
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								style: {
									fontFamily: "monospace",
									fontSize: "10px",
									color: "#4D4D4D",
									letterSpacing: "0.1em",
									textTransform: "uppercase",
									marginBottom: "10px"
								},
								children: settings.provider === "copilot-azion" ? settings.azionAuthType === "cookie" ? "Cookie (azsid)" : "API Token" : "API Key"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								style: { position: "relative" },
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: showKey ? "text" : "password",
									value: settings.apiKey,
									onChange: (e) => settings.setApiKey(e.target.value),
									placeholder: settings.provider === "openai" ? "sk-…" : settings.provider === "anthropic" ? "sk-ant-…" : settings.azionAuthType === "cookie" ? "azsid cookie value" : "API token",
									style: {
										width: "100%",
										background: "#1A1A1A",
										border: "0.8px solid rgba(255,255,255,0.1)",
										borderRadius: "4px",
										padding: "10px 80px 10px 12px",
										fontSize: "13px",
										fontFamily: "monospace",
										color: "#FCFCFC",
										outline: "none",
										boxSizing: "border-box",
										transition: "border-color 0.15s ease"
									},
									onFocus: (e) => {
										e.currentTarget.style.borderColor = "rgba(254,96,31,0.4)";
									},
									onBlur: (e) => {
										e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
									}
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									style: {
										position: "absolute",
										right: "8px",
										top: "50%",
										transform: "translateY(-50%)",
										display: "flex",
										gap: "4px"
									},
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => setShowKey((s) => !s),
										style: {
											background: "transparent",
											border: "none",
											color: "#4D4D4D",
											fontSize: "10px",
											fontFamily: "monospace",
											letterSpacing: "0.04em",
											cursor: "pointer",
											padding: "2px 4px",
											transition: "color 0.15s ease"
										},
										onMouseEnter: (e) => {
											e.currentTarget.style.color = "#B2B2B2";
										},
										onMouseLeave: (e) => {
											e.currentTarget.style.color = "#4D4D4D";
										},
										children: showKey ? "HIDE" : "SHOW"
									}), settings.apiKey && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => settings.setApiKey(""),
										style: {
											background: "transparent",
											border: "none",
											color: "#4D4D4D",
											fontSize: "10px",
											fontFamily: "monospace",
											letterSpacing: "0.04em",
											cursor: "pointer",
											padding: "2px 4px",
											transition: "color 0.15s ease"
										},
										onMouseEnter: (e) => {
											e.currentTarget.style.color = "#FF4D4D";
										},
										onMouseLeave: (e) => {
											e.currentTarget.style.color = "#4D4D4D";
										},
										children: "CLR"
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								style: {
									marginTop: "8px",
									fontSize: "11px",
									fontFamily: "monospace",
									color: "#333333",
									lineHeight: "1.5",
									letterSpacing: "0.02em"
								},
								children: "Stored in browser localStorage. Never sent to any server other than the selected provider's API."
							})
						] })
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					style: {
						padding: "16px 24px",
						borderTop: "0.8px solid rgba(255,255,255,0.08)",
						flexShrink: 0
					},
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						style: {
							display: "flex",
							alignItems: "center",
							gap: "8px",
							padding: "10px 14px",
							borderRadius: "4px",
							border: settings.apiKey ? "0.8px solid rgba(254,96,31,0.24)" : "0.8px solid rgba(255,255,255,0.06)",
							background: settings.apiKey ? "rgba(254,96,31,0.06)" : "rgba(255,255,255,0.02)"
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: {
							width: "5px",
							height: "5px",
							borderRadius: "50%",
							background: settings.apiKey ? "#FE601F" : "#333333",
							flexShrink: 0
						} }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							style: {
								fontFamily: "monospace",
								fontSize: "11px",
								color: settings.apiKey ? "#FF8E4D" : "#4D4D4D",
								letterSpacing: "0.04em"
							},
							children: settings.apiKey ? `READY · ${settings.provider === "openai" ? "OPENAI" : settings.provider === "anthropic" ? "ANTHROPIC" : "AZION"}${settings.provider !== "copilot-azion" ? ` / ${settings.model}` : ""}` : settings.provider === "copilot-azion" ? "ENTER THE AZSID COOKIE TO START" : "ENTER AN API KEY TO START"
						})]
					})
				})
			]
		})]
	});
}
function groupByTime(conversations) {
	const today = /* @__PURE__ */ new Date();
	today.setHours(0, 0, 0, 0);
	const todayTs = today.getTime();
	const yesterdayTs = todayTs - 864e5;
	const sevenDaysAgoTs = todayTs - 7 * 864e5;
	const thirtyDaysAgoTs = todayTs - 30 * 864e5;
	const sorted = [...conversations].sort((a, b) => b.timestamp - a.timestamp);
	const todayItems = sorted.filter((c) => c.timestamp >= todayTs);
	const yesterdayItems = sorted.filter((c) => c.timestamp >= yesterdayTs && c.timestamp < todayTs);
	const prev7Items = sorted.filter((c) => c.timestamp >= sevenDaysAgoTs && c.timestamp < yesterdayTs);
	const prev30Items = sorted.filter((c) => c.timestamp >= thirtyDaysAgoTs && c.timestamp < sevenDaysAgoTs);
	const olderItems = sorted.filter((c) => c.timestamp < thirtyDaysAgoTs);
	const groups = [];
	if (todayItems.length) groups.push({
		label: "Hoje",
		items: todayItems
	});
	if (yesterdayItems.length) groups.push({
		label: "Ontem",
		items: yesterdayItems
	});
	if (prev7Items.length) groups.push({
		label: "Últimos 7 dias",
		items: prev7Items
	});
	if (prev30Items.length) groups.push({
		label: "Últimos 30 dias",
		items: prev30Items
	});
	const monthMap = /* @__PURE__ */ new Map();
	for (const conv of olderItems) {
		const key = new Date(conv.timestamp).toLocaleString("pt-BR", {
			month: "long",
			year: "numeric"
		});
		if (!monthMap.has(key)) monthMap.set(key, []);
		monthMap.get(key).push(conv);
	}
	monthMap.forEach((items, label) => groups.push({
		label,
		items
	}));
	return groups;
}
function Sidebar({ isOpen, onToggle, conversations, currentId, onNewChat, onLoad, onDelete, onOpenSettings }) {
	const groups = groupByTime(conversations);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		style: {
			width: isOpen ? "260px" : "0px",
			height: "100%",
			background: "#0A0A0A",
			borderRight: isOpen ? "0.8px solid rgba(255,255,255,0.08)" : "none",
			display: "flex",
			flexDirection: "column",
			overflow: "hidden",
			transition: "width 0.2s ease",
			flexShrink: 0
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				style: {
					display: "flex",
					alignItems: "center",
					justifyContent: "space-between",
					padding: "12px 12px 8px",
					flexShrink: 0
				},
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SidebarIconBtn, {
					onClick: onToggle,
					title: "Fechar barra lateral",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HamburgerIcon$1, {})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SidebarIconBtn, {
					onClick: onNewChat,
					title: "Nova conversa",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ComposeIcon, {})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				style: {
					flex: 1,
					overflowY: "auto",
					padding: "4px 0"
				},
				children: groups.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					style: {
						textAlign: "center",
						padding: "32px 16px",
						fontSize: "12px",
						color: "#333333",
						fontFamily: "monospace",
						letterSpacing: "0.04em",
						margin: 0
					},
					children: "Nenhuma conversa"
				}) : groups.map((group) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					style: {
						padding: "8px 12px 4px",
						fontSize: "11px",
						fontWeight: 600,
						color: "#4D4D4D",
						letterSpacing: "0.05em",
						textTransform: "uppercase",
						userSelect: "none",
						whiteSpace: "nowrap"
					},
					children: group.label
				}), group.items.map((conv) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConvItem, {
					conv,
					isActive: conv.id === currentId,
					onLoad,
					onDelete
				}, conv.id))] }, group.label))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				style: {
					borderTop: "0.8px solid rgba(255,255,255,0.06)",
					padding: "10px 12px",
					flexShrink: 0,
					display: "flex",
					alignItems: "center",
					justifyContent: "space-between"
				},
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AzionLogoSmall, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SidebarIconBtn, {
					onClick: onOpenSettings,
					title: "Configurações",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GearIcon$1, {})
				})]
			})
		]
	});
}
function ConvItem({ conv, isActive, onLoad, onDelete }) {
	const [hovered, setHovered] = (0, import_react.useState)(false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		onMouseEnter: () => setHovered(true),
		onMouseLeave: () => setHovered(false),
		style: {
			display: "flex",
			alignItems: "center",
			padding: "0 8px 0 12px",
			background: isActive ? "rgba(254,96,31,0.08)" : hovered ? "rgba(255,255,255,0.04)" : "transparent",
			borderLeft: `2px solid ${isActive ? "#FE601F" : "transparent"}`,
			transition: "background 0.12s ease"
		},
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			onClick: () => onLoad(conv),
			style: {
				flex: 1,
				background: "transparent",
				border: "none",
				padding: "8px 4px 8px 0",
				textAlign: "left",
				cursor: "pointer",
				overflow: "hidden",
				minWidth: 0
			},
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				style: {
					fontSize: "14px",
					color: isActive ? "#FCFCFC" : "#B2B2B2",
					overflow: "hidden",
					textOverflow: "ellipsis",
					whiteSpace: "nowrap",
					lineHeight: "1.4",
					fontFamily: "'Sora', sans-serif"
				},
				children: conv.title
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			onClick: (e) => {
				e.stopPropagation();
				onDelete(conv.id);
			},
			title: "Excluir",
			style: {
				opacity: hovered ? 1 : 0,
				pointerEvents: hovered ? "auto" : "none",
				background: "transparent",
				border: "none",
				color: "#4D4D4D",
				cursor: "pointer",
				padding: "4px",
				flexShrink: 0,
				transition: "all 0.12s ease",
				borderRadius: "4px",
				display: "flex",
				alignItems: "center",
				justifyContent: "center"
			},
			onMouseEnter: (e) => {
				e.currentTarget.style.color = "#FF4D4D";
			},
			onMouseLeave: (e) => {
				e.currentTarget.style.color = "#4D4D4D";
			},
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrashIcon, {})
		})]
	});
}
function SidebarIconBtn({ children, onClick, title }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		onClick,
		title,
		style: {
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
			flexShrink: 0
		},
		onMouseEnter: (e) => {
			e.currentTarget.style.background = "rgba(255,255,255,0.08)";
			e.currentTarget.style.color = "#FCFCFC";
		},
		onMouseLeave: (e) => {
			e.currentTarget.style.background = "transparent";
			e.currentTarget.style.color = "#666666";
		},
		children
	});
}
function HamburgerIcon$1() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		width: "18",
		height: "18",
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: "currentColor",
		strokeWidth: "2",
		strokeLinecap: "round",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
				x1: "3",
				y1: "6",
				x2: "21",
				y2: "6"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
				x1: "3",
				y1: "12",
				x2: "21",
				y2: "12"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
				x1: "3",
				y1: "18",
				x2: "21",
				y2: "18"
			})
		]
	});
}
function ComposeIcon() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		width: "18",
		height: "18",
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: "currentColor",
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M12 20h9" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" })]
	});
}
function GearIcon$1() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		width: "16",
		height: "16",
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: "currentColor",
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
			cx: "12",
			cy: "12",
			r: "3"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" })]
	});
}
function TrashIcon() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		width: "14",
		height: "14",
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: "currentColor",
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("polyline", { points: "3 6 5 6 21 6" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" })]
	});
}
function AzionLogoSmall() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		width: "72",
		height: "14",
		viewBox: "0 0 90 18",
		fill: "none",
		xmlns: "http://www.w3.org/2000/svg",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				fillRule: "evenodd",
				clipRule: "evenodd",
				d: "M86.637 0L85.1445 7.79033L87.861 11.1671L90 0H86.637ZM72.5099 0L69.1465 17.561H72.5111L74.8163 5.52224L84.5333 17.561H86.637L87.0518 15.4112L74.6131 0H72.5099Z",
				fill: "#F3652B"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				fillRule: "evenodd",
				clipRule: "evenodd",
				d: "M51.6563 0L48.293 17.561H65.7833L69.1466 0H51.6563ZM54.3884 3.31794H65.1392L63.0467 14.243H52.296L54.3884 3.31794Z",
				fill: "#F3652B"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				fillRule: "evenodd",
				clipRule: "evenodd",
				d: "M45.0001 0L41.707 17.561H44.9994L48.2924 0H45.0001Z",
				fill: "#F3652B"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				fillRule: "evenodd",
				clipRule: "evenodd",
				d: "M24.217 0L23.5814 3.31801H35.1962L21.3511 14.9756L20.8535 17.561H38.3437L38.9793 14.243H27.3646L41.2126 2.58289L41.7072 0H24.217Z",
				fill: "#F3652B"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				fillRule: "evenodd",
				clipRule: "evenodd",
				d: "M18.2868 0L0.490892 14.9821L0 17.561H2.5639L16.349 5.96141L14.1271 17.561H17.4898L20.8537 0H18.2868Z",
				fill: "#F3652B"
			})
		]
	});
}
var KEY = "ai_conversations";
function load() {
	try {
		const raw = localStorage.getItem(KEY);
		return raw ? JSON.parse(raw) : [];
	} catch {
		return [];
	}
}
function persist(convs) {
	try {
		localStorage.setItem(KEY, JSON.stringify(convs));
	} catch {}
}
function makeTitle(messages) {
	const first = messages.find((m) => m.role === "user");
	if (!first) return "New conversation";
	const text = first.parts.filter((p) => p.type === "text").map((p) => "content" in p ? String(p.content) : "").join(" ").trim();
	return text.length > 64 ? text.slice(0, 64) + "…" : text || "New conversation";
}
function useConversationHistory() {
	const [conversations, setConversations] = (0, import_react.useState)([]);
	(0, import_react.useEffect)(() => {
		setConversations(load());
	}, []);
	return {
		conversations,
		save: (0, import_react.useCallback)((id, messages) => {
			if (messages.length === 0) return;
			const title = makeTitle(messages);
			setConversations((prev) => {
				const updated = prev.some((c) => c.id === id) ? prev.map((c) => c.id === id ? {
					...c,
					messages,
					title,
					timestamp: Date.now()
				} : c) : [{
					id,
					title,
					timestamp: Date.now(),
					messages
				}, ...prev];
				persist(updated);
				return updated;
			});
		}, []),
		remove: (0, import_react.useCallback)((id) => {
			setConversations((prev) => {
				const updated = prev.filter((c) => c.id !== id);
				persist(updated);
				return updated;
			});
		}, [])
	};
}
function newId() {
	return `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
}
var SUGGESTIONS = [
	"Explique um conceito",
	"Escreva um código",
	"Resuma um texto",
	"Ajude-me a criar"
];
function ChatPanel({ settings }) {
	const [settingsOpen, setSettingsOpen] = (0, import_react.useState)(false);
	const [sidebarOpen, setSidebarOpen] = (0, import_react.useState)(true);
	const [currentConvId, setCurrentConvId] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		setCurrentConvId(newId());
	}, []);
	const settingsRef = (0, import_react.useRef)(settings);
	settingsRef.current = settings;
	const history = useConversationHistory();
	const connection = (0, import_react.useRef)(fetchServerSentEvents("/api/chat", async () => ({ headers: {
		"X-Api-Key": settingsRef.current.apiKey,
		"X-Provider": settingsRef.current.provider,
		"X-Model": settingsRef.current.model,
		"X-Azion-Auth-Type": settingsRef.current.azionAuthType
	} }))).current;
	const { messages, sendMessage, setMessages, isLoading, stop, reload, clear, error } = useChat({ connection });
	const noKey = !settings.apiKey.trim();
	const displayMessages = (0, import_react.useMemo)(() => messages.filter((m) => m.role === "user" || m.role === "assistant"), [messages]);
	const hasMessages = displayMessages.length > 0;
	const lastIsAssistant = displayMessages[displayMessages.length - 1]?.role === "assistant";
	(0, import_react.useEffect)(() => {
		if (displayMessages.length > 0) history.save(currentConvId, displayMessages);
	}, [displayMessages, currentConvId]);
	function handleLoadConversation(conv) {
		setMessages(conv.messages);
		setCurrentConvId(conv.id);
	}
	function handleNewConversation() {
		clear();
		setCurrentConvId(newId());
	}
	function handleSend(text) {
		sendMessage({ content: text });
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("style", { children: `
        @keyframes fadeInChat {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInEmpty {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
      ` }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			style: {
				display: "flex",
				height: "100%",
				overflow: "hidden",
				background: "#111111"
			},
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sidebar, {
				isOpen: sidebarOpen,
				onToggle: () => setSidebarOpen((v) => !v),
				conversations: history.conversations,
				currentId: currentConvId,
				onNewChat: handleNewConversation,
				onLoad: handleLoadConversation,
				onDelete: history.remove,
				onOpenSettings: () => setSettingsOpen(true)
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				style: {
					flex: 1,
					display: "flex",
					flexDirection: "column",
					overflow: "hidden",
					minWidth: 0
				},
				children: !hasMessages ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					style: {
						flex: 1,
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
						justifyContent: "center",
						padding: "24px 20px 40px",
						position: "relative",
						animation: "fadeInEmpty 0.25s ease"
					},
					children: [
						!sidebarOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setSidebarOpen(true),
							title: "Abrir barra lateral",
							style: {
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
								transition: "all 0.12s ease"
							},
							onMouseEnter: (e) => {
								e.currentTarget.style.background = "rgba(255,255,255,0.08)";
								e.currentTarget.style.color = "#FCFCFC";
							},
							onMouseLeave: (e) => {
								e.currentTarget.style.background = "transparent";
								e.currentTarget.style.color = "#666666";
							},
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HamburgerIcon, {})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							style: {
								fontSize: "30px",
								fontWeight: 600,
								color: "#FCFCFC",
								margin: "0 0 32px",
								textAlign: "center",
								letterSpacing: "-0.02em",
								fontFamily: "'Sora', sans-serif"
							},
							children: "No que você está pensando hoje?"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							style: {
								width: "100%",
								maxWidth: "720px"
							},
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChatInput, {
								onSend: handleSend,
								onStop: stop,
								isLoading,
								disabled: noKey,
								disabledReason: noKey ? "Configure sua chave de API em Settings para começar" : void 0
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							style: {
								display: "flex",
								flexWrap: "wrap",
								gap: "8px",
								justifyContent: "center",
								marginTop: "12px"
							},
							children: SUGGESTIONS.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => !noKey && handleSend(s),
								disabled: noKey,
								style: {
									padding: "8px 16px",
									background: "rgba(255,255,255,0.05)",
									border: "0.8px solid rgba(255,255,255,0.1)",
									borderRadius: "999px",
									color: noKey ? "#333333" : "#B2B2B2",
									fontSize: "14px",
									fontFamily: "'Sora', sans-serif",
									cursor: noKey ? "not-allowed" : "pointer",
									transition: "all 0.15s ease"
								},
								onMouseEnter: (e) => {
									if (!noKey) {
										e.currentTarget.style.background = "rgba(254,96,31,0.1)";
										e.currentTarget.style.borderColor = "rgba(254,96,31,0.3)";
										e.currentTarget.style.color = "#FF8E4D";
									}
								},
								onMouseLeave: (e) => {
									e.currentTarget.style.background = "rgba(255,255,255,0.05)";
									e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
									e.currentTarget.style.color = noKey ? "#333333" : "#B2B2B2";
								},
								children: s
							}, s))
						}),
						noKey && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => setSettingsOpen(true),
							style: {
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
								transition: "all 0.15s ease"
							},
							onMouseEnter: (e) => {
								e.currentTarget.style.borderColor = "rgba(254,96,31,0.6)";
								e.currentTarget.style.background = "rgba(254,96,31,0.08)";
							},
							onMouseLeave: (e) => {
								e.currentTarget.style.borderColor = "rgba(254,96,31,0.3)";
								e.currentTarget.style.background = "transparent";
							},
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GearIcon, {}), " ABRIR SETTINGS"]
						})
					]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					style: {
						flex: 1,
						display: "flex",
						flexDirection: "column",
						overflow: "hidden",
						animation: "fadeInChat 0.25s ease"
					},
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
							style: {
								height: "52px",
								display: "flex",
								alignItems: "center",
								justifyContent: "space-between",
								padding: "0 16px",
								borderBottom: "0.8px solid rgba(255,255,255,0.06)",
								flexShrink: 0,
								background: "#111111"
							},
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								style: {
									display: "flex",
									alignItems: "center",
									gap: "8px"
								},
								children: [!sidebarOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => setSidebarOpen(true),
									title: "Abrir barra lateral",
									style: {
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
										transition: "all 0.12s ease"
									},
									onMouseEnter: (e) => {
										e.currentTarget.style.background = "rgba(255,255,255,0.08)";
										e.currentTarget.style.color = "#FCFCFC";
									},
									onMouseLeave: (e) => {
										e.currentTarget.style.background = "transparent";
										e.currentTarget.style.color = "#666666";
									},
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HamburgerIcon, {})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									style: {
										fontSize: "14px",
										fontWeight: 500,
										color: "#666666",
										fontFamily: "'Sora', sans-serif"
									},
									children: [settings.provider === "openai" ? "OpenAI" : settings.provider === "anthropic" ? "Anthropic" : "Azion Copilot", settings.provider !== "copilot-azion" && ` · ${settings.model}`]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								style: {
									display: "flex",
									alignItems: "center",
									gap: "8px"
								},
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: handleNewConversation,
									title: "Nova conversa",
									style: {
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
										transition: "all 0.15s ease"
									},
									onMouseEnter: (e) => {
										e.currentTarget.style.borderColor = "rgba(254,96,31,0.3)";
										e.currentTarget.style.color = "#FF8E4D";
									},
									onMouseLeave: (e) => {
										e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
										e.currentTarget.style.color = "#666666";
									},
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ComposeSmallIcon, {}), " NOVA"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => setSettingsOpen(true),
									title: "Configurações",
									style: {
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
										transition: "all 0.12s ease"
									},
									onMouseEnter: (e) => {
										e.currentTarget.style.background = "rgba(255,255,255,0.08)";
										e.currentTarget.style.color = "#FCFCFC";
									},
									onMouseLeave: (e) => {
										e.currentTarget.style.background = "transparent";
										e.currentTarget.style.color = "#666666";
									},
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GearIcon, {})
								})]
							})]
						}),
						error && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							style: {
								padding: "8px 24px",
								background: "rgba(255,77,77,0.06)",
								borderBottom: "0.8px solid rgba(255,77,77,0.2)",
								display: "flex",
								alignItems: "center",
								gap: "8px",
								flexShrink: 0
							},
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									style: {
										color: "#FF4D4D",
										fontSize: "11px"
									},
									children: "✕"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									style: {
										fontFamily: "monospace",
										fontSize: "11px",
										color: "#FF8080",
										letterSpacing: "0.03em",
										flex: 1
									},
									children: error.message
								}),
								lastIsAssistant && !isLoading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => reload(),
									style: {
										background: "transparent",
										border: "0.8px solid rgba(255,77,77,0.3)",
										borderRadius: "4px",
										color: "#FF4D4D",
										fontSize: "10px",
										fontFamily: "monospace",
										letterSpacing: "0.06em",
										cursor: "pointer",
										padding: "3px 8px"
									},
									children: "RETRY"
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageList, {
							messages: displayMessages,
							isLoading
						}),
						!isLoading && !error && lastIsAssistant && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							style: {
								padding: "6px 0",
								display: "flex",
								justifyContent: "center",
								flexShrink: 0
							},
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => reload(),
								style: {
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
									transition: "all 0.15s ease"
								},
								onMouseEnter: (e) => {
									e.currentTarget.style.borderColor = "rgba(254,96,31,0.3)";
									e.currentTarget.style.color = "#FF8E4D";
								},
								onMouseLeave: (e) => {
									e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
									e.currentTarget.style.color = "#666666";
								},
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReloadIcon, {}), " REGENERAR"]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChatInput, {
							onSend: handleSend,
							onStop: stop,
							isLoading,
							disabled: noKey,
							disabledReason: noKey ? "Configure sua chave de API em Settings para começar" : void 0
						})
					]
				})
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SettingsDrawer, {
			open: settingsOpen,
			onClose: () => setSettingsOpen(false),
			settings
		})
	] });
}
function HamburgerIcon() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		width: "18",
		height: "18",
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: "currentColor",
		strokeWidth: "2",
		strokeLinecap: "round",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
				x1: "3",
				y1: "6",
				x2: "21",
				y2: "6"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
				x1: "3",
				y1: "12",
				x2: "21",
				y2: "12"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
				x1: "3",
				y1: "18",
				x2: "21",
				y2: "18"
			})
		]
	});
}
function GearIcon() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		width: "16",
		height: "16",
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: "currentColor",
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
			cx: "12",
			cy: "12",
			r: "3"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" })]
	});
}
function ReloadIcon() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		width: "12",
		height: "12",
		viewBox: "0 0 16 16",
		fill: "currentColor",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
			fillRule: "evenodd",
			d: "M8 3a5 5 0 104.546 2.914.5.5 0 00-.908-.417A4 4 0 118 4V3z",
			clipRule: "evenodd"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M8 4.466V.534a.25.25 0 00-.41-.192L5.23 2.308a.25.25 0 000 .384l2.36 1.966A.25.25 0 008 4.466z" })]
	});
}
function ComposeSmallIcon() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		width: "12",
		height: "12",
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: "currentColor",
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M12 20h9" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" })]
	});
}
function Chat() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChatPanel, { settings: useSettings() });
}
var SplitComponent = Chat;
//#endregion
export { SplitComponent as component };

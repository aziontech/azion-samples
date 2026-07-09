import "../_runtime.mjs";
import { t as createOpenaiChatCompletions } from "../_libs/@tanstack/ai-openai+[...].mjs";
import { c as lazyRouteComponent, d as Link, f as ErrorComponent, i as HeadContent, l as createFileRoute, m as redirect, o as createRouter, r as Scripts, s as Outlet, u as createRootRouteWithContext } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_react } from "../_libs/react+tanstack__ai-react.mjs";
import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { a as chat, n as chatParamsFromRequest, o as toServerSentEventsResponse } from "../_libs/@tanstack/ai+[...].mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { t as setupRouterSsrQueryIntegration } from "../_libs/@tanstack/react-router-ssr-query+[...].mjs";
import { t as ReactQueryDevtools2 } from "../_libs/tanstack__react-query-devtools.mjs";
import { t as TanStackRouterDevtools } from "../_libs/@tanstack/react-router-devtools+[...].mjs";
require_react();
var import_jsx_runtime = require_jsx_runtime();
function DefaultCatchBoundary({ error }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		style: {
			padding: "24px",
			background: "#111111",
			minHeight: "100vh",
			fontFamily: "monospace"
		},
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ErrorComponent, { error }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
			to: "/",
			style: {
				color: "#FE601F",
				textDecoration: "none",
				marginTop: "16px",
				display: "inline-block",
				fontSize: "13px"
			},
			children: "Go home"
		})]
	});
}
function NotFound() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		style: {
			padding: "24px",
			background: "#111111",
			minHeight: "100vh",
			fontFamily: "monospace",
			textAlign: "center",
			display: "flex",
			flexDirection: "column",
			alignItems: "center",
			justifyContent: "center"
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				style: {
					fontSize: "48px",
					margin: "0 0 12px",
					color: "#333333"
				},
				children: "404"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				style: {
					color: "#666666",
					margin: "0 0 20px",
					fontSize: "14px"
				},
				children: "Page not found"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/",
				style: {
					color: "#FE601F",
					textDecoration: "none",
					fontSize: "12px",
					letterSpacing: "0.06em"
				},
				children: "GO HOME"
			})
		]
	});
}
var app_default = "/assets/app-D4EFLD1r.css";
function seo({ title, description }) {
	const tags = [{ title }];
	if (description) {
		tags.push({
			name: "description",
			content: description
		});
		tags.push({
			property: "og:title",
			content: title
		});
		tags.push({
			property: "og:description",
			content: description
		});
	}
	return tags;
}
var Route$3 = createRootRouteWithContext()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			...seo({ title: "AI Chat · Azion" })
		],
		links: [{
			rel: "stylesheet",
			href: app_default
		}, {
			rel: "icon",
			href: "/favicon.ico"
		}]
	}),
	errorComponent: (props) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RootDocument, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DefaultCatchBoundary, { ...props }) }),
	notFoundComponent: () => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NotFound, {}),
	component: RootComponent
});
function RootComponent() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RootDocument, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}) });
}
function RootDocument({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", {
		style: {
			margin: 0,
			height: "100dvh",
			display: "flex",
			flexDirection: "column",
			background: "#111111"
		},
		children: [
			children,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TanStackRouterDevtools, { position: "bottom-right" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReactQueryDevtools2, { buttonPosition: "bottom-left" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})
		]
	})] });
}
var $$splitComponentImporter$1 = () => import("./routes-DTEZEvkE.mjs");
var Route$2 = createFileRoute("/")({
	beforeLoad: () => {
		throw redirect({ to: "/chat" });
	},
	component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
var $$splitComponentImporter = () => import("./chat.index-CwvwRyxW.mjs");
var Route$1 = createFileRoute("/chat/")({ component: lazyRouteComponent($$splitComponentImporter, "component") });
function generateId() {
	return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}
async function* anthropicStream(messages, model, apiKey, threadId, runId) {
	const msgId = generateId();
	yield {
		type: "RUN_STARTED",
		threadId,
		runId,
		timestamp: Date.now()
	};
	const response = await fetch("https://api.anthropic.com/v1/messages", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			"x-api-key": apiKey,
			"anthropic-version": "2023-06-01"
		},
		body: JSON.stringify({
			model,
			max_tokens: 4096,
			messages,
			stream: true
		})
	});
	if (!response.ok) {
		const err = await response.text();
		yield {
			type: "RUN_ERROR",
			threadId,
			runId,
			timestamp: Date.now(),
			error: {
				message: err,
				code: String(response.status)
			}
		};
		return;
	}
	yield {
		type: "TEXT_MESSAGE_START",
		messageId: msgId,
		role: "assistant",
		timestamp: Date.now()
	};
	const reader = response.body.getReader();
	const decoder = new TextDecoder();
	let buffer = "";
	while (true) {
		const { done, value } = await reader.read();
		if (done) break;
		buffer += decoder.decode(value, { stream: true });
		const lines = buffer.split("\n");
		buffer = lines.pop() ?? "";
		for (const line of lines) {
			if (!line.startsWith("data: ")) continue;
			try {
				const chunk = JSON.parse(line.slice(6));
				if (chunk.type === "content_block_delta" && chunk.delta?.type === "text_delta") yield {
					type: "TEXT_MESSAGE_CONTENT",
					messageId: msgId,
					delta: chunk.delta.text,
					timestamp: Date.now()
				};
			} catch {}
		}
	}
	yield {
		type: "TEXT_MESSAGE_END",
		messageId: msgId,
		timestamp: Date.now()
	};
	yield {
		type: "RUN_FINISHED",
		threadId,
		runId,
		timestamp: Date.now(),
		finishReason: "stop"
	};
}
async function* azionCopilotStream(messages, credential, authType, threadId, runId) {
	const msgId = generateId();
	yield {
		type: "RUN_STARTED",
		threadId,
		runId,
		timestamp: Date.now()
	};
	const response = await fetch("https://ai.azion.com/copilot/chat/completions", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			...authType === "cookie" ? { Cookie: `azsid=${credential}` } : { Authorization: `Token ${credential}` }
		},
		body: JSON.stringify({
			messages,
			stream: true
		})
	});
	if (!response.ok) {
		const err = await response.text();
		yield {
			type: "RUN_ERROR",
			threadId,
			runId,
			timestamp: Date.now(),
			error: {
				message: err,
				code: String(response.status)
			}
		};
		return;
	}
	yield {
		type: "TEXT_MESSAGE_START",
		messageId: msgId,
		role: "assistant",
		timestamp: Date.now()
	};
	const reader = response.body.getReader();
	const decoder = new TextDecoder();
	let buffer = "";
	while (true) {
		const { done, value } = await reader.read();
		if (done) break;
		buffer += decoder.decode(value, { stream: true });
		const lines = buffer.split("\n");
		buffer = lines.pop() ?? "";
		for (const line of lines) {
			const trimmed = line.trim();
			if (!trimmed.startsWith("data:")) continue;
			const raw = trimmed.slice(5).trim();
			if (raw === "[DONE]") break;
			try {
				const chunk = JSON.parse(raw);
				const delta = chunk?.choices?.[0]?.delta?.content;
				if (delta) yield {
					type: "TEXT_MESSAGE_CONTENT",
					messageId: msgId,
					delta,
					timestamp: Date.now()
				};
				if (chunk?.choices?.[0]?.finish_reason === "stop") break;
			} catch {}
		}
	}
	yield {
		type: "TEXT_MESSAGE_END",
		messageId: msgId,
		timestamp: Date.now()
	};
	yield {
		type: "RUN_FINISHED",
		threadId,
		runId,
		timestamp: Date.now(),
		finishReason: "stop"
	};
}
function toApiMessages(messages) {
	return messages.filter((m) => m.role === "user" || m.role === "assistant").map((m) => ({
		role: m.role,
		content: typeof m.content === "string" ? m.content : m.content.filter((c) => c.type === "text").map((c) => c.text ?? "").join("")
	}));
}
async function chatHandler(request) {
	if (request.method === "OPTIONS") return new Response(null, { headers: {
		"Access-Control-Allow-Origin": "*",
		"Access-Control-Allow-Methods": "POST, OPTIONS",
		"Access-Control-Allow-Headers": "Content-Type, X-Api-Key, X-Provider, X-Model, X-Azion-Auth-Type"
	} });
	const apiKey = request.headers.get("X-Api-Key")?.trim();
	const provider = request.headers.get("X-Provider")?.trim() ?? "openai";
	const model = request.headers.get("X-Model")?.trim();
	if (!apiKey) return new Response(JSON.stringify({ error: "X-Api-Key header required" }), {
		status: 400,
		headers: { "Content-Type": "application/json" }
	});
	const params = await chatParamsFromRequest(request);
	const threadId = params.threadId ?? generateId();
	const runId = params.runId ?? generateId();
	const resolvedModel = model ?? (provider === "anthropic" ? "claude-haiku-4-5" : "gpt-4o-mini");
	if (provider === "copilot-azion") {
		if (!apiKey) return new Response(JSON.stringify({ error: "X-Api-Key header required (azsid cookie)" }), {
			status: 400,
			headers: { "Content-Type": "application/json" }
		});
		const azionAuthType = request.headers.get("X-Azion-Auth-Type")?.trim() ?? "cookie";
		return toServerSentEventsResponse(azionCopilotStream(toApiMessages(params.messages), apiKey, azionAuthType, threadId, runId), { headers: { "Access-Control-Allow-Origin": "*" } });
	}
	if (provider === "anthropic") return toServerSentEventsResponse(anthropicStream(toApiMessages(params.messages), resolvedModel, apiKey, threadId, runId), { headers: { "Access-Control-Allow-Origin": "*" } });
	return toServerSentEventsResponse(chat({
		adapter: createOpenaiChatCompletions(resolvedModel, apiKey),
		messages: params.messages,
		threadId,
		runId
	}), { headers: { "Access-Control-Allow-Origin": "*" } });
}
var Route = createFileRoute("/api/chat")({ server: { handlers: {
	POST: ({ request }) => chatHandler(request),
	OPTIONS: ({ request }) => chatHandler(request)
} } });
var IndexRoute = Route$2.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$3
});
var ChatIndexRoute = Route$1.update({
	id: "/chat/",
	path: "/chat/",
	getParentRoute: () => Route$3
});
var rootRouteChildren = {
	IndexRoute,
	ApiChatRoute: Route.update({
		id: "/api/chat",
		path: "/api/chat",
		getParentRoute: () => Route$3
	}),
	ChatIndexRoute
};
var routeTree = Route$3._addFileChildren(rootRouteChildren)._addFileTypes();
function getRouter() {
	const queryClient = new QueryClient();
	const router = createRouter({
		routeTree,
		context: { queryClient },
		defaultPreload: "intent",
		defaultErrorComponent: DefaultCatchBoundary,
		defaultNotFoundComponent: () => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NotFound, {})
	});
	setupRouterSsrQueryIntegration({
		router,
		queryClient
	});
	return router;
}
//#endregion
export { getRouter };

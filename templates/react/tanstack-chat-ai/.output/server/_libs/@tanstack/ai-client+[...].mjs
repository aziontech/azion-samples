import { _ as parseWithStandardSchema, d as StreamProcessor, f as uiMessagesToWire, g as isStandardSchema, h as convertSchemaToJsonSchema, l as EventClient, m as normalizeToUIMessage, p as generateMessageId, u as EventType } from "./ai+[...].mjs";
//#region node_modules/.pnpm/@tanstack+ai-event-client@0.5.4_@tanstack+ai@0.28.0/node_modules/@tanstack/ai-event-client/dist/esm/envelope.js
function createRuntimeId() {
	const cryptoLike = globalThis.crypto;
	if (cryptoLike?.randomUUID) return cryptoLike.randomUUID();
	return Math.random().toString(36).slice(2);
}
var memoizedRuntimeId;
function getRuntimeId() {
	if (memoizedRuntimeId !== void 0) return memoizedRuntimeId;
	if (!globalThis.__TANSTACK_AI_DEVTOOLS_RUNTIME_ID__) globalThis.__TANSTACK_AI_DEVTOOLS_RUNTIME_ID__ = createRuntimeId();
	memoizedRuntimeId = globalThis.__TANSTACK_AI_DEVTOOLS_RUNTIME_ID__;
	return memoizedRuntimeId;
}
var eventCounter = 0;
function idPart(value) {
	if (value === void 0 || value === null || value === "") return "missing";
	return `value-${encodeURIComponent(String(value))}`;
}
function createAIDevtoolsEventEnvelope(input) {
	const resolvedRuntimeId = input.runtimeId ?? getRuntimeId();
	const eventId = input.eventId && input.eventId.length > 0 ? input.eventId : [
		input.source,
		input.eventType,
		idPart(resolvedRuntimeId),
		idPart(input.clientId),
		idPart(input.requestId),
		idPart(input.streamId),
		idPart(input.hookId),
		idPart(input.threadId),
		idPart(input.runId),
		idPart(input.messageId),
		idPart(input.toolCallId),
		idPart(input.sequence),
		input.timestamp,
		getRuntimeId(),
		eventCounter++
	].join(":");
	return {
		...input,
		runtimeId: resolvedRuntimeId,
		eventId
	};
}
//#endregion
//#region node_modules/.pnpm/@tanstack+ai-event-client@0.5.4_@tanstack+ai@0.28.0/node_modules/@tanstack/ai-event-client/dist/esm/index.js
var AiEventClient = class extends EventClient {
	constructor() {
		super({ pluginId: "tanstack-ai-devtools" });
	}
};
var aiEventClientKey = /* @__PURE__ */ Symbol.for("tanstack.ai.devtools.eventClient");
function getAiEventClient() {
	const global = globalThis;
	const existing = global[aiEventClientKey];
	if (existing) return existing;
	const eventClient = new AiEventClient();
	global[aiEventClientKey] = eventClient;
	return eventClient;
}
var aiEventClient = getAiEventClient();
function emitAIDevtoolsEvent(eventName, payload) {
	aiEventClient.emit(eventName, payload);
}
//#endregion
//#region node_modules/.pnpm/@tanstack+ai-client@0.16.3/node_modules/@tanstack/ai-client/dist/esm/events.js
var ChatClientEventEmitter = class {
	clientId;
	constructor(clientId) {
		this.clientId = clientId;
	}
	/**
	* Emit client created event
	*/
	clientCreated(initialMessageCount) {
		this.emitEvent("client:created", { initialMessageCount });
	}
	/**
	* Emit loading state changed event
	*/
	loadingChanged(isLoading) {
		this.emitEvent("client:loading:changed", { isLoading });
	}
	/**
	* Emit error state changed event
	*/
	errorChanged(error) {
		this.emitEvent("client:error:changed", { error });
	}
	/**
	* Emit text update events (combines processor and client events)
	*/
	textUpdated(streamId, messageId, content, context) {
		this.emitEvent("text:chunk:content", {
			streamId,
			messageId,
			content,
			...context
		});
	}
	/**
	* Emit tool call state change events (combines processor and client events)
	*/
	toolCallStateChanged(streamId, messageId, toolCallId, toolName, state, args, context) {
		this.emitEvent("tools:call:updated", {
			streamId,
			messageId,
			toolCallId,
			toolName,
			state,
			arguments: args,
			...context
		});
	}
	/**
	* Emit tool result state change event
	*/
	/**
	* Emit thinking update event
	*/
	thinkingUpdated(streamId, messageId, content, delta, context) {
		this.emitEvent("text:chunk:thinking", {
			streamId,
			messageId,
			content,
			delta,
			...context
		});
	}
	structuredOutputChanged(eventName, streamId, messageId, output, context) {
		this.emitEvent(eventName, {
			streamId,
			messageId,
			...output,
			...context
		});
	}
	/**
	* Emit approval requested event
	*/
	approvalRequested(streamId, messageId, toolCallId, toolName, input, approvalId, context) {
		this.emitEvent("tools:approval:requested", {
			streamId,
			messageId,
			toolCallId,
			toolName,
			input,
			approvalId,
			...context
		});
	}
	/**
	* Emit message appended event
	*/
	messageAppended(uiMessage, streamId, context) {
		const content = uiMessage.parts.filter((part) => part.type === "text").map((part) => part.content).join(" ");
		this.emitEvent("text:message:created", {
			streamId,
			messageId: uiMessage.id,
			role: uiMessage.role,
			content,
			parts: uiMessage.parts,
			...context
		});
	}
	/**
	* Emit message sent event.
	* Supports both simple string content and multimodal content arrays.
	*
	* @param messageId - The ID of the sent message
	* @param content - The message content (string or array of ContentPart for multimodal)
	*/
	messageSent(messageId, content) {
		const textContent = typeof content === "string" ? content : content.filter((part) => part.type === "text").map((part) => part.content).join("");
		this.emitEvent("text:message:created", {
			messageId,
			role: "user",
			content: textContent,
			...Array.isArray(content) && { parts: content }
		});
		this.emitEvent("text:message:user", {
			messageId,
			role: "user",
			content: textContent,
			...Array.isArray(content) && { parts: content }
		});
	}
	/**
	* Emit reloaded event
	*/
	reloaded(fromMessageIndex) {
		this.emitEvent("client:reloaded", { fromMessageIndex });
	}
	/**
	* Emit stopped event
	*/
	stopped() {
		this.emitEvent("client:stopped");
	}
	/**
	* Emit messages cleared event
	*/
	messagesCleared() {
		this.emitEvent("client:messages:cleared");
	}
	/**
	* Emit tool result added event
	*/
	toolResultAdded(toolCallId, toolName, output, state, context) {
		this.emitEvent("tools:result:added", {
			toolCallId,
			toolName,
			output,
			state,
			...context
		});
	}
	/**
	* Emit tool approval responded event
	*/
	toolApprovalResponded(approvalId, toolCallId, approved, context) {
		this.emitEvent("tools:approval:responded", {
			approvalId,
			toolCallId,
			approved,
			...context
		});
	}
	/**
	* Emit tool fixture applied event.
	*/
	toolFixtureApplied(fixture) {
		this.emitEvent("devtools:tool-fixture:applied", { ...fixture });
	}
};
var DefaultChatClientEventEmitter = class extends ChatClientEventEmitter {
	/**
	* Emit an event with automatic clientId and timestamp for client/tool events
	*/
	emitEvent(eventName, data) {
		const timestamp = Date.now();
		const isUserVisibleEvent = eventName.startsWith("text:") || eventName.startsWith("tools:") || eventName.startsWith("structured-output:") || eventName === "devtools:tool-fixture:applied";
		const includesClientContext = eventName.startsWith("client:") || eventName.startsWith("tools:") || eventName.startsWith("text:") || eventName.startsWith("structured-output:") || eventName === "devtools:tool-fixture:applied";
		const visibility = isUserVisibleEvent ? "user-visible" : "client-state";
		const envelopeContext = {
			hookId: this.clientId,
			...typeof data?.threadId === "string" ? { threadId: data.threadId } : {},
			...typeof data?.runId === "string" ? { runId: data.runId } : {},
			...typeof data?.streamId === "string" ? { streamId: data.streamId } : {},
			...typeof data?.messageId === "string" ? { messageId: data.messageId } : {},
			...typeof data?.toolCallId === "string" ? { toolCallId: data.toolCallId } : {}
		};
		if (includesClientContext) {
			const envelope = createAIDevtoolsEventEnvelope({
				eventType: eventName,
				clientId: this.clientId,
				...envelopeContext,
				source: "client",
				visibility,
				timestamp
			});
			aiEventClient.emit(eventName, {
				...data,
				...envelope
			});
		} else {
			const envelope = createAIDevtoolsEventEnvelope({
				eventType: eventName,
				source: "client",
				visibility: "client-state",
				timestamp
			});
			aiEventClient.emit(eventName, {
				...data,
				...envelope
			});
		}
	}
};
//#endregion
//#region node_modules/.pnpm/@tanstack+ai-client@0.16.3/node_modules/@tanstack/ai-client/dist/esm/devtools-noop.js
var NoOpChatClientEventEmitter = class extends ChatClientEventEmitter {
	emitEvent() {}
};
var NoOpChatDevtoolsBridge = class {
	events;
	constructor(options) {
		this.events = new NoOpChatClientEventEmitter(options.clientId);
	}
	emitRegistered() {}
	emitUpdated() {}
	emitSnapshot() {}
	emitToolsRegistered() {}
	emitRunLifecycle(_eventType, _runId, _status, _options) {}
	deactivate() {}
	supersede() {}
	dispose() {}
	setCurrentStreamId(_streamId) {}
	getCurrentStreamId() {
		return null;
	}
	getLastStreamId() {
		return null;
	}
	resolveStreamId() {
		return "";
	}
	observeChunk(_chunk) {}
	beginRun(_runId, _threadId) {}
	getCurrentRunEventContext() {}
	getCurrentOrLastRunEventContext() {}
	findToolCallContext(toolCallId) {
		return { toolCallId };
	}
	async applyFixture(_fixture) {}
};
var createNoOpChatDevtoolsBridge = (options) => new NoOpChatDevtoolsBridge(options);
//#endregion
//#region node_modules/.pnpm/@tanstack+ai-client@0.16.3/node_modules/@tanstack/ai-client/dist/esm/response-stream.js
var UnsupportedResponseStreamError = class extends Error {
	missingFeature;
	constructor(missingFeature) {
		super(createUnsupportedResponseStreamMessage(missingFeature));
		this.name = "UnsupportedResponseStreamError";
		this.missingFeature = missingFeature;
	}
};
function createUnsupportedResponseStreamMessage(missingFeature) {
	return `Streaming fetch responses are not supported in this runtime because ${missingFeature} is unavailable. React Native users need a compatible fetch/stream/TextDecoder polyfill, or should use a fetch, XHR, or custom transport that can deliver streaming chunks.`;
}
function getResponseStreamReader(response) {
	if (!response.body) throw new UnsupportedResponseStreamError("Response.body");
	if (typeof response.body.getReader !== "function") throw new UnsupportedResponseStreamError("Response.body.getReader");
	return response.body.getReader();
}
function createResponseStreamTextDecoder() {
	if (typeof globalThis.TextDecoder !== "function") throw new UnsupportedResponseStreamError("TextDecoder");
	return new globalThis.TextDecoder();
}
//#endregion
//#region node_modules/.pnpm/@tanstack+ai-client@0.16.3/node_modules/@tanstack/ai-client/dist/esm/sse-utils.js
function parseSseDataLine(line) {
	if (!line.startsWith("data:")) return line;
	const data = line.slice(5);
	return data.startsWith(" ") ? data.slice(1) : data;
}
//#endregion
//#region node_modules/.pnpm/@tanstack+ai-client@0.16.3/node_modules/@tanstack/ai-client/dist/esm/connection-adapters.js
var chunkRunIds = /* @__PURE__ */ new WeakMap();
function getChunkRunId(chunk) {
	return "runId" in chunk && typeof chunk.runId === "string" ? chunk.runId : chunkRunIds.get(chunk);
}
var StreamTruncatedError = class extends Error {
	constructor() {
		super("Stream ended with unterminated trailing data — connection was likely cut short.");
		this.name = "StreamTruncatedError";
	}
};
function generateRunId(prefix) {
	return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}
function requireSyntheticId(value, field) {
	if (!value) throw new Error(`Cannot synthesize terminal event: ${field} not supplied via runContext and not observed in the upstream stream.`);
	return value;
}
function mergeHeaders(customHeaders) {
	if (!customHeaders) return {};
	if (customHeaders instanceof Headers) {
		const result = {};
		customHeaders.forEach((value, key) => {
			result[key] = value;
		});
		return result;
	}
	return customHeaders;
}
async function* readStreamLines(reader, abortSignal) {
	try {
		const decoder = createResponseStreamTextDecoder();
		let buffer = "";
		while (!abortSignal?.aborted) {
			const { done, value } = await reader.read();
			if (done) break;
			buffer += decoder.decode(value, { stream: true });
			const lines = buffer.split("\n");
			buffer = lines.pop() || "";
			for (const line of lines) if (line.trim()) yield line;
		}
		if (buffer.trim() && !abortSignal?.aborted) throw new StreamTruncatedError();
	} finally {
		reader.releaseLock();
	}
}
async function* responseToSSEChunks(response, abortSignal) {
	if (!response.ok) throw new Error(`HTTP error! status: ${response.status} ${response.statusText}`);
	const reader = getResponseStreamReader(response);
	let lastThreadId;
	let lastRunId;
	let lastModel;
	for await (const line of readStreamLines(reader, abortSignal)) {
		if (line.startsWith(":") || line.startsWith("event:") || line.startsWith("id:") || line.startsWith("retry:")) continue;
		const data = parseSseDataLine(line);
		if (data === "[DONE]") {
			yield {
				type: EventType.RUN_FINISHED,
				threadId: lastThreadId ?? "",
				runId: lastRunId ?? "",
				model: lastModel ?? "",
				timestamp: Date.now(),
				finishReason: "stop"
			};
			return;
		}
		const chunk = JSON.parse(data);
		if ("threadId" in chunk && typeof chunk.threadId === "string") lastThreadId = chunk.threadId;
		if ("runId" in chunk && typeof chunk.runId === "string") lastRunId = chunk.runId;
		if ("model" in chunk && typeof chunk.model === "string") lastModel = chunk.model;
		yield chunk;
	}
}
function normalizeConnectionAdapter(connection) {
	if (!connection) throw new Error("Connection adapter is required");
	const hasConnect = "connect" in connection;
	const hasSubscribe = "subscribe" in connection;
	const hasSend = "send" in connection;
	if (hasConnect && (hasSubscribe || hasSend)) throw new Error("Connection adapter must provide either connect or both subscribe and send, not both modes");
	if (hasSubscribe && hasSend) return {
		subscribe: connection.subscribe.bind(connection),
		send: connection.send.bind(connection)
	};
	if (!hasConnect) throw new Error("Connection adapter must provide either connect or both subscribe and send");
	let activeBuffer = [];
	let activeWaiters = [];
	function push(chunk, runId) {
		if (runId) chunkRunIds.set(chunk, runId);
		const waiter = activeWaiters.shift();
		if (waiter) waiter(chunk);
		else activeBuffer.push(chunk);
	}
	return {
		subscribe(abortSignal) {
			const myBuffer = activeBuffer.splice(0);
			const myWaiters = [];
			activeBuffer = myBuffer;
			activeWaiters = myWaiters;
			return (async function* () {
				while (!abortSignal?.aborted) {
					let chunk;
					const buffered = myBuffer.shift();
					if (buffered !== void 0) chunk = buffered;
					else chunk = await new Promise((resolve) => {
						const onAbort = () => resolve(null);
						myWaiters.push((c) => {
							abortSignal?.removeEventListener("abort", onAbort);
							resolve(c);
						});
						abortSignal?.addEventListener("abort", onAbort, { once: true });
					});
					if (chunk !== null) yield chunk;
				}
			})();
		},
		async send(messages, data, abortSignal, runContext) {
			let hasTerminalEvent = false;
			let upstreamThreadId;
			let upstreamRunId;
			try {
				const stream2 = connection.connect(messages, data, abortSignal, runContext);
				for await (const chunk of stream2) {
					if ("threadId" in chunk && typeof chunk.threadId === "string") upstreamThreadId = chunk.threadId;
					if ("runId" in chunk && typeof chunk.runId === "string") upstreamRunId = chunk.runId;
					if (chunk.type === "RUN_FINISHED" || chunk.type === "RUN_ERROR") hasTerminalEvent = true;
					push(chunk, runContext?.runId);
				}
				if (!abortSignal?.aborted && !hasTerminalEvent) push({
					type: EventType.RUN_FINISHED,
					threadId: requireSyntheticId(upstreamThreadId ?? runContext?.threadId, "threadId"),
					runId: requireSyntheticId(upstreamRunId ?? runContext?.runId, "runId"),
					model: "connect-wrapper",
					timestamp: Date.now(),
					finishReason: "stop"
				});
			} catch (err) {
				if (!abortSignal?.aborted && !hasTerminalEvent) {
					const message = err instanceof Error ? err.message : "Unknown error in connect()";
					push({
						type: EventType.RUN_ERROR,
						threadId: requireSyntheticId(upstreamThreadId ?? runContext?.threadId, "threadId"),
						runId: requireSyntheticId(upstreamRunId ?? runContext?.runId, "runId"),
						timestamp: Date.now(),
						message
					});
				}
				throw err;
			}
		}
	};
}
function buildRunAgentInputBody(messages, data, runContext, options) {
	const wireMessages = uiMessagesToWire(messages);
	const forwardedProps = {
		...options.body,
		...runContext?.forwardedProps ?? {},
		...data
	};
	return {
		threadId: runContext?.threadId ?? generateRunId("thread"),
		runId: runContext?.runId ?? generateRunId("run"),
		...runContext?.parentRunId !== void 0 && { parentRunId: runContext.parentRunId },
		state: {},
		messages: wireMessages,
		tools: runContext?.clientTools ?? [],
		context: [],
		forwardedProps,
		data: { ...forwardedProps }
	};
}
function fetchServerSentEvents(url, options = {}) {
	return { async *connect(messages, data, abortSignal, runContext) {
		const resolvedUrl = typeof url === "function" ? url() : url;
		const resolvedOptions = typeof options === "function" ? await options() : options;
		const requestHeaders = {
			"Content-Type": "application/json",
			...mergeHeaders(resolvedOptions.headers)
		};
		const requestBody = buildRunAgentInputBody(messages, data, runContext, resolvedOptions);
		const fetchClient = resolvedOptions.fetchClient ?? fetch;
		const signal = abortSignal || resolvedOptions.signal;
		yield* responseToSSEChunks(await fetchClient(resolvedUrl, {
			method: "POST",
			headers: requestHeaders,
			body: JSON.stringify(requestBody),
			credentials: resolvedOptions.credentials || "same-origin",
			...signal ? { signal } : {}
		}), abortSignal);
	} };
}
function fetcherToConnectionAdapter(fetcher) {
	return { async *connect(messages, data, abortSignal, runContext) {
		if (!abortSignal) throw new Error("fetcherToConnectionAdapter requires an AbortSignal — the chat client always supplies one.");
		if (!runContext) throw new Error("fetcherToConnectionAdapter requires a RunAgentInputContext — the chat client always supplies one.");
		const result = await fetcher({
			messages,
			data,
			threadId: runContext.threadId,
			runId: runContext.runId
		}, { signal: abortSignal });
		if (result instanceof Response) yield* responseToSSEChunks(result, abortSignal);
		else yield* abortableIterable(result, abortSignal);
	} };
}
async function* abortableIterable(iterable, signal) {
	if (signal.aborted) return;
	const iterator = iterable[Symbol.asyncIterator]();
	const abortPromise = new Promise((resolve) => {
		signal.addEventListener("abort", () => resolve({
			done: true,
			value: void 0
		}), { once: true });
	});
	try {
		while (true) {
			const result = await Promise.race([iterator.next(), abortPromise]);
			if (result.done) return;
			yield result.value;
		}
	} finally {
		await iterator.return?.();
	}
}
//#endregion
//#region node_modules/.pnpm/@tanstack+ai-client@0.16.3/node_modules/@tanstack/ai-client/dist/esm/client-persistor.js
function getChunkToolCallId(chunk) {
	return "toolCallId" in chunk && typeof chunk.toolCallId === "string" ? chunk.toolCallId : void 0;
}
function getChunkMessageId(chunk) {
	return "messageId" in chunk && typeof chunk.messageId === "string" ? chunk.messageId : void 0;
}
function getChunkParentMessageId(chunk) {
	return "parentMessageId" in chunk && typeof chunk.parentMessageId === "string" ? chunk.parentMessageId : void 0;
}
var ChatPersistor = class {
	constructor(adapter, id, applyMessages) {
		this.adapter = adapter;
		this.id = id;
		this.applyMessages = applyMessages;
	}
	adapter;
	id;
	applyMessages;
	skipNextPersist = false;
	generation = 0;
	queue = Promise.resolve();
	queuePending = false;
	messagesGeneration = 0;
	clearedMessageIds = /* @__PURE__ */ new Set();
	clearedRunIds = /* @__PURE__ */ new Set();
	ignoredActiveRunIds = /* @__PURE__ */ new Set();
	clearedToolCallIds = /* @__PURE__ */ new Set();
	currentRunlessRunId = null;
	/**
	* Synchronously read the persisted messages for constructor-time hydration.
	* Returns the raw `getItem` result (which may be a promise for async stores).
	*/
	readInitial() {
		try {
			return this.adapter.getItem(this.id);
		} catch {
			return;
		}
	}
	/**
	* Apply messages from an async `getItem` once it resolves, unless the message
	* list has already changed since hydration began.
	*/
	hydrateAsync(persistedMessages) {
		if (!(persistedMessages instanceof Promise)) return;
		const hydrationGeneration = this.messagesGeneration;
		persistedMessages.then((messages) => {
			if (Array.isArray(messages) && this.messagesGeneration === hydrationGeneration) this.applyMessages(messages);
		}).catch(() => {});
	}
	/**
	* Record a message-list change and queue a `setItem` write for it. Skips a
	* single write after {@link beginClear} so the clear's empty snapshot isn't
	* persisted between `clearMessages()` and {@link remove}.
	*/
	notifyMessagesChanged(messages) {
		this.messagesGeneration++;
		if (this.skipNextPersist) {
			this.skipNextPersist = false;
			return;
		}
		const generation = this.generation;
		const messagesSnapshot = [...messages];
		this.runOperation(() => {
			if (generation !== this.generation) return;
			return this.adapter.setItem(this.id, messagesSnapshot);
		});
	}
	/** Remove the persisted conversation. Invalidates any queued writes. */
	remove() {
		const generation = ++this.generation;
		this.runOperation(() => {
			if (generation !== this.generation) return;
			return this.adapter.removeItem(this.id);
		});
	}
	runOperation(operation) {
		if (this.queuePending) {
			const queued = this.queue.then(operation).catch(() => {});
			this.queue = queued;
			queued.finally(() => {
				if (this.queue === queued) this.queuePending = false;
			});
			return;
		}
		try {
			const result = operation();
			if (result instanceof Promise) {
				this.queuePending = true;
				const queued = result.catch(() => {});
				this.queue = queued;
				queued.finally(() => {
					if (this.queue === queued) this.queuePending = false;
				});
			}
		} catch {}
	}
	/**
	* Capture the message/run ids that exist at the moment of a clear so chunks
	* still arriving for them can be ignored.
	*/
	snapshotClear(context) {
		for (const message of context.messages) this.clearedMessageIds.add(message.id);
		for (const runId of context.activeRunIds) {
			this.clearedRunIds.add(runId);
			this.ignoredActiveRunIds.add(runId);
		}
		if (context.currentRunId) {
			this.clearedRunIds.add(context.currentRunId);
			this.ignoredActiveRunIds.add(context.currentRunId);
		}
	}
	/** Mark that the next persisted message change (the clear itself) is skipped. */
	beginClear() {
		this.skipNextPersist = true;
	}
	/** Whether a chunk belongs to cleared state and should not be processed. */
	shouldIgnoreChunk(chunk) {
		const runId = getChunkRunId(chunk);
		if (runId && this.clearedRunIds.has(runId)) {
			if (chunk.type === "RUN_STARTED") {
				this.ignoredActiveRunIds.add(runId);
				this.currentRunlessRunId = runId;
			}
			this.markIgnoredChunkIds(chunk);
			return true;
		}
		if (runId && this.ignoredActiveRunIds.has(runId)) {
			this.markIgnoredChunkIds(chunk);
			return true;
		}
		if (this.isRunlessChunkFromIgnoredRun(chunk)) {
			this.markIgnoredChunkIds(chunk);
			return true;
		}
		const toolCallId = getChunkToolCallId(chunk);
		if (toolCallId && this.clearedToolCallIds.has(toolCallId)) return true;
		const parentMessageId = getChunkParentMessageId(chunk);
		if (parentMessageId && this.clearedMessageIds.has(parentMessageId)) {
			if (toolCallId) this.clearedToolCallIds.add(toolCallId);
			return true;
		}
		const messageId = getChunkMessageId(chunk);
		if (!messageId) return false;
		if (this.clearedMessageIds.has(messageId)) return true;
		return false;
	}
	/**
	* The owning client calls this when a run starts so runless content chunks
	* (adapters that omit `runId` on content events) can be attributed to it.
	*/
	onRunStarted(runId) {
		this.currentRunlessRunId = runId;
	}
	/** Forget a settled run, advancing the runless pointer to another ignored run. */
	onRunSettled(runId) {
		this.ignoredActiveRunIds.delete(runId);
		this.clearedRunIds.delete(runId);
		if (this.currentRunlessRunId === runId) this.currentRunlessRunId = this.ignoredActiveRunIds.values().next().value ?? null;
	}
	/** A session-level (runId-less) RUN_ERROR clears all ignored-run tracking. */
	onSessionRunError() {
		this.ignoredActiveRunIds.clear();
		this.currentRunlessRunId = null;
	}
	/** Clear the ignored-active-run markers (mirrors a session-generating reset). */
	resetIgnored() {
		this.ignoredActiveRunIds.clear();
	}
	/**
	* Consume the current runless run id (if any), forgetting it. Used when an
	* ignored, runId-less RUN_ERROR drains the run the client is still tracking.
	*/
	takeRunlessRunId() {
		const runId = this.currentRunlessRunId;
		if (!runId) return null;
		this.ignoredActiveRunIds.delete(runId);
		this.clearedRunIds.delete(runId);
		this.currentRunlessRunId = this.ignoredActiveRunIds.values().next().value ?? null;
		return runId;
	}
	markIgnoredChunkIds(chunk) {
		const messageId = getChunkMessageId(chunk);
		if (messageId) this.clearedMessageIds.add(messageId);
		const toolCallId = getChunkToolCallId(chunk);
		if (toolCallId) this.clearedToolCallIds.add(toolCallId);
	}
	isRunlessChunkFromIgnoredRun(chunk) {
		if (getChunkRunId(chunk) || !this.currentRunlessRunId) return false;
		if (!this.ignoredActiveRunIds.has(this.currentRunlessRunId) && !this.clearedRunIds.has(this.currentRunlessRunId)) return false;
		return chunk.type === "TEXT_MESSAGE_START" || chunk.type === "TEXT_MESSAGE_CONTENT" || chunk.type === "TOOL_CALL_START" || chunk.type === "TOOL_CALL_ARGS" || chunk.type === "TOOL_CALL_END" || chunk.type === "TOOL_CALL_RESULT" || chunk.type === "MESSAGES_SNAPSHOT" || chunk.type === "RUN_ERROR";
	}
};
//#endregion
//#region node_modules/.pnpm/@tanstack+ai-client@0.16.3/node_modules/@tanstack/ai-client/dist/esm/chat-client.js
function resolveTransport(transport) {
	const { connection, fetcher } = transport;
	if (connection && fetcher) throw new Error("ChatClient: pass either `connection` or `fetcher`, not both.");
	if (connection) return connection;
	if (fetcher) return fetcherToConnectionAdapter(fetcher);
	throw new Error("ChatClient: either `connection` or `fetcher` is required.");
}
var ChatClient = class {
	processor;
	connection;
	uniqueId;
	threadId;
	persistor;
	currentRunId = null;
	bodyOption = {};
	forwardedPropsOption = {};
	context = void 0;
	pendingMessageBody = void 0;
	isLoading = false;
	isSubscribed = false;
	error = void 0;
	status = "ready";
	connectionStatus = "disconnected";
	abortController = null;
	clientToolsRef;
	devtoolsBridge;
	/**
	* Alias for `this.events`. The bridge installs an
	* emitter that auto-attaches run/thread context and auto-emits a
	* snapshot after every event, so chat-client only ever calls
	* `this.events.X(...)` exactly like it did before devtools landed.
	*/
	events;
	currentStreamId = null;
	currentMessageId = null;
	postStreamActions = [];
	pendingToolExecutions = /* @__PURE__ */ new Map();
	activeClientTools = null;
	activeContext = void 0;
	continuationPending = false;
	subscriptionAbortController = null;
	processingResolve = null;
	errorReportedGeneration = null;
	streamGeneration = 0;
	continuationSkipped = false;
	draining = false;
	sessionGenerating = false;
	activeRunIds = /* @__PURE__ */ new Set();
	devtoolsMounted = false;
	callbacksRef;
	constructor(options) {
		this.uniqueId = options.id || this.generateUniqueId("chat");
		this.threadId = options.threadId || this.generateUniqueId("thread");
		if (options.persistence) this.persistor = new ChatPersistor(options.persistence, this.uniqueId, (messages) => this.processor.setMessages(messages));
		this.bodyOption = options.body || {};
		this.forwardedPropsOption = options.forwardedProps || {};
		this.context = options.context;
		this.connection = normalizeConnectionAdapter(resolveTransport(options));
		this.clientToolsRef = { current: /* @__PURE__ */ new Map() };
		if (options.tools) for (const tool of options.tools) this.clientToolsRef.current.set(tool.name, tool);
		this.devtoolsBridge = (options.devtoolsBridgeFactory ?? createNoOpChatDevtoolsBridge)(this.buildDevtoolsBridgeOptions(options.devtools));
		this.events = this.devtoolsBridge.events;
		this.callbacksRef = { current: {
			onResponse: options.onResponse || (() => {}),
			onChunk: options.onChunk || (() => {}),
			onFinish: options.onFinish || (() => {}),
			onError: options.onError || (() => {}),
			onMessagesChange: options.onMessagesChange || (() => {}),
			onLoadingChange: options.onLoadingChange || (() => {}),
			onErrorChange: options.onErrorChange || (() => {}),
			onStatusChange: options.onStatusChange || (() => {}),
			onSubscriptionChange: options.onSubscriptionChange || (() => {}),
			onConnectionStatusChange: options.onConnectionStatusChange || (() => {}),
			onSessionGeneratingChange: options.onSessionGeneratingChange || (() => {}),
			onCustomEvent: options.onCustomEvent || (() => {})
		} };
		const persistedMessages = this.persistor?.readInitial();
		const initialMessages = Array.isArray(persistedMessages) ? persistedMessages : options.initialMessages;
		this.processor = new StreamProcessor({
			...options.streamProcessor?.chunkStrategy ? { chunkStrategy: options.streamProcessor.chunkStrategy } : {},
			...initialMessages ? { initialMessages } : {},
			events: {
				onMessagesChange: (messages) => {
					this.persistor?.notifyMessagesChanged(messages);
					this.callbacksRef.current.onMessagesChange(messages);
				},
				onStreamStart: () => {
					this.setStatus("streaming");
					const assistantMessageId = this.processor.getCurrentAssistantMessageId();
					if (!assistantMessageId) return;
					const assistantMessage = this.processor.getMessages().find((m) => m.id === assistantMessageId);
					if (assistantMessage) {
						this.currentMessageId = assistantMessage.id;
						this.events.messageAppended(assistantMessage, this.currentStreamId || void 0);
					}
				},
				onStreamEnd: (message) => {
					this.callbacksRef.current.onFinish(message);
					this.setStatus("ready");
					this.resolveProcessing();
				},
				onError: (error) => {
					this.reportStreamError(error);
				},
				onTextUpdate: (messageId, content) => {
					if (this.currentStreamId) this.events.textUpdated(this.currentStreamId, messageId, content);
				},
				onThinkingUpdate: (messageId, content) => {
					if (this.currentStreamId) this.events.thinkingUpdated(this.currentStreamId, messageId, content, void 0);
				},
				onStructuredOutputChange: (args) => {
					const streamId = this.devtoolsBridge.resolveStreamId();
					const eventName = args.phase === "start" ? "structured-output:started" : args.phase === "complete" ? "structured-output:completed" : args.phase === "error" ? "structured-output:errored" : "structured-output:updated";
					this.currentMessageId = args.messageId;
					this.events.structuredOutputChanged(eventName, streamId, args.messageId, {
						status: args.status,
						raw: args.raw,
						...args.partial !== void 0 ? { partial: args.partial } : {},
						...args.data !== void 0 ? { data: args.data } : {},
						...args.reasoning !== void 0 ? { reasoning: args.reasoning } : {},
						...args.errorMessage !== void 0 ? { errorMessage: args.errorMessage } : {},
						...args.delta !== void 0 ? { delta: args.delta } : {}
					});
				},
				onToolCallStateChange: (messageId, toolCallId, state, args) => {
					const toolName = (this.processor.getMessages().find((m) => m.id === messageId)?.parts.find((p) => p.type === "tool-call" && p.id === toolCallId))?.name || "unknown";
					if (this.currentStreamId) this.events.toolCallStateChanged(this.currentStreamId, messageId, toolCallId, toolName, state, args);
				},
				onToolCall: (args) => {
					const clientTool = (this.activeClientTools ?? this.clientToolsRef.current).get(args.toolName);
					const executeFunc = clientTool?.execute;
					if (executeFunc) {
						const runEventContext = this.devtoolsBridge.getCurrentRunEventContext();
						const executionPromise = (async () => {
							try {
								const context = this.activeClientTools === null ? this.context : this.activeContext;
								const output = await executeFunc(args.input, {
									toolCallId: args.toolCallId,
									context,
									emitCustomEvent: () => {}
								});
								await this.addToolResultForClientTool({
									toolCallId: args.toolCallId,
									tool: args.toolName,
									output,
									state: "output-available"
								}, clientTool, runEventContext);
							} catch (error) {
								await this.addToolResultForClientTool({
									toolCallId: args.toolCallId,
									tool: args.toolName,
									output: null,
									state: "output-error",
									errorText: error.message
								}, clientTool, runEventContext);
							} finally {
								this.pendingToolExecutions.delete(args.toolCallId);
							}
						})();
						this.pendingToolExecutions.set(args.toolCallId, executionPromise);
					}
				},
				onApprovalRequest: (args) => {
					const streamId = this.devtoolsBridge.resolveStreamId();
					const messageIdForApproval = this.findMessageIdForToolCall(args.toolCallId) ?? this.currentMessageId ?? "";
					this.events.approvalRequested(streamId, messageIdForApproval, args.toolCallId, args.toolName, args.input, args.approvalId);
				},
				onCustomEvent: (eventType, data, context) => {
					this.callbacksRef.current.onCustomEvent(eventType, data, context);
				}
			}
		});
		this.persistor?.hydrateAsync(persistedMessages);
	}
	mountDevtools() {
		if (this.devtoolsMounted) return;
		this.devtoolsMounted = true;
		this.devtoolsBridge.mountWithTools(this.processor.getMessages().length);
	}
	/**
	* Drain a runId-less RUN_ERROR that belongs to a cleared run the client is
	* still tracking. The persistor owns the cleared-run bookkeeping; the client
	* owns the active-run / session / processing state.
	*/
	drainIgnoredRunlessChunk(chunk) {
		if (chunk.type !== "RUN_ERROR") return;
		const runId = this.persistor?.takeRunlessRunId();
		if (!runId) return;
		this.activeRunIds.delete(runId);
		this.setSessionGenerating(this.activeRunIds.size > 0);
		this.resolveProcessing();
	}
	updateRunLifecycle(chunk, options) {
		if (chunk.type === "RUN_STARTED") {
			const chunkRunId = getChunkRunId(chunk) ?? chunk.runId;
			this.activeRunIds.add(chunkRunId);
			this.persistor?.onRunStarted(chunkRunId);
			this.setSessionGenerating(true);
			return;
		}
		if (chunk.type !== "RUN_FINISHED" && chunk.type !== "RUN_ERROR") return;
		const runId = getChunkRunId(chunk);
		if (runId) {
			this.activeRunIds.delete(runId);
			this.persistor?.onRunSettled(runId);
		} else if (chunk.type === "RUN_ERROR") {
			this.activeRunIds.clear();
			this.persistor?.onSessionRunError();
		}
		this.setSessionGenerating(this.activeRunIds.size > 0);
		if (options?.resolveProcessing !== false) this.resolveProcessing();
	}
	generateUniqueId(prefix) {
		return `${prefix}-${Date.now()}-${Math.random().toString(36).substring(7)}`;
	}
	setIsLoading(isLoading) {
		this.isLoading = isLoading;
		this.callbacksRef.current.onLoadingChange(isLoading);
		this.events.loadingChanged(isLoading);
	}
	setStatus(status) {
		this.status = status;
		this.callbacksRef.current.onStatusChange(status);
		this.devtoolsBridge.emitSnapshot();
	}
	setIsSubscribed(isSubscribed) {
		this.isSubscribed = isSubscribed;
		this.callbacksRef.current.onSubscriptionChange(isSubscribed);
		this.devtoolsBridge.emitSnapshot();
	}
	setConnectionStatus(status) {
		this.connectionStatus = status;
		this.callbacksRef.current.onConnectionStatusChange(status);
		this.devtoolsBridge.emitSnapshot();
	}
	setSessionGenerating(isGenerating) {
		if (this.sessionGenerating === isGenerating) return;
		this.sessionGenerating = isGenerating;
		this.callbacksRef.current.onSessionGeneratingChange(isGenerating);
		this.devtoolsBridge.emitSnapshot();
	}
	resetSessionGenerating() {
		this.activeRunIds.clear();
		this.persistor?.resetIgnored();
		this.setSessionGenerating(false);
	}
	setError(error) {
		this.error = error;
		this.callbacksRef.current.onErrorChange(error);
		this.events.errorChanged(error?.message || null);
	}
	buildDevtoolsBridgeOptions(devtools) {
		return {
			hookId: this.uniqueId,
			clientId: this.uniqueId,
			threadId: this.threadId,
			metadata: {
				hookName: devtools?.hookName ?? "useChat",
				outputKind: devtools?.outputKind ?? "chat",
				...devtools?.framework ? { framework: devtools.framework } : {},
				...devtools?.name ? { name: devtools.name } : {}
			},
			getSnapshot: () => this.getDevtoolsSnapshot(),
			getTools: () => this.clientToolsRef.current.values(),
			getMessages: () => this.processor.getMessages(),
			setMessages: (messages) => {
				this.processor.setMessages(messages);
			},
			addToolResult: (toolCallId, output, errorText) => {
				this.processor.addToolResult(toolCallId, output, errorText);
			},
			generateId: (prefix) => this.generateUniqueId(prefix)
		};
	}
	getDevtoolsSnapshot() {
		return {
			messages: this.processor.getMessages(),
			status: this.status,
			isLoading: this.isLoading,
			isSubscribed: this.isSubscribed,
			connectionStatus: this.connectionStatus,
			sessionGenerating: this.sessionGenerating,
			activeRunIds: Array.from(this.activeRunIds),
			...this.error ? { error: this.error.message } : {}
		};
	}
	findMessageIdForToolCall(toolCallId) {
		const messages = this.processor.getMessages();
		for (const message of messages) if (message.parts.find((part) => part.type === "tool-call" && part.id === toolCallId)) return message.id;
	}
	abortSubscriptionLoop() {
		this.subscriptionAbortController?.abort();
		this.subscriptionAbortController = null;
	}
	resolveProcessing() {
		this.processingResolve?.();
		this.processingResolve = null;
	}
	cancelInFlightStream(options) {
		this.abortController?.abort();
		this.abortController = null;
		if (options?.abortSubscription) this.abortSubscriptionLoop();
		this.resolveProcessing();
		this.setIsLoading(false);
		if (options?.setReadyStatus) this.setStatus("ready");
	}
	reportStreamError(error) {
		const alreadyReported = this.errorReportedGeneration === this.streamGeneration;
		this.setError(error);
		if (this.isLoading || this.status === "submitted" || this.status === "streaming") this.setStatus("error");
		if (!alreadyReported) {
			this.errorReportedGeneration = this.streamGeneration;
			this.callbacksRef.current.onError(error);
		}
	}
	/**
	* Start the background subscription loop.
	*/
	startSubscription() {
		this.subscriptionAbortController = new AbortController();
		const signal = this.subscriptionAbortController.signal;
		this.consumeSubscription(signal).catch((err) => {
			if (err instanceof Error && err.name !== "AbortError") {
				this.setConnectionStatus("error");
				this.resetSessionGenerating();
				this.setIsSubscribed(false);
				this.reportStreamError(err);
			}
			this.resolveProcessing();
		}).finally(() => {
			if (this.subscriptionAbortController?.signal !== signal) return;
			this.subscriptionAbortController = null;
			if (!signal.aborted && this.isSubscribed) {
				this.setIsSubscribed(false);
				if (this.connectionStatus !== "error") this.setConnectionStatus("disconnected");
			}
		});
	}
	/**
	* Consume chunks from the connection subscription.
	*/
	async consumeSubscription(signal) {
		const stream = this.connection.subscribe(signal);
		for await (const chunk of stream) {
			if (signal.aborted) break;
			if (this.connectionStatus === "connecting") this.setConnectionStatus("connected");
			if (this.persistor?.shouldIgnoreChunk(chunk) ?? false) {
				if (chunk.type === "RUN_FINISHED" || chunk.type === "RUN_ERROR") if (getChunkRunId(chunk)) this.updateRunLifecycle(chunk, { resolveProcessing: false });
				else this.drainIgnoredRunlessChunk(chunk);
				continue;
			}
			this.callbacksRef.current.onChunk(chunk);
			this.devtoolsBridge.observeChunk(chunk);
			this.processor.processChunk(chunk);
			this.updateRunLifecycle(chunk);
			await new Promise((resolve) => setTimeout(resolve, 0));
		}
	}
	/**
	* Ensure subscription loop is running, starting it if needed.
	*/
	ensureSubscription() {
		if (!this.isSubscribed) {
			this.subscribe();
			return;
		}
		if (!this.subscriptionAbortController || this.subscriptionAbortController.signal.aborted) this.subscribe({ restart: true });
	}
	/**
	* Create a promise that resolves when onStreamEnd fires.
	* Used by streamResponse to await processing completion.
	*/
	waitForProcessing() {
		this.resolveProcessing();
		return new Promise((resolve) => {
			this.processingResolve = resolve;
		});
	}
	/**
	* Send a message and stream the response.
	* Supports both simple string content and multimodal content (images, audio, video, documents).
	*
	* @param content - The message content. Can be:
	*   - A simple string for text-only messages
	*   - A MultimodalContent object with content array and optional custom ID
	* @param body - Optional body parameters to merge with the client's base body for this request.
	*               Uses shallow merge with per-message body taking priority.
	*
	* @example
	* ```ts
	* // Simple text message
	* await client.sendMessage('Hello!')
	*
	* // Text message with custom body params
	* await client.sendMessage('Hello!', { temperature: 0.7 })
	*
	* // Multimodal message with image
	* await client.sendMessage({
	*   content: [
	*     { type: 'text', content: 'What is in this image?' },
	*     { type: 'image', source: { type: 'url', value: 'https://example.com/photo.jpg' } }
	*   ]
	* })
	*
	* // Multimodal message with custom ID and body params
	* await client.sendMessage(
	*   {
	*     content: [
	*       { type: 'text', content: 'Describe this audio' },
	*       { type: 'audio', source: { type: 'data', value: 'base64...' } }
	*     ],
	*     id: 'custom-message-id'
	*   },
	*   { model: 'gpt-4-audio' }
	* )
	* ```
	*/
	async sendMessage(content, body) {
		this.mountDevtools();
		if (typeof content === "string" && !content.trim() || this.isLoading) return;
		const normalizedContent = this.normalizeMessageInput(content);
		this.pendingMessageBody = body;
		const userMessage = this.processor.addUserMessage(normalizedContent.content, normalizedContent.id);
		this.events.messageSent(userMessage.id, normalizedContent.content);
		await this.streamResponse();
	}
	/**
	* Normalize the message input to extract content and optional id.
	* Trims string content automatically.
	*/
	normalizeMessageInput(input) {
		if (typeof input === "string") return { content: input.trim() };
		return {
			content: input.content,
			id: input.id
		};
	}
	/**
	* Append a message and stream the response
	*/
	async append(message) {
		this.mountDevtools();
		const normalizedMessage = normalizeToUIMessage(message, generateMessageId);
		if (normalizedMessage.role === "system") return;
		const uiMessage = normalizedMessage;
		this.events.messageAppended(uiMessage);
		const messages = this.processor.getMessages();
		this.processor.setMessages([...messages, uiMessage]);
		this.devtoolsBridge.emitSnapshot();
		if (this.isLoading) {
			this.queuePostStreamAction(async () => {
				await this.streamResponse();
			});
			return;
		}
		await this.streamResponse();
	}
	/**
	* Stream a response from the LLM.
	* Returns true if the stream completed successfully, false on abort or error.
	*/
	async streamResponse() {
		if (this.isLoading) return false;
		const generation = ++this.streamGeneration;
		const runId = `run-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
		this.currentRunId = runId;
		this.setIsLoading(true);
		this.setStatus("submitted");
		this.setError(void 0);
		this.errorReportedGeneration = null;
		this.abortController = new AbortController();
		const signal = this.abortController.signal;
		this.pendingToolExecutions.clear();
		let streamCompletedSuccessfully = false;
		let activeDevtoolsRunId = null;
		let runTerminalEventEmitted = false;
		try {
			const messages = this.processor.getMessages();
			const clientTools = new Map(this.clientToolsRef.current);
			const runtimeContext = this.context;
			await this.callbacksRef.current.onResponse();
			if (signal.aborted) return false;
			const mergedBody = {
				...this.bodyOption,
				...this.forwardedPropsOption,
				...this.pendingMessageBody
			};
			this.pendingMessageBody = void 0;
			this.currentStreamId = this.generateUniqueId("stream");
			this.devtoolsBridge.setCurrentStreamId(this.currentStreamId);
			this.currentMessageId = null;
			this.activeClientTools = clientTools;
			this.activeContext = runtimeContext;
			this.processor.prepareAssistantMessage();
			this.ensureSubscription();
			const processingComplete = this.waitForProcessing();
			const runContext = {
				threadId: this.threadId,
				runId,
				clientTools: Array.from(clientTools.values()).map((t) => ({
					name: t.name,
					description: t.description,
					parameters: t.inputSchema ? convertSchemaToJsonSchema(t.inputSchema) : { type: "object" }
				})),
				forwardedProps: { ...mergedBody }
			};
			this.devtoolsBridge.beginRun(runContext.runId, this.threadId);
			activeDevtoolsRunId = runContext.runId;
			this.devtoolsBridge.emitRunLifecycle("run:created", runContext.runId, "created");
			this.devtoolsBridge.emitRunLifecycle("run:started", runContext.runId, "started");
			this.devtoolsBridge.emitSnapshot();
			await this.connection.send(messages, mergedBody, signal, runContext);
			await processingComplete;
			if (generation !== this.streamGeneration) return false;
			if (this.status === "error") {
				if (activeDevtoolsRunId) {
					this.devtoolsBridge.emitRunLifecycle("run:errored", activeDevtoolsRunId, "errored", this.error ? { error: this.error.message } : {});
					runTerminalEventEmitted = true;
				}
				return false;
			}
			if (this.pendingToolExecutions.size > 0) await Promise.all(this.pendingToolExecutions.values());
			this.processor.finalizeStream();
			streamCompletedSuccessfully = true;
		} catch (err) {
			if (err instanceof Error) {
				if (err.name === "AbortError") {
					if (activeDevtoolsRunId) {
						this.devtoolsBridge.emitRunLifecycle("run:cancelled", activeDevtoolsRunId, "cancelled");
						runTerminalEventEmitted = true;
					}
					return false;
				}
				if (generation === this.streamGeneration) {
					this.reportStreamError(err);
					if (activeDevtoolsRunId) {
						this.devtoolsBridge.emitRunLifecycle("run:errored", activeDevtoolsRunId, "errored", { error: err.message });
						runTerminalEventEmitted = true;
					}
				}
			}
		} finally {
			if (generation === this.streamGeneration) {
				this.currentStreamId = null;
				this.devtoolsBridge.setCurrentStreamId(null);
				this.currentMessageId = null;
				this.currentRunId = null;
				this.activeClientTools = null;
				this.activeContext = void 0;
				this.abortController = null;
				this.setIsLoading(false);
				this.pendingMessageBody = void 0;
				if (activeDevtoolsRunId && !runTerminalEventEmitted) {
					if (streamCompletedSuccessfully) this.devtoolsBridge.emitRunLifecycle("run:completed", activeDevtoolsRunId, "completed");
					else if (signal.aborted) this.devtoolsBridge.emitRunLifecycle("run:cancelled", activeDevtoolsRunId, "cancelled");
				}
				await this.drainPostStreamActions();
				if (streamCompletedSuccessfully) {
					const lastPart = this.processor.getMessages().at(-1)?.parts.at(-1);
					const { finishReason } = this.processor.getState();
					if (lastPart?.type === "tool-result" && finishReason !== "stop" && this.shouldAutoSend()) try {
						await this.checkForContinuation();
					} catch (error) {
						console.error("Failed to continue flow after tool result:", error);
					}
				}
			}
		}
		return streamCompletedSuccessfully;
	}
	/**
	* Start the client subscription loop.
	* This controls the connection lifecycle independently from request lifecycle.
	*/
	subscribe(options) {
		const restart = options?.restart === true;
		if (this.isSubscribed && !restart) return;
		if (this.isSubscribed && restart) this.abortSubscriptionLoop();
		this.setIsSubscribed(true);
		this.setConnectionStatus("connecting");
		this.startSubscription();
	}
	/**
	* Unsubscribe and fully tear down live behavior.
	* This aborts an in-flight request and the subscription loop.
	*/
	unsubscribe() {
		this.cancelInFlightStream({
			setReadyStatus: true,
			abortSubscription: true
		});
		this.resetSessionGenerating();
		this.setIsSubscribed(false);
		this.setConnectionStatus("disconnected");
	}
	/**
	* Reload the last assistant message
	*/
	async reload() {
		const messages = this.processor.getMessages();
		if (messages.length === 0) return;
		const lastUserMessageIndex = messages.findLastIndex((m) => m.role === "user");
		if (lastUserMessageIndex === -1) return;
		if (this.isLoading) this.cancelInFlightStream();
		this.events.reloaded(lastUserMessageIndex);
		this.processor.removeMessagesAfter(lastUserMessageIndex);
		this.devtoolsBridge.emitSnapshot();
		await this.streamResponse();
	}
	/**
	* Stop the current stream
	*/
	stop() {
		const hadLocalStream = this.abortController !== null;
		this.cancelInFlightStream({ setReadyStatus: true });
		if (hadLocalStream) this.resetSessionGenerating();
		this.events.stopped();
	}
	/**
	* Clear all messages
	*/
	clear() {
		if (this.persistor) {
			this.persistor.snapshotClear({
				messages: this.processor.getMessages(),
				activeRunIds: this.activeRunIds,
				currentRunId: this.currentRunId
			});
			if (this.isLoading) {
				this.cancelInFlightStream({ setReadyStatus: true });
				this.resetSessionGenerating();
			} else if (this.activeRunIds.size > 0) this.resetSessionGenerating();
			this.persistor.beginClear();
		}
		this.processor.clearMessages();
		this.persistor?.remove();
		this.setError(void 0);
		this.events.messagesCleared();
	}
	/**
	* Add the result of a client-side tool execution
	*/
	async addToolResult(result) {
		const clientTool = this.clientToolsRef.current.get(result.tool);
		await this.addToolResultForClientTool(result, clientTool);
	}
	async addToolResultForClientTool(result, clientTool, context) {
		if (clientTool && result.state !== "output-error") try {
			result = {
				...result,
				output: this.validateClientToolOutput(clientTool, result.output)
			};
		} catch (error) {
			result = {
				...result,
				output: null,
				state: "output-error",
				errorText: error.message
			};
		}
		this.events.toolResultAdded(result.toolCallId, result.tool, result.output, result.state || "output-available", context);
		this.processor.addToolResult(result.toolCallId, result.output, result.errorText);
		if (this.isLoading) {
			this.queuePostStreamAction(() => this.checkForContinuation());
			return;
		}
		await this.checkForContinuation();
	}
	validateClientToolOutput(clientTool, output) {
		if (clientTool.outputSchema && isStandardSchema(clientTool.outputSchema)) return parseWithStandardSchema(clientTool.outputSchema, output);
		return output;
	}
	/**
	* Respond to a tool approval request
	*/
	async addToolApprovalResponse(response) {
		const messages = this.processor.getMessages();
		let foundToolCallId;
		for (const msg of messages) {
			const toolCallPart = msg.parts.find((p) => p.type === "tool-call" && p.approval?.id === response.id);
			if (toolCallPart) {
				foundToolCallId = toolCallPart.id;
				break;
			}
		}
		if (foundToolCallId) this.events.toolApprovalResponded(response.id, foundToolCallId, response.approved);
		this.processor.addToolApprovalResponse(response.id, response.approved);
		this.devtoolsBridge.emitSnapshot();
		if (this.isLoading) {
			this.queuePostStreamAction(() => this.checkForContinuation());
			return;
		}
		await this.checkForContinuation();
	}
	/**
	* Queue an action to be executed after the current stream ends
	*/
	queuePostStreamAction(action) {
		this.postStreamActions.push(action);
	}
	/**
	* Drain and execute all queued post-stream actions
	*/
	async drainPostStreamActions() {
		if (this.draining) return;
		this.draining = true;
		try {
			let action;
			while ((action = this.postStreamActions.shift()) !== void 0) await action();
		} finally {
			this.draining = false;
		}
	}
	/**
	* Check if we should continue the flow and do so if needed
	*/
	async checkForContinuation() {
		if (this.continuationPending || this.isLoading) {
			this.continuationSkipped = true;
			return;
		}
		if (this.shouldAutoSend()) {
			this.continuationPending = true;
			this.continuationSkipped = false;
			let succeeded = false;
			try {
				succeeded = await this.streamResponse();
			} finally {
				this.continuationPending = false;
			}
			if (this.continuationSkipped && succeeded) {
				this.continuationSkipped = false;
				await this.checkForContinuation();
			}
		}
	}
	/**
	* Check if all tool calls are complete and we should auto-send.
	* Requires that there is at least one tool call in the last assistant message;
	* a text-only response has nothing to auto-send.
	*/
	shouldAutoSend() {
		const lastAssistant = this.processor.getMessages().findLast((m) => m.role === "assistant");
		if (!lastAssistant) return false;
		if (!lastAssistant.parts.some((p) => p.type === "tool-call")) return false;
		return this.processor.areAllToolsComplete();
	}
	/**
	* Get current messages
	*/
	getMessages() {
		return this.processor.getMessages();
	}
	/**
	* Get loading state
	*/
	getIsLoading() {
		return this.isLoading;
	}
	/**
	* Get current status
	*/
	getStatus() {
		return this.status;
	}
	/**
	* Get whether the subscription loop is active
	*/
	getIsSubscribed() {
		return this.isSubscribed;
	}
	/**
	* Get current connection lifecycle status
	*/
	getConnectionStatus() {
		return this.connectionStatus;
	}
	/**
	* Whether the shared session is actively generating.
	* Derived from stream run events (RUN_STARTED / RUN_FINISHED / RUN_ERROR).
	* Unlike `isLoading` (request-local), this reflects shared generation
	* activity visible to all subscribers (e.g. across tabs/devices).
	*/
	getSessionGenerating() {
		return this.sessionGenerating;
	}
	/**
	* Get current error
	*/
	getError() {
		return this.error;
	}
	/**
	* Manually set messages
	*/
	setMessagesManually(messages) {
		this.processor.setMessages(messages);
		this.devtoolsBridge.emitSnapshot();
	}
	updateOptions(options) {
		if (options.connection !== void 0 || options.fetcher !== void 0) {
			const wasSubscribed = this.isSubscribed;
			if (this.isLoading) this.cancelInFlightStream({
				setReadyStatus: true,
				abortSubscription: true
			});
			else if (wasSubscribed) this.abortSubscriptionLoop();
			this.resetSessionGenerating();
			this.setIsSubscribed(false);
			this.setConnectionStatus("disconnected");
			this.connection = normalizeConnectionAdapter(resolveTransport({
				connection: options.connection,
				fetcher: options.fetcher
			}));
			if (wasSubscribed) this.subscribe();
		}
		if (options.body !== void 0) this.bodyOption = options.body;
		if (options.forwardedProps !== void 0) this.forwardedPropsOption = options.forwardedProps;
		if ("context" in options) this.context = options.context;
		if (options.tools !== void 0) {
			this.clientToolsRef.current = /* @__PURE__ */ new Map();
			for (const tool of options.tools) this.clientToolsRef.current.set(tool.name, tool);
			this.devtoolsBridge.notifyToolsChanged();
		}
		if (options.onResponse !== void 0) this.callbacksRef.current.onResponse = options.onResponse;
		if (options.onChunk !== void 0) this.callbacksRef.current.onChunk = options.onChunk;
		if (options.onFinish !== void 0) this.callbacksRef.current.onFinish = options.onFinish;
		if (options.onError !== void 0) this.callbacksRef.current.onError = options.onError;
		if (options.onSubscriptionChange !== void 0) this.callbacksRef.current.onSubscriptionChange = options.onSubscriptionChange;
		if (options.onConnectionStatusChange !== void 0) this.callbacksRef.current.onConnectionStatusChange = options.onConnectionStatusChange;
		if (options.onSessionGeneratingChange !== void 0) this.callbacksRef.current.onSessionGeneratingChange = options.onSessionGeneratingChange;
		if (options.onCustomEvent !== void 0) this.callbacksRef.current.onCustomEvent = options.onCustomEvent;
	}
	dispose() {
		this.unsubscribe();
		this.devtoolsBridge.dispose();
		this.devtoolsMounted = false;
	}
};
//#endregion
//#region node_modules/.pnpm/@tanstack+ai-client@0.16.3/node_modules/@tanstack/ai-client/dist/esm/devtools.js
var activeBridgeRegistryKey = /* @__PURE__ */ Symbol.for("tanstack.ai.devtools.activeBridgeByHookId");
function getActiveBridgeRegistry() {
	const global = globalThis;
	const existing = global[activeBridgeRegistryKey];
	if (existing) return existing;
	const registry = /* @__PURE__ */ new Map();
	global[activeBridgeRegistryKey] = registry;
	return registry;
}
var ClientDevtoolsBridge = class {
	options;
	bridgeId;
	unsubscribers = [];
	disposed = false;
	superseded = false;
	registered = false;
	constructor(options) {
		this.options = options;
		this.bridgeId = createBridgeId(options.hookId);
	}
	emitRegistered() {
		if (!this.prepareForMountEmit()) return;
		this.registered = true;
		emitAIDevtoolsEvent("hook:registered", {
			...this.createEnvelope("hook:registered"),
			...this.createMetadataPayload(),
			lifecycle: "mounted"
		});
	}
	emitUpdated() {
		if (!this.prepareForEmit()) return;
		emitAIDevtoolsEvent("hook:updated", {
			...this.createEnvelope("hook:updated"),
			...this.createMetadataPayload(),
			lifecycle: "active"
		});
	}
	emitSnapshot() {
		if (!this.prepareForEmit()) return;
		emitAIDevtoolsEvent("hook:state-snapshot", {
			...this.createEnvelope("hook:state-snapshot"),
			...this.createMetadataPayload(),
			state: this.options.getSnapshot()
		});
	}
	emitToolsRegistered() {
		if (!this.prepareForEmit()) return;
		const tools = this.options.getTools ? Array.from(this.options.getTools()).map((tool) => ({
			name: tool.name,
			description: tool.description,
			inputSchema: tool.inputSchema ? convertSchemaToJsonSchema(tool.inputSchema) : { type: "object" },
			outputSchema: tool.outputSchema ? convertSchemaToJsonSchema(tool.outputSchema) : void 0,
			needsApproval: tool.needsApproval,
			metadata: tool.metadata
		})) : [];
		emitAIDevtoolsEvent("tools:registered", {
			...this.createEnvelope("tools:registered"),
			...this.createMetadataPayload(),
			tools
		});
	}
	emitRunLifecycle(eventType, runId, status, options = {}) {
		if (!this.prepareForEmit()) return;
		emitAIDevtoolsEvent(eventType, {
			...this.createEnvelope(eventType, "client-state", { runId }),
			runId,
			status,
			...options.error ? { error: options.error } : {}
		});
	}
	deactivate() {
		const activeBridgeByHookId = getActiveBridgeRegistry();
		if (activeBridgeByHookId.get(this.options.hookId) === this) activeBridgeByHookId.delete(this.options.hookId);
		for (const unsubscribe of this.unsubscribers.splice(0)) unsubscribe();
	}
	supersede() {
		if (this.disposed) return;
		this.superseded = true;
		this.disposed = true;
		this.deactivate();
	}
	dispose() {
		if (this.disposed) return;
		this.disposed = true;
		if (!this.registered) {
			this.deactivate();
			return;
		}
		emitAIDevtoolsEvent("hook:unregistered", {
			...this.createEnvelope("hook:unregistered"),
			...this.createMetadataPayload(),
			reason: "disposed"
		});
		this.deactivate();
	}
	prepareForEmit() {
		if (this.disposed || this.superseded) return false;
		this.activate();
		return true;
	}
	prepareForMountEmit() {
		if (this.superseded) return false;
		if (this.disposed) {
			this.disposed = false;
			this.registered = false;
		}
		this.activate();
		return true;
	}
	activate() {
		if (this.disposed) return;
		const activeBridgeByHookId = getActiveBridgeRegistry();
		const activeBridge = activeBridgeByHookId.get(this.options.hookId);
		if (activeBridge && activeBridge !== this) if (typeof activeBridge.supersede === "function") activeBridge.supersede();
		else activeBridge.deactivate();
		activeBridgeByHookId.set(this.options.hookId, this);
		if (this.unsubscribers.length > 0) return;
		this.unsubscribers.push(aiEventClient.on("devtools:request-state", (event) => {
			this.handleRequestState(event);
		}));
		if (this.options.applyToolFixture) this.unsubscribers.push(aiEventClient.on("devtools:tool-fixture:apply", (event) => {
			this.handleToolFixtureApply(event);
		}));
	}
	handleRequestState(event) {
		if (this.disposed || this.superseded) return;
		const targetHookId = event.payload.targetHookId;
		if (targetHookId && targetHookId !== this.options.hookId) return;
		this.emitRegistered();
		this.emitToolsRegistered();
		this.emitSnapshot();
	}
	async handleToolFixtureApply(event) {
		const fixture = event.payload;
		if (!this.matchesFixtureTarget(fixture)) return;
		await this.options.applyToolFixture?.(fixture);
	}
	matchesFixtureTarget(fixture) {
		if (!fixture.hookId && !fixture.threadId) return false;
		if (fixture.hookId) return fixture.hookId === this.options.hookId;
		if (fixture.threadId && (!this.options.threadId || fixture.threadId !== this.options.threadId)) return false;
		return true;
	}
	createEnvelope(eventType, visibility = "client-state", context = {}) {
		return createAIDevtoolsEventEnvelope({
			eventType,
			source: "client",
			visibility,
			clientId: this.options.clientId,
			hookId: this.options.hookId,
			correlationId: this.bridgeId,
			...this.options.threadId ? { threadId: this.options.threadId } : {},
			...context.runId ? { runId: context.runId } : {},
			timestamp: Date.now()
		});
	}
	createMetadataPayload() {
		return {
			hookId: this.options.hookId,
			hookName: this.options.metadata.hookName,
			...this.options.metadata.name ? { displayName: this.options.metadata.name } : {},
			...this.options.metadata.outputKind ? { outputKind: this.options.metadata.outputKind } : {},
			...this.options.metadata.framework ? { framework: this.options.metadata.framework } : {}
		};
	}
};
var bridgeIdSequence = 0;
function createBridgeId(hookId) {
	const cryptoLike = globalThis.crypto;
	if (cryptoLike?.randomUUID) return `bridge:${hookId}:${cryptoLike.randomUUID()}`;
	bridgeIdSequence += 1;
	return `bridge:${hookId}:${bridgeIdSequence}`;
}
var ChatDevtoolsBridge = class extends ClientDevtoolsBridge {
	events;
	chatOptions;
	currentRunId = null;
	currentRunThreadId = null;
	currentStreamId = null;
	lastStreamId = null;
	lastRunEventContext;
	constructor(options) {
		super({
			...options,
			applyToolFixture: (fixture) => this.applyFixture(fixture)
		});
		this.chatOptions = options;
		this.events = new ChatDevtoolsAwareEventEmitter(options.clientId, this);
	}
	setCurrentStreamId(streamId) {
		this.currentStreamId = streamId;
		if (streamId) this.lastStreamId = streamId;
	}
	/**
	* Called by the auto-attaching emitter every time it sees a non-empty
	* streamId pass through. Lets devtools track the latest stream id
	* without the chat client wiring it up explicitly.
	*/
	recordStreamId(streamId) {
		if (streamId) this.lastStreamId = streamId;
	}
	mountWithTools(initialMessageCount) {
		this.events.clientCreated(initialMessageCount);
		this.emitRegistered();
		this.emitToolsRegistered();
		this.emitSnapshot();
	}
	notifyToolsChanged() {
		this.emitToolsRegistered();
		this.emitSnapshot();
	}
	getCurrentStreamId() {
		return this.currentStreamId;
	}
	getLastStreamId() {
		return this.lastStreamId;
	}
	resolveStreamId() {
		return this.currentStreamId ?? this.lastStreamId ?? this.chatOptions.generateId("stream");
	}
	beginRun(runId, threadId) {
		this.currentRunId = runId;
		this.currentRunThreadId = threadId;
		this.lastRunEventContext = {
			runId,
			threadId
		};
	}
	observeChunk(chunk) {
		if (chunk.type === "RUN_STARTED") {
			this.beginRun(chunk.runId, chunk.threadId);
			return;
		}
		if (chunk.type === "RUN_FINISHED" || chunk.type === "RUN_ERROR") {
			const runId = chunk.type === "RUN_FINISHED" ? chunk.runId : chunk.runId;
			if (!runId || runId === this.currentRunId) {
				const context = this.getCurrentRunEventContext();
				if (context) this.lastRunEventContext = context;
				this.currentRunId = null;
				this.currentRunThreadId = null;
			}
		}
	}
	getCurrentRunEventContext() {
		if (!this.currentRunId) return void 0;
		return {
			threadId: this.currentRunThreadId ?? this.chatOptions.threadId ?? "",
			runId: this.currentRunId
		};
	}
	getCurrentOrLastRunEventContext() {
		return this.getCurrentRunEventContext() ?? this.lastRunEventContext;
	}
	findToolCallContext(toolCallId) {
		const base = { toolCallId };
		const runContext = this.getCurrentRunEventContext();
		if (runContext) return {
			threadId: runContext.threadId,
			runId: runContext.runId,
			toolCallId
		};
		if (this.chatOptions.threadId) return {
			threadId: this.chatOptions.threadId,
			toolCallId
		};
		return base;
	}
	/**
	* Entry point invoked when the devtools panel emits
	* `devtools:tool-fixture:apply`. The chat client never calls this
	* directly; it is wired through the base bridge's fixture subscription.
	*/
	async applyFixture(fixture) {
		const messages = this.chatOptions.getMessages();
		const threadId = fixture.threadId ?? this.chatOptions.threadId ?? "";
		if (fixture.execute) {
			await this.executeFixture(fixture, messages, threadId);
			return;
		}
		const { message, toolCallId } = this.createReplayMessageFromFixture(fixture, messages);
		const messageId = message.id;
		this.events.messageAppended(message, void 0, {
			threadId,
			toolCallId,
			...fixture.runId ? { runId: fixture.runId } : {}
		});
		this.chatOptions.setMessages([...messages, message]);
		this.events.toolFixtureApplied({
			hookId: this.chatOptions.hookId,
			threadId,
			...fixture.runId ? { runId: fixture.runId } : {},
			toolName: fixture.toolName,
			input: fixture.input,
			output: fixture.output,
			messageId,
			toolCallId,
			...fixture.execute !== void 0 ? { execute: fixture.execute } : {},
			...fixture.message ? { message: fixture.message } : {},
			...fixture.errorText ? { errorText: fixture.errorText } : {}
		});
		this.emitSnapshot();
	}
	async executeFixture(fixture, messages, threadId) {
		const toolCallId = this.resolveFixtureToolCallId(fixture.toolCallId, messages);
		const messageId = this.resolveFixtureMessageId(fixture.messageId, messages);
		const message = {
			id: messageId,
			role: "assistant",
			parts: [{
				type: "tool-call",
				id: toolCallId,
				name: fixture.toolName,
				arguments: stringifyFixtureValue(fixture.input),
				input: fixture.input,
				state: "input-complete"
			}],
			createdAt: /* @__PURE__ */ new Date()
		};
		this.events.messageAppended(message, void 0, {
			threadId,
			toolCallId,
			...fixture.runId ? { runId: fixture.runId } : {}
		});
		this.chatOptions.setMessages([...messages, message]);
		this.emitSnapshot();
		const executeFunc = this.findClientTool(fixture.toolName)?.execute;
		if (!executeFunc) {
			console.warn(`[ai-devtools] tool fixture "${fixture.toolName}" requested execute=true but no client tool implementation is registered; replaying saved output instead.`);
			this.addToolResultForFixture({
				fixture,
				messageId,
				toolCallId,
				threadId,
				output: fixture.output,
				errorText: fixture.errorText
			});
			return;
		}
		let output;
		try {
			output = await executeFunc(fixture.input);
		} catch (error) {
			console.error(`[ai-devtools] tool fixture "${fixture.toolName}" execute threw`, error);
			this.addToolResultForFixture({
				fixture,
				messageId,
				toolCallId,
				threadId,
				output: null,
				errorText: error instanceof Error ? `${error.name}: ${error.message}` : `Tool execution failed: ${String(error)}`
			});
			return;
		}
		this.addToolResultForFixture({
			fixture,
			messageId,
			toolCallId,
			threadId,
			output
		});
	}
	addToolResultForFixture(input) {
		const state = input.errorText ? "output-error" : "output-available";
		this.events.toolResultAdded(input.toolCallId, input.fixture.toolName, input.output, state, {
			threadId: input.threadId,
			...input.fixture.runId ? { runId: input.fixture.runId } : {},
			toolCallId: input.toolCallId
		});
		this.chatOptions.addToolResult(input.toolCallId, input.output, input.errorText);
		this.events.toolFixtureApplied({
			hookId: this.chatOptions.hookId,
			threadId: input.threadId,
			...input.fixture.runId ? { runId: input.fixture.runId } : {},
			toolName: input.fixture.toolName,
			input: input.fixture.input,
			output: input.output,
			execute: true,
			messageId: input.messageId,
			toolCallId: input.toolCallId,
			...input.errorText ? { errorText: input.errorText } : {}
		});
		this.emitSnapshot();
	}
	createReplayMessageFromFixture(fixture, messages) {
		const cloned = this.cloneFixtureSourceMessage(fixture, messages);
		if (cloned) return cloned;
		const toolCallId = this.resolveFixtureToolCallId(fixture.toolCallId, messages);
		const messageId = this.resolveFixtureMessageId(fixture.messageId, messages);
		const state = fixture.errorText ? "error" : "complete";
		return {
			toolCallId,
			message: {
				id: messageId,
				role: "assistant",
				parts: [{
					type: "tool-call",
					id: toolCallId,
					name: fixture.toolName,
					arguments: stringifyFixtureValue(fixture.input),
					input: fixture.input,
					state: "input-complete",
					output: fixture.output
				}, {
					type: "tool-result",
					toolCallId,
					content: stringifyFixtureValue(fixture.output),
					state,
					...fixture.errorText ? { error: fixture.errorText } : {}
				}],
				createdAt: /* @__PURE__ */ new Date()
			}
		};
	}
	cloneFixtureSourceMessage(fixture, messages) {
		const sourceMessage = fixture.message;
		if (!sourceMessage || !Array.isArray(sourceMessage.parts)) return;
		const toolCallIds = this.createFixtureToolCallIdMap(sourceMessage.parts, messages);
		const parts = sourceMessage.parts.map((part) => cloneFixtureMessagePart(part, toolCallIds)).filter((part) => Boolean(part));
		const mappedFixtureToolCallId = fixture.toolCallId ? toolCallIds.get(fixture.toolCallId) : void 0;
		hydrateToolCallOutputs(parts, {
			...mappedFixtureToolCallId ? { mappedToolCallId: mappedFixtureToolCallId } : {},
			output: fixture.output
		});
		if (parts.length === 0) return void 0;
		const toolCallId = (fixture.toolCallId ? toolCallIds.get(fixture.toolCallId) : void 0) ?? firstToolCallId(parts);
		if (!toolCallId) return void 0;
		return {
			toolCallId,
			message: {
				id: this.resolveFixtureMessageId(sourceMessage.id, messages),
				role: sourceMessage.role,
				parts,
				createdAt: /* @__PURE__ */ new Date()
			}
		};
	}
	createFixtureToolCallIdMap(parts, messages) {
		const ids = /* @__PURE__ */ new Map();
		for (const part of parts) {
			if (!isRecord(part) || part.type !== "tool-call") continue;
			if (typeof part.id !== "string") continue;
			ids.set(part.id, this.resolveFixtureToolCallId(part.id, messages));
		}
		return ids;
	}
	resolveFixtureMessageId(messageId, messages) {
		if (messageId && !messages.some((message) => message.id === messageId)) return messageId;
		return this.chatOptions.generateId("fixture-msg");
	}
	resolveFixtureToolCallId(toolCallId, messages) {
		if (toolCallId && !hasToolCallId(messages, toolCallId)) return toolCallId;
		return this.chatOptions.generateId("fixture-tool-call");
	}
	findClientTool(name) {
		const tools = this.chatOptions.getTools?.();
		if (!tools) return void 0;
		for (const tool of tools) if (tool.name === name) return tool;
	}
};
function isRecord(value) {
	return typeof value === "object" && value !== null;
}
function stringifyFixtureValue(value) {
	if (typeof value === "string") return value;
	if (value === void 0 || typeof value === "function" || typeof value === "symbol") return String(value);
	try {
		return JSON.stringify(value);
	} catch (error) {
		console.error("[ai-devtools] failed to JSON.stringify fixture value; falling back to String(). Tool call arguments may be malformed.", {
			error,
			value
		});
		return String(value);
	}
}
function parseFixtureResultContent(content) {
	try {
		return JSON.parse(content);
	} catch (error) {
		console.error("[ai-devtools] failed to JSON.parse fixture result content; replaying as raw string. Fixture payload may be corrupted.", {
			error,
			content
		});
		return content;
	}
}
function cloneFixtureMessagePart(part, toolCallIds) {
	if (!isRecord(part) || typeof part.type !== "string") return void 0;
	const cloned = { ...part };
	if (part.type === "tool-call" && typeof part.id === "string") cloned.id = toolCallIds.get(part.id) ?? part.id;
	if (part.type === "tool-result" && typeof part.toolCallId === "string") cloned.toolCallId = toolCallIds.get(part.toolCallId) ?? part.toolCallId;
	return cloned;
}
function firstToolCallId(parts) {
	const toolCall = parts.find((part) => part.type === "tool-call");
	return toolCall?.type === "tool-call" ? toolCall.id : void 0;
}
function hydrateToolCallOutputs(parts, fixtureOutput) {
	for (const part of parts) {
		if (part.type !== "tool-result") continue;
		const toolCall = parts.find((candidate) => candidate.type === "tool-call" && candidate.id === part.toolCallId && candidate.output === void 0);
		if (toolCall) toolCall.output = Array.isArray(part.content) ? part.content : parseFixtureResultContent(part.content);
	}
	if (fixtureOutput.mappedToolCallId && fixtureOutput.output !== void 0) {
		const toolCall = parts.find((candidate) => candidate.type === "tool-call" && candidate.id === fixtureOutput.mappedToolCallId && candidate.output === void 0);
		if (toolCall) toolCall.output = fixtureOutput.output;
	}
}
function hasToolCallId(messages, toolCallId) {
	return messages.some((message) => message.parts.some((part) => {
		if (part.type === "tool-call") return part.id === toolCallId;
		if (part.type === "tool-result") return part.toolCallId === toolCallId;
		return false;
	}));
}
var ChatDevtoolsAwareEventEmitter = class extends DefaultChatClientEventEmitter {
	constructor(clientId, helper) {
		super(clientId);
		this.helper = helper;
	}
	helper;
	afterEmit(streamId) {
		if (streamId) this.helper.recordStreamId(streamId);
		this.helper.emitSnapshot();
	}
	textUpdated(streamId, messageId, content, context) {
		super.textUpdated(streamId, messageId, content, context ?? this.helper.getCurrentRunEventContext());
		this.afterEmit(streamId);
	}
	thinkingUpdated(streamId, messageId, content, delta, context) {
		super.thinkingUpdated(streamId, messageId, content, delta, context ?? this.helper.getCurrentRunEventContext());
		this.afterEmit(streamId);
	}
	messageAppended(uiMessage, streamId, context) {
		super.messageAppended(uiMessage, streamId, context ?? this.helper.getCurrentRunEventContext());
		this.afterEmit(streamId);
	}
	toolCallStateChanged(streamId, messageId, toolCallId, toolName, state, args, context) {
		super.toolCallStateChanged(streamId, messageId, toolCallId, toolName, state, args, context ?? this.helper.getCurrentRunEventContext());
		this.afterEmit(streamId);
	}
	structuredOutputChanged(eventName, streamId, messageId, output, context) {
		super.structuredOutputChanged(eventName, streamId, messageId, output, context ?? this.helper.getCurrentOrLastRunEventContext());
		this.afterEmit(streamId);
	}
	approvalRequested(streamId, messageId, toolCallId, toolName, input, approvalId, context) {
		super.approvalRequested(streamId, messageId, toolCallId, toolName, input, approvalId, context ?? this.helper.getCurrentOrLastRunEventContext());
		this.afterEmit(streamId);
	}
	toolResultAdded(toolCallId, toolName, output, state, context) {
		super.toolResultAdded(toolCallId, toolName, output, state, context ?? this.helper.getCurrentRunEventContext());
		this.afterEmit();
	}
	toolApprovalResponded(approvalId, toolCallId, approved, context) {
		super.toolApprovalResponded(approvalId, toolCallId, approved, context ?? this.helper.getCurrentRunEventContext());
		this.afterEmit();
	}
	clientCreated(initialMessageCount) {
		super.clientCreated(initialMessageCount);
		this.afterEmit();
	}
	loadingChanged(isLoading) {
		super.loadingChanged(isLoading);
		this.afterEmit();
	}
	errorChanged(error) {
		super.errorChanged(error);
		this.afterEmit();
	}
	reloaded(fromMessageIndex) {
		super.reloaded(fromMessageIndex);
		this.afterEmit();
	}
	stopped() {
		super.stopped();
		this.afterEmit();
	}
	messagesCleared() {
		super.messagesCleared();
		this.afterEmit();
	}
	messageSent(messageId, content) {
		super.messageSent(messageId, content);
		this.afterEmit();
	}
	toolFixtureApplied(fixture) {
		super.toolFixtureApplied(fixture);
		this.afterEmit();
	}
};
function createChatDevtoolsBridge(options) {
	return new ChatDevtoolsBridge(options);
}
//#endregion
export { ChatClient as n, fetchServerSentEvents as r, createChatDevtoolsBridge as t };

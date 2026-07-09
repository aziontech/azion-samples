import { t as __commonJSMin } from "../../_runtime.mjs";
import { n as EventType$1, r as RunAgentInputSchema, t as AGUIError } from "../ag-ui__core+zod.mjs";
//#region node_modules/.pnpm/@tanstack+ai@0.28.0/node_modules/@tanstack/ai/dist/esm/activities/chat/tools/schema-converter.js
function toJsonSchema$1(obj) {
	const result = {};
	for (const [key, value] of Object.entries(obj)) {
		if (key === "$schema") continue;
		result[key] = value;
	}
	return result;
}
function isPropertyCarrier$1(schema) {
	return (typeof schema === "object" || typeof schema === "function") && schema !== null;
}
function isStandardJSONSchema$1(schema) {
	if (!isPropertyCarrier$1(schema) || !("~standard" in schema)) return false;
	const standard = schema["~standard"];
	if (typeof standard !== "object" || standard === null || !("version" in standard) || standard.version !== 1 || !("jsonSchema" in standard) || typeof standard.jsonSchema !== "object" || standard.jsonSchema === null || !("input" in standard.jsonSchema)) return false;
	return typeof standard.jsonSchema.input === "function";
}
function isStandardSchema$1(schema) {
	return isPropertyCarrier$1(schema) && "~standard" in schema && typeof schema["~standard"] === "object" && schema["~standard"] !== null && "version" in schema["~standard"] && schema["~standard"].version === 1 && "validate" in schema["~standard"] && typeof schema["~standard"].validate === "function";
}
function makeStructuredOutputCompatible$1(schema, originalRequired = []) {
	const result = { ...schema };
	if (result.type === "object" && result.properties) {
		const properties = { ...result.properties };
		const allPropertyNames = Object.keys(properties);
		for (const propName of allPropertyNames) {
			const prop = properties[propName];
			if (!prop) continue;
			const wasOptional = !originalRequired.includes(propName);
			if (prop.type === "object" && prop.properties) {
				const transformed = makeStructuredOutputCompatible$1(prop, prop.required || []);
				properties[propName] = wasOptional ? {
					...transformed,
					type: ["object", "null"]
				} : transformed;
			} else if (prop.type === "array" && prop.items) {
				const items = Array.isArray(prop.items) ? prop.items[0] : prop.items;
				const transformed = {
					...prop,
					items: items ? makeStructuredOutputCompatible$1(items, items.required || []) : prop.items
				};
				properties[propName] = wasOptional ? {
					...transformed,
					type: ["array", "null"]
				} : transformed;
			} else if (wasOptional) {
				if (prop.type && !Array.isArray(prop.type)) properties[propName] = {
					...prop,
					type: [prop.type, "null"]
				};
				else if (Array.isArray(prop.type) && !prop.type.includes("null")) properties[propName] = {
					...prop,
					type: [...prop.type, "null"]
				};
			}
		}
		result.properties = properties;
		result.required = allPropertyNames;
		result.additionalProperties = false;
	}
	if (result.type === "array" && result.items) {
		const items = Array.isArray(result.items) ? result.items[0] : result.items;
		if (items) result.items = makeStructuredOutputCompatible$1(items, items.required || []);
	}
	return result;
}
function convertSchemaToJsonSchema$1(schema, options = {}) {
	if (!schema) return void 0;
	const { forStructuredOutput = false } = options;
	if (isStandardJSONSchema$1(schema)) {
		let result = toJsonSchema$1(schema["~standard"].jsonSchema.input({ target: "draft-07" }));
		if ("properties" in result && !result.type) result.type = "object";
		if (result.type === "object" && !("properties" in result)) result.properties = {};
		if (result.type === "object" && !("required" in result)) result.required = [];
		if (forStructuredOutput) result = makeStructuredOutputCompatible$1(result, result.required || []);
		return result;
	}
	if (isStandardSchema$1(schema)) throw new Error("Schema is a Standard Schema validator but does not expose a JSON Schema converter on `~standard.jsonSchema`. Use Zod v4.2+, ArkType v2.1.28+, or wrap a Valibot schema with `toStandardJsonSchema()` from `@valibot/to-json-schema` before passing it as `outputSchema`.");
	if (typeof schema !== "object") return schema;
	if (forStructuredOutput) {
		const typedView = toJsonSchema$1(schema);
		return makeStructuredOutputCompatible$1(typedView, typedView.required || []);
	}
	return schema;
}
var StandardSchemaValidationError$1 = class extends Error {
	name = "StandardSchemaValidationError";
	issues;
	constructor(issues) {
		super(`Validation failed: ${issues.map((i) => i.message || "Validation failed").join(", ")}`);
		this.issues = issues;
	}
};
function parseWithStandardSchema$1(schema, data) {
	if (!isStandardSchema$1(schema)) return data;
	const result = schema["~standard"].validate(data);
	if (result instanceof Promise) throw new Error("Schema validation returned a Promise. Use validateWithStandardSchema for async validation.");
	if (!result.issues) return result.value;
	throw new StandardSchemaValidationError$1(result.issues);
}
//#endregion
//#region node_modules/.pnpm/@tanstack+ai@0.28.0/node_modules/@tanstack/ai/dist/esm/utilities/tool-result.js
var CONTENT_PART_TYPES$1 = /* @__PURE__ */ new Set([
	"text",
	"image",
	"audio",
	"video",
	"document"
]);
function isContentPart$3(value) {
	if (typeof value !== "object" || value === null) return false;
	const part = value;
	if (typeof part.type !== "string" || !CONTENT_PART_TYPES$1.has(part.type)) return false;
	if (part.type === "text") return typeof part.content === "string";
	const source = part.source;
	if (typeof source !== "object" || source === null) return false;
	const src = source;
	if (typeof src.value !== "string") return false;
	if (src.type === "data") return typeof src.mimeType === "string";
	return src.type === "url";
}
function isContentPartArray$1(value) {
	return Array.isArray(value) && value.length > 0 && value.every(isContentPart$3);
}
function normalizeToolResult$1(result) {
	if (typeof result === "string") return result;
	if (isContentPartArray$1(result)) return result;
	return JSON.stringify(result);
}
//#endregion
//#region node_modules/.pnpm/@tanstack+ai@0.28.0/node_modules/@tanstack/ai/dist/esm/activities/chat/messages.js
function isContentPart$2(part) {
	return part.type === "text" || part.type === "image" || part.type === "audio" || part.type === "video" || part.type === "document";
}
function safeJsonStringify$1(value) {
	try {
		return JSON.stringify(value);
	} catch {
		return "";
	}
}
function collapseContentParts$1(parts) {
	if (parts.length === 0) return null;
	if (parts.every((p) => p.type === "text")) return parts.map((p) => p.content).join("") || null;
	return parts;
}
function getTextContent(content) {
	if (content === null) return "";
	if (typeof content === "string") return content;
	return content.filter((part) => part.type === "text").map((part) => part.content).join("");
}
function uiMessageToModelMessages$1(uiMessage) {
	if (uiMessage.role === "system") return [];
	if (uiMessage.role !== "assistant") return [buildUserOrToolMessage$1(uiMessage)];
	return buildAssistantMessages$1(uiMessage);
}
function buildUserOrToolMessage$1(uiMessage) {
	const contentParts = [];
	for (const part of uiMessage.parts) if (isContentPart$2(part)) contentParts.push(part);
	return {
		role: uiMessage.role,
		content: collapseContentParts$1(contentParts)
	};
}
function createSegment$1() {
	return {
		contentParts: [],
		toolCalls: []
	};
}
function isToolCallIncluded$1(part) {
	return part.state === "input-complete" || part.state === "complete" || part.state === "approval-responded" || part.output !== void 0;
}
function buildAssistantMessages$1(uiMessage) {
	const messageList = [];
	let current = createSegment$1();
	let pendingThinking = [];
	const emittedToolResultIds = /* @__PURE__ */ new Set();
	function flushSegment() {
		const content = collapseContentParts$1(current.contentParts);
		const hasContent = content !== null;
		const hasToolCalls = current.toolCalls.length > 0;
		if (hasContent || hasToolCalls) {
			messageList.push({
				role: "assistant",
				content,
				...hasToolCalls && { toolCalls: current.toolCalls },
				...pendingThinking.length > 0 && { thinking: pendingThinking }
			});
			pendingThinking = [];
		}
		current = createSegment$1();
	}
	for (const part of uiMessage.parts) switch (part.type) {
		case "text":
		case "image":
		case "audio":
		case "video":
		case "document":
			current.contentParts.push(part);
			break;
		case "tool-call":
			if (isToolCallIncluded$1(part)) current.toolCalls.push({
				id: part.id,
				type: "function",
				function: {
					name: part.name,
					arguments: part.arguments
				},
				...part.metadata !== void 0 && { metadata: part.metadata }
			});
			break;
		case "tool-result":
			flushSegment();
			if ((part.state === "complete" || part.state === "error") && !emittedToolResultIds.has(part.toolCallId)) {
				messageList.push({
					role: "tool",
					content: part.content,
					toolCallId: part.toolCallId
				});
				emittedToolResultIds.add(part.toolCallId);
			}
			break;
		case "thinking":
			if (part.content) pendingThinking.push({
				content: part.content,
				...part.signature && { signature: part.signature }
			});
			break;
		case "structured-output":
			if (part.status === "complete") {
				const serialized = part.raw !== "" ? part.raw : part.data !== void 0 ? safeJsonStringify$1(part.data) : "";
				if (serialized !== "") current.contentParts.push({
					type: "text",
					content: serialized
				});
			}
			break;
	}
	flushSegment();
	for (const part of uiMessage.parts) {
		if (part.type !== "tool-call") continue;
		if (part.output !== void 0 && !emittedToolResultIds.has(part.id)) {
			messageList.push({
				role: "tool",
				content: normalizeToolResult$1(part.output),
				toolCallId: part.id
			});
			emittedToolResultIds.add(part.id);
		}
		if (part.output === void 0 && part.state === "approval-responded" && part.approval?.approved !== void 0 && !emittedToolResultIds.has(part.id)) {
			const approved = part.approval.approved;
			messageList.push({
				role: "tool",
				content: JSON.stringify({
					approved,
					...approved && { pendingExecution: true },
					message: approved ? "User approved this action" : "User denied this action"
				}),
				toolCallId: part.id
			});
			emittedToolResultIds.add(part.id);
		}
	}
	if (messageList.length === 0) messageList.push({
		role: "assistant",
		content: null
	});
	return messageList;
}
function modelMessageToUIMessage(modelMessage, id) {
	const parts = [];
	if (modelMessage.role === "assistant" && modelMessage.thinking?.length) for (const thinking of modelMessage.thinking) {
		if (!thinking.content) continue;
		parts.push({
			type: "thinking",
			content: thinking.content,
			...thinking.signature && { signature: thinking.signature }
		});
	}
	if (modelMessage.role === "tool" && modelMessage.toolCallId) parts.push({
		type: "tool-result",
		toolCallId: modelMessage.toolCallId,
		content: getTextContent(modelMessage.content),
		state: "complete"
	});
	else if (Array.isArray(modelMessage.content)) for (const part of modelMessage.content) parts.push(part);
	else {
		const textContent = getTextContent(modelMessage.content);
		if (textContent) parts.push({
			type: "text",
			content: textContent
		});
	}
	if (modelMessage.toolCalls && modelMessage.toolCalls.length > 0) for (const toolCall of modelMessage.toolCalls) parts.push({
		type: "tool-call",
		id: toolCall.id,
		name: toolCall.function.name,
		arguments: toolCall.function.arguments,
		state: "input-complete",
		...toolCall.metadata !== void 0 && { metadata: toolCall.metadata }
	});
	return {
		id: id || generateMessageId$1(),
		role: modelMessage.role === "tool" ? "assistant" : modelMessage.role,
		parts
	};
}
function normalizeToUIMessage(message, generateId) {
	if ("parts" in message) return {
		...message,
		id: message.id || generateId(),
		createdAt: message.createdAt || /* @__PURE__ */ new Date()
	};
	else return {
		...modelMessageToUIMessage(message, generateId()),
		createdAt: /* @__PURE__ */ new Date()
	};
}
function generateMessageId$1() {
	return `msg-${Date.now()}-${Math.random().toString(36).substring(7)}`;
}
//#endregion
//#region node_modules/.pnpm/@tanstack+ai@0.28.0/node_modules/@tanstack/ai/dist/esm/utilities/ag-ui-wire.js
function uiMessagesToWire(messages) {
	const wire = [];
	for (const msg of messages) {
		const parts = msg.parts ?? [];
		if (msg.role === "system") {
			wire.push({
				...msg,
				content: parts.length > 0 ? collectText(parts) : msg.content ?? ""
			});
			continue;
		}
		if (msg.role === "user") {
			wire.push({
				...msg,
				content: parts.length > 0 ? collectUserContent(parts) : msg.content ?? ""
			});
			continue;
		}
		for (const part of parts) if (part.type === "thinking") wire.push({
			role: "reasoning",
			id: deriveReasoningId(msg.id, part),
			content: part.content
		});
		const text = collectText(parts);
		const toolCalls = collectToolCalls(parts);
		wire.push({
			...msg,
			...text !== "" && { content: text },
			...toolCalls && { toolCalls }
		});
		for (const part of parts) if (part.type === "tool-result") wire.push({
			role: "tool",
			id: deriveToolMessageId(part.toolCallId),
			toolCallId: part.toolCallId,
			content: typeof part.content === "string" ? part.content : JSON.stringify(part.content),
			...part.error !== void 0 && { error: part.error }
		});
	}
	return wire;
}
function collectText(parts) {
	const out = [];
	for (const p of parts) if (p.type === "text") out.push(p.content);
	else if (p.type === "structured-output" && p.status === "complete" && p.raw !== "") out.push(p.raw);
	return out.join("");
}
function collectUserContent(parts) {
	if (!parts.some((p) => p.type === "image" || p.type === "audio" || p.type === "video" || p.type === "document")) return collectText(parts);
	const out = [];
	for (const p of parts) if (p.type === "text") out.push({
		type: "text",
		text: p.content
	});
	else if (p.type === "image" || p.type === "audio" || p.type === "video" || p.type === "document") out.push(p);
	return out;
}
function collectToolCalls(parts) {
	const calls = [];
	for (const p of parts) if (p.type === "tool-call") calls.push({
		id: p.id,
		type: "function",
		function: {
			name: p.name,
			arguments: p.arguments
		}
	});
	return calls.length > 0 ? calls : void 0;
}
function deriveReasoningId(messageId, part) {
	return `${messageId}-reasoning-${part.id ?? hashContent(part.content)}`;
}
function deriveToolMessageId(toolCallId) {
	return `tool-${toolCallId}`;
}
function hashContent(s) {
	let h = 0;
	for (let i = 0; i < s.length; i++) h = h * 31 + s.charCodeAt(i) | 0;
	return Math.abs(h).toString(36);
}
//#endregion
//#region node_modules/.pnpm/@tanstack+ai@0.28.0/node_modules/@tanstack/ai/dist/esm/activities/chat/stream/strategies.js
var ImmediateStrategy = class {
	shouldEmit(_chunk, _accumulated) {
		return true;
	}
};
//#endregion
//#region node_modules/.pnpm/partial-json@0.1.7/node_modules/partial-json/dist/options.js
var require_options = /* @__PURE__ */ __commonJSMin(((exports) => {
	/**
	* Sometimes you don't allow every type to be partially parsed.
	* For example, you may not want a partial number because it may increase its size gradually before it's complete.
	* In this case, you can use the `Allow` object to control what types you allow to be partially parsed.
	* @module
	*/
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.Allow = exports.ALL = exports.COLLECTION = exports.ATOM = exports.SPECIAL = exports.INF = exports._INFINITY = exports.INFINITY = exports.NAN = exports.BOOL = exports.NULL = exports.OBJ = exports.ARR = exports.NUM = exports.STR = void 0;
	/**
	* allow partial strings like `"hello \u12` to be parsed as `"hello "`
	*/
	exports.STR = 1;
	/**
	* allow partial numbers like `123.` to be parsed as `123`
	*/
	exports.NUM = 2;
	/**
	* allow partial arrays like `[1, 2,` to be parsed as `[1, 2]`
	*/
	exports.ARR = 4;
	/**
	* allow partial objects like `{"a": 1, "b":` to be parsed as `{"a": 1}`
	*/
	exports.OBJ = 8;
	/**
	* allow `nu` to be parsed as `null`
	*/
	exports.NULL = 16;
	/**
	* allow `tr` to be parsed as `true`, and `fa` to be parsed as `false`
	*/
	exports.BOOL = 32;
	/**
	* allow `Na` to be parsed as `NaN`
	*/
	exports.NAN = 64;
	/**
	* allow `Inf` to be parsed as `Infinity`
	*/
	exports.INFINITY = 128;
	/**
	* allow `-Inf` to be parsed as `-Infinity`
	*/
	exports._INFINITY = 256;
	exports.INF = exports.INFINITY | exports._INFINITY;
	exports.SPECIAL = exports.NULL | exports.BOOL | exports.INF | exports.NAN;
	exports.ATOM = exports.STR | exports.NUM | exports.SPECIAL;
	exports.COLLECTION = exports.ARR | exports.OBJ;
	exports.ALL = exports.ATOM | exports.COLLECTION;
	/**
	* Control what types you allow to be partially parsed.
	* The default is to allow all types to be partially parsed, which in most casees is the best option.
	* @example
	* If you don't want to allow partial objects, you can use the following code:
	* ```ts
	* import { Allow, parse } from "partial-json";
	* parse(`[{"a": 1, "b": 2}, {"a": 3,`, Allow.ARR); // [ { a: 1, b: 2 } ]
	* ```
	* Or you can use `~` to disallow a type:
	* ```ts
	* parse(`[{"a": 1, "b": 2}, {"a": 3,`, ~Allow.OBJ); // [ { a: 1, b: 2 } ]
	* ```
	* @example
	* If you don't want to allow partial strings, you can use the following code:
	* ```ts
	* import { Allow, parse } from "partial-json";
	* parse(`["complete string", "incompl`, ~Allow.STR); // [ 'complete string' ]
	* ```
	*/
	exports.Allow = {
		STR: exports.STR,
		NUM: exports.NUM,
		ARR: exports.ARR,
		OBJ: exports.OBJ,
		NULL: exports.NULL,
		BOOL: exports.BOOL,
		NAN: exports.NAN,
		INFINITY: exports.INFINITY,
		_INFINITY: exports._INFINITY,
		INF: exports.INF,
		SPECIAL: exports.SPECIAL,
		ATOM: exports.ATOM,
		COLLECTION: exports.COLLECTION,
		ALL: exports.ALL
	};
	exports.default = exports.Allow;
}));
//#endregion
//#region node_modules/.pnpm/@tanstack+ai@0.28.0/node_modules/@tanstack/ai/dist/esm/activities/chat/stream/json-parser.js
var import_dist = (/* @__PURE__ */ __commonJSMin(((exports) => {
	var __createBinding = exports && exports.__createBinding || (Object.create ? (function(o, m, k, k2) {
		if (k2 === void 0) k2 = k;
		var desc = Object.getOwnPropertyDescriptor(m, k);
		if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) desc = {
			enumerable: true,
			get: function() {
				return m[k];
			}
		};
		Object.defineProperty(o, k2, desc);
	}) : (function(o, m, k, k2) {
		if (k2 === void 0) k2 = k;
		o[k2] = m[k];
	}));
	var __exportStar = exports && exports.__exportStar || function(m, exports$1) {
		for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports$1, p)) __createBinding(exports$1, m, p);
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.Allow = exports.MalformedJSON = exports.PartialJSON = exports.parseJSON = exports.parse = void 0;
	var options_1 = require_options();
	Object.defineProperty(exports, "Allow", {
		enumerable: true,
		get: function() {
			return options_1.Allow;
		}
	});
	__exportStar(require_options(), exports);
	var PartialJSON = class extends Error {};
	exports.PartialJSON = PartialJSON;
	var MalformedJSON = class extends Error {};
	exports.MalformedJSON = MalformedJSON;
	/**
	* Parse incomplete JSON
	* @param {string} jsonString Partial JSON to be parsed
	* @param {number} allowPartial Specify what types are allowed to be partial, see {@link Allow} for details
	* @returns The parsed JSON
	* @throws {PartialJSON} If the JSON is incomplete (related to the `allow` parameter)
	* @throws {MalformedJSON} If the JSON is malformed
	*/
	function parseJSON(jsonString, allowPartial = options_1.Allow.ALL) {
		if (typeof jsonString !== "string") throw new TypeError(`expecting str, got ${typeof jsonString}`);
		if (!jsonString.trim()) throw new Error(`${jsonString} is empty`);
		return _parseJSON(jsonString.trim(), allowPartial);
	}
	exports.parseJSON = parseJSON;
	var _parseJSON = (jsonString, allow) => {
		const length = jsonString.length;
		let index = 0;
		const markPartialJSON = (msg) => {
			throw new PartialJSON(`${msg} at position ${index}`);
		};
		const throwMalformedError = (msg) => {
			throw new MalformedJSON(`${msg} at position ${index}`);
		};
		const parseAny = () => {
			skipBlank();
			if (index >= length) markPartialJSON("Unexpected end of input");
			if (jsonString[index] === "\"") return parseStr();
			if (jsonString[index] === "{") return parseObj();
			if (jsonString[index] === "[") return parseArr();
			if (jsonString.substring(index, index + 4) === "null" || options_1.Allow.NULL & allow && length - index < 4 && "null".startsWith(jsonString.substring(index))) {
				index += 4;
				return null;
			}
			if (jsonString.substring(index, index + 4) === "true" || options_1.Allow.BOOL & allow && length - index < 4 && "true".startsWith(jsonString.substring(index))) {
				index += 4;
				return true;
			}
			if (jsonString.substring(index, index + 5) === "false" || options_1.Allow.BOOL & allow && length - index < 5 && "false".startsWith(jsonString.substring(index))) {
				index += 5;
				return false;
			}
			if (jsonString.substring(index, index + 8) === "Infinity" || options_1.Allow.INFINITY & allow && length - index < 8 && "Infinity".startsWith(jsonString.substring(index))) {
				index += 8;
				return Infinity;
			}
			if (jsonString.substring(index, index + 9) === "-Infinity" || options_1.Allow._INFINITY & allow && 1 < length - index && length - index < 9 && "-Infinity".startsWith(jsonString.substring(index))) {
				index += 9;
				return -Infinity;
			}
			if (jsonString.substring(index, index + 3) === "NaN" || options_1.Allow.NAN & allow && length - index < 3 && "NaN".startsWith(jsonString.substring(index))) {
				index += 3;
				return NaN;
			}
			return parseNum();
		};
		const parseStr = () => {
			const start = index;
			let escape = false;
			index++;
			while (index < length && (jsonString[index] !== "\"" || escape && jsonString[index - 1] === "\\")) {
				escape = jsonString[index] === "\\" ? !escape : false;
				index++;
			}
			if (jsonString.charAt(index) == "\"") try {
				return JSON.parse(jsonString.substring(start, ++index - Number(escape)));
			} catch (e) {
				throwMalformedError(String(e));
			}
			else if (options_1.Allow.STR & allow) try {
				return JSON.parse(jsonString.substring(start, index - Number(escape)) + "\"");
			} catch (e) {
				return JSON.parse(jsonString.substring(start, jsonString.lastIndexOf("\\")) + "\"");
			}
			markPartialJSON("Unterminated string literal");
		};
		const parseObj = () => {
			index++;
			skipBlank();
			const obj = {};
			try {
				while (jsonString[index] !== "}") {
					skipBlank();
					if (index >= length && options_1.Allow.OBJ & allow) return obj;
					const key = parseStr();
					skipBlank();
					index++;
					try {
						obj[key] = parseAny();
					} catch (e) {
						if (options_1.Allow.OBJ & allow) return obj;
						else throw e;
					}
					skipBlank();
					if (jsonString[index] === ",") index++;
				}
			} catch (e) {
				if (options_1.Allow.OBJ & allow) return obj;
				else markPartialJSON("Expected '}' at end of object");
			}
			index++;
			return obj;
		};
		const parseArr = () => {
			index++;
			const arr = [];
			try {
				while (jsonString[index] !== "]") {
					arr.push(parseAny());
					skipBlank();
					if (jsonString[index] === ",") index++;
				}
			} catch (e) {
				if (options_1.Allow.ARR & allow) return arr;
				markPartialJSON("Expected ']' at end of array");
			}
			index++;
			return arr;
		};
		const parseNum = () => {
			if (index === 0) {
				if (jsonString === "-") throwMalformedError("Not sure what '-' is");
				try {
					return JSON.parse(jsonString);
				} catch (e) {
					if (options_1.Allow.NUM & allow) try {
						return JSON.parse(jsonString.substring(0, jsonString.lastIndexOf("e")));
					} catch (e) {}
					throwMalformedError(String(e));
				}
			}
			const start = index;
			if (jsonString[index] === "-") index++;
			while (jsonString[index] && ",]}".indexOf(jsonString[index]) === -1) index++;
			if (index == length && !(options_1.Allow.NUM & allow)) markPartialJSON("Unterminated number literal");
			try {
				return JSON.parse(jsonString.substring(start, index));
			} catch (e) {
				if (jsonString.substring(start, index) === "-") markPartialJSON("Not sure what '-' is");
				try {
					return JSON.parse(jsonString.substring(start, jsonString.lastIndexOf("e")));
				} catch (e) {
					throwMalformedError(String(e));
				}
			}
		};
		const skipBlank = () => {
			while (index < length && " \n\r	".includes(jsonString[index])) index++;
		};
		return parseAny();
	};
	exports.parse = parseJSON;
})))();
var PartialJSONParser = class {
	/**
	* Parse a potentially incomplete JSON string
	* @param jsonString - The JSON string to parse (may be incomplete)
	* @returns The parsed object, or undefined if parsing fails
	*/
	parse(jsonString) {
		if (!jsonString || jsonString.trim() === "") return;
		try {
			return (0, import_dist.parse)(jsonString);
		} catch {
			return;
		}
	}
};
var defaultJSONParser = new PartialJSONParser();
function parsePartialJSON(jsonString) {
	return defaultJSONParser.parse(jsonString);
}
//#endregion
//#region node_modules/.pnpm/@tanstack+ai@0.28.0/node_modules/@tanstack/ai/dist/esm/activities/chat/stream/message-updaters.js
function updateTextPart(messages, messageId, content) {
	return messages.map((msg) => {
		if (msg.id !== messageId) return msg;
		const parts = [...msg.parts];
		const lastPart = parts.length > 0 ? parts[parts.length - 1] : null;
		if (lastPart && lastPart.type === "text") parts[parts.length - 1] = {
			type: "text",
			content
		};
		else parts.push({
			type: "text",
			content
		});
		return {
			...msg,
			parts
		};
	});
}
function updateToolCallPart(messages, messageId, toolCall) {
	return messages.map((msg) => {
		if (msg.id !== messageId) return msg;
		const parts = [...msg.parts];
		const existing = parts.find((p) => p.type === "tool-call" && p.id === toolCall.id);
		const metadata = toolCall.metadata ?? existing?.metadata;
		const toolCallPart = {
			type: "tool-call",
			id: toolCall.id,
			name: toolCall.name,
			arguments: toolCall.arguments,
			state: toolCall.state,
			...existing?.approval && { approval: { ...existing.approval } },
			...existing?.output !== void 0 && { output: existing.output },
			...metadata !== void 0 && { metadata }
		};
		if (existing) parts[parts.indexOf(existing)] = toolCallPart;
		else parts.push(toolCallPart);
		return {
			...msg,
			parts
		};
	});
}
function updateToolResultPart(messages, messageId, toolCallId, content, state, error) {
	return messages.map((msg) => {
		if (msg.id !== messageId) return msg;
		const parts = [...msg.parts];
		const resultPartIndex = parts.findIndex((p) => p.type === "tool-result" && p.toolCallId === toolCallId);
		const toolResultPart = {
			type: "tool-result",
			toolCallId,
			content,
			state,
			...error && { error }
		};
		if (resultPartIndex >= 0) parts[resultPartIndex] = toolResultPart;
		else parts.push(toolResultPart);
		return {
			...msg,
			parts
		};
	});
}
function updateToolCallApproval(messages, messageId, toolCallId, approvalId) {
	return messages.map((msg) => {
		if (msg.id !== messageId) return msg;
		const parts = [...msg.parts];
		const toolCallPart = parts.find((p) => p.type === "tool-call" && p.id === toolCallId);
		if (toolCallPart) {
			const index = parts.indexOf(toolCallPart);
			parts[index] = {
				...toolCallPart,
				state: "approval-requested",
				approval: {
					id: approvalId,
					needsApproval: true
				}
			};
		}
		return {
			...msg,
			parts
		};
	});
}
function updateToolCallWithOutput(messages, toolCallId, output, state, errorText) {
	return messages.map((msg) => {
		const parts = [...msg.parts];
		const toolCallPart = parts.find((p) => p.type === "tool-call" && p.id === toolCallId);
		if (toolCallPart) {
			const index = parts.indexOf(toolCallPart);
			parts[index] = {
				...toolCallPart,
				output: errorText ? { error: errorText } : output,
				state: state ?? (errorText ? "input-complete" : "complete")
			};
		}
		return {
			...msg,
			parts
		};
	});
}
function updateToolCallApprovalResponse(messages, approvalId, approved) {
	return messages.map((msg) => {
		const parts = [...msg.parts];
		const toolCallPart = parts.find((p) => p.type === "tool-call" && p.approval?.id === approvalId);
		if (toolCallPart && toolCallPart.approval) {
			const index = parts.indexOf(toolCallPart);
			parts[index] = {
				...toolCallPart,
				approval: {
					...toolCallPart.approval,
					approved
				},
				state: "approval-responded"
			};
		}
		return {
			...msg,
			parts
		};
	});
}
function appendStructuredOutputDelta(messages, messageId, delta) {
	return messages.map((msg) => {
		if (msg.id !== messageId) return msg;
		const parts = [...msg.parts];
		const existingIndex = parts.findIndex((p) => p.type === "structured-output");
		const existing = existingIndex >= 0 ? parts[existingIndex] : null;
		const nextRaw = (existing?.raw ?? "") + delta;
		const progressive = parsePartialJSON(nextRaw);
		const nextPartial = progressive !== void 0 && progressive !== null ? progressive : existing?.partial;
		const nextPart = {
			type: "structured-output",
			status: "streaming",
			raw: nextRaw,
			...nextPartial !== void 0 ? { partial: nextPartial } : {},
			...existing?.reasoning !== void 0 ? { reasoning: existing.reasoning } : {}
		};
		if (existingIndex >= 0) parts[existingIndex] = nextPart;
		else parts.push(nextPart);
		return {
			...msg,
			parts
		};
	});
}
function completeStructuredOutputPart(messages, messageId, data, raw, reasoning) {
	return messages.map((msg) => {
		if (msg.id !== messageId) return msg;
		const parts = [...msg.parts];
		const existingIndex = parts.findIndex((p) => p.type === "structured-output");
		const existingRaw = existingIndex >= 0 ? parts[existingIndex].raw : "";
		let resolvedRaw = raw || existingRaw;
		if (resolvedRaw === "" && data !== void 0) try {
			resolvedRaw = JSON.stringify(data);
		} catch {}
		const nextPart = {
			type: "structured-output",
			status: "complete",
			data,
			partial: data,
			raw: resolvedRaw,
			...reasoning !== void 0 ? { reasoning } : {}
		};
		if (existingIndex >= 0) parts[existingIndex] = nextPart;
		else parts.push(nextPart);
		return {
			...msg,
			parts
		};
	});
}
function errorStructuredOutputPart(messages, messageId, errorMessage) {
	return messages.map((msg) => {
		if (msg.id !== messageId) return msg;
		const parts = [...msg.parts];
		const existingIndex = parts.findIndex((p) => p.type === "structured-output");
		if (existingIndex < 0) {
			parts.push({
				type: "structured-output",
				status: "error",
				raw: "",
				errorMessage
			});
			return {
				...msg,
				parts
			};
		}
		const existing = parts[existingIndex];
		if (existing.status === "complete") return msg;
		parts[existingIndex] = {
			...existing,
			status: "error",
			errorMessage
		};
		return {
			...msg,
			parts
		};
	});
}
function updateThinkingPart(messages, messageId, stepId, content, signature) {
	return messages.map((msg) => {
		if (msg.id !== messageId) return msg;
		const parts = [...msg.parts];
		const thinkingPartIndex = parts.findIndex((p) => p.type === "thinking" && p.stepId === stepId);
		const thinkingPart = {
			type: "thinking",
			content,
			stepId,
			...signature && { signature }
		};
		if (thinkingPartIndex >= 0) parts[thinkingPartIndex] = thinkingPart;
		else parts.push(thinkingPart);
		return {
			...msg,
			parts
		};
	});
}
//#endregion
//#region node_modules/.pnpm/@tanstack+ai@0.28.0/node_modules/@tanstack/ai/dist/esm/activities/chat/stream/processor.js
var STRUCTURED_OUTPUT_UPDATE_BATCH_SIZE = 12;
var StreamProcessor = class StreamProcessor {
	chunkStrategy;
	events;
	jsonParser;
	recordingEnabled;
	messages = [];
	messageStates = /* @__PURE__ */ new Map();
	activeMessageIds = /* @__PURE__ */ new Set();
	toolCallToMessage = /* @__PURE__ */ new Map();
	pendingManualMessageId = null;
	pendingThinkingStepId = null;
	structuredMessageIds = /* @__PURE__ */ new Set();
	structuredOutputUpdateBatches = /* @__PURE__ */ new Map();
	activeRuns = /* @__PURE__ */ new Set();
	finishReason = null;
	hasError = false;
	isDone = false;
	recording = null;
	recordingStartTime = 0;
	constructor(options = {}) {
		this.chunkStrategy = options.chunkStrategy || new ImmediateStrategy();
		this.events = options.events || {};
		this.jsonParser = options.jsonParser || defaultJSONParser;
		this.recordingEnabled = options.recording ?? false;
		if (options.initialMessages) this.messages = [...options.initialMessages];
	}
	/**
	* Set the messages array (e.g., from persisted state)
	*/
	setMessages(messages) {
		this.messages = [...messages];
		this.emitMessagesChange();
	}
	/**
	* Add a user message to the conversation.
	* Supports both simple string content and multimodal content arrays.
	*
	* @param content - The message content (string or array of content parts)
	* @param id - Optional custom message ID (generated if not provided)
	* @returns The created UIMessage
	*
	* @example
	* ```ts
	* // Simple text message
	* processor.addUserMessage('Hello!')
	*
	* // Multimodal message with image
	* processor.addUserMessage([
	*   { type: 'text', content: 'What is in this image?' },
	*   { type: 'image', source: { type: 'url', value: 'https://example.com/photo.jpg' } }
	* ])
	*
	* // With custom ID
	* processor.addUserMessage('Hello!', 'custom-id-123')
	* ```
	*/
	addUserMessage(content, id) {
		const parts = typeof content === "string" ? [{
			type: "text",
			content
		}] : content.map((part) => {
			return part;
		});
		const userMessage = {
			id: id ?? generateMessageId$1(),
			role: "user",
			parts,
			createdAt: /* @__PURE__ */ new Date()
		};
		this.messages = [...this.messages, userMessage];
		this.emitMessagesChange();
		return userMessage;
	}
	/**
	* Prepare for a new assistant message stream.
	* Does NOT create the message immediately -- the message is created lazily
	* when the first content-bearing chunk arrives via ensureAssistantMessage().
	* This prevents empty assistant messages from flickering in the UI when
	* auto-continuation produces no content.
	*/
	prepareAssistantMessage() {
		this.resetStreamState();
	}
	/**
	* @deprecated Use prepareAssistantMessage() instead. This eagerly creates
	* an assistant message which can cause empty message flicker.
	*/
	startAssistantMessage(messageId) {
		this.prepareAssistantMessage();
		const { messageId: id } = this.ensureAssistantMessage(messageId);
		this.pendingManualMessageId = id;
		return id;
	}
	/**
	* Get the current assistant message ID (if one has been created).
	* Returns null if prepareAssistantMessage() was called but no content
	* has arrived yet.
	*/
	getCurrentAssistantMessageId() {
		let lastId = null;
		for (const [id, state] of this.messageStates) if (state.role === "assistant") lastId = id;
		return lastId;
	}
	/**
	* Add a tool result (called by client after handling onToolCall)
	*/
	addToolResult(toolCallId, output, error) {
		const messageWithToolCall = this.messages.find((msg) => msg.parts.some((p) => p.type === "tool-call" && p.id === toolCallId));
		if (!messageWithToolCall) {
			console.warn(`[StreamProcessor] Could not find message with tool call ${toolCallId}`);
			return;
		}
		let updatedMessages = updateToolCallWithOutput(this.messages, toolCallId, output, error ? "input-complete" : void 0, error);
		const content = normalizeToolResult$1(output);
		const toolResultState = error ? "error" : "complete";
		updatedMessages = updateToolResultPart(updatedMessages, messageWithToolCall.id, toolCallId, content, toolResultState, error);
		this.messages = updatedMessages;
		this.emitMessagesChange();
	}
	/**
	* Add an approval response (called by client after handling onApprovalRequest)
	*/
	addToolApprovalResponse(approvalId, approved) {
		this.messages = updateToolCallApprovalResponse(this.messages, approvalId, approved);
		this.emitMessagesChange();
	}
	/**
	* Get the conversation as ModelMessages (for sending to LLM)
	*/
	toModelMessages() {
		const modelMessages = [];
		for (const msg of this.messages) modelMessages.push(...uiMessageToModelMessages$1(msg));
		return modelMessages;
	}
	/**
	* Get current messages
	*/
	getMessages() {
		return this.messages;
	}
	/**
	* Check if all tool calls in the last assistant message are complete
	* Useful for auto-continue logic
	*/
	areAllToolsComplete() {
		const lastAssistant = this.messages.findLast((m) => m.role === "assistant");
		if (!lastAssistant) return true;
		const toolParts = lastAssistant.parts.filter((p) => p.type === "tool-call");
		if (toolParts.length === 0) return true;
		const toolResultIds = new Set(lastAssistant.parts.filter((p) => p.type === "tool-result").map((p) => p.toolCallId));
		return toolParts.every((part) => part.state === "complete" || part.state === "approval-responded" || part.output !== void 0 && !part.approval || toolResultIds.has(part.id));
	}
	/**
	* Remove messages after a certain index (for reload/retry)
	*/
	removeMessagesAfter(index) {
		const keptIds = new Set(this.messages.slice(0, index + 1).map((m) => m.id));
		for (const id of this.structuredMessageIds) if (!keptIds.has(id)) this.structuredMessageIds.delete(id);
		for (const id of this.structuredOutputUpdateBatches.keys()) if (!keptIds.has(id)) this.structuredOutputUpdateBatches.delete(id);
		for (const id of this.messageStates.keys()) if (!keptIds.has(id)) this.messageStates.delete(id);
		for (const [toolCallId, msgId] of this.toolCallToMessage) if (!keptIds.has(msgId)) this.toolCallToMessage.delete(toolCallId);
		for (const id of this.activeMessageIds) if (!keptIds.has(id)) this.activeMessageIds.delete(id);
		this.messages = this.messages.slice(0, index + 1);
		this.emitMessagesChange();
	}
	/**
	* Clear all messages
	*/
	clearMessages() {
		this.messages = [];
		this.messageStates.clear();
		this.activeMessageIds.clear();
		this.toolCallToMessage.clear();
		this.structuredMessageIds.clear();
		this.structuredOutputUpdateBatches.clear();
		this.pendingManualMessageId = null;
		this.emitMessagesChange();
	}
	/**
	* Process a stream and emit events through handlers
	*/
	async process(stream) {
		this.resetStreamState();
		if (this.recordingEnabled) this.startRecording();
		for await (const chunk of stream) this.processChunk(chunk);
		this.finalizeStream();
		if (this.recording) this.recording.result = this.getResult();
		return this.getResult();
	}
	/**
	* Process a single chunk from the stream.
	*
	* Central dispatch for all AG-UI events. Each event type maps to a specific
	* handler. Events not listed in the switch are intentionally ignored
	* (STEP_STARTED, STATE_SNAPSHOT, STATE_DELTA).
	*
	* @see docs/chat-architecture.md#adapter-contract — Expected event types and ordering
	*/
	processChunk(chunk) {
		if (this.recording) this.recording.chunks.push({
			chunk,
			timestamp: Date.now(),
			index: this.recording.chunks.length
		});
		switch (chunk.type) {
			case "TEXT_MESSAGE_START":
				this.handleTextMessageStartEvent(chunk);
				break;
			case "TEXT_MESSAGE_CONTENT":
				this.handleTextMessageContentEvent(chunk);
				break;
			case "TEXT_MESSAGE_END":
				this.handleTextMessageEndEvent(chunk);
				break;
			case "TOOL_CALL_START":
				this.handleToolCallStartEvent(chunk);
				break;
			case "TOOL_CALL_ARGS":
				this.handleToolCallArgsEvent(chunk);
				break;
			case "TOOL_CALL_END":
				this.handleToolCallEndEvent(chunk);
				break;
			case "RUN_FINISHED":
				this.handleRunFinishedEvent(chunk);
				break;
			case "RUN_ERROR":
				this.handleRunErrorEvent(chunk);
				break;
			case "STEP_FINISHED":
				this.handleStepFinishedEvent(chunk);
				break;
			case "MESSAGES_SNAPSHOT":
				this.handleMessagesSnapshotEvent(chunk);
				break;
			case "CUSTOM":
				this.handleCustomEvent(chunk);
				break;
			case "RUN_STARTED":
				this.handleRunStartedEvent(chunk);
				break;
			case "REASONING_START":
			case "REASONING_MESSAGE_START":
			case "REASONING_MESSAGE_END":
			case "REASONING_END": break;
			case "REASONING_MESSAGE_CONTENT":
				this.handleReasoningMessageContentEvent(chunk);
				break;
			case "TOOL_CALL_RESULT":
				this.handleToolCallResultEvent(chunk);
				break;
			case "STEP_STARTED":
				this.handleStepStartedEvent(chunk);
				break;
		}
	}
	/**
	* Create a new MessageStreamState for a message
	*/
	createMessageState(messageId, role) {
		const state = {
			id: messageId,
			role,
			totalTextContent: "",
			currentSegmentText: "",
			lastEmittedText: "",
			hasSeenReasoningEvents: false,
			thinkingSteps: /* @__PURE__ */ new Map(),
			thinkingStepSignatures: /* @__PURE__ */ new Map(),
			thinkingStepOrder: [],
			currentThinkingStepId: null,
			toolCalls: /* @__PURE__ */ new Map(),
			toolCallOrder: [],
			hasToolCallsSinceTextStart: false,
			isComplete: false
		};
		this.messageStates.set(messageId, state);
		return state;
	}
	/**
	* Get the MessageStreamState for a message
	*/
	getMessageState(messageId) {
		return this.messageStates.get(messageId);
	}
	/**
	* Promote a pending stepId from a STEP_STARTED that fired before the
	* assistant message existed onto the given message state, so the next
	* thinking event (STEP_FINISHED or REASONING_MESSAGE_CONTENT) attributes
	* to the correct step.
	*/
	consumePendingThinkingStep(state) {
		if (!this.pendingThinkingStepId) return;
		const stepId = this.pendingThinkingStepId;
		state.currentThinkingStepId = stepId;
		if (!state.thinkingSteps.has(stepId)) {
			state.thinkingSteps.set(stepId, "");
			state.thinkingStepOrder.push(stepId);
		}
		this.pendingThinkingStepId = null;
	}
	/**
	* Get the most recent active assistant message ID.
	* Used as fallback for events that don't include a messageId.
	*/
	getActiveAssistantMessageId() {
		const ids = Array.from(this.activeMessageIds).reverse();
		for (const id of ids) {
			const state = this.messageStates.get(id);
			if (state && state.role === "assistant") return id;
		}
		return null;
	}
	/**
	* Ensure an active assistant message exists, creating one if needed.
	* Used for backward compat when events arrive without prior TEXT_MESSAGE_START.
	*
	* On reconnect/resume, a TEXT_MESSAGE_CONTENT may arrive for a message that
	* already exists in this.messages (e.g. from initialMessages or a prior
	* MESSAGES_SNAPSHOT) but whose transient state was cleared. In that case we
	* hydrate state from the existing message rather than creating a duplicate.
	*/
	ensureAssistantMessage(preferredId) {
		if (preferredId) {
			const state2 = this.getMessageState(preferredId);
			if (state2) return {
				messageId: preferredId,
				state: state2
			};
		}
		const activeId = this.getActiveAssistantMessageId();
		if (activeId) {
			const state2 = this.getMessageState(activeId);
			if (state2) return {
				messageId: activeId,
				state: state2
			};
		}
		if (preferredId) {
			const existingMsg = this.messages.find((m) => m.id === preferredId);
			if (existingMsg) {
				const state2 = this.createMessageState(preferredId, existingMsg.role);
				this.activeMessageIds.add(preferredId);
				const lastPart = existingMsg.parts.length > 0 ? existingMsg.parts[existingMsg.parts.length - 1] : null;
				if (lastPart && lastPart.type === "text") {
					state2.currentSegmentText = lastPart.content;
					state2.lastEmittedText = lastPart.content;
					state2.totalTextContent = lastPart.content;
				}
				return {
					messageId: preferredId,
					state: state2
				};
			}
		}
		const id = preferredId || generateMessageId$1();
		const assistantMessage = {
			id,
			role: "assistant",
			parts: [],
			createdAt: /* @__PURE__ */ new Date()
		};
		this.messages = [...this.messages, assistantMessage];
		const state = this.createMessageState(id, "assistant");
		this.activeMessageIds.add(id);
		this.pendingManualMessageId = id;
		this.events.onStreamStart?.();
		this.emitMessagesChange();
		return {
			messageId: id,
			state
		};
	}
	/**
	* Handle TEXT_MESSAGE_START event
	*/
	handleTextMessageStartEvent(chunk) {
		const { messageId, role } = chunk;
		const uiRole = role === "user" || role === "system" ? role : "assistant";
		if (this.pendingManualMessageId) {
			const pendingId = this.pendingManualMessageId;
			this.pendingManualMessageId = null;
			if (pendingId !== messageId) {
				this.messages = this.messages.map((msg) => msg.id === pendingId ? {
					...msg,
					id: messageId
				} : msg);
				const existingState = this.messageStates.get(pendingId);
				if (existingState) {
					existingState.id = messageId;
					this.messageStates.delete(pendingId);
					this.messageStates.set(messageId, existingState);
				}
				this.activeMessageIds.delete(pendingId);
				this.activeMessageIds.add(messageId);
			}
			if (!this.messageStates.has(messageId)) {
				this.createMessageState(messageId, uiRole);
				this.activeMessageIds.add(messageId);
			}
			this.emitMessagesChange();
			return;
		}
		if (this.messages.find((m) => m.id === messageId)) {
			this.activeMessageIds.add(messageId);
			const existingState = this.messageStates.get(messageId);
			if (!existingState) this.createMessageState(messageId, uiRole);
			else if (existingState.hasToolCallsSinceTextStart) {
				if (existingState.currentSegmentText !== existingState.lastEmittedText) this.emitTextUpdateForMessage(messageId);
				existingState.currentSegmentText = "";
				existingState.lastEmittedText = "";
				existingState.hasToolCallsSinceTextStart = false;
			}
			return;
		}
		const newMessage = {
			id: messageId,
			role: uiRole,
			parts: [],
			createdAt: /* @__PURE__ */ new Date()
		};
		this.messages = [...this.messages, newMessage];
		this.createMessageState(messageId, uiRole);
		this.activeMessageIds.add(messageId);
		this.events.onStreamStart?.();
		this.emitMessagesChange();
	}
	/**
	* Handle TEXT_MESSAGE_END event
	*/
	handleTextMessageEndEvent(chunk) {
		const { messageId } = chunk;
		const state = this.getMessageState(messageId);
		if (!state) return;
		if (state.isComplete) return;
		if (state.currentSegmentText !== state.lastEmittedText) this.emitTextUpdateForMessage(messageId);
		this.completeAllToolCallsForMessage(messageId);
	}
	/**
	* Handle MESSAGES_SNAPSHOT event
	*/
	handleMessagesSnapshotEvent(chunk) {
		this.resetStreamState();
		this.messages = [...chunk.messages];
		this.emitMessagesChange();
	}
	/**
	* Handle TEXT_MESSAGE_CONTENT event.
	*
	* Accumulates delta into both currentSegmentText (for UI emission) and
	* totalTextContent (for ProcessorResult). Lazily creates the assistant
	* UIMessage on first content. Uses updateTextPart() which replaces the
	* last TextPart or creates a new one depending on part ordering.
	*
	* @see docs/chat-architecture.md#single-shot-text-response — Text accumulation step-by-step
	* @see docs/chat-architecture.md#uimessage-part-ordering-invariants — Replace vs. push logic
	*/
	handleTextMessageContentEvent(chunk) {
		const { messageId, state } = this.ensureAssistantMessage(chunk.messageId);
		this.completeAllToolCallsForMessage(messageId);
		if (this.structuredMessageIds.has(messageId)) {
			let delta2 = chunk.delta || "";
			if (delta2 === "" && chunk.content !== void 0 && chunk.content !== "") {
				const existingRaw = (this.messages.find((m) => m.id === messageId)?.parts.find((p) => p.type === "structured-output") ?? { raw: "" }).raw;
				if (chunk.content.startsWith(existingRaw)) delta2 = chunk.content.slice(existingRaw.length);
				else if (existingRaw.startsWith(chunk.content)) delta2 = "";
				else delta2 = chunk.content;
			}
			if (delta2 !== "") {
				this.messages = appendStructuredOutputDelta(this.messages, messageId, delta2);
				state.totalTextContent += delta2;
				this.queueStructuredOutputUpdate(messageId, delta2);
				this.emitMessagesChange();
			}
			return;
		}
		const previousSegment = state.currentSegmentText;
		if (state.hasToolCallsSinceTextStart && previousSegment.length > 0 && this.isNewTextSegment(chunk, previousSegment)) {
			if (previousSegment !== state.lastEmittedText) this.emitTextUpdateForMessage(messageId);
			state.currentSegmentText = "";
			state.lastEmittedText = "";
			state.hasToolCallsSinceTextStart = false;
		}
		const currentText = state.currentSegmentText;
		let nextText = currentText;
		const delta = chunk.delta || "";
		if (delta !== "") nextText = currentText + delta;
		else if (chunk.content !== void 0 && chunk.content !== "") if (chunk.content.startsWith(currentText)) nextText = chunk.content;
		else if (currentText.startsWith(chunk.content)) nextText = currentText;
		else nextText = currentText + chunk.content;
		const textDelta = nextText.slice(currentText.length);
		state.currentSegmentText = nextText;
		state.totalTextContent += textDelta;
		const chunkPortion = chunk.delta || chunk.content || "";
		if (this.chunkStrategy.shouldEmit(chunkPortion, state.currentSegmentText) && state.currentSegmentText !== state.lastEmittedText) this.emitTextUpdateForMessage(messageId);
	}
	/**
	* Handle TOOL_CALL_START event.
	*
	* Creates a new InternalToolCallState entry in the toolCalls Map and appends
	* a ToolCallPart to the UIMessage. Duplicate toolCallId is a no-op.
	*
	* CRITICAL: This MUST be received before any TOOL_CALL_ARGS for the same
	* toolCallId. Args for unknown IDs are silently dropped.
	*
	* @see docs/chat-architecture.md#single-shot-tool-call-response — Tool call state transitions
	* @see docs/chat-architecture.md#parallel-tool-calls-single-shot — Parallel tracking by ID
	* @see docs/chat-architecture.md#adapter-contract — Ordering requirements
	*/
	handleToolCallStartEvent(chunk) {
		const targetMessageId = chunk.parentMessageId ?? this.getActiveAssistantMessageId();
		const { messageId, state } = this.ensureAssistantMessage(targetMessageId ?? void 0);
		state.hasToolCallsSinceTextStart = true;
		const toolCallId = chunk.toolCallId;
		if (!state.toolCalls.get(toolCallId)) {
			const initialState = "awaiting-input";
			const toolName = chunk.toolCallName ?? chunk.toolName;
			const chunkMetadata = chunk.metadata;
			const newToolCall = {
				id: chunk.toolCallId,
				name: toolName,
				arguments: "",
				state: initialState,
				parsedArguments: void 0,
				index: chunk.index ?? state.toolCalls.size,
				...chunkMetadata !== void 0 && { metadata: chunkMetadata }
			};
			state.toolCalls.set(toolCallId, newToolCall);
			state.toolCallOrder.push(toolCallId);
			this.toolCallToMessage.set(toolCallId, messageId);
			this.messages = updateToolCallPart(this.messages, messageId, {
				id: chunk.toolCallId,
				name: toolName,
				arguments: "",
				state: initialState,
				...chunkMetadata !== void 0 && { metadata: chunkMetadata }
			});
			this.emitMessagesChange();
			this.events.onToolCallStateChange?.(messageId, chunk.toolCallId, initialState, "");
		}
	}
	/**
	* Handle TOOL_CALL_ARGS event.
	*
	* Appends the delta to the tool call's accumulated arguments string.
	* Transitions state from awaiting-input → input-streaming on first non-empty delta.
	* Attempts partial JSON parse on each update for UI preview.
	*
	* If toolCallId is not found in the Map (no preceding TOOL_CALL_START),
	* this event is silently dropped.
	*
	* @see docs/chat-architecture.md#single-shot-tool-call-response — Step-by-step tool call processing
	*/
	handleToolCallArgsEvent(chunk) {
		const toolCallId = chunk.toolCallId;
		const messageId = this.toolCallToMessage.get(toolCallId);
		if (!messageId) return;
		const state = this.getMessageState(messageId);
		if (!state) return;
		const existingToolCall = state.toolCalls.get(toolCallId);
		if (!existingToolCall) return;
		const wasAwaitingInput = existingToolCall.state === "awaiting-input";
		existingToolCall.arguments += chunk.delta || "";
		if (wasAwaitingInput && chunk.delta) existingToolCall.state = "input-streaming";
		existingToolCall.parsedArguments = this.jsonParser.parse(existingToolCall.arguments);
		this.messages = updateToolCallPart(this.messages, messageId, {
			id: existingToolCall.id,
			name: existingToolCall.name,
			arguments: existingToolCall.arguments,
			state: existingToolCall.state
		});
		this.emitMessagesChange();
		this.events.onToolCallStateChange?.(messageId, existingToolCall.id, existingToolCall.state, existingToolCall.arguments);
	}
	/**
	* Handle TOOL_CALL_END event — authoritative signal that a tool call's input is finalized.
	*
	* This event has a DUAL ROLE:
	* - Without `result`: Signals arguments are done (from adapter). Transitions to input-complete.
	* - With `result`: Signals tool was executed and result is available (from TextEngine).
	*   Creates both output on the tool-call part AND a tool-result part.
	*
	* If `input` is provided, it overrides the accumulated string parse as the
	* canonical parsed arguments.
	*
	* @see docs/chat-architecture.md#tool-results-and-the-tool_call_end-dual-role — Full explanation
	* @see docs/chat-architecture.md#single-shot-tool-call-response — End-to-end flow
	*/
	handleToolCallEndEvent(chunk) {
		const messageId = this.toolCallToMessage.get(chunk.toolCallId);
		if (!messageId) return;
		const msgState = this.getMessageState(messageId);
		if (!msgState) return;
		const existingToolCall = msgState.toolCalls.get(chunk.toolCallId);
		if (existingToolCall && existingToolCall.state !== "input-complete") {
			if (chunk.input !== void 0 && !existingToolCall.arguments) existingToolCall.arguments = JSON.stringify(chunk.input);
			const index = msgState.toolCallOrder.indexOf(chunk.toolCallId);
			this.completeToolCall(messageId, index, existingToolCall);
			if (chunk.input !== void 0) existingToolCall.parsedArguments = chunk.input;
		}
		if (chunk.result) {
			let output;
			if (Array.isArray(chunk.result)) output = chunk.result;
			else try {
				output = JSON.parse(chunk.result);
			} catch {
				output = chunk.result;
			}
			this.messages = updateToolCallWithOutput(this.messages, chunk.toolCallId, output, chunk.state === "output-error" ? "input-complete" : void 0);
			const resultState = chunk.state === "output-error" ? "error" : "complete";
			this.messages = updateToolResultPart(this.messages, messageId, chunk.toolCallId, chunk.result, resultState, resultState === "error" ? this.extractToolResultError(output) : void 0);
			this.emitMessagesChange();
		}
	}
	extractToolResultError(output) {
		if (output && typeof output === "object" && "error" in output && typeof output.error === "string") return output.error;
		return typeof output === "string" ? output : "Tool execution failed";
	}
	/**
	* Handle TOOL_CALL_RESULT event (AG-UI spec).
	*
	* Creates a tool-result part and updates the tool-call output field,
	* mirroring the logic from TOOL_CALL_END when it carries a result.
	* This is the spec-compliant path for delivering tool results to the client.
	*/
	handleToolCallResultEvent(chunk) {
		const messageId = this.toolCallToMessage.get(chunk.toolCallId);
		if (!messageId) return;
		let output;
		try {
			output = JSON.parse(chunk.content);
		} catch {
			output = chunk.content;
		}
		this.messages = updateToolCallWithOutput(this.messages, chunk.toolCallId, output, chunk.state === "output-error" ? "input-complete" : void 0);
		const resultState = chunk.state === "output-error" ? "error" : "complete";
		this.messages = updateToolResultPart(this.messages, messageId, chunk.toolCallId, chunk.content, resultState, resultState === "error" ? this.extractToolResultError(output) : void 0);
		this.emitMessagesChange();
	}
	/**
	* Handle RUN_STARTED event.
	*
	* Registers the run so that RUN_FINISHED can determine whether other
	* runs are still active before finalizing.
	*/
	handleRunStartedEvent(chunk) {
		this.activeRuns.add(chunk.runId);
	}
	/**
	* Handle RUN_FINISHED event.
	*
	* Records the finishReason and removes the run from activeRuns.
	* Only finalizes when no more runs are active, so that concurrent
	* runs don't interfere with each other.
	*
	* @see docs/chat-architecture.md#single-shot-tool-call-response — finishReason semantics
	* @see docs/chat-architecture.md#adapter-contract — Why RUN_FINISHED is mandatory
	*/
	handleRunFinishedEvent(chunk) {
		this.finishReason = chunk.finishReason ?? null;
		this.activeRuns.delete(chunk.runId);
		if (this.activeRuns.size === 0) {
			this.isDone = true;
			this.completeAllToolCalls();
			this.finalizeStream();
		}
	}
	/**
	* Handle RUN_ERROR event
	*/
	handleRunErrorEvent(chunk) {
		this.hasError = true;
		const runId = "runId" in chunk && typeof chunk.runId === "string" ? chunk.runId : void 0;
		if (runId) this.activeRuns.delete(runId);
		else this.activeRuns.clear();
		const { messageId } = this.ensureAssistantMessage();
		const errorMessage = chunk.message || chunk.error?.message || "An error occurred";
		if (!chunk.message && !chunk.error?.message) console.error("[StreamProcessor] RUN_ERROR with no message; original chunk:", chunk);
		if (this.structuredMessageIds.has(messageId)) {
			this.flushStructuredOutputUpdate(messageId);
			this.messages = errorStructuredOutputPart(this.messages, messageId, errorMessage);
			this.structuredMessageIds.delete(messageId);
			this.emitStructuredOutputChange(messageId, "error");
			this.emitMessagesChange();
		}
		const error = new Error(errorMessage);
		const code = chunk.code ?? chunk.error?.code;
		if (code !== void 0) Object.assign(error, { code });
		if (chunk.rawEvent !== void 0) Object.assign(error, { rawEvent: chunk.rawEvent });
		this.events.onError?.(error);
	}
	/**
	* Handle STEP_STARTED event (for thinking/reasoning content).
	*
	* Records the stepId so that subsequent STEP_FINISHED deltas accumulate
	* into their own ThinkingPart. Does not create a message — the message
	* is lazily created when the first STEP_FINISHED content arrives.
	*/
	handleStepStartedEvent(chunk) {
		const stepId = chunk.stepId ?? generateMessageId$1();
		const activeId = this.getActiveAssistantMessageId();
		if (activeId) {
			const state = this.getMessageState(activeId);
			if (state) {
				state.currentThinkingStepId = stepId;
				if (!state.thinkingSteps.has(stepId)) {
					state.thinkingSteps.set(stepId, "");
					state.thinkingStepOrder.push(stepId);
				}
				this.pendingThinkingStepId = null;
				return;
			}
		}
		this.pendingThinkingStepId = stepId;
	}
	/**
	* Handle STEP_FINISHED event (for thinking/reasoning content).
	*
	* Accumulates delta into the current thinking step's content and updates
	* the corresponding ThinkingPart in the UIMessage.
	*
	* @see docs/chat-architecture.md#thinkingreasoning-content — Thinking flow
	*/
	handleStepFinishedEvent(chunk) {
		const { messageId, state } = this.ensureAssistantMessage(this.getActiveAssistantMessageId() ?? void 0);
		if (state.hasSeenReasoningEvents) {
			if (chunk.signature) {
				const stepId2 = state.currentThinkingStepId ?? chunk.stepId;
				if (!stepId2) return;
				const thinking = state.thinkingSteps.get(stepId2);
				if (thinking !== void 0) {
					state.thinkingStepSignatures.set(stepId2, chunk.signature);
					this.messages = updateThinkingPart(this.messages, messageId, stepId2, thinking, chunk.signature);
					this.emitMessagesChange();
				}
			}
			return;
		}
		this.consumePendingThinkingStep(state);
		const stepId = state.currentThinkingStepId ?? chunk.stepId ?? generateMessageId$1();
		if (!state.thinkingSteps.has(stepId)) {
			state.thinkingSteps.set(stepId, "");
			state.thinkingStepOrder.push(stepId);
			state.currentThinkingStepId = stepId;
		}
		const previous = state.thinkingSteps.get(stepId) ?? "";
		let nextThinking = previous;
		if (chunk.delta && chunk.delta !== "") nextThinking = previous + chunk.delta;
		else if (chunk.content && chunk.content !== "") if (chunk.content.startsWith(previous)) nextThinking = chunk.content;
		else if (previous.startsWith(chunk.content)) nextThinking = previous;
		else nextThinking = previous + chunk.content;
		state.thinkingSteps.set(stepId, nextThinking);
		if (chunk.signature) state.thinkingStepSignatures.set(stepId, chunk.signature);
		this.messages = updateThinkingPart(this.messages, messageId, stepId, nextThinking, state.thinkingStepSignatures.get(stepId));
		this.emitMessagesChange();
		this.events.onThinkingUpdate?.(messageId, stepId, nextThinking);
	}
	/**
	* Handle REASONING_MESSAGE_CONTENT event (AG-UI reasoning protocol).
	*
	* Accumulates reasoning delta into thinking content and updates the
	* corresponding ThinkingPart in the UIMessage.
	*/
	handleReasoningMessageContentEvent(chunk) {
		const { messageId, state } = this.ensureAssistantMessage(this.getActiveAssistantMessageId() ?? void 0);
		state.hasSeenReasoningEvents = true;
		const delta = chunk.delta || "";
		this.consumePendingThinkingStep(state);
		const stepId = state.currentThinkingStepId ?? chunk.messageId;
		if (!state.thinkingSteps.has(stepId)) {
			state.thinkingSteps.set(stepId, "");
			state.thinkingStepOrder.push(stepId);
			state.currentThinkingStepId = stepId;
		}
		const nextThinking = (state.thinkingSteps.get(stepId) ?? "") + delta;
		state.thinkingSteps.set(stepId, nextThinking);
		this.messages = updateThinkingPart(this.messages, messageId, stepId, nextThinking, state.thinkingStepSignatures.get(stepId));
		this.emitMessagesChange();
		this.events.onThinkingUpdate?.(messageId, stepId, nextThinking);
	}
	/**
	* Handle CUSTOM event.
	*
	* Handles special custom events emitted by the TextEngine (not adapters):
	* - 'tool-input-available': Client tool needs execution. Fires onToolCall.
	* - 'approval-requested': Tool needs user approval. Updates tool-call part
	*   state and fires onApprovalRequest.
	*
	* @see docs/chat-architecture.md#client-tools-and-approval-flows — Full flow details
	*/
	handleCustomEvent(chunk) {
		const messageId = this.getActiveAssistantMessageId();
		if (chunk.name === "structured-output.start" && chunk.value) {
			const targetId = chunk.value.messageId ?? messageId;
			if (targetId) {
				this.ensureAssistantMessage(targetId);
				this.structuredMessageIds.add(targetId);
				this.structuredOutputUpdateBatches.delete(targetId);
				this.events.onStructuredOutputChange?.({
					phase: "start",
					messageId: targetId,
					status: "streaming",
					raw: ""
				});
			}
			return;
		}
		if (chunk.name === "structured-output.complete" && chunk.value) {
			const v = chunk.value;
			const targetId = v.messageId ?? messageId;
			if (targetId) {
				this.flushStructuredOutputUpdate(targetId);
				this.messages = completeStructuredOutputPart(this.messages, targetId, v.object, v.raw ?? "", v.reasoning);
				this.structuredMessageIds.delete(targetId);
				this.emitStructuredOutputChange(targetId, "complete");
				this.emitMessagesChange();
			}
		}
		if (chunk.name === "tool-input-available" && chunk.value) {
			const { toolCallId, toolName, input } = chunk.value;
			this.events.onToolCall?.({
				toolCallId,
				toolName,
				input
			});
			return;
		}
		if (chunk.name === "approval-requested" && chunk.value) {
			const { toolCallId, toolName, input, approval } = chunk.value;
			const resolvedMessageId = messageId ?? this.toolCallToMessage.get(toolCallId);
			if (resolvedMessageId) {
				this.messages = updateToolCallApproval(this.messages, resolvedMessageId, toolCallId, approval.id);
				this.emitMessagesChange();
			}
			this.events.onApprovalRequest?.({
				toolCallId,
				toolName,
				input,
				approvalId: approval.id
			});
			return;
		}
		if (this.events.onCustomEvent) {
			const toolCallId = chunk.value && typeof chunk.value === "object" ? chunk.value.toolCallId : void 0;
			this.events.onCustomEvent(chunk.name, chunk.value, { toolCallId });
		}
	}
	/**
	* Detect if an incoming content chunk represents a NEW text segment
	*/
	isNewTextSegment(chunk, previous) {
		if (chunk.content !== void 0) {
			if (chunk.content.length < previous.length) return true;
			if (!chunk.content.startsWith(previous) && !previous.startsWith(chunk.content)) return true;
		}
		return false;
	}
	/**
	* Complete all tool calls across all active messages — safety net for stream termination.
	*
	* Called by RUN_FINISHED and finalizeStream(). Force-transitions any tool call
	* not yet in input-complete state. Handles cases where TOOL_CALL_END was
	* missed (adapter bug, network error, aborted stream).
	*
	* @see docs/chat-architecture.md#single-shot-tool-call-response — Safety net behavior
	*/
	completeAllToolCalls() {
		for (const messageId of this.activeMessageIds) this.completeAllToolCallsForMessage(messageId);
	}
	/**
	* Complete all tool calls for a specific message
	*/
	completeAllToolCallsForMessage(messageId) {
		const state = this.getMessageState(messageId);
		if (!state) return;
		state.toolCalls.forEach((toolCall, id) => {
			if (toolCall.state !== "input-complete") {
				const index = state.toolCallOrder.indexOf(id);
				this.completeToolCall(messageId, index, toolCall);
			}
		});
	}
	/**
	* Mark a tool call as complete and emit event
	*/
	completeToolCall(messageId, _index, toolCall) {
		toolCall.state = "input-complete";
		toolCall.parsedArguments = this.jsonParser.parse(toolCall.arguments);
		this.messages = updateToolCallPart(this.messages, messageId, {
			id: toolCall.id,
			name: toolCall.name,
			arguments: toolCall.arguments,
			state: "input-complete",
			...toolCall.metadata !== void 0 && { metadata: toolCall.metadata }
		});
		this.emitMessagesChange();
		this.events.onToolCallStateChange?.(messageId, toolCall.id, "input-complete", toolCall.arguments);
	}
	/**
	* Emit pending text update for a specific message.
	*
	* Calls updateTextPart() which has critical append-vs-replace logic:
	* - If last UIMessage part is TextPart → replaces its content (same segment).
	* - If last part is anything else → pushes new TextPart (new segment after tools).
	*
	* @see docs/chat-architecture.md#uimessage-part-ordering-invariants — Replace vs. push logic
	*/
	emitTextUpdateForMessage(messageId) {
		const state = this.getMessageState(messageId);
		if (!state) return;
		state.lastEmittedText = state.currentSegmentText;
		this.messages = updateTextPart(this.messages, messageId, state.currentSegmentText);
		this.emitMessagesChange();
		this.events.onTextUpdate?.(messageId, state.currentSegmentText);
	}
	queueStructuredOutputUpdate(messageId, delta) {
		const existing = this.structuredOutputUpdateBatches.get(messageId);
		const next = {
			delta: `${existing?.delta ?? ""}${delta}`,
			chunkCount: (existing?.chunkCount ?? 0) + 1
		};
		this.structuredOutputUpdateBatches.set(messageId, next);
		if (next.chunkCount >= STRUCTURED_OUTPUT_UPDATE_BATCH_SIZE) this.flushStructuredOutputUpdate(messageId);
	}
	flushStructuredOutputUpdate(messageId) {
		const batch = this.structuredOutputUpdateBatches.get(messageId);
		if (!batch || batch.chunkCount === 0) return;
		this.structuredOutputUpdateBatches.delete(messageId);
		this.emitStructuredOutputChange(messageId, "update", batch.delta);
	}
	emitStructuredOutputChange(messageId, phase, delta) {
		const part = this.messages.find((message) => message.id === messageId)?.parts.find((messagePart) => messagePart.type === "structured-output");
		if (!part) return;
		this.events.onStructuredOutputChange?.({
			phase,
			messageId,
			status: part.status,
			raw: part.raw,
			...part.partial !== void 0 ? { partial: part.partial } : {},
			...part.data !== void 0 ? { data: part.data } : {},
			...part.reasoning !== void 0 ? { reasoning: part.reasoning } : {},
			...part.errorMessage !== void 0 ? { errorMessage: part.errorMessage } : {},
			...delta !== void 0 ? { delta } : {}
		});
	}
	/**
	* Emit messages change event
	*/
	emitMessagesChange() {
		this.events.onMessagesChange?.([...this.messages]);
	}
	/**
	* Finalize the stream — complete all pending operations.
	*
	* Called when the async iterable ends (stream closed). Acts as the final
	* safety net: completes any remaining tool calls, flushes un-emitted text,
	* and fires onStreamEnd.
	*
	* @see docs/chat-architecture.md#single-shot-text-response — Finalization step
	*/
	finalizeStream() {
		let lastAssistantMessage;
		for (const messageId of this.activeMessageIds) {
			const state = this.getMessageState(messageId);
			if (!state) continue;
			this.completeAllToolCallsForMessage(messageId);
			if (state.currentSegmentText !== state.lastEmittedText) this.emitTextUpdateForMessage(messageId);
			state.isComplete = true;
			const msg = this.messages.find((m) => m.id === messageId);
			if (msg && msg.role === "assistant") lastAssistantMessage = msg;
		}
		for (const messageId of this.structuredMessageIds) {
			this.flushStructuredOutputUpdate(messageId);
			this.messages = errorStructuredOutputPart(this.messages, messageId, "Stream ended without structured-output.complete");
			this.emitStructuredOutputChange(messageId, "error");
		}
		this.structuredMessageIds.clear();
		this.structuredOutputUpdateBatches.clear();
		this.activeMessageIds.clear();
		if (lastAssistantMessage && !this.hasError) {
			if (this.isWhitespaceOnlyMessage(lastAssistantMessage)) {
				this.messages = this.messages.filter((m) => m.id !== lastAssistantMessage.id);
				this.emitMessagesChange();
				return;
			}
		}
		if (lastAssistantMessage) this.events.onStreamEnd?.(lastAssistantMessage);
	}
	/**
	* Get completed tool calls in API format (aggregated across all messages)
	*/
	getCompletedToolCalls() {
		const result = [];
		for (const state of this.messageStates.values()) for (const tc of state.toolCalls.values()) if (tc.state === "input-complete") result.push({
			id: tc.id,
			type: "function",
			function: {
				name: tc.name,
				arguments: tc.arguments
			},
			...tc.metadata !== void 0 && { metadata: tc.metadata }
		});
		return result;
	}
	/**
	* Get current result (aggregated across all messages)
	*/
	getResult() {
		const toolCalls = this.getCompletedToolCalls();
		let content = "";
		let thinking = "";
		for (const state of this.messageStates.values()) {
			content += state.totalTextContent;
			for (const stepId of state.thinkingStepOrder) thinking += state.thinkingSteps.get(stepId) ?? "";
		}
		return {
			content,
			thinking: thinking || void 0,
			toolCalls: toolCalls.length > 0 ? toolCalls : void 0,
			finishReason: this.finishReason
		};
	}
	/**
	* Get current processor state (aggregated across all messages)
	*/
	getState() {
		let content = "";
		let thinking = "";
		const toolCalls = /* @__PURE__ */ new Map();
		const toolCallOrder = [];
		for (const state of this.messageStates.values()) {
			content += state.totalTextContent;
			for (const stepId of state.thinkingStepOrder) thinking += state.thinkingSteps.get(stepId) ?? "";
			for (const [id, tc] of state.toolCalls) toolCalls.set(id, tc);
			toolCallOrder.push(...state.toolCallOrder);
		}
		return {
			content,
			thinking,
			toolCalls,
			toolCallOrder,
			finishReason: this.finishReason,
			done: this.isDone
		};
	}
	/**
	* Start recording chunks
	*/
	startRecording() {
		this.recordingEnabled = true;
		this.recordingStartTime = Date.now();
		this.recording = {
			version: "1.0",
			timestamp: this.recordingStartTime,
			chunks: []
		};
	}
	/**
	* Get the current recording
	*/
	getRecording() {
		return this.recording;
	}
	/**
	* Reset stream state (but keep messages)
	*/
	resetStreamState() {
		this.messageStates.clear();
		this.activeMessageIds.clear();
		this.activeRuns.clear();
		this.toolCallToMessage.clear();
		this.structuredMessageIds.clear();
		this.structuredOutputUpdateBatches.clear();
		this.pendingManualMessageId = null;
		this.pendingThinkingStepId = null;
		this.finishReason = null;
		this.hasError = false;
		this.isDone = false;
		this.chunkStrategy.reset?.();
	}
	/**
	* Full reset (including messages)
	*/
	reset() {
		this.resetStreamState();
		this.messages = [];
	}
	/**
	* Check if a message contains only whitespace text and no other meaningful parts
	* (no tool calls, tool results, thinking, etc.)
	*/
	isWhitespaceOnlyMessage(message) {
		if (message.parts.length === 0) return false;
		return message.parts.every((part) => part.type === "text" && part.content.trim() === "");
	}
	/**
	* Replay a recording through the processor
	*/
	static async replay(recording, options) {
		return new StreamProcessor(options).process(createReplayStream(recording));
	}
};
function createReplayStream(recording) {
	return { async *[Symbol.asyncIterator]() {
		for (const { chunk } of recording.chunks) yield chunk;
	} };
}
//#endregion
//#region node_modules/.pnpm/@tanstack+ai@0.28.0/node_modules/@tanstack/ai/dist/esm/client.js
var EventType = /* @__PURE__ */ ((EventType2) => {
	EventType2["TEXT_MESSAGE_START"] = "TEXT_MESSAGE_START";
	EventType2["TEXT_MESSAGE_CONTENT"] = "TEXT_MESSAGE_CONTENT";
	EventType2["TEXT_MESSAGE_END"] = "TEXT_MESSAGE_END";
	EventType2["TEXT_MESSAGE_CHUNK"] = "TEXT_MESSAGE_CHUNK";
	EventType2["TOOL_CALL_START"] = "TOOL_CALL_START";
	EventType2["TOOL_CALL_ARGS"] = "TOOL_CALL_ARGS";
	EventType2["TOOL_CALL_END"] = "TOOL_CALL_END";
	EventType2["TOOL_CALL_CHUNK"] = "TOOL_CALL_CHUNK";
	EventType2["TOOL_CALL_RESULT"] = "TOOL_CALL_RESULT";
	EventType2["THINKING_START"] = "THINKING_START";
	EventType2["THINKING_END"] = "THINKING_END";
	EventType2["THINKING_TEXT_MESSAGE_START"] = "THINKING_TEXT_MESSAGE_START";
	EventType2["THINKING_TEXT_MESSAGE_CONTENT"] = "THINKING_TEXT_MESSAGE_CONTENT";
	EventType2["THINKING_TEXT_MESSAGE_END"] = "THINKING_TEXT_MESSAGE_END";
	EventType2["STATE_SNAPSHOT"] = "STATE_SNAPSHOT";
	EventType2["STATE_DELTA"] = "STATE_DELTA";
	EventType2["MESSAGES_SNAPSHOT"] = "MESSAGES_SNAPSHOT";
	EventType2["ACTIVITY_SNAPSHOT"] = "ACTIVITY_SNAPSHOT";
	EventType2["ACTIVITY_DELTA"] = "ACTIVITY_DELTA";
	EventType2["RAW"] = "RAW";
	EventType2["CUSTOM"] = "CUSTOM";
	EventType2["RUN_STARTED"] = "RUN_STARTED";
	EventType2["RUN_FINISHED"] = "RUN_FINISHED";
	EventType2["RUN_ERROR"] = "RUN_ERROR";
	EventType2["STEP_STARTED"] = "STEP_STARTED";
	EventType2["STEP_FINISHED"] = "STEP_FINISHED";
	EventType2["REASONING_START"] = "REASONING_START";
	EventType2["REASONING_MESSAGE_START"] = "REASONING_MESSAGE_START";
	EventType2["REASONING_MESSAGE_CONTENT"] = "REASONING_MESSAGE_CONTENT";
	EventType2["REASONING_MESSAGE_END"] = "REASONING_MESSAGE_END";
	EventType2["REASONING_MESSAGE_CHUNK"] = "REASONING_MESSAGE_CHUNK";
	EventType2["REASONING_END"] = "REASONING_END";
	EventType2["REASONING_ENCRYPTED_VALUE"] = "REASONING_ENCRYPTED_VALUE";
	return EventType2;
})(EventType || {});
//#endregion
//#region node_modules/.pnpm/@tanstack+devtools-event-client@0.4.3/node_modules/@tanstack/devtools-event-client/dist/esm/plugin.js
var EventClient = class {
	#enabled = true;
	#pluginId;
	#eventTarget;
	#debug;
	#queuedEvents;
	#connected;
	#connectIntervalId;
	#connectEveryMs;
	#retryCount = 0;
	#maxRetries = 5;
	#connecting = false;
	#failedToConnect = false;
	#internalEventTarget = null;
	#onConnected = () => {
		this.debugLog("Connected to event bus");
		this.#connected = true;
		this.#connecting = false;
		this.debugLog("Emitting queued events", this.#queuedEvents);
		this.#queuedEvents.forEach((event) => this.emitEventToBus(event));
		this.#queuedEvents = [];
		this.stopConnectLoop();
		this.#eventTarget().removeEventListener("tanstack-connect-success", this.#onConnected);
	};
	#retryConnection = () => {
		if (this.#retryCount < this.#maxRetries) {
			this.#retryCount++;
			this.dispatchCustomEvent("tanstack-connect", {});
			return;
		}
		this.#eventTarget().removeEventListener("tanstack-connect", this.#retryConnection);
		this.#failedToConnect = true;
		this.debugLog("Max retries reached, giving up on connection");
		this.stopConnectLoop();
	};
	#connectFunction = () => {
		if (this.#connecting) return;
		this.#connecting = true;
		this.#eventTarget().addEventListener("tanstack-connect-success", this.#onConnected);
		this.#retryConnection();
	};
	constructor({ pluginId, debug = false, enabled = true, reconnectEveryMs = 300 }) {
		this.#pluginId = pluginId;
		this.#enabled = enabled;
		this.#eventTarget = this.getGlobalTarget;
		this.#debug = debug;
		this.debugLog(" Initializing event subscription for plugin", this.#pluginId);
		this.#queuedEvents = [];
		this.#connected = false;
		this.#failedToConnect = false;
		this.#connectIntervalId = null;
		this.#connectEveryMs = reconnectEveryMs;
	}
	startConnectLoop() {
		if (this.#connectIntervalId !== null || this.#connected) return;
		this.debugLog(`Starting connect loop (every ${this.#connectEveryMs}ms)`);
		this.#connectIntervalId = setInterval(this.#retryConnection, this.#connectEveryMs);
	}
	stopConnectLoop() {
		this.#connecting = false;
		if (this.#connectIntervalId === null) return;
		clearInterval(this.#connectIntervalId);
		this.#connectIntervalId = null;
		this.#queuedEvents = [];
		this.debugLog("Stopped connect loop");
	}
	debugLog(...args) {
		if (this.#debug) console.log(`🌴 [tanstack-devtools:${this.#pluginId}-plugin]`, ...args);
	}
	getGlobalTarget() {
		if (typeof globalThis !== "undefined" && globalThis.__TANSTACK_EVENT_TARGET__) {
			this.debugLog("Using global event target");
			return globalThis.__TANSTACK_EVENT_TARGET__;
		}
		if (typeof window !== "undefined" && typeof window.addEventListener !== "undefined") {
			this.debugLog("Using window as event target");
			return window;
		}
		const eventTarget = typeof EventTarget !== "undefined" ? new EventTarget() : void 0;
		if (typeof eventTarget === "undefined" || typeof eventTarget.addEventListener === "undefined") {
			this.debugLog("No event mechanism available, running in non-web environment");
			return {
				addEventListener: () => {},
				removeEventListener: () => {},
				dispatchEvent: () => false
			};
		}
		this.debugLog("Using new EventTarget as fallback");
		return eventTarget;
	}
	getPluginId() {
		return this.#pluginId;
	}
	dispatchCustomEventShim(eventName, detail) {
		try {
			const event = new Event(eventName, { detail });
			this.#eventTarget().dispatchEvent(event);
		} catch (e) {
			this.debugLog("Failed to dispatch shim event");
		}
	}
	dispatchCustomEvent(eventName, detail) {
		try {
			this.#eventTarget().dispatchEvent(new CustomEvent(eventName, { detail }));
		} catch (e) {
			this.dispatchCustomEventShim(eventName, detail);
		}
	}
	emitEventToBus(event) {
		this.debugLog("Emitting event to client bus", event);
		this.dispatchCustomEvent("tanstack-dispatch-event", event);
	}
	createEventPayload(eventSuffix, payload) {
		return {
			type: `${this.#pluginId}:${eventSuffix}`,
			payload,
			pluginId: this.#pluginId
		};
	}
	emit(eventSuffix, payload) {
		if (!this.#enabled) {
			this.debugLog("Event bus client is disabled, not emitting event", eventSuffix, payload);
			return;
		}
		if (this.#internalEventTarget) {
			this.debugLog("Emitting event to internal event target", eventSuffix, payload);
			this.#internalEventTarget.dispatchEvent(new CustomEvent(`${this.#pluginId}:${eventSuffix}`, { detail: this.createEventPayload(eventSuffix, payload) }));
		}
		if (this.#failedToConnect) {
			this.debugLog("Previously failed to connect, not emitting to bus");
			return;
		}
		if (!this.#connected) {
			this.debugLog("Bus not available, will be pushed as soon as connected");
			this.#queuedEvents.push(this.createEventPayload(eventSuffix, payload));
			if (typeof CustomEvent !== "undefined" && !this.#connecting) {
				this.#connectFunction();
				this.startConnectLoop();
			}
			return;
		}
		return this.emitEventToBus(this.createEventPayload(eventSuffix, payload));
	}
	on(eventSuffix, cb, options) {
		const withEventTarget = options?.withEventTarget ?? false;
		const eventName = `${this.#pluginId}:${eventSuffix}`;
		if (withEventTarget) {
			if (!this.#internalEventTarget) this.#internalEventTarget = new EventTarget();
			this.#internalEventTarget.addEventListener(eventName, (e) => {
				cb(e.detail);
			});
		}
		if (!this.#enabled) {
			this.debugLog("Event bus client is disabled, not registering event", eventName);
			return () => {};
		}
		const handler = (e) => {
			this.debugLog("Received event from bus", e.detail);
			cb(e.detail);
		};
		this.#eventTarget().addEventListener(eventName, handler);
		this.debugLog("Registered event to bus", eventName);
		return () => {
			if (withEventTarget) this.#internalEventTarget?.removeEventListener(eventName, handler);
			this.#eventTarget().removeEventListener(eventName, handler);
		};
	}
	onAll(cb) {
		if (!this.#enabled) {
			this.debugLog("Event bus client is disabled, not registering event");
			return () => {};
		}
		const handler = (e) => {
			const event = e.detail;
			cb(event);
		};
		this.#eventTarget().addEventListener("tanstack-devtools-global", handler);
		return () => this.#eventTarget().removeEventListener("tanstack-devtools-global", handler);
	}
	onAllPluginEvents(cb) {
		if (!this.#enabled) {
			this.debugLog("Event bus client is disabled, not registering event");
			return () => {};
		}
		const handler = (e) => {
			const event = e.detail;
			if (this.#pluginId && event.pluginId !== this.#pluginId) return;
			cb(event);
		};
		this.#eventTarget().addEventListener("tanstack-devtools-global", handler);
		return () => this.#eventTarget().removeEventListener("tanstack-devtools-global", handler);
	}
};
//#endregion
//#region node_modules/.pnpm/@tanstack+ai-event-client@0.5.2_@tanstack+ai@0.26.1/node_modules/@tanstack/ai-event-client/dist/esm/devtools-middleware.js
var KNOWN_CHUNK_TYPES = /* @__PURE__ */ new Set([
	"TEXT_MESSAGE_CONTENT",
	"TOOL_CALL_START",
	"TOOL_CALL_ARGS",
	"TOOL_CALL_END",
	"RUN_FINISHED",
	"RUN_ERROR",
	"STEP_FINISHED"
]);
function isKnownChunk(chunk) {
	return KNOWN_CHUNK_TYPES.has(chunk.type);
}
var safeEmit = (...args) => {
	try {
		aiEventClient.emit(...args);
	} catch (error) {
		console.error(`[ai-devtools] subscriber threw while handling "${String(args[0])}" event`, error);
	}
};
function buildEventContext(ctx) {
	return {
		requestId: ctx.requestId,
		streamId: ctx.streamId,
		runId: ctx.runId,
		threadId: ctx.threadId,
		provider: ctx.provider,
		model: ctx.model,
		clientId: ctx.conversationId,
		source: ctx.source,
		systemPrompts: ctx.systemPrompts.length > 0 ? ctx.systemPrompts.map((p) => typeof p === "string" ? p : p.content) : void 0,
		toolNames: ctx.toolNames,
		options: ctx.options,
		modelOptions: ctx.modelOptions,
		messageCount: ctx.messageCount,
		hasTools: ctx.hasTools,
		streaming: ctx.streaming
	};
}
function getContentString(content) {
	if (typeof content === "string") return content;
	if (!Array.isArray(content)) return "";
	return content.map((part) => part && typeof part === "object" && part.type === "text" ? String(part.content ?? "") : "").join("") || "";
}
function devtoolsMiddleware() {
	let localMessageId = null;
	let localAccumulatedContent = "";
	let currentIteration = -1;
	let iterationStartTime = 0;
	const activeToolCalls = /* @__PURE__ */ new Map();
	return {
		name: "devtools",
		onStart(ctx) {
			safeEmit("text:request:started", {
				...buildEventContext(ctx),
				timestamp: Date.now()
			});
			const messages = ctx.messages;
			(ctx.conversationId ? messages.slice(-1).filter((m) => m.role === "user") : messages).forEach((message, index) => {
				const messageIndex = ctx.conversationId ? messages.length - 1 : index;
				const messageId = ctx.createId("msg");
				const base = buildEventContext(ctx);
				const content = getContentString(message.content);
				safeEmit("text:message:created", {
					...base,
					messageId,
					role: message.role,
					content,
					toolCalls: message.toolCalls,
					messageIndex,
					timestamp: Date.now()
				});
				if (message.role === "user") safeEmit("text:message:user", {
					...base,
					messageId,
					role: "user",
					content,
					messageIndex,
					timestamp: Date.now()
				});
			});
		},
		onIteration(ctx, info) {
			const now = Date.now();
			if (currentIteration >= 0) safeEmit("text:iteration:completed", {
				...buildEventContext(ctx),
				iteration: currentIteration,
				messageId: localMessageId || void 0,
				duration: now - iterationStartTime,
				finishReason: "tool_calls",
				timestamp: now
			});
			currentIteration = info.iteration;
			iterationStartTime = now;
			localMessageId = info.messageId;
			localAccumulatedContent = "";
			safeEmit("text:iteration:started", {
				...buildEventContext(ctx),
				iteration: info.iteration,
				messageId: info.messageId,
				timestamp: now
			});
			safeEmit("text:message:created", {
				...buildEventContext(ctx),
				messageId: info.messageId,
				role: "assistant",
				content: "",
				timestamp: now
			});
		},
		onChunk(ctx, rawChunk) {
			if (!isKnownChunk(rawChunk)) return;
			const chunk = rawChunk;
			const base = buildEventContext(ctx);
			switch (chunk.type) {
				case "TEXT_MESSAGE_CONTENT":
					if (chunk.content) localAccumulatedContent = chunk.content;
					else localAccumulatedContent += chunk.delta;
					safeEmit("text:chunk:content", {
						...base,
						messageId: localMessageId || void 0,
						content: localAccumulatedContent,
						delta: chunk.delta,
						timestamp: Date.now()
					});
					break;
				case "TOOL_CALL_START": {
					const toolIndex = chunk.index ?? 0;
					const toolName = chunk.toolCallName;
					activeToolCalls.set(chunk.toolCallId, {
						toolName,
						index: toolIndex
					});
					safeEmit("text:chunk:tool-call", {
						...base,
						messageId: localMessageId || void 0,
						toolCallId: chunk.toolCallId,
						toolName,
						index: toolIndex,
						arguments: "",
						timestamp: Date.now()
					});
					break;
				}
				case "TOOL_CALL_ARGS": {
					const active = activeToolCalls.get(chunk.toolCallId);
					safeEmit("text:chunk:tool-call", {
						...base,
						messageId: localMessageId || void 0,
						toolCallId: chunk.toolCallId,
						toolName: active?.toolName ?? "",
						index: active?.index ?? 0,
						arguments: chunk.delta,
						timestamp: Date.now()
					});
					break;
				}
				case "TOOL_CALL_END":
					activeToolCalls.delete(chunk.toolCallId);
					safeEmit("text:chunk:tool-result", {
						...base,
						messageId: localMessageId || void 0,
						toolCallId: chunk.toolCallId,
						result: chunk.result || "",
						timestamp: Date.now()
					});
					break;
				case "RUN_FINISHED":
					safeEmit("text:chunk:done", {
						...base,
						messageId: localMessageId || void 0,
						finishReason: chunk.finishReason ?? null,
						usage: chunk.usage,
						timestamp: Date.now()
					});
					if (chunk.usage) safeEmit("text:usage", {
						...base,
						messageId: localMessageId || void 0,
						usage: chunk.usage,
						timestamp: Date.now()
					});
					break;
				case "RUN_ERROR": {
					const errorMessage = chunk.message ?? chunk.error?.message ?? `[ai-devtools] RUN_ERROR chunk had no message; raw chunk: ${JSON.stringify(chunk)}`;
					safeEmit("text:chunk:error", {
						...base,
						messageId: localMessageId || void 0,
						error: errorMessage,
						timestamp: Date.now()
					});
					break;
				}
				case "STEP_FINISHED":
					if (chunk.content || chunk.delta) safeEmit("text:chunk:thinking", {
						...base,
						messageId: localMessageId || void 0,
						content: chunk.content || "",
						delta: chunk.delta,
						timestamp: Date.now()
					});
					break;
			}
		},
		onToolPhaseComplete(ctx, info) {
			const base = buildEventContext(ctx);
			if (info.toolCalls.length > 0) safeEmit("text:message:created", {
				...base,
				messageId: localMessageId ?? ctx.createId("msg"),
				role: "assistant",
				content: localAccumulatedContent || "",
				toolCalls: info.toolCalls,
				timestamp: Date.now()
			});
			for (const approval of info.needsApproval) safeEmit("tools:approval:requested", {
				...base,
				messageId: localMessageId || void 0,
				toolCallId: approval.toolCallId,
				toolName: approval.toolName,
				input: approval.input,
				approvalId: approval.approvalId,
				timestamp: Date.now()
			});
			for (const clientTool of info.needsClientExecution) safeEmit("tools:input:available", {
				...base,
				messageId: localMessageId || void 0,
				toolCallId: clientTool.toolCallId,
				toolName: clientTool.toolName,
				input: clientTool.input,
				timestamp: Date.now()
			});
			for (const result of info.results) {
				safeEmit("tools:call:completed", {
					...base,
					messageId: localMessageId || void 0,
					toolCallId: result.toolCallId,
					toolName: result.toolName,
					result: result.result,
					duration: result.duration ?? 0,
					timestamp: Date.now()
				});
				const content = JSON.stringify(result.result);
				safeEmit("text:message:created", {
					...base,
					messageId: ctx.createId("msg"),
					role: "tool",
					content,
					timestamp: Date.now()
				});
			}
		},
		onFinish(ctx, info) {
			const now = Date.now();
			if (currentIteration >= 0) safeEmit("text:iteration:completed", {
				...buildEventContext(ctx),
				iteration: currentIteration,
				messageId: localMessageId || void 0,
				duration: now - iterationStartTime,
				finishReason: info.finishReason || void 0,
				usage: info.usage,
				timestamp: now
			});
			safeEmit("text:request:completed", {
				...buildEventContext(ctx),
				content: info.content,
				messageId: localMessageId || void 0,
				finishReason: info.finishReason || void 0,
				usage: info.usage,
				duration: info.duration,
				timestamp: now
			});
		}
	};
}
//#endregion
//#region node_modules/.pnpm/@tanstack+ai-event-client@0.5.2_@tanstack+ai@0.26.1/node_modules/@tanstack/ai-event-client/dist/esm/index.js
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
//#endregion
//#region node_modules/.pnpm/@tanstack+ai@0.26.1/node_modules/@tanstack/ai/dist/esm/strip-to-spec-middleware.js
function stripToSpec(chunk) {
	if (chunk.type === "RUN_ERROR" && "error" in chunk) {
		const { error: _deprecated, ...rest } = chunk;
		return rest;
	}
	return chunk;
}
function stripToSpecMiddleware() {
	return {
		name: "strip-to-spec",
		onChunk(_ctx, chunk) {
			return stripToSpec(chunk);
		}
	};
}
//#endregion
//#region node_modules/.pnpm/@tanstack+ai@0.26.1/node_modules/@tanstack/ai/dist/esm/activities/error-payload.js
var ABORT_ERROR_NAMES = /* @__PURE__ */ new Set([
	"AbortError",
	"APIUserAbortError",
	"RequestAbortedError"
]);
function normalizeCode(codeField) {
	if (typeof codeField === "string") return codeField;
	if (typeof codeField === "number" && Number.isFinite(codeField)) return String(codeField);
}
function toRunErrorPayload(error, fallbackMessage = "Unknown error occurred") {
	if (error && typeof error === "object") {
		const name = error.name;
		if (typeof name === "string" && ABORT_ERROR_NAMES.has(name)) return {
			message: "Request aborted",
			code: "aborted"
		};
	}
	if (error instanceof Error) {
		const codeField = error.code;
		return {
			message: error.message || fallbackMessage,
			code: normalizeCode(codeField)
		};
	}
	if (typeof error === "object" && error !== null) {
		const messageField = error.message;
		const codeField = error.code;
		return {
			message: typeof messageField === "string" && messageField.length > 0 ? messageField : fallbackMessage,
			code: normalizeCode(codeField)
		};
	}
	if (typeof error === "string" && error.length > 0) return {
		message: error,
		code: void 0
	};
	return {
		message: fallbackMessage,
		code: void 0
	};
}
function toRunErrorRawEvent(error) {
	if (!error || typeof error !== "object") return void 0;
	const e = error;
	if (e.rawEvent !== void 0 && e.rawEvent !== null) return e.rawEvent;
	if (e.error !== void 0 && e.error !== null && typeof e.error === "object") return e.error;
	if (e.metadata !== void 0 && e.metadata !== null) return e.metadata;
}
//#endregion
//#region node_modules/.pnpm/@tanstack+ai@0.26.1/node_modules/@tanstack/ai/dist/esm/stream-to-response.js
async function streamToText(stream) {
	let accumulatedContent = "";
	for await (const chunk of stream) if (chunk.type === "TEXT_MESSAGE_CONTENT" && chunk.delta) accumulatedContent += chunk.delta;
	return accumulatedContent;
}
function toServerSentEventsStream(stream, abortController) {
	const encoder = new TextEncoder();
	return new ReadableStream({
		async start(controller) {
			try {
				for await (const chunk of stream) {
					if (abortController?.signal.aborted) break;
					controller.enqueue(encoder.encode(`data: ${JSON.stringify(chunk)}

`));
				}
				controller.close();
			} catch (error) {
				if (abortController?.signal.aborted) {
					controller.close();
					return;
				}
				controller.enqueue(encoder.encode(`data: ${JSON.stringify({
					type: "RUN_ERROR",
					timestamp: Date.now(),
					error: toRunErrorPayload(error)
				})}

`));
				controller.close();
			}
		},
		cancel() {
			if (abortController) abortController.abort();
		}
	});
}
function toServerSentEventsResponse(stream, init) {
	const { headers, abortController, ...responseInit } = init ?? {};
	const mergedHeaders = new Headers({
		"Content-Type": "text/event-stream",
		"Cache-Control": "no-cache",
		Connection: "keep-alive"
	});
	if (headers) new Headers(headers).forEach((value, key) => {
		mergedHeaders.set(key, value);
	});
	return new Response(toServerSentEventsStream(stream, abortController), {
		...responseInit,
		headers: mergedHeaders
	});
}
//#endregion
//#region node_modules/.pnpm/@tanstack+ai@0.26.1/node_modules/@tanstack/ai/dist/esm/logger/console-logger.js
var DIR_OPTIONS = {
	depth: null,
	colors: true
};
var ConsoleLogger = class {
	/** Log a debug-level message; forwards to `console.debug`. */
	debug(message, meta) {
		console.debug(message);
		if (meta !== void 0) console.dir(meta, DIR_OPTIONS);
	}
	/** Log an info-level message; forwards to `console.info`. */
	info(message, meta) {
		console.info(message);
		if (meta !== void 0) console.dir(meta, DIR_OPTIONS);
	}
	/** Log a warning-level message; forwards to `console.warn`. */
	warn(message, meta) {
		console.warn(message);
		if (meta !== void 0) console.dir(meta, DIR_OPTIONS);
	}
	/** Log an error-level message; forwards to `console.error`. */
	error(message, meta) {
		console.error(message);
		if (meta !== void 0) console.dir(meta, DIR_OPTIONS);
	}
};
//#endregion
//#region node_modules/.pnpm/@tanstack+ai@0.26.1/node_modules/@tanstack/ai/dist/esm/logger/internal-logger.js
var CATEGORY_EMOJI = {
	request: "📤",
	provider: "📥",
	output: "📨",
	middleware: "🧩",
	tools: "🔧",
	agentLoop: "🔁",
	config: "⚙️",
	errors: "❌"
};
var InternalLogger = class {
	constructor(logger, categories) {
		this.logger = logger;
		this.categories = categories;
	}
	logger;
	categories;
	/** Whether a category is enabled. Cheap, safe to call on hot paths. */
	isEnabled(category) {
		return this.categories[category];
	}
	emit(level, category, message, meta) {
		if (!this.categories[category]) return;
		const emoji = CATEGORY_EMOJI[category];
		const prefixed = `${emoji} [tanstack-ai:${category}] ${emoji} ${message}`;
		try {
			if (level === "error") this.logger.error(prefixed, meta);
			else this.logger.debug(prefixed, meta);
		} catch {}
	}
	/** Log a raw chunk/frame received from a provider SDK. */
	provider(message, meta) {
		this.emit("debug", "provider", message, meta);
	}
	/** Log a chunk/result yielded to the consumer after middleware. */
	output(message, meta) {
		this.emit("debug", "output", message, meta);
	}
	/** Log inputs/outputs around a middleware hook invocation. Chat-only. */
	middleware(message, meta) {
		this.emit("debug", "middleware", message, meta);
	}
	/** Log before/after a tool-call execution. Chat-only. */
	tools(message, meta) {
		this.emit("debug", "tools", message, meta);
	}
	/** Log an agent-loop iteration marker or phase transition. Chat-only. */
	agentLoop(message, meta) {
		this.emit("debug", "agentLoop", message, meta);
	}
	/** Log a config transform returned by a middleware `onConfig` hook. Chat-only. */
	config(message, meta) {
		this.emit("debug", "config", message, meta);
	}
	/**
	* Log a caught error. Defaults to on even when `debug` is unspecified.
	* Uses the underlying logger's `error` level.
	*/
	errors(message, meta) {
		this.emit("error", "errors", message, meta);
	}
	/** Log outgoing request metadata before an adapter SDK call. */
	request(message, meta) {
		this.emit("debug", "request", message, meta);
	}
};
//#endregion
//#region node_modules/.pnpm/@tanstack+ai@0.26.1/node_modules/@tanstack/ai/dist/esm/logger/resolve.js
var ALL_OFF = {
	provider: false,
	output: false,
	middleware: false,
	tools: false,
	agentLoop: false,
	config: false,
	errors: false,
	request: false
};
var ALL_ON = {
	provider: true,
	output: true,
	middleware: true,
	tools: true,
	agentLoop: true,
	config: true,
	errors: true,
	request: true
};
var errorsOnlyCategories = () => ({
	...ALL_OFF,
	errors: true
});
var resolveCategoriesFromPartial = (partial) => ({
	provider: partial.provider ?? true,
	output: partial.output ?? true,
	middleware: partial.middleware ?? true,
	tools: partial.tools ?? true,
	agentLoop: partial.agentLoop ?? true,
	config: partial.config ?? true,
	errors: partial.errors ?? true,
	request: partial.request ?? true
});
function resolveDebugOption(debug) {
	if (debug === void 0) return new InternalLogger(new ConsoleLogger(), errorsOnlyCategories());
	if (debug === true) return new InternalLogger(new ConsoleLogger(), ALL_ON);
	if (debug === false) return new InternalLogger(new ConsoleLogger(), ALL_OFF);
	const { logger, ...cats } = debug;
	return new InternalLogger(logger ?? new ConsoleLogger(), resolveCategoriesFromPartial(cats));
}
//#endregion
//#region node_modules/.pnpm/@tanstack+ai@0.26.1/node_modules/@tanstack/ai/dist/esm/utilities/tool-result.js
var CONTENT_PART_TYPES = /* @__PURE__ */ new Set([
	"text",
	"image",
	"audio",
	"video",
	"document"
]);
function isContentPart$1(value) {
	if (typeof value !== "object" || value === null) return false;
	const part = value;
	if (typeof part.type !== "string" || !CONTENT_PART_TYPES.has(part.type)) return false;
	if (part.type === "text") return typeof part.content === "string";
	const source = part.source;
	if (typeof source !== "object" || source === null) return false;
	const src = source;
	if (typeof src.value !== "string") return false;
	if (src.type === "data") return typeof src.mimeType === "string";
	return src.type === "url";
}
function isContentPartArray(value) {
	return Array.isArray(value) && value.length > 0 && value.every(isContentPart$1);
}
function normalizeToolResult(result) {
	if (typeof result === "string") return result;
	if (isContentPartArray(result)) return result;
	return JSON.stringify(result);
}
//#endregion
//#region node_modules/.pnpm/@tanstack+ai@0.26.1/node_modules/@tanstack/ai/dist/esm/activities/chat/tools/schema-converter.js
function toJsonSchema(obj) {
	const result = {};
	for (const [key, value] of Object.entries(obj)) {
		if (key === "$schema") continue;
		result[key] = value;
	}
	return result;
}
function isPropertyCarrier(schema) {
	return (typeof schema === "object" || typeof schema === "function") && schema !== null;
}
function isStandardJSONSchema(schema) {
	if (!isPropertyCarrier(schema) || !("~standard" in schema)) return false;
	const standard = schema["~standard"];
	if (typeof standard !== "object" || standard === null || !("version" in standard) || standard.version !== 1 || !("jsonSchema" in standard) || typeof standard.jsonSchema !== "object" || standard.jsonSchema === null || !("input" in standard.jsonSchema)) return false;
	return typeof standard.jsonSchema.input === "function";
}
function isStandardSchema(schema) {
	return isPropertyCarrier(schema) && "~standard" in schema && typeof schema["~standard"] === "object" && schema["~standard"] !== null && "version" in schema["~standard"] && schema["~standard"].version === 1 && "validate" in schema["~standard"] && typeof schema["~standard"].validate === "function";
}
function makeStructuredOutputCompatible(schema, originalRequired = []) {
	const result = { ...schema };
	if (result.type === "object" && result.properties) {
		const properties = { ...result.properties };
		const allPropertyNames = Object.keys(properties);
		for (const propName of allPropertyNames) {
			const prop = properties[propName];
			if (!prop) continue;
			const wasOptional = !originalRequired.includes(propName);
			if (prop.type === "object" && prop.properties) {
				const transformed = makeStructuredOutputCompatible(prop, prop.required || []);
				properties[propName] = wasOptional ? {
					...transformed,
					type: ["object", "null"]
				} : transformed;
			} else if (prop.type === "array" && prop.items) {
				const items = Array.isArray(prop.items) ? prop.items[0] : prop.items;
				const transformed = {
					...prop,
					items: items ? makeStructuredOutputCompatible(items, items.required || []) : prop.items
				};
				properties[propName] = wasOptional ? {
					...transformed,
					type: ["array", "null"]
				} : transformed;
			} else if (wasOptional) {
				if (prop.type && !Array.isArray(prop.type)) properties[propName] = {
					...prop,
					type: [prop.type, "null"]
				};
				else if (Array.isArray(prop.type) && !prop.type.includes("null")) properties[propName] = {
					...prop,
					type: [...prop.type, "null"]
				};
			}
		}
		result.properties = properties;
		result.required = allPropertyNames;
		result.additionalProperties = false;
	}
	if (result.type === "array" && result.items) {
		const items = Array.isArray(result.items) ? result.items[0] : result.items;
		if (items) result.items = makeStructuredOutputCompatible(items, items.required || []);
	}
	return result;
}
function convertSchemaToJsonSchema(schema, options = {}) {
	if (!schema) return void 0;
	const { forStructuredOutput = false } = options;
	if (isStandardJSONSchema(schema)) {
		let result = toJsonSchema(schema["~standard"].jsonSchema.input({ target: "draft-07" }));
		if ("properties" in result && !result.type) result.type = "object";
		if (result.type === "object" && !("properties" in result)) result.properties = {};
		if (result.type === "object" && !("required" in result)) result.required = [];
		if (forStructuredOutput) result = makeStructuredOutputCompatible(result, result.required || []);
		return result;
	}
	if (isStandardSchema(schema)) throw new Error("Schema is a Standard Schema validator but does not expose a JSON Schema converter on `~standard.jsonSchema`. Use Zod v4.2+, ArkType v2.1.28+, or wrap a Valibot schema with `toStandardJsonSchema()` from `@valibot/to-json-schema` before passing it as `outputSchema`.");
	if (typeof schema !== "object") return schema;
	if (forStructuredOutput) {
		const typedView = toJsonSchema(schema);
		return makeStructuredOutputCompatible(typedView, typedView.required || []);
	}
	return schema;
}
var StandardSchemaValidationError = class extends Error {
	name = "StandardSchemaValidationError";
	issues;
	constructor(issues) {
		super(`Validation failed: ${issues.map((i) => i.message || "Validation failed").join(", ")}`);
		this.issues = issues;
	}
};
function parseWithStandardSchema(schema, data) {
	if (!isStandardSchema(schema)) return data;
	const result = schema["~standard"].validate(data);
	if (result instanceof Promise) throw new Error("Schema validation returned a Promise. Use validateWithStandardSchema for async validation.");
	if (!result.issues) return result.value;
	throw new StandardSchemaValidationError(result.issues);
}
//#endregion
//#region node_modules/.pnpm/@tanstack+ai@0.26.1/node_modules/@tanstack/ai/dist/esm/activities/chat/tools/lazy-tool-manager.js
var DISCOVERY_TOOL_NAME = "__lazy__tool__discovery__";
var LazyToolManager = class {
	eagerTools;
	lazyToolMap;
	discoveredTools;
	hasNewDiscoveries;
	discoveryTool;
	constructor(tools, messages) {
		const eager = [];
		this.lazyToolMap = /* @__PURE__ */ new Map();
		this.discoveredTools = /* @__PURE__ */ new Set();
		this.hasNewDiscoveries = false;
		for (const tool of tools) if (tool.lazy) this.lazyToolMap.set(tool.name, tool);
		else eager.push(tool);
		this.eagerTools = eager;
		if (this.lazyToolMap.size === 0) {
			this.discoveryTool = null;
			return;
		}
		this.scanMessageHistory(messages);
		this.discoveryTool = this.createDiscoveryTool();
	}
	/**
	* Returns the set of tools that should be sent to the LLM:
	* eager tools + discovered lazy tools + discovery tool (if undiscovered tools remain).
	* Resets the hasNewDiscoveries flag.
	*/
	getActiveTools() {
		this.hasNewDiscoveries = false;
		const active = [...this.eagerTools];
		for (const name of this.discoveredTools) {
			const tool = this.lazyToolMap.get(name);
			if (tool) active.push(tool);
		}
		if (this.discoveryTool && this.discoveredTools.size < this.lazyToolMap.size) active.push(this.discoveryTool);
		return active;
	}
	/**
	* Returns whether new tools have been discovered since the last getActiveTools() call.
	*/
	hasNewlyDiscoveredTools() {
		return this.hasNewDiscoveries;
	}
	/**
	* Returns true if the given name is a lazy tool that has not yet been discovered.
	*/
	isUndiscoveredLazyTool(name) {
		return this.lazyToolMap.has(name) && !this.discoveredTools.has(name);
	}
	/**
	* Returns a helpful error message for when an undiscovered lazy tool is called.
	*/
	getUndiscoveredToolError(name) {
		return `Error: Tool '${name}' must be discovered first. Call ${DISCOVERY_TOOL_NAME} with toolNames: ['${name}'] to discover it.`;
	}
	/**
	* Scans message history to find previously discovered lazy tools.
	* Looks for assistant messages with discovery tool calls and their
	* corresponding tool result messages.
	*/
	scanMessageHistory(messages) {
		const discoveryCallIds = /* @__PURE__ */ new Set();
		for (const msg of messages) if (msg.role === "assistant" && msg.toolCalls) {
			for (const tc of msg.toolCalls) if (tc.function.name === DISCOVERY_TOOL_NAME) discoveryCallIds.add(tc.id);
		}
		if (discoveryCallIds.size === 0) return;
		for (const msg of messages) if (msg.role === "tool" && msg.toolCallId && discoveryCallIds.has(msg.toolCallId)) try {
			const content = typeof msg.content === "string" ? msg.content : JSON.stringify(msg.content);
			const parsed = JSON.parse(content);
			if (parsed && Array.isArray(parsed.tools)) {
				for (const tool of parsed.tools) if (tool && typeof tool.name === "string" && this.lazyToolMap.has(tool.name)) this.discoveredTools.add(tool.name);
			}
		} catch {}
	}
	/**
	* Creates the synthetic discovery tool that the LLM can call
	* to discover lazy tools' descriptions and schemas.
	*/
	createDiscoveryTool() {
		const undiscoveredNames = () => {
			const names = [];
			for (const [name] of this.lazyToolMap) if (!this.discoveredTools.has(name)) names.push(name);
			return names;
		};
		const lazyToolMap = this.lazyToolMap;
		const description = `You have access to additional tools that can be discovered. Available tools: [${Array.from(this.lazyToolMap.keys()).join(", ")}]. Call this tool with a list of tool names to discover their full descriptions and argument schemas before using them.`;
		const manager = this;
		return {
			name: DISCOVERY_TOOL_NAME,
			description,
			inputSchema: {
				type: "object",
				properties: { toolNames: {
					type: "array",
					items: { type: "string" },
					description: "List of tool names to discover. Each name must match one of the available tools."
				} },
				required: ["toolNames"]
			},
			execute: (args) => {
				const tools = [];
				const errors = [];
				for (const name of args.toolNames) {
					const tool = lazyToolMap.get(name);
					if (tool) {
						manager.discoveredTools.add(name);
						manager.hasNewDiscoveries = true;
						const jsonSchema = tool.inputSchema ? convertSchemaToJsonSchema(tool.inputSchema) : void 0;
						tools.push({
							name: tool.name,
							description: tool.description,
							...jsonSchema ? { inputSchema: jsonSchema } : {}
						});
					} else errors.push(`Unknown tool: '${name}'. Available tools: [${undiscoveredNames().join(", ")}]`);
				}
				const result = { tools };
				if (errors.length > 0) result.errors = errors;
				return result;
			}
		};
	}
};
//#endregion
//#region node_modules/.pnpm/@tanstack+ai@0.26.1/node_modules/@tanstack/ai/dist/esm/activities/chat/tools/tool-calls.js
function safeJsonParse(value) {
	try {
		return JSON.parse(value);
	} catch {
		return value;
	}
}
var MiddlewareAbortError = class extends Error {
	constructor(reason) {
		super(reason);
		this.name = "MiddlewareAbortError";
	}
};
var ToolCallManager = class {
	toolCallsMap = /* @__PURE__ */ new Map();
	tools;
	constructor(tools) {
		this.tools = tools;
	}
	/**
	* Add a TOOL_CALL_START event to begin tracking a tool call (AG-UI)
	*/
	addToolCallStartEvent(event) {
		const index = event.index ?? this.toolCallsMap.size;
		const runtimeEvent = event;
		const name = runtimeEvent.toolCallName ?? runtimeEvent.toolName;
		this.toolCallsMap.set(index, {
			id: event.toolCallId,
			type: "function",
			function: {
				name,
				arguments: ""
			},
			...event.metadata !== void 0 && { metadata: event.metadata }
		});
	}
	/**
	* Add a TOOL_CALL_ARGS event to accumulate arguments (AG-UI)
	*/
	addToolCallArgsEvent(event) {
		for (const [, toolCall] of this.toolCallsMap.entries()) if (toolCall.id === event.toolCallId) {
			toolCall.function.arguments += event.delta;
			break;
		}
	}
	/**
	* Complete a tool call with its final input
	* Called when TOOL_CALL_END is received
	*/
	completeToolCall(event) {
		for (const [, toolCall] of this.toolCallsMap.entries()) if (toolCall.id === event.toolCallId) {
			if (event.input !== void 0) {
				const normalized = event.input && typeof event.input === "object" ? event.input : {};
				toolCall.function.arguments = JSON.stringify(normalized);
			}
			break;
		}
	}
	/**
	* Check if there are any complete tool calls to execute
	*/
	hasToolCalls() {
		return this.getToolCalls().length > 0;
	}
	/**
	* Get all complete tool calls (filtered for valid ID and name)
	*/
	getToolCalls() {
		return Array.from(this.toolCallsMap.values()).filter((tc) => tc.id && tc.function.name && tc.function.name.trim().length > 0);
	}
	/**
	* Execute all tool calls and return tool result messages
	* Yields TOOL_CALL_END events for streaming
	* @param finishEvent - RUN_FINISHED event from the stream
	*/
	async *executeTools(finishEvent, ...contextArgs) {
		const toolCallsArray = this.getToolCalls();
		const toolResults = [];
		const hasRuntimeContext = contextArgs.length > 0;
		const userContext = contextArgs[0];
		for (const toolCall of toolCallsArray) {
			const tool = this.tools.find((t) => t.name === toolCall.function.name);
			let toolResultContent;
			let toolResultState;
			if (tool?.execute) try {
				let args;
				try {
					const argsString = toolCall.function.arguments.trim() || "{}";
					const parsed = JSON.parse(argsString);
					args = parsed && typeof parsed === "object" ? parsed : {};
				} catch (parseError) {
					throw new Error(`Failed to parse tool arguments as JSON: ${toolCall.function.arguments}`);
				}
				if (tool.inputSchema && isStandardSchema(tool.inputSchema)) try {
					args = parseWithStandardSchema(tool.inputSchema, args);
				} catch (validationError) {
					const message = validationError instanceof Error ? validationError.message : "Validation failed";
					throw new Error(`Input validation failed for tool ${tool.name}: ${message}`);
				}
				const executionContext = {
					toolCallId: toolCall.id,
					context: userContext,
					emitCustomEvent: () => {}
				};
				let result = hasRuntimeContext ? await tool.execute(args, executionContext) : await tool.execute(args);
				if (tool.outputSchema && isStandardSchema(tool.outputSchema)) try {
					result = parseWithStandardSchema(tool.outputSchema, result);
				} catch (validationError) {
					const message = validationError instanceof Error ? validationError.message : "Validation failed";
					throw new Error(`Output validation failed for tool ${tool.name}: ${message}`);
				}
				toolResultContent = normalizeToolResult(result);
			} catch (error) {
				toolResultContent = `Error executing tool: ${error instanceof Error ? error.message : "Unknown error"}`;
				toolResultState = "output-error";
			}
			else toolResultContent = `Tool ${toolCall.function.name} does not have an execute function`;
			yield {
				type: "TOOL_CALL_END",
				toolCallId: toolCall.id,
				toolCallName: toolCall.function.name,
				toolName: toolCall.function.name,
				model: finishEvent.model,
				timestamp: Date.now(),
				result: toolResultContent,
				...toolResultState !== void 0 && { state: toolResultState }
			};
			toolResults.push({
				role: "tool",
				content: toolResultContent,
				toolCallId: toolCall.id
			});
		}
		return toolResults;
	}
	/**
	* Clear the tool calls map for the next iteration
	*/
	clear() {
		this.toolCallsMap.clear();
	}
};
async function* executeWithEventPolling(executionPromise, pendingEvents) {
	const state = {
		done: false,
		result: void 0
	};
	const executionWithFlag = executionPromise.then((r) => {
		state.done = true;
		state.result = r;
		return r;
	});
	while (!state.done) {
		await Promise.race([executionWithFlag, new Promise((resolve) => setTimeout(resolve, 10))]);
		let event2;
		while ((event2 = pendingEvents.shift()) !== void 0) yield event2;
	}
	let event;
	while ((event = pendingEvents.shift()) !== void 0) yield event;
	return state.result;
}
async function applyBeforeToolCallDecision(toolCall, tool, input, toolName, middlewareHooks, results) {
	if (!middlewareHooks.onBeforeToolCall) return {
		proceed: true,
		input
	};
	const decision = await middlewareHooks.onBeforeToolCall(toolCall, tool, input);
	if (!decision) return {
		proceed: true,
		input
	};
	if (decision.type === "abort") throw new MiddlewareAbortError(decision.reason || "Aborted by middleware");
	if (decision.type === "skip") {
		const skipResult = decision.result;
		results.push({
			toolCallId: toolCall.id,
			toolName,
			result: typeof skipResult === "string" ? safeJsonParse(skipResult) : skipResult ?? null,
			duration: 0
		});
		if (middlewareHooks.onAfterToolCall) await middlewareHooks.onAfterToolCall({
			toolCall,
			tool,
			toolName,
			toolCallId: toolCall.id,
			ok: true,
			duration: 0,
			result: skipResult
		});
		return { proceed: false };
	}
	return {
		proceed: true,
		input: decision.args
	};
}
async function* executeServerTool(toolCall, tool, toolName, input, context, pendingEvents, results, middlewareHooks) {
	const startTime = Date.now();
	try {
		if (!tool.execute) throw new Error(`Tool ${toolName} has no execute() implementation`);
		let result = yield* executeWithEventPolling(Promise.resolve(tool.execute(input, context)), pendingEvents);
		const duration = Date.now() - startTime;
		let pendingEvent;
		while ((pendingEvent = pendingEvents.shift()) !== void 0) yield pendingEvent;
		if (tool.outputSchema && isStandardSchema(tool.outputSchema)) result = parseWithStandardSchema(tool.outputSchema, result);
		const finalResult = typeof result === "string" ? safeJsonParse(result) : result ?? null;
		results.push({
			toolCallId: toolCall.id,
			toolName,
			result: finalResult,
			duration
		});
		if (middlewareHooks?.onAfterToolCall) await middlewareHooks.onAfterToolCall({
			toolCall,
			tool,
			toolName,
			toolCallId: toolCall.id,
			ok: true,
			duration,
			result: finalResult
		});
	} catch (error) {
		const duration = Date.now() - startTime;
		let pendingEvent;
		while ((pendingEvent = pendingEvents.shift()) !== void 0) yield pendingEvent;
		if (error instanceof MiddlewareAbortError) throw error;
		const message = error instanceof Error ? error.message : "Unknown error";
		results.push({
			toolCallId: toolCall.id,
			toolName,
			result: { error: message },
			state: "output-error",
			duration
		});
		if (middlewareHooks?.onAfterToolCall) await middlewareHooks.onAfterToolCall({
			toolCall,
			tool,
			toolName,
			toolCallId: toolCall.id,
			ok: false,
			duration,
			error
		});
	}
}
function buildClientToolResult(toolCallId, toolName, tool, rawResult) {
	try {
		let result = rawResult;
		if (tool.outputSchema && isStandardSchema(tool.outputSchema)) result = parseWithStandardSchema(tool.outputSchema, result);
		return {
			toolCallId,
			toolName,
			result: typeof result === "string" ? safeJsonParse(result) : result ?? null
		};
	} catch (error) {
		return {
			toolCallId,
			toolName,
			result: { error: error instanceof Error ? error.message : "Validation failed" },
			state: "output-error"
		};
	}
}
async function* executeToolCalls(toolCalls, tools, approvals = /* @__PURE__ */ new Map(), clientResults = /* @__PURE__ */ new Map(), createCustomEventChunk, middlewareHooks, userContext) {
	const results = [];
	const needsApproval = [];
	const needsClientExecution = [];
	const toolMap = /* @__PURE__ */ new Map();
	for (const tool of tools) toolMap.set(tool.name, tool);
	const hasPendingApprovals = toolCalls.some((tc) => {
		return toolMap.get(tc.function.name)?.needsApproval && !approvals.has(`approval_${tc.id}`);
	});
	for (const toolCall of toolCalls) {
		const tool = toolMap.get(toolCall.function.name);
		const toolName = toolCall.function.name;
		if (!tool) {
			results.push({
				toolCallId: toolCall.id,
				toolName,
				result: { error: `Unknown tool: ${toolName}` },
				state: "output-error"
			});
			continue;
		}
		if (hasPendingApprovals) {
			if (!tool.needsApproval || approvals.has(`approval_${toolCall.id}`)) continue;
		}
		let input = {};
		const argsStr = toolCall.function.arguments.trim() || "{}";
		try {
			const parsed = JSON.parse(argsStr);
			input = parsed && typeof parsed === "object" ? parsed : {};
		} catch (parseError) {
			throw new Error(`Failed to parse tool arguments as JSON: ${argsStr}`);
		}
		if (tool.inputSchema && isStandardSchema(tool.inputSchema)) try {
			input = parseWithStandardSchema(tool.inputSchema, input);
		} catch (validationError) {
			const message = validationError instanceof Error ? validationError.message : "Validation failed";
			results.push({
				toolCallId: toolCall.id,
				toolName,
				result: { error: `Input validation failed for tool ${tool.name}: ${message}` },
				state: "output-error"
			});
			continue;
		}
		const pendingEvents = [];
		const context = {
			toolCallId: toolCall.id,
			context: userContext,
			emitCustomEvent: (eventName, value) => {
				if (createCustomEventChunk) pendingEvents.push(createCustomEventChunk(eventName, {
					...value,
					toolCallId: toolCall.id
				}));
			}
		};
		if (!tool.execute) {
			if (tool.needsApproval) {
				const approvalId = `approval_${toolCall.id}`;
				if (approvals.has(approvalId)) if (approvals.get(approvalId)) if (clientResults.has(toolCall.id)) results.push(buildClientToolResult(toolCall.id, toolName, tool, clientResults.get(toolCall.id)));
				else needsClientExecution.push({
					toolCallId: toolCall.id,
					toolName,
					input
				});
				else results.push({
					toolCallId: toolCall.id,
					toolName,
					result: { error: "User declined tool execution" },
					state: "output-error"
				});
				else needsApproval.push({
					toolCallId: toolCall.id,
					toolName: toolCall.function.name,
					input,
					approvalId
				});
			} else if (clientResults.has(toolCall.id)) results.push(buildClientToolResult(toolCall.id, toolName, tool, clientResults.get(toolCall.id)));
			else needsClientExecution.push({
				toolCallId: toolCall.id,
				toolName,
				input
			});
			continue;
		}
		if (tool.needsApproval) {
			const approvalId = `approval_${toolCall.id}`;
			if (approvals.has(approvalId)) if (approvals.get(approvalId)) {
				if (middlewareHooks) {
					const decision = await applyBeforeToolCallDecision(toolCall, tool, input, toolName, middlewareHooks, results);
					if (!decision.proceed) continue;
					input = decision.input;
				}
				yield* executeServerTool(toolCall, tool, toolName, input, context, pendingEvents, results, middlewareHooks);
			} else results.push({
				toolCallId: toolCall.id,
				toolName,
				result: { error: "User declined tool execution" },
				state: "output-error"
			});
			else needsApproval.push({
				toolCallId: toolCall.id,
				toolName,
				input,
				approvalId
			});
			continue;
		}
		if (middlewareHooks) {
			const decision = await applyBeforeToolCallDecision(toolCall, tool, input, toolName, middlewareHooks, results);
			if (!decision.proceed) continue;
			input = decision.input;
		}
		yield* executeServerTool(toolCall, tool, toolName, input, context, pendingEvents, results, middlewareHooks);
	}
	return {
		results,
		needsApproval,
		needsClientExecution
	};
}
//#endregion
//#region node_modules/.pnpm/@tanstack+ai@0.26.1/node_modules/@tanstack/ai/dist/esm/activities/chat/agent-loop-strategies.js
function maxIterations(max) {
	return ({ iterationCount }) => iterationCount < max;
}
//#endregion
//#region node_modules/.pnpm/@tanstack+ai@0.26.1/node_modules/@tanstack/ai/dist/esm/activities/chat/messages.js
function isContentPart(part) {
	return part.type === "text" || part.type === "image" || part.type === "audio" || part.type === "video" || part.type === "document";
}
function safeJsonStringify(value) {
	try {
		return JSON.stringify(value);
	} catch {
		return "";
	}
}
function collapseContentParts(parts) {
	if (parts.length === 0) return null;
	if (parts.every((p) => p.type === "text")) return parts.map((p) => p.content).join("") || null;
	return parts;
}
function convertMessagesToModelMessages(messages) {
	const anchoredToolCallIds = /* @__PURE__ */ new Set();
	for (const msg of messages) if ("parts" in msg) {
		for (const part of msg.parts) if (part.type === "tool-result") anchoredToolCallIds.add(part.toolCallId);
	}
	const modelMessages = [];
	for (const msg of messages) {
		if ("parts" in msg) {
			modelMessages.push(...uiMessageToModelMessages(msg));
			continue;
		}
		const role = msg.role;
		if (role === "tool" && msg.toolCallId && anchoredToolCallIds.has(msg.toolCallId)) continue;
		if (role === "reasoning" || role === "activity") continue;
		if (role === "developer") {
			modelMessages.push({
				role: "system",
				content: msg.content
			});
			continue;
		}
		modelMessages.push(msg);
	}
	return modelMessages;
}
function uiMessageToModelMessages(uiMessage) {
	if (uiMessage.role === "system") return [];
	if (uiMessage.role !== "assistant") return [buildUserOrToolMessage(uiMessage)];
	return buildAssistantMessages(uiMessage);
}
function buildUserOrToolMessage(uiMessage) {
	const contentParts = [];
	for (const part of uiMessage.parts) if (isContentPart(part)) contentParts.push(part);
	return {
		role: uiMessage.role,
		content: collapseContentParts(contentParts)
	};
}
function createSegment() {
	return {
		contentParts: [],
		toolCalls: []
	};
}
function isToolCallIncluded(part) {
	return part.state === "input-complete" || part.state === "complete" || part.state === "approval-responded" || part.output !== void 0;
}
function buildAssistantMessages(uiMessage) {
	const messageList = [];
	let current = createSegment();
	let pendingThinking = [];
	const emittedToolResultIds = /* @__PURE__ */ new Set();
	function flushSegment() {
		const content = collapseContentParts(current.contentParts);
		const hasContent = content !== null;
		const hasToolCalls = current.toolCalls.length > 0;
		if (hasContent || hasToolCalls) {
			messageList.push({
				role: "assistant",
				content,
				...hasToolCalls && { toolCalls: current.toolCalls },
				...pendingThinking.length > 0 && { thinking: pendingThinking }
			});
			pendingThinking = [];
		}
		current = createSegment();
	}
	for (const part of uiMessage.parts) switch (part.type) {
		case "text":
		case "image":
		case "audio":
		case "video":
		case "document":
			current.contentParts.push(part);
			break;
		case "tool-call":
			if (isToolCallIncluded(part)) current.toolCalls.push({
				id: part.id,
				type: "function",
				function: {
					name: part.name,
					arguments: part.arguments
				},
				...part.metadata !== void 0 && { metadata: part.metadata }
			});
			break;
		case "tool-result":
			flushSegment();
			if ((part.state === "complete" || part.state === "error") && !emittedToolResultIds.has(part.toolCallId)) {
				messageList.push({
					role: "tool",
					content: part.content,
					toolCallId: part.toolCallId
				});
				emittedToolResultIds.add(part.toolCallId);
			}
			break;
		case "thinking":
			if (part.content) pendingThinking.push({
				content: part.content,
				...part.signature && { signature: part.signature }
			});
			break;
		case "structured-output":
			if (part.status === "complete") {
				const serialized = part.raw !== "" ? part.raw : part.data !== void 0 ? safeJsonStringify(part.data) : "";
				if (serialized !== "") current.contentParts.push({
					type: "text",
					content: serialized
				});
			}
			break;
	}
	flushSegment();
	for (const part of uiMessage.parts) {
		if (part.type !== "tool-call") continue;
		if (part.output !== void 0 && !emittedToolResultIds.has(part.id)) {
			messageList.push({
				role: "tool",
				content: normalizeToolResult(part.output),
				toolCallId: part.id
			});
			emittedToolResultIds.add(part.id);
		}
		if (part.output === void 0 && part.state === "approval-responded" && part.approval?.approved !== void 0 && !emittedToolResultIds.has(part.id)) {
			const approved = part.approval.approved;
			messageList.push({
				role: "tool",
				content: JSON.stringify({
					approved,
					...approved && { pendingExecution: true },
					message: approved ? "User approved this action" : "User denied this action"
				}),
				toolCallId: part.id
			});
			emittedToolResultIds.add(part.id);
		}
	}
	if (messageList.length === 0) messageList.push({
		role: "assistant",
		content: null
	});
	return messageList;
}
function generateMessageId() {
	return `msg-${Date.now()}-${Math.random().toString(36).substring(7)}`;
}
//#endregion
//#region node_modules/.pnpm/@tanstack+ai@0.26.1/node_modules/@tanstack/ai/dist/esm/activities/chat/middleware/compose.js
function shouldSkipInstrumentation(mw) {
	return mw.name === "devtools" || mw.name === "strip-to-spec";
}
function instrumentCtx(ctx) {
	return {
		requestId: ctx.requestId,
		streamId: ctx.streamId,
		clientId: ctx.threadId,
		timestamp: Date.now()
	};
}
var MiddlewareRunner = class {
	middlewares;
	logger;
	constructor(middlewares, logger) {
		this.middlewares = middlewares;
		this.logger = logger;
	}
	get hasMiddleware() {
		return this.middlewares.length > 0;
	}
	/**
	* Pipe config through all middleware onConfig hooks in order.
	* Each middleware receives the merged config from previous middleware.
	* Partial returns are shallow-merged with the current config.
	*/
	async runOnConfig(ctx, config) {
		let current = config;
		for (const mw of this.middlewares) if (mw.onConfig) {
			const skip = shouldSkipInstrumentation(mw);
			const start = Date.now();
			const result = await mw.onConfig(ctx, current);
			const hasTransform = result !== void 0 && result !== null;
			if (hasTransform) {
				current = {
					...current,
					...result
				};
				if (!skip) this.logger.config(`middleware=${mw.name ?? "unnamed"} keys=${Object.keys(result).join(",")}`, {
					middleware: mw.name ?? "unnamed",
					changes: result
				});
			}
			if (!skip) {
				const base = instrumentCtx(ctx);
				aiEventClient.emit("middleware:hook:executed", {
					...base,
					middlewareName: mw.name || "unnamed",
					hookName: "onConfig",
					iteration: ctx.iteration,
					duration: Date.now() - start,
					hasTransform
				});
				if (hasTransform) aiEventClient.emit("middleware:config:transformed", {
					...base,
					middlewareName: mw.name || "unnamed",
					iteration: ctx.iteration,
					changes: result
				});
			}
		}
		return current;
	}
	/**
	* Pipe config through all middleware onStructuredOutputConfig hooks in order.
	* Each middleware receives the merged config from previous middleware.
	* Partial returns are shallow-merged with the current config.
	*
	* Called once at the structured-output boundary, before runOnConfig at the
	* same boundary (which receives a ChatMiddlewareConfig view, no outputSchema).
	*/
	async runOnStructuredOutputConfig(ctx, config) {
		let current = config;
		for (const mw of this.middlewares) if (mw.onStructuredOutputConfig) {
			const skip = shouldSkipInstrumentation(mw);
			const start = Date.now();
			const result = await mw.onStructuredOutputConfig(ctx, current);
			const hasTransform = result !== void 0 && result !== null;
			if (hasTransform) {
				current = {
					...current,
					...result
				};
				if (!skip) this.logger.config(`middleware=${mw.name ?? "unnamed"} keys=${Object.keys(result).join(",")}`, {
					middleware: mw.name ?? "unnamed",
					changes: result
				});
			}
			if (!skip) {
				const base = instrumentCtx(ctx);
				aiEventClient.emit("middleware:hook:executed", {
					...base,
					middlewareName: mw.name || "unnamed",
					hookName: "onStructuredOutputConfig",
					iteration: ctx.iteration,
					duration: Date.now() - start,
					hasTransform
				});
				if (hasTransform) aiEventClient.emit("middleware:config:transformed", {
					...base,
					middlewareName: mw.name || "unnamed",
					iteration: ctx.iteration,
					changes: Object.fromEntries(Object.entries(result))
				});
			}
		}
		return current;
	}
	/**
	* Call onStart on all middleware in order.
	*/
	async runOnStart(ctx) {
		for (const mw of this.middlewares) if (mw.onStart) {
			const skip = shouldSkipInstrumentation(mw);
			const start = Date.now();
			await mw.onStart(ctx);
			if (!skip) {
				this.logger.middleware(`hook=onStart middleware=${mw.name ?? "unnamed"}`, {
					middleware: mw.name ?? "unnamed",
					hook: "onStart"
				});
				aiEventClient.emit("middleware:hook:executed", {
					...instrumentCtx(ctx),
					middlewareName: mw.name || "unnamed",
					hookName: "onStart",
					iteration: ctx.iteration,
					duration: Date.now() - start,
					hasTransform: false
				});
			}
		}
	}
	/**
	* Pipe a single chunk through all middleware onChunk hooks in order.
	* Returns the resulting chunks (0..N) to yield to the consumer.
	*
	* - void: pass through unchanged
	* - chunk: replace with this chunk
	* - chunk[]: expand to multiple chunks
	* - null: drop the chunk entirely
	*/
	async runOnChunk(ctx, chunk) {
		let chunks = [chunk];
		for (const mw of this.middlewares) {
			if (!mw.onChunk) continue;
			const skip = shouldSkipInstrumentation(mw);
			const nextChunks = [];
			for (const c of chunks) {
				const chunkType = c.type;
				if (!skip) this.logger.middleware(`hook=onChunk middleware=${mw.name ?? "unnamed"} in=${chunkType}`, {
					middleware: mw.name ?? "unnamed",
					hook: "onChunk",
					in: c
				});
				const result = await mw.onChunk(ctx, c);
				if (result === null) {
					if (!skip) {
						this.logger.middleware(`hook=onChunk middleware=${mw.name ?? "unnamed"} in=${chunkType} out=<dropped>`, {
							middleware: mw.name ?? "unnamed",
							hook: "onChunk",
							dropped: true
						});
						aiEventClient.emit("middleware:chunk:transformed", {
							...instrumentCtx(ctx),
							middlewareName: mw.name || "unnamed",
							originalChunkType: chunkType,
							resultCount: 0,
							wasDropped: true
						});
					}
					continue;
				} else if (result === void 0) nextChunks.push(c);
				else if (Array.isArray(result)) {
					nextChunks.push(...result);
					if (!skip) {
						this.logger.middleware(`hook=onChunk middleware=${mw.name ?? "unnamed"} in=${chunkType} out=[${result.map((r) => r.type).join(",")}]`, {
							middleware: mw.name ?? "unnamed",
							hook: "onChunk",
							in: c,
							out: result
						});
						aiEventClient.emit("middleware:chunk:transformed", {
							...instrumentCtx(ctx),
							middlewareName: mw.name || "unnamed",
							originalChunkType: chunkType,
							resultCount: result.length,
							wasDropped: false
						});
					}
				} else {
					nextChunks.push(result);
					if (!skip) {
						this.logger.middleware(`hook=onChunk middleware=${mw.name ?? "unnamed"} in=${chunkType} out=${result.type}`, {
							middleware: mw.name ?? "unnamed",
							hook: "onChunk",
							in: c,
							out: result
						});
						aiEventClient.emit("middleware:chunk:transformed", {
							...instrumentCtx(ctx),
							middlewareName: mw.name || "unnamed",
							originalChunkType: chunkType,
							resultCount: 1,
							wasDropped: false
						});
					}
				}
			}
			chunks = nextChunks;
		}
		return chunks;
	}
	/**
	* Run onBeforeToolCall through middleware in order.
	* Returns the first non-void decision, or undefined to continue normally.
	*/
	async runOnBeforeToolCall(ctx, hookCtx) {
		for (const mw of this.middlewares) if (mw.onBeforeToolCall) {
			const skip = shouldSkipInstrumentation(mw);
			const start = Date.now();
			const decision = await mw.onBeforeToolCall(ctx, hookCtx);
			const hasTransform = decision !== void 0 && decision !== null;
			if (!skip) {
				this.logger.middleware(`hook=onBeforeToolCall middleware=${mw.name ?? "unnamed"}`, {
					middleware: mw.name ?? "unnamed",
					hook: "onBeforeToolCall"
				});
				aiEventClient.emit("middleware:hook:executed", {
					...instrumentCtx(ctx),
					middlewareName: mw.name || "unnamed",
					hookName: "onBeforeToolCall",
					iteration: ctx.iteration,
					duration: Date.now() - start,
					hasTransform
				});
			}
			if (hasTransform) return decision;
		}
	}
	/**
	* Run onAfterToolCall on all middleware in order.
	*/
	async runOnAfterToolCall(ctx, info) {
		for (const mw of this.middlewares) if (mw.onAfterToolCall) {
			const skip = shouldSkipInstrumentation(mw);
			const start = Date.now();
			await mw.onAfterToolCall(ctx, info);
			if (!skip) {
				this.logger.middleware(`hook=onAfterToolCall middleware=${mw.name ?? "unnamed"}`, {
					middleware: mw.name ?? "unnamed",
					hook: "onAfterToolCall"
				});
				aiEventClient.emit("middleware:hook:executed", {
					...instrumentCtx(ctx),
					middlewareName: mw.name || "unnamed",
					hookName: "onAfterToolCall",
					iteration: ctx.iteration,
					duration: Date.now() - start,
					hasTransform: false
				});
			}
		}
	}
	/**
	* Run onUsage on all middleware in order.
	*/
	async runOnUsage(ctx, usage) {
		for (const mw of this.middlewares) if (mw.onUsage) {
			const skip = shouldSkipInstrumentation(mw);
			const start = Date.now();
			await mw.onUsage(ctx, usage);
			if (!skip) {
				this.logger.middleware(`hook=onUsage middleware=${mw.name ?? "unnamed"}`, {
					middleware: mw.name ?? "unnamed",
					hook: "onUsage"
				});
				aiEventClient.emit("middleware:hook:executed", {
					...instrumentCtx(ctx),
					middlewareName: mw.name || "unnamed",
					hookName: "onUsage",
					iteration: ctx.iteration,
					duration: Date.now() - start,
					hasTransform: false
				});
			}
		}
	}
	/**
	* Run onFinish on all middleware in order.
	*/
	async runOnFinish(ctx, info) {
		for (const mw of this.middlewares) if (mw.onFinish) {
			const skip = shouldSkipInstrumentation(mw);
			const start = Date.now();
			await mw.onFinish(ctx, info);
			if (!skip) {
				this.logger.middleware(`hook=onFinish middleware=${mw.name ?? "unnamed"}`, {
					middleware: mw.name ?? "unnamed",
					hook: "onFinish"
				});
				aiEventClient.emit("middleware:hook:executed", {
					...instrumentCtx(ctx),
					middlewareName: mw.name || "unnamed",
					hookName: "onFinish",
					iteration: ctx.iteration,
					duration: Date.now() - start,
					hasTransform: false
				});
			}
		}
	}
	/**
	* Run onAbort on all middleware in order.
	*/
	async runOnAbort(ctx, info) {
		for (const mw of this.middlewares) if (mw.onAbort) {
			const skip = shouldSkipInstrumentation(mw);
			const start = Date.now();
			await mw.onAbort(ctx, info);
			if (!skip) {
				this.logger.middleware(`hook=onAbort middleware=${mw.name ?? "unnamed"}`, {
					middleware: mw.name ?? "unnamed",
					hook: "onAbort"
				});
				aiEventClient.emit("middleware:hook:executed", {
					...instrumentCtx(ctx),
					middlewareName: mw.name || "unnamed",
					hookName: "onAbort",
					iteration: ctx.iteration,
					duration: Date.now() - start,
					hasTransform: false
				});
			}
		}
	}
	/**
	* Run onError on all middleware in order.
	*/
	async runOnError(ctx, info) {
		for (const mw of this.middlewares) if (mw.onError) {
			const skip = shouldSkipInstrumentation(mw);
			const start = Date.now();
			await mw.onError(ctx, info);
			if (!skip) {
				this.logger.middleware(`hook=onError middleware=${mw.name ?? "unnamed"}`, {
					middleware: mw.name ?? "unnamed",
					hook: "onError"
				});
				aiEventClient.emit("middleware:hook:executed", {
					...instrumentCtx(ctx),
					middlewareName: mw.name || "unnamed",
					hookName: "onError",
					iteration: ctx.iteration,
					duration: Date.now() - start,
					hasTransform: false
				});
			}
		}
	}
	/**
	* Run onIteration on all middleware in order.
	* Called at the start of each agent loop iteration.
	*/
	async runOnIteration(ctx, info) {
		for (const mw of this.middlewares) if (mw.onIteration) {
			const skip = shouldSkipInstrumentation(mw);
			const start = Date.now();
			await mw.onIteration(ctx, info);
			if (!skip) {
				this.logger.middleware(`hook=onIteration middleware=${mw.name ?? "unnamed"}`, {
					middleware: mw.name ?? "unnamed",
					hook: "onIteration"
				});
				aiEventClient.emit("middleware:hook:executed", {
					...instrumentCtx(ctx),
					middlewareName: mw.name || "unnamed",
					hookName: "onIteration",
					iteration: ctx.iteration,
					duration: Date.now() - start,
					hasTransform: false
				});
			}
		}
	}
	/**
	* Run onToolPhaseComplete on all middleware in order.
	* Called after all tool calls in an iteration have been processed.
	*/
	async runOnToolPhaseComplete(ctx, info) {
		for (const mw of this.middlewares) if (mw.onToolPhaseComplete) {
			const skip = shouldSkipInstrumentation(mw);
			const start = Date.now();
			await mw.onToolPhaseComplete(ctx, info);
			if (!skip) {
				this.logger.middleware(`hook=onToolPhaseComplete middleware=${mw.name ?? "unnamed"}`, {
					middleware: mw.name ?? "unnamed",
					hook: "onToolPhaseComplete"
				});
				aiEventClient.emit("middleware:hook:executed", {
					...instrumentCtx(ctx),
					middlewareName: mw.name || "unnamed",
					hookName: "onToolPhaseComplete",
					iteration: ctx.iteration,
					duration: Date.now() - start,
					hasTransform: false
				});
			}
		}
	}
};
//#endregion
//#region node_modules/.pnpm/@tanstack+ai@0.26.1/node_modules/@tanstack/ai/dist/esm/activities/chat/index.js
var TextEngine = class {
	adapter;
	params;
	systemPrompts;
	tools;
	loopStrategy;
	toolCallManager;
	lazyToolManager;
	initialMessageCount;
	requestId;
	streamId;
	effectiveRequest;
	effectiveSignal;
	messages;
	iterationCount = 0;
	lastFinishReason = null;
	streamStartTime = 0;
	totalChunkCount = 0;
	currentMessageId = null;
	accumulatedContent = "";
	accumulatedThinking = [];
	currentThinkingContent = "";
	currentThinkingSignature = "";
	eventOptions;
	eventToolNames;
	finishedEvent = null;
	earlyTermination = false;
	toolPhase = "continue";
	cyclePhase = "processText";
	initialApprovals;
	initialClientToolResults;
	threadId;
	runIdOverride;
	parentRunIdOverride;
	middlewareRunner;
	middlewareCtx;
	deferredPromises = [];
	abortReason;
	middlewareAbortController;
	terminalHookCalled = false;
	logger;
	structuredOutputResult = null;
	combinedStartEmitted = false;
	combinedStructuredMessageId = null;
	validatedStructuredOutput = void 0;
	hasValidatedStructuredOutput = false;
	finalizationError = null;
	finalStructuredOutput;
	constructor(config, logger) {
		this.logger = logger;
		this.adapter = config.adapter;
		this.finalStructuredOutput = config.finalStructuredOutput;
		this.params = config.params;
		this.systemPrompts = config.params.systemPrompts || [];
		this.loopStrategy = config.params.agentLoopStrategy || maxIterations(5);
		this.initialMessageCount = config.params.messages.length;
		const { approvals, clientToolResults } = this.extractClientStateFromOriginalMessages(config.params.messages);
		this.initialApprovals = approvals;
		this.initialClientToolResults = clientToolResults;
		this.messages = convertMessagesToModelMessages(config.params.messages);
		this.lazyToolManager = new LazyToolManager(config.params.tools || [], this.messages);
		this.tools = this.lazyToolManager.getActiveTools();
		this.toolCallManager = new ToolCallManager(this.tools);
		this.requestId = this.createId("chat");
		this.streamId = this.createId("stream");
		this.effectiveRequest = config.params.abortController ? { signal: config.params.abortController.signal } : void 0;
		this.effectiveSignal = config.params.abortController?.signal;
		this.threadId = config.params.threadId || config.params.conversationId || this.createId("thread");
		this.runIdOverride = config.params.runId;
		this.parentRunIdOverride = config.params.parentRunId;
		const allMiddleware = [
			devtoolsMiddleware(),
			...config.middleware || [],
			stripToSpecMiddleware()
		];
		this.middlewareRunner = new MiddlewareRunner(allMiddleware, logger);
		this.middlewareAbortController = new AbortController();
		this.middlewareCtx = {
			requestId: this.requestId,
			streamId: this.streamId,
			runId: this.runIdOverride ?? this.requestId,
			threadId: this.threadId,
			conversationId: this.threadId,
			phase: "init",
			iteration: 0,
			chunkIndex: 0,
			signal: this.effectiveSignal,
			abort: (reason) => {
				this.abortReason = reason;
				this.middlewareAbortController?.abort(reason);
			},
			context: config.context,
			defer: (promise) => {
				this.deferredPromises.push(promise);
			},
			provider: config.adapter.name,
			model: config.params.model,
			source: "server",
			streaming: true,
			systemPrompts: this.systemPrompts,
			toolNames: void 0,
			options: void 0,
			modelOptions: config.params.modelOptions,
			messageCount: this.initialMessageCount,
			hasTools: this.tools.length > 0,
			currentMessageId: null,
			accumulatedContent: "",
			messages: this.messages,
			createId: (prefix) => this.createId(prefix)
		};
	}
	/** Get the accumulated content after the chat loop completes */
	getAccumulatedContent() {
		return this.accumulatedContent;
	}
	/** Get the final messages array after the chat loop completes */
	getMessages() {
		return this.messages;
	}
	/** Returns the structured-output result if finalization ran successfully. */
	getStructuredOutputResult() {
		return this.structuredOutputResult;
	}
	/**
	* Returns the validated structured-output value (the result of running
	* `finalStructuredOutput.validate` against the raw structured-output data)
	* wrapped in a `{ value }` object so callers can distinguish "no validation
	* happened" from "validation produced undefined". Returns `null` when no
	* validator was configured or validation hasn't been performed yet.
	*/
	getValidatedStructuredOutput() {
		return this.hasValidatedStructuredOutput ? { value: this.validatedStructuredOutput } : null;
	}
	/** Returns the recorded finalization error, if any. */
	getFinalizationError() {
		return this.finalizationError;
	}
	async *run() {
		this.beforeRun();
		this.logger.agentLoop("run started", { threadId: this.middlewareCtx.threadId });
		try {
			this.middlewareCtx.phase = "init";
			const initialConfig = this.buildMiddlewareConfig();
			const transformedConfig = await this.middlewareRunner.runOnConfig(this.middlewareCtx, initialConfig);
			this.applyMiddlewareConfig(transformedConfig);
			await this.middlewareRunner.runOnStart(this.middlewareCtx);
			if ((yield* this.checkForPendingToolCalls()) === "wait") return;
			if (!(!!this.finalStructuredOutput && this.tools.length === 0 && this.finalStructuredOutput.nativeCombined !== true)) do {
				if (this.earlyTermination || this.isCancelled()) return;
				this.logger.agentLoop(`iteration=${this.middlewareCtx.iteration}`, { iteration: this.middlewareCtx.iteration });
				await this.beginCycle();
				if (this.cyclePhase === "processText") {
					this.middlewareCtx.phase = "beforeModel";
					this.middlewareCtx.iteration = this.iterationCount;
					const iterConfig = this.buildMiddlewareConfig();
					const iterTransformedConfig = await this.middlewareRunner.runOnConfig(this.middlewareCtx, iterConfig);
					this.applyMiddlewareConfig(iterTransformedConfig);
					yield* this.streamModelResponse();
				} else yield* this.processToolCalls();
				this.endCycle();
			} while (this.shouldContinue());
			this.logger.agentLoop("run finished", { finishReason: this.lastFinishReason });
			if (this.finalStructuredOutput && !this.isCancelled() && !this.finalizationError) if (this.finalStructuredOutput.nativeCombined === true) yield* this.harvestCombinedStructuredOutput();
			else yield* this.runStructuredFinalization();
			if (!this.terminalHookCalled && this.toolPhase !== "wait" && !this.isCancelled()) if (this.finalizationError) {
				this.terminalHookCalled = true;
				const errForHook = new Error(this.finalizationError.message, this.finalizationError.cause !== void 0 ? { cause: this.finalizationError.cause } : void 0);
				if (this.finalizationError.code !== void 0) Object.defineProperty(errForHook, "code", {
					value: this.finalizationError.code,
					enumerable: true
				});
				await this.middlewareRunner.runOnError(this.middlewareCtx, {
					error: errForHook,
					duration: Date.now() - this.streamStartTime
				});
			} else {
				this.terminalHookCalled = true;
				await this.middlewareRunner.runOnFinish(this.middlewareCtx, {
					finishReason: this.lastFinishReason,
					duration: Date.now() - this.streamStartTime,
					content: this.accumulatedContent,
					usage: this.finishedEvent?.usage
				});
			}
		} catch (error) {
			if (!this.terminalHookCalled) {
				this.terminalHookCalled = true;
				if (error instanceof MiddlewareAbortError) {
					this.abortReason = error.message;
					await this.middlewareRunner.runOnAbort(this.middlewareCtx, {
						reason: error.message,
						duration: Date.now() - this.streamStartTime
					});
				} else {
					this.logger.errors("chat run failed", {
						error,
						threadId: this.middlewareCtx.threadId
					});
					await this.middlewareRunner.runOnError(this.middlewareCtx, {
						error,
						duration: Date.now() - this.streamStartTime
					});
				}
			}
			if (!(error instanceof MiddlewareAbortError)) throw error;
		} finally {
			if (!this.terminalHookCalled && this.isCancelled()) {
				this.terminalHookCalled = true;
				await this.middlewareRunner.runOnAbort(this.middlewareCtx, {
					reason: this.abortReason,
					duration: Date.now() - this.streamStartTime
				});
			}
			if (this.deferredPromises.length > 0) await Promise.allSettled(this.deferredPromises);
		}
	}
	beforeRun() {
		this.streamStartTime = Date.now();
		const { tools, temperature, topP, maxTokens, metadata } = this.params;
		const options = {};
		if (temperature !== void 0) options.temperature = temperature;
		if (topP !== void 0) options.topP = topP;
		if (maxTokens !== void 0) options.maxTokens = maxTokens;
		if (metadata !== void 0) options.metadata = metadata;
		this.eventOptions = Object.keys(options).length > 0 ? options : void 0;
		this.eventToolNames = tools?.map((t) => t.name);
		this.middlewareCtx.options = this.eventOptions;
		this.middlewareCtx.toolNames = this.eventToolNames;
	}
	async beginCycle() {
		if (this.cyclePhase === "processText") await this.beginIteration();
	}
	endCycle() {
		if (this.cyclePhase === "processText") {
			this.cyclePhase = "executeToolCalls";
			return;
		}
		this.cyclePhase = "processText";
		this.iterationCount++;
	}
	async beginIteration() {
		this.currentMessageId = this.createId("msg");
		this.accumulatedContent = "";
		this.accumulatedThinking = [];
		this.currentThinkingContent = "";
		this.currentThinkingSignature = "";
		this.finishedEvent = null;
		this.middlewareCtx.currentMessageId = this.currentMessageId;
		this.middlewareCtx.accumulatedContent = "";
		await this.middlewareRunner.runOnIteration(this.middlewareCtx, {
			iteration: this.iterationCount,
			messageId: this.currentMessageId
		});
	}
	async *streamModelResponse() {
		const { temperature, topP, maxTokens, metadata, modelOptions } = this.params;
		const toolsWithJsonSchemas = this.tools.map((tool) => ({
			...tool,
			inputSchema: tool.inputSchema ? convertSchemaToJsonSchema(tool.inputSchema) : void 0,
			outputSchema: tool.outputSchema ? convertSchemaToJsonSchema(tool.outputSchema) : void 0
		}));
		this.middlewareCtx.phase = "modelStream";
		const providerName = this.adapter.provider ?? this.adapter.name;
		this.logger.request(`activity=chat provider=${providerName} model=${this.params.model} messages=${this.messages.length} tools=${this.tools.length} stream=true`, {
			provider: providerName,
			model: this.params.model,
			messageCount: this.messages.length,
			toolCount: this.tools.length
		});
		const combinedSchema = this.finalStructuredOutput?.nativeCombined === true ? this.finalStructuredOutput.jsonSchema : void 0;
		for await (const chunk of this.adapter.chatStream({
			model: this.params.model,
			messages: this.messages,
			tools: toolsWithJsonSchemas,
			temperature,
			topP,
			maxTokens,
			metadata,
			request: this.effectiveRequest,
			modelOptions,
			systemPrompts: this.systemPrompts,
			logger: this.logger,
			threadId: this.threadId,
			runId: this.runIdOverride,
			parentRunId: this.parentRunIdOverride,
			...combinedSchema ? { outputSchema: combinedSchema } : {}
		})) {
			if (this.isCancelled()) break;
			this.totalChunkCount++;
			this.handleStreamChunk(chunk);
			if (this.finalStructuredOutput?.nativeCombined === true && this.finalStructuredOutput.yieldChunks && !this.combinedStartEmitted && chunk.type === EventType$1.TEXT_MESSAGE_START) {
				this.combinedStartEmitted = true;
				const messageId = typeof chunk.messageId === "string" && chunk.messageId !== "" ? chunk.messageId : generateMessageId();
				this.combinedStructuredMessageId = messageId;
				const synthStart = {
					type: EventType$1.CUSTOM,
					name: "structured-output.start",
					value: { messageId },
					model: this.params.model,
					timestamp: Date.now(),
					threadId: this.threadId,
					...this.runIdOverride ? { runId: this.runIdOverride } : {}
				};
				const synthOutputs = await this.middlewareRunner.runOnChunk(this.middlewareCtx, synthStart);
				for (const outputChunk of synthOutputs) {
					yield outputChunk;
					this.middlewareCtx.chunkIndex++;
				}
			}
			const outputChunks = await this.middlewareRunner.runOnChunk(this.middlewareCtx, chunk);
			const suppressAgentLifecycle = !!this.finalStructuredOutput && this.finalStructuredOutput.yieldChunks && this.finalStructuredOutput.nativeCombined !== true;
			for (const outputChunk of outputChunks) {
				if (suppressAgentLifecycle && (outputChunk.type === EventType$1.RUN_STARTED || outputChunk.type === EventType$1.RUN_FINISHED)) continue;
				this.logger.output(`type=${outputChunk.type}`, { chunk: outputChunk });
				yield outputChunk;
				this.middlewareCtx.chunkIndex++;
			}
			if (chunk.type === "RUN_FINISHED" && chunk.usage) await this.middlewareRunner.runOnUsage(this.middlewareCtx, chunk.usage);
			if (this.earlyTermination) break;
		}
	}
	handleStreamChunk(chunk) {
		switch (chunk.type) {
			case "TEXT_MESSAGE_CONTENT":
				this.handleTextMessageContentEvent(chunk);
				break;
			case "TOOL_CALL_START":
				this.handleToolCallStartEvent(chunk);
				break;
			case "TOOL_CALL_ARGS":
				this.handleToolCallArgsEvent(chunk);
				break;
			case "TOOL_CALL_END":
				this.handleToolCallEndEvent(chunk);
				break;
			case "RUN_FINISHED":
				this.handleRunFinishedEvent(chunk);
				break;
			case "RUN_ERROR":
				this.handleRunErrorEvent(chunk);
				break;
			case "STEP_STARTED":
				this.handleStepStartedEvent();
				break;
			case "STEP_FINISHED":
				this.handleStepFinishedEvent(chunk);
				break;
		}
	}
	handleTextMessageContentEvent(chunk) {
		if (chunk.content) this.accumulatedContent = chunk.content;
		else this.accumulatedContent += chunk.delta;
		this.middlewareCtx.accumulatedContent = this.accumulatedContent;
	}
	handleToolCallStartEvent(chunk) {
		this.toolCallManager.addToolCallStartEvent(chunk);
	}
	handleToolCallArgsEvent(chunk) {
		this.toolCallManager.addToolCallArgsEvent(chunk);
	}
	handleToolCallEndEvent(chunk) {
		this.toolCallManager.completeToolCall(chunk);
	}
	handleRunFinishedEvent(chunk) {
		this.finishedEvent = chunk;
		this.lastFinishReason = chunk.finishReason ?? null;
	}
	handleRunErrorEvent(_chunk) {
		this.earlyTermination = true;
	}
	finalizeCurrentThinkingStep() {
		if (this.currentThinkingContent) {
			this.accumulatedThinking.push({
				content: this.currentThinkingContent,
				...this.currentThinkingSignature && { signature: this.currentThinkingSignature }
			});
			this.currentThinkingContent = "";
			this.currentThinkingSignature = "";
		}
	}
	handleStepStartedEvent() {
		this.finalizeCurrentThinkingStep();
	}
	handleStepFinishedEvent(chunk) {
		if (chunk.delta) this.currentThinkingContent += chunk.delta;
		if (chunk.signature) this.currentThinkingSignature = chunk.signature;
	}
	async *checkForPendingToolCalls() {
		const pendingToolCalls = this.getPendingToolCallsFromMessages();
		if (pendingToolCalls.length === 0) return "continue";
		const finishEvent = this.createSyntheticFinishedEvent();
		const undiscoveredLazyResults = [];
		const executablePendingCalls = pendingToolCalls.filter((tc) => {
			if (this.lazyToolManager.isUndiscoveredLazyTool(tc.function.name)) {
				undiscoveredLazyResults.push({
					toolCallId: tc.id,
					toolName: tc.function.name,
					result: { error: this.lazyToolManager.getUndiscoveredToolError(tc.function.name) },
					state: "output-error"
				});
				return false;
			}
			return true;
		});
		if (undiscoveredLazyResults.length > 0) for (const chunk of this.buildToolResultChunks(undiscoveredLazyResults, finishEvent)) yield* this.pipeThroughMiddleware(chunk);
		if (executablePendingCalls.length === 0) return "continue";
		const { approvals, clientToolResults } = this.collectClientState();
		const generator = executeToolCalls(executablePendingCalls, this.tools, approvals, clientToolResults, (eventName, data) => this.createCustomEventChunk(eventName, data), {
			onBeforeToolCall: async (toolCall, tool, args) => {
				this.logger.tools(`phase=before name=${toolCall.function.name}`, {
					name: toolCall.function.name,
					args
				});
				const hookCtx = {
					toolCall,
					tool,
					args,
					toolName: toolCall.function.name,
					toolCallId: toolCall.id
				};
				return this.middlewareRunner.runOnBeforeToolCall(this.middlewareCtx, hookCtx);
			},
			onAfterToolCall: async (info) => {
				this.logger.tools(`phase=after name=${info.toolName}`, {
					name: info.toolName,
					result: info.result
				});
				await this.middlewareRunner.runOnAfterToolCall(this.middlewareCtx, info);
			}
		}, this.middlewareCtx.context);
		const executionResult = yield* this.drainToolCallGenerator(generator);
		if (this.isMiddlewareAborted()) {
			this.setToolPhase("stop");
			return "stop";
		}
		await this.middlewareRunner.runOnToolPhaseComplete(this.middlewareCtx, {
			toolCalls: pendingToolCalls,
			results: executionResult.results,
			needsApproval: executionResult.needsApproval,
			needsClientExecution: executionResult.needsClientExecution
		});
		const argsMap = /* @__PURE__ */ new Map();
		for (const tc of pendingToolCalls) argsMap.set(tc.id, tc.function.arguments);
		if (executionResult.needsApproval.length > 0 || executionResult.needsClientExecution.length > 0) {
			if (executionResult.results.length > 0) for (const chunk of this.buildToolResultChunks(executionResult.results, finishEvent, argsMap)) yield* this.pipeThroughMiddleware(chunk);
			for (const chunk of this.buildApprovalChunks(executionResult.needsApproval, finishEvent)) yield* this.pipeThroughMiddleware(chunk);
			for (const chunk of this.buildClientToolChunks(executionResult.needsClientExecution, finishEvent)) yield* this.pipeThroughMiddleware(chunk);
			this.setToolPhase("wait");
			return "wait";
		}
		const toolResultChunks = this.buildToolResultChunks(executionResult.results, finishEvent, argsMap);
		for (const chunk of toolResultChunks) yield* this.pipeThroughMiddleware(chunk);
		return "continue";
	}
	async *processToolCalls() {
		if (!this.shouldExecuteToolPhase()) {
			this.setToolPhase("stop");
			return;
		}
		const toolCalls = this.toolCallManager.getToolCalls();
		const finishEvent = this.finishedEvent;
		if (!finishEvent || toolCalls.length === 0) {
			this.setToolPhase("stop");
			return;
		}
		this.addAssistantToolCallMessage(toolCalls);
		const undiscoveredLazyResults = [];
		const executableToolCalls = toolCalls.filter((tc) => {
			if (this.lazyToolManager.isUndiscoveredLazyTool(tc.function.name)) {
				undiscoveredLazyResults.push({
					toolCallId: tc.id,
					toolName: tc.function.name,
					result: { error: this.lazyToolManager.getUndiscoveredToolError(tc.function.name) },
					state: "output-error"
				});
				return false;
			}
			return true;
		});
		if (undiscoveredLazyResults.length > 0 && this.finishedEvent) for (const chunk of this.buildToolResultChunks(undiscoveredLazyResults, this.finishedEvent)) yield* this.pipeThroughMiddleware(chunk);
		if (executableToolCalls.length === 0) {
			this.toolCallManager.clear();
			this.setToolPhase("continue");
			return;
		}
		this.middlewareCtx.phase = "beforeTools";
		const { approvals, clientToolResults } = this.collectClientState();
		const generator = executeToolCalls(executableToolCalls, this.tools, approvals, clientToolResults, (eventName, data) => this.createCustomEventChunk(eventName, data), {
			onBeforeToolCall: async (toolCall, tool, args) => {
				this.logger.tools(`phase=before name=${toolCall.function.name}`, {
					name: toolCall.function.name,
					args
				});
				const hookCtx = {
					toolCall,
					tool,
					args,
					toolName: toolCall.function.name,
					toolCallId: toolCall.id
				};
				return this.middlewareRunner.runOnBeforeToolCall(this.middlewareCtx, hookCtx);
			},
			onAfterToolCall: async (info) => {
				this.logger.tools(`phase=after name=${info.toolName}`, {
					name: info.toolName,
					result: info.result
				});
				await this.middlewareRunner.runOnAfterToolCall(this.middlewareCtx, info);
			}
		}, this.middlewareCtx.context);
		const executionResult = yield* this.drainToolCallGenerator(generator);
		this.middlewareCtx.phase = "afterTools";
		if (this.isMiddlewareAborted()) {
			this.setToolPhase("stop");
			return;
		}
		await this.middlewareRunner.runOnToolPhaseComplete(this.middlewareCtx, {
			toolCalls,
			results: executionResult.results,
			needsApproval: executionResult.needsApproval,
			needsClientExecution: executionResult.needsClientExecution
		});
		if (executionResult.needsApproval.length > 0 || executionResult.needsClientExecution.length > 0) {
			if (executionResult.results.length > 0) for (const chunk of this.buildToolResultChunks(executionResult.results, finishEvent)) yield* this.pipeThroughMiddleware(chunk);
			for (const chunk of this.buildApprovalChunks(executionResult.needsApproval, finishEvent)) yield* this.pipeThroughMiddleware(chunk);
			for (const chunk of this.buildClientToolChunks(executionResult.needsClientExecution, finishEvent)) yield* this.pipeThroughMiddleware(chunk);
			this.setToolPhase("wait");
			return;
		}
		const toolResultChunks = this.buildToolResultChunks(executionResult.results, finishEvent);
		for (const chunk of toolResultChunks) yield* this.pipeThroughMiddleware(chunk);
		if (this.lazyToolManager.hasNewlyDiscoveredTools()) {
			this.tools = this.lazyToolManager.getActiveTools();
			this.toolCallManager = new ToolCallManager(this.tools);
			this.setToolPhase("continue");
			return;
		}
		this.toolCallManager.clear();
		this.setToolPhase("continue");
	}
	shouldExecuteToolPhase() {
		return this.finishedEvent?.finishReason === "tool_calls" && this.tools.length > 0 && this.toolCallManager.hasToolCalls();
	}
	addAssistantToolCallMessage(toolCalls) {
		this.finalizeCurrentThinkingStep();
		this.messages = [...this.messages, {
			role: "assistant",
			content: this.accumulatedContent || null,
			toolCalls,
			...this.accumulatedThinking.length > 0 && { thinking: this.accumulatedThinking }
		}];
	}
	/**
	* Extract client state (approvals and client tool results) from original messages.
	* This is called in the constructor BEFORE converting to ModelMessage format,
	* because the parts array (which contains approval state) is lost during conversion.
	*/
	extractClientStateFromOriginalMessages(originalMessages) {
		const approvals = /* @__PURE__ */ new Map();
		const clientToolResults = /* @__PURE__ */ new Map();
		for (const message of originalMessages) if (message.role === "assistant" && message.parts) {
			for (const part of message.parts) if (part.type === "tool-call") {
				if (part.output !== void 0 && !part.approval) clientToolResults.set(part.id, part.output);
				if (part.approval?.id && part.approval?.approved !== void 0 && part.state === "approval-responded") approvals.set(part.approval.id, part.approval.approved);
			}
		}
		return {
			approvals,
			clientToolResults
		};
	}
	collectClientState() {
		const approvals = new Map(this.initialApprovals);
		const clientToolResults = new Map(this.initialClientToolResults);
		for (const message of this.messages) if (message.role === "tool" && message.toolCallId) {
			let output;
			if (Array.isArray(message.content)) output = message.content;
			else try {
				output = JSON.parse(message.content);
			} catch {
				output = message.content;
			}
			if (output && typeof output === "object" && output.pendingExecution === true) continue;
			clientToolResults.set(message.toolCallId, output);
		}
		return {
			approvals,
			clientToolResults
		};
	}
	buildApprovalChunks(approvals, finishEvent) {
		const chunks = [];
		for (const approval of approvals) chunks.push({
			type: "CUSTOM",
			timestamp: Date.now(),
			model: finishEvent.model,
			name: "approval-requested",
			value: {
				toolCallId: approval.toolCallId,
				toolName: approval.toolName,
				input: approval.input,
				approval: {
					id: approval.approvalId,
					needsApproval: true
				}
			}
		});
		return chunks;
	}
	buildClientToolChunks(clientRequests, finishEvent) {
		const chunks = [];
		for (const clientTool of clientRequests) chunks.push({
			type: "CUSTOM",
			timestamp: Date.now(),
			model: finishEvent.model,
			name: "tool-input-available",
			value: {
				toolCallId: clientTool.toolCallId,
				toolName: clientTool.toolName,
				input: clientTool.input
			}
		});
		return chunks;
	}
	buildToolResultChunks(results, finishEvent, argsMap) {
		const chunks = [];
		for (const result of results) {
			const content = normalizeToolResult(result.result);
			const wireContent = typeof content === "string" ? content : JSON.stringify(content);
			if (argsMap) {
				chunks.push({
					type: "TOOL_CALL_START",
					timestamp: Date.now(),
					model: finishEvent.model,
					toolCallId: result.toolCallId,
					toolCallName: result.toolName,
					toolName: result.toolName
				});
				const args = argsMap.get(result.toolCallId) ?? "{}";
				chunks.push({
					type: "TOOL_CALL_ARGS",
					timestamp: Date.now(),
					model: finishEvent.model,
					toolCallId: result.toolCallId,
					delta: args,
					args
				});
			}
			chunks.push({
				type: "TOOL_CALL_END",
				timestamp: Date.now(),
				model: finishEvent.model,
				toolCallId: result.toolCallId,
				toolCallName: result.toolName,
				toolName: result.toolName,
				result: wireContent,
				...result.state !== void 0 && { state: result.state }
			});
			chunks.push({
				type: "TOOL_CALL_RESULT",
				timestamp: Date.now(),
				model: finishEvent.model,
				messageId: this.createId("tool-result"),
				toolCallId: result.toolCallId,
				content: wireContent,
				role: "tool",
				...result.state !== void 0 && { state: result.state }
			});
			const placeholderIdx = this.messages.findIndex((m) => {
				if (m.role !== "tool" || m.toolCallId !== result.toolCallId) return false;
				if (typeof m.content !== "string") return false;
				try {
					return JSON.parse(m.content)?.pendingExecution === true;
				} catch {
					return false;
				}
			});
			const newToolMessage = {
				role: "tool",
				content,
				toolCallId: result.toolCallId
			};
			if (placeholderIdx >= 0) this.messages = [
				...this.messages.slice(0, placeholderIdx),
				newToolMessage,
				...this.messages.slice(placeholderIdx + 1)
			];
			else this.messages = [...this.messages, newToolMessage];
		}
		return chunks;
	}
	getPendingToolCallsFromMessages() {
		const completedToolIds = /* @__PURE__ */ new Set();
		for (const message of this.messages) if (message.role === "tool" && message.toolCallId) {
			let hasPendingExecution = false;
			if (typeof message.content === "string") try {
				if (JSON.parse(message.content).pendingExecution === true) hasPendingExecution = true;
			} catch {}
			if (!hasPendingExecution) completedToolIds.add(message.toolCallId);
		}
		const pending = [];
		for (const message of this.messages) if (message.role === "assistant" && message.toolCalls) {
			for (const toolCall of message.toolCalls) if (!completedToolIds.has(toolCall.id)) pending.push(toolCall);
		}
		return pending;
	}
	createSyntheticFinishedEvent() {
		return {
			type: "RUN_FINISHED",
			runId: this.createId("pending"),
			threadId: this.threadId,
			model: this.params.model,
			timestamp: Date.now(),
			finishReason: "tool_calls"
		};
	}
	shouldContinue() {
		if (this.cyclePhase === "executeToolCalls") return true;
		return this.loopStrategy({
			iterationCount: this.iterationCount,
			messages: this.messages,
			finishReason: this.lastFinishReason
		}) && this.toolPhase === "continue";
	}
	isAborted() {
		return !!this.effectiveSignal?.aborted;
	}
	isMiddlewareAborted() {
		return !!this.middlewareAbortController?.signal.aborted;
	}
	isCancelled() {
		return this.isAborted() || this.isMiddlewareAborted();
	}
	/**
	* Run the final structured-output adapter call through the middleware
	* pipeline. Yields chunks to the caller only when
	* `this.finalStructuredOutput.yieldChunks` is true; otherwise consumes
	* silently while still piping through middleware.
	*
	* On success, populates this.structuredOutputResult.
	* On failure, populates this.finalizationError.
	*/
	async *runStructuredFinalization() {
		if (!this.finalStructuredOutput) throw new Error("runStructuredFinalization called without finalStructuredOutput config");
		this.middlewareCtx.phase = "structuredOutput";
		const baseConfig = this.buildMiddlewareConfig();
		const { tools: _omitTools, ...baseWithoutTools } = baseConfig;
		let structuredConfig = {
			...baseWithoutTools,
			outputSchema: this.finalStructuredOutput.jsonSchema
		};
		structuredConfig = await this.middlewareRunner.runOnStructuredOutputConfig(this.middlewareCtx, structuredConfig);
		const { outputSchema: pinnedSchema, ...chatConfigSlice } = structuredConfig;
		const postOnConfig = await this.middlewareRunner.runOnConfig(this.middlewareCtx, {
			...chatConfigSlice,
			tools: baseConfig.tools
		});
		this.applyMiddlewareConfig(postOnConfig);
		const structuredCallOptions = {
			chatOptions: {
				model: this.params.model,
				messages: this.messages,
				temperature: postOnConfig.temperature,
				topP: postOnConfig.topP,
				maxTokens: postOnConfig.maxTokens,
				metadata: postOnConfig.metadata,
				modelOptions: postOnConfig.modelOptions,
				systemPrompts: postOnConfig.systemPrompts,
				logger: this.logger,
				threadId: this.threadId,
				runId: this.runIdOverride,
				parentRunId: this.parentRunIdOverride,
				...this.effectiveRequest ? { request: this.effectiveRequest } : {}
			},
			outputSchema: pinnedSchema
		};
		let fallbackAdapterError = void 0;
		const providerStream = this.adapter.structuredOutputStream ? this.adapter.structuredOutputStream(structuredCallOptions) : fallbackStructuredOutputStream(this.adapter, structuredCallOptions, (err) => {
			fallbackAdapterError = err;
		});
		let startEmitted = false;
		let structuredMessageId = null;
		const extractMessageId = (c) => {
			if (c.type === EventType$1.TEXT_MESSAGE_START || c.type === EventType$1.TEXT_MESSAGE_CONTENT || c.type === EventType$1.TEXT_MESSAGE_END) return typeof c.messageId === "string" && c.messageId !== "" ? c.messageId : null;
			return null;
		};
		const buildSynthesizedStart = () => {
			const idForStart = structuredMessageId ?? generateMessageId();
			structuredMessageId = idForStart;
			return {
				type: EventType$1.CUSTOM,
				name: "structured-output.start",
				value: { messageId: idForStart },
				model: this.params.model,
				timestamp: Date.now(),
				threadId: this.threadId,
				...this.runIdOverride ? { runId: this.runIdOverride } : {}
			};
		};
		const pipeThroughMiddleware = async (synthChunk) => this.middlewareRunner.runOnChunk(this.middlewareCtx, synthChunk);
		let runErrorYielded = false;
		for await (const chunk of providerStream) {
			if (this.isCancelled()) break;
			if (!startEmitted && chunk.type === EventType$1.CUSTOM && chunk.name === "structured-output.start") startEmitted = true;
			if (!structuredMessageId) {
				const extracted = extractMessageId(chunk);
				if (extracted) structuredMessageId = extracted;
			}
			if (this.finalStructuredOutput.yieldChunks) {
				if (!startEmitted && (chunk.type === EventType$1.TEXT_MESSAGE_START || chunk.type === EventType$1.TEXT_MESSAGE_CONTENT || chunk.type === EventType$1.TEXT_MESSAGE_END)) {
					startEmitted = true;
					const synthOutputs = await pipeThroughMiddleware(buildSynthesizedStart());
					for (const outputChunk of synthOutputs) {
						yield outputChunk;
						this.middlewareCtx.chunkIndex++;
					}
				}
				if (!startEmitted && chunk.type === EventType$1.RUN_ERROR) {
					startEmitted = true;
					const synthOutputs = await pipeThroughMiddleware(buildSynthesizedStart());
					for (const outputChunk of synthOutputs) {
						yield outputChunk;
						this.middlewareCtx.chunkIndex++;
					}
				}
			}
			if (chunk.type === EventType$1.CUSTOM && chunk.name === "structured-output.complete") {
				const parsed = readStructuredOutputCompleteValue(chunk.value);
				if (parsed) this.structuredOutputResult = {
					data: parsed.object,
					rawText: parsed.raw
				};
			}
			if (chunk.type === EventType$1.RUN_FINISHED && chunk.usage) await this.middlewareRunner.runOnUsage(this.middlewareCtx, chunk.usage);
			if (chunk.type === EventType$1.RUN_ERROR) this.finalizationError = {
				message: chunk.message,
				...chunk.code ? { code: chunk.code } : {},
				...fallbackAdapterError !== void 0 ? { cause: fallbackAdapterError } : {}
			};
			const outputChunks = await this.middlewareRunner.runOnChunk(this.middlewareCtx, chunk);
			if (this.finalStructuredOutput.yieldChunks) for (const outputChunk of outputChunks) {
				if (outputChunk.type === EventType$1.RUN_ERROR) runErrorYielded = true;
				yield outputChunk;
				this.middlewareCtx.chunkIndex++;
			}
			if (this.finalizationError) break;
		}
		if (this.isCancelled()) return;
		if (!this.structuredOutputResult && !this.finalizationError) this.finalizationError = {
			message: "missing structured result",
			code: "structured-output-missing-result"
		};
		if (this.structuredOutputResult && !this.finalizationError && this.finalStructuredOutput.validate) try {
			const validated = this.finalStructuredOutput.validate(this.structuredOutputResult.data);
			this.validatedStructuredOutput = validated;
			this.hasValidatedStructuredOutput = true;
		} catch (err) {
			const message = err instanceof Error ? err.message : String(err);
			this.finalizationError = {
				message,
				code: "structured-output-validation-failed",
				cause: err
			};
		}
		if (this.finalizationError && this.finalStructuredOutput.yieldChunks && !runErrorYielded) {
			if (!startEmitted) {
				const startOutputs = await pipeThroughMiddleware(buildSynthesizedStart());
				for (const outputChunk of startOutputs) {
					yield outputChunk;
					this.middlewareCtx.chunkIndex++;
				}
				startEmitted = true;
			}
			const errChunk = {
				type: EventType$1.RUN_ERROR,
				runId: this.runIdOverride ?? this.requestId,
				model: this.params.model,
				timestamp: Date.now(),
				threadId: this.threadId,
				message: this.finalizationError.message,
				...this.finalizationError.code ? { code: this.finalizationError.code } : {},
				error: {
					message: this.finalizationError.message,
					...this.finalizationError.code ? { code: this.finalizationError.code } : {}
				}
			};
			const outputChunks = await this.middlewareRunner.runOnChunk(this.middlewareCtx, errChunk);
			for (const outputChunk of outputChunks) {
				yield outputChunk;
				this.middlewareCtx.chunkIndex++;
			}
		}
	}
	/**
	* Native combined mode: harvest the structured output from the agent
	* loop's accumulated final-turn text (no separate provider call).
	*
	* The adapter wired `outputSchema` into the regular `chatStream` request,
	* so the model's final-turn text is the schema-constrained JSON. We parse
	* `this.accumulatedContent`, populate `this.structuredOutputResult`, emit
	* a synthetic `structured-output.complete` (and a `structured-output.start`
	* if one wasn't emitted earlier — only happens on the streaming path when
	* the model returned no text at all), and run the validate callback when
	* present. Failures populate `this.finalizationError` so the engine's
	* terminal-hook chooser routes to `onError` (per spec §7.3).
	*
	* The `'structuredOutput'` middleware phase intentionally does NOT fire on
	* this path — middleware sees the run through `beforeModel` / `modelStream`
	* as usual. See PR #605 / issue #605 for the design rationale.
	*/
	async *harvestCombinedStructuredOutput() {
		if (!this.finalStructuredOutput) throw new Error("harvestCombinedStructuredOutput called without finalStructuredOutput config");
		const yieldChunks = this.finalStructuredOutput.yieldChunks;
		const rawText = this.accumulatedContent;
		if (rawText.length === 0) this.finalizationError = {
			message: "missing structured result",
			code: "structured-output-missing-result"
		};
		else try {
			const parsed = JSON.parse(rawText);
			this.structuredOutputResult = {
				data: parsed,
				rawText
			};
		} catch (err) {
			const detail = rawText.slice(0, 200) + (rawText.length > 200 ? "..." : "");
			this.finalizationError = {
				message: `Failed to parse structured output as JSON. Content: ${detail}`,
				code: "structured-output-parse-failed",
				cause: err
			};
		}
		if (this.structuredOutputResult && !this.finalizationError && this.finalStructuredOutput.validate) try {
			const validated = this.finalStructuredOutput.validate(this.structuredOutputResult.data);
			this.validatedStructuredOutput = validated;
			this.hasValidatedStructuredOutput = true;
		} catch (err) {
			const message = err instanceof Error ? err.message : String(err);
			this.finalizationError = {
				message,
				code: "structured-output-validation-failed",
				cause: err
			};
		}
		if (!yieldChunks) return;
		if (!this.combinedStartEmitted) {
			this.combinedStartEmitted = true;
			const messageId = this.combinedStructuredMessageId ?? generateMessageId();
			this.combinedStructuredMessageId = messageId;
			const synthStart = {
				type: EventType$1.CUSTOM,
				name: "structured-output.start",
				value: { messageId },
				model: this.params.model,
				timestamp: Date.now(),
				threadId: this.threadId,
				...this.runIdOverride ? { runId: this.runIdOverride } : {}
			};
			const startOutputs = await this.middlewareRunner.runOnChunk(this.middlewareCtx, synthStart);
			for (const outputChunk of startOutputs) {
				yield outputChunk;
				this.middlewareCtx.chunkIndex++;
			}
		}
		if (this.structuredOutputResult && !this.finalizationError) {
			const completeChunk = {
				type: EventType$1.CUSTOM,
				name: "structured-output.complete",
				value: {
					object: this.structuredOutputResult.data,
					raw: this.structuredOutputResult.rawText,
					...this.combinedStructuredMessageId ? { messageId: this.combinedStructuredMessageId } : {}
				},
				model: this.params.model,
				timestamp: Date.now(),
				threadId: this.threadId,
				...this.runIdOverride ? { runId: this.runIdOverride } : {}
			};
			const completeOutputs = await this.middlewareRunner.runOnChunk(this.middlewareCtx, completeChunk);
			for (const outputChunk of completeOutputs) {
				yield outputChunk;
				this.middlewareCtx.chunkIndex++;
			}
		}
		if (this.finalizationError) {
			const errChunk = {
				type: EventType$1.RUN_ERROR,
				runId: this.runIdOverride ?? this.requestId,
				model: this.params.model,
				timestamp: Date.now(),
				threadId: this.threadId,
				message: this.finalizationError.message,
				...this.finalizationError.code ? { code: this.finalizationError.code } : {},
				error: {
					message: this.finalizationError.message,
					...this.finalizationError.code ? { code: this.finalizationError.code } : {}
				}
			};
			const errOutputs = await this.middlewareRunner.runOnChunk(this.middlewareCtx, errChunk);
			for (const outputChunk of errOutputs) {
				yield outputChunk;
				this.middlewareCtx.chunkIndex++;
			}
		}
	}
	buildMiddlewareConfig() {
		return {
			messages: this.messages,
			systemPrompts: [...this.systemPrompts],
			tools: [...this.tools],
			temperature: this.params.temperature,
			topP: this.params.topP,
			maxTokens: this.params.maxTokens,
			metadata: this.params.metadata,
			modelOptions: this.params.modelOptions
		};
	}
	applyMiddlewareConfig(config) {
		this.messages = config.messages;
		this.systemPrompts = config.systemPrompts;
		this.tools = config.tools;
		this.params = {
			...this.params,
			temperature: config.temperature,
			topP: config.topP,
			maxTokens: config.maxTokens,
			metadata: config.metadata,
			modelOptions: config.modelOptions
		};
		this.middlewareCtx.messages = this.messages;
		this.middlewareCtx.systemPrompts = this.systemPrompts;
		this.middlewareCtx.hasTools = this.tools.length > 0;
		this.middlewareCtx.toolNames = this.tools.map((t) => t.name);
		this.middlewareCtx.modelOptions = config.modelOptions;
	}
	setToolPhase(phase) {
		this.toolPhase = phase;
	}
	/**
	* Pipe a single chunk through the middleware pipeline (strip-to-spec, devtools, etc.)
	* and yield all resulting output chunks.
	*/
	async *pipeThroughMiddleware(chunk) {
		const outputChunks = await this.middlewareRunner.runOnChunk(this.middlewareCtx, chunk);
		for (const outputChunk of outputChunks) {
			yield outputChunk;
			this.middlewareCtx.chunkIndex++;
		}
	}
	/**
	* Drain an executeToolCalls async generator, yielding any CustomEvent chunks
	* through the middleware pipeline and returning the final ExecuteToolCallsResult.
	*/
	async *drainToolCallGenerator(generator) {
		let next = await generator.next();
		while (!next.done) {
			yield* this.pipeThroughMiddleware(next.value);
			next = await generator.next();
		}
		return next.value;
	}
	createCustomEventChunk(eventName, value) {
		return {
			type: "CUSTOM",
			timestamp: Date.now(),
			model: this.params.model,
			name: eventName,
			value
		};
	}
	createId(prefix) {
		return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
	}
};
function chat(options) {
	const { outputSchema, stream } = options;
	if (outputSchema && stream === true) return runStreamingStructuredOutput({
		...options,
		outputSchema,
		stream
	});
	if (outputSchema) return runAgenticStructuredOutput({
		...options,
		outputSchema
	});
	if (stream === false) return runNonStreamingText({
		...options,
		outputSchema: void 0,
		stream
	});
	return runStreamingText({
		...options,
		outputSchema: void 0,
		stream
	});
}
async function* runStreamingText(options) {
	const { adapter, middleware, context, debug, ...textOptions } = options;
	const model = adapter.model;
	const logger = resolveDebugOption(debug);
	const engine = new TextEngine({
		adapter,
		params: {
			...textOptions,
			model,
			logger
		},
		middleware,
		context
	}, logger);
	for await (const chunk of engine.run()) yield chunk;
}
function runNonStreamingText(options) {
	return streamToText(runStreamingText(options));
}
async function runAgenticStructuredOutput(options) {
	const { adapter, outputSchema, middleware, context, debug, ...textOptions } = options;
	const model = adapter.model;
	const logger = resolveDebugOption(debug);
	if (!outputSchema) throw new Error("outputSchema is required for structured output");
	const jsonSchema = convertSchemaToJsonSchema(outputSchema, { forStructuredOutput: true });
	if (!jsonSchema) throw new Error("Failed to convert output schema to JSON Schema");
	const validate = isStandardSchema(outputSchema) ? (data) => parseWithStandardSchema(outputSchema, data) : void 0;
	const nativeCombined = adapter.supportsCombinedToolsAndSchema?.(options.modelOptions) === true;
	const engine = new TextEngine({
		adapter,
		params: {
			...textOptions,
			model,
			logger
		},
		middleware,
		context,
		finalStructuredOutput: {
			jsonSchema,
			yieldChunks: false,
			...validate ? { validate } : {},
			...nativeCombined ? { nativeCombined: true } : {}
		}
	}, logger);
	for await (const _chunk of engine.run());
	const finalizationError = engine.getFinalizationError();
	if (finalizationError) {
		const err = new Error(finalizationError.message, finalizationError.cause !== void 0 ? { cause: finalizationError.cause } : void 0);
		if (finalizationError.code !== void 0) Object.defineProperty(err, "code", {
			value: finalizationError.code,
			enumerable: true
		});
		throw err;
	}
	const validated = engine.getValidatedStructuredOutput();
	if (validated) return validated.value;
	const result = engine.getStructuredOutputResult();
	if (!result) throw new Error("structured output finalization produced no result");
	return result.data;
}
function readStructuredOutputCompleteValue(value) {
	if (typeof value !== "object" || value === null) return null;
	if (!("object" in value) || !("raw" in value)) return null;
	const raw = value.raw;
	if (typeof raw !== "string") return null;
	const reasoningField = value.reasoning;
	const reasoning = typeof reasoningField === "string" ? reasoningField : void 0;
	return {
		object: value.object,
		raw,
		...reasoning !== void 0 ? { reasoning } : {}
	};
}
async function* fallbackStructuredOutputStream(adapter, options, onAdapterError) {
	const { chatOptions } = options;
	const fallbackRand = Math.random().toString(36).slice(2);
	const runId = chatOptions.runId ?? `fallback-${Date.now()}-${fallbackRand}`;
	const threadId = chatOptions.threadId ?? `fallback-${Date.now()}-${fallbackRand}`;
	const messageId = `fallback-${Date.now()}-${fallbackRand}`;
	const model = chatOptions.model;
	const timestamp = Date.now();
	yield {
		type: EventType$1.RUN_STARTED,
		runId,
		threadId,
		model,
		timestamp
	};
	let result;
	try {
		result = await adapter.structuredOutput(options);
	} catch (error) {
		onAdapterError?.(error);
		const message = error instanceof Error ? error.message : String(error);
		yield {
			type: EventType$1.RUN_ERROR,
			runId,
			threadId,
			model,
			timestamp,
			message,
			error: { message }
		};
		return;
	}
	yield {
		type: EventType$1.TEXT_MESSAGE_START,
		messageId,
		role: "assistant",
		model,
		timestamp
	};
	yield {
		type: EventType$1.TEXT_MESSAGE_CONTENT,
		messageId,
		delta: result.rawText,
		model,
		timestamp
	};
	yield {
		type: EventType$1.TEXT_MESSAGE_END,
		messageId,
		model,
		timestamp
	};
	yield {
		type: EventType$1.CUSTOM,
		name: "structured-output.complete",
		value: {
			object: result.data,
			raw: result.rawText
		},
		model,
		timestamp
	};
	yield {
		type: EventType$1.RUN_FINISHED,
		runId,
		threadId,
		model,
		timestamp,
		finishReason: "stop"
	};
}
function runStreamingStructuredOutput(options) {
	const { outputSchema } = options;
	if (!outputSchema) throw new Error("outputSchema is required for streaming structured output");
	const jsonSchema = convertSchemaToJsonSchema(outputSchema, { forStructuredOutput: true });
	if (!jsonSchema) throw new Error("Failed to convert output schema to JSON Schema");
	return runStreamingStructuredOutputImpl(options, jsonSchema);
}
async function* runStreamingStructuredOutputImpl(options, jsonSchema) {
	const { adapter, outputSchema, middleware, context, debug, ...textOptions } = options;
	const model = adapter.model;
	const logger = resolveDebugOption(debug);
	const nativeCombined = adapter.supportsCombinedToolsAndSchema?.(options.modelOptions) === true;
	const engine = new TextEngine({
		adapter,
		params: {
			...textOptions,
			model,
			logger
		},
		middleware,
		context,
		finalStructuredOutput: {
			jsonSchema,
			yieldChunks: true,
			...nativeCombined ? { nativeCombined: true } : {}
		}
	}, logger);
	for await (const chunk of engine.run()) yield chunk;
}
//#endregion
//#region node_modules/.pnpm/@tanstack+ai@0.26.1/node_modules/@tanstack/ai/dist/esm/utilities/usage.js
function buildBaseUsage(input) {
	return {
		promptTokens: input.promptTokens,
		completionTokens: input.completionTokens,
		totalTokens: input.totalTokens
	};
}
//#endregion
//#region node_modules/.pnpm/@tanstack+ai@0.26.1/node_modules/@tanstack/ai/dist/esm/system-prompts.js
function normalizeSystemPrompts(prompts) {
	if (!prompts || prompts.length === 0) return [];
	return prompts.map((p, i) => {
		if (typeof p === "string") return { content: p };
		const candidate = p;
		if (candidate === null || typeof candidate !== "object") throw new TypeError(`systemPrompts[${i}]: expected a string or { content, metadata? }, got ${candidate === null ? "null" : typeof candidate}`);
		const { content } = candidate;
		if (typeof content !== "string") throw new TypeError(`systemPrompts[${i}]: content must be a string, got ${typeof content}`);
		return p;
	});
}
//#endregion
//#region node_modules/.pnpm/@tanstack+ai@0.26.1/node_modules/@tanstack/ai/dist/esm/utilities/chat-params.js
var KNOWN_PART_TYPES = /* @__PURE__ */ new Set([
	"text",
	"image",
	"audio",
	"video",
	"document",
	"tool-call",
	"tool-result",
	"thinking"
]);
function isValidParts(value) {
	if (!Array.isArray(value)) return false;
	for (const p of value) {
		if (!p || typeof p !== "object") return false;
		const type = p.type;
		if (typeof type !== "string" || !KNOWN_PART_TYPES.has(type)) return false;
	}
	return true;
}
function chatParamsFromRequestBody(body) {
	const parseResult = RunAgentInputSchema.safeParse(body);
	if (!parseResult.success) return Promise.reject(new AGUIError(`Request body is not a valid AG-UI RunAgentInput. If you're upgrading from a previous @tanstack/ai-client release, see docs/migration/ag-ui-compliance.md. Validation errors: ${parseResult.error.message}`));
	const parsed = parseResult.data;
	const aguiContext = parsed.context;
	const rawMessages = body.messages ?? [];
	const messages = parsed.messages.map((m, i) => {
		const raw = rawMessages[i];
		if (raw && typeof raw === "object" && "parts" in raw && isValidParts(raw.parts)) return {
			...m,
			parts: raw.parts
		};
		return m;
	});
	return Promise.resolve({
		messages,
		threadId: parsed.threadId,
		runId: parsed.runId,
		parentRunId: parsed.parentRunId,
		tools: parsed.tools,
		forwardedProps: parsed.forwardedProps ?? {},
		state: parsed.state,
		context: aguiContext,
		aguiContext
	});
}
async function chatParamsFromRequest(req) {
	let body;
	try {
		body = await req.json();
	} catch (cause) {
		const res = new Response("Invalid AG-UI request body. See docs/migration/ag-ui-compliance.md.", { status: 400 });
		res.cause = cause;
		throw res;
	}
	try {
		return await chatParamsFromRequestBody(body);
	} catch (cause) {
		const res = new Response("Invalid AG-UI request body. See docs/migration/ag-ui-compliance.md.", { status: 400 });
		res.cause = cause;
		throw res;
	}
}
//#endregion
//#region node_modules/.pnpm/@tanstack+ai@0.26.1/node_modules/@tanstack/ai/dist/esm/activities/chat/adapter.js
var BaseTextAdapter = class {
	kind = "text";
	model;
	config;
	constructor(config = {}, model) {
		this.config = config;
		this.model = model;
	}
	generateId() {
		return `${this.name}-${Date.now()}-${Math.random().toString(36).substring(7)}`;
	}
};
//#endregion
export { parseWithStandardSchema$1 as _, chat as a, toRunErrorRawEvent as c, StreamProcessor as d, uiMessagesToWire as f, isStandardSchema$1 as g, convertSchemaToJsonSchema$1 as h, buildBaseUsage as i, EventClient as l, normalizeToUIMessage as m, chatParamsFromRequest as n, toServerSentEventsResponse as o, generateMessageId$1 as p, normalizeSystemPrompts as r, toRunErrorPayload as s, BaseTextAdapter as t, EventType as u };

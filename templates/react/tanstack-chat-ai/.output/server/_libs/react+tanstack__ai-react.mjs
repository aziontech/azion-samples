import { i as __toESM, t as __commonJSMin } from "../_runtime.mjs";
import { i as unenvProcess, r as init_process } from "../index.mjs";
import { n as ChatClient, t as createChatDevtoolsBridge } from "./@tanstack/ai-client+[...].mjs";
//#region node_modules/.pnpm/react@19.2.7/node_modules/react/cjs/react.production.js
/**
* @license React
* react.production.js
*
* Copyright (c) Meta Platforms, Inc. and affiliates.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*/
var require_react_production = /* @__PURE__ */ __commonJSMin(((exports) => {
	init_process();
	var REACT_ELEMENT_TYPE = Symbol.for("react.transitional.element"), REACT_PORTAL_TYPE = Symbol.for("react.portal"), REACT_FRAGMENT_TYPE = Symbol.for("react.fragment"), REACT_STRICT_MODE_TYPE = Symbol.for("react.strict_mode"), REACT_PROFILER_TYPE = Symbol.for("react.profiler"), REACT_CONSUMER_TYPE = Symbol.for("react.consumer"), REACT_CONTEXT_TYPE = Symbol.for("react.context"), REACT_FORWARD_REF_TYPE = Symbol.for("react.forward_ref"), REACT_SUSPENSE_TYPE = Symbol.for("react.suspense"), REACT_MEMO_TYPE = Symbol.for("react.memo"), REACT_LAZY_TYPE = Symbol.for("react.lazy"), REACT_ACTIVITY_TYPE = Symbol.for("react.activity"), MAYBE_ITERATOR_SYMBOL = Symbol.iterator;
	function getIteratorFn(maybeIterable) {
		if (null === maybeIterable || "object" !== typeof maybeIterable) return null;
		maybeIterable = MAYBE_ITERATOR_SYMBOL && maybeIterable[MAYBE_ITERATOR_SYMBOL] || maybeIterable["@@iterator"];
		return "function" === typeof maybeIterable ? maybeIterable : null;
	}
	var ReactNoopUpdateQueue = {
		isMounted: function() {
			return !1;
		},
		enqueueForceUpdate: function() {},
		enqueueReplaceState: function() {},
		enqueueSetState: function() {}
	}, assign = Object.assign, emptyObject = {};
	function Component(props, context, updater) {
		this.props = props;
		this.context = context;
		this.refs = emptyObject;
		this.updater = updater || ReactNoopUpdateQueue;
	}
	Component.prototype.isReactComponent = {};
	Component.prototype.setState = function(partialState, callback) {
		if ("object" !== typeof partialState && "function" !== typeof partialState && null != partialState) throw Error("takes an object of state variables to update or a function which returns an object of state variables.");
		this.updater.enqueueSetState(this, partialState, callback, "setState");
	};
	Component.prototype.forceUpdate = function(callback) {
		this.updater.enqueueForceUpdate(this, callback, "forceUpdate");
	};
	function ComponentDummy() {}
	ComponentDummy.prototype = Component.prototype;
	function PureComponent(props, context, updater) {
		this.props = props;
		this.context = context;
		this.refs = emptyObject;
		this.updater = updater || ReactNoopUpdateQueue;
	}
	var pureComponentPrototype = PureComponent.prototype = new ComponentDummy();
	pureComponentPrototype.constructor = PureComponent;
	assign(pureComponentPrototype, Component.prototype);
	pureComponentPrototype.isPureReactComponent = !0;
	var isArrayImpl = Array.isArray;
	function noop() {}
	var ReactSharedInternals = {
		H: null,
		A: null,
		T: null,
		S: null
	}, hasOwnProperty = Object.prototype.hasOwnProperty;
	function ReactElement(type, key, props) {
		var refProp = props.ref;
		return {
			$$typeof: REACT_ELEMENT_TYPE,
			type,
			key,
			ref: void 0 !== refProp ? refProp : null,
			props
		};
	}
	function cloneAndReplaceKey(oldElement, newKey) {
		return ReactElement(oldElement.type, newKey, oldElement.props);
	}
	function isValidElement(object) {
		return "object" === typeof object && null !== object && object.$$typeof === REACT_ELEMENT_TYPE;
	}
	function escape(key) {
		var escaperLookup = {
			"=": "=0",
			":": "=2"
		};
		return "$" + key.replace(/[=:]/g, function(match) {
			return escaperLookup[match];
		});
	}
	var userProvidedKeyEscapeRegex = /\/+/g;
	function getElementKey(element, index) {
		return "object" === typeof element && null !== element && null != element.key ? escape("" + element.key) : index.toString(36);
	}
	function resolveThenable(thenable) {
		switch (thenable.status) {
			case "fulfilled": return thenable.value;
			case "rejected": throw thenable.reason;
			default: switch ("string" === typeof thenable.status ? thenable.then(noop, noop) : (thenable.status = "pending", thenable.then(function(fulfilledValue) {
				"pending" === thenable.status && (thenable.status = "fulfilled", thenable.value = fulfilledValue);
			}, function(error) {
				"pending" === thenable.status && (thenable.status = "rejected", thenable.reason = error);
			})), thenable.status) {
				case "fulfilled": return thenable.value;
				case "rejected": throw thenable.reason;
			}
		}
		throw thenable;
	}
	function mapIntoArray(children, array, escapedPrefix, nameSoFar, callback) {
		var type = typeof children;
		if ("undefined" === type || "boolean" === type) children = null;
		var invokeCallback = !1;
		if (null === children) invokeCallback = !0;
		else switch (type) {
			case "bigint":
			case "string":
			case "number":
				invokeCallback = !0;
				break;
			case "object": switch (children.$$typeof) {
				case REACT_ELEMENT_TYPE:
				case REACT_PORTAL_TYPE:
					invokeCallback = !0;
					break;
				case REACT_LAZY_TYPE: return invokeCallback = children._init, mapIntoArray(invokeCallback(children._payload), array, escapedPrefix, nameSoFar, callback);
			}
		}
		if (invokeCallback) return callback = callback(children), invokeCallback = "" === nameSoFar ? "." + getElementKey(children, 0) : nameSoFar, isArrayImpl(callback) ? (escapedPrefix = "", null != invokeCallback && (escapedPrefix = invokeCallback.replace(userProvidedKeyEscapeRegex, "$&/") + "/"), mapIntoArray(callback, array, escapedPrefix, "", function(c) {
			return c;
		})) : null != callback && (isValidElement(callback) && (callback = cloneAndReplaceKey(callback, escapedPrefix + (null == callback.key || children && children.key === callback.key ? "" : ("" + callback.key).replace(userProvidedKeyEscapeRegex, "$&/") + "/") + invokeCallback)), array.push(callback)), 1;
		invokeCallback = 0;
		var nextNamePrefix = "" === nameSoFar ? "." : nameSoFar + ":";
		if (isArrayImpl(children)) for (var i = 0; i < children.length; i++) nameSoFar = children[i], type = nextNamePrefix + getElementKey(nameSoFar, i), invokeCallback += mapIntoArray(nameSoFar, array, escapedPrefix, type, callback);
		else if (i = getIteratorFn(children), "function" === typeof i) for (children = i.call(children), i = 0; !(nameSoFar = children.next()).done;) nameSoFar = nameSoFar.value, type = nextNamePrefix + getElementKey(nameSoFar, i++), invokeCallback += mapIntoArray(nameSoFar, array, escapedPrefix, type, callback);
		else if ("object" === type) {
			if ("function" === typeof children.then) return mapIntoArray(resolveThenable(children), array, escapedPrefix, nameSoFar, callback);
			array = String(children);
			throw Error("Objects are not valid as a React child (found: " + ("[object Object]" === array ? "object with keys {" + Object.keys(children).join(", ") + "}" : array) + "). If you meant to render a collection of children, use an array instead.");
		}
		return invokeCallback;
	}
	function mapChildren(children, func, context) {
		if (null == children) return children;
		var result = [], count = 0;
		mapIntoArray(children, result, "", "", function(child) {
			return func.call(context, child, count++);
		});
		return result;
	}
	function lazyInitializer(payload) {
		if (-1 === payload._status) {
			var ctor = payload._result;
			ctor = ctor();
			ctor.then(function(moduleObject) {
				if (0 === payload._status || -1 === payload._status) payload._status = 1, payload._result = moduleObject;
			}, function(error) {
				if (0 === payload._status || -1 === payload._status) payload._status = 2, payload._result = error;
			});
			-1 === payload._status && (payload._status = 0, payload._result = ctor);
		}
		if (1 === payload._status) return payload._result.default;
		throw payload._result;
	}
	var reportGlobalError = "function" === typeof reportError ? reportError : function(error) {
		if ("object" === typeof window && "function" === typeof window.ErrorEvent) {
			var event = new window.ErrorEvent("error", {
				bubbles: !0,
				cancelable: !0,
				message: "object" === typeof error && null !== error && "string" === typeof error.message ? String(error.message) : String(error),
				error
			});
			if (!window.dispatchEvent(event)) return;
		} else if ("object" === typeof unenvProcess && "function" === typeof unenvProcess.emit) {
			unenvProcess.emit("uncaughtException", error);
			return;
		}
		console.error(error);
	}, Children = {
		map: mapChildren,
		forEach: function(children, forEachFunc, forEachContext) {
			mapChildren(children, function() {
				forEachFunc.apply(this, arguments);
			}, forEachContext);
		},
		count: function(children) {
			var n = 0;
			mapChildren(children, function() {
				n++;
			});
			return n;
		},
		toArray: function(children) {
			return mapChildren(children, function(child) {
				return child;
			}) || [];
		},
		only: function(children) {
			if (!isValidElement(children)) throw Error("React.Children.only expected to receive a single React element child.");
			return children;
		}
	};
	exports.Activity = REACT_ACTIVITY_TYPE;
	exports.Children = Children;
	exports.Component = Component;
	exports.Fragment = REACT_FRAGMENT_TYPE;
	exports.Profiler = REACT_PROFILER_TYPE;
	exports.PureComponent = PureComponent;
	exports.StrictMode = REACT_STRICT_MODE_TYPE;
	exports.Suspense = REACT_SUSPENSE_TYPE;
	exports.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = ReactSharedInternals;
	exports.__COMPILER_RUNTIME = {
		__proto__: null,
		c: function(size) {
			return ReactSharedInternals.H.useMemoCache(size);
		}
	};
	exports.cache = function(fn) {
		return function() {
			return fn.apply(null, arguments);
		};
	};
	exports.cacheSignal = function() {
		return null;
	};
	exports.cloneElement = function(element, config, children) {
		if (null === element || void 0 === element) throw Error("The argument must be a React element, but you passed " + element + ".");
		var props = assign({}, element.props), key = element.key;
		if (null != config) for (propName in void 0 !== config.key && (key = "" + config.key), config) !hasOwnProperty.call(config, propName) || "key" === propName || "__self" === propName || "__source" === propName || "ref" === propName && void 0 === config.ref || (props[propName] = config[propName]);
		var propName = arguments.length - 2;
		if (1 === propName) props.children = children;
		else if (1 < propName) {
			for (var childArray = Array(propName), i = 0; i < propName; i++) childArray[i] = arguments[i + 2];
			props.children = childArray;
		}
		return ReactElement(element.type, key, props);
	};
	exports.createContext = function(defaultValue) {
		defaultValue = {
			$$typeof: REACT_CONTEXT_TYPE,
			_currentValue: defaultValue,
			_currentValue2: defaultValue,
			_threadCount: 0,
			Provider: null,
			Consumer: null
		};
		defaultValue.Provider = defaultValue;
		defaultValue.Consumer = {
			$$typeof: REACT_CONSUMER_TYPE,
			_context: defaultValue
		};
		return defaultValue;
	};
	exports.createElement = function(type, config, children) {
		var propName, props = {}, key = null;
		if (null != config) for (propName in void 0 !== config.key && (key = "" + config.key), config) hasOwnProperty.call(config, propName) && "key" !== propName && "__self" !== propName && "__source" !== propName && (props[propName] = config[propName]);
		var childrenLength = arguments.length - 2;
		if (1 === childrenLength) props.children = children;
		else if (1 < childrenLength) {
			for (var childArray = Array(childrenLength), i = 0; i < childrenLength; i++) childArray[i] = arguments[i + 2];
			props.children = childArray;
		}
		if (type && type.defaultProps) for (propName in childrenLength = type.defaultProps, childrenLength) void 0 === props[propName] && (props[propName] = childrenLength[propName]);
		return ReactElement(type, key, props);
	};
	exports.createRef = function() {
		return { current: null };
	};
	exports.forwardRef = function(render) {
		return {
			$$typeof: REACT_FORWARD_REF_TYPE,
			render
		};
	};
	exports.isValidElement = isValidElement;
	exports.lazy = function(ctor) {
		return {
			$$typeof: REACT_LAZY_TYPE,
			_payload: {
				_status: -1,
				_result: ctor
			},
			_init: lazyInitializer
		};
	};
	exports.memo = function(type, compare) {
		return {
			$$typeof: REACT_MEMO_TYPE,
			type,
			compare: void 0 === compare ? null : compare
		};
	};
	exports.startTransition = function(scope) {
		var prevTransition = ReactSharedInternals.T, currentTransition = {};
		ReactSharedInternals.T = currentTransition;
		try {
			var returnValue = scope(), onStartTransitionFinish = ReactSharedInternals.S;
			null !== onStartTransitionFinish && onStartTransitionFinish(currentTransition, returnValue);
			"object" === typeof returnValue && null !== returnValue && "function" === typeof returnValue.then && returnValue.then(noop, reportGlobalError);
		} catch (error) {
			reportGlobalError(error);
		} finally {
			null !== prevTransition && null !== currentTransition.types && (prevTransition.types = currentTransition.types), ReactSharedInternals.T = prevTransition;
		}
	};
	exports.unstable_useCacheRefresh = function() {
		return ReactSharedInternals.H.useCacheRefresh();
	};
	exports.use = function(usable) {
		return ReactSharedInternals.H.use(usable);
	};
	exports.useActionState = function(action, initialState, permalink) {
		return ReactSharedInternals.H.useActionState(action, initialState, permalink);
	};
	exports.useCallback = function(callback, deps) {
		return ReactSharedInternals.H.useCallback(callback, deps);
	};
	exports.useContext = function(Context) {
		return ReactSharedInternals.H.useContext(Context);
	};
	exports.useDebugValue = function() {};
	exports.useDeferredValue = function(value, initialValue) {
		return ReactSharedInternals.H.useDeferredValue(value, initialValue);
	};
	exports.useEffect = function(create, deps) {
		return ReactSharedInternals.H.useEffect(create, deps);
	};
	exports.useEffectEvent = function(callback) {
		return ReactSharedInternals.H.useEffectEvent(callback);
	};
	exports.useId = function() {
		return ReactSharedInternals.H.useId();
	};
	exports.useImperativeHandle = function(ref, create, deps) {
		return ReactSharedInternals.H.useImperativeHandle(ref, create, deps);
	};
	exports.useInsertionEffect = function(create, deps) {
		return ReactSharedInternals.H.useInsertionEffect(create, deps);
	};
	exports.useLayoutEffect = function(create, deps) {
		return ReactSharedInternals.H.useLayoutEffect(create, deps);
	};
	exports.useMemo = function(create, deps) {
		return ReactSharedInternals.H.useMemo(create, deps);
	};
	exports.useOptimistic = function(passthrough, reducer) {
		return ReactSharedInternals.H.useOptimistic(passthrough, reducer);
	};
	exports.useReducer = function(reducer, initialArg, init) {
		return ReactSharedInternals.H.useReducer(reducer, initialArg, init);
	};
	exports.useRef = function(initialValue) {
		return ReactSharedInternals.H.useRef(initialValue);
	};
	exports.useState = function(initialState) {
		return ReactSharedInternals.H.useState(initialState);
	};
	exports.useSyncExternalStore = function(subscribe, getSnapshot, getServerSnapshot) {
		return ReactSharedInternals.H.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
	};
	exports.useTransition = function() {
		return ReactSharedInternals.H.useTransition();
	};
	exports.version = "19.2.7";
}));
//#endregion
//#region node_modules/.pnpm/react@19.2.7/node_modules/react/index.js
var require_react = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = require_react_production();
}));
//#endregion
//#region node_modules/.pnpm/@tanstack+ai-react@0.15.4_@tanstack+ai@0.26.1_@types+react@19.2.17_react@19.2.7/node_modules/@tanstack/ai-react/dist/esm/use-chat.js
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
function useChat(options) {
	const hookId = (0, import_react.useId)();
	const clientId = options.id || hookId;
	const [messages, setMessages] = (0, import_react.useState)(options.initialMessages || []);
	const [isLoading, setIsLoading] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)(void 0);
	const [status, setStatus] = (0, import_react.useState)("ready");
	const [isSubscribed, setIsSubscribed] = (0, import_react.useState)(false);
	const [connectionStatus, setConnectionStatus] = (0, import_react.useState)("disconnected");
	const [sessionGenerating, setSessionGenerating] = (0, import_react.useState)(false);
	const messagesRef = (0, import_react.useRef)(options.initialMessages || []);
	const isFirstMountRef = (0, import_react.useRef)(true);
	const activeClientRef = (0, import_react.useRef)(null);
	const cleanupInvalidationRef = (0, import_react.useRef)(null);
	messagesRef.current = messages;
	const optionsRef = (0, import_react.useRef)(options);
	optionsRef.current = options;
	const client = (0, import_react.useMemo)(() => {
		const messagesToUse = options.initialMessages || [];
		isFirstMountRef.current = false;
		const initialOptions = optionsRef.current;
		const instance = new ChatClient({
			devtoolsBridgeFactory: createChatDevtoolsBridge,
			...initialOptions.connection ? { connection: initialOptions.connection } : { fetcher: initialOptions.fetcher },
			id: clientId,
			initialMessages: messagesToUse,
			...initialOptions.body !== void 0 && { body: initialOptions.body },
			...initialOptions.threadId !== void 0 && { threadId: initialOptions.threadId },
			...initialOptions.forwardedProps !== void 0 && { forwardedProps: initialOptions.forwardedProps },
			...initialOptions.persistence !== void 0 && { persistence: initialOptions.persistence },
			...initialOptions.context !== void 0 && { context: initialOptions.context },
			devtools: {
				...initialOptions.devtools,
				framework: "react",
				hookName: "useChat",
				outputKind: initialOptions.outputSchema ? "structured" : "chat"
			},
			onResponse: (response) => {
				if (activeClientRef.current !== instance) return;
				optionsRef.current.onResponse?.(response);
			},
			onChunk: (chunk) => {
				if (activeClientRef.current !== instance) return;
				optionsRef.current.onChunk?.(chunk);
			},
			onFinish: (message) => {
				if (activeClientRef.current !== instance) return;
				optionsRef.current.onFinish?.(message);
			},
			onError: (error2) => {
				if (activeClientRef.current !== instance) return;
				optionsRef.current.onError?.(error2);
			},
			...initialOptions.tools !== void 0 && { tools: initialOptions.tools },
			onCustomEvent: (eventType, data, context) => {
				if (activeClientRef.current !== instance) return;
				optionsRef.current.onCustomEvent?.(eventType, data, context);
			},
			...options.streamProcessor !== void 0 && { streamProcessor: options.streamProcessor },
			onMessagesChange: (newMessages) => {
				if (activeClientRef.current !== instance) return;
				setMessages(newMessages);
			},
			onLoadingChange: (newIsLoading) => {
				if (activeClientRef.current !== instance) return;
				setIsLoading(newIsLoading);
			},
			onErrorChange: (newError) => {
				if (activeClientRef.current !== instance) return;
				setError(newError);
			},
			onStatusChange: (status2) => {
				if (activeClientRef.current !== instance) return;
				setStatus(status2);
			},
			onSubscriptionChange: (nextIsSubscribed) => {
				if (activeClientRef.current !== instance) return;
				setIsSubscribed(nextIsSubscribed);
			},
			onConnectionStatusChange: (nextStatus) => {
				if (activeClientRef.current !== instance) return;
				setConnectionStatus(nextStatus);
			},
			onSessionGeneratingChange: (isGenerating) => {
				if (activeClientRef.current !== instance) return;
				setSessionGenerating(isGenerating);
			}
		});
		activeClientRef.current = instance;
		return instance;
	}, [clientId]);
	(0, import_react.useEffect)(() => {
		const clientMessages = client.getMessages();
		if (clientMessages !== messagesRef.current) setMessages(clientMessages);
	}, [client]);
	(0, import_react.useEffect)(() => {
		client.updateOptions({
			body: options.body,
			...options.forwardedProps !== void 0 && { forwardedProps: options.forwardedProps },
			context: options.context
		});
	}, [
		client,
		options.body,
		options.forwardedProps,
		options.context
	]);
	(0, import_react.useEffect)(() => {
		if (options.live) client.subscribe();
		else client.unsubscribe();
	}, [client, options.live]);
	(0, import_react.useEffect)(() => {
		if (cleanupInvalidationRef.current) {
			clearTimeout(cleanupInvalidationRef.current);
			cleanupInvalidationRef.current = null;
		}
		activeClientRef.current = client;
		client.mountDevtools();
		return () => {
			cleanupInvalidationRef.current = setTimeout(() => {
				if (activeClientRef.current === client) activeClientRef.current = null;
				cleanupInvalidationRef.current = null;
			}, 0);
			if (optionsRef.current.live) client.unsubscribe();
			else client.stop();
			client.dispose();
		};
	}, [client]);
	const sendMessage = (0, import_react.useCallback)(async (content) => {
		await client.sendMessage(content);
	}, [client]);
	const append = (0, import_react.useCallback)(async (message) => {
		await client.append(message);
	}, [client]);
	const reload = (0, import_react.useCallback)(async () => {
		await client.reload();
	}, [client]);
	const stop = (0, import_react.useCallback)(() => {
		client.stop();
	}, [client]);
	const clear = (0, import_react.useCallback)(() => {
		client.clear();
	}, [client]);
	const setMessagesManually = (0, import_react.useCallback)((newMessages) => {
		client.setMessagesManually(newMessages);
	}, [client]);
	const addToolResult = (0, import_react.useCallback)(async (result) => {
		await client.addToolResult(result);
	}, [client]);
	const addToolApprovalResponse = (0, import_react.useCallback)(async (response) => {
		await client.addToolApprovalResponse(response);
	}, [client]);
	const renderedMessages = client.getMessages();
	const activeStructuredPart = (0, import_react.useMemo)(() => {
		let lastUserIndex = -1;
		for (let i = renderedMessages.length - 1; i >= 0; i--) if (renderedMessages[i]?.role === "user") {
			lastUserIndex = i;
			break;
		}
		if (lastUserIndex === -1) return null;
		for (let i = renderedMessages.length - 1; i > lastUserIndex; i--) {
			const m = renderedMessages[i];
			if (m?.role !== "assistant") continue;
			const part = m.parts.find((p) => p.type === "structured-output");
			if (part) return part;
		}
		return null;
	}, [renderedMessages]);
	return {
		messages: renderedMessages,
		sendMessage,
		append,
		reload,
		stop,
		isLoading,
		error,
		status,
		isSubscribed,
		connectionStatus,
		sessionGenerating,
		setMessages: setMessagesManually,
		clear,
		addToolResult,
		addToolApprovalResponse,
		partial: (0, import_react.useMemo)(() => {
			if (!activeStructuredPart) return {};
			return activeStructuredPart.partial ?? activeStructuredPart.data ?? {};
		}, [activeStructuredPart]),
		final: (0, import_react.useMemo)(() => {
			if (!activeStructuredPart || activeStructuredPart.status !== "complete") return null;
			return activeStructuredPart.data;
		}, [activeStructuredPart])
	};
}
new Uint8Array(128).fill(128);
//#endregion
export { require_react as n, useChat as t };

globalThis.__nitro_main__ = import.meta.url;
import { n as __esmMin } from "./_runtime.mjs";
//#region node_modules/.pnpm/unenv@2.0.0-rc.24/node_modules/unenv/dist/runtime/_internal/utils.mjs
/* @__NO_SIDE_EFFECTS__ */
function createNotImplementedError(name) {
	return /* @__PURE__ */ new Error(`[unenv] ${name} is not implemented yet!`);
}
/* @__NO_SIDE_EFFECTS__ */
function notImplemented(name) {
	const fn = () => {
		throw /* @__PURE__ */ createNotImplementedError(name);
	};
	return Object.assign(fn, { __unenv__: true });
}
/* @__NO_SIDE_EFFECTS__ */
function notImplementedClass(name) {
	return class {
		__unenv__ = true;
		constructor() {
			throw new Error(`[unenv] ${name} is not implemented yet!`);
		}
	};
}
var init_utils = __esmMin((() => {})), executionAsyncId;
var init_async_hook = __esmMin((() => {
	executionAsyncId = function executionAsyncId() {
		return 0;
	};
	Object.assign(Object.create(null), {
		NONE: 0,
		DIRHANDLE: 1,
		DNSCHANNEL: 2,
		ELDHISTOGRAM: 3,
		FILEHANDLE: 4,
		FILEHANDLECLOSEREQ: 5,
		BLOBREADER: 6,
		FSEVENTWRAP: 7,
		FSREQCALLBACK: 8,
		FSREQPROMISE: 9,
		GETADDRINFOREQWRAP: 10,
		GETNAMEINFOREQWRAP: 11,
		HEAPSNAPSHOT: 12,
		HTTP2SESSION: 13,
		HTTP2STREAM: 14,
		HTTP2PING: 15,
		HTTP2SETTINGS: 16,
		HTTPINCOMINGMESSAGE: 17,
		HTTPCLIENTREQUEST: 18,
		JSSTREAM: 19,
		JSUDPWRAP: 20,
		MESSAGEPORT: 21,
		PIPECONNECTWRAP: 22,
		PIPESERVERWRAP: 23,
		PIPEWRAP: 24,
		PROCESSWRAP: 25,
		PROMISE: 26,
		QUERYWRAP: 27,
		QUIC_ENDPOINT: 28,
		QUIC_LOGSTREAM: 29,
		QUIC_PACKET: 30,
		QUIC_SESSION: 31,
		QUIC_STREAM: 32,
		QUIC_UDP: 33,
		SHUTDOWNWRAP: 34,
		SIGNALWRAP: 35,
		STATWATCHER: 36,
		STREAMPIPE: 37,
		TCPCONNECTWRAP: 38,
		TCPSERVERWRAP: 39,
		TCPWRAP: 40,
		TTYWRAP: 41,
		UDPSENDWRAP: 42,
		UDPWRAP: 43,
		SIGINTWATCHDOG: 44,
		WORKER: 45,
		WORKERHEAPSNAPSHOT: 46,
		WRITEWRAP: 47,
		ZLIB: 48,
		CHECKPRIMEREQUEST: 49,
		PBKDF2REQUEST: 50,
		KEYPAIRGENREQUEST: 51,
		KEYGENREQUEST: 52,
		KEYEXPORTREQUEST: 53,
		CIPHERREQUEST: 54,
		DERIVEBITSREQUEST: 55,
		HASHREQUEST: 56,
		RANDOMBYTESREQUEST: 57,
		RANDOMPRIMEREQUEST: 58,
		SCRYPTREQUEST: 59,
		SIGNREQUEST: 60,
		TLSWRAP: 61,
		VERIFYREQUEST: 62
	});
}));
//#endregion
//#region node_modules/.pnpm/unenv@2.0.0-rc.24/node_modules/unenv/dist/runtime/node/internal/async_hooks/async-resource.mjs
var _asyncIdCounter, _AsyncResource, AsyncResource;
var init_async_resource = __esmMin((() => {
	init_async_hook();
	_asyncIdCounter = 100;
	_AsyncResource = class {
		__unenv__ = true;
		type;
		_asyncId;
		_triggerAsyncId;
		constructor(type, triggerAsyncId = executionAsyncId()) {
			this.type = type;
			this._asyncId = -1 * _asyncIdCounter++;
			this._triggerAsyncId = typeof triggerAsyncId === "number" ? triggerAsyncId : triggerAsyncId?.triggerAsyncId;
		}
		static bind(fn, type, thisArg) {
			return new AsyncResource(type ?? "anonymous").bind(fn);
		}
		bind(fn, thisArg) {
			const binded = (...args) => this.runInAsyncScope(fn, thisArg, ...args);
			binded.asyncResource = this;
			return binded;
		}
		runInAsyncScope(fn, thisArg, ...args) {
			return fn.apply(thisArg, args);
		}
		emitDestroy() {
			return this;
		}
		asyncId() {
			return this._asyncId;
		}
		triggerAsyncId() {
			return this._triggerAsyncId;
		}
	};
	AsyncResource = globalThis.AsyncResource || _AsyncResource;
}));
//#endregion
//#region node_modules/.pnpm/unenv@2.0.0-rc.24/node_modules/unenv/dist/runtime/node/async_hooks.mjs
var init_async_hooks = __esmMin((() => {
	init_async_resource();
	init_async_hook();
}));
//#endregion
//#region node_modules/.pnpm/unenv@2.0.0-rc.24/node_modules/unenv/dist/runtime/node/internal/events/events.mjs
function isEventTarget(emitter) {
	return typeof emitter?.addEventListener === "function";
}
function addCatch(that, promise, type, args) {
	if (!that[kCapture]) return;
	try {
		const then = promise.then;
		if (typeof then === "function") then.call(promise, void 0, function(err) {
			setTimeout(emitUnhandledRejectionOrErr, 0, that, err, type, args);
		});
	} catch (error_) {
		that.emit("error", error_);
	}
}
function emitUnhandledRejectionOrErr(ee, err, type, args) {
	if (typeof ee[kRejection] === "function") ee[kRejection](err, type, ...args);
	else {
		const prev = ee[kCapture];
		try {
			ee[kCapture] = false;
			ee.emit("error", err);
		} finally {
			ee[kCapture] = prev;
		}
	}
}
function _getMaxListeners(that) {
	if (that._maxListeners === void 0) return defaultMaxListeners;
	return that._maxListeners;
}
function enhanceStackTrace(err, own) {
	let ctorInfo = "";
	try {
		const { name } = this.constructor;
		if (name !== "EventEmitter") ctorInfo = ` on ${name} instance`;
	} catch {}
	const sep = `\nEmitted 'error' event${ctorInfo} at:\n`;
	const ownStack = (own.stack || "").split("\n").slice(1);
	return err.stack + sep + ownStack.join("\n");
}
function _addListener(target, type, listener, prepend) {
	let m;
	let events;
	let existing;
	events = target._events;
	if (events === void 0) {
		events = target._events = { __proto__: null };
		target._eventsCount = 0;
	} else {
		if (events.newListener !== void 0) {
			target.emit("newListener", type, listener.listener ?? listener);
			events = target._events;
		}
		existing = events[type];
	}
	if (existing === void 0) {
		events[type] = listener;
		++target._eventsCount;
	} else {
		if (typeof existing === "function") existing = events[type] = prepend ? [listener, existing] : [existing, listener];
		else if (prepend) existing.unshift(listener);
		else existing.push(listener);
		m = _getMaxListeners(target);
		if (m > 0 && existing.length > m && !existing.warned) {
			existing.warned = true;
			const w = new genericNodeError(`Possible EventEmitter memory leak detected. ${existing.length} ${String(type)} listeners added to ${inspect(target, { depth: -1 })}. MaxListeners is ${m}. Use emitter.setMaxListeners() to increase limit`, {
				name: "MaxListenersExceededWarning",
				emitter: target,
				type,
				count: existing.length
			});
			console.warn(w);
		}
	}
	return target;
}
function onceWrapper() {
	if (!this.fired) {
		this.target.removeListener(this.type, this.wrapFn);
		this.fired = true;
		if (arguments.length === 0) return this.listener.call(this.target);
		return this.listener.apply(this.target, arguments);
	}
}
function _onceWrap(target, type, listener) {
	const state = {
		fired: false,
		wrapFn: void 0,
		target,
		type,
		listener
	};
	const wrapped = onceWrapper.bind(state);
	wrapped.listener = listener;
	state.wrapFn = wrapped;
	return wrapped;
}
function _listeners(target, type, unwrap) {
	const events = target._events;
	if (events === void 0) return [];
	const evlistener = events[type];
	if (evlistener === void 0) return [];
	if (typeof evlistener === "function") return unwrap ? [evlistener.listener || evlistener] : [evlistener];
	return unwrap ? unwrapListeners(evlistener) : arrayClone(evlistener);
}
function arrayClone(arr) {
	switch (arr.length) {
		case 2: return [arr[0], arr[1]];
		case 3: return [
			arr[0],
			arr[1],
			arr[2]
		];
		case 4: return [
			arr[0],
			arr[1],
			arr[2],
			arr[3]
		];
		case 5: return [
			arr[0],
			arr[1],
			arr[2],
			arr[3],
			arr[4]
		];
		case 6: return [
			arr[0],
			arr[1],
			arr[2],
			arr[3],
			arr[4],
			arr[5]
		];
	}
	return Array.prototype.slice.call(arr);
}
function unwrapListeners(arr) {
	const ret = arrayClone(arr);
	for (let i = 0; i < ret.length; ++i) {
		const orig = ret[i].listener;
		if (typeof orig === "function") ret[i] = orig;
	}
	return ret;
}
function createIterResult(value, done) {
	return {
		value,
		done
	};
}
function eventTargetAgnosticRemoveListener(emitter, name, listener, flags) {
	if (typeof emitter.removeListener === "function") emitter.removeListener(name, listener);
	else if (typeof emitter.removeEventListener === "function") emitter.removeEventListener(name, listener, flags);
	else throw new ERR_INVALID_ARG_TYPE("emitter", "EventEmitter", emitter);
}
function eventTargetAgnosticAddListener(emitter, name, listener, flags) {
	if (typeof emitter.on === "function") if (flags?.once) emitter.once(name, listener);
	else emitter.on(name, listener);
	else if (typeof emitter.addEventListener === "function") emitter.addEventListener(name, listener, flags);
	else throw new ERR_INVALID_ARG_TYPE("emitter", "EventEmitter", emitter);
}
function listenersController() {
	const listeners = [];
	return {
		addEventListener(emitter, event, handler, flags) {
			eventTargetAgnosticAddListener(emitter, event, handler, flags);
			Array.prototype.push(listeners, [
				emitter,
				event,
				handler,
				flags
			]);
		},
		removeAll() {
			while (listeners.length > 0) Reflect.apply(eventTargetAgnosticRemoveListener, void 0, listeners.pop());
		}
	};
}
function spliceOne(list, index) {
	for (; index + 1 < list.length; index++) list[index] = list[index + 1];
	list.pop();
}
var defaultMaxListeners, AsyncIteratorPrototype, inspect, ERR_INVALID_THIS, ERR_UNHANDLED_ERROR, ERR_INVALID_ARG_TYPE, AbortError, genericNodeError, kRejection, kCapture, kErrorMonitor, kShapeMode, kMaxEventTargetListeners, kEnhanceStackBeforeInspector, kWatermarkData, kEventEmitter, kAsyncResource, kFirstEventParam, kResistStopPropagation, kMaxEventTargetListenersWarned, _EventEmitter, EventEmitterAsyncResource, EventEmitterReferencingAsyncResource, on$1, once$1, addAbortListener, getEventListeners, getMaxListeners$1, kSize, kMask, FixedCircularBuffer, FixedQueue;
var init_events$1 = __esmMin((() => {
	init_async_hooks();
	defaultMaxListeners = 10;
	AsyncIteratorPrototype = Object.getPrototypeOf(Object.getPrototypeOf(async function* () {}).prototype);
	inspect = (value, _opts) => value;
	ERR_INVALID_THIS = Error;
	ERR_UNHANDLED_ERROR = Error;
	ERR_INVALID_ARG_TYPE = Error;
	AbortError = Error;
	genericNodeError = Error;
	kRejection = /* @__PURE__ */ Symbol.for("nodejs.rejection");
	kCapture = /* @__PURE__ */ Symbol.for("kCapture");
	kErrorMonitor = /* @__PURE__ */ Symbol.for("events.errorMonitor");
	kShapeMode = /* @__PURE__ */ Symbol.for("shapeMode");
	kMaxEventTargetListeners = /* @__PURE__ */ Symbol.for("events.maxEventTargetListeners");
	kEnhanceStackBeforeInspector = /* @__PURE__ */ Symbol.for("kEnhanceStackBeforeInspector");
	kWatermarkData = /* @__PURE__ */ Symbol.for("nodejs.watermarkData");
	kEventEmitter = /* @__PURE__ */ Symbol.for("kEventEmitter");
	kAsyncResource = /* @__PURE__ */ Symbol.for("kAsyncResource");
	kFirstEventParam = /* @__PURE__ */ Symbol.for("kFirstEventParam");
	kResistStopPropagation = /* @__PURE__ */ Symbol.for("kResistStopPropagation");
	kMaxEventTargetListenersWarned = /* @__PURE__ */ Symbol.for("events.maxEventTargetListenersWarned");
	_EventEmitter = class _EventEmitter {
		_events = void 0;
		_eventsCount = 0;
		_maxListeners = defaultMaxListeners;
		[kCapture] = false;
		[kShapeMode] = false;
		static captureRejectionSymbol = kRejection;
		static errorMonitor = kErrorMonitor;
		static kMaxEventTargetListeners = kMaxEventTargetListeners;
		static kMaxEventTargetListenersWarned = kMaxEventTargetListenersWarned;
		static usingDomains = false;
		static get on() {
			return on$1;
		}
		static get once() {
			return once$1;
		}
		static get getEventListeners() {
			return getEventListeners;
		}
		static get getMaxListeners() {
			return getMaxListeners$1;
		}
		static get addAbortListener() {
			return addAbortListener;
		}
		static get EventEmitterAsyncResource() {
			return EventEmitterAsyncResource;
		}
		static get EventEmitter() {
			return _EventEmitter;
		}
		static setMaxListeners(n = defaultMaxListeners, ...eventTargets) {
			if (eventTargets.length === 0) defaultMaxListeners = n;
			else for (const target of eventTargets) if (isEventTarget(target)) {
				target[kMaxEventTargetListeners] = n;
				target[kMaxEventTargetListenersWarned] = false;
			} else if (typeof target.setMaxListeners === "function") target.setMaxListeners(n);
			else throw new ERR_INVALID_ARG_TYPE("eventTargets", ["EventEmitter", "EventTarget"], target);
		}
		static listenerCount(emitter, type) {
			if (typeof emitter.listenerCount === "function") return emitter.listenerCount(type);
			_EventEmitter.prototype.listenerCount.call(emitter, type);
		}
		static init() {
			throw new Error("EventEmitter.init() is not implemented.");
		}
		static get captureRejections() {
			return this[kCapture];
		}
		static set captureRejections(value) {
			this[kCapture] = value;
		}
		static get defaultMaxListeners() {
			return defaultMaxListeners;
		}
		static set defaultMaxListeners(arg) {
			defaultMaxListeners = arg;
		}
		constructor(opts) {
			if (this._events === void 0 || this._events === Object.getPrototypeOf(this)._events) {
				this._events = { __proto__: null };
				this._eventsCount = 0;
				this[kShapeMode] = false;
			} else this[kShapeMode] = true;
			this._maxListeners = this._maxListeners || void 0;
			if (opts?.captureRejections) this[kCapture] = Boolean(opts.captureRejections);
			else this[kCapture] = _EventEmitter.prototype[kCapture];
		}
		/**
		* Increases the max listeners of the event emitter.
		* @param {number} n
		* @returns {EventEmitter}
		*/
		setMaxListeners(n) {
			this._maxListeners = n;
			return this;
		}
		/**
		* Returns the current max listener value for the event emitter.
		* @returns {number}
		*/
		getMaxListeners() {
			return _getMaxListeners(this);
		}
		/**
		* Synchronously calls each of the listeners registered
		* for the event.
		* @param {...any} [args]
		* @returns {boolean}
		*/
		emit(type, ...args) {
			let doError = type === "error";
			const events = this._events;
			if (events !== void 0) {
				if (doError && events[kErrorMonitor] !== void 0) this.emit(kErrorMonitor, ...args);
				doError = doError && events.error === void 0;
			} else if (!doError) return false;
			if (doError) {
				let er;
				if (args.length > 0) er = args[0];
				if (er instanceof Error) {
					try {
						const capture = {};
						Error.captureStackTrace?.(capture, _EventEmitter.prototype.emit);
						Object.defineProperty(er, kEnhanceStackBeforeInspector, {
							__proto__: null,
							value: Function.prototype.bind(enhanceStackTrace, this, er, capture),
							configurable: true
						});
					} catch {}
					throw er;
				}
				let stringifiedEr;
				try {
					stringifiedEr = inspect(er);
				} catch {
					stringifiedEr = er;
				}
				const err = new ERR_UNHANDLED_ERROR(stringifiedEr);
				err.context = er;
				throw err;
			}
			const handler = events[type];
			if (handler === void 0) return false;
			if (typeof handler === "function") {
				const result = handler.apply(this, args);
				if (result !== void 0 && result !== null) addCatch(this, result, type, args);
			} else {
				const len = handler.length;
				const listeners = arrayClone(handler);
				for (let i = 0; i < len; ++i) {
					const result = listeners[i].apply(this, args);
					if (result !== void 0 && result !== null) addCatch(this, result, type, args);
				}
			}
			return true;
		}
		/**
		* Adds a listener to the event emitter.
		* @returns {EventEmitter}
		*/
		addListener(type, listener) {
			_addListener(this, type, listener, false);
			return this;
		}
		on(type, listener) {
			return this.addListener(type, listener);
		}
		/**
		* Adds the `listener` function to the beginning of
		* the listeners array.
		*/
		prependListener(type, listener) {
			_addListener(this, type, listener, true);
			return this;
		}
		/**
		* Adds a one-time `listener` function to the event emitter.
		*/
		once(type, listener) {
			this.on(type, _onceWrap(this, type, listener));
			return this;
		}
		/**
		* Adds a one-time `listener` function to the beginning of
		* the listeners array.
		*/
		prependOnceListener(type, listener) {
			this.prependListener(type, _onceWrap(this, type, listener));
			return this;
		}
		/**
		* Removes the specified `listener` from the listeners array.
		* @param {string | symbol} type
		* @param {Function} listener
		* @returns {EventEmitter}
		*/
		removeListener(type, listener) {
			const events = this._events;
			if (events === void 0) return this;
			const list = events[type];
			if (list === void 0) return this;
			if (list === listener || list.listener === listener) {
				this._eventsCount -= 1;
				if (this[kShapeMode]) events[type] = void 0;
				else if (this._eventsCount === 0) this._events = { __proto__: null };
				else {
					delete events[type];
					if (events.removeListener) this.emit("removeListener", type, list.listener || listener);
				}
			} else if (typeof list !== "function") {
				let position = -1;
				for (let i = list.length - 1; i >= 0; i--) if (list[i] === listener || list[i].listener === listener) {
					position = i;
					break;
				}
				if (position < 0) return this;
				if (position === 0) list.shift();
				else spliceOne(list, position);
				if (list.length === 1) events[type] = list[0];
				if (events.removeListener !== void 0) this.emit("removeListener", type, listener);
			}
			return this;
		}
		off(type, listener) {
			return this.removeListener(type, listener);
		}
		/**
		* Removes all listeners from the event emitter. (Only
		* removes listeners for a specific event name if specified
		* as `type`).
		*/
		removeAllListeners(type) {
			const events = this._events;
			if (events === void 0) return this;
			if (events.removeListener === void 0) {
				if (arguments.length === 0) {
					this._events = { __proto__: null };
					this._eventsCount = 0;
				} else if (events[type] !== void 0) if (--this._eventsCount === 0) this._events = { __proto__: null };
				else delete events[type];
				this[kShapeMode] = false;
				return this;
			}
			if (arguments.length === 0) {
				for (const key of Reflect.ownKeys(events)) {
					if (key === "removeListener") continue;
					this.removeAllListeners(key);
				}
				this.removeAllListeners("removeListener");
				this._events = { __proto__: null };
				this._eventsCount = 0;
				this[kShapeMode] = false;
				return this;
			}
			const listeners = events[type];
			if (typeof listeners === "function") this.removeListener(type, listeners);
			else if (listeners !== void 0) for (let i = listeners.length - 1; i >= 0; i--) this.removeListener(type, listeners[i]);
			return this;
		}
		/**
		* Returns a copy of the array of listeners for the event name
		* specified as `type`.
		* @param {string | symbol} type
		* @returns {Function[]}
		*/
		listeners(type) {
			return _listeners(this, type, true);
		}
		/**
		* Returns a copy of the array of listeners and wrappers for
		* the event name specified as `type`.
		* @returns {Function[]}
		*/
		rawListeners(type) {
			return _listeners(this, type, false);
		}
		/**
		* Returns an array listing the events for which
		* the emitter has registered listeners.
		* @returns {any[]}
		*/
		eventNames() {
			return this._eventsCount > 0 ? Reflect.ownKeys(this._events) : [];
		}
		/**
		* Returns the number of listeners listening to event name
		*/
		listenerCount(eventName, listener) {
			const events = this._events;
			if (events !== void 0) {
				const evlistener = events[eventName];
				if (typeof evlistener === "function") {
					if (listener != null) return listener === evlistener || listener === evlistener.listener ? 1 : 0;
					return 1;
				} else if (evlistener !== void 0) {
					if (listener != null) {
						let matching = 0;
						for (let i = 0, l = evlistener.length; i < l; i++) if (evlistener[i] === listener || evlistener[i].listener === listener) matching++;
						return matching;
					}
					return evlistener.length;
				}
			}
			return 0;
		}
	};
	EventEmitterAsyncResource = class extends _EventEmitter {
		/**
		* @param {{
		*   name?: string,
		*   triggerAsyncId?: number,
		*   requireManualDestroy?: boolean,
		* }} [options]
		*/
		constructor(options) {
			let name;
			if (typeof options === "string") {
				name = options;
				options = void 0;
			} else name = options?.name || new.target.name;
			super(options);
			this[kAsyncResource] = new EventEmitterReferencingAsyncResource(this, name, options);
		}
		/**
		* @param {symbol,string} event
		* @param  {...any} args
		* @returns {boolean}
		*/
		emit(event, ...args) {
			if (this[kAsyncResource] === void 0) throw new ERR_INVALID_THIS("EventEmitterAsyncResource");
			const { asyncResource } = this;
			Array.prototype.unshift(args, super.emit, this, event);
			return Reflect.apply(asyncResource.runInAsyncScope, asyncResource, args);
		}
		/**
		* @returns {void}
		*/
		emitDestroy() {
			if (this[kAsyncResource] === void 0) throw new ERR_INVALID_THIS("EventEmitterAsyncResource");
			this.asyncResource.emitDestroy();
		}
		/**
		* @type {number}
		*/
		get asyncId() {
			if (this[kAsyncResource] === void 0) throw new ERR_INVALID_THIS("EventEmitterAsyncResource");
			return this.asyncResource.asyncId();
		}
		/**
		* @type {number}
		*/
		get triggerAsyncId() {
			if (this[kAsyncResource] === void 0) throw new ERR_INVALID_THIS("EventEmitterAsyncResource");
			return this.asyncResource.triggerAsyncId();
		}
		/**
		* @type {EventEmitterReferencingAsyncResource}
		*/
		get asyncResource() {
			if (this[kAsyncResource] === void 0) throw new ERR_INVALID_THIS("EventEmitterAsyncResource");
			return this[kAsyncResource];
		}
	};
	EventEmitterReferencingAsyncResource = class extends AsyncResource {
		/**
		* @param {EventEmitter} ee
		* @param {string} [type]
		* @param {{
		*   triggerAsyncId?: number,
		*   requireManualDestroy?: boolean,
		* }} [options]
		*/
		constructor(ee, type, options) {
			super(type, options);
			this[kEventEmitter] = ee;
		}
		/**
		* @type {EventEmitter}
		*/
		get eventEmitter() {
			if (this[kEventEmitter] === void 0) throw new ERR_INVALID_THIS("EventEmitterReferencingAsyncResource");
			return this[kEventEmitter];
		}
	};
	on$1 = function on(emitter, event, options = {}) {
		const signal = options.signal;
		if (signal?.aborted) throw new AbortError(void 0, { cause: signal?.reason });
		const highWatermark = options.highWaterMark ?? options.highWatermark ?? Number.MAX_SAFE_INTEGER;
		const lowWatermark = options.lowWaterMark ?? options.lowWatermark ?? 1;
		const unconsumedEvents = new FixedQueue();
		const unconsumedPromises = new FixedQueue();
		let paused = false;
		let error = null;
		let finished = false;
		let size = 0;
		const iterator = Object.setPrototypeOf({
			next() {
				if (size) {
					const value = unconsumedEvents.shift();
					size--;
					if (paused && size < lowWatermark) {
						emitter.resume?.();
						paused = false;
					}
					return Promise.resolve(createIterResult(value, false));
				}
				if (error) {
					const p = Promise.reject(error);
					error = null;
					return p;
				}
				if (finished) return closeHandler();
				return new Promise(function(resolve, reject) {
					unconsumedPromises.push({
						resolve,
						reject
					});
				});
			},
			return() {
				return closeHandler();
			},
			throw(err) {
				if (!err || !(err instanceof Error)) throw new ERR_INVALID_ARG_TYPE("EventEmitter.AsyncIterator", "Error", err);
				errorHandler(err);
			},
			[Symbol.asyncIterator]() {
				return this;
			},
			[kWatermarkData]: {
				get size() {
					return size;
				},
				get low() {
					return lowWatermark;
				},
				get high() {
					return highWatermark;
				},
				get isPaused() {
					return paused;
				}
			}
		}, AsyncIteratorPrototype);
		const { addEventListener, removeAll } = listenersController();
		addEventListener(emitter, event, options[kFirstEventParam] ? eventHandler : function(...args) {
			return eventHandler(args);
		});
		if (event !== "error" && typeof emitter.on === "function") addEventListener(emitter, "error", errorHandler);
		const closeEvents = options?.close;
		if (closeEvents?.length) for (const closeEvent of closeEvents) addEventListener(emitter, closeEvent, closeHandler);
		const abortListenerDisposable = signal ? addAbortListener(signal, abortListener) : null;
		return iterator;
		function abortListener() {
			errorHandler(new AbortError(void 0, { cause: signal?.reason }));
		}
		function eventHandler(value) {
			if (unconsumedPromises.isEmpty()) {
				size++;
				if (!paused && size > highWatermark) {
					paused = true;
					emitter.pause?.();
				}
				unconsumedEvents.push(value);
			} else unconsumedPromises.shift().resolve(createIterResult(value, false));
		}
		function errorHandler(err) {
			if (unconsumedPromises.isEmpty()) error = err;
			else unconsumedPromises.shift().reject(err);
			closeHandler();
		}
		function closeHandler() {
			abortListenerDisposable?.[Symbol.dispose]();
			removeAll();
			finished = true;
			const doneResult = createIterResult(void 0, true);
			while (!unconsumedPromises.isEmpty()) unconsumedPromises.shift().resolve(doneResult);
			return Promise.resolve(doneResult);
		}
	};
	once$1 = async function once(emitter, name, options = {}) {
		const signal = options?.signal;
		if (signal?.aborted) throw new AbortError(void 0, { cause: signal?.reason });
		return new Promise((resolve, reject) => {
			const errorListener = (err) => {
				if (typeof emitter.removeListener === "function") emitter.removeListener(name, resolver);
				if (signal != null) eventTargetAgnosticRemoveListener(signal, "abort", abortListener);
				reject(err);
			};
			const resolver = (...args) => {
				if (typeof emitter.removeListener === "function") emitter.removeListener("error", errorListener);
				if (signal != null) eventTargetAgnosticRemoveListener(signal, "abort", abortListener);
				resolve(args);
			};
			eventTargetAgnosticAddListener(emitter, name, resolver, {
				__proto__: null,
				once: true,
				[kResistStopPropagation]: true
			});
			if (name !== "error" && typeof emitter.once === "function") emitter.once("error", errorListener);
			function abortListener() {
				eventTargetAgnosticRemoveListener(emitter, name, resolver);
				eventTargetAgnosticRemoveListener(emitter, "error", errorListener);
				reject(new AbortError(void 0, { cause: signal?.reason }));
			}
			if (signal != null) eventTargetAgnosticAddListener(signal, "abort", abortListener, {
				__proto__: null,
				once: true,
				[kResistStopPropagation]: true
			});
		});
	};
	addAbortListener = function addAbortListener(signal, listener) {
		if (signal === void 0) throw new ERR_INVALID_ARG_TYPE("signal", "AbortSignal", signal);
		let removeEventListener;
		if (signal.aborted) queueMicrotask(() => listener());
		else {
			signal.addEventListener("abort", listener, {
				__proto__: null,
				once: true,
				[kResistStopPropagation]: true
			});
			removeEventListener = () => {
				signal.removeEventListener("abort", listener);
			};
		}
		return {
			__proto__: null,
			[Symbol.dispose]() {
				removeEventListener?.();
			}
		};
	};
	getEventListeners = function getEventListeners(emitterOrTarget, type) {
		if (typeof emitterOrTarget.listeners === "function") return emitterOrTarget.listeners(type);
		if (isEventTarget(emitterOrTarget)) {
			const root = emitterOrTarget[kEvents].get(type);
			const listeners = [];
			let handler = root?.next;
			while (handler?.listener !== void 0) {
				const listener = handler.listener?.deref ? handler.listener.deref() : handler.listener;
				listeners.push(listener);
				handler = handler.next;
			}
			return listeners;
		}
		throw new ERR_INVALID_ARG_TYPE("emitter", ["EventEmitter", "EventTarget"], emitterOrTarget);
	};
	getMaxListeners$1 = function getMaxListeners(emitterOrTarget) {
		if (typeof emitterOrTarget?.getMaxListeners === "function") return _getMaxListeners(emitterOrTarget);
		else if (emitterOrTarget?.[kMaxEventTargetListeners]) return emitterOrTarget[kMaxEventTargetListeners];
		throw new ERR_INVALID_ARG_TYPE("emitter", ["EventEmitter", "EventTarget"], emitterOrTarget);
	};
	kSize = 2048;
	kMask = kSize - 1;
	FixedCircularBuffer = class {
		bottom;
		top;
		list;
		next;
		constructor() {
			this.bottom = 0;
			this.top = 0;
			this.list = new Array(kSize);
			this.next = null;
		}
		isEmpty() {
			return this.top === this.bottom;
		}
		isFull() {
			return (this.top + 1 & kMask) === this.bottom;
		}
		push(data) {
			this.list[this.top] = data;
			this.top = this.top + 1 & kMask;
		}
		shift() {
			const nextItem = this.list[this.bottom];
			if (nextItem === void 0) return null;
			this.list[this.bottom] = void 0;
			this.bottom = this.bottom + 1 & kMask;
			return nextItem;
		}
	};
	FixedQueue = class {
		head;
		tail;
		constructor() {
			this.head = this.tail = new FixedCircularBuffer();
		}
		isEmpty() {
			return this.head.isEmpty();
		}
		push(data) {
			if (this.head.isFull()) this.head = this.head.next = new FixedCircularBuffer();
			this.head.push(data);
		}
		shift() {
			const tail = this.tail;
			const next = tail.shift();
			if (tail.isEmpty() && tail.next !== null) {
				this.tail = tail.next;
				tail.next = null;
			}
			return next;
		}
	};
}));
//#endregion
//#region node_modules/.pnpm/unenv@2.0.0-rc.24/node_modules/unenv/dist/runtime/node/events.mjs
var init_events = __esmMin((() => {
	init_events$1();
}));
//#endregion
//#region node_modules/.pnpm/unenv@2.0.0-rc.24/node_modules/unenv/dist/runtime/node/internal/tty/read-stream.mjs
var ReadStream;
var init_read_stream = __esmMin((() => {
	ReadStream = class {
		fd;
		isRaw = false;
		isTTY = false;
		constructor(fd) {
			this.fd = fd;
		}
		setRawMode(mode) {
			this.isRaw = mode;
			return this;
		}
	};
}));
//#endregion
//#region node_modules/.pnpm/unenv@2.0.0-rc.24/node_modules/unenv/dist/runtime/node/internal/tty/write-stream.mjs
var WriteStream;
var init_write_stream = __esmMin((() => {
	WriteStream = class {
		fd;
		columns = 80;
		rows = 24;
		isTTY = false;
		constructor(fd) {
			this.fd = fd;
		}
		clearLine(dir, callback) {
			callback && callback();
			return false;
		}
		clearScreenDown(callback) {
			callback && callback();
			return false;
		}
		cursorTo(x, y, callback) {
			callback && typeof callback === "function" && callback();
			return false;
		}
		moveCursor(dx, dy, callback) {
			callback && callback();
			return false;
		}
		getColorDepth(env) {
			return 1;
		}
		hasColors(count, env) {
			return false;
		}
		getWindowSize() {
			return [this.columns, this.rows];
		}
		write(str, encoding, cb) {
			if (str instanceof Uint8Array) str = new TextDecoder().decode(str);
			try {
				console.log(str);
			} catch {}
			cb && typeof cb === "function" && cb();
			return false;
		}
	};
}));
//#endregion
//#region node_modules/.pnpm/unenv@2.0.0-rc.24/node_modules/unenv/dist/runtime/node/tty.mjs
var init_tty = __esmMin((() => {
	init_read_stream();
	init_write_stream();
}));
//#endregion
//#region node_modules/.pnpm/unenv@2.0.0-rc.24/node_modules/unenv/dist/runtime/node/internal/process/node-version.mjs
var NODE_VERSION;
var init_node_version = __esmMin((() => {
	NODE_VERSION = "22.14.0";
}));
//#endregion
//#region node_modules/.pnpm/unenv@2.0.0-rc.24/node_modules/unenv/dist/runtime/node/internal/process/process.mjs
var Process;
var init_process$1 = __esmMin((() => {
	init_events();
	init_tty();
	init_utils();
	init_node_version();
	Process = class Process extends _EventEmitter {
		env;
		hrtime;
		nextTick;
		constructor(impl) {
			super();
			this.env = impl.env;
			this.hrtime = impl.hrtime;
			this.nextTick = impl.nextTick;
			for (const prop of [...Object.getOwnPropertyNames(Process.prototype), ...Object.getOwnPropertyNames(_EventEmitter.prototype)]) {
				const value = this[prop];
				if (typeof value === "function") this[prop] = value.bind(this);
			}
		}
		emitWarning(warning, type, code) {
			console.warn(`${code ? `[${code}] ` : ""}${type ? `${type}: ` : ""}${warning}`);
		}
		emit(...args) {
			return super.emit(...args);
		}
		listeners(eventName) {
			return super.listeners(eventName);
		}
		#stdin;
		#stdout;
		#stderr;
		get stdin() {
			return this.#stdin ??= new ReadStream(0);
		}
		get stdout() {
			return this.#stdout ??= new WriteStream(1);
		}
		get stderr() {
			return this.#stderr ??= new WriteStream(2);
		}
		#cwd = "/";
		chdir(cwd) {
			this.#cwd = cwd;
		}
		cwd() {
			return this.#cwd;
		}
		arch = "";
		platform = "";
		argv = [];
		argv0 = "";
		execArgv = [];
		execPath = "";
		title = "";
		pid = 200;
		ppid = 100;
		get version() {
			return `v${NODE_VERSION}`;
		}
		get versions() {
			return { node: NODE_VERSION };
		}
		get allowedNodeEnvironmentFlags() {
			return /* @__PURE__ */ new Set();
		}
		get sourceMapsEnabled() {
			return false;
		}
		get debugPort() {
			return 0;
		}
		get throwDeprecation() {
			return false;
		}
		get traceDeprecation() {
			return false;
		}
		get features() {
			return {};
		}
		get release() {
			return {};
		}
		get connected() {
			return false;
		}
		get config() {
			return {};
		}
		get moduleLoadList() {
			return [];
		}
		constrainedMemory() {
			return 0;
		}
		availableMemory() {
			return 0;
		}
		uptime() {
			return 0;
		}
		resourceUsage() {
			return {};
		}
		ref() {}
		unref() {}
		umask() {
			throw /* @__PURE__ */ createNotImplementedError("process.umask");
		}
		getBuiltinModule() {}
		getActiveResourcesInfo() {
			throw /* @__PURE__ */ createNotImplementedError("process.getActiveResourcesInfo");
		}
		exit() {
			throw /* @__PURE__ */ createNotImplementedError("process.exit");
		}
		reallyExit() {
			throw /* @__PURE__ */ createNotImplementedError("process.reallyExit");
		}
		kill() {
			throw /* @__PURE__ */ createNotImplementedError("process.kill");
		}
		abort() {
			throw /* @__PURE__ */ createNotImplementedError("process.abort");
		}
		dlopen() {
			throw /* @__PURE__ */ createNotImplementedError("process.dlopen");
		}
		setSourceMapsEnabled() {
			throw /* @__PURE__ */ createNotImplementedError("process.setSourceMapsEnabled");
		}
		loadEnvFile() {
			throw /* @__PURE__ */ createNotImplementedError("process.loadEnvFile");
		}
		disconnect() {
			throw /* @__PURE__ */ createNotImplementedError("process.disconnect");
		}
		cpuUsage() {
			throw /* @__PURE__ */ createNotImplementedError("process.cpuUsage");
		}
		setUncaughtExceptionCaptureCallback() {
			throw /* @__PURE__ */ createNotImplementedError("process.setUncaughtExceptionCaptureCallback");
		}
		hasUncaughtExceptionCaptureCallback() {
			throw /* @__PURE__ */ createNotImplementedError("process.hasUncaughtExceptionCaptureCallback");
		}
		initgroups() {
			throw /* @__PURE__ */ createNotImplementedError("process.initgroups");
		}
		openStdin() {
			throw /* @__PURE__ */ createNotImplementedError("process.openStdin");
		}
		assert() {
			throw /* @__PURE__ */ createNotImplementedError("process.assert");
		}
		binding() {
			throw /* @__PURE__ */ createNotImplementedError("process.binding");
		}
		permission = { has: /* @__PURE__ */ notImplemented("process.permission.has") };
		report = {
			directory: "",
			filename: "",
			signal: "SIGUSR2",
			compact: false,
			reportOnFatalError: false,
			reportOnSignal: false,
			reportOnUncaughtException: false,
			getReport: /* @__PURE__ */ notImplemented("process.report.getReport"),
			writeReport: /* @__PURE__ */ notImplemented("process.report.writeReport")
		};
		finalization = {
			register: /* @__PURE__ */ notImplemented("process.finalization.register"),
			unregister: /* @__PURE__ */ notImplemented("process.finalization.unregister"),
			registerBeforeExit: /* @__PURE__ */ notImplemented("process.finalization.registerBeforeExit")
		};
		memoryUsage = Object.assign(() => ({
			arrayBuffers: 0,
			rss: 0,
			external: 0,
			heapTotal: 0,
			heapUsed: 0
		}), { rss: () => 0 });
		mainModule = void 0;
		domain = void 0;
		send = void 0;
		exitCode = void 0;
		channel = void 0;
		getegid = void 0;
		geteuid = void 0;
		getgid = void 0;
		getgroups = void 0;
		getuid = void 0;
		setegid = void 0;
		seteuid = void 0;
		setgid = void 0;
		setgroups = void 0;
		setuid = void 0;
		_events = void 0;
		_eventsCount = void 0;
		_exiting = void 0;
		_maxListeners = void 0;
		_debugEnd = void 0;
		_debugProcess = void 0;
		_fatalException = void 0;
		_getActiveHandles = void 0;
		_getActiveRequests = void 0;
		_kill = void 0;
		_preload_modules = void 0;
		_rawDebug = void 0;
		_startProfilerIdleNotifier = void 0;
		_stopProfilerIdleNotifier = void 0;
		_tickCallback = void 0;
		_disconnect = void 0;
		_handleQueue = void 0;
		_pendingMessage = void 0;
		_channel = void 0;
		_send = void 0;
		_linkedBinding = void 0;
	};
}));
//#endregion
//#region node_modules/.pnpm/unenv@2.0.0-rc.24/node_modules/unenv/dist/runtime/node/internal/process/env.mjs
var _envShim, originalProcess, _getEnv, env$1;
var init_env = __esmMin((() => {
	_envShim = Object.create(null);
	originalProcess = globalThis["process"];
	_getEnv = (useShim) => globalThis.__env__ || originalProcess?.env || (useShim ? _envShim : globalThis);
	env$1 = /* @__PURE__ */ new Proxy(_envShim, {
		get(_, prop) {
			return _getEnv()[prop] ?? _envShim[prop];
		},
		has(_, prop) {
			return prop in _getEnv() || prop in _envShim;
		},
		set(_, prop, value) {
			const env = _getEnv(true);
			env[prop] = value;
			return true;
		},
		deleteProperty(_, prop) {
			const env = _getEnv(true);
			delete env[prop];
			return true;
		},
		ownKeys() {
			const env = _getEnv();
			return Object.keys(env);
		},
		getOwnPropertyDescriptor(_, prop) {
			const env = _getEnv();
			if (prop in env) return {
				value: env[prop],
				writable: true,
				enumerable: true,
				configurable: true
			};
		}
	});
}));
//#endregion
//#region node_modules/.pnpm/unenv@2.0.0-rc.24/node_modules/unenv/dist/runtime/node/internal/process/hrtime.mjs
var hrtime$1;
var init_hrtime = __esmMin((() => {
	hrtime$1 = /* @__PURE__ */ Object.assign(function hrtime(startTime) {
		const now = Date.now();
		const seconds = Math.trunc(now / 1e3);
		const nanos = now % 1e3 * 1e6;
		if (startTime) {
			let diffSeconds = seconds - startTime[0];
			let diffNanos = nanos - startTime[0];
			if (diffNanos < 0) {
				diffSeconds = diffSeconds - 1;
				diffNanos = 1e9 + diffNanos;
			}
			return [diffSeconds, diffNanos];
		}
		return [seconds, nanos];
	}, { bigint: function bigint() {
		return BigInt(Date.now() * 1e6);
	} });
}));
//#endregion
//#region node_modules/.pnpm/unenv@2.0.0-rc.24/node_modules/unenv/dist/runtime/node/internal/process/nexttick.mjs
function createNextTickWithTimeout() {
	let queue = [];
	let draining = false;
	let currentQueue;
	let queueIndex = -1;
	function cleanUpNextTick() {
		if (!draining || !currentQueue) return;
		draining = false;
		if (currentQueue.length > 0) queue = [...currentQueue, ...queue];
		else queueIndex = -1;
		if (queue.length > 0) drainQueue();
	}
	function drainQueue() {
		if (draining) return;
		const timeout = setTimeout(cleanUpNextTick);
		draining = true;
		let len = queue.length;
		while (len) {
			currentQueue = queue;
			queue = [];
			while (++queueIndex < len) if (currentQueue) currentQueue[queueIndex]();
			queueIndex = -1;
			len = queue.length;
		}
		currentQueue = void 0;
		draining = false;
		clearTimeout(timeout);
	}
	const nextTick = (cb, ...args) => {
		queue.push(cb.bind(void 0, ...args));
		if (queue.length === 1 && !draining) setTimeout(drainQueue);
	};
	return nextTick;
}
var nextTick$1;
var init_nexttick = __esmMin((() => {
	nextTick$1 = globalThis.queueMicrotask ? (cb, ...args) => {
		globalThis.queueMicrotask(cb.bind(void 0, ...args));
	} : /* @__PURE__ */ createNextTickWithTimeout();
}));
//#endregion
//#region node_modules/.pnpm/unenv@2.0.0-rc.24/node_modules/unenv/dist/runtime/node/process.mjs
var unenvProcess, abort, addListener, allowedNodeEnvironmentFlags, hasUncaughtExceptionCaptureCallback, setUncaughtExceptionCaptureCallback, loadEnvFile, sourceMapsEnabled, arch, argv, argv0, chdir, config, connected, constrainedMemory, availableMemory, cpuUsage, cwd, debugPort, dlopen, disconnect, emit, emitWarning, env, eventNames, execArgv, execPath, exit, finalization, features, getBuiltinModule, getActiveResourcesInfo, getMaxListeners, hrtime, kill, listeners, listenerCount, memoryUsage, nextTick, on, off, once, pid, platform, ppid, prependListener, prependOnceListener, rawListeners, release, removeAllListeners, removeListener, report, resourceUsage, setMaxListeners, setSourceMapsEnabled, stderr, stdin, stdout, title, umask, uptime, version, versions, domain, initgroups, moduleLoadList, reallyExit, openStdin, assert, binding, send, exitCode, channel, getegid, geteuid, getgid, getgroups, getuid, setegid, seteuid, setgid, setgroups, setuid, permission, mainModule, ref, unref, _events, _eventsCount, _exiting, _maxListeners, _debugEnd, _debugProcess, _fatalException, _getActiveHandles, _getActiveRequests, _kill, _preload_modules, _rawDebug, _startProfilerIdleNotifier, _stopProfilerIdleNotifier, _tickCallback, _disconnect, _handleQueue, _pendingMessage, _channel, _send, _linkedBinding;
var init_process = __esmMin((() => {
	init_process$1();
	init_env();
	init_hrtime();
	init_nexttick();
	unenvProcess = new Process({
		env: env$1,
		hrtime: hrtime$1,
		nextTick: nextTick$1
	});
	({abort, addListener, allowedNodeEnvironmentFlags, hasUncaughtExceptionCaptureCallback, setUncaughtExceptionCaptureCallback, loadEnvFile, sourceMapsEnabled, arch, argv, argv0, chdir, config, connected, constrainedMemory, availableMemory, cpuUsage, cwd, debugPort, dlopen, disconnect, emit, emitWarning, env, eventNames, execArgv, execPath, exit, finalization, features, getBuiltinModule, getActiveResourcesInfo, getMaxListeners, hrtime, kill, listeners, listenerCount, memoryUsage, nextTick, on, off, once, pid, platform, ppid, prependListener, prependOnceListener, rawListeners, release, removeAllListeners, removeListener, report, resourceUsage, setMaxListeners, setSourceMapsEnabled, stderr, stdin, stdout, title, umask, uptime, version, versions, domain, initgroups, moduleLoadList, reallyExit, openStdin, assert, binding, send, exitCode, channel, getegid, geteuid, getgid, getgroups, getuid, setegid, seteuid, setgid, setgroups, setuid, permission, mainModule, ref, unref, _events, _eventsCount, _exiting, _maxListeners, _debugEnd, _debugProcess, _fatalException, _getActiveHandles, _getActiveRequests, _kill, _preload_modules, _rawDebug, _startProfilerIdleNotifier, _stopProfilerIdleNotifier, _tickCallback, _disconnect, _handleQueue, _pendingMessage, _channel, _send, _linkedBinding} = unenvProcess);
}));
//#endregion
//#region #nitro-vite-setup
init_process();
function lazyService(loader) {
	let promise, mod;
	return { fetch(req) {
		if (mod) return mod.fetch(req);
		if (!promise) promise = loader().then((_mod) => mod = _mod.default || _mod);
		return promise.then((mod) => mod.fetch(req));
	} };
}
var services = { ["ssr"]: lazyService(() => import("./_ssr/ssr.mjs")) };
globalThis.__nitro_vite_envs__ = services;
//#endregion
//#region #nitro/virtual/public-assets-data
var public_assets_data_default = {
	"/android-chrome-192x192.png": {
		"type": "image/png",
		"etag": "\"750c-oU2mem0jjZ8XbVMelLzRr7WdVPI\"",
		"mtime": "2026-06-08T15:39:42.068Z",
		"size": 29964,
		"path": "../public/android-chrome-192x192.png"
	},
	"/android-chrome-512x512.png": {
		"type": "image/png",
		"etag": "\"1aad7-TxqzM3JFMTytpE8GX+/4lMPNyzQ\"",
		"mtime": "2026-06-08T15:39:42.068Z",
		"size": 109271,
		"path": "../public/android-chrome-512x512.png"
	},
	"/apple-touch-icon.png": {
		"type": "image/png",
		"etag": "\"6a6e-DDBGYLGi+sElNLs2+1QICHz5lS4\"",
		"mtime": "2026-06-08T15:39:42.068Z",
		"size": 27246,
		"path": "../public/apple-touch-icon.png"
	},
	"/favicon-16x16.png": {
		"type": "image/png",
		"etag": "\"340-GSBMkU3R13NnICO2UG+wPm8sJhM\"",
		"mtime": "2026-06-08T15:39:42.068Z",
		"size": 832,
		"path": "../public/favicon-16x16.png"
	},
	"/favicon-32x32.png": {
		"type": "image/png",
		"etag": "\"843-o7V/FkCz36zCpGs0pydBZ+gbsCw\"",
		"mtime": "2026-06-08T15:39:42.068Z",
		"size": 2115,
		"path": "../public/favicon-32x32.png"
	},
	"/site.webmanifest": {
		"type": "application/manifest+json",
		"etag": "\"168-OLZYaPbcgi7SF/odatSUJ7DocfI\"",
		"mtime": "2026-06-08T15:39:42.068Z",
		"size": 360,
		"path": "../public/site.webmanifest"
	},
	"/assets/app-D4EFLD1r.css": {
		"type": "text/css; charset=utf-8",
		"etag": "\"1f21-WD7lY+O+d3h6MCXNJjcw4iHm92g\"",
		"mtime": "2026-06-08T15:39:41.872Z",
		"size": 7969,
		"path": "../public/assets/app-D4EFLD1r.css"
	},
	"/favicon.png": {
		"type": "image/png",
		"etag": "\"5e3-23JXQ+bzISswdmRT9DhqqHtr9xM\"",
		"mtime": "2026-06-08T15:39:42.068Z",
		"size": 1507,
		"path": "../public/favicon.png"
	},
	"/favicon.ico": {
		"type": "image/vnd.microsoft.icon",
		"etag": "\"3c2e-R2UvDwRFCsnzRE8fcnOLMp5+Svo\"",
		"mtime": "2026-06-08T15:39:42.068Z",
		"size": 15406,
		"path": "../public/favicon.ico"
	},
	"/assets/routes-DJ7LAi8J.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"26-SoFMfAHVJ5oqB5t+mpFRoQvFIoc\"",
		"mtime": "2026-06-08T15:39:41.871Z",
		"size": 38,
		"path": "../public/assets/routes-DJ7LAi8J.js"
	},
	"/assets/chat.index-CywdoWEj.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"3bef9-UI72ikc0Hj2spzTq99xDBFwqPy4\"",
		"mtime": "2026-06-08T15:39:41.871Z",
		"size": 245497,
		"path": "../public/assets/chat.index-CywdoWEj.js"
	},
	"/assets/index-BPPiky09.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"5408c-3+M6+Ma8r4a2mBlPMwc1YQOItgc\"",
		"mtime": "2026-06-08T15:39:41.871Z",
		"size": 344204,
		"path": "../public/assets/index-BPPiky09.js"
	}
};
//#endregion
//#region #nitro/virtual/public-assets
var publicAssetBases = {};
function isPublicAssetURL(id = "") {
	if (public_assets_data_default[id]) return true;
	for (const base in publicAssetBases) if (id.startsWith(base)) return true;
	return false;
}
//#endregion
//#region node_modules/.pnpm/rou3@0.8.1/node_modules/rou3/dist/index.mjs
var NullProtoObj = /* @__PURE__ */ (() => {
	const e = function() {};
	return e.prototype = Object.create(null), Object.freeze(e.prototype), e;
})();
//#endregion
//#region node_modules/.pnpm/srvx@0.11.16/node_modules/srvx/dist/adapters/cloudflare.mjs
var FastURL = URL;
var FastResponse = Response;
//#endregion
//#region node_modules/.pnpm/h3@2.0.1-rc.22_crossws@0.4.5_srvx@0.11.16_/node_modules/h3/dist/h3.mjs
function decodePathname(pathname) {
	return decodeURI(pathname.includes("%25") ? pathname.replace(/%25/g, "%2525") : pathname);
}
var kEventNS = "h3.internal.event.";
var kEventRes = /* @__PURE__ */ Symbol.for(`${kEventNS}res`);
var kEventResHeaders = /* @__PURE__ */ Symbol.for(`${kEventNS}res.headers`);
var kEventResErrHeaders = /* @__PURE__ */ Symbol.for(`${kEventNS}res.err.headers`);
var H3Event = class {
	app;
	req;
	url;
	context;
	static __is_event__ = true;
	constructor(req, context, app) {
		this.context = context || req.context || new NullProtoObj();
		this.req = req;
		this.app = app;
		const _url = req._url;
		const url = _url && _url instanceof URL ? _url : new FastURL(req.url);
		if (url.pathname.includes("%")) url.pathname = decodePathname(url.pathname);
		this.url = url;
	}
	get res() {
		return this[kEventRes] ||= new H3EventResponse();
	}
	get runtime() {
		return this.req.runtime;
	}
	waitUntil(promise) {
		this.req.waitUntil?.(promise);
	}
	toString() {
		return `[${this.req.method}] ${this.req.url}`;
	}
	toJSON() {
		return this.toString();
	}
	get node() {
		return this.req.runtime?.node;
	}
	get headers() {
		return this.req.headers;
	}
	get path() {
		return this.url.pathname + this.url.search;
	}
	get method() {
		return this.req.method;
	}
};
var H3EventResponse = class {
	status;
	statusText;
	get headers() {
		return this[kEventResHeaders] ||= new Headers();
	}
	get errHeaders() {
		return this[kEventResErrHeaders] ||= new Headers();
	}
};
var DISALLOWED_STATUS_CHARS = /[^\u0009\u0020-\u007E]/g;
function sanitizeStatusMessage(statusMessage = "") {
	return statusMessage.replace(DISALLOWED_STATUS_CHARS, "");
}
function sanitizeStatusCode(statusCode, defaultStatusCode = 200) {
	if (!statusCode) return defaultStatusCode;
	if (typeof statusCode === "string") statusCode = +statusCode;
	if (statusCode < 100 || statusCode > 599) return defaultStatusCode;
	return statusCode;
}
var HTTPError = class HTTPError extends Error {
	get name() {
		return "HTTPError";
	}
	status;
	statusText;
	headers;
	cause;
	data;
	body;
	unhandled;
	static isError(input) {
		return input instanceof Error && input?.name === "HTTPError";
	}
	static status(status, statusText, details) {
		return new HTTPError({
			...details,
			statusText,
			status
		});
	}
	constructor(arg1, arg2) {
		let messageInput;
		let details;
		if (typeof arg1 === "string") {
			messageInput = arg1;
			details = arg2;
		} else details = arg1;
		const status = sanitizeStatusCode(details?.status || details?.statusCode || (details?.cause)?.status || (details?.cause)?.statusCode, 500);
		const statusText = sanitizeStatusMessage(details?.statusText || details?.statusMessage || (details?.cause)?.statusText || (details?.cause)?.statusMessage);
		const message = messageInput || details?.message || (details?.cause)?.message || details?.statusText || details?.statusMessage || [
			"HTTPError",
			status,
			statusText
		].filter(Boolean).join(" ");
		super(message, { cause: details });
		this.cause = details;
		this.status = status;
		this.statusText = statusText || void 0;
		const rawHeaders = details?.headers || (details?.cause)?.headers;
		this.headers = rawHeaders ? new Headers(rawHeaders) : void 0;
		this.unhandled = details?.unhandled ?? (details?.cause)?.unhandled ?? void 0;
		this.data = details?.data;
		this.body = details?.body;
	}
	get statusCode() {
		return this.status;
	}
	get statusMessage() {
		return this.statusText;
	}
	toJSON() {
		const unhandled = this.unhandled;
		return {
			status: this.status,
			statusText: this.statusText,
			unhandled,
			message: unhandled ? "HTTPError" : this.message,
			data: unhandled ? void 0 : this.data,
			...unhandled ? void 0 : this.body
		};
	}
};
function isJSONSerializable(value, _type) {
	if (value === null || value === void 0) return true;
	if (_type !== "object") return _type === "boolean" || _type === "number" || _type === "string";
	if (typeof value.toJSON === "function") return true;
	if (Array.isArray(value)) return true;
	if (typeof value.pipe === "function" || typeof value.pipeTo === "function") return false;
	if (value instanceof NullProtoObj) return true;
	const proto = Object.getPrototypeOf(value);
	return proto === Object.prototype || proto === null;
}
var kNotFound = /* @__PURE__ */ Symbol.for("h3.notFound");
var kHandled = /* @__PURE__ */ Symbol.for("h3.handled");
function toResponse(val, event, config = {}) {
	if (typeof val?.then === "function") return val.then((resolvedVal) => toResponse(resolvedVal, event, config), (r) => toResponse(typeof r === "number" ? new HTTPError({ status: r }) : r, event, config));
	const response = prepareResponse(val, event, config);
	if (typeof response?.then === "function") return toResponse(response, event, config);
	const { onResponse } = config;
	return onResponse ? Promise.resolve(onResponse(response, event)).then(() => response) : response;
}
var HTTPResponse = class {
	#headers;
	#init;
	body;
	constructor(body, init) {
		this.body = body;
		this.#init = init;
	}
	get status() {
		return this.#init?.status || 200;
	}
	get statusText() {
		return this.#init?.statusText || "OK";
	}
	get headers() {
		return this.#headers ||= new Headers(this.#init?.headers);
	}
};
function prepareResponse(val, event, config, nested) {
	if (val === kHandled) return new FastResponse(null);
	if (val === kNotFound) val = new HTTPError({
		status: 404,
		message: `Cannot find any route matching [${event.req.method}] ${event.url}`
	});
	if (val && val instanceof Error) {
		const isHTTPError = HTTPError.isError(val);
		const error = isHTTPError ? val : new HTTPError(val);
		if (!isHTTPError) {
			error.unhandled = true;
			if (val?.stack) error.stack = val.stack;
		}
		if (error.unhandled && !config.silent) console.error(error);
		const { onError } = config;
		const errHeaders = event[kEventRes]?.[kEventResErrHeaders];
		return onError && !nested ? Promise.resolve(onError(error, event)).catch((error) => error).then((newVal) => prepareResponse(newVal ?? val, event, config, true)) : errorResponse(error, config.debug, errHeaders);
	}
	const preparedRes = event[kEventRes];
	const preparedHeaders = preparedRes?.[kEventResHeaders];
	event[kEventRes] = void 0;
	if (!(val instanceof Response)) {
		const res = prepareResponseBody(val, event, config);
		const status = res.status || preparedRes?.status;
		return new FastResponse(nullBody(event.req.method, status) ? null : res.body, {
			status,
			statusText: res.statusText || preparedRes?.statusText,
			headers: res.headers && preparedHeaders ? mergeHeaders$1(res.headers, preparedHeaders) : res.headers || preparedHeaders
		});
	}
	if (!preparedHeaders || nested || !val.ok) return val;
	try {
		mergeHeaders$1(val.headers, preparedHeaders, val.headers);
		return val;
	} catch {
		return new FastResponse(nullBody(event.req.method, val.status) ? null : val.body, {
			status: val.status,
			statusText: val.statusText,
			headers: mergeHeaders$1(val.headers, preparedHeaders)
		});
	}
}
function mergeHeaders$1(base, overrides, target = new Headers(base)) {
	for (const [name, value] of overrides) if (name === "set-cookie") target.append(name, value);
	else target.set(name, value);
	return target;
}
var frozen = (name) => (...args) => {
	throw new Error(`Headers are frozen (${name} ${args.join(", ")})`);
};
var FrozenHeaders = class extends Headers {
	set = frozen("set");
	append = frozen("append");
	delete = frozen("delete");
};
var emptyHeaders = /* @__PURE__ */ new FrozenHeaders({ "content-length": "0" });
var jsonHeaders = /* @__PURE__ */ new FrozenHeaders({ "content-type": "application/json;charset=UTF-8" });
function prepareResponseBody(val, event, config) {
	if (val === null || val === void 0) return {
		body: "",
		headers: emptyHeaders
	};
	const valType = typeof val;
	if (valType === "string") return { body: val };
	if (val instanceof Uint8Array) {
		event.res.headers.set("content-length", val.byteLength.toString());
		return { body: val };
	}
	if (val instanceof HTTPResponse || val?.constructor?.name === "HTTPResponse") return val;
	if (isJSONSerializable(val, valType)) return {
		body: JSON.stringify(val, void 0, config.debug ? 2 : void 0),
		headers: jsonHeaders
	};
	if (valType === "bigint") return {
		body: val.toString(),
		headers: jsonHeaders
	};
	if (val instanceof Blob) {
		const headers = new Headers({
			"content-type": val.type,
			"content-length": val.size.toString()
		});
		let filename = val.name;
		if (filename) {
			filename = encodeURIComponent(filename);
			headers.set("content-disposition", `filename="${filename}"; filename*=UTF-8''${filename}`);
		}
		return {
			body: val.stream(),
			headers
		};
	}
	if (valType === "symbol") return { body: val.toString() };
	if (valType === "function") return { body: `${val.name}()` };
	return { body: val };
}
function nullBody(method, status) {
	return method === "HEAD" || status === 100 || status === 101 || status === 102 || status === 204 || status === 205 || status === 304;
}
function errorResponse(error, debug, errHeaders) {
	let headers = error.headers ? mergeHeaders$1(jsonHeaders, error.headers) : new Headers(jsonHeaders);
	if (errHeaders) headers = mergeHeaders$1(headers, errHeaders);
	return new FastResponse(JSON.stringify({
		...error.toJSON(),
		stack: debug && error.stack ? error.stack.split("\n").map((l) => l.trim()) : void 0
	}, void 0, debug ? 2 : void 0), {
		status: error.status,
		statusText: error.statusText,
		headers
	});
}
function callMiddleware(event, middleware, handler, index = 0) {
	if (index === middleware.length) return handler(event);
	const fn = middleware[index];
	let nextCalled;
	let nextResult;
	const next = () => {
		if (nextCalled) return nextResult;
		nextCalled = true;
		nextResult = callMiddleware(event, middleware, handler, index + 1);
		return nextResult;
	};
	const ret = fn(event, next);
	return isUnhandledResponse(ret) ? next() : typeof ret?.then === "function" ? ret.then((resolved) => isUnhandledResponse(resolved) ? next() : resolved) : ret;
}
function isUnhandledResponse(val) {
	return val === void 0 || val === kNotFound;
}
function toRequest(input, options) {
	if (typeof input === "string") {
		let url = input;
		if (url[0] === "/") {
			const headers = options?.headers ? new Headers(options.headers) : void 0;
			const host = headers?.get("host") || "localhost";
			url = `${headers?.get("x-forwarded-proto") === "https" ? "https" : "http"}://${host}${url}`;
		}
		return new Request(url, options);
	} else if (options || input instanceof URL) return new Request(input, options);
	return input;
}
function defineHandler(input) {
	if (typeof input === "function") return handlerWithFetch(input);
	const handler = input.handler || (input.fetch ? function _fetchHandler(event) {
		return input.fetch(event.req);
	} : NoHandler);
	return Object.assign(handlerWithFetch(input.middleware?.length ? function _handlerMiddleware(event) {
		return callMiddleware(event, input.middleware, handler);
	} : handler), input);
}
function handlerWithFetch(handler) {
	if ("fetch" in handler) return handler;
	return Object.assign(handler, { fetch: (req) => {
		if (typeof req === "string") req = new URL(req, "http://_");
		if (req instanceof URL) req = new Request(req);
		const event = new H3Event(req);
		try {
			return Promise.resolve(toResponse(handler(event), event));
		} catch (error) {
			return Promise.resolve(toResponse(error, event));
		}
	} });
}
function defineLazyEventHandler(loader) {
	let handler;
	let promise;
	return defineHandler(function lazyHandler(event) {
		return handler ? handler(event) : (promise ??= Promise.resolve(loader()).then(function resolveLazyHandler(r) {
			handler = toEventHandler(r) || toEventHandler(r.default);
			if (typeof handler !== "function") throw new TypeError("Invalid lazy handler", { cause: { resolved: r } });
			return handler;
		})).then((r) => r(event));
	});
}
function toEventHandler(handler) {
	if (typeof handler === "function") return handler;
	if (typeof handler?.handler === "function" && handler.constructor?.["~h3"]) return handler.handler;
	if (typeof handler?.fetch === "function") return function _fetchHandler(event) {
		return handler.fetch(event.req);
	};
}
var NoHandler = () => kNotFound;
var H3Core = class {
	static "~h3" = true;
	config;
	"~middleware";
	"~routes" = [];
	constructor(config = {}) {
		this["~middleware"] = [];
		this.config = config;
		this.fetch = this.fetch.bind(this);
		this.handler = this.handler.bind(this);
	}
	fetch(request) {
		return this["~request"](request);
	}
	handler(event) {
		const route = this["~findRoute"](event);
		if (route) {
			event.context.params = route.params;
			event.context.matchedRoute = route.data;
		}
		const routeHandler = route?.data.handler || NoHandler;
		const middleware = this["~getMiddleware"](event, route);
		return middleware.length > 0 ? callMiddleware(event, middleware, routeHandler) : routeHandler(event);
	}
	"~request"(request, context) {
		const event = new H3Event(request, context, this);
		let handlerRes;
		try {
			if (this.config.onRequest) {
				const hookRes = this.config.onRequest(event);
				handlerRes = typeof hookRes?.then === "function" ? hookRes.then(() => this.handler(event)) : this.handler(event);
			} else handlerRes = this.handler(event);
		} catch (error) {
			handlerRes = Promise.reject(error);
		}
		return toResponse(handlerRes, event, this.config);
	}
	"~findRoute"(_event) {}
	"~addRoute"(_route) {
		this["~routes"].push(_route);
	}
	"~getMiddleware"(_event, route) {
		const routeMiddleware = route?.data.middleware;
		const globalMiddleware = this["~middleware"];
		return routeMiddleware ? [...globalMiddleware, ...routeMiddleware] : globalMiddleware;
	}
};
//#endregion
//#region node_modules/.pnpm/nitro-nightly@3.0.1-20260605-145636-4ab22a9d_chokidar@5.0.0_jiti@2.7.0_vite@8.0.16_@typ_beeeaded0cd16e5ecc4159156dedffbd/node_modules/nitro-nightly/dist/runtime/internal/route-rules.mjs
var headers = ((m) => function headersRouteRule(event) {
	for (const [key, value] of Object.entries(m.options || {})) event.res.headers.set(key, value);
});
//#endregion
//#region #nitro/virtual/routing
var findRouteRules = /* @__PURE__ */ (() => {
	const $0 = [{
		name: "headers",
		route: "/assets/**",
		handler: headers,
		options: { "cache-control": "public, max-age=31536000, immutable" }
	}];
	return (m, p) => {
		let r = [];
		if (p.charCodeAt(p.length - 1) === 47) p = p.slice(0, -1) || "/";
		let s = p.split("/");
		if (s.length > 1) {
			if (s[1] === "assets") r.unshift({
				data: $0,
				params: { "_": s.slice(2).join("/") }
			});
		}
		return r;
	};
})();
var _lazy_YbqLxC = defineLazyEventHandler(() => import("./_chunks/ssr-renderer.mjs"));
var findRoute = /* @__PURE__ */ (() => {
	const data = {
		route: "/**",
		handler: _lazy_YbqLxC
	};
	return ((_m, p) => {
		return {
			data,
			params: { "_": p.slice(1) }
		};
	});
})();
[].filter(Boolean);
//#endregion
//#region node_modules/.pnpm/nitro-nightly@3.0.1-20260605-145636-4ab22a9d_chokidar@5.0.0_jiti@2.7.0_vite@8.0.16_@typ_beeeaded0cd16e5ecc4159156dedffbd/node_modules/nitro-nightly/dist/runtime/internal/error/prod.mjs
var errorHandler = (error, event) => {
	const res = defaultHandler(error, event);
	return new FastResponse(typeof res.body === "string" ? res.body : JSON.stringify(res.body, null, 2), res);
};
function defaultHandler(error, event) {
	const unhandled = error.unhandled ?? !HTTPError.isError(error);
	const { status = 500, statusText = "" } = unhandled ? {} : error;
	if (status === 404) {
		const url = event.url || new URL(event.req.url);
		const baseURL = "/";
		if (/^\/[^/]/.test(baseURL) && !url.pathname.startsWith(baseURL)) return {
			status: 302,
			headers: new Headers({ location: `${baseURL}${url.pathname.slice(1)}${url.search}` })
		};
	}
	const headers = new Headers(unhandled ? {} : error.headers);
	headers.set("content-type", "application/json; charset=utf-8");
	return {
		status,
		statusText,
		headers,
		body: {
			error: true,
			...unhandled ? {
				status,
				unhandled: true
			} : typeof error.toJSON === "function" ? error.toJSON() : {
				status,
				statusText,
				message: error.message
			}
		}
	};
}
//#endregion
//#region #nitro/virtual/error-handler
var errorHandlers = [errorHandler];
async function error_handler_default(error, event) {
	for (const handler of errorHandlers) try {
		const response = await handler(error, event, { defaultHandler });
		if (response) return response;
	} catch (error) {
		console.error(error);
	}
}
//#endregion
//#region #nitro/virtual/app
function createNitroApp() {
	const captureError = (error, errorCtx) => {
		if (errorCtx?.event) {
			const errors = errorCtx.event.req.context?.nitro?.errors;
			if (errors) errors.push({
				error,
				context: errorCtx
			});
		}
	};
	const h3App = createH3App({ onError(error, event) {
		return error_handler_default(error, event);
	} });
	let appHandler = (req) => {
		req.context ||= {};
		req.context.nitro = req.context.nitro || { errors: [] };
		return h3App.fetch(req);
	};
	return {
		fetch: appHandler,
		h3: h3App,
		hooks: void 0,
		captureError
	};
}
function createH3App(config) {
	const h3App = new H3Core(config);
	h3App["~findRoute"] = (event) => findRoute(event.req.method, event.url.pathname);
	h3App["~getMiddleware"] = (event, route) => {
		const pathname = event.url.pathname;
		const method = event.req.method;
		const middleware = [];
		const routeRules = getRouteRules(method, pathname);
		event.context.routeRules = routeRules?.routeRules;
		if (routeRules?.routeRuleMiddleware.length) middleware.push(...routeRules.routeRuleMiddleware);
		if (route?.data?.middleware?.length) middleware.push(...route.data.middleware);
		return middleware;
	};
	return h3App;
}
//#endregion
//#region node_modules/.pnpm/nitro-nightly@3.0.1-20260605-145636-4ab22a9d_chokidar@5.0.0_jiti@2.7.0_vite@8.0.16_@typ_beeeaded0cd16e5ecc4159156dedffbd/node_modules/nitro-nightly/dist/runtime/internal/app.mjs
var APP_ID = "default";
function useNitroApp() {
	let instance = useNitroApp._instance;
	if (instance) return instance;
	instance = useNitroApp._instance = createNitroApp();
	globalThis.__nitro__ = globalThis.__nitro__ || {};
	globalThis.__nitro__[APP_ID] = instance;
	return instance;
}
function getRouteRules(method, pathname) {
	const m = findRouteRules(method, pathname);
	if (!m?.length) return { routeRuleMiddleware: [] };
	const routeRules = {};
	for (const layer of m) for (const rule of layer.data) {
		const currentRule = routeRules[rule.name];
		if (currentRule) {
			if (rule.options === false) {
				delete routeRules[rule.name];
				continue;
			}
			if (typeof currentRule.options === "object" && typeof rule.options === "object") currentRule.options = {
				...currentRule.options,
				...rule.options
			};
			else currentRule.options = rule.options;
			currentRule.route = rule.route;
			currentRule.params = {
				...currentRule.params,
				...layer.params
			};
		} else if (rule.options !== false) routeRules[rule.name] = {
			...rule,
			params: layer.params
		};
	}
	const middleware = [];
	const orderedRules = Object.values(routeRules).sort((a, b) => (a.handler?.order || 0) - (b.handler?.order || 0));
	for (const rule of orderedRules) {
		if (rule.options === false || !rule.handler) continue;
		middleware.push(rule.handler(rule));
	}
	return {
		routeRules,
		routeRuleMiddleware: middleware
	};
}
//#endregion
//#region node_modules/.pnpm/@aziontech+presets@1.1.0_@babel+core@7.29.7_@jest+transform@30.4.1_@jest+types@30.4.1_b_1fcab5d43b5032a5bf56fd6f87a56b90/node_modules/@aziontech/presets/src/presets/nitro/custom/runtime/azion-module.js
function attachRuntimeContext(request, ctx) {
	request.runtime ??= { name: "azion" };
	request.runtime.azion = {
		...request.runtime.azion,
		...ctx
	};
	request.waitUntil = ctx.context?.waitUntil.bind(ctx.context);
}
async function fetchStaticAsset(url) {
	try {
		const pathname = decodeURIComponent(url.pathname);
		const assetUrl = new URL(pathname === "/" ? "index.html" : pathname, "file://");
		return fetch(assetUrl);
	} catch (e) {
		return new Response(e.message || e.toString(), { status: 404 });
	}
}
var nitroApp = useNitroApp();
var azion_module_default = { async fetch(request, env, context) {
	globalThis.__env__ = {
		...env,
		...unenvProcess.env
	};
	attachRuntimeContext(request, {
		env: globalThis.__env__,
		context
	});
	const url = new URL(request.url);
	if (isPublicAssetURL(url.pathname)) return await fetchStaticAsset(url);
	return await nitroApp.fetch(request);
} };
//#endregion
export { init_events as a, createNotImplementedError as c, notImplementedClass as d, azion_module_default as default, unenvProcess as i, init_utils as l, toRequest as n, _EventEmitter as o, init_process as r, init_events$1 as s, HTTPError as t, notImplemented as u };

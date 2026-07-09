//#region node_modules/.pnpm/@ungap+structured-clone@1.3.1/node_modules/@ungap/structured-clone/esm/deserialize.js
var env = typeof self === "object" ? self : globalThis;
var guard = (name, init) => {
	switch (name) {
		case "Function":
		case "SharedWorker":
		case "Worker":
		case "eval":
		case "setInterval":
		case "setTimeout": throw new TypeError("unable to deserialize " + name);
	}
	return new env[name](init);
};
var deserializer = ($, _) => {
	const as = (out, index) => {
		$.set(index, out);
		return out;
	};
	const unpair = (index) => {
		if ($.has(index)) return $.get(index);
		const [type, value] = _[index];
		switch (type) {
			case 0:
			case -1: return as(value, index);
			case 1: {
				const arr = as([], index);
				for (const index of value) arr.push(unpair(index));
				return arr;
			}
			case 2: {
				const object = as({}, index);
				for (const [key, index] of value) object[unpair(key)] = unpair(index);
				return object;
			}
			case 3: return as(new Date(value), index);
			case 4: {
				const { source, flags } = value;
				return as(new RegExp(source, flags), index);
			}
			case 5: {
				const map = as(/* @__PURE__ */ new Map(), index);
				for (const [key, index] of value) map.set(unpair(key), unpair(index));
				return map;
			}
			case 6: {
				const set = as(/* @__PURE__ */ new Set(), index);
				for (const index of value) set.add(unpair(index));
				return set;
			}
			case 7: {
				const { name, message } = value;
				return as(guard(name, message), index);
			}
			case 8: return as(BigInt(value), index);
			case "BigInt": return as(Object(BigInt(value)), index);
			case "ArrayBuffer": return as(new Uint8Array(value).buffer, value);
			case "DataView": {
				const { buffer } = new Uint8Array(value);
				return as(new DataView(buffer), value);
			}
		}
		return as(guard(type, value), index);
	};
	return unpair;
};
/**
* @typedef {Array<string,any>} Record a type representation
*/
/**
* Returns a deserialized value from a serialized array of Records.
* @param {Record[]} serialized a previously serialized value.
* @returns {any}
*/
var deserialize = (serialized) => deserializer(/* @__PURE__ */ new Map(), serialized)(0);
//#endregion
//#region node_modules/.pnpm/@ungap+structured-clone@1.3.1/node_modules/@ungap/structured-clone/esm/serialize.js
var EMPTY = "";
var { toString } = {};
var { keys } = Object;
var typeOf = (value) => {
	const type = typeof value;
	if (type !== "object" || !value) return [0, type];
	const asString = toString.call(value).slice(8, -1);
	switch (asString) {
		case "Array": return [1, EMPTY];
		case "Object": return [2, EMPTY];
		case "Date": return [3, EMPTY];
		case "RegExp": return [4, EMPTY];
		case "Map": return [5, EMPTY];
		case "Set": return [6, EMPTY];
		case "DataView": return [1, asString];
	}
	if (asString.includes("Array")) return [1, asString];
	if (asString.includes("Error")) return [7, asString];
	return [2, asString];
};
var shouldSkip = ([TYPE, type]) => TYPE === 0 && (type === "function" || type === "symbol");
var serializer = (strict, json, $, _) => {
	const as = (out, value) => {
		const index = _.push(out) - 1;
		$.set(value, index);
		return index;
	};
	const pair = (value) => {
		if ($.has(value)) return $.get(value);
		let [TYPE, type] = typeOf(value);
		switch (TYPE) {
			case 0: {
				let entry = value;
				switch (type) {
					case "bigint":
						TYPE = 8;
						entry = value.toString();
						break;
					case "function":
					case "symbol":
						if (strict) throw new TypeError("unable to serialize " + type);
						entry = null;
						break;
					case "undefined": return as([-1], value);
				}
				return as([TYPE, entry], value);
			}
			case 1: {
				if (type) {
					let spread = value;
					if (type === "DataView") spread = new Uint8Array(value.buffer);
					else if (type === "ArrayBuffer") spread = new Uint8Array(value);
					return as([type, [...spread]], value);
				}
				const arr = [];
				const index = as([TYPE, arr], value);
				for (const entry of value) arr.push(pair(entry));
				return index;
			}
			case 2: {
				if (type) switch (type) {
					case "BigInt": return as([type, value.toString()], value);
					case "Boolean":
					case "Number":
					case "String": return as([type, value.valueOf()], value);
				}
				if (json && "toJSON" in value) return pair(value.toJSON());
				const entries = [];
				const index = as([TYPE, entries], value);
				for (const key of keys(value)) if (strict || !shouldSkip(typeOf(value[key]))) entries.push([pair(key), pair(value[key])]);
				return index;
			}
			case 3: return as([TYPE, value.toISOString()], value);
			case 4: {
				const { source, flags } = value;
				return as([TYPE, {
					source,
					flags
				}], value);
			}
			case 5: {
				const entries = [];
				const index = as([TYPE, entries], value);
				for (const [key, entry] of value) if (strict || !(shouldSkip(typeOf(key)) || shouldSkip(typeOf(entry)))) entries.push([pair(key), pair(entry)]);
				return index;
			}
			case 6: {
				const entries = [];
				const index = as([TYPE, entries], value);
				for (const entry of value) if (strict || !shouldSkip(typeOf(entry))) entries.push(pair(entry));
				return index;
			}
		}
		const { message } = value;
		return as([TYPE, {
			name: type,
			message
		}], value);
	};
	return pair;
};
/**
* @typedef {Array<string,any>} Record a type representation
*/
/**
* Returns an array of serialized Records.
* @param {any} value a serializable value.
* @param {{json?: boolean, lossy?: boolean}?} options an object with a `lossy` or `json` property that,
*  if `true`, will not throw errors on incompatible types, and behave more
*  like JSON stringify would behave. Symbol and Function will be discarded.
* @returns {Record[]}
*/
var serialize = (value, { json, lossy } = {}) => {
	const _ = [];
	return serializer(!(json || lossy), !!json, /* @__PURE__ */ new Map(), _)(value), _;
};
//#endregion
//#region node_modules/.pnpm/@ungap+structured-clone@1.3.1/node_modules/@ungap/structured-clone/esm/index.js
/**
* @typedef {Array<string,any>} Record a type representation
*/
/**
* Returns an array of serialized Records.
* @param {any} any a serializable value.
* @param {{transfer?: any[], json?: boolean, lossy?: boolean}?} options an object with
* a transfer option (ignored when polyfilled) and/or non standard fields that
* fallback to the polyfill if present.
* @returns {Record[]}
*/
var esm_default = typeof structuredClone === "function" ? (any, options) => options && ("json" in options || "lossy" in options) ? deserialize(serialize(any, options)) : structuredClone(any) : (any, options) => deserialize(serialize(any, options));
//#endregion
export { esm_default as t };

import { t as characterEntities } from "./character-entities.mjs";
//#region node_modules/.pnpm/decode-named-character-reference@1.3.0/node_modules/decode-named-character-reference/index.js
var own = {}.hasOwnProperty;
/**
* Decode a single character reference (without the `&` or `;`).
* You probably only need this when you’re building parsers yourself that follow
* different rules compared to HTML.
* This is optimized to be tiny in browsers.
*
* @param {string} value
*   `notin` (named), `#123` (deci), `#x123` (hexa).
* @returns {string|false}
*   Decoded reference.
*/
function decodeNamedCharacterReference(value) {
	return own.call(characterEntities, value) ? characterEntities[value] : false;
}
//#endregion
export { decodeNamedCharacterReference as t };

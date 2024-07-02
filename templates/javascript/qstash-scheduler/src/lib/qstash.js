import { decode, encode } from "../util/base64url.js";

export const verify = async (
  token,
  key,
  url,
  bodyInput,
  clockTolerance
) => {
  const parts = token.split(".");

  if (parts.length !== 3) {
    throw new Error("`Upstash-Signature` header is not a valid signature");
  }
  const [header, payload, signature] = parts;

  const k = await crypto.subtle.importKey("raw", new TextEncoder().encode(key), { name: "HMAC", hash: "SHA-256" }, false, [
    "sign",
    "verify",
  ]);

  const isValid = await crypto.subtle.verify(
    { name: "HMAC" },
    k,
    decode(signature),
    new TextEncoder().encode(`${header}.${payload}`)
  );

  if (!isValid) {
    throw new Error("signature does not match");
  }

  const p = JSON.parse(new TextDecoder().decode(decode(payload)));
  if (p.iss !== "Upstash") {
    throw new Error(`invalid issuer: ${p.iss}`);
  }

  if (url && typeof url !== "undefined" && p.sub !== url) {
    throw new Error(`invalid subject: ${p.sub}, want: ${url}`);
  }

  if (clockTolerance) {
    const now = Math.floor(Date.now() / 1000);
    if (now - (clockTolerance ?? 0) > p.exp) {
      console.log({ now, exp: p.exp });
      throw new Error("token has expired");
    }
    if (now + (clockTolerance ?? 0) < p.nbf) {
      throw new Error("token is not yet valid");
    }
  }

  if (bodyInput) {
    const bodyHash = await crypto.subtle.digest(
      "SHA-256",
      typeof bodyInput === "string" ? new TextEncoder().encode(bodyInput) : bodyInput
    );

    const padding = new RegExp(/=+$/);

    if (p.body.replace(padding, "") !== encode(bodyHash).replace(padding, "")) {
      throw new Error(`body hash does not match, want: ${p.body}, got: ${encode(bodyHash)}`);
    }
  }
};

import { Redis } from "@upstash/redis/nodejs";
import { Ratelimit } from "@upstash/ratelimit/dist";

// defining process.env because the upstash lib is for Node.js.
globalThis.process = { env: { UPSTASH_DISABLE_TELEMETRY: 1 } };

export async function redisRateLimit(limitConfig, config) {
  try {
    const redis = new Redis(config);

    const limit = limitConfig?.limit || 3;
    const window = limitConfig?.window || "30 s";
    const identifier = limitConfig?.identifier || "user unique id";

    const ratelimit = new Ratelimit({
      redis: redis,
      limiter: Ratelimit.cachedFixedWindow(limit, window),
      ephemeralCache: limitConfig?.cache,
    });

    const { success } = await ratelimit.limit(identifier);
    if (!success) {
      return { result: "Too Many Requests", status: 429 };
    }
    return { result: `success request ${identifier} window: ${window} - router /login`, status: 200 };
  } catch (error) {
    return { result: `${error?.message} fail rate limit`, status: 500 };
  }
}
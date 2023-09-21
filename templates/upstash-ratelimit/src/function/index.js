import { redisRateLimit } from "../lib/upstash-redis.js";

/**
 * https://www.azion.com/en/documentation/products/edge-application/rules-engine/#variables
 * ${remoteAddr}
 *
 */

const cache = new Map();

async function handleRequest(request, args) {
  const method = request.method;
  const remoteAddr = request?.metadata["remote_addr"];

  const pathname = new URL(request.url).pathname;

  if (pathname !== "/login") {
    return new Response(
      JSON.stringify({
        message: "got to /login",
      }),
      {
        status: 404,
        headers: {
          "content-type": "application/json",
        },
      }
    );
  }

  if (method !== 'GET') {
    return new Response(
      JSON.stringify({
        message: "METHOD NOT ALLOWED",
      }),
      {
        status: 404,
        headers: {
          "content-type": "application/json",
        },
      }
    );
  }

  const { result: resultRedis, status } = await redisRateLimit(
    {
      limit: args?.UPSTASH_LIMIT,
      window: args?.UPSTASH_LIMIT_WINDOW,
      cache: cache,
      identifier: remoteAddr // ip origin
    },
    {
      url: args?.UPSTASH_REDIS_REST_URL || "",
      token: args?.UPSTASH_REDIS_REST_TOKEN || "",
    }
  );

  const result = resultRedis || "Login fail";

  return new Response(result, {
    status: status || 500,
    headers: {
      "content-type": "application/json",
    },
  });
}

export { handleRequest };
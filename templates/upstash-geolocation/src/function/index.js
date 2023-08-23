import { redisGet } from "../lib/upstash-redis.js";

/**
 * https://www.azion.com/en/documentation/products/edge-application/rules-engine/#variables
 * ${geoip_country_code}
 * ${geoip_city}
 * ${geoip_region}
 *
 */
async function handleRequest(request, args) {
  const method = request.method;
  const country = request?.metadata["geoip_country_code"];

  const pathname = new URL(request.url).pathname;

  if (method !== "GET") {
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

  // This is to add an action and in the propagation of the edges do not make requests
  if (pathname !== "/hello") {
    return new Response(
      JSON.stringify({
        message: "got to /hello",
      }),
      {
        status: 404,
        headers: {
          "content-type": "application/json",
        },
      }
    );
  }

  const { result: resultRedis, status } = await redisGet(country, {
    url: args?.UPSTASH_REDIS_REST_URL || "",
    token: args?.UPSTASH_REDIS_REST_TOKEN || "",
  });

  const result = resultRedis || `Hello ${country}!`;

  return new Response(result, {
    status: status || 404,
    headers: {
      "content-type": "application/json",
    },
  });
}

export { handleRequest };

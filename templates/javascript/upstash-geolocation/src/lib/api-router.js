import { redisGet, redisSet } from "./upstash-redis.js";
import { Router } from "itty-router";

/**
 * Api route using the itty-router library.
   For more details check out https://itty.dev/itty-router
 *  
 * @returns {RouterType<import("itty-router").Route, any[]>}
 */
export const ApiRouter = () => {
  const router = Router({ base: '/api' });
  router
    .get("/message", apiGetMessageHandler)
    .put("/message", apiUpdateMessageHandler);

  return router;
};


/**
 * Get Message Handler
 * @param {*} request
 * @param {*} request.metadata e.g ${geoip_country_code} https://www.azion.com/en/documentation/products/edge-application/rules-engine/#variables
 * @param {*} extras
 * @param {*} extras.args function args e.g 
 * @returns {{ message: string }}
 */
const apiGetMessageHandler = async (request, extras) => {
  const { args } = extras;
  const country = request?.metadata?.["geoip_country_code"] || "BR";
  const countryName = request?.metadata?.["geoip_city_country_name"] || "Brazil";

  const { result: resultRedis, status } = await redisGet(country, {
    url: args?.UPSTASH_REDIS_REST_URL || "",
    token: args?.UPSTASH_REDIS_REST_TOKEN || "",
  });

  const messageByGeolocation = status === 200 ? resultRedis : `Hello, your location is ${countryName}!`;

  return new Response(JSON.stringify({ message: messageByGeolocation }), {
    headers: {
      "content-type": "application/json;charset=UTF-8",
    },
    status: 200,
  });
};

/**
 * Update message Handler
 * @param {*} request
 * @param {*} request.metadata e.g ${geoip_country_code} https://www.azion.com/en/documentation/products/edge-application/rules-engine/#variables
 * @param {*} extras
 * @param {*} extras.args function args e.g 
 * @returns {{ message: string }}
 */
const apiUpdateMessageHandler = async (request, extras) => {
  const country = request?.metadata?.["geoip_country_code"] || "BR";
  const { args } = extras;
  let body = await request.json();

  if (!body?.message) {
    return new Response(JSON.stringify({ message: "message invalid: check your request" }), {
      headers: {
        "content-type": "application/json;charset=UTF-8",
      },
      status: 400,
    });
  }

  const { result: resultRedis, status } = await redisSet(country, body?.message, {
    url: args?.UPSTASH_REDIS_REST_URL || "",
    token: args?.UPSTASH_REDIS_REST_TOKEN || "",
  });

  return new Response(JSON.stringify({ message: "success" }), {
    headers: {
      "content-type": "application/json;charset=UTF-8",
    },
    status: status || 400,
  });
};

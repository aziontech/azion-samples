import { Router } from "itty-router";
import { randomUUID } from "node:crypto";

/**
 * Api route using the itty-router library.
   For more details check out https://itty.dev/itty-router
 *  
 * @returns {RouterType<import("itty-router").Route, any[]>}
 */
export const ApiRouter = () => {
  const router = Router({ base: "/api" });
  router.get("/message", apiGetMessageHandler);

  return router;
};

/**
 * Get Message Handler
 * @param {Request} request
 * @param {*} request.metadata e.g ${geoip_country_code} https://www.azion.com/en/documentation/products/edge-application/rules-engine/#variables
 * @param {*} extras
 * @param {*} extras.args function args e.g
 * @returns {{ message: string }}
 */
const apiGetMessageHandler = async (request, extras) => {
  const uuid = randomUUID();
  const message = `This uuid (${uuid}) was generated from node:crypto`;

  return new Response(JSON.stringify({ message: message }), {
    headers: {
      "content-type": "application/json;charset=UTF-8",
    },
    status: 200,
  });
};


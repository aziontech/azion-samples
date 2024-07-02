import { Router } from "itty-router";

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
 * @param {*} request
 * @param {*} request.metadata e.g ${geoip_country_code} https://www.azion.com/en/documentation/products/edge-application/rules-engine/#variables
 * @param {*} extras
 * @param {*} extras.args function args e.g
 * @returns {{ message: string }}
 */
const apiGetMessageHandler = async (request, extras) => {
  const helloMessage = "Hello World! (from /api/message route)";

  return new Response(JSON.stringify({ message: helloMessage }), {
    headers: {
      "content-type": "application/json;charset=UTF-8",
    },
    status: 200,
  });
};


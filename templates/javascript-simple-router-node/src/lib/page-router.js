import { Router } from "itty-router";
import { indexHTML } from "./html/index.js";

/**
 * Page route using the itty-router library.
   For more details check out https://itty.dev/itty-router
 *  
 * @returns {RouterType<import("itty-router").Route, any[]>}
 */
export const PageRouter = () => {
  const router = Router({ base: "/" });
  router.get("/", pageHomeHandler);

  return router;
};

/**
 * Page Home Handler
 * @param {*} request
 * @param {*} request.metadata e.g ${geoip_country_code} https://www.azion.com/en/documentation/products/edge-application/rules-engine/#variables
 * @param {*} extras
 * @param {*} extras.args function args e.g
 * @returns {Response} HTML page
 */
const pageHomeHandler = async (request, _extras) => {
  const html = indexHTML();

  return new Response(html, {
    headers: {
      "content-type": "text/html;charset=UTF-8",
    },
    status: 200,
  });
};


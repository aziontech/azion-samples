import { Router } from "itty-router";
import { indexHTML } from "./html/index.js";
import { updateMessageHTML } from "./html/update-message.js";

/**
 * Page route using the itty-router library.
   For more details check out https://itty.dev/itty-router
 *  
 * @returns {RouterType<import("itty-router").Route, any[]>}
 */
export const PageRouter = () => {
  const router = Router({ base: '/' });
  router
    .get("/", pageHomeHandler)
    .get("/update-message", pageUpdateMessageHandler)

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

  const geoip_region = request?.metadata?.["geoip_region"] || "--";
  const geoip_city = request?.metadata?.["geoip_city"] || "--";
  const countryName = request?.metadata?.["geoip_city_country_name"] || "--";
  const geoip_region_name = request?.metadata?.["geoip_region_name"] || "--";
  

  const html = indexHTML(countryName, { geoip_region, geoip_city, geoip_region_name });

  return new Response(html, {
    headers: {
      "content-type": "text/html;charset=UTF-8",
    },
    status: 200,
  });
};


/**
 * Page Update Message Handler
 * @param {*} request
 * @param {*} request.metadata e.g ${geoip_country_code} https://www.azion.com/en/documentation/products/edge-application/rules-engine/#variables
 * @param {*} extras
 * @param {*} extras.args function args e.g 
 * @returns {Response} HTML page
 */
const pageUpdateMessageHandler = async (request, _extras) => {

  const country = request?.metadata?.["geoip_country_code"] || "BR";
  const countryName = request?.metadata?.["geoip_city_country_name"] || "Brazil";

  const html = updateMessageHTML(countryName);

  return new Response(html, {
    headers: {
      "content-type": "text/html;charset=UTF-8",
    },
    status: 200,
  });
};

import { Router } from "itty-router";
import { indexHTML } from "../html/index.js";

/**
 * Page route using the itty-router library.
   For more details check out https://itty.dev/itty-router
 *  
 * @returns {RouterType<import("itty-router").Route, any[]>}
 */
export const PageRouter = () => {
  const router = Router({ base: '/' });
  router
    .get("/", pageHomeHandler);

  return router;
};

/**
 * Page Home Handler
 * @param {*} request
 * @param {*} extras
 * @param {*} extras.args function args e.g 
 * @returns {Response} HTML page
 */
const pageHomeHandler = async (request, _extras) => {
  let html = indexHTML();
  let postsData = "";
  
  const requestUrl = new URL(request.url);
  const postsResponse = await fetch(`${requestUrl.origin}/api/posts`);
  const { results } = await postsResponse.json();

  for (const post of results) {
    postsData += `<li><div class="list-content"><textarea class="textarea-post" disabled type="text" id="text-post-${post[0]}">${post[1]}</textarea><div class="actions"><button id="btn-post-save-${post[0]}" style="display: none;" onclick="updateItem('${post[0]}')"><i class="icons" data-lucide="save"></i></button><button onclick="onEditElement(this, '${post[0]}')"><i class="icons" data-lucide="pencil"></i></button><button onclick="deleteItem(this, '${post[0]}')"><i class="icons" data-lucide="trash"></i></button></div></div></li>`;
  }
  
  html = html.replace("<!-- posts_data -->", postsData);
  return new Response(html, {
    headers: {
      "content-type": "text/html;charset=UTF-8",
    },
    status: 200,
  });
};



import { MainRouter } from "../lib/routers/main-router.js";
import { PageRouter } from "../lib/routers/page-router.js";
import { ApiRouter } from "../lib/routers/api-router.js";

async function handleRequest(request, args) {
  // to add or change a route check the route files
  const mainRouter = MainRouter();
  const apiRouter = ApiRouter();
  const pageRouter = PageRouter();

  // added api-router.js to main router
  mainRouter.all("/api/*", apiRouter.handle);
  // added page-router.js to main router
  mainRouter.all("/*", pageRouter.handle);

  //  other path (404 page)
  mainRouter.all("*", () => {
    return new Response(`You are trying something incorrect.`, { status: 200 });
  });

  return mainRouter.handle(request, { args });
}

export { handleRequest };

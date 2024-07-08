import { MainRouter } from "../lib/main-router";
import { PageRouter } from "../lib/page-router";
import { ApiRouter } from "../lib/api-router";
import { CustomEvent } from "../types/event";

async function handleRequest({ request, args }: CustomEvent): Promise<Response> {
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
    return new Response(`Welcome to the Edge!`, { status: 404 });
  });

  return mainRouter.handle(request, { args });
}

export { handleRequest };

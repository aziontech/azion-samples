import { MainRouter } from "../lib/routers/main-router.js";
import { PageRouter } from "../lib/routers/page-router.js";
import { ApiRouter } from "../lib/routers/api-router.js";
import { createClient } from 'azion/sql';

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
  
  const name = args.name || Azion.env.get("EDGE_SQL_STARTER_KIT_DBNAME");
  const token = args.token || Azion.env.get("EDGE_SQL_STARTER_KIT_TOKEN");

  // Setup Azion Lib client for Edge SQL
  const edgeSqlClient = await createClient(({token: token, options: { debug: false }}));
  const { data, error } = await edgeSqlClient.getDatabase(name);
  
  if (error) {
    console.error(error);
    return new Response(`Failed to connect with EdgeSQL`, { status: 200 });
  }
  
  return mainRouter.handle(request, data);
}

export { handleRequest };
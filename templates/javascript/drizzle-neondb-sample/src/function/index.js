import { MainRouter } from "../lib/routers/main-router.js";
import { PageRouter } from "../lib/routers/page-router.js";
import { ApiRouter } from "../lib/routers/api-router.js";
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { pgTable, text, serial } from "drizzle-orm/pg-core";

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

  //Setup Neon connection
  const client = neon(
    args.connection_url ||
    Azion.env.get("DRIZZLE_NEON_CONNECTION_URL")
  );
  const db = drizzle(client);

  //Setup Neon table
  const posts = pgTable('posts', {
    id: serial('id'),
    message: text('message'),
  });

  return mainRouter.handle(request, db, posts);
}

export { handleRequest };

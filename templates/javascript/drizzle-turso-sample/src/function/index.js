import { MainRouter } from "../lib/routers/main-router.js";
import { PageRouter } from "../lib/routers/page-router.js";
import { ApiRouter } from "../lib/routers/api-router.js";
import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import { integer, text, sqliteTable } from "drizzle-orm/sqlite-core";

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

  //Setup Turso connection
  const client = createClient({
    url: args.url || Azion.env.get("DRIZZLE_TURSO_URL"),
    authToken: args.token || Azion.env.get("DRIZZLE_TURSO_TOKEN"),
  });
  const db = drizzle({ client });

  // Setup Turso Table
  const posts = sqliteTable('posts', {
    id: integer('id'),
    message: text('message'),
  });

  return mainRouter.handle(request, db, posts);
}

export { handleRequest };

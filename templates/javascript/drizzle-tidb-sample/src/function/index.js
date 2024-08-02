import { MainRouter } from "../lib/routers/main-router.js";
import { PageRouter } from "../lib/routers/page-router.js";
import { ApiRouter } from "../lib/routers/api-router.js";
import { connect } from '@tidbcloud/serverless';
import { drizzle } from 'drizzle-orm/tidb-serverless';
import { mysqlTable, int, text } from 'drizzle-orm/mysql-core';

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

  // Setup TiDB connection
  const client = connect({
    database: args.database || Azion.env.get("DRIZZLE_TIDB_DATABASE"),
    host: args.host || Azion.env.get("DRIZZLE_TIDB_HOST"),
    password: args.password || Azion.env.get("DRIZZLE_TIDB_PASSWORD"),
    port: args.port || Azion.env.get("DRIZZLE_TIDB_PORT"),
    username: args.username || Azion.env.get("DRIZZLE_TIDB_USERNAME"),
  });

  const db = drizzle(client);

  // Setup TiDB Table
  const posts = mysqlTable('posts', {
    id: int('id'),
    message: text('message'),
  });

  return mainRouter.handle(request, db, posts);
}

export { handleRequest };

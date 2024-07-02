import { Router } from "itty-router";
import { connect } from '@tidbcloud/serverless';
import { drizzle } from 'drizzle-orm/tidb-serverless';
import { desc, eq } from 'drizzle-orm';
import { mysqlTable, int, text } from 'drizzle-orm/mysql-core';

/**
 * Setup of the TiDB Table
 */
const posts = mysqlTable('posts', {
  id: int('id'),
  message: text('message'),
});

/**
 * Api route using the itty-router library.
   For more details check out https://itty.dev/itty-router
 *  
 * @returns {RouterType<import("itty-router").Route, any[]>}
 */
export const ApiRouter = () => {
  const router = Router({ base: "/api" });
  router.get("/posts", apiGetAllPostsHandler);
  router.post("/posts", apiCreatePostHandler);
  router.put("/posts/:id", apiUpdatePostPostsHandler);
  router.delete("/posts/:id", apiDeletePostPostsHandler);

  return router;
};

/**
 * Get All Posts Handler
 * @param {*} request
 * @param {*} extras
 * @param {*} extras.args function args e.g
 * @returns {{ results: any[] }}
 */
const apiGetAllPostsHandler = async (request, extras) => {
  const { args } = extras;

  try {
    const client = connect({
      database: args.database || Azion.env.get("DRIZZLE_TIDB_DATABASE"),
      host: args.host || Azion.env.get("DRIZZLE_TIDB_HOST"),
      password: args.password || Azion.env.get("DRIZZLE_TIDB_PASSWORD"),
      port: args.port || Azion.env.get("DRIZZLE_TIDB_PORT"),
      username: args.username || Azion.env.get("DRIZZLE_TIDB_USERNAME"),
    });

    const db = drizzle(client);
    const data = await db.select().from(posts).orderBy(desc(posts.id));

    return new Response(JSON.stringify({ results: data || [] }), {
      headers: {
        "content-type": "application/json;charset=UTF-8",
      },
      status: 200,
    });
  } catch(error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: {
        "content-type": "application/json;charset=UTF-8",
      },
      status: 500,
    });
  }
};

/**
 * Create post Handler
 * @param {*} request
 * @param {*} extras
 * @param {*} extras.args function args e.g
 * @returns {{ message: string }}
 */
const apiCreatePostHandler = async (request, extras) => {
  const { args } = extras;

  try {
    let body = await request.json();

    if (body?.post?.length < 1) {
      return new Response("Please your post must have at least 2 characters", { status: 400 });
    } else if  (body?.post?.length > 140) {
      return new Response("Please your post cannot be longer than 140 characters", { status: 400 });
    }

    const client = connect({
      database: args.database || Azion.env.get("DRIZZLE_TIDB_DATABASE"),
      host: args.host || Azion.env.get("DRIZZLE_TIDB_HOST"),
      password: args.password || Azion.env.get("DRIZZLE_TIDB_PASSWORD"),
      port: args.port || Azion.env.get("DRIZZLE_TIDB_PORT"),
      username: args.username || Azion.env.get("DRIZZLE_TIDB_USERNAME"),
    });

    const db = drizzle(client);
    const data = await db.insert(posts).values({ message: body.post });

    return new Response(JSON.stringify({ message: "success" }), {
      headers: {
        "content-type": "application/json;charset=UTF-8",
      },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: {
        "content-type": "application/json;charset=UTF-8",
      },
      status: 500,
    });
  }
};

/**
 * Delete Post Handler
 * @param {*} request
 * @param {*} extras
 * @param {*} extras.args function args e.g
 * @returns {{ results: any[] }}
 */
const apiDeletePostPostsHandler = async (request, extras) => {
  const { args } = extras;
  const { id } = request.params;
  
  if (!id) {
    return new Response("Missing ID to delete item", { status: 400 });
  }

  try {
    const client = connect({
      database: args.database || Azion.env.get("DRIZZLE_TIDB_DATABASE"),
      host: args.host || Azion.env.get("DRIZZLE_TIDB_HOST"),
      password: args.password || Azion.env.get("DRIZZLE_TIDB_PASSWORD"),
      port: args.port || Azion.env.get("DRIZZLE_TIDB_PORT"),
      username: args.username || Azion.env.get("DRIZZLE_TIDB_USERNAME"),
    });

    const db = drizzle(client);
    const deleted = await db.delete(posts).where(eq(posts.id, id));

    if (deleted.rowsAffected > 0) {
      return new Response(JSON.stringify({ message: "Post deleted!" }), {
        headers: {
          "content-type": "application/json;charset=UTF-8",
        },
        status: 200,
      });
    } else {
      return new Response(JSON.stringify({ message: "Post not found!" }), {
        headers: {
          "content-type": "application/json;charset=UTF-8",
        },
        status: 404,
      });
    }
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: {
        "content-type": "application/json;charset=UTF-8",
      },
      status: 500,
    });
  }
};

/**
 * Update Post Handler
 * @param {*} request
 * @param {*} extras
 * @param {*} extras.args function args e.g
 * @returns {{ results: any[] }}
 */
const apiUpdatePostPostsHandler = async (request, extras) => {
  const { args } = extras;
  const { id } = request.params;

  if (!id) {
    return new Response("Missing ID to update post", { status: 400 });
  }

  try {
    const body = await request.json();

    if (body?.post?.length < 1) {
      return new Response("Please your post must have at least 2 characters", { status: 400 });
    } else if  (body?.post?.length > 140) {
      return new Response("Please your post cannot be longer than 140 characters", { status: 400 });
    }

    const client = connect({
      database: args.database || Azion.env.get("DRIZZLE_TIDB_DATABASE"),
      host: args.host || Azion.env.get("DRIZZLE_TIDB_HOST"),
      password: args.password || Azion.env.get("DRIZZLE_TIDB_PASSWORD"),
      port: args.port || Azion.env.get("DRIZZLE_TIDB_PORT"),
      username: args.username || Azion.env.get("DRIZZLE_TIDB_USERNAME"),
    });

    const db = drizzle(client);
    const updated = await db.update(posts)
      .set({ message: body.post })
      .where(eq(posts.id, id));
    
    if (updated.rowsAffected > 0) {
      return new Response(JSON.stringify({ message: "Post updated!" }), {
        headers: {
          "content-type": "application/json;charset=UTF-8",
        },
        status: 200,
      });
    } else {
      return new Response(JSON.stringify({ message: "Post not found!" }), {
        headers: {
          "content-type": "application/json;charset=UTF-8",
        },
        status: 404,
      });
    }
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: {
        "content-type": "application/json;charset=UTF-8",
      },
      status: 500,
    });
  }
};

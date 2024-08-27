import { Router } from "itty-router";
import { createClient } from "@libsql/client/web";

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
  
  const client = createClient({
    url: args.url || Azion.env.get("TURSO_URL"),
    authToken: args.token || Azion.env.get("TURSO_TOKEN"),
  });

  const data = await client.execute("SELECT * FROM posts");

  return new Response(JSON.stringify({ results: data?.rows || [] }), {
    headers: {
      "content-type": "application/json;charset=UTF-8",
    },
    status: 200,
  });
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

    const client = createClient({
      url: args.url || Azion.env.get("TURSO_URL"),
      authToken: args.token || Azion.env.get("TURSO_TOKEN"),
    });

    await client.execute({
      sql: "INSERT INTO posts (message) VALUES (:message)",
      args: { message: body?.post }
    });

    return new Response(JSON.stringify({ message: "success" }), {
      headers: {
        "content-type": "application/json;charset=UTF-8",
      },
      status: 200,
    });
  } catch (error) {
    console.error(error);
    return new Response("Error adding item", { status: 500 });
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
    const client = createClient({
      url: args.url || Azion.env.get("TURSO_URL"),
      authToken: args.token || Azion.env.get("TURSO_TOKEN"),
    });

    await client.execute({
      sql: "DELETE FROM posts WHERE id = :id",
      args: {
        id: id
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ message: "not exist!" }), {
      headers: {
        "content-type": "application/json;charset=UTF-8",
      },
      status: 404,
    });
  }

  return new Response(JSON.stringify({ message: "post deleted!" }), {
    headers: {
      "content-type": "application/json;charset=UTF-8",
    },
    status: 200,
  });
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

    const client = createClient({
      url: args.url || Azion.env.get("TURSO_URL"),
      authToken: args.token || Azion.env.get("TURSO_TOKEN"),
    });

    await client.execute({
      sql: "UPDATE posts SET message = :message WHERE id = :id",
      args: {
        message: body?.post,
        id: id
      }
    });

    return new Response(JSON.stringify({ message: `Updated item with ID ${id} in the posts` }), {
      headers: {
        "content-type": "application/json;charset=UTF-8",
      },
      status: 200,
    });
  } catch (error) {
    console.log(error);
    return new Response(JSON.stringify({ message: "not exist!" }), {
      headers: {
        "content-type": "application/json;charset=UTF-8",
      },
      status: 404,
    });
  }
};

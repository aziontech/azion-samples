import { Router } from "itty-router";
import SqlString from "sqlstring";

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
 * @param {*} database
 * @returns {{ results: any[] }}
 */
const apiGetAllPostsHandler = async (request, database) => {
  const { data, error } = await database.query(["SELECT * FROM posts ORDER BY ID DESC;"]);
  let posts = [];
  
  if (error) {
    console.error(error);
  }
  
  return new Response(JSON.stringify({ results: data?.results[0]?.rows || [] }), {
    headers: {
      "content-type": "application/json;charset=UTF-8",
    },
    status: 200,
  });
};

/**
 * Create post Handler
 * @param {*} request
 * @param {*} database
 * @returns {{ message: string }}
 */
const apiCreatePostHandler = async (request, database) => {
  try {
    let body = await request.json();

    if (body?.post?.length < 1) {
      return new Response("Please your post must have at least 2 characters", { status: 400 });
    } else if  (body?.post?.length > 140) {
      return new Response("Please your post cannot be longer than 140 characters", { status: 400 });
    }

    const query = SqlString.format('INSERT INTO posts (message) VALUES (?);', body.post);
    const { error } = await database.execute([query]);
    
    if (error) {
      console.error(error);
      return new Response("Error adding item", { status: 500 });
    }

    return new Response(JSON.stringify({ message: "Success" }), {
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
 * @param {*} database
 * @returns {{ results: any[] }}
 */
const apiDeletePostPostsHandler = async (request, database) => {
  const { id } = request.params;

  if (!id) {
    return new Response("Missing ID to delete item", { status: 400 });
  }

  const query = SqlString.format('DELETE FROM posts WHERE id = ?;', id);
  const { error } = await database.execute([query]);
    
  if (error) {    
    console.error(error);
    return new Response("Error adding item", { status: 500 });
  }

  return new Response(JSON.stringify({ message: "Post deleted!" }), {
    headers: {
      "content-type": "application/json;charset=UTF-8",
    },
    status: 200,
  });
};

/**
 * Update Post Handler
 * @param {*} request
 * @param {*} database
 * @returns {{ results: any[] }}
 */
const apiUpdatePostPostsHandler = async (request, database) => {
  const { id } = request.params;
  if (!id) {
    return new Response("Missing ID to update post", { status: 400 });
  }

  const body = await request.json();

  if (body?.post?.length < 1) {
    return new Response("Please your post must have at least 2 characters", { status: 400 });
  } else if  (body?.post?.length > 140) {
    return new Response("Please your post cannot be longer than 140 characters", { status: 400 });
  }
    
  const query = SqlString.format('UPDATE posts SET message = ? WHERE id = ?', [body.post, id]);
  const { error } = await database.execute([query]);
    
  if (error) {
    console.error(error);
    return new Response("Error updating item", { status: 500 });
  }

  return new Response(JSON.stringify({ message: `Updated item with ID ${id} in the posts` }), {
    headers: {
      "content-type": "application/json;charset=UTF-8",
    },
    status: 200,
  });
};

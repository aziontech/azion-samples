import { Router } from "itty-router";

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
  
  const url = args.url || Azion.env.get("AZION_URL");
  const token = args.token || Azion.env.get("AZION_TOKEN");
  const body = JSON.stringify({
    statements: [
				"SELECT * FROM posts;"
    ]
  });
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Token ${token}`,
  };

  const response = await fetch(url, { method: 'POST', body, headers })
  

  if (!response.ok) {
    /** do something */
  }

  const json = await response.json();

  return new Response(JSON.stringify({ results: json.data[0].results?.rows || [] }), {
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

    const url = args.url || Azion.env.get("AZION_URL");
    const token = args.token || Azion.env.get("AZION_TOKEN");
    const input = JSON.stringify({
      statements: [
          `INSERT INTO posts (message) VALUES ('${body?.post}');`,
      ]
    });

    console.log(input);
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`,
    };
  
    const response = await fetch(url, { method: 'POST', body: input, headers })
    
    if (!response.ok) {
      /** do something */
    }

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
    const url = args.url || Azion.env.get("AZION_URL");
    const token = args.token || Azion.env.get("AZION_TOKEN");
    const input = JSON.stringify({
      statements: [
          `DELETE FROM posts WHERE id = ${id}`,
      ]
    });
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`,
    };
  
    const response = await fetch(url, { method: 'POST', body: input, headers })
    
    if (!response.ok) {
      /** do something */
    }

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

    const url = args.url || Azion.env.get("AZION_URL");
    const token = args.token || Azion.env.get("AZION_TOKEN");
    const input = JSON.stringify({
      statements: [
          `UPDATE posts SET message = '${body?.post}' WHERE id = '${id}'`,
      ]
    });
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`,
    };
  
    const response = await fetch(url, { method: 'POST', body: input, headers })
    
    if (!response.ok) {
      /** do something */
    }

    return new Response(JSON.stringify({ message: `Updated item with ID ${id} in the posts` }), {
      headers: {
        "content-type": "application/json;charset=UTF-8",
      },
      status: 200,
    });
  } catch (error) {
    console.log(error)
    return new Response(JSON.stringify({ message: "not exist!" }), {
      headers: {
        "content-type": "application/json;charset=UTF-8",
      },
      status: 404,
    });
  }
};

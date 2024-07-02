import { Router } from "itty-router";

import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'

export const runtime = 'edge';

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

  const prisma = new PrismaClient({
    datasourceUrl: args.url || Azion.env.get("DATABASE_URL"),
  }).$extends(withAccelerate())

  const posts = await prisma.posts.findMany({
    cacheStrategy: { ttl: 60 },
  });
  
  return new Response(JSON.stringify({ results: posts || [] }), {
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

    const prisma = new PrismaClient({
      datasourceUrl: args.url || Azion.env.get("DATABASE_URL"),
    }).$extends(withAccelerate())
  
    await prisma.posts.create({
      data: {
        message: body?.post,
      },
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
    const prisma = new PrismaClient({
      datasourceUrl: args.url || Azion.env.get("DATABASE_URL"),
    }).$extends(withAccelerate())
  
    await prisma.posts.delete({
      where: {
        id: parseInt(id),
      },
    });
    
    return new Response(JSON.stringify({ message: "post deleted" }), {
      headers: {
        "content-type": "application/json;charset=UTF-8",
      },
      status: 200,
    });


  } catch (error) {
    return new Response(JSON.stringify({ message: "not exist!" }), {
      headers: {
        "content-type": "application/json;charset=UTF-8",
      },
      status: 404,
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

    const prisma = new PrismaClient({
      datasourceUrl: args.url || Azion.env.get("DATABASE_URL"),
    }).$extends(withAccelerate());

    await prisma.posts.update({
      where: {
        id: parseInt(id),
      },
      data: {
        message: body?.post,
      }
    });
    
    return new Response(JSON.stringify({ message: "post updated" }), {
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

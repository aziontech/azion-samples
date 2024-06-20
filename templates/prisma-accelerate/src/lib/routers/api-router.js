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
  
  // const client = createClient({
  //   url: args.url || Azion.env.get("TURSO_URL"),
  //   authToken: args.token || Azion.env.get("TURSO_TOKEN"),
  // });

  // const data = await client.execute("SELECT * FROM posts");

  // return new Response(JSON.stringify({ results: data?.rows || [] }), {
  //   headers: {
  //     "content-type": "application/json;charset=UTF-8",
  //   },
  //   status: 200,
  // });

  try {

    console.log('here 1');

    const prisma = new PrismaClient({
      datasourceUrl: "prisma://accelerate.prisma-data.net/?api_key=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGlfa2V5IjoiMDE2MTA1ZjUtZGU2ZC00MTE1LThiZjYtN2I2ZWU5MThkZWE5IiwidGVuYW50X2lkIjoiNmM4ZTc0MTQxNTBiZTg4MWY1NjEwMWYwYTA5YTZiOTQwNGFjNzY0ZWM3NDE5MDA1Y2Q0OTg5YTI5MGQ1OWI4NiIsImludGVybmFsX3NlY3JldCI6Ijc4MWU5MzhjLWMxZjMtNDE1Mi04NDQxLWIzYTc5YTI3MWI2YiJ9.K4lXjMj3uoirP3b3aOpBFaQ9Y6SYhRklptMj7NqTgfU"
    }).$extends(withAccelerate())

    console.log('here 2');

    const posts = await prisma.posts.findMany({
      cacheStrategy: { ttl: 60 },
    });

    console.log('here 3', posts);

    return posts;
  } catch (err) {
    console.log(err);
    throw err;
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

    // const client = createClient({
    //   url: args.url || Azion.env.get("TURSO_URL"),
    //   authToken: args.token || Azion.env.get("TURSO_TOKEN"),
    // });

    // const libsql = createClient({
    //   url: "libsql://sql-lite-test-hendriksoares.turso.io",
    //   authToken: "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3MTg3MTY2MTIsImlkIjoiMzkyNzZjYzctMDAzYy00YjM5LTg3ZWItM2E0ZmU2MTA0N2IwIn0.NhHM_B_x9rM1uJ_H2E0qpU_cwOwO_xDpa1pjRblEq6ZywQHbLmRD-c6eUsAfz8IS1LAiKnwwThEE-0Y80u3RAg",
    // })
    
    // const adapter = new PrismaLibSQL(libsql)
    // const prisma = new PrismaClient({ adapter })

    // /** code here */

    // const user = await prisma.post.create({
    //   data: {
    //     message: body?.post,
    //   },
    // })

    // console.log(user);

    // await prisma.$disconnect();
    // await await client.execute({
    //   sql: "INSERT INTO posts (message) VALUES (:message)",
    //   args: { message: body?.post }
    // });

    // return new Response(JSON.stringify({ message: "success" }), {
    //   headers: {
    //     "content-type": "application/json;charset=UTF-8",
    //   },
    //   status: 200,
    // });
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
    // const client = createClient({
    //   url: args.url || Azion.env.get("TURSO_URL"),
    //   authToken: args.token || Azion.env.get("TURSO_TOKEN"),
    // });

    // await await client.execute({
    //   sql: "DELETE FROM posts WHERE id = :id",
    //   args: {
    //     id: id
    //   }
    // });
    // const libsql = createClient({
    //   url: "libsql://sql-lite-test-hendriksoares.turso.io",
    //   authToken: "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3MTg3MTY2MTIsImlkIjoiMzkyNzZjYzctMDAzYy00YjM5LTg3ZWItM2E0ZmU2MTA0N2IwIn0.NhHM_B_x9rM1uJ_H2E0qpU_cwOwO_xDpa1pjRblEq6ZywQHbLmRD-c6eUsAfz8IS1LAiKnwwThEE-0Y80u3RAg",
    // })
    
    // const adapter = new PrismaLibSQL(libsql)
    // const prisma = new PrismaClient({ adapter })

    // await prisma.post.delete({
    //   where: {
    //     id,
    //   },
    // })      

    // await prisma.$disconnect();
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

    // const client = createClient({
    //   url: args.url || Azion.env.get("TURSO_URL"),
    //   authToken: args.token || Azion.env.get("TURSO_TOKEN"),
    // });

    // await await client.execute({
    //   sql: "UPDATE posts SET message = :message WHERE id = :id",
    //   args: {
    //     message: body?.post,
    //     id: id
    //   }
    // });

    // return new Response(JSON.stringify({ message: `Updated item with ID ${id} in the posts` }), {
    //   headers: {
    //     "content-type": "application/json;charset=UTF-8",
    //   },
    //   status: 200,
    // });

    // const libsql = createClient({
    //   url: "libsql://sql-lite-test-hendriksoares.turso.io",
    //   authToken: "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3MTg3MTY2MTIsImlkIjoiMzkyNzZjYzctMDAzYy00YjM5LTg3ZWItM2E0ZmU2MTA0N2IwIn0.NhHM_B_x9rM1uJ_H2E0qpU_cwOwO_xDpa1pjRblEq6ZywQHbLmRD-c6eUsAfz8IS1LAiKnwwThEE-0Y80u3RAg",
    // })
    
    // const adapter = new PrismaLibSQL(libsql)
    // const prisma = new PrismaClient({ adapter })

    // await prisma.post.update({
    //   where: {
    //     id,
    //   },
    //   data: {
    //     message: body?.post,
    //   }
    // })    

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

import { NextRequest, NextResponse } from "next/server";
import { generateResponse } from "../utils";
import { createClient } from "@libsql/client/web";

export async function GET(request: NextRequest) {
  const client = createClient({
    url: Azion.env.get("TURSO_URL") || "",
    authToken: Azion.env.get("TURSO_TOKEN") || ""
  });

  const data = await client.execute("SELECT * FROM posts");

  return generateResponse({ results: data?.rows || [] });
}
                           
export async function POST(request: NextRequest) {
  try {
    let body = await request.json();

    if (body?.post?.length < 2) {
      return new Response("Please your post must have at least 2 characters", { status: 400 });
    } else if  (body?.post?.length > 140) {
      return new Response("Please your post cannot be longer than 140 characters", { status: 400 });
    }

    const client = createClient({
      url: Azion.env.get("TURSO_URL") || "",
      authToken: Azion.env.get("TURSO_TOKEN") || ""
    });

    await client.execute({
      sql: "INSERT INTO posts (message) VALUES (:message)",
      args: { message: body?.post }
    });

    return generateResponse({ message: "success" });
  } catch (error) {
    console.error(error);
    return new Response("Error adding item", { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("id");
  
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
      url: Azion.env.get("TURSO_URL") || "",
      authToken: Azion.env.get("TURSO_TOKEN") || ""
    });

    await client.execute({
      sql: "UPDATE posts SET message = :message WHERE id = :id",
      args: {
        message: body?.post,
        id: id
      }
    });

    return generateResponse({ message: "Post deleted!" });
  } catch (error) {
    console.log(error);
    return new Response(JSON.stringify({ err: error }), {
      headers: {
        "content-type": "application/json;charset=UTF-8",
      },
      status: 404,
    });
  }
}

export async function DELETE(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("id");
  
  if (!id) {
    return new Response("Missing ID to update post", { status: 400 });
  }

  try {
    const client = createClient({
      url: Azion.env.get("TURSO_URL") || "",
      authToken: Azion.env.get("TURSO_TOKEN") || ""
    });

    await client.execute({
      sql: "DELETE FROM posts WHERE id = :id",
      args: {
        id: id
      }
    });

    return generateResponse({ message: "success" });
  } catch (error) {
    console.log(error);
    return new Response(JSON.stringify({ err: error }), {
      headers: {
        "content-type": "application/json;charset=UTF-8",
      },
      status: 404,
    });
  }
}


export const runtime = "edge";

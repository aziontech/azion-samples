import { verify } from "../lib/qstash.js";
// FUNCTION RECEIVER

async function handleRequest(request, args) {
  const headers = request.headers;
  const signature = headers.get("upstash-signature");

  const url = new URL(request.url);  

  if (!signature) {
    return new Response(
      JSON.stringify({
        message: "NOT ALLOWED",
      }),
      {
        status: 401,
        headers: {
          "content-type": "application/json",
        },
      }
    );
  }

  const body = await request.text();
  const urlPath = `https://${url.host}`

  try {
    await verify(signature, args.QSTASH_CURRENT_SIGNING_KEY, urlPath, body, undefined)
    console.log("The signature was valid");
  } catch (error) {
    console.log("Receiver error", error?.message);
    return new Response("Receiver verify", { status: 401 });
  }

  const result = JSON.stringify({
    message: "Success Schedule Execute",
  });
  const status = 200;

  console.log(`Success Schedule Execute`);

  return new Response(result, {
    status: status || 404,
    headers: {
      "content-type": "application/json",
    },
  });
}

export { handleRequest };

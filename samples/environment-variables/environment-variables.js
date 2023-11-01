async function handleRequest(args) {
  const body = args.message || Azion.env.get('HELLO_WORLD_EDGE_FUNCTION') || "Hello World!";

  return new Response(body, {
    headers: {
      "content-type": "text/plain"
    },
    status: 418
  });
}

addEventListener("fetch", event => {
  return event.respondWith(handleRequest(event.args))
});

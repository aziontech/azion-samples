async function handleRequest(args) {
  const body = args.message || Azion.env.get('HELLO_WORLD_EDGE_FUNCTION') || "Default value";

  return new Response(body, {
    headers: {
      "content-type": "text/plain"
    },
    status: 200
  });
}

addEventListener("fetch", event => {
  return event.respondWith(handleRequest(event.args))
});

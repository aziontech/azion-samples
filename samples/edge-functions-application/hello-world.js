async function handleRequest(request) {
    return new Response("Edge Functions JavaScript - General Availability")
  }

  addEventListener("fetch", event => {
    return event.respondWith(handleRequest(event.request))
  })
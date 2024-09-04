function handleRequest(request) {
    const NAME = "TestA/B"
    const TEST_RESPONSE = new Response("Cookie A")
    const CONTROL_RESPONSE = new Response("Cookie B")

    const cookie = request.headers.get("cookie")
    if (cookie && cookie.includes(`${NAME}=a`)) {
      return CONTROL_RESPONSE
    }
    else if (cookie && cookie.includes(`${NAME}=b`)) {
      return TEST_RESPONSE
    }
    else {
      const group = Math.random() < 0.5 ? "test" : "control"
      const response = group === "control" ? CONTROL_RESPONSE : TEST_RESPONSE
      response.headers.append("Set-Cookie", `${NAME}=${group}; path=/`)

      return response
    }
  }

  addEventListener("fetch", event => {
    event.respondWith(handleRequest(event.request))
  })
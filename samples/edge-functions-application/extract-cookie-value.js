const COOKIE_NAME = "hubspotutk"

function getCookie(request, name) {
  let result = ""
  const cookieString = request.headers.get("Cookie")
  if (cookieString) {
    const cookies = cookieString.split(";")
    cookies.forEach(cookie => {
      const cookiePair = cookie.split("=", 2)
      const cookieName = cookiePair[0].trim()
      if (cookieName === name) {
        const cookieVal = cookiePair[1]
        result = cookieVal
      }
    })
  }
  return result
}

function handleRequest(request) {
  const cookie = getCookie(request, COOKIE_NAME)
  if (cookie) {
    return new Response(cookie)
  }
  return new Response("No cookie with name: " + COOKIE_NAME)
}

addEventListener("fetch", event => {
  event.respondWith(handleRequest(event.request))
})
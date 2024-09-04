addEventListener("fetch", event => {
    return event.respondWith(
      fetch("https://azion.com")
    )
  })
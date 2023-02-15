async function handleRequest(request) {
    if (request.body) {
        let respBody = await request.text();
      
        // Now you can take some action using your text data...
        console.log(respBody);

        return new Response(respBody);
    }
  
    return new Response("No request body was sent");
}

addEventListener("fetch", (event) => {
    event.respondWith(handleRequest(event.request));
});
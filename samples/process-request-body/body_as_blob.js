async function handleRequest(request) {
    if (request.body) {
        let requestBlob = await request.blob();
        // Now you can take some action using the request blob...

        // For example, turn it into a text and return it to the user
        let respBody = await requestBlob.text();
        
        return new Response(respBody);
    }

    return new Response("No request body was sent");
}

addEventListener("fetch", (event) => {
    event.respondWith(handleRequest(event.request));
});
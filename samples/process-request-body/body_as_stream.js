async function handleRequest(request) {
    if (request.body) {
        let respBody = "";

        let reader = request.body.getReader();
        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            respBody += new TextDecoder("utf-8").decode(value);
        }

        // Now you can take some action using read data...
        console.log(respBody);

        return new Response(respBody);
    }

    return new Response("No request body was sent");
}

addEventListener("fetch", (event) => {
    event.respondWith(handleRequest(event.request));
});
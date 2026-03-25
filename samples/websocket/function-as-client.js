async function handleRequest(request) {
    const ws = new WebSocket("ws://echo.websocket.org/.ws");

    ws.onopen = (event) => {
        console.log("opened connection");
        ws.send("Here's some text!");
    };

    ws.onmessage = (event) => {
        console.log("received message");
        console.log(event);
    };

    ws.onclose = (event) => {
        console.log("close");
        console.log(event);
    };

    ws.onerror = (event) => {
        console.log("received error");
        console.log(event);
    };

    return new Response("Hello world", {
        headers: new Headers([["X-Custom-Header", "something defined on JS"]]),
        status: 200,
    });
}

addEventListener("fetch", (event) => {
    event.respondWith(handleRequest(event.request));
});

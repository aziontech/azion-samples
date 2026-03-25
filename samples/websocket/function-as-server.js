const wsConnections = new Map();

async function handleWebSocket(request) {
    try {
        const clientId = wsConnections.size + 1;

        const { socket, response } = upgradeWebSocket(request);

        wsConnections.set(socket, {
            id: clientId,
        });

        socket.onopen = () => {
            console.log(`WebSocket connection opened - clientId = ${clientId}`);
        };

        socket.onmessage = (event) => {
            try {
                const { data } = event;
                console.log(
                    `Received message from client - clientId = ${clientId}: ${data}`
                );

                socket.send(JSON.stringify(`Client ${clientId}: ${data}`));
            } catch (error) {
                console.error(`Error processing message: ${error}`);
            }
        };

        socket.onclose = () => {
            wsConnections.delete(socket);
            console.log(`WebSocket connection closed - clientId = ${clientId}`);
        };

        socket.onerror = (error) => {
            console.error(
                `WebSocket error for clientId = ${clientId}:`,
                error.message
            );
        };

        return response;
    } catch (error) {
        console.error("Error upgrading to WebSocket:", error);
        return new Response("Failed to upgrade to WebSocket", { status: 500 });
    }
}

async function handleRequest(request) {
    try {
        return await handleWebSocket(request);
    } catch (error) {
        console.error("Error handling request:", error);
        return new Response("Internal Server Error", {
            status: 500,
        });
    }
}

addEventListener("fetch", (event) => {
    event.respondWith(handleRequest(event.request));
});

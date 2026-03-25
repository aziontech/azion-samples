// Store connected clients
const clients = new Set();

// Generate a random color for each user
function getRandomColor() {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

// WebSocket connections and their associated data
const wsConnections = new Map();

// Handle WebSocket connections
async function handleWebSocket(request) {
    try {
        // Create a unique ID for this connection
        const clientId = crypto.randomUUID();
        const clientColor = getRandomColor();

        // Upgrade the connection to WebSocket
        const { socket, response } = upgradeWebSocket(request);

        // Store connection info
        wsConnections.set(socket, {
            id: clientId,
            color: clientColor,
        });

        // Set up WebSocket event handlers
        socket.onopen = () => {
            // Log that a new user has joined
            console.log(`WebSocket connection opened: ${clientId}`);

            // Broadcast a message that a new user has joined
            broadcastMessage({
                type: "system",
                message: `User ${clientId.substring(0, 6)} has joined the chat`,
                timestamp: new Date().toISOString(),
            });
        };

        // Handle incoming messages
        socket.onmessage = (event) => {
            try {
                // Parse the message
                const data = JSON.parse(event.data);

                // Handle the message based on its type
                if (data.type === "message") {
                    // Broadcast the message to all clients
                    broadcastMessage({
                        type: "message",
                        userId: clientId,
                        userColor: clientColor,
                        message: data.message,
                        timestamp: new Date().toISOString(),
                    });
                }
            } catch (error) {
                console.error(`Error processing message: ${error}`);
            }
        };

        // Handle disconnection
        socket.onclose = () => {
            // User disconnected
            wsConnections.delete(socket);
            console.log(`WebSocket connection closed: ${clientId}`);

            // Broadcast that a user has left
            broadcastMessage({
                type: "system",
                message: `User ${clientId.substring(0, 6)} has left the chat`,
                timestamp: new Date().toISOString(),
            });
        };

        // Handle errors
        socket.onerror = (error) => {
            console.error(`WebSocket error for ${clientId}:`, error);
        };

        // Return the WebSocket response
        return response;
    } catch (error) {
        console.error("Error upgrading to WebSocket:", error);
        return new Response("Failed to upgrade to WebSocket", { status: 500 });
    }
}

// Broadcast a message to all connected clients
function broadcastMessage(message) {
    const messageStr = JSON.stringify(message);

    // Send to all connected WebSockets
    for (const [ws, clientInfo] of wsConnections.entries()) {
        try {
            // Check if the WebSocket is open before sending
            if (ws.readyState === WebSocket.OPEN) {
                ws.send(messageStr);
            }
        } catch (error) {
            console.error(
                `Error sending message to client ${clientInfo.id}: ${error}`
            );
        }
    }
}

// HTML for the chat client
function getChatClientHtml() {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Azion WebSocket Chat</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 0;
      display: flex;
      flex-direction: column;
      height: 100vh;
      background-color: #f5f5f5;
    }
    .chat-container {
      max-width: 800px;
      margin: 20px auto;
      display: flex;
      flex-direction: column;
      flex-grow: 1;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
      border-radius: 8px;
      overflow: hidden;
    }
    .chat-header {
      background-color: #4a69bd;
      color: white;
      padding: 15px;
      text-align: center;
    }
    .chat-messages {
      flex-grow: 1;
      padding: 15px;
      overflow-y: auto;
      background-color: white;
    }
    .message {
      margin-bottom: 10px;
      padding: 10px;
      border-radius: 5px;
      max-width: 80%;
      word-wrap: break-word;
    }
    .message-content {
      display: inline-block;
    }
    .user-message {
      background-color: #e3f2fd;
      margin-left: auto;
      border-radius: 15px 15px 0 15px;
    }
    .other-message {
      background-color: #f1f1f1;
      margin-right: auto;
      border-radius: 15px 15px 15px 0;
    }
    .system-message {
      background-color: #f8f9fa;
      color: #6c757d;
      text-align: center;
      margin: 5px auto;
      font-style: italic;
      max-width: 100%;
    }
    .message-meta {
      font-size: 0.8em;
      color: #666;
      margin-top: 5px;
    }
    .chat-input {
      display: flex;
      padding: 15px;
      background-color: #f8f9fa;
    }
    #message-input {
      flex-grow: 1;
      padding: 10px;
      border: 1px solid #ddd;
      border-radius: 4px;
      margin-right: 10px;
    }
    #send-button {
      padding: 10px 20px;
      background-color: #4a69bd;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
    #send-button:hover {
      background-color: #3a559c;
    }
    .connection-status {
      text-align: center;
      padding: 5px;
      font-size: 0.9em;
    }
    .connected {
      color: green;
    }
    .disconnected {
      color: red;
    }
  </style>
</head>
<body>
  <div class="chat-container">
    <div class="chat-header">
      <h2>Azion WebSocket Chat</h2>
      <div id="connection-status" class="connection-status disconnected">Disconnected</div>
    </div>
    <div id="chat-messages" class="chat-messages"></div>
    <div class="chat-input">
      <input type="text" id="message-input" placeholder="Type your message..." autocomplete="off">
      <button id="send-button">Send</button>
    </div>
  </div>

  <script>
    document.addEventListener('DOMContentLoaded', () => {
      const messagesContainer = document.getElementById('chat-messages');
      const messageInput = document.getElementById('message-input');
      const sendButton = document.getElementById('send-button');
      const connectionStatus = document.getElementById('connection-status');

      let socket;
      let reconnectAttempts = 0;
      const maxReconnectAttempts = 5;

      // Function to connect to WebSocket
      function connectWebSocket() {
        // Get the current host and construct the WebSocket URL
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const wsUrl = protocol + '//' + window.location.host + '/ws';

        socket = new WebSocket(wsUrl);

        socket.onopen = () => {
          console.log('WebSocket connection established');
          connectionStatus.textContent = 'Connected';
          connectionStatus.className = 'connection-status connected';
          reconnectAttempts = 0;

          // Add system message that connection is established
          addMessage({
            type: 'system',
            message: 'Connected to chat server',
            timestamp: new Date().toISOString()
          });
        };

        socket.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            addMessage(data);
          } catch (error) {
            console.error('Error parsing message:', error);
          }
        };

        socket.onclose = () => {
          console.log('WebSocket connection closed');
          connectionStatus.textContent = 'Disconnected';
          connectionStatus.className = 'connection-status disconnected';

          // Try to reconnect
          if (reconnectAttempts < maxReconnectAttempts) {
            reconnectAttempts++;
            const delay = Math.min(1000 * Math.pow(2, reconnectAttempts), 30000);

            addMessage({
              type: 'system',
              message: 'Connection lost. Reconnecting in ' + (delay/1000) + ' seconds...',
              timestamp: new Date().toISOString()
            });

            setTimeout(connectWebSocket, delay);
          } else {
            addMessage({
              type: 'system',
              message: 'Failed to reconnect after multiple attempts. Please refresh the page.',
              timestamp: new Date().toISOString()
            });
          }
        };

        socket.onerror = (error) => {
          console.error('WebSocket error:', error);
          addMessage({
            type: 'system',
            message: 'Connection error occurred',
            timestamp: new Date().toISOString()
          });
        };
      }

      // Function to add a message to the chat
      function addMessage(data) {
        const messageElement = document.createElement('div');
        const timestamp = new Date(data.timestamp);
        const timeString = timestamp.toLocaleTimeString();

        if (data.type === 'system') {
          messageElement.className = 'message system-message';
          messageElement.innerHTML =
            '<div class="message-content">' + data.message + '</div>' +
            '<div class="message-meta">' + timeString + '</div>';
        } else {
          // For user messages
          const isCurrentUser = false; // We don't track the current user's ID on the client side in this simple example
          messageElement.className = 'message ' + (isCurrentUser ? 'user-message' : 'other-message');

          // Create user identifier with color
          const userDisplay = data.userId ?
            '<span style="color: ' + (data.userColor || '#000') + '">User ' + data.userId.substring(0, 6) + '</span>' :
            'Unknown User';

          messageElement.innerHTML =
            '<div class="message-content">' + data.message + '</div>' +
            '<div class="message-meta">' + userDisplay + ' • ' + timeString + '</div>';
        }

        messagesContainer.appendChild(messageElement);

        // Scroll to the bottom
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
      }

      // Function to send a message
      function sendMessage() {
        const message = messageInput.value.trim();

        if (message && socket && socket.readyState === WebSocket.OPEN) {
          const data = {
            type: 'message',
            message: message
          };

          socket.send(JSON.stringify(data));
          messageInput.value = '';
        }
      }

      // Event listeners
      sendButton.addEventListener('click', sendMessage);

      messageInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
          sendMessage();
        }
      });

      // Connect to WebSocket when the page loads
      connectWebSocket();
    });
  </script>
</body>
</html>`;
}

// Handle HTTP requests
async function handleRequest(request) {
    try {
        const url = new URL(request.url);

        // Handle WebSocket connections
        if (url.pathname === "/ws") {
            return await handleWebSocket(request);
        }

        // Serve the chat client HTML for the root path
        if (url.pathname === "/" || url.pathname === "") {
            return new Response(getChatClientHtml(), {
                headers: new Headers([["Content-Type", "text/html"]]),
                status: 200,
            });
        }

        // Return 404 for any other paths
        return new Response("Not Found", {
            status: 404,
        });
    } catch (error) {
        console.error("Error handling request:", error);
        return new Response("Internal Server Error", {
            status: 500,
        });
    }
}

// Listen for fetch events
addEventListener("fetch", (event) => {
    event.respondWith(handleRequest(event.request));
});

console.log("🚀 WebSocket server starting...");

// This is a simple in-memory representation of our todos.
// In a real app, you'd sync this with a database.
const todos = [
    { id: 1, text: "Learn Monorepos", completed: true },
    { id: 2, text: "Understand Turborepo", completed: false },
];

// Bun.serve creates a new server. We configure it to handle websockets.
const server = Bun.serve({
  port: 3002,
  // The 'fetch' handler is called for regular HTTP requests,
  // but it's also where we upgrade the connection to a WebSocket.
  fetch(req, server) {
    // Attempt to upgrade the request to a WebSocket connection.
    if (server.upgrade(req)) {
      return; // Bun handles the response for successful upgrades.
    }
    return new Response("Upgrade failed :(", { status: 500 });
  },
  // The 'websocket' object defines handlers for WebSocket events.
  websocket: {
    // 'open' is called when a new client connects.
    open(ws) {
      console.log("✅ Client connected");
      // Send the current list of todos to the newly connected client.
      ws.send(JSON.stringify({ type: "ALL_TODOS", payload: todos }));
    },
    // 'message' is called when a client sends a message to the server.
    message(ws, message) {
      console.log(`📩 Received message: ${message}`);
      
      const parsedMessage = JSON.parse(message.toString());
      
      // When a client sends a new todo, we add it to our list
      // and then broadcast the updated list to all connected clients.
      if (parsedMessage.type === "ADD_TODO") {
          const newTodo = {
              id: todos.length + 1,
              text: parsedMessage.payload.text,
              completed: false,
          };
          todos.push(newTodo);
          
          // Publish sends a message to all connected clients.
          server.publish("todos-channel", JSON.stringify({ type: "ALL_TODOS", payload: todos }));
      }
    },
    // 'close' is called when a client disconnects.
    close(ws, code, message) {
      console.log("❌ Client disconnected", { code, message });
    },
  },
});

console.log(
  `WebSocket server is running at ws://${server.hostname}:${server.port}`
);

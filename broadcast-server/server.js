const { WebSocketServer, WebSocket } = require("ws");

const start = () => {
  const server = new WebSocketServer({ port: 8080 });

  server.on("listening", () => {
    console.log("Server has started");
  });

  server.on("connection", (ws) => {
    ws.on("error", console.error);

    // Track the username for this connection
    let username;

    // Receive and broadcast messages from clients
    ws.on("message", (data) => {
      username = data.toString(); // Convert the data buffer to string
      server.clients.forEach((client) => {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          // Broadcast that a new user has joined
          client.send(`${username} joined`);
        }
      });
    });

    // Client disconnection
    ws.on("close", () => {
      if (username) {
        // Ensure username is set before broadcasting
        server.clients.forEach((client) => {
          if (client !== ws && client.readyState === WebSocket.OPEN) {
            // Broadcast the disconnection message
            client.send(`${username} disconnected`);
          }
        });
      }

      console.log("Client disconnected");
    });
  });
};

module.exports = {
  start,
};

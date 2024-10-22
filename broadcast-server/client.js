const { WebSocket } = require("ws");

let client; // Maintain the WebSocket client instance

const connect = (username) => {
  client = new WebSocket("ws://localhost:8080");

  client.on("error", console.error);

  client.on("open", () => {
    // Send the username when the connection opens
    client.send(username);
  });

  client.on("message", (data) => {
    // Log messages from the server
    console.log(data.toString());
  });

  client.on("close", () => {
    console.log(`${username} has disconnected`);
  });
};

module.exports = {
  connect,
};

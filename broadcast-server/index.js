const { start } = require("./server");
const { connect } = require("./client");

const type = process.argv[2];

switch (type) {
  case "start":
    start();
    break;

  case "connect":
    const username = process.argv[3];
    connect(username);
    break;

  default:
    console.log("Unknown command");
    break;
}

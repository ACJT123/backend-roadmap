const { WebSocketServer } = require("ws");
const { start } = require("./server");

jest.mock("ws");

describe("WebSocket Server", () => {
  let server;
  let mockServer;
  let mockClient;

  beforeEach(() => {
    mockServer = {
      on: jest.fn(),
      clients: new Set(),
    };
    mockClient = {
      on: jest.fn(),
      send: jest.fn(),
      readyState: WebSocketServer.OPEN,
    };
    WebSocketServer.mockImplementation(() => mockServer);
    server = start();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("should start the server and listen on port 8080", () => {
    expect(WebSocketServer).toHaveBeenCalledWith({ port: 8080 });
    expect(mockServer.on).toHaveBeenCalledWith(
      "listening",
      expect.any(Function)
    );
  });
});

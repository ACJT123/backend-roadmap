const { WebSocket } = require("ws");
const { connect } = require("./client");

jest.mock("ws");

describe("WebSocket Client", () => {
    let mockWebSocketInstance;

    beforeEach(() => {
        mockWebSocketInstance = {
            on: jest.fn(),
            send: jest.fn(),
        };
        WebSocket.mockImplementation(() => mockWebSocketInstance);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test("should create a WebSocket connection and send username", () => {
        const username = "testUser";
        connect(username);

        expect(WebSocket).toHaveBeenCalledWith("ws://localhost:8080");
        expect(mockWebSocketInstance.on).toHaveBeenCalledWith("error", expect.any(Function));
        expect(mockWebSocketInstance.on).toHaveBeenCalledWith("open", expect.any(Function));
        expect(mockWebSocketInstance.on).toHaveBeenCalledWith("message", expect.any(Function));
        expect(mockWebSocketInstance.on).toHaveBeenCalledWith("close", expect.any(Function));

        // Simulate the 'open' event to test sending the username
        const openCallback = mockWebSocketInstance.on.mock.calls.find(call => call[0] === "open")[1];
        openCallback();
        expect(mockWebSocketInstance.send).toHaveBeenCalledWith(username);
    });

    test("should log messages from the server", () => {
        console.log = jest.fn();
        const username = "testUser";
        connect(username);

        // Simulate the 'message' event to test logging
        const messageCallback = mockWebSocketInstance.on.mock.calls.find(call => call[0] === "message")[1];
        const messageData = "Hello from server";
        messageCallback(messageData);
        expect(console.log).toHaveBeenCalledWith(messageData);
    });

    test("should log disconnection message", () => {
        console.log = jest.fn();
        const username = "testUser";
        connect(username);

        // Simulate the 'close' event to test logging
        const closeCallback = mockWebSocketInstance.on.mock.calls.find(call => call[0] === "close")[1];
        closeCallback();
        expect(console.log).toHaveBeenCalledWith(`${username} has disconnected`);
    });
});
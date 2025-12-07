const { expect } = require("chai");
const { io: Client } = require("socket.io-client");
const { Server } = require("socket.io");
const { createServer } = require("http");

describe("Nexus Real-Time Integration", function () {
	// IMPORTANT: Increase timeout for slow Windows network stack
	this.timeout(5000);

	let io, clientSocketA, clientSocketB;
	let httpServer;

	before((done) => {
		// 1. Start Server
		httpServer = createServer();
		io = new Server(httpServer, { cors: { origin: "*" } });

		io.on("connection", (socket) => {
			socket.on("join-room", (room) => socket.join(room));
			socket.on("code-change", (data) =>
				socket.to(data.roomId).emit("code-update", data.code)
			);
		});

		httpServer.listen(() => {
			const port = httpServer.address().port;
			const clientOptions = {
				// Force WebSocket to be faster (skip HTTP polling)
				transports: ["websocket"],
				"force new connection": true,
			};

			clientSocketA = new Client(`http://localhost:${port}`, clientOptions);
			clientSocketB = new Client(`http://localhost:${port}`, clientOptions);

			// Wait for both connections
			let connectedCount = 0;
			const onConnect = () => {
				connectedCount++;
				if (connectedCount === 2) done();
			};

			clientSocketA.on("connect", onConnect);
			clientSocketB.on("connect", onConnect);
		});
	});

	after(() => {
		io.close();
		clientSocketA.close();
		clientSocketB.close();
		httpServer.close();
	});

	it("should allow two users to sync code in the same room", (done) => {
		const roomId = "nexus-test-chamber";
		const payload = { roomId, code: 'console.log("System Online");' };

		// 1. Both join
		clientSocketA.emit("join-room", roomId);
		clientSocketB.emit("join-room", roomId);

		// 2. Setup Listener on B
		clientSocketB.on("code-update", (code) => {
			try {
				expect(code).to.equal(payload.code);
				done();
			} catch (err) {
				done(err);
			}
		});

		// 3. WAIT a bit for the server to process the joins, THEN send
		// Windows/Node can take ~100ms to process socket groups
		setTimeout(() => {
			clientSocketA.emit("code-change", payload);
		}, 300);
	});
});

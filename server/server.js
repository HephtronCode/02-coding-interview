require("dotenv").config();
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const path = require("path");

// Initialize Express app
const app = express();
app.use(cors());

// Wrap Express in a new raw HTTP server (required for Socket.io)
const server = http.createServer(app);

// Initialize Socket.io server with CORS enabled
const io = new Server(server, {
	cors: {
		origin: "*",
		methods: ["GET", "POST"],
	},
});

// Setting up a real-time event loop
io.on("connection", (socket) => {
	console.log(`✨ User connected: ${socket.id}`);

	// User join a specific interview room
	socket.on("join-room", (roomId) => {
		socket.join(roomId);
		console.log(`${socket.id} joined room: [${roomId}]`);
	});

	// When user types or broadcast to the room
	socket.on("code-change", ({ roomId, code }) => {
		// socket.to(roomId) sends everyone a message except the sender
		socket.to(roomId).emit("code-update", code);
	});

	// When user disconnects
	socket.on("disconnect", () => {
		console.log("❌ User disconnected: ${socket.id}");
	});
});

// ---------------------------------------------------------
// 🚀 DEPLOYMENT CONFIG (Serving the React Frontend)
// ---------------------------------------------------------
// Check if we are in production or if the dist folder exists
const __dirname_client = path.resolve(__dirname, "../client/dist");

// Serve static files from the React build folder
app.use(express.static(__dirname_client));

// Handle React Routing: Return index.html for any unknown route
app.get(/.*/, (req, res) => {
	res.sendFile(path.join(__dirname_client, "index.html"));
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
	console.log(`\n🚀 NEXUS SERVER ONLINE on port ${PORT}`);
	console.log(`🔗 Waiting for Neural Links......\n`);
});

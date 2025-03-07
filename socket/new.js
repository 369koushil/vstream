const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");




const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, { cors: { origin: "*" } });

io.on("connection", (socket) => {
    console.log("User connected:", socket.id);
})

const PORT = process.env.WS_PORT || 4000;
httpServer.listen(PORT, () => {
    console.log(`WebSocket server running on ws://localhost:${PORT}`);
});
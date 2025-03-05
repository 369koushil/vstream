const express=require("express")
const { createServer } = require("http");
const { Server } = require("socket.io");
const Redis = require("ioredis");
const { hostname } = require("os");

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, { cors: { origin: "*" } });

const redis = new Redis({
    host: 'localhost',
    port: 6379,
  });
redis.ping().then((res) => console.log("Redis connected:", res));

io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("create_stream", async (streamId) => {
        const exists = await redis.exists(`stream:${streamId}:queue`);
        if (!exists) {
            await redis.zadd(`stream:${streamId}:queue`, 0, JSON.stringify({}));
    
            console.log(`Created new stream queue for: ${streamId}`);
        } else {
            console.log(`Stream ${streamId} already exists`);
        }
    
        io.to(streamId).emit("init_vqueue", []);
    });

    

    socket.on("join room", async (streamId) => {
        socket.join(streamId);
        console.log(`User joined stream: ${streamId}`);

        const queue = await redis.zrevrange(`stream:${streamId}:queue`, 0, -1, "WITHSCORES");
        const parsedQueue = formatQueue(queue);

        io.to(streamId).emit("init_vqueue", parsedQueue);
    });

    socket.on("update_vqueue", async (data) => {
        console.log(data);
       
        if (!data.streamVideos.streamId || !data.streamVideos.id) {
            console.log("Invalid data, missing streamId or id");
            return;
        }

        await redis.zadd(`stream:${data.streamVideos.streamId}:queue`, 0, JSON.stringify(data.streamVideos));
        const updatedQueue = await redis.zrevrange(`stream:${data.streamVideos.streamId}:queue`, 0, -1, "WITHSCORES");
        const parsedUpdatedQueue = formatQueue(updatedQueue);

        io.to(data.streamVideos.streamId).emit("updated_vqueue", parsedUpdatedQueue);
    });

    socket.on("vote", async ({ streamId, videoId, voteType }) => {
        if (!streamId || !videoId || !["upvote", "downvote"].includes(voteType)) return;

        const voteValue = voteType === "upvote" ? 1 : -1;

        const queue = await redis.zrange(`stream:${streamId}:queue`, 0, -1);
        let videoData = queue.find(video => JSON.parse(video).id === videoId);
        if (!videoData) return;

        const currentScore = await redis.zscore(`stream:${streamId}:queue`, videoData);
        const newScore = parseInt(currentScore || "0") + voteValue;
        
        await redis.zadd(`stream:${streamId}:queue`, newScore, videoData);
        
        const updatedQueue = await redis.zrevrange(`stream:${streamId}:queue`, 0, -1, "WITHSCORES");
        const parsedUpdatedQueue = formatQueue(updatedQueue);

        io.to(streamId).emit("updated_vqueue", parsedUpdatedQueue);
    });

    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
    });
});

const PORT = process.env.WS_PORT || 4000;
httpServer.listen(PORT, () => {
    console.log(`WebSocket server running on ws://localhost:${PORT}`);
});

const formatQueue = (queue) => {
    const formatted = [];
    for (let i = 0; i < queue.length; i += 2) {
        const video = JSON.parse(queue[i]);
        const votes = parseInt(queue[i + 1]);
        formatted.push({ ...video, votes });
    }
    return formatted;
};

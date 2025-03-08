const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const Redis = require("ioredis");

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, { cors: { origin: "*" } });

const redis = new Redis({ host: "localhost", port: 6379 });

redis.ping().then((res) => console.log("Redis connected:", res));

const SCORE_MULTIPLIER = 1e9;

io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("create_stream", async (streamId) => {
        const exists = await redis.exists(`stream:${streamId}:queue`);
        if (!exists) {
            await redis.zadd(`stream:${streamId}:queue`, 0, "placeholder");
        }
        io.to(streamId).emit("init_vqueue", []);
    });

    socket.on("video_control", ({ action, streamId }) => {
        io.to(streamId).emit("video_control", action);
    });

    socket.on("join room", async (streamId) => {

        const roomSize = io.sockets.adapter.rooms.get(streamId)?.size || 0;
        await redis.set(`room:${streamId}`,roomSize);
        io.to(streamId).emit("roomMemberCount", roomSize);

        socket.join(streamId);
        try {
            let queue = await redis.zrevrange(`stream:${streamId}:queue`, 0, -1, "WITHSCORES");
            let parsedQueue = formatQueue(queue);
            io.to(streamId).emit("init_vqueue", parsedQueue);
        } catch (error) {
            console.error("Error fetching queue:", error);
        }
    });

    socket.on("update_vqueue", async (data) => {
        try {
            const { streamVideos } = data;
            if (!streamVideos?.streamId || !streamVideos?.id) return;

            let queue = await redis.zrange(`stream:${streamVideos.streamId}:queue`, 0, -1);
            if (queue.includes("placeholder")) {
                await redis.zrem(`stream:${streamVideos.streamId}:queue`, "placeholder");
            }

            const videoExists = queue.some((video) => {
                try {
                    return JSON.parse(video).id === streamVideos.id;
                } catch (e) {
                    return false;
                }
            });

            if (!videoExists) {
                streamVideos.timestamp = Date.now();
                streamVideos.votes = 0;
                let score = (streamVideos.votes * SCORE_MULTIPLIER) - streamVideos.timestamp;
                await redis.zadd(`stream:${streamVideos.streamId}:queue`, score, JSON.stringify(streamVideos));
            }

            const updatedQueue = await redis.zrevrange(`stream:${streamVideos.streamId}:queue`, 0, -1, "WITHSCORES");
            const parsedUpdatedQueue = formatQueue(updatedQueue);
            io.to(streamVideos.streamId).emit("updated_vqueue", parsedUpdatedQueue);
        } catch (error) {
            console.error("Error updating queue:", error);
        }
    });

    socket.on("videoCompleted", async ({ streamId, videoId }) => {
        try {
            let queue = await redis.zrange(`stream:${streamId}:queue`, 0, -1);
            let finishedVideo = queue.find((video) => JSON.parse(video).id === videoId);
            if (!finishedVideo) return;

            await redis.zrem(`stream:${streamId}:queue`, finishedVideo);
            let updatedQueue = await redis.zrevrange(`stream:${streamId}:queue`, 0, -1, "WITHSCORES");
            let parsedUpdatedQueue = formatQueue(updatedQueue);
            io.to(streamId).emit("updated_vqueue", parsedUpdatedQueue);
        } catch (error) {
            console.error("Error handling video completion:", error);
        }
    });

    socket.on("vote", async ({ streamId, videoId, voteType, userId }) => {
        try {
            if (!streamId || !videoId || !userId || !["upvote", "downvote"].includes(voteType)) return;
    
            const userVoteKey = `stream:${streamId}:video:${videoId}:votes`;
            const alreadyVoted = await redis.sismember(userVoteKey, userId);
    
            if (alreadyVoted) {
                socket.emit("vote_error", { message: "You have already voted for this video." });
                return;
            }
    
            // Allow the vote
            await redis.sadd(userVoteKey, userId);
    
            const voteValue = voteType === "upvote" ? 1 : -1;
            const queue = await redis.zrange(`stream:${streamId}:queue`, 0, -1);
    
            let videoData = queue.find((video) => JSON.parse(video).id === videoId);
            if (!videoData) return;
    
            let parsedVideo = JSON.parse(videoData);
            parsedVideo.votes = Math.max((parsedVideo.votes || 0) + voteValue, 0); // Prevent negative votes
    
            let newScore = parsedVideo.timestamp + parsedVideo.votes * 1e14;
    
            await redis.zrem(`stream:${streamId}:queue`, videoData);
            await redis.zadd(`stream:${streamId}:queue`, newScore, JSON.stringify(parsedVideo));
    
            const updatedQueue = await redis.zrevrange(`stream:${streamId}:queue`, 0, -1, "WITHSCORES");
            const parsedUpdatedQueue = formatQueue(updatedQueue);
            io.to(streamId).emit("updated_vqueue", parsedUpdatedQueue);
        } catch (error) {
            console.error("Error processing vote:", error);
        }
    });
    

  
     socket.on("leave_room",async(streamId)=>{
        
        const rooms = Array.from(socket.rooms).filter((room) => room !== socket.id);
    
        for (const streamId of rooms) {
            const roomSize = io.sockets.adapter.rooms.get(streamId)?.size || 0;
            await redis.set(`room:${streamId}`, roomSize);
            io.to(streamId).emit("roomMemberCount", roomSize);
        }
        io.to(streamId).emit("roomMemberCount",3);
     })
    

    socket.on("disconnect", async () => {
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
        if (queue[i] === "placeholder") continue;

        try {
            const video = JSON.parse(queue[i]);
            formatted.push({ ...video, score: parseFloat(queue[i + 1]) });
        } catch (error) {
            console.error("Error parsing queue data:", error);
        }
    }
    return formatted;
};




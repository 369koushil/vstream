const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const Redis = require("ioredis");
require('dotenv').config();
const cors = require('cors')

const app = express();
app.use(express.json())
const httpServer = createServer(app);
const io = new Server(httpServer, { cors: { origin: "*", methods: ["GET", "POST"] } });

app.use(cors({
    origin: process.env.clientURL,
    methods: ["POST"]
}))

const redis = new Redis({
    port: 6379,
    host: "localhost",

});

redis.ping().then((res) => console.log("Redis connected:", res));

const SCORE_MULTIPLIER = 1e9;

app.post("/getRoomInfo", async (req, res) => {
    try {
        const { streamId } = req.body; 
        const exists = await redis.exists(`stream:${streamId}:queue`);

        if (exists === 1) {
            return res.status(201).json({ message: "exist" });
        } else {
            return res.status(201).json({ message: "notexists" });
        }
    } catch (err) {
        console.error(err);
        return res.status(400).json({ message: "error on backend" });
    }
});

io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("create_stream", async (streamId) => {

        console.log("-------------------" + streamId)
        const exists = await redis.exists(`stream:${streamId}:queue`);
        const roomKey = `roomcnt:${streamId}`;

        const roomCntExists = await redis.exists(roomKey);
        if (!roomCntExists) {
            await redis.set(roomKey, 0);
        }

        const updatedCnt = await redis.incr(roomKey);

        io.to(streamId).emit("room_cnt", updatedCnt);


        if (!exists) {
            await redis.zadd(`stream:${streamId}:queue`, 0, "placeholder");
        }
        io.to(streamId).emit("init_vqueue", []);
    });

    socket.on("video_control", ({ action, streamId }) => {
        // console.log(`Host emitting video_control to room ${streamId}: ${action}`);
        io.to(streamId).emit("video_control_user", action);

    });


    socket.on("join room", async ({ streamId, username }) => {
        socket.username = username
        socket.streamId = streamId
        // console.log(streamId)
        // console.log(username)
        console.log(`User ${socket.id} joining room: ${streamId}`);
        socket.join(streamId);
        socket.broadcast.to(streamId).emit("joining_tost_notification", username)
        const rkey = `roomcnt:${streamId}`;
        const rusercnt=await redis.get(rkey)
        io.to(streamId).emit("room_cnt", rusercnt);



        try {
            let queue = await redis.zrevrange(`stream:${streamId}:queue`, 0, -1, "WITHSCORES");
            let parsedQueue = formatQueue(queue);
            io.to(streamId).emit("init_vqueue", parsedQueue);
        } catch (error) {
            console.error("Error fetching queue:", error);
        }
    });


    socket.on("endRoom", async (streamId) => {
        io.to(streamId).emit("roomClosed");
        io.socketsLeave(streamId);
        // console.log(`Room ${streamId} has ended`);

        try {
            await redis.del(`stream:${streamId}:queue`);
            await redis.del(`room:${streamId}`);
            await redis.del(`roomcnt:${streamId}`)
            const voteKeys = await redis.keys(`stream:${streamId}:video:*:votes`);
            if (voteKeys.length > 0) {
                await redis.del(...voteKeys);
            }

            // console.log(`Deleted all data for stream: ${streamId}`);
        } catch (error) {
            // console.error("Error deleting room data:", error);
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
            // console.error("Error updating queue:", error);
        }
    });

    socket.on("videoCompleted", async ({ streamId, videoId }) => {
        try {
            // console.log("-----------------")
            // console.log(streamId)
            // console.log(videoId)
            // console.log("-----------------")
            let queue = await redis.zrange(`stream:${streamId}:queue`, 0, -1);
            let finishedVideo = queue.find((video) => JSON.parse(video).id === videoId);
            if (!finishedVideo) return;

            await redis.zrem(`stream:${streamId}:queue`, finishedVideo);
            let updatedQueue = await redis.zrevrange(`stream:${streamId}:queue`, 0, -1, "WITHSCORES");
            let parsedUpdatedQueue = formatQueue(updatedQueue);
            io.to(streamId).emit("updated_vqueue", parsedUpdatedQueue);
            // console.log("emitting updated queue after completing video")
        } catch (error) {
            // console.error("Error handling video completion:", error);
        }
    });

    socket.on("vote", async ({ streamId, videoId, voteType, userId }) => {
        try {
            // console.log("voting server side");

            if (!streamId || !videoId || !userId || !["upvote", "downvote"].includes(voteType)) {
                // console.log("Invalid vote parameters:", streamId, videoId, userId, voteType);
                return;
            }

            const userVoteKey = `stream:${streamId}:video:${videoId}:votes`;
            const previousVote = await redis.hget(userVoteKey, userId); // Get previous vote type

            if (previousVote === voteType) {
                // console.log("User has already cast this vote");
                socket.emit("vote_error", { message: `You have already ${voteType}d this video.` });
                return;
            }

            // Adjust vote count
            const voteChange =
                // If switching vote, change by 2 (undo + new vote)
                (voteType === "upvote" ? 1 : -1); // If first-time voting, change by 1

            await redis.hset(userVoteKey, userId, voteType); // Store the user's vote

            // Fetch the queue
            const queue = await redis.zrange(`stream:${streamId}:queue`, 0, -1);
            let videoData = queue.find((video) => JSON.parse(video).id === videoId);

            if (!videoData) {
                // console.log("Video data not found");
                return;
            }

            let parsedVideo = JSON.parse(videoData);
            parsedVideo.votes = Math.max((parsedVideo.votes || 0) + voteChange, 0); // Prevent negative votes

            let newScore = parsedVideo.timestamp + parsedVideo.votes * 1e14;

            await redis.zrem(`stream:${streamId}:queue`, videoData);
            await redis.zadd(`stream:${streamId}:queue`, newScore, JSON.stringify(parsedVideo));

            const updatedQueue = await redis.zrevrange(`stream:${streamId}:queue`, 0, -1, "WITHSCORES");
            const parsedUpdatedQueue = formatQueue(updatedQueue);
            io.to(streamId).emit("updated_vqueue", parsedUpdatedQueue);
        } catch (error) {
            // console.error("Error processing vote:", error);
        }
    });








    socket.on("disconnect", async () => {
        // console.log("User disconnected:", socket.id);
        const nstreamId = socket.streamId
        // console.log(`${socket.username} has left`)
        socket.broadcast.emit("user_leaving_room_notification", socket.username)

        const urcnt = await redis.decr(`roomcnt:${nstreamId}`)
        io.to(nstreamId).emit("room_cnt", urcnt)
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

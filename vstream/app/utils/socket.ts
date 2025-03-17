import io from "socket.io-client";
import { VideoItem } from "./Types";
import { type YouTubePlayer } from "react-youtube"
import { toast } from "sonner";


const socket = io(process.env.NEXT_PUBLIC_WS_SERVER!)

export const initSocConn = (streamId: string) => {
    socket.on("connect", () => {
    });
    socket.emit("create_stream", streamId);
};

export const joinRoom = (streamId: string, username: string) => {
    socket.emit("join room", { streamId, username });

};


export const addVideoQueue = (obj: VideoItem) => {
    socket.emit("update_vqueue", obj);
};




export const getInitQueue = (setVideoData: (data: VideoItem[]) => void) => {
    socket.off("init_vqueue");

    socket.on("init_vqueue", (data: VideoItem[]) => {
        if (Array.isArray(data)) {
            // console.log(data)
            setVideoData(data);
        }
    });
};

export const voteVideo = (streamId: string, videoId: string, voteType: "upvote" | "downvote", userId: string) => {
    socket.emit("vote", { streamId, videoId, voteType, userId });
};


export const controlByHost = (action: string, streamId: string) => {
    // console.log("controls by hostn"+action)
    socket.emit("video_control", { action, streamId });
}



export const uVControlsListener = (playerRef: React.RefObject<YouTubePlayer>, isHost: boolean) => {
    // console.log("executing uvcontrollerlisnter fucntion")
    socket.on("video_control_user", (action: string) => {
        //   console.log("lisneing event uvcontol inside")
        if (!isHost && playerRef.current) {
            const currentTime = playerRef.current.getCurrentTime()
            if (action === "play") playerRef.current.playVideo();
            if (action === "pause") playerRef.current.pauseVideo();
            if (action === "stop") playerRef.current.stopVideo();
            if (action === "forward") playerRef.current.seekTo(Math.max(currentTime + 10, 0), true)
            if (action === "backward") playerRef.current.seekTo(Math.max(currentTime - 10, 0), true)
        }
    })
}



export const removeVideoControllers = () => {
    socket.off("video_control")
}


export const videoCompleted = (streamId: string, finishedVideo: VideoItem) => {
    console.log(streamId, finishedVideo)
    socket.emit("videoCompleted", { streamId, videoId: finishedVideo.id });

}



export const endRoom = (streamId: string) => {
    console.log(streamId)
    socket.emit("endRoom", streamId)
}


export const getUpdatedQueue = (
    setVideoQueue: (data: VideoItem[]) => void,
    getCurrentVideo: () => VideoItem | undefined
) => {
    socket.off("updated_vqueue");
    socket.on("updated_vqueue", (data: VideoItem[]) => {
        // console.log("getting video after completing video")
        // console.log(data)
        if (Array.isArray(data)) {
            const currentVideo = getCurrentVideo();
            // console.log("this is current video checkking in socket fcuntion "+currentVideo)

            if (!currentVideo) {
                // console.log("updated queue while not playing video")
                setVideoQueue(data);
                return;
            }

            // console.log("updated queue while playing video")
            setVideoQueue([
                currentVideo,
                ...data.filter((video) => video.id !== currentVideo.id),
            ]);
            // console.log("updated queue while playing video")
        }
    });
};


export const tostNotificationUserJoins = () => {
    console.log("joingin notiifcation by user outside")
    socket.off("joining_tost_notification")
    socket.on("joining_tost_notification", (data: string) => {
        console.log("joingin notiifcation by user")
        toast.info(`${data} has joined the room!`, {
            style: {
                background: "#1E3A8A",
                color: "#E0F2FE",
                borderLeft: "5px solid #93C5FD",
            }
        })
    })
}



export const cleanUpSockets = () => {
    socket.disconnect();
    socket.off("updated_vqueue")
    socket.off("video_control_user")
    socket.off("init_vqueue")
    socket.off("roomClosed")
    socket.off("joining_tost_notification")
    socket.off("user_leaving_room_notification")
    socket.off("room_cnt")
}

export const roomEndListner = () => {
    socket.on("roomClosed", () => {
        window.location.replace('/dashboard');
        toast.info("Room ended by host", {
            style: {
                background: "#1E3A8A",
                color: "#E0F2FE",
                borderLeft: "5px solid #93C5FD",
            }
        })
    })
}


export const userLeftToastNotification = () => {
    socket.off("user_leaving_room_notification")
    socket.on("user_leaving_room_notification", (username: string) => {
        console.log(`${username} has left`)
        toast.warning(`${username} has left the room`, {
            style: {
                background: "#a0a036",
                color: "#000000",
                borderLeft: "5px solid #e5e507"
            }
        })
    })
}

export const roomcnt = (setTotalUser: (data: number) => void) => {
    console.log("room cnt outside")
    socket.off("room_cnt")
    socket.on("room_cnt", (roomcnt: number) => {
        setTotalUser(roomcnt)
        console.log("room cnt inside")
        console.log(`room cnt ${roomcnt}`)
    })
}
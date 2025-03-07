import io from "socket.io-client";

export const socket = io("http://localhost:4000");

export const initSocConn = (streamId: string) => {
    socket.on("connect", () => {
        console.log("Connected with ID:", socket.id);
    });
    socket.emit("create_stream", streamId);
};

export const joinRoom = (roomId: string) => {
    socket.emit("join room", roomId);
};

export const addVideoQueue = (obj: any) => {
    socket.emit("update_vqueue", obj);
};



export const leaveRoom = () => {
    socket.off("updated_vqueue");
    socket.off("init_vqueue");
};

// export const getUpdatedQueue = (setVideoData: (data: any) => void) => {
//     socket.off("updated_vqueue"); // ✅ Prevent duplicate listeners
//     socket.on("updated_vqueue", (data: any) => {
//         if (Array.isArray(data)) {
//             console.log(data)
//             setVideoData(data);
//         }
//     });
// };



export const getInitQueue = (setVideoData: (data: any) => void) => {
    socket.off("init_vqueue"); // ✅ Prevent duplicate listeners
    socket.on("init_vqueue", (data: any) => {
        if (Array.isArray(data)) {
            console.log(data)
            setVideoData(data);
        }
    });
};

export const voteVideo = (streamId: string, videoId: string, voteType: "upvote" | "downvote") => {
    socket.emit("vote", { streamId, videoId, voteType });
};


export const controlByHost=(action:any,streamId:any)=>{
    socket.emit("video_control", { action, streamId });
}

export const removeVideoControllers=()=>{
    socket.off("video_control")
}

export const uVControlsListner=(playerRef:React.RefObject<any>,isHost:boolean)=>{
  socket.on("video_control", (action:string) => {
              if (!isHost && playerRef.current) {
                  if (action === "play") playerRef.current.playVideo();
                  if (action === "pause") playerRef.current.pauseVideo();
                  if (action === "stop") playerRef.current.stopVideo();
              }
          })
}


export const videoCompleted=(streamId:string,finishedVideo:any)=>{
    socket.emit("videoCompleted", { streamId, videoId: finishedVideo.id });

}

// export const getUpdatedQueue2= (
//     setVideoData: (data:any) => void, 
//     currentVideoId: string | null
// ) => {
//     socket.off("updated_vqueue");
//     socket.on("updated_vqueue", (data:any) => {
//         if (Array.isArray(data)) {
//             setVideoData((prevData: any) => {
//                 if (!currentVideoId) return data; // If no video is playing, update normally

//                 const currentVideo = prevData.find((video:any) => video.id === currentVideoId);
//                 if (!currentVideo) return data; // If current video is missing, update normally
                
//                 return [
//                     currentVideo, // Keep the currently playing video unchanged
//                     ...data.filter(video => video.id !== currentVideoId) // Update the rest of the queue
//                 ];
//             });
//         }
//     });
// };


export const getUpdatedQueue= (setVideoQueue: any, getCurrentVideo: () =>any) => {
    socket.off("updated_vqueue");
    socket.on("updated_vqueue", (data: any) => {
        if (Array.isArray(data)) {
            setVideoQueue((prevQueue: any) => {
                const currentVideo = getCurrentVideo();
                if (!currentVideo) return data; // If no video is playing, update normally
                
                return [
                    currentVideo,
                    ...data.filter(video => video.id !== currentVideo.id)
                ];
            });
        }
    });
};



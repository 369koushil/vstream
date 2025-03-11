import io from "socket.io-client";
import { VideoItem } from "./Types";
import  { type YouTubePlayer } from "react-youtube"
import { toast } from "sonner";



export const socket = io("http://localhost:4000");

export const initSocConn = (streamId: string) => {
    socket.on("connect", () => {
        // console.log("Connected with ID:", socket.id);
    });
    socket.emit("create_stream", streamId);
};

export const joinRoom = (streamId: string,username:String)=>{
    socket.emit("join room", {streamId,username});

};


export const addVideoQueue = (obj: VideoItem) => {
    socket.emit("update_vqueue", obj);
};




export const getInitQueue = (setVideoData: (data:VideoItem[]) => void) => {
    socket.off("init_vqueue"); 
    
    socket.on("init_vqueue", (data: VideoItem[]) => {
        if (Array.isArray(data)) {
            // console.log(data)
            setVideoData(data);
        }
    });
};

export const voteVideo = (streamId: string, videoId: string, voteType: "upvote" | "downvote",userId:string) => {
    socket.emit("vote", { streamId, videoId, voteType ,userId});
};


export const controlByHost=(action:string,streamId:string)=>{
    // console.log("controls by hostn"+action)
    socket.emit("video_control", { action, streamId });
}


export const uVControlsListener=(playerRef:React.RefObject<YouTubePlayer>,isHost:boolean)=>{
    // console.log("executing uvcontrollerlisnter fucntion")
    socket.on("video_control_user", (action:string) => {
        //   console.log("lisneing event uvcontol inside")
                if (!isHost && playerRef.current) {
                    if (action === "play") playerRef.current.playVideo();
                    if (action === "pause") playerRef.current.pauseVideo();
                    if (action === "stop") playerRef.current.stopVideo();
                }
            })
  }
  


  export const removeVideoControllers=()=>{
    socket.off("video_control")
}


export const videoCompleted=(streamId:string,finishedVideo:VideoItem)=>{
    socket.emit("videoCompleted", { streamId, videoId: finishedVideo.id });

}



export const endRoom=(streamId:string)=>{
    socket.emit("endRoom",streamId)
}


export const getUpdatedQueue = (
    setVideoQueue: (data: VideoItem[]) => void,
    getCurrentVideo: () => VideoItem|undefined
  ) => {
    socket.off("updated_vqueue");
    socket.on("updated_vqueue", (data: VideoItem[]) => {
      if (Array.isArray(data)) {
        const currentVideo = getCurrentVideo();
        
        if (!currentVideo) {
          setVideoQueue(data);
          return;
        }
  
        setVideoQueue([
          currentVideo,
          ...data.filter((video) => video.id !== currentVideo.id),
        ]);
      }
    });
  };
  



export const cleanUpSockets=()=>{
    socket.off("updated_vqueue")
    socket.off("video_control_user")
    socket.off("init_vqueue")
}

export const endRoomByHost=(streamId:string)=>{
    socket.emit("end-room",streamId)
}
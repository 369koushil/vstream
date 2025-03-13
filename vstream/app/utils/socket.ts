import io from "socket.io-client";
import { VideoItem } from "./Types";
import  { type YouTubePlayer } from "react-youtube"
import { toast } from "sonner";


const socket= io("wss://api.koushil.xyz")

export const initSocConn = (streamId: string) => {
    socket.on("connect", () => {
    });
    socket.emit("create_stream", streamId);
};

export const joinRoom = (streamId: string,username:string)=>{
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
    console.log(streamId,finishedVideo)
    socket.emit("videoCompleted", { streamId, videoId: finishedVideo.id });

}



export const endRoom=(streamId:string)=>{
    console.log(streamId)
    socket.emit("endRoom",streamId)
}


export const getUpdatedQueue = (
    setVideoQueue: (data: VideoItem[]) => void,
    getCurrentVideo: () => VideoItem|undefined
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
  



export const cleanUpSockets=()=>{
    socket.off("updated_vqueue")
    socket.off("video_control_user")
    socket.off("init_vqueue")
    socket.off("roomClosed")
    socket.off("")
}

export const roomEndListner=()=>{
    socket.on("roomClosed",()=>{
        window.location.replace('/dashboard'); 
        toast.message("Room ended by host",{
            style:{
                backgroundColor: "#ffffff",
                    color: "#000000"
            }
        })
    })
}
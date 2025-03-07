"use client";

import VideoQueue from "@/app/components/VideoQueue";
import { addVideoQueue, joinRoom, getUpdatedQueue, getInitQueue, leaveRoom,videoCompleted } from "@/app/utils/socket";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import CustomYouTubePlayer from "@/app/components/VideoPlayer";
import YouTube from "react-youtube";

const PlayerState = YouTube.PlayerState;


interface VideoItem {
    id: string;
    title: string;
    smg: string; 
    big: string;
    extractId: string;
    streamId: string;
    hostId: string;
    votes: number;
}

const Page = () => {
    const params = useParams();
    const session = useSession();
    const [url, setUrl] = useState("");
    const [videoData, setVideoData] = useState<VideoItem[]>([]);
    const [isHost,setHost]=useState<boolean>(false);
    const [currentVData,setCurrentVData]=useState<VideoItem>();

   
    useEffect(() => {
        if (!currentVData && videoData.length > 0) {
            setCurrentVData(videoData[0]);
        }
    }, [videoData]); 
    

    useEffect(() => {
        getUpdatedQueue(setVideoData, () => currentVData);
    }, [currentVData]);

    
    useEffect(() => {

        if (!params.id) return;
       
        joinRoom(params.id as string);
        getInitQueue(setVideoData);  
        getUpdatedQueue(setVideoData,getCurrentVideo);

        return () => {
            leaveRoom(); 
        };
    }, [params.id]);

 
    

   useEffect(()=>{
        console.log("-----------------------------------")
             console.log(session.data?.user.hostId)
             console.log("-----------------------------------")
               if(session.data?.user.hostId==session.data?.user.id)setHost(true)
                console.log(isHost)
    
   },[session])


   const getCurrentVideo = () => currentVData;
    const handleAddVid = async () => {
        if (!url.trim()) return;
        try {
            const res = await axios.post("/api/streams/videos", {
                url,
                streamId: params.id,
            });

            addVideoQueue(res.data); 
            setUrl("");
        } catch (error) {
            console.error("Error adding video:", error);
        }
    };

    const handleVideoEnd = () => {
        if (!currentVData || videoData.length === 0) return;
    
        const finishedVideo = currentVData;
    
        // Notify backend that video is completed
        videoCompleted(params.id as string, finishedVideo);
    
        // Find the next video in the queue
        const updatedQueue = videoData.filter(video => video.id !== finishedVideo.id);
        
        if (updatedQueue.length > 0) {
            setCurrentVData(updatedQueue[0]); // Set the next highest voted video
             // Remove played video from the queue
        } else {
            setCurrentVData(undefined); // No more videos left
        }
    };
    


      const handleVideoStateChange = (event: { data: number }) => {
        if (event.data === PlayerState.PLAYING) {
            if (!currentVData || currentVData.id !== videoData[0]?.id) {
                setCurrentVData(videoData[0]);
            }
        }
    };
    

    
    

    return (
        <div className="w-screen h-screen">
            <div className="w-full h-20 border-white border-2 flex items-center gap-2 p-2">
                <input 
                    className="flex-1 h-8 px-2 border rounded"
                    type="text"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="Paste link here"
                />
                <button className="bg-red-300 px-4 py-2 rounded" onClick={handleAddVid}>
                    Add
                </button>
            </div>

            <div className="w-full h-96 border-2 border-white">
            <CustomYouTubePlayer  onStateChange={handleVideoStateChange} onVideoEnd={handleVideoEnd} isHost={isHost} videoId={currentVData?.extractId||"Yu9uMO3URo8"} streamId={session.data?.user.streamId as string} />
            </div>
            <div>
                <VideoQueue videoData={videoData} />
            </div>
        </div>
    );
};

export default Page;

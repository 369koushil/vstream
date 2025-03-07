import React, { useRef, useEffect } from "react";
import YouTube, { YouTubePlayer } from "react-youtube";
import { controlByHost ,removeVideoControllers,uVControlsListner} from "../utils/socket";

interface PlayerProps {
    videoId: string;
    isHost: boolean;
    streamId: string;
    onVideoEnd:()=>void
    onStateChange: (event: { data: number }) => void
}

const CustomYouTubePlayer: React.FC<PlayerProps> = ({onStateChange,onVideoEnd,videoId, isHost, streamId }) => {
    const playerRef = useRef<YouTubePlayer | null>(null);
    
    useEffect(() => {
      uVControlsListner(playerRef,isHost)
        return () => {
          removeVideoControllers()
        };
    }, [isHost, streamId]);

    const onReady = (event: { target: YouTubePlayer }) => {
        playerRef.current = event.target;
    };

    
    const playVideo = () => {
        if (isHost && playerRef.current) {
            playerRef.current.playVideo();
            controlByHost("play",streamId)
        }
    };

    const pauseVideo = () => {
        if (isHost && playerRef.current) {
            playerRef.current.pauseVideo();
            controlByHost("pause",streamId)
        }
    };

    const stopVideo = () => {
        if (isHost && playerRef.current) {
            playerRef.current.stopVideo();
            controlByHost("stop",streamId)
        }
    };

    
    

    return (
        <div className="flex flex-col items-center">
            <YouTube onStateChange={onStateChange} onEnd={onVideoEnd} videoId={videoId} opts={{ playerVars: {  controls: 0 } }} onReady={onReady} />

            {isHost && (
                <div className="mt-4 space-x-4">
                    <button className="px-4 py-2 bg-blue-500 text-white rounded-lg" onClick={playVideo}>
                        Play
                    </button>
                    <button className="px-4 py-2 bg-yellow-500 text-white rounded-lg" onClick={pauseVideo}>
                        Pause
                    </button>
                    <button className="px-4 py-2 bg-red-500 text-white rounded-lg" onClick={stopVideo}>
                        Stop
                    </button>
                </div>
            )}
        </div>
    );
};

export default CustomYouTubePlayer;

import type React from "react"
import { useRef, useEffect } from "react"
import YouTube, { type YouTubePlayer } from "react-youtube"
import { Play, Pause, Square, FastForward, Rewind } from "lucide-react"
import { Button } from "@/components/ui/button"
import { controlByHost, removeVideoControllers, uVControlsListener } from "../utils/socket"
import { PlayerProps } from "../utils/Types"

const CustomYouTubePlayer: React.FC<PlayerProps> = ({ onStateChange, onVideoEnd, videoId, isHost, streamId, setIsPlaying ,isPlaying}) => {
  const playerRef = useRef<YouTubePlayer | null>(null)

  useEffect(() => {
    uVControlsListener(playerRef, isHost)
    return () => {
      removeVideoControllers()
    }
  }, [isHost, streamId])

  const onReady = (event: { target: YouTubePlayer }) => {
    playerRef.current = event.target
  }

  const playVideo = () => {
    if (isHost && playerRef.current) {
      playerRef.current.playVideo()
      controlByHost("play", streamId)
      setIsPlaying(true)
    }
  }

  const pauseVideo = () => {
    if (isHost && playerRef.current) {
      playerRef.current.pauseVideo()
      controlByHost("pause", streamId)
      setIsPlaying(false)
    }
  }

  const stopVideo = () => {
    if (isHost && playerRef.current) {
      playerRef.current.stopVideo()
      controlByHost("stop", streamId)
      setIsPlaying(false)
    }
  }

  const forward10Seconds = () => {
    if (isHost && playerRef.current) {
      const currentTime = playerRef.current.getCurrentTime()
      playerRef.current.seekTo(currentTime + 10, true) // Move forward by 10s
      controlByHost("forward", streamId)
    }
  }

  const backward10Seconds = () => {
    if (isHost && playerRef.current) {
      const currentTime = playerRef.current.getCurrentTime()
      playerRef.current.seekTo(Math.max(currentTime - 10, 0), true) // Move backward by 10s
      controlByHost("backward", streamId)
    }
  }

  return (
    <div className="flex flex-col w-full max-w-4xl mx-auto bg-[#09090b] border border-purple-500/20 dark:border-purple-500/20 shadow-lg overflow-hidden select-none">
      <div className="relative">
        <div className="relative aspect-video w-full bg-black overflow-hidden flex items-center justify-center">
          {videoId ? (
            <>
              <YouTube
                onStateChange={onStateChange}
                onEnd={onVideoEnd}
                videoId={videoId}
                opts={{
                  playerVars: { controls: 0 },
                  width: "100%",
                  height: "100%",
                }}
                onReady={onReady}
                className="w-full h-full pointer-events-none"
              />
              <div className="absolute inset-0 w-full h-full"></div>
            </>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground bg-gradient-to-r from-blue-400/40 to-purple-500/30">
              <div className="text-center p-6">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-purple-500/10 flex items-center justify-center">
                  <Play className="h-8 w-8 text-purple-400" />
                </div>
                <h3 className="text-lg font-medium mb-2">No video playing</h3>
                <p className="text-sm text-muted-foreground max-w-md">
                  Add YouTube videos to the queue and vote for your favorites. The highest voted video will play next.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
      {isHost && (
        <div className="p-4 bg-[#101423] border-t border-[#2a3a56] rounded-b-xl">
          <div className="flex items-center justify-center gap-4">
          <Button
              onClick={backward10Seconds}
              className="px-6 py-2 bg-gray-600 hover:bg-gray-700 rounded-2xl text-white shadow-md transition-all duration-300 flex items-center gap-2"
            >
              <Rewind className="h-4 w-4 text-gray-300" />
            </Button>

            {
              isPlaying?
              <Button
              onClick={pauseVideo}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-2xl text-white shadow-md transition-all duration-300 flex items-center gap-2"
            >
              <Pause className="h-4 w-4 text-blue-300" />
            
            </Button>:
            <Button
            onClick={playVideo}
            className="px-6 py-2 bg-purple-600 rounded-2xl hover:bg-purple-700 text-white shadow-md transition-all duration-300 flex items-center gap-2"
          >
            <Play className="h-4 w-4 text-purple-300" />
           
          </Button>

            }
            

           

            {/* <Button
              onClick={stopVideo}
              className="px-6 py-2 bg-red-600 hover:bg-red-700 rounded-2xl text-white shadow-md transition-all duration-300 flex items-center gap-2"
            >
              <Square className="h-4 w-4 text-red-300" />
            </Button> */}

            <Button
              onClick={forward10Seconds}
              className="px-6 py-2 bg-gray-600 hover:bg-gray-700 rounded-2xl text-white shadow-md transition-all duration-300 flex items-center gap-2"
            >
              <FastForward className="h-4 w-4 text-gray-300" />
            </Button>
          </div>

          <div className="mt-4 text-center text-sm text-blue-300">
            <span className="bg-[#2a3a56] px-3 py-1 rounded-full">
              You are the host - You have full control of this stream
            </span>
          </div>
        </div>
      )}
    </div>
  )
}

export default CustomYouTubePlayer

"use client"

import type React from "react"
import { useRef, useEffect } from "react"
import YouTube, { type YouTubePlayer } from "react-youtube"
import { Play, Pause, Square } from "lucide-react"
import { Button } from "@/components/ui/button"
import { controlByHost, removeVideoControllers, uVControlsListner } from "../utils/socket"
import { PlayerProps } from "../utils/Types"

const CustomYouTubePlayer: React.FC<PlayerProps> = ({ onStateChange, onVideoEnd, videoId, isHost, streamId }) => {
  const playerRef = useRef<YouTubePlayer | null>(null)

  useEffect(() => {
    uVControlsListner(playerRef, isHost)
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
    }
  }

  const pauseVideo = () => {
    if (isHost && playerRef.current) {
      playerRef.current.pauseVideo()
      controlByHost("pause", streamId)
    }
  }

  const stopVideo = () => {
    if (isHost && playerRef.current) {
      playerRef.current.stopVideo()
      controlByHost("stop", streamId)
    }
  }

  return (
    <div className="flex flex-col w-full max-w-4xl mx-auto bg-[#09090b] border border-purple-500/20 dark:border-purple-500/20 shadow-lg overflow-hidden select-none">
      <div className="relative">
        <div className="aspect-video w-full bg-black overflow-hidden flex items-center justify-center">
          {videoId ? (
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
              className="w-full h-full"
            />
          ) : (
            <div className="text-center text-gray-400 p-8">
              <p className="text-lg font-semibold">No video playing</p>
              <p className="text-sm">
                Add YouTube videos to the queue and vote for your favorites. The highest voted video will play next.
              </p>
            </div>
          )}
        </div>
      </div>
      {isHost && (
        <div className="p-4 bg-[#101423] border-t border-[#2a3a56] rounded-b-xl">
          <div className="flex items-center justify-center gap-4">
            <Button
              onClick={playVideo}
              className="px-6 py-2 bg-purple-600 rounded-2xl hover:bg-purple-700 text-white shadow-md transition-all duration-300 flex items-center gap-2"
            >
              <Play className="h-4 w-4  text-purple-300" />
              Play
            </Button>

            <Button
              onClick={pauseVideo}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-2xl text-white  shadow-md transition-all duration-300 flex items-center gap-2"
            >
              <Pause className="h-4 w-4 text-blue-300" />
              Pause
            </Button>

            <Button
              onClick={stopVideo}
              className="px-6 py-2 bg-red-600 hover:bg-red-700 rounded-2xl text-white shadow-md transition-all duration-300 flex items-center gap-2"
            >
              <Square className="h-4 w-4 text-red-300" />
              Stop
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

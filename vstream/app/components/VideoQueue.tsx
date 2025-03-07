"use client"

import Image from "next/image"
import { ThumbsUp, ThumbsDown, Play } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { voteVideo } from "../utils/socket"

interface VideoItem {
  id: string
  title: string
  smg: string
  big: string
  extractId: string
  streamId: string
  hostId: string
  votes: number
}

export default function VideoQueue({ videoData }: { videoData: VideoItem[] }) {
  const handleUpvote = (streamId: string, id: string) => {
    voteVideo(streamId, id, "upvote")
  }

  return (
    <div className="w-full max-w-3xl mx-auto p-4 bg-[#15233f] text-white rounded-xl shadow-xl">
      <h2 className="text-2xl font-bold mb-4 text-white flex items-center gap-2">
        <span className="bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent">Video Queue</span>
        <Badge variant="outline" className="ml-2 bg-[#1e2e4f] text-blue-300 border-blue-500">
          {videoData.length} videos
        </Badge>
      </h2>

      <ScrollArea className="h-[600px] rounded-lg border border-[#2a3a56] bg-[#1a2a47] shadow-inner">
        <div className="p-4 space-y-4">
          {videoData.map((video) => (
            <Card
              key={video.id}
              className="flex overflow-hidden bg-[#1e2e4f] hover:bg-[#263452] transition-all duration-300 border-0 shadow-md hover:shadow-lg rounded-lg"
            >
              <div className="relative w-40 h-24 flex-shrink-0">
                <Image
                  src={video.smg || "/placeholder.svg?height=90&width=160"}
                  alt={video.title || "Video thumbnail"}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-[#15233f]/80 duration-300">
                  <div className="bg-blue-500 rounded-full p-2 transform hover:scale-110 transition-transform">
                    <Play className="w-6 h-6 text-white fill-white" />
                  </div>
                </div>
              </div>

              <div className="flex flex-col justify-between p-4 flex-1">
                <div>
                  <h3 className="font-medium line-clamp-2 text-blue-100">{video.title}</h3>
                  <Badge variant="outline" className="mt-2 text-xs bg-[#2a3a56] text-blue-300 border-blue-700/50">
                    Added by {"kkr"}
                  </Badge>
                </div>

                <div className="flex items-center gap-4 mt-3">
                  <div className="flex items-center">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-full hover:bg-blue-500/20 text-blue-300 hover:text-blue-100 transition-colors"
                      onClick={() => handleUpvote(video.streamId, video.id)}
                    >
                      <ThumbsUp className="h-4 w-4" />
                    </Button>
                    <span className="text-sm font-medium text-blue-200">{video.votes}</span>
                  </div>

                  <div className="flex items-center">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-full hover:bg-red-500/20 text-red-300 hover:text-red-100 transition-colors"
                    >
                      <ThumbsDown className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}


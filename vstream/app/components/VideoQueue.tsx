"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { ThumbsUp, ThumbsDown, Play } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { voteVideo } from "../utils/socket"
import { VideoItem } from "../utils/Types"

export default function VideoQueue({ videoData }: { videoData: VideoItem[] }) {
  const [prevVideoData, setPrevVideoData] = useState<VideoItem[]>([])
  const [highlightedId, setHighlightedId] = useState<string | null>(null)

  useEffect(() => {
    if (prevVideoData.length > 0) {
      videoData.forEach((video) => {
        const prevVideo = prevVideoData.find((v) => v.id === video.id)
        if (prevVideo && prevVideo.votes < video.votes) {
          setHighlightedId(video.id)
          setTimeout(() => setHighlightedId(null), 2000)
        }
      })
    }
    setPrevVideoData(videoData)
  }, [videoData])

  const handleVote = (streamId: string, id: string, type: "upvote" | "downvote") => {
    voteVideo(streamId, id, type)
  }

  return (
    <Card className="h-full bg-[#09090b] border-purple-500/20 dark:border-purple-500/20 overflow-hidden relative">
  <CardHeader className="absolute top-0 pt-2 left-0 w-full h-16 bg-[#101423] rounded-t-lg flex items-center px-4">
    <CardTitle className="flex justify-between items-center text-lg w-full">
      Queue{" "}
      <Badge variant="secondary" className="bg-purple-500/20 text-foreground">
        {videoData.length} videos
      </Badge>
    </CardTitle>
  </CardHeader>
  <CardContent className="p-3 pt-20">
    {/* Added 'pt-20' to push content below the header */}
    <ScrollArea className="h-[calc(100vh-100px)]">
      <div className="space-y-3">
        {videoData.length > 0 ? (
          videoData.map((video) => (
            <div
              key={video.id}
              className="flex gap-3 p-3 rounded-lg border border-purple-500/10 bg-[#09090b] hover:bg-accent/5 transition-colors"
            >
              <div className="relative flex-shrink-0 w-24 h-16 rounded overflow-hidden">
                <Image
                  src={video.smg || "/placeholder.svg"}
                  alt={video.title || "Video thumbnail"}
                  fill
                  className="object-cover"
                />
                <Button
                  size="icon"
                  variant="secondary"
                  className="absolute inset-0 m-auto opacity-0 hover:opacity-100 bg-purple-600/80 hover:bg-purple-700/90 transition-opacity"
                >
                  <Play className="h-4 w-4" />
                  <span className="sr-only">Play now</span>
                </Button>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-sm line-clamp-2">{video.title}</h3>
                <p className="text-xs text-muted-foreground mt-1">Added by {video.addedBy}</p>
              </div>
              <div className="flex flex-col items-center justify-center gap-1">
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 text-purple-400 hover:text-purple-300 hover:bg-purple-500/10"
                  onClick={() => handleVote(video.streamId, video.id, "upvote")}
                >
                  <ThumbsUp className="h-4 w-4" />
                  <span className="sr-only">Upvote</span>
                </Button>
                <span className="text-sm font-medium">{video.votes}</span>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
                  onClick={() => handleVote(video.streamId, video.id, "downvote")}
                >
                  <ThumbsDown className="h-4 w-4" />
                  <span className="sr-only">Downvote</span>
                </Button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-muted-foreground">No videos in queue. Add some!</div>
        )}
      </div>
    </ScrollArea>
  </CardContent>
</Card>


  )
}
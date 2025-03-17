"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import axios, { AxiosResponse } from "axios"
import { useSession } from "next-auth/react"
import { Music, Plus, Users, ArrowRight, Radio, Sparkles, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"


const Page = () => {
  const router = useRouter()
  const { data, update } = useSession()
  const [streamId, setStreamId] = useState("")
  const [isCreating, setIsCreating] = useState(false)
  const [isJoining, setIsJoining] = useState(false)

  useEffect(() => {
    // console.log(data?.user.id)
  }, [data])

  const handleCreateServer = async () => {
    setIsCreating(true)
    try {
      const res = await axios.post("/api/streams", {
        title: "hello wrold hello",
      })
      // console.log(res.data)
      // console.log(res.data.newStream.id)
      // console.log(res.data.newStream.hostId)
      await update({
        streamId: res.data.newStream.id,
        hostId: res.data.newStream.hostId,
      }).then(() => {
        console.log("updated seesion")
      })

      router.push(`/room/${res.data.newStream.id}_${data?.user.name?.split(" ")[0]}`)
    } catch (error) {
      console.error("Error creating room:", error)
      setIsCreating(false)
    }
  }

  const handleJoinRoom = async () => {
    if (streamId == "") {
      toast.warning("Enter valid RoomID")
      return
    }

    setIsJoining(true)
    try {
      await update({
        streamId,
        hostId: null,
      })

      axios.post(process.env.NEXT_API_BACKEND_URL!, {
        streamId
      }).then((res: AxiosResponse<any, any>) => {
        if (res.data.message === "exist") {
          router.push(`/room/${streamId}`)
        }
        if (res.data.message === "notexists") {
          toast.error("Room not exists, please enter valid RoomID", {
            style: {
              background: "#8f0505",
              color: "white",
              borderLeft: "solid 8px #610404"
            }
          })
          setIsJoining(false)
        }
      })

    } catch (error) {
      console.error("Error joining room:", error)
      setIsJoining(false)
    }
  }

  // Loading screens
  const CreatingRoomLoader = () => (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm rounded-2xl z-10">
      <div className="flex flex-col items-center space-y-4">
        <div className="relative">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center animate-pulse">
            <Radio className="w-8 h-8 text-white" />
          </div>

        </div>
        <div className="text-center">
          <h3 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
            Creating Your Room
          </h3>
          <p className="text-gray-400 text-sm mt-2">Setting up your virtual space...</p>
        </div>
      </div>

      <div className="mt-8 w-48">
        <div className="h-1.5 w-full bg-purple-900/50 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-purple-500 to-pink-600 rounded-full animate-progress"></div>
        </div>
      </div>
    </div>
  )

  const JoiningRoomLoader = () => (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm rounded-2xl z-10">
      <div className="flex flex-col items-center space-y-4">
        <div className="relative">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center animate-pulse">
            <Users className="w-8 h-8 text-white" />
          </div>
          <div className="absolute -bottom-1 -right-1">

          </div>
        </div>
        <div className="text-center">
          <h3 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
            Joining Room
          </h3>
          <p className="text-gray-400 text-sm mt-2">Connecting to the stream...</p>
        </div>
      </div>

      <div className="mt-8 w-48">
        <div className="h-1.5 w-full bg-purple-900/50 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-purple-500 to-pink-600 rounded-full animate-progress"></div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#09090b] flex items-center justify-center p-4">
      <div className="w-full max-w-3xl opacity-0 translate-y-5 animate-fade-in-up">
        <Card className="bg-purple-500/10 backdrop-blur-md border-purple-500/20 shadow-xl rounded-2xl shadow-purple-500/10 select-none relative">
          {isCreating && <CreatingRoomLoader />}
          {isJoining && <JoiningRoomLoader />}

          <CardHeader className="text-center pb-2">
            <div className="mx-auto mb-2 scale-90 animate-scale-in">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center mx-auto">
                <Radio className="w-8 h-8 text-white" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
              VStream Dashboard
            </CardTitle>
            <CardDescription className="text-gray-400">Create a new room or join an existing one</CardDescription>
          </CardHeader>

          <CardContent className="pt-6">
            <Tabs defaultValue="create" className="w-full">
              <TabsList className="grid grid-cols-2 rounded-2xl mb-8">
                <TabsTrigger value="create" className="rounded-2xl data-[state=active]:bg-purple-600">
                  <Plus className="w-4 h-4 mr-2" /> Create room
                </TabsTrigger>
                <TabsTrigger value="join" className="rounded-2xl data-[state=active]:bg-purple-600">
                  <Users className="w-4 h-4 mr-2" /> Join room
                </TabsTrigger>
              </TabsList>

              <TabsContent value="create" className="space-y-4 ">
                <div className="space-y-4">
                  <div className="bg-purple-500/10 rounded-2xl p-4 border border-purple-500/20">
                    <div className="flex items-center mb-3">
                      <Music className="w-5 h-5 text-purple-500 mr-2" />
                      <h3 className="text-lg font-medium text-white">Create Your Room</h3>
                    </div>
                    <p className="text-sm text-gray-400 mb-4">
                      Start a new room and invite friends to join. You&apos;ll be the host with full control.
                    </p>

                    <div className="transition-transform hover:scale-[1.02] active:scale-[0.98]">
                      <Button
                        onClick={handleCreateServer}
                        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-2xl text-white border-0"
                        disabled={isCreating}
                      >
                        {isCreating ? (
                          <>
                            Creating...
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-4 h-4 mr-2" />
                            Create New Room
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="join" className="space-y-4 ">
                <div className="space-y-4">
                  <div className="bg-purple-500/10 rounded-2xl p-4 border border-purple-500/20">
                    <div className="flex items-center mb-3">
                      <Music className="w-5 h-5 text-purple-500 mr-2" />
                      <h3 className="text-lg font-medium text-white">Join Existing Room</h3>
                    </div>
                    <p className="text-sm text-gray-400 mb-4">
                      Enter a room ID to join an existing room and enjoy music with friends.
                    </p>
                    <div className="flex gap-2">
                      <Input
                        type="text"
                        placeholder="Enter stream ID"
                        className="flex-1 bg-black/30 border-purple-500/30 focus-visible:ring-purple-500/50 text-white"
                        onChange={(e) => setStreamId(e.target.value)}
                        disabled={isJoining}
                      />
                      <div className="transition-transform hover:scale-105 active:scale-95">
                        <Button
                          onClick={handleJoinRoom}
                          className="bg-purple-600 hover:bg-purple-700 rounded-xl text-white"
                          disabled={isJoining}
                        >
                          {isJoining ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <ArrowRight className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Page


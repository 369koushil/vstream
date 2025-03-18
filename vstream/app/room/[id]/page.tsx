"use client";

import VideoQueue from "@/app/components/VideoQueue";
import { addVideoQueue, initSocConn, joinRoom, roomEndListner, tostNotificationUserJoins, endRoom, cleanUpSockets, getUpdatedQueue, getInitQueue, videoCompleted, userLeftToastNotification, roomcnt } from "@/app/utils/socket";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import CustomYouTubePlayer from "@/app/components/VideoPlayer";
import YouTube from "react-youtube";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Youtube, Users, Crown, Link, LogOutIcon, LoaderCircle } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { VideoItem } from "@/app/utils/Types";
import { toast } from "sonner"


const PlayerState = YouTube.PlayerState;



const Page = () => {
    const params = useParams();
    const session = useSession();
    const router = useRouter();
    const [totalUser, setTotalUser] = useState<number>(0);
    const [url, setUrl] = useState("");
    const [videoData, setVideoData] = useState<VideoItem[]>([]);
    const [isHost, setHost] = useState<boolean>(false);
    const [currentVData, setCurrentVData] = useState<VideoItem>();
    const [host, setHostTag] = useState<string>("Host");
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const [isAdding, setIsAdding] = useState<boolean>(false);



    useEffect(() => {
        const timeoutId = setTimeout(() => {
            roomcnt(setTotalUser);
        }, 1000);

        return () => {
            clearTimeout(timeoutId);
            cleanUpSockets()
        };
    }, []);



    useEffect(() => {
        if (!currentVData && videoData.length > 0) {
            setCurrentVData(videoData[0]);
        }
    }, [videoData]);

    useEffect(() => {
        getUpdatedQueue(setVideoData, getCurrentVideo);
    }, [currentVData]);

    useEffect(() => {
        if (!params.id) return;
        const id = params.id as string
        initSocConn(params.id as string);

        setHostTag(id.split("_")[1])
        joinRoom(params.id as string, session.data?.user.name?.split(" ")[0] as string);
        getInitQueue(setVideoData);
        getUpdatedQueue(setVideoData, getCurrentVideo);
        roomEndListner()
        tostNotificationUserJoins()
        userLeftToastNotification()
        roomcnt(setTotalUser)
        return () => {
            cleanUpSockets()
        };
    }, [params.id]);



    useEffect(() => {
        // console.log(session.data?.user.id)
        // console.log(session.data?.user.hostId + "hostid")
        if (session.data?.user.hostId != null) setHost(true);

    }, [session]);




    const getCurrentVideo = () => currentVData;

    const handleAddVid = async () => {
        const regex = /(?:youtu\.be\/|youtube\.com\/(?:.*v=|.*\/|.*embed\/|v\/|shorts\/))([^?&]+)/;
        const match = url.match(regex);
        if (!match) {
            toast.error("Enter valid YT video URL")
            return;
        }
        try {
            setIsAdding(true)
            axios.post("/api/streams/videos", {
                url,
                streamId: params.id,
                addedBy: session.data?.user.name?.split(" ")[0] ?? "user"
            }).then((res) => {
                addVideoQueue(res.data);
                setIsAdding(false)
                toast.success("video added succesfully")
            }).finally(() => {
                setIsAdding(false)
            })

            setUrl("");
        } catch (error) {
            toast.error("Error while adding video", {

            })
            console.error("Error adding video:", error);
        }
    };

    const handleVideoEnd = () => {
        if (!currentVData || videoData.length === 0) return;

        const finishedVideo = currentVData;
        // console.log(finishedVideo)
        videoCompleted(params.id as string, finishedVideo);
        setIsPlaying(false)
        const updatedQueue = videoData.filter(video => video.id !== finishedVideo.id);
        setVideoData(updatedQueue)
        // console.log(updatedQueue[0])

        if (updatedQueue.length > 0) {
            // console.log("checking from handle videoend"+updatedQueue[0])
            setCurrentVData(updatedQueue[0]);
        } else {
            setCurrentVData(undefined);
        }
    };


    const handleVideoStateChange = (event: { data: number }) => {
        if (event.data === PlayerState.PLAYING) {
            if (!currentVData || currentVData.id !== videoData[0]?.id) {
                setCurrentVData(videoData[0]);
                // console.log("checking on statet change "+videoData[0])
            }
        }
    };

    return (
        <div className="min-h-screen bg-[#09090b] text-white select-none">
            {/* Header */}
            <header className="bg-[#09090b] border-b border-[#2a3a56] shadow-lg">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Youtube className="h-8 w-8 text-red-500" />
                            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                                Vstream
                            </h1>
                        </div>

                        <div className="flex items-center gap-3">

                            <Badge variant="outline" className="bg-[#09090b] text-white border-gray-500 px-3 py-1">
                                <Users className="h-3 w-3 mr-1 text-green-600" />

                                {totalUser}
                            </Badge>

                            <Badge variant="outline" className="bg-[#09090b] text-yellow-300 border-yellow-500 px-3 py-1">
                                <Crown className="h-3 w-3 mr-1" />
                                Host {host}
                            </Badge>


                            <Badge onClick={() => {
                                if (isHost) endRoom(params.id as string)
                                else {

                                    router.replace('/dashboard')
                                }
                            }} variant="outline" className="bg-[#09090b] cursor-pointer text-red-300 border-red-500 px-3 py-1">
                                <LogOutIcon className="h-3 w-3 mr-1" />
                                {isHost ? "End room" : "leave room"}
                            </Badge>

                            <Button variant="ghost" size="icon" onClick={() => {
                                navigator.clipboard.writeText(params.id as string)
                                toast.info("RoomID copied to clipboard", {
                                    style: {
                                        background: "#1E3A8A",
                                        color: "#E0F2FE",
                                        borderLeft: "5px solid #93C5FD",
                                    }

                                })

                            }} className="rounded-full bg-[#09090b] hover:bg-[#2a3a56]">
                                <Link className="h-4 w-4 text-blue-300" />
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto px-4 py-6">
                {/* Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Player Column */}
                    <div className="lg:col-span-2 space-y-4">
                        <div className=" rounded-xl shadow-xl overflow-hidden  border-gray-900 border-4">

                            <div className="p-0">
                                <CustomYouTubePlayer
                                    onStateChange={handleVideoStateChange}
                                    onVideoEnd={handleVideoEnd}
                                    isHost={isHost}
                                    videoId={currentVData?.extractId as string}
                                    streamId={params.id as string}
                                    setIsPlaying={setIsPlaying}
                                    isPlaying={isPlaying}
                                />
                            </div>

                            {currentVData && (
                                <div className="p-4 bg-[#101423] border-t border-[#2a3a56]">
                                    <h3 className="text-lg font-semibold text-blue-100 mb-1">
                                        {currentVData.title || "Video Title"}
                                    </h3>
                                </div>
                            )}
                        </div>

                        {/*input box*/}
                        <div className="mb-6 bg-gray-900 rounded-xl p-4 shadow-lg border border-[#2a3a56]">
                            <div className="flex flex-col md:flex-row items-center gap-3">
                                <div className="flex-1 w-full">
                                    <div className="relative">
                                        <Youtube className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#4a5a76]" />
                                        <Input
                                            className="w-full pl-10  bg-[#09090b] border-[#2a3a56] focus:border-blue-500 focus:ring-blue-500 text-white placeholder:text-[#4a5a76]"
                                            type="text"
                                            value={url}
                                            onChange={(e) => setUrl(e.target.value)}
                                            placeholder="Paste YouTube URL here..."
                                        />
                                    </div>
                                </div>

                                {isAdding ? (
                                    <button
                                        disabled
                                        className="w-full md:w-auto px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-blue-500/20 transition-all duration-300 flex items-center gap-2 rounded-2xl"
                                    >
                                        <LoaderCircle
                                            className="h-5 w-5 animate-spin text-white"
                                            style={{ animation: "spin 1s linear infinite" }}
                                        />
                                        <span>Adding...</span>
                                    </button>
                                ) : (
                                    <Button
                                        onClick={handleAddVid}
                                        className="w-full md:w-auto px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-blue-500/20 transition-all duration-300 flex items-center gap-2 rounded-2xl"
                                    >
                                        Add Video
                                    </Button>
                                )}


                            </div>
                        </div>
                    </div>

                    {/* Queue Column */}
                    <div className="lg:col-span-1 ">
                        <VideoQueue videoData={videoData} isPlaying={isPlaying} />
                    </div>

                </div>

            </main>
        </div>
    );
};

export default Page;

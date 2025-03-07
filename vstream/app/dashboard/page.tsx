"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSelectedLayoutSegment } from "next/navigation";
import axios from "axios";
import { useSession } from "next-auth/react";
import { initSocConn, joinRoom } from "../utils/socket";
import CustomYouTubePlayer from "../components/VideoPlayer";
import { Session } from "inspector/promises";
const Page = () => {
  const router = useRouter();
   const {data,update}=useSession();
   const [streamId,setStreamId]=useState("")
   useEffect(()=>{
    console.log(data?.user.id)
   },[data])
  const handleCreateServer=async()=>{
        const res=await 
        axios.post("/api/streams",{
         
            title:"hello wrold hello"
          
        })
        console.log(res.data)
        console.log(res.data.newStream.id)
        console.log(res.data.newStream.hostId)
        await update({streamId:res.data.newStream.id,hostId:res.data.newStream.hostId}).then(()=>{
          
          initSocConn(res.data.newStream.id as string)
         })
       
        router.push(`/room/${res.data.newStream.id}`)

  }

 const handleJoinRoom=()=>{
      if(streamId=="")alert("enter valid stream id")
      joinRoom(streamId)
     
      router.push(`/room/${streamId}`)
 }

  return <>
  <div>
    <button className="w-20 h-4 bg-white" onClick={handleCreateServer}>create room</button>
    <input type="text" placeholder="streamis" className=" w-90 h-12" onChange={(e)=>setStreamId(e.target.value)}/>
    <button onClick={handleJoinRoom}>join room</button>
  </div>
 

  </>
};

export default Page;

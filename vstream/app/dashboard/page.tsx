"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useSession } from "next-auth/react";
import { initSocConn, joinRoom } from "../utils/socket";
import { motion } from "framer-motion";
import { Music, Plus, Users, ArrowRight, Radio, Sparkles } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Page = () => {
  const router = useRouter();
  const { data, update } = useSession();
  const [streamId, setStreamId] = useState("");

  useEffect(() => {
    console.log(data?.user.id);
  }, [data]);

  const handleCreateServer = async () => {
    const res = await axios.post("/api/streams", {
      title: "hello wrold hello",
    });
    console.log(res.data);
    console.log(res.data.newStream.id);
    console.log(res.data.newStream.hostId);
    await update({
      streamId: res.data.newStream.id,
      hostId: res.data.newStream.hostId,
    }).then(() => {
      initSocConn(res.data.newStream.id as string);
    });

    router.push(`/room/${res.data.newStream.id}_${data?.user.name?.split(" ")[0]}`);
  };

  const handleJoinRoom = () => {
    if (streamId == "") alert("enter valid stream id");
    joinRoom(streamId,);
    router.push(`/room/${streamId}`);
  };

  return (
    <div className="min-h-screen bg-[#09090b] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-3xl"
      >
        <Card className="bg-purple-500/10  backdrop-blur-md border-purple-500/20 shadow-xl rounded-2xl shadow-purple-500/10 select-none">
          <CardHeader className="text-center pb-2">
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mx-auto mb-2"
            >
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center mx-auto">
                <Radio className="w-8 h-8 text-white" />
              </div>
            </motion.div>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
              VStream Dashboard
            </CardTitle>
            <CardDescription className="text-gray-400">
              Create a new stream or join an existing one
            </CardDescription>
          </CardHeader>
          
          <CardContent className="pt-6">
            <Tabs defaultValue="create" className="w-full">
              <TabsList className="grid grid-cols-2 rounded-2xl mb-8">
                <TabsTrigger value="create" className="rounded-2xl data-[state=active]:bg-purple-600">
                  <Plus className="w-4 h-4 mr-2" /> Create Stream
                </TabsTrigger>
                <TabsTrigger value="join" className="rounded-2xl data-[state=active]:bg-purple-600">
                  <Users className="w-4 h-4 mr-2" /> Join Stream
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="create" className="space-y-4 ">
                <div className="space-y-4">
                  <div className="bg-purple-500/10 rounded-2xl p-4 border border-purple-500/20">
                    <div className="flex items-center mb-3">
                      <Music className="w-5 h-5 text-purple-500 mr-2" />
                      <h3 className="text-lg font-medium text-white">Create Your Stream</h3>
                    </div>
                    <p className="text-sm text-gray-400 mb-4">
                      Start a new music stream and invite friends to join. You'll be the host with full control.
                    </p>
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button 
                        onClick={handleCreateServer} 
                        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-2xl text-white border-0"
                      >
                        <Sparkles className="w-4 h-4 mr-2" />
                        Create New Stream
                      </Button>
                    </motion.div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="join" className="space-y-4 ">
                <div className="space-y-4">
                  <div className="bg-purple-500/10 rounded-2xl p-4 border border-purple-500/20">
                    <div className="flex items-center mb-3">
                      <Music className="w-5 h-5 text-purple-500 mr-2" />
                      <h3 className="text-lg font-medium text-white">Join Existing Stream</h3>
                    </div>
                    <p className="text-sm text-gray-400 mb-4">
                      Enter a stream ID to join an existing music stream and enjoy music with friends.
                    </p>
                    <div className="flex gap-2">
                      <Input
                        type="text"
                        placeholder="Enter stream ID"
                        className="flex-1 bg-black/30 border-purple-500/30 focus-visible:ring-purple-500/50 text-white"
                        onChange={(e) => setStreamId(e.target.value)}
                      />
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button 
                          onClick={handleJoinRoom} 
                          className="bg-purple-600 hover:bg-purple-700 rounded-xl text-white"
                        >
                          <ArrowRight className="w-4 h-4" />
                        </Button>
                      </motion.div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Page;

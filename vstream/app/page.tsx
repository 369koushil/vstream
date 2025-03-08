"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion, useScroll, useTransform } from "framer-motion"
import {
  Music,
  Play,
  Plus,
  Users,
  ThumbsUp,
  Youtube,
  ArrowRight,
  LogIn,
  Headphones,
  Radio,
  Sparkles,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"

export default function LandingPage() {
  const [showInput, setShowInput] = useState(false)
  const [streamId, setStreamId] = useState("")
  const [isScrolled, setIsScrolled] = useState(false)
  const { scrollY } = useScroll()

  const headerOpacity = useTransform(scrollY, [0, 50], [0, 1])

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleJoinStream = () => {
    if (streamId) {
      window.location.href = `/room/${streamId}`
    }
  }

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  }

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/40 to-gray-900 text-white">
      {/* Header */}
      <motion.header
        className={`fixed top-0 left-0 right-0 z-50 px-6 py-4 transition-all duration-300 ${
          isScrolled ? "bg-black/80 backdrop-blur-md shadow-md" : "bg-transparent"
        }`}
        style={{ backgroundColor: isScrolled ? "rgba(0, 0, 0, 0.8)" : "transparent" }}
      >
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Headphones className="h-8 w-8 text-purple-500" />
            <span className="font-bold text-xl bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
              MusicStream
            </span>
          </div>

          <Button variant="outline" className="border-purple-500/50 hover:bg-purple-500/20 text-white">
            <LogIn className="mr-2 h-4 w-4" />
            Sign In
          </Button>
        </div>
      </motion.header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 relative">
        <div className="absolute inset-0 bg-[url('/placeholder.svg?height=1080&width=1920')] bg-cover bg-center opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900/50 to-gray-900"></div>

        <div className="max-w-5xl mx-auto relative z-10">
          <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="text-center">
            <motion.div variants={fadeInUp}>
              <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600 bg-clip-text text-transparent">
                🎵 Music Stream Rooms
              </h1>
              <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-white/90">Listen Together in Real-Time!</h2>
            </motion.div>

            <motion.p variants={fadeInUp} className="text-lg text-gray-300 max-w-2xl mx-auto mb-8">
              Host a music room, add YouTube videos, and vote for the next song! Share your favorite music with friends
              in real-time.
            </motion.p>

            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link href="/create">
                <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0 h-12 px-6 text-lg">
                  <Plus className="mr-2 h-5 w-5" />
                  Create a Stream
                </Button>
              </Link>

              {showInput ? (
                <div className="flex gap-2">
                  <Input
                    type="text"
                    placeholder="Enter stream ID"
                    className="h-12 bg-white/10 border-purple-500/30 focus-visible:ring-purple-500/50 text-white"
                    value={streamId}
                    onChange={(e) => setStreamId(e.target.value)}
                  />
                  <Button onClick={handleJoinStream} className="bg-purple-600 hover:bg-purple-700 h-12">
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={() => setShowInput(true)}
                  variant="outline"
                  className="border-purple-500/50 hover:bg-purple-500/20 text-white h-12 px-6 text-lg"
                >
                  <Users className="mr-2 h-5 w-5" />
                  Join a Stream
                </Button>
              )}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-6 bg-black/30">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={staggerContainer}
          >
            <motion.h2 variants={fadeInUp} className="text-3xl font-bold text-center mb-12">
              How It Works
            </motion.h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <motion.div variants={fadeInUp}>
                <Card className="bg-purple-900/20 border-purple-500/20 backdrop-blur-sm h-full">
                  <CardContent className="pt-6 pb-6 flex flex-col items-center text-center">
                    <div className="w-16 h-16 rounded-full bg-purple-500/20 flex items-center justify-center mb-4">
                      <Radio className="h-8 w-8 text-purple-400" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Create a Room</h3>
                    <p className="text-gray-400">
                      Start a stream & become the host. Set up your music room in seconds.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={fadeInUp}>
                <Card className="bg-purple-900/20 border-purple-500/20 backdrop-blur-sm h-full">
                  <CardContent className="pt-6 pb-6 flex flex-col items-center text-center">
                    <div className="w-16 h-16 rounded-full bg-purple-500/20 flex items-center justify-center mb-4">
                      <Youtube className="h-8 w-8 text-purple-400" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Add Songs</h3>
                    <p className="text-gray-400">
                      Paste YouTube links to add to the queue. Build your playlist together.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={fadeInUp}>
                <Card className="bg-purple-900/20 border-purple-500/20 backdrop-blur-sm h-full">
                  <CardContent className="pt-6 pb-6 flex flex-col items-center text-center">
                    <div className="w-16 h-16 rounded-full bg-purple-500/20 flex items-center justify-center mb-4">
                      <ThumbsUp className="h-8 w-8 text-purple-400" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Vote & Play</h3>
                    <p className="text-gray-400">
                      Users vote, and the most popular song plays next. Democracy in action!
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={staggerContainer}
          >
            <motion.h2 variants={fadeInUp} className="text-3xl font-bold text-center mb-4">
              Key Features
            </motion.h2>

            <motion.p variants={fadeInUp} className="text-center text-gray-400 max-w-2xl mx-auto mb-12">
              Everything you need for the perfect music sharing experience
            </motion.p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <motion.div
                variants={fadeInUp}
                className="bg-gradient-to-br from-purple-900/40 to-gray-900 p-6 rounded-xl border border-purple-500/20 backdrop-blur-sm"
              >
                <div className="flex items-start">
                  <div className="mr-4 mt-1">
                    <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                      <Music className="h-5 w-5 text-purple-400" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Real-time Video Queue</h3>
                    <p className="text-gray-400">
                      See updates instantly as songs are added and votes change. Powered by WebSockets for real-time
                      synchronization.
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                variants={fadeInUp}
                className="bg-gradient-to-br from-purple-900/40 to-gray-900 p-6 rounded-xl border border-purple-500/20 backdrop-blur-sm"
              >
                <div className="flex items-start">
                  <div className="mr-4 mt-1">
                    <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                      <ThumbsUp className="h-5 w-5 text-purple-400" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Upvote Songs to Decide Next Track</h3>
                    <p className="text-gray-400">
                      Democratic music selection where everyone has a say. The most popular songs rise to the top of the
                      queue.
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                variants={fadeInUp}
                className="bg-gradient-to-br from-purple-900/40 to-gray-900 p-6 rounded-xl border border-purple-500/20 backdrop-blur-sm"
              >
                <div className="flex items-start">
                  <div className="mr-4 mt-1">
                    <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                      <Sparkles className="h-5 w-5 text-purple-400" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">No Sign-up Required to Join</h3>
                    <p className="text-gray-400">
                      Jump right in with just a room ID. No account creation needed to join the fun and start listening.
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                variants={fadeInUp}
                className="bg-gradient-to-br from-purple-900/40 to-gray-900 p-6 rounded-xl border border-purple-500/20 backdrop-blur-sm"
              >
                <div className="flex items-start">
                  <div className="mr-4 mt-1">
                    <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                      <Play className="h-5 w-5 text-purple-400" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Smooth YouTube Video Playback</h3>
                    <p className="text-gray-400">
                      Enjoy high-quality playback of your favorite YouTube videos with seamless transitions between
                      tracks.
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUp}
        className="py-16 px-6 bg-gradient-to-r from-purple-900/50 to-pink-900/50"
      >
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Start Streaming?</h2>
          <p className="text-xl text-gray-300 mb-8">
            Create your music room now and invite friends to join the experience
          </p>
          <Link href="/create">
            <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0 h-12 px-8 text-lg">
              Get Started Now
            </Button>
          </Link>
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="py-10 px-6 bg-black/60 border-t border-gray-800">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Headphones className="h-6 w-6 text-purple-500" />
              <span className="font-bold text-lg bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
                MusicStream
              </span>
            </div>

            <div className="flex space-x-6 text-sm text-gray-400">
              <Link href="#" className="hover:text-purple-400 transition-colors">
                Privacy Policy
              </Link>
              <Link href="#" className="hover:text-purple-400 transition-colors">
                Terms of Service
              </Link>
              <Link href="#" className="hover:text-purple-400 transition-colors">
                Contact
              </Link>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-sm text-gray-500">
            <p>© {new Date().getFullYear()} MusicStream. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}


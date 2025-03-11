import Link from "next/link"
import { Music, Plus, Users, ThumbsUp, Youtube, Headphones, Radio } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#09090b] text-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 px-6 py-4 transition-all duration-300 bg-purple-500/10  backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Radio className="h-8 w-8 text-purple-500" />
            <span className="font-bold text-xl bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
              VStream
            </span>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-56 pb-20 px-6 relative ">
        <div className="absolute inset-0 bg-[url('/placeholder.svg?height=1080&width=1920')] bg-cover bg-center opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#09090b]/50 to-[#09090b]"></div>

        <div className="max-w-5xl mx-auto relative z-10">
          <div className="text-center animate-fade-in">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600 bg-clip-text text-transparent">
              Vstream
            </h1>
            <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-white/90">Watch and Listen Together in Real-Time!</h2>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-8">
              Host a room, add YouTube videos, and vote for the next song! Share your favorite music video songs with friends
              in real-time.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link href="/dashboard">
                <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0 h-12 px-6 text-lg rounded-2xl transition-transform hover:scale-105">
                  <Plus className="mr-2 h-5 w-5" />
                  Create a Room
                </Button>
              </Link>
              
              <Link href={'/dashboard'}>
              <Button
                variant="outline"
                className="border-purple-500/50 hover:bg-purple-500/20 text-white  h-12 px-6 text-lg rounded-2xl transition-transform hover:scale-105"
              >
                <Users className="mr-2 h-5 w-5" />
                Join a Room
              </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 px-6 bg-[#09090b]/80">
        <div className="max-w-6xl mx-auto">
          <div className="animate-fade-in-up">
            <h2 className="text-3xl font-bold text-center mb-12 font-display">
              How It Works
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="bg-purple-900/20 border-purple-500/20 backdrop-blur-sm h-full rounded-2xl transition-transform hover:translate-y-[-8px]">
                <CardContent className="pt-6 pb-6 flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full bg-purple-500/20 flex items-center justify-center mb-4">
                    <Radio className="h-8 w-8 text-purple-400" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 font-display">Create a Room</h3>
                  <p className="text-gray-400">
                    Start a Room & become the host. Set up your music room in seconds.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-purple-900/20 border-purple-500/20 backdrop-blur-sm h-full rounded-2xl transition-transform hover:translate-y-[-8px]">
                <CardContent className="pt-6 pb-6 flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full bg-purple-500/20 flex items-center justify-center mb-4">
                    <Youtube className="h-8 w-8 text-purple-400" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 font-display">Add Songs</h3>
                  <p className="text-gray-400">
                    Paste YouTube links to add to the queue. Build your playlist together.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-purple-900/20 border-purple-500/20 backdrop-blur-sm h-full rounded-2xl transition-transform hover:translate-y-[-8px]">
                <CardContent className="pt-6 pb-6 flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full bg-purple-500/20 flex items-center justify-center mb-4">
                    <ThumbsUp className="h-8 w-8 text-purple-400" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 font-display">Vote & Play</h3>
                  <p className="text-gray-400">
                    Users vote, and the most popular song plays next. Democracy in action!
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="animate-fade-in-up">
            <h2 className="text-3xl font-bold text-center mb-4 font-display">
              Key Features
            </h2>

            <p className="text-center text-gray-400 max-w-2xl mx-auto mb-12">
              Everything you need for the perfect music sharing experience
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-purple-900/40 to-[#09090b] p-6 rounded-2xl border border-purple-500/20 backdrop-blur-sm transition-all hover:border-purple-500/40 hover:shadow-purple-900/20 hover:shadow-lg">
                <div className="flex items-start">
                  <div className="mr-4 mt-1">
                    <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                      <Music className="h-5 w-5 text-purple-400" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2 font-display">Real-time Video Queue</h3>
                    <p className="text-gray-400">
                      See updates instantly as songs are added and votes change. Powered by WebSockets for real-time
                      synchronization.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-900/40 to-[#09090b] p-6 rounded-2xl border border-purple-500/20 backdrop-blur-sm transition-all hover:border-purple-500/40 hover:shadow-purple-900/20 hover:shadow-lg">
                <div className="flex items-start">
                  <div className="mr-4 mt-1">
                    <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                      <ThumbsUp className="h-5 w-5 text-purple-400" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2 font-display">Upvote Songs to Decide Next Track</h3>
                    <p className="text-gray-400">
                      Democratic music selection where everyone has a say. The most popular songs rise to the top of the
                      queue.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      

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

          
        </div>
      </footer>
    </div>
  )
}

"use client"

import { useState } from "react"
import { Search, Sparkles, Loader2, Music } from "lucide-react"
import { Track } from "@/lib/types"
import { NowPlaying } from "@/components/now-playing"
import { TrackQueue } from "@/components/track-queue"

interface MainContentProps {
  currentTrack: Track | null
  queue: Track[]
  isPlaying: boolean
  progress: number
  isFavorite: boolean
  isLoading: boolean
  onSearch: (mood: string) => void
  onPlayPause: () => void
  onNext: () => void
  onPrevious: () => void
  onToggleFavorite: () => void
  onProgressChange: (progress: number) => void
  onPlayFromQueue: (track: Track, index: number) => void
}

export function MainContent({
  currentTrack,
  queue,
  isPlaying,
  progress,
  isFavorite,
  isLoading,
  onSearch,
  onPlayPause,
  onNext,
  onPrevious,
  onToggleFavorite,
  onProgressChange,
  onPlayFromQueue,
}: MainContentProps) {
  const [searchValue, setSearchValue] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchValue.trim()) return
    onSearch(searchValue)
    setSearchValue("")
  }

  return (
    <main className="flex-1 h-full flex flex-col items-center px-4 md:px-8 pt-8 md:pt-10 pb-28 md:pb-6 overflow-y-auto">
      {/*                                                         ↑ pb-28 on mobile clears the bottom nav bar */}
      <div className="w-full max-w-lg space-y-6">

        {/* Heading */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl md:text-4xl font-bold tracking-tight">
            What&apos;s your{" "}
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
              vibe
            </span>{" "}
            right now?
          </h1>
          <p className="text-white/40 text-sm">
            Let AI find the perfect soundtrack for your mood
          </p>
        </div>

        {/* Search Input */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-300" />
            <div className="relative flex items-center">
              <Search className="absolute left-4 w-5 h-5 text-white/30" />
              <input
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="e.g. studying at 2am, feeling nostalgic..."
                disabled={isLoading}
                className="w-full pl-12 pr-4 py-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl text-white placeholder:text-white/30 focus:outline-none focus:border-purple-500/50 transition-all duration-300 disabled:opacity-50 text-sm md:text-base"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || !searchValue.trim()}
            className="relative w-full group disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-pink-500 to-cyan-500 rounded-xl blur-lg opacity-70 group-hover:opacity-100 transition duration-300 animate-pulse" />
            <div className="relative flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-xl font-semibold text-white shadow-2xl shadow-purple-500/25 transition-all duration-300">
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Finding your music...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Find My Music
                </>
              )}
            </div>
          </button>
        </form>

        {/* Player or Empty State */}
        {currentTrack ? (
          <>
            <NowPlaying
              track={currentTrack}
              isPlaying={isPlaying}
              progress={progress}
              isFavorite={isFavorite}
              onPlayPause={onPlayPause}
              onNext={onNext}
              onPrevious={onPrevious}
              onToggleFavorite={onToggleFavorite}
              onProgressChange={onProgressChange}
            />
            {queue.length > 0 && (
              <TrackQueue queue={queue} onPlay={onPlayFromQueue} />
            )}
          </>
        ) : (
          <div className="relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500/10 to-cyan-500/10 rounded-3xl blur-xl opacity-50" />
            <div className="relative p-10 bg-white/[0.03] backdrop-blur-xl border border-white/5 rounded-3xl flex flex-col items-center gap-4 text-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500/20 to-cyan-500/20 flex items-center justify-center">
                <Music className="w-8 h-8 text-purple-400/60" />
              </div>
              <div>
                <p className="text-white/60 font-medium">No music yet</p>
                <p className="text-white/30 text-sm mt-1">
                  Describe your mood above and AI will pick the perfect tracks
                </p>
              </div>
            </div>
          </div>
        )}

      </div>
    </main>
  )
}

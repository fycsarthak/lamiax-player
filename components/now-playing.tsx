"use client"

import { useRef, useEffect } from "react"
import { Play, Pause, SkipBack, SkipForward, Heart } from "lucide-react"
import { Track } from "@/lib/types"
import Image from "next/image"

// Fixed heights to avoid React hydration mismatch (no Math.random in JSX)
const BAR_HEIGHTS = [14, 20, 12, 18]

interface NowPlayingProps {
  track: Track
  isPlaying: boolean
  progress: number
  isFavorite: boolean
  onPlayPause: () => void
  onNext: () => void
  onPrevious: () => void
  onToggleFavorite: () => void
  onProgressChange: (progress: number) => void
}

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, "0")}`
}

export function NowPlaying({
  track,
  isPlaying,
  progress,
  isFavorite,
  onPlayPause,
  onNext,
  onPrevious,
  onToggleFavorite,
  onProgressChange,
}: NowPlayingProps) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const currentTime = Math.floor((progress / 100) * track.duration)

  // Load new audio src when track changes
  useEffect(() => {
    const audio = audioRef.current
    if (!audio || !track.audioUrl) return
    audio.src = track.audioUrl
    audio.load()
    if (isPlaying) {
      audio.play().catch(console.error)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [track.audioUrl])

  // Sync play/pause state with the audio element
  useEffect(() => {
    const audio = audioRef.current
    if (!audio || !track.audioUrl) return
    if (isPlaying) {
      audio.play().catch(console.error)
    } else {
      audio.pause()
    }
  }, [isPlaying, track.audioUrl])

  // Wire up timeupdate → progress and ended → next track
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const handleTimeUpdate = () => {
      if (audio.duration && !isNaN(audio.duration)) {
        onProgressChange((audio.currentTime / audio.duration) * 100)
      }
    }
    const handleEnded = () => onNext()

    audio.addEventListener("timeupdate", handleTimeUpdate)
    audio.addEventListener("ended", handleEnded)

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate)
      audio.removeEventListener("ended", handleEnded)
    }
  }, [onNext, onProgressChange])

  // Clicking progress bar seeks the audio
  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const pct = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100))
    onProgressChange(pct)
    const audio = audioRef.current
    if (audio && audio.duration && !isNaN(audio.duration)) {
      audio.currentTime = (pct / 100) * audio.duration
    }
  }

  return (
    <div className="relative group">
      {/* Hidden HTML5 audio element — this is what actually plays music */}
      <audio ref={audioRef} preload="metadata" />

      {/* Glow effect */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 rounded-3xl blur-xl opacity-50" />

      {/* Card */}
      <div className="relative p-6 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl">
        {/* Header */}
        <div className="flex items-center gap-2 mb-4">
          <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span className="text-xs uppercase tracking-wider text-white/40 font-medium">
            Now Playing
          </span>
        </div>

        {/* Track Info */}
        <div className="flex items-center gap-5">
          {/* Artwork */}
          <div className="relative group/art">
            <div className="absolute -inset-2 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-2xl blur-lg opacity-30 group-hover/art:opacity-50 transition-opacity" />
            <div className="relative w-24 h-24 rounded-xl overflow-hidden shadow-2xl">
              <Image src={track.artwork} alt={track.title} fill className="object-cover" />
              {isPlaying && (
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                  <div className="flex gap-1 items-end">
                    {BAR_HEIGHTS.map((h, i) => (
                      <div
                        key={i}
                        className="w-1 bg-white rounded-full animate-bounce"
                        style={{
                          height: `${h}px`,
                          animationDelay: `${i * 0.12}s`,
                          animationDuration: "0.6s",
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Title & Artist */}
          <div className="flex-1 min-w-0">
            <h3 className="text-xl font-bold text-white truncate">{track.title}</h3>
            <p className="text-white/50 text-sm truncate">{track.artist}</p>
          </div>

          {/* Favorite Button */}
          <button
            onClick={onToggleFavorite}
            className={`p-3 rounded-full transition-all duration-300 ${
              isFavorite
                ? "bg-cyan-500/20 text-cyan-400"
                : "bg-white/5 text-white/40 hover:text-white hover:bg-white/10"
            }`}
          >
            <Heart className={`w-5 h-5 ${isFavorite ? "fill-current" : ""}`} />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="mt-6 space-y-2">
          <div
            className="relative h-1.5 bg-white/10 rounded-full cursor-pointer group/progress"
            onClick={handleProgressClick}
          >
            <div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full"
              style={{ width: `${progress}%` }}
            />
            <div
              className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg opacity-0 group-hover/progress:opacity-100 transition-opacity"
              style={{ left: `${progress}%`, marginLeft: "-6px" }}
            />
          </div>
          <div className="flex justify-between text-[11px] text-white/30">
            <span>{formatDuration(currentTime)}</span>
            <span>{formatDuration(track.duration)}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-4 mt-4">
          <button
            onClick={onPrevious}
            className="p-3 rounded-full text-white/50 hover:text-white hover:bg-white/5 transition-all"
          >
            <SkipBack className="w-5 h-5" />
          </button>
          <button onClick={onPlayPause} className="relative group/play">
            <div className="absolute -inset-2 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full blur opacity-50 group-hover/play:opacity-75 transition" />
            <div className="relative w-14 h-14 flex items-center justify-center bg-gradient-to-br from-purple-500 to-cyan-500 rounded-full shadow-lg shadow-purple-500/25">
              {isPlaying ? (
                <Pause className="w-6 h-6 text-white" />
              ) : (
                <Play className="w-6 h-6 text-white ml-0.5" />
              )}
            </div>
          </button>
          <button
            onClick={onNext}
            className="p-3 rounded-full text-white/50 hover:text-white hover:bg-white/5 transition-all"
          >
            <SkipForward className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  )
}

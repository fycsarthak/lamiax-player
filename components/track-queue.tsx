"use client"

import { ListMusic, Play } from "lucide-react"
import { Track } from "@/lib/types"
import Image from "next/image"

interface TrackQueueProps {
  queue: Track[]
  onPlay: (track: Track, index: number) => void   // ← wire up click
}

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, "0")}`
}

export function TrackQueue({ queue, onPlay }: TrackQueueProps) {
  return (
    <div className="relative">
      <div className="absolute -inset-0.5 bg-gradient-to-b from-purple-500/10 to-cyan-500/10 rounded-2xl blur-lg opacity-30" />

      <div className="relative p-5 bg-white/[0.03] backdrop-blur-xl border border-white/5 rounded-2xl">
        {/* Header */}
        <div className="flex items-center gap-2 mb-4">
          <ListMusic className="w-4 h-4 text-purple-400" />
          <span className="text-xs uppercase tracking-wider text-white/40 font-medium">
            Up Next
          </span>
          <span className="ml-auto text-xs text-purple-400">{queue.length} tracks</span>
        </div>

        {/* Queue List */}
        <div className="space-y-1">
          {queue.map((track, index) => (
            <button
              key={track.id}
              onClick={() => onPlay(track, index)}
              className="w-full group flex items-center gap-3 p-2.5 rounded-lg hover:bg-white/5 active:bg-white/10 transition-all duration-200 text-left"
            >
              {/* Index / Play icon */}
              <div className="w-6 flex items-center justify-center flex-shrink-0">
                <span className="text-xs text-white/30 group-hover:hidden">{index + 1}</span>
                <Play className="w-3.5 h-3.5 text-cyan-400 hidden group-hover:block" />
              </div>

              {/* Artwork */}
              <div className="relative w-10 h-10 rounded-md overflow-hidden flex-shrink-0">
                <Image
                  src={track.artwork}
                  alt={track.title}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white/80 truncate group-hover:text-white transition-colors font-medium">
                  {track.title}
                </p>
                <p className="text-[11px] text-white/40 truncate">{track.artist}</p>
              </div>

              {/* Duration */}
              <span className="text-xs text-white/30 tabular-nums flex-shrink-0">
                {formatDuration(track.duration)}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

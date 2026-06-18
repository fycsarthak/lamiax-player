"use client"

import { Heart, X } from "lucide-react"
import { Track } from "@/lib/types"
import Image from "next/image"

interface RightSidebarProps {
  savedTracks: Track[]
  onRemove: (track: Track) => void
}

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, "0")}`
}

export function RightSidebar({ savedTracks, onRemove }: RightSidebarProps) {
  return (
    // hidden on mobile, visible from md breakpoint up
    <aside className="hidden md:flex w-[250px] h-full flex-col border-l border-white/5 bg-gradient-to-b from-cyan-950/20 to-transparent">
      {/* Header */}
      <div className="p-6 flex items-center gap-2">
        <Heart className="w-4 h-4 text-cyan-400 fill-cyan-400" />
        <h2 className="text-xs uppercase tracking-wider text-white/50 font-medium">
          Saved Tracks
        </h2>
        <span className="ml-auto text-xs text-cyan-400 font-medium">{savedTracks.length}</span>
      </div>

      {/* Saved Tracks List */}
      <div className="flex-1 px-4 pb-6 overflow-y-auto space-y-2 scrollbar-thin">
        {savedTracks.length === 0 ? (
          <div className="text-center py-8">
            <Heart className="w-8 h-8 text-white/10 mx-auto mb-3" />
            <p className="text-xs text-white/30">No saved tracks yet</p>
          </div>
        ) : (
          savedTracks.map((track) => (
            <div
              key={track.id}
              className="group p-2 rounded-lg transition-all duration-200 hover:bg-white/5"
            >
              <div className="flex items-center gap-3">
                <div className="relative w-10 h-10 rounded-md overflow-hidden flex-shrink-0">
                  <Image
                    src={track.artwork}
                    alt={track.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white/90 truncate font-medium">{track.title}</p>
                  <p className="text-[11px] text-white/40 truncate">{track.artist}</p>
                </div>
                <button
                  onClick={() => onRemove(track)}
                  className="opacity-0 group-hover:opacity-100 p-1.5 rounded-full hover:bg-white/10 transition-all"
                >
                  <X className="w-3.5 h-3.5 text-white/50" />
                </button>
              </div>
              <div className="flex items-center justify-between mt-1.5 px-1">
                <span className="text-[10px] text-white/30">{formatDuration(track.duration)}</span>
                <Heart className="w-3 h-3 text-cyan-400 fill-cyan-400" />
              </div>
            </div>
          ))
        )}
      </div>
    </aside>
  )
}

"use client"

import { useState } from "react"
import { Clock, Heart, X, Music2 } from "lucide-react"
import { Track, MoodEntry } from "@/lib/types"
import Image from "next/image"

interface MobileNavProps {
  moodHistory: MoodEntry[]
  savedTracks: Track[]
  onRemove: (track: Track) => void
}

function formatTime(date: Date): string {
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  return `${days}d ago`
}

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, "0")}`
}

type Drawer = "mood" | "saved" | null

export function MobileNav({ moodHistory, savedTracks, onRemove }: MobileNavProps) {
  const [activeDrawer, setActiveDrawer] = useState<Drawer>(null)

  const toggle = (drawer: Drawer) =>
    setActiveDrawer((prev) => (prev === drawer ? null : drawer))

  const close = () => setActiveDrawer(null)

  return (
    <>
      {/* Backdrop */}
      {activeDrawer && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
          onClick={close}
        />
      )}

      {/* Slide-up drawer */}
      <div
        className={`fixed left-0 right-0 z-50 md:hidden rounded-t-3xl bg-[#0d0d18] border-t border-white/10 transition-all duration-300 ease-out max-h-[70vh] overflow-y-auto ${
          activeDrawer ? "bottom-16 opacity-100" : "bottom-16 opacity-0 pointer-events-none translate-y-full"
        }`}
      >
        <div className="p-5">
          {/* Drawer header */}
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              {activeDrawer === "mood" ? (
                <Clock className="w-4 h-4 text-purple-400" />
              ) : (
                <Heart className="w-4 h-4 text-cyan-400 fill-cyan-400" />
              )}
              <span className="text-sm font-semibold text-white/70 uppercase tracking-wider">
                {activeDrawer === "mood" ? "Mood History" : "Saved Tracks"}
              </span>
            </div>
            <button
              onClick={close}
              className="p-1.5 rounded-full bg-white/10 text-white/50 hover:bg-white/20 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Mood History content */}
          {activeDrawer === "mood" && (
            <div className="space-y-2">
              {moodHistory.length === 0 ? (
                <div className="text-center py-8">
                  <Clock className="w-8 h-8 text-white/10 mx-auto mb-3" />
                  <p className="text-sm text-white/30">No mood searches yet</p>
                </div>
              ) : (
                moodHistory.map((entry) => (
                  <div
                    key={entry.id}
                    className="flex items-center gap-3 p-3 rounded-xl bg-white/5"
                  >
                    <span className="text-2xl">{entry.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white/80 truncate capitalize">{entry.mood}</p>
                      <p className="text-[11px] text-white/30 mt-0.5">
                        {entry.tags?.slice(0, 2).join(", ")} · {formatTime(entry.timestamp)}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Saved Tracks content */}
          {activeDrawer === "saved" && (
            <div className="space-y-2">
              {savedTracks.length === 0 ? (
                <div className="text-center py-8">
                  <Heart className="w-8 h-8 text-white/10 mx-auto mb-3" />
                  <p className="text-sm text-white/30">No saved tracks yet</p>
                </div>
              ) : (
                savedTracks.map((track) => (
                  <div
                    key={track.id}
                    className="flex items-center gap-3 p-3 rounded-xl bg-white/5"
                  >
                    <div className="relative w-11 h-11 rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={track.artwork}
                        alt={track.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white/90 truncate font-medium">{track.title}</p>
                      <p className="text-[11px] text-white/40 truncate">
                        {track.artist} · {formatDuration(track.duration)}
                      </p>
                    </div>
                    <button
                      onClick={() => onRemove(track)}
                      className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors flex-shrink-0"
                    >
                      <X className="w-3.5 h-3.5 text-white/50" />
                    </button>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* Bottom navigation bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-[#0a0a0f]/95 backdrop-blur-xl border-t border-white/10">
        <div className="flex items-center justify-around px-6 py-3">

          {/* Mood History tab */}
          <button
            onClick={() => toggle("mood")}
            className={`relative flex flex-col items-center gap-1 px-5 py-1.5 rounded-xl transition-all duration-200 ${
              activeDrawer === "mood"
                ? "text-purple-400"
                : "text-white/35 hover:text-white/60"
            }`}
          >
            <Clock className="w-5 h-5" />
            <span className="text-[10px] font-medium">History</span>
            {moodHistory.length > 0 && (
              <span className="absolute -top-0.5 right-2 w-4 h-4 bg-purple-500 rounded-full text-[9px] flex items-center justify-center text-white font-bold">
                {moodHistory.length}
              </span>
            )}
          </button>

          {/* App logo center */}
          <div className="flex flex-col items-center gap-1 px-5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-purple-500/30">
              <Music2 className="w-4 h-4 text-white" />
            </div>
            <span className="text-[10px] font-bold tracking-wide text-white/40">Lamia-X</span>
          </div>

          {/* Saved Tracks tab */}
          <button
            onClick={() => toggle("saved")}
            className={`relative flex flex-col items-center gap-1 px-5 py-1.5 rounded-xl transition-all duration-200 ${
              activeDrawer === "saved"
                ? "text-cyan-400"
                : "text-white/35 hover:text-white/60"
            }`}
          >
            <Heart className={`w-5 h-5 ${activeDrawer === "saved" ? "fill-current" : ""}`} />
            <span className="text-[10px] font-medium">Saved</span>
            {savedTracks.length > 0 && (
              <span className="absolute -top-0.5 right-2 w-4 h-4 bg-cyan-500 rounded-full text-[9px] flex items-center justify-center text-white font-bold">
                {savedTracks.length}
              </span>
            )}
          </button>

        </div>
      </nav>
    </>
  )
}

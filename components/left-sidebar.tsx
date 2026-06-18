"use client"

import { Music2, Clock } from "lucide-react"
import { MoodEntry } from "@/lib/types"

interface LeftSidebarProps {
  moodHistory: MoodEntry[]
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

export function LeftSidebar({ moodHistory }: LeftSidebarProps) {
  return (
    // hidden on mobile, visible from md breakpoint up
    <aside className="hidden md:flex w-[250px] h-full flex-col border-r border-white/5 bg-gradient-to-b from-purple-950/20 to-transparent">
      {/* Logo */}
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-purple-500/25">
          <Music2 className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-lg font-bold tracking-tight">Lamia-X</h1>
          <p className="text-[10px] uppercase tracking-[0.2em] text-purple-400">Player</p>
        </div>
      </div>

      {/* Mood History */}
      <div className="flex-1 px-4 pb-6 overflow-hidden flex flex-col">
        <div className="flex items-center gap-2 px-2 mb-4">
          <Clock className="w-4 h-4 text-purple-400" />
          <h2 className="text-xs uppercase tracking-wider text-white/50 font-medium">
            Mood History
          </h2>
        </div>

        <div className="flex-1 overflow-y-auto space-y-1 scrollbar-thin">
          {moodHistory.map((entry) => (
            <button
              key={entry.id}
              className="w-full p-3 rounded-lg text-left transition-all duration-200 hover:bg-white/5 group"
            >
              <div className="flex items-start gap-3">
                <span className="text-lg">{entry.emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white/80 truncate group-hover:text-white transition-colors">
                    {entry.mood}
                  </p>
                  <p className="text-[10px] text-white/30 mt-0.5">
                    {formatTime(entry.timestamp)}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </aside>
  )
}

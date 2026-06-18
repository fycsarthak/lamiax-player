"use client"

import { useState } from "react"
import { LeftSidebar } from "@/components/left-sidebar"
import { RightSidebar } from "@/components/right-sidebar"
import { MainContent } from "@/components/main-content"
import { Track, MoodEntry } from "@/lib/types"

const MOOD_EMOJIS: Record<string, string> = {
  focus: "🎯",
  study: "📚",
  ambient: "🌙",
  chill: "😌",
  energetic: "⚡",
  happy: "😊",
  melancholic: "💙",
  workout: "💪",
  sleep: "😴",
  meditation: "🧘",
  romantic: "💕",
  jazz: "🎷",
  classical: "🎻",
  electronic: "🔌",
  lofi: "☕",
  indie: "🎸",
  folk: "🪕",
  piano: "🎹",
  guitar: "🎸",
  instrumental: "🎼",
  acoustic: "🎵",
  rock: "🤘",
  pop: "🌟",
}

export default function LamiaXPlayer() {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null)
  const [queue, setQueue] = useState<Track[]>([])
  const [history, setHistory] = useState<Track[]>([])   // ← track history for previous btn
  const [savedTracks, setSavedTracks] = useState<Track[]>([])
  const [moodHistory, setMoodHistory] = useState<MoodEntry[]>([])
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [isLoading, setIsLoading] = useState(false)

  const handleSearch = async (mood: string) => {
    if (!mood.trim() || isLoading) return
    setIsLoading(true)

    try {
      const moodRes = await fetch("/api/mood", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mood }),
      })
      const { tags } = await moodRes.json()

      const tracksRes = await fetch(`/api/tracks?tags=${encodeURIComponent(tags.join(" "))}`)
      const { tracks } = await tracksRes.json()

      if (tracks && tracks.length > 0) {
        setHistory([])           // reset history on new search
        setCurrentTrack(tracks[0])
        setQueue(tracks.slice(1))
        setIsPlaying(true)
        setProgress(0)
      }

      const firstTag: string = tags[0] || "ambient"
      const emoji = MOOD_EMOJIS[firstTag] || "🎵"

      const newEntry: MoodEntry = {
        id: Date.now().toString(),
        mood: mood.trim(),
        emoji,
        timestamp: new Date(),
        tags,
      }
      setMoodHistory((prev) => [newEntry, ...prev].slice(0, 10))

      if (typeof pendo !== "undefined") {
        pendo.track("mood_search_completed", {
          mood_query: mood.trim(),
          ai_generated_tags: tags.join(", "),
          tags_count: tags.length,
          tracks_returned_count: tracks?.length || 0,
          success: !!(tracks && tracks.length > 0),
        })
      }
    } catch (err) {
      console.error("Search failed:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const toggleFavorite = (track: Track, source?: string) => {
    const isSaved = savedTracks.some((t) => t.id === track.id)
    if (typeof pendo !== "undefined") {
      if (isSaved) {
        pendo.track("track_unsaved", {
          track_id: track.id,
          track_title: track.title,
          track_artist: track.artist,
          saved_tracks_count: savedTracks.length - 1,
          removal_source: source || "player",
        })
      } else {
        pendo.track("track_saved", {
          track_id: track.id,
          track_title: track.title,
          track_artist: track.artist,
          track_duration_seconds: track.duration,
          saved_tracks_count: savedTracks.length + 1,
        })
      }
    }
    setSavedTracks((prev) =>
      isSaved ? prev.filter((t) => t.id !== track.id) : [track, ...prev]
    )
  }

  // Next: push current to history, play first in queue
  const playNext = () => {
    if (queue.length === 0) return
    if (currentTrack) {
      if (typeof pendo !== "undefined") {
        pendo.track("track_skipped", {
          skipped_track_id: currentTrack.id,
          skipped_track_title: currentTrack.title,
          skipped_track_artist: currentTrack.artist,
          skip_direction: "forward",
          progress_percent_at_skip: Math.round(progress),
          queue_remaining_count: queue.length,
        })
      }
      setHistory((prev) => [currentTrack, ...prev].slice(0, 20))
    }
    setCurrentTrack(queue[0])
    setQueue((prev) => prev.slice(1))
    setProgress(0)
  }

  // Previous: if history exists go back, otherwise just restart
  const playPrevious = () => {
    if (history.length === 0) {
      setProgress(0)
      return
    }
    if (currentTrack) {
      if (typeof pendo !== "undefined") {
        pendo.track("track_skipped", {
          skipped_track_id: currentTrack.id,
          skipped_track_title: currentTrack.title,
          skipped_track_artist: currentTrack.artist,
          skip_direction: "backward",
          progress_percent_at_skip: Math.round(progress),
          queue_remaining_count: queue.length,
        })
      }
      // Push current track back to front of queue
      setQueue((prev) => [currentTrack, ...prev])
    }
    setCurrentTrack(history[0])
    setHistory((prev) => prev.slice(1))
    setProgress(0)
  }

  // Click a track in the queue to play it immediately
  const playFromQueue = (track: Track, index: number) => {
    if (typeof pendo !== "undefined") {
      pendo.track("queue_track_selected", {
        selected_track_id: track.id,
        selected_track_title: track.title,
        selected_track_artist: track.artist,
        queue_position: index + 1,
        queue_total_count: queue.length,
        previous_track_id: currentTrack?.id || "",
      })
    }
    if (currentTrack) setHistory((prev) => [currentTrack, ...prev].slice(0, 20))
    setCurrentTrack(track)
    // Remove the clicked track from the queue, keep everything after it
    setQueue((prev) => prev.filter((_, i) => i !== index))
    setProgress(0)
    setIsPlaying(true)
  }

  const isFavorite = currentTrack
    ? savedTracks.some((t) => t.id === currentTrack.id)
    : false

  return (
    <div className="flex h-screen w-full bg-[#0a0a0f] text-white overflow-hidden">
      <LeftSidebar moodHistory={moodHistory} />
      <MainContent
        currentTrack={currentTrack}
        queue={queue}
        isPlaying={isPlaying}
        progress={progress}
        isFavorite={isFavorite}
        isLoading={isLoading}
        onSearch={handleSearch}
        onPlayPause={() => setIsPlaying((p) => !p)}
        onNext={playNext}
        onPrevious={playPrevious}
        onToggleFavorite={() => currentTrack && toggleFavorite(currentTrack)}
        onProgressChange={setProgress}
        onPlayFromQueue={playFromQueue}
      />
      <RightSidebar savedTracks={savedTracks} onRemove={(track) => toggleFavorite(track, "sidebar")} />
    </div>
  )
}

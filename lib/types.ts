export interface Track {
  id: string
  title: string
  artist: string
  artwork: string
  duration: number
  audioUrl?: string
}

export interface MoodEntry {
  id: string
  mood: string
  emoji: string
  timestamp: Date
  tags?: string[]
}

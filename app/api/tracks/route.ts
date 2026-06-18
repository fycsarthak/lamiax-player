import { NextRequest, NextResponse } from "next/server"

const FALLBACK_ARTWORK =
  "https://images.unsplash.com/photo-1614149162883-504ce4d13909?w=300&h=300&fit=crop"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const tags = searchParams.get("tags") || "ambient"

    const url = new URL("https://api.jamendo.com/v3.0/tracks/")
    url.searchParams.set("client_id", process.env.JAMENDO_CLIENT_ID || "")
    url.searchParams.set("format", "json")
    url.searchParams.set("limit", "20")  // fetch more so we have a pool to shuffle
    url.searchParams.set("tags", tags)   // tags arrive space-separated from page.tsx
    url.searchParams.set("include", "musicinfo")
    url.searchParams.set("audioformat", "mp32")
    url.searchParams.set("order", "popularity_total")
    url.searchParams.set("imagesize", "300")
    // Random offset = different slice of results every search
    url.searchParams.set("offset", String(Math.floor(Math.random() * 30)))

    const response = await fetch(url.toString())
    const data = await response.json()

    if (!data.results || data.results.length === 0) {
      return NextResponse.json({
        tracks: [],
        success: false,
        message: "No tracks found for this mood",
      })
    }

    // Shuffle the pool so play order is different every time
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const shuffled = [...data.results].sort(() => Math.random() - 0.5)

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const tracks = shuffled.slice(0, 6).map((track: any) => ({
      id: String(track.id),
      title: track.name,
      artist: track.artist_name,
      artwork: track.image || FALLBACK_ARTWORK,
      duration: Number(track.duration),
      audioUrl: track.audio,
    }))

    return NextResponse.json({ tracks, success: true })
  } catch (err) {
    console.error("Tracks API error:", err)
    return NextResponse.json({ tracks: [], success: false })
  }
}

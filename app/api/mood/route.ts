import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const { mood } = await req.json()

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `You are a music mood analyzer. Given a mood description, return ONLY a JSON array of 3-5 music tags that match the feeling. Choose ONLY from this list: ambient, chill, electronic, acoustic, jazz, classical, pop, rock, focus, study, lofi, melancholic, happy, energetic, sleep, meditation, workout, romantic, indie, folk, piano, guitar, instrumental.

Mood: "${mood}"

Return ONLY a valid JSON array, no explanation, no markdown. Example: ["focus", "ambient", "study"]`,
                },
              ],
            },
          ],
        }),
      }
    )

    const data = await response.json()
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '["ambient"]'
    const clean = text.replace(/```json|```/g, "").trim()
    const tags = JSON.parse(clean)

    return NextResponse.json({ tags, success: true })
  } catch (err) {
    console.error("Mood API error:", err)
    // Fallback tags if Gemini fails
    return NextResponse.json({ tags: ["ambient", "chill"], success: false })
  }
}

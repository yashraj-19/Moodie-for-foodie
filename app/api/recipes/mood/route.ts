import { type NextRequest, NextResponse } from "next/server"
import { searchRecipes, moodToSearchParams } from "@/lib/api"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const mood = searchParams.get("mood")

  if (!mood || !moodToSearchParams[mood]) {
    return NextResponse.json({ error: "Invalid or missing mood parameter" }, { status: 400 })
  }

  const { type, tags, diet } = moodToSearchParams[mood]

  try {
    const results = await searchRecipes({
      type,
      diet,
      query: tags.split(",")[0], // Use the first tag as a query term
      number: 6,
    })

    return NextResponse.json(results)
  } catch (error) {
    console.error("Error in mood recipes API route:", error)
    return NextResponse.json({ error: "Failed to fetch mood-based recipes" }, { status: 500 })
  }
}


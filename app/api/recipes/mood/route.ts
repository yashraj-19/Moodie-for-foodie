import { type NextRequest, NextResponse } from "next/server"
import { searchRecipes, moodToSearchParams } from "@/lib/api"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const mood = searchParams.get("mood")

  if (!mood || !moodToSearchParams[mood]) {
    return NextResponse.json({ error: "Invalid or missing mood parameter" }, { status: 400 })
  }

  const { type, query, diet, maxReadyTime, sort } = moodToSearchParams[mood]
  const profileDiet = searchParams.get("diet") || diet

  try {
    const results = await searchRecipes({
      type,
      diet: profileDiet,
      query,
      maxReadyTime,
      sort,
      number: 6,
    })

    return NextResponse.json(results)
  } catch (error) {
    console.error("Error in mood recipes API route:", error)
    return NextResponse.json({ error: "Failed to fetch mood-based recipes" }, { status: 500 })
  }
}


import { type NextRequest, NextResponse } from "next/server"
import { getRandomRecipes } from "@/lib/api"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const tags = searchParams.get("tags") || ""
  const number = searchParams.get("number") ? Number.parseInt(searchParams.get("number") as string) : 6

  try {
    const recipes = await getRandomRecipes({ tags, number })
    return NextResponse.json(recipes)
  } catch (error) {
    console.error("Error in random recipes API route:", error)
    return NextResponse.json({ error: "Failed to fetch random recipes" }, { status: 500 })
  }
}


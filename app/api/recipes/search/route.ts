import { type NextRequest, NextResponse } from "next/server"
import { searchRecipes } from "@/lib/api"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get("query") || ""
  const cuisine = searchParams.get("cuisine") || ""
  const diet = searchParams.get("diet") || ""
  const type = searchParams.get("type") || ""
  const intolerances = searchParams.get("intolerances") || ""
  const maxReadyTime = searchParams.get("maxReadyTime")
    ? Number.parseInt(searchParams.get("maxReadyTime") as string)
    : undefined
  const sort = searchParams.get("sort") || "popularity"
  const sortDirection = searchParams.get("sortDirection") || "desc"
  const offset = searchParams.get("offset") ? Number.parseInt(searchParams.get("offset") as string) : 0
  const number = searchParams.get("number") ? Number.parseInt(searchParams.get("number") as string) : 12

  try {
    // Ensure we have at least some parameters to search with
    if (!query && !cuisine && !diet && !type) {
      // If no specific search criteria, default to a general search
      const results = await searchRecipes({
        sort,
        sortDirection,
        offset,
        number,
      })
      return NextResponse.json(results)
    }

    const results = await searchRecipes({
      query,
      cuisine,
      diet,
      type,
      intolerances,
      maxReadyTime,
      sort,
      sortDirection,
      offset,
      number,
    })

    return NextResponse.json(results)
  } catch (error) {
    console.error("Error in search API route:", error)
    return NextResponse.json(
      { error: "Failed to search recipes", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}


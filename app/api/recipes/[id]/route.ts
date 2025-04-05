import { type NextRequest, NextResponse } from "next/server"
import { getRecipeById } from "@/lib/api"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const id = Number.parseInt(params.id)

  if (isNaN(id)) {
    return NextResponse.json({ error: "Invalid recipe ID" }, { status: 400 })
  }

  try {
    const recipe = await getRecipeById(id)

    if (!recipe) {
      return NextResponse.json({ error: "Recipe not found" }, { status: 404 })
    }

    return NextResponse.json(recipe)
  } catch (error) {
    console.error(`Error fetching recipe ${id}:`, error)
    return NextResponse.json({ error: "Failed to fetch recipe" }, { status: 500 })
  }
}


import { getMockSearchResponse, getMockRecipeById, MOCK_RECIPES } from "./mock-recipes"
import type { Recipe, SearchResult, SearchResponse } from "./types"

export type { Recipe, SearchResult, SearchResponse } from "./types"

const API_KEY = process.env.SPOONACULAR_API_KEY ?? ""
const BASE_URL = "https://api.spoonacular.com"

export async function searchRecipes({
  query = "",
  cuisine = "",
  diet = "",
  type = "",
  intolerances = "",
  maxReadyTime,
  sort = "popularity",
  sortDirection = "desc",
  offset = 0,
  number = 12,
}: {
  query?: string
  cuisine?: string
  diet?: string
  type?: string
  intolerances?: string
  maxReadyTime?: number
  sort?: string
  sortDirection?: string
  offset?: number
  number?: number
}): Promise<SearchResponse> {
  const normalizedSort = sort === "trending" ? "popularity" : sort === "random" ? "popularity" : sort

  if (!API_KEY) {
    return getMockSearchResponse({
      query,
      cuisine,
      diet,
      type,
      maxReadyTime,
      number,
      offset,
    })
  }

  const params = new URLSearchParams({
    apiKey: API_KEY,
    number: number.toString(),
    offset: offset.toString(),
    addRecipeInformation: "true",
    sort: normalizedSort,
    sortDirection,
  })

  if (query) params.append("query", query)
  if (cuisine) params.append("cuisine", cuisine)
  if (diet) params.append("diet", diet)
  if (type) params.append("type", type)
  if (intolerances) params.append("intolerances", intolerances)
  if (maxReadyTime) params.append("maxReadyTime", maxReadyTime.toString())

  try {
    const response = await fetch(`${BASE_URL}/recipes/complexSearch?${params.toString()}`)

    if (!response.ok) {
      console.warn(`[api] Spoonacular responded with ${response.status}. Using fallback dataset.`)
      return getMockSearchResponse({
        query,
        cuisine,
        diet,
        type,
        maxReadyTime,
        number,
        offset,
      })
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error("Error searching recipes from Spoonacular, returning fallback:", error)
    return getMockSearchResponse({
      query,
      cuisine,
      diet,
      type,
      maxReadyTime,
      number,
      offset,
    })
  }
}

export async function getRecipeById(id: number): Promise<Recipe | null> {
  if (!API_KEY) {
    return getMockRecipeById(id)
  }

  try {
    const response = await fetch(`${BASE_URL}/recipes/${id}/information?apiKey=${API_KEY}&includeNutrition=true`)

    if (!response.ok) {
      console.warn(`[api] Spoonacular getRecipeById(${id}) returned ${response.status}. Using fallback.`)
      return getMockRecipeById(id)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error(`Error fetching recipe ${id} from Spoonacular, returning fallback:`, error)
    return getMockRecipeById(id)
  }
}

export async function getRandomRecipes({
  tags = "",
  number = 6,
}: {
  tags?: string
  number?: number
}): Promise<Recipe[]> {
  if (!API_KEY) {
    let list = [...MOCK_RECIPES]
    if (tags) {
      const tagList = tags.toLowerCase().split(",").map((t) => t.trim())
      const filtered = list.filter((r) =>
        tagList.some((t) =>
          r.diets.some((d) => d.toLowerCase().includes(t)) ||
          r.dishTypes.some((dt) => dt.toLowerCase().includes(t)) ||
          r.cuisines.some((c) => c.toLowerCase().includes(t))
        )
      )
      if (filtered.length > 0) list = filtered
    }
    return list.slice(0, number)
  }

  try {
    const params = new URLSearchParams({
      apiKey: API_KEY,
      number: number.toString(),
    })

    if (tags) params.append("tags", tags)

    const response = await fetch(`${BASE_URL}/recipes/random?${params.toString()}`)

    if (!response.ok) {
      console.warn(`[api] Spoonacular getRandomRecipes returned ${response.status}. Using fallback.`)
      return MOCK_RECIPES.slice(0, number)
    }

    const data = await response.json()
    return data.recipes || MOCK_RECIPES.slice(0, number)
  } catch (error) {
    console.error("Error fetching random recipes from Spoonacular, returning fallback:", error)
    return MOCK_RECIPES.slice(0, number)
  }
}

export async function getMealPlanForDay(diet?: string, exclude?: string): Promise<any> {
  if (!API_KEY) {
    return {
      meals: MOCK_RECIPES.slice(0, 3).map((r) => ({
        id: r.id,
        title: r.title,
        readyInMinutes: r.readyInMinutes,
        servings: r.servings,
        sourceUrl: r.sourceUrl,
      })),
      nutrients: {
        calories: 1850,
        carbohydrates: 210,
        fat: 65,
        protein: 95,
      },
    }
  }

  try {
    const params = new URLSearchParams({
      apiKey: API_KEY,
      timeFrame: "day",
    })

    if (diet) params.append("diet", diet)
    if (exclude) params.append("exclude", exclude)

    const response = await fetch(`${BASE_URL}/mealplanner/generate?${params.toString()}`)

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error("Error generating meal plan:", error)
    return null
  }
}

export const moodToSearchParams: Record<string, { type: string; tags: string; diet?: string }> = {
  quick: {
    type: "main course",
    tags: "easy,quick",
  },
  healthy: {
    type: "main course",
    tags: "healthy",
    diet: "vegetarian",
  },
  comfort: {
    type: "main course",
    tags: "comfort",
  },
  sweet: {
    type: "dessert",
    tags: "sweet",
  },
  spicy: {
    type: "main course",
    tags: "spicy",
  },
  budget: {
    type: "main course",
    tags: "cheap,budget",
  },
}

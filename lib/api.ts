// API key is available as an environment variable
const API_KEY = "d5fa148aeabd443f913f88795af4fdae";
const BASE_URL = "https://api.spoonacular.com";


export type Recipe = {
  id: number
  title: string
  image: string
  imageType: string
  readyInMinutes: number
  servings: number
  sourceUrl: string
  summary: string
  cuisines: string[]
  dishTypes: string[]
  diets: string[]
  instructions: string
  analyzedInstructions: any[]
  vegetarian: boolean
  vegan: boolean
  glutenFree: boolean
  dairyFree: boolean
  veryHealthy: boolean
  cheap: boolean
  veryPopular: boolean
  sustainable: boolean
  lowFodmap: boolean
  weightWatcherSmartPoints: number
  gaps: string
  preparationMinutes: number
  cookingMinutes: number
  aggregateLikes: number
  healthScore: number
  creditsText: string
  sourceName: string
  pricePerServing: number
  extendedIngredients: any[]
  spoonacularScore?: number
}

export type SearchResult = {
  id: number
  title: string
  image: string
  imageType: string
  readyInMinutes?: number
  servings?: number
  nutrition?: {
    nutrients: {
      name: string
      amount: number
      unit: string
    }[]
  }
}

export type SearchResponse = {
  results: SearchResult[]
  offset: number
  number: number
  totalResults: number
}

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
  const params = new URLSearchParams({
    apiKey: API_KEY as string,
    number: number.toString(),
    offset: offset.toString(),
    addRecipeInformation: "true",
    sort,
    sortDirection,
  })

  // Only add query if it's not empty
  if (query) params.append("query", query)
  if (cuisine) params.append("cuisine", cuisine)
  if (diet) params.append("diet", diet)
  if (type) params.append("type", type)
  if (intolerances) params.append("intolerances", intolerances)
  if (maxReadyTime) params.append("maxReadyTime", maxReadyTime.toString())

  try {
    const response = await fetch(`${BASE_URL}/recipes/complexSearch?${params.toString()}`)

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`API request failed with status ${response.status}: ${errorText}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error("Error searching recipes:", error)
    throw error // Re-throw to allow handling in the API route
  }
}

export async function getRecipeById(id: number): Promise<Recipe | null> {
  try {
    const response = await fetch(`${BASE_URL}/recipes/${id}/information?apiKey=${API_KEY}&includeNutrition=true`)

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error(`Error fetching recipe ${id}:`, error)
    return null
  }
}

export async function getRandomRecipes({
  tags = "",
  number = 6,
}: {
  tags?: string
  number?: number
}): Promise<Recipe[]> {
  try {
    const params = new URLSearchParams({
      apiKey: API_KEY as string,
      number: number.toString(),
    })

    if (tags) params.append("tags", tags)

    const response = await fetch(`${BASE_URL}/recipes/random?${params.toString()}`)

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`)
    }

    const data = await response.json()
    return data.recipes
  } catch (error) {
    console.error("Error fetching random recipes:", error)
    return []
  }
}

export async function getMealPlanForDay(diet?: string, exclude?: string): Promise<any> {
  try {
    const params = new URLSearchParams({
      apiKey: API_KEY as string,
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


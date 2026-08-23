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
  nutrition?: {
    nutrients: {
      name: string
      amount: number
      unit: string
    }[]
  }
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

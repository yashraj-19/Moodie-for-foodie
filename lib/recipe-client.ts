import type { SearchResult } from "./types"

const recipeCache = new Map<number, SearchResult>()
const pending = new Map<number, Promise<SearchResult | null>>()

export async function hydrateRecipes(ids: number[]): Promise<SearchResult[]> {
  const uniqueIds = [...new Set(ids)]
  const recipes = await Promise.all(uniqueIds.map(async (id) => {
    const cached = recipeCache.get(id)
    if (cached) return cached

    const existing = pending.get(id)
    if (existing) return existing

    const request = fetch(`/api/recipes/${id}`)
      .then(async (response) => response.ok ? (await response.json() as SearchResult) : null)
      .catch(() => null)
      .finally(() => pending.delete(id))
    pending.set(id, request)
    const recipe = await request
    if (recipe) recipeCache.set(id, recipe)
    return recipe
  }))

  return recipes.filter((recipe): recipe is SearchResult => Boolean(recipe))
}

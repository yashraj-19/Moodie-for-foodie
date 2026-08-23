import type { User } from "@/context/auth-context"
import type { Recipe, SearchResult } from "@/lib/types"

export const RECOMMENDATION_WEIGHTS = {
  mood: 25,
  diet: 25,
  cuisine: 20,
  time: 15,
  history: 15,
} as const

const moodTerms: Record<string, string[]> = {
  sweet: ["sweet", "chocolate", "cake", "dessert"],
  comfort: ["comfort", "pasta", "curry", "lasagna", "soup"],
  healthy: ["healthy", "salad", "vegetable", "light"],
  spicy: ["spicy", "chili", "curry", "pepper"],
  quick: ["quick", "easy"],
  budget: ["cheap", "budget"],
}

function recipeText(recipe: Partial<Recipe> & Partial<SearchResult>) {
  return `${recipe.title || ""} ${(recipe.cuisines || []).join(" ")} ${(recipe.diets || []).join(" ")} ${(recipe.dishTypes || []).join(" ")}`.toLowerCase()
}

function matchesDiet(recipe: Partial<Recipe>, user: User) {
  return (user.dietaryRestrictions || []).some((diet) => {
    const normalized = diet.toLowerCase().replace("-", "")
    return normalized === "vegetarian" ? recipe.vegetarian || recipeText(recipe).includes("vegetarian") : normalized === "vegan" ? recipe.vegan || recipeText(recipe).includes("vegan") : recipeText(recipe).includes(normalized)
  })
}

export function scoreRecipe(recipe: SearchResult | Recipe, user: User, mood?: string) {
  const text = recipeText(recipe)
  let score = 0
  if (mood && (moodTerms[mood] || []).some((term) => text.includes(term))) score += RECOMMENDATION_WEIGHTS.mood
  if (matchesDiet(recipe, user)) score += RECOMMENDATION_WEIGHTS.diet
  if ((user.favoriteCuisines || []).some((cuisine) => text.includes(cuisine.toLowerCase()))) score += RECOMMENDATION_WEIGHTS.cuisine
  if (recipe.readyInMinutes && user.cookingTime) {
    const [minimum, maximum] = user.cookingTime.split("-").map(Number)
    if (recipe.readyInMinutes >= (minimum || 0) && recipe.readyInMinutes <= (maximum || 999)) score += RECOMMENDATION_WEIGHTS.time
  }
  if (user.likedRecipeIds.includes(recipe.id) || user.savedRecipeIds.includes(recipe.id) || user.cookedRecipeIds.includes(recipe.id)) score += RECOMMENDATION_WEIGHTS.history
  return score
}

export function rankRecipes(recipes: SearchResult[], user: User, mood?: string) {
  return [...recipes].sort((a, b) => scoreRecipe(b, user, mood) - scoreRecipe(a, user, mood))
}

export function getRecommendationReasons(recipe: SearchResult | Recipe, user: User, mood?: string) {
  const text = recipeText(recipe)
  const reasons: string[] = []
  const diet = (user.dietaryRestrictions || []).find((value) => text.includes(value.toLowerCase().replace("-", "")) || (value.toLowerCase() === "vegetarian" && (recipe as Recipe).vegetarian))
  const cuisine = (user.favoriteCuisines || []).find((value) => text.includes(value.toLowerCase()))
  if (diet) reasons.push(`Matches your ${diet.toLowerCase()} preference`)
  if (cuisine) reasons.push(`${cuisine} is one of your favorite cuisines`)
  if (recipe.readyInMinutes && user.cookingTime) {
    const [minimum, maximum] = user.cookingTime.split("-").map(Number)
    if (recipe.readyInMinutes >= (minimum || 0) && recipe.readyInMinutes <= (maximum || 999)) reasons.push(`Fits your ${user.cookingTime} min cooking preference`)
  }
  if (mood && (moodTerms[mood] || []).some((term) => text.includes(term))) reasons.push(`Matches your ${mood} mood`)
  return reasons
}

export function calculateTasteDNA(user: User) {
  const counts: Record<string, number> = { sweet: 0, comfort: 0, healthy: 0, spicy: 0, quick: 0 }
  ;(user.moodHistory || []).forEach(({ mood }) => { if (counts[mood] !== undefined) counts[mood] += 2 })
  const interactions = user.likedRecipeIds.length + user.savedRecipeIds.length + user.cookedRecipeIds.length
  if (!interactions && !(user.moodHistory || []).length) return []
  const total = Object.values(counts).reduce((sum, count) => sum + count, 0) || 1
  return Object.entries(counts).map(([mood, count]) => ({ mood, percentage: Math.round((count / total) * 100) })).sort((a, b) => b.percentage - a.percentage)
}

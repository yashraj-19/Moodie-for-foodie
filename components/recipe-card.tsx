import Link from "next/link"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, ChefHat, Heart, Bookmark } from "lucide-react"
import type { SearchResult } from "@/lib/api"

interface RecipeCardProps {
  recipe: SearchResult
  showActions?: boolean
}

export default function RecipeCard({ recipe, showActions = true }: RecipeCardProps) {
  // Extract difficulty based on preparation time
  const getDifficulty = (readyInMinutes?: number) => {
    if (!readyInMinutes) return "Medium"
    if (readyInMinutes <= 20) return "Easy"
    if (readyInMinutes <= 45) return "Medium"
    return "Hard"
  }

  // Get a diet tag if available
  const getDietTag = (recipe: SearchResult) => {
    if (!recipe) return ""

    // This is a simplified approach - in a real app, you'd check the actual diet properties
    const id = recipe.id
    const options = ["Vegetarian", "Vegan", "Gluten-Free", "Keto", "Paleo"]
    return options[id % options.length]
  }

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <Link href={`/recipes/${recipe.id}`}>
        <div className="aspect-video relative overflow-hidden">
          <img
            src={recipe.image || "/placeholder.svg?height=200&width=300"}
            alt={recipe.title}
            className="object-cover w-full h-full transition-transform hover:scale-105 duration-300"
          />
          <div className="absolute top-2 right-2">
            <Badge className="bg-white text-amber-600 hover:bg-gray-100">{getDietTag(recipe)}</Badge>
          </div>
        </div>
      </Link>
      <CardContent className="p-4">
        <Link href={`/recipes/${recipe.id}`}>
          <h3 className="font-semibold text-lg mb-2 hover:text-amber-600 transition-colors line-clamp-2">
            {recipe.title}
          </h3>
        </Link>
        <div className="flex items-center text-sm text-gray-500 space-x-4">
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            <span>{recipe.readyInMinutes || "30"} min</span>
          </div>
          <div className="flex items-center">
            <ChefHat className="h-4 w-4 mr-1" />
            <span>{getDifficulty(recipe.readyInMinutes)}</span>
          </div>
        </div>
        <div className="flex items-center mt-3">
          <div className="flex">
            {[...Array(5)].map((_, i) => {
              // Calculate rating based on recipe id (just for demo)
              const rating = 3.5 + (recipe.id % 15) / 10
              return (
                <svg
                  key={i}
                  className={`w-4 h-4 ${i < Math.floor(rating) ? "text-amber-500" : "text-gray-300"}`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              )
            })}
          </div>
          <span className="text-xs text-gray-500 ml-2">({20 + (recipe.id % 100)} reviews)</span>
        </div>
      </CardContent>
      {showActions && (
        <CardFooter className="p-4 pt-0 flex justify-between">
          <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600 hover:bg-red-50 px-2">
            <Heart className="h-4 w-4 mr-1" />
            <span className="text-xs">Like</span>
          </Button>
          <Button variant="ghost" size="sm" className="text-amber-600 hover:text-amber-700 hover:bg-amber-50 px-2">
            <Bookmark className="h-4 w-4 mr-1" />
            <span className="text-xs">Save</span>
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}


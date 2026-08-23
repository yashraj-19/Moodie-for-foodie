"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, ChefHat, Heart, Bookmark, Star, MoreHorizontal } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { SearchResult } from "@/lib/api"
import { useAuth } from "@/context/auth-context"
import { toast } from "sonner"
import { getRecommendationReasons } from "@/lib/recommendations"

interface RecipeCardProps {
  recipe: SearchResult
  showActions?: boolean
}

const FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?auto=format&fit=crop&w=600&q=80",
]

export default function RecipeCard({ recipe, showActions = true }: RecipeCardProps) {
  const { user, isRecipeSaved, toggleSaveRecipe, isRecipeLiked, toggleLikeRecipe, toggleRecipeInCollection } = useAuth()
  const [imgSrc, setImgSrc] = useState(
    recipe.image || FALLBACK_IMAGES[Math.abs(recipe.id) % FALLBACK_IMAGES.length]
  )

  const isSaved = isRecipeSaved(recipe.id)
  const isLiked = isRecipeLiked(recipe.id)
  const recommendationReasons = user ? getRecommendationReasons(recipe, user).slice(0, 2) : []

  const handleToggleSave = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const saved = toggleSaveRecipe(recipe.id)
    if (saved) {
      toast.success(`Saved "${recipe.title.slice(0, 30)}..." to your cookbook!`)
    } else {
      toast.info(`Removed from your saved recipes`)
    }
  }

  const handleToggleLike = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const liked = toggleLikeRecipe(recipe.id)
    if (liked) {
      toast.success(`Liked "${recipe.title.slice(0, 30)}..."!`)
    }
  }

  const getDifficulty = (readyInMinutes?: number) => {
    if (!readyInMinutes) return "Medium"
    if (readyInMinutes <= 20) return "Easy"
    if (readyInMinutes <= 45) return "Medium"
    return "Hard"
  }

  const getDietBadge = () => {
    const title = recipe.title.toLowerCase()
    if (title.includes("vegan")) return "Vegan"
    if (title.includes("vegetarian") || title.includes("pasta") || title.includes("salad")) return "Vegetarian"
    if (title.includes("salmon") || title.includes("fish") || title.includes("tuna")) return "Pescatarian"
    if (title.includes("keto") || title.includes("butter") || title.includes("low carb")) return "Keto Friendly"
    if (title.includes("taco") || title.includes("chicken") || title.includes("curry")) return "High Protein"
    return "Chef's Pick"
  }

  return (
    <Card className="group overflow-hidden rounded-xl border border-gray-200/80 bg-white hover:border-amber-300 hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
      <div>
        <Link href={`/recipes/${recipe.id}`} className="block relative aspect-video overflow-hidden bg-amber-50">
          <img
            src={imgSrc}
            alt={recipe.title}
            onError={() => setImgSrc(FALLBACK_IMAGES[Math.abs(recipe.id) % FALLBACK_IMAGES.length])}
            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute top-2.5 right-2.5">
            <Badge className="bg-white/95 text-amber-800 backdrop-blur-md shadow-xs border-0 font-medium text-xs">
              {getDietBadge()}
            </Badge>
          </div>
        </Link>

        <CardContent className="p-4">
          <Link href={`/recipes/${recipe.id}`}>
            <h3 className="font-bold text-gray-900 text-base mb-2 group-hover:text-amber-600 transition-colors line-clamp-2 leading-snug">
              {recipe.title}
            </h3>
          </Link>
          <div className="flex items-center text-xs text-gray-500 space-x-4 mb-2.5">
            <div className="flex items-center font-medium">
              <Clock className="h-3.5 w-3.5 mr-1 text-amber-600" />
              <span>{recipe.readyInMinutes || 30} min</span>
            </div>
            <div className="flex items-center font-medium">
              <ChefHat className="h-3.5 w-3.5 mr-1 text-amber-600" />
              <span>{getDifficulty(recipe.readyInMinutes)}</span>
            </div>
          </div>
          <div className="flex items-center text-xs text-amber-500 space-x-1">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <span className="text-gray-500 font-normal ml-1">4.8 ({24 + (recipe.id % 50)})</span>
          </div>
          {recommendationReasons.length > 0 && (
            <div className="mt-3 border-t border-amber-100 pt-2 text-[11px] text-gray-600">
              <p className="mb-1 font-semibold text-amber-800">Why you&apos;ll like this</p>
              {recommendationReasons.map((reason) => <p key={reason}>✓ {reason}</p>)}
            </div>
          )}
        </CardContent>
      </div>

      {showActions && (
        <CardFooter className="p-3 pt-0 border-t border-gray-50 flex justify-between items-center bg-gray-50/50">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleToggleLike}
            className={`h-8 px-2.5 text-xs transition-colors ${
              isLiked ? "text-red-500 font-semibold hover:bg-red-50" : "text-gray-500 hover:text-red-500 hover:bg-red-50"
            }`}
          >
            <Heart className={`h-3.5 w-3.5 mr-1.5 ${isLiked ? "fill-red-500 text-red-500" : ""}`} />
            <span>{isLiked ? "Liked" : "Like"}</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleToggleSave}
            className={`h-8 px-2.5 text-xs transition-colors ${
              isSaved ? "text-amber-600 font-semibold bg-amber-50" : "text-gray-600 hover:text-amber-600 hover:bg-amber-50"
            }`}
          >
            <Bookmark className={`h-3.5 w-3.5 mr-1.5 ${isSaved ? "fill-amber-600 text-amber-600" : ""}`} />
            <span>{isSaved ? "Saved" : "Save"}</span>
          </Button>

          {user?.collections && user.collections.length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8" aria-label="Add to collection">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {user.collections.map((collection) => (
                  <DropdownMenuItem key={collection.id} onClick={() => toggleRecipeInCollection(collection.id, recipe.id)}>
                    {collection.recipeIds.includes(recipe.id) ? "Remove from" : "Add to"} {collection.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </CardFooter>
      )}
    </Card>
  )
}

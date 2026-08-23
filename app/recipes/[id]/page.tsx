"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Clock,
  ChefHat,
  Users,
  Bookmark,
  Heart,
  Share2,
  Star,
  Printer,
  ArrowLeft,
  CheckCircle2,
  Sparkles,
  ChevronRight,
  Flame,
} from "lucide-react"
import DashboardHeader from "@/components/dashboard-header"
import type { Recipe } from "@/lib/api"
import { useAuth } from "@/context/auth-context"
import { toast } from "sonner"

export default function RecipeDetail() {
  const params = useParams()
  const router = useRouter()
  const recipeId = Number.parseInt(params?.id as string) || 716429

  const { isRecipeSaved, toggleSaveRecipe, isRecipeLiked, toggleLikeRecipe, markRecipeCooked } = useAuth()
  const [recipe, setRecipe] = useState<Recipe | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [servings, setServings] = useState(4)

  // Cooking mode modal
  const [cookingModeOpen, setCookingModeOpen] = useState(false)
  const [currentStepIndex, setCurrentStepIndex] = useState(0)

  const isSaved = isRecipeSaved(recipeId)
  const isLiked = isRecipeLiked(recipeId)

  useEffect(() => {
    const fetchRecipe = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const response = await fetch(`/api/recipes/${recipeId}`)

        if (!response.ok) {
          throw new Error(`Failed to fetch recipe: ${response.statusText}`)
        }

        const data = await response.json()
        setRecipe(data)
        setServings(data.servings || 4)
      } catch (err) {
        console.error("Error fetching recipe:", err)
        setError("Could not load recipe details. Please try another recipe.")
      } finally {
        setIsLoading(false)
      }
    }

    if (recipeId) {
      fetchRecipe()
    }
  }, [recipeId])

  const adjustServings = (amount: number) => {
    const newServings = servings + amount
    if (newServings >= 1 && newServings <= 16) {
      setServings(newServings)
    }
  }

  const calculateAmount = (amount: number) => {
    if (!recipe) return amount
    const factor = servings / (recipe.servings || 1)
    const result = amount * factor
    return Number.isInteger(result) ? result.toString() : result.toFixed(1).replace(/\.0$/, "")
  }

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href)
      toast.success("Recipe link copied to clipboard!")
    }
  }

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print()
    }
  }

  const handleCompleteCooking = () => {
    markRecipeCooked(recipeId)
    toast.success("🎉 Delicious job! Recipe added to your cooked achievements.", {
      description: "Keep discovering and cooking new flavors.",
    })
    setCookingModeOpen(false)
  }

  if (isLoading) {
    return <RecipeDetailSkeleton />
  }

  if (error || !recipe) {
    return (
      <div className="min-h-screen bg-gray-50/50">
        <DashboardHeader />
        <main className="container mx-auto px-4 py-16 text-center max-w-md">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <ChefHat className="h-12 w-12 text-amber-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Recipe Not Found</h1>
            <p className="text-gray-500 text-sm mb-6">{error || "The recipe could not be loaded."}</p>
            <Link href="/recipes">
              <Button className="w-full bg-amber-600 hover:bg-amber-700 text-white">Browse All Recipes</Button>
            </Link>
          </div>
        </main>
      </div>
    )
  }

  const stepsList =
    recipe.analyzedInstructions?.[0]?.steps ||
    recipe.instructions
      ?.split("\n")
      .filter((s) => s.trim().length > 0)
      .map((s, i) => ({ number: i + 1, step: s.replace(/^\d+\.\s*/, "") })) ||
    []

  return (
    <div className="min-h-screen bg-gray-50/50 pb-16">
      <DashboardHeader />

      <main className="container mx-auto px-4 py-6 max-w-6xl">
        <div className="mb-6">
          <Link href="/recipes" className="inline-flex items-center text-sm font-medium text-amber-600 hover:text-amber-700">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Recipes
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Recipe Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Header & Hero Image Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200/80 overflow-hidden">
              <div className="relative h-[320px] sm:h-[420px] bg-amber-50">
                <img
                  src={recipe.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80"}
                  alt={recipe.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4 flex space-x-2">
                  <Button
                    variant="secondary"
                    size="icon"
                    onClick={() => {
                      const liked = toggleLikeRecipe(recipeId)
                      toast.success(liked ? "Liked recipe!" : "Unliked")
                    }}
                    className="rounded-full bg-white/90 backdrop-blur-md hover:bg-white shadow-sm"
                  >
                    <Heart className={`h-4 w-4 ${isLiked ? "fill-red-500 text-red-500" : "text-gray-700"}`} />
                  </Button>
                  <Button
                    variant="secondary"
                    size="icon"
                    onClick={() => {
                      const saved = toggleSaveRecipe(recipeId)
                      toast.success(saved ? "Saved to your cookbook!" : "Removed from cookbook")
                    }}
                    className="rounded-full bg-white/90 backdrop-blur-md hover:bg-white shadow-sm"
                  >
                    <Bookmark className={`h-4 w-4 ${isSaved ? "fill-amber-600 text-amber-600" : "text-gray-700"}`} />
                  </Button>
                  <Button
                    variant="secondary"
                    size="icon"
                    onClick={handleShare}
                    className="rounded-full bg-white/90 backdrop-blur-md hover:bg-white shadow-sm"
                  >
                    <Share2 className="h-4 w-4 text-gray-700" />
                  </Button>
                </div>
              </div>

              <div className="p-6 sm:p-8">
                <div className="flex flex-wrap gap-2 mb-4">
                  {recipe.cuisines?.[0] && (
                    <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200 border-0 font-medium">
                      {recipe.cuisines[0]}
                    </Badge>
                  )}
                  {recipe.diets?.[0] && (
                    <Badge variant="outline" className="border-amber-200 bg-amber-50/50 text-amber-900 font-medium">
                      {recipe.diets[0]}
                    </Badge>
                  )}
                  <Badge variant="outline" className="border-gray-200 text-gray-700">
                    <Clock className="h-3 w-3 mr-1 text-amber-600" />
                    {recipe.readyInMinutes || 30} min
                  </Badge>
                  <Badge variant="outline" className="border-gray-200 text-gray-700">
                    <Users className="h-3 w-3 mr-1 text-amber-600" />
                    Serves {servings}
                  </Badge>
                </div>

                <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-3 tracking-tight leading-tight">
                  {recipe.title}
                </h1>

                <div className="flex items-center space-x-3 mb-6">
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-amber-400" />
                    ))}
                  </div>
                  <span className="text-xs text-gray-500 font-medium">
                    {(recipe.spoonacularScore ? (recipe.spoonacularScore / 20).toFixed(1) : "4.8")} • ({recipe.aggregateLikes || 140} community likes)
                  </span>
                </div>

                {/* Summary / Description */}
                <div
                  className="text-gray-600 text-sm leading-relaxed mb-6 bg-gray-50/60 p-4 rounded-xl border border-gray-100"
                  dangerouslySetInnerHTML={{ __html: recipe.summary?.slice(0, 400) + "..." || "" }}
                />

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <Button
                    onClick={() => {
                      setCurrentStepIndex(0)
                      setCookingModeOpen(true)
                    }}
                    className="bg-amber-600 hover:bg-amber-700 text-white font-semibold shadow-sm px-6"
                  >
                    <Flame className="h-4 w-4 mr-2" />
                    Start Step-by-Step Cooking
                  </Button>
                  <Button variant="outline" onClick={handlePrint} className="border-gray-200 text-gray-700 hover:bg-gray-50">
                    <Printer className="h-4 w-4 mr-2" />
                    Print Recipe
                  </Button>
                </div>
              </div>
            </div>

            {/* Ingredients & Instructions Tabs */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200/80 overflow-hidden">
              <Tabs defaultValue="ingredients" className="w-full">
                <TabsList className="w-full border-b rounded-none bg-gray-50/50 p-0 h-12">
                  <TabsTrigger
                    value="ingredients"
                    className="flex-1 h-full rounded-none data-[state=active]:bg-white data-[state=active]:border-b-2 data-[state=active]:border-amber-600 font-semibold"
                  >
                    Ingredients ({recipe.extendedIngredients?.length || 6})
                  </TabsTrigger>
                  <TabsTrigger
                    value="instructions"
                    className="flex-1 h-full rounded-none data-[state=active]:bg-white data-[state=active]:border-b-2 data-[state=active]:border-amber-600 font-semibold"
                  >
                    Step-by-Step Instructions
                  </TabsTrigger>
                  <TabsTrigger
                    value="nutrition"
                    className="flex-1 h-full rounded-none data-[state=active]:bg-white data-[state=active]:border-b-2 data-[state=active]:border-amber-600 font-semibold"
                  >
                    Nutrition Facts
                  </TabsTrigger>
                </TabsList>

                {/* Ingredients Tab */}
                <TabsContent value="ingredients" className="p-6 sm:p-8 space-y-6">
                  <div className="flex items-center justify-between bg-amber-50/60 p-3.5 rounded-xl border border-amber-100">
                    <span className="text-sm font-semibold text-amber-900">Adjust Servings:</span>
                    <div className="flex items-center space-x-2 bg-white rounded-lg border border-amber-200 p-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => adjustServings(-1)}
                        disabled={servings <= 1}
                        className="h-7 w-7 p-0 text-amber-900"
                      >
                        -
                      </Button>
                      <span className="font-bold text-sm text-gray-900 px-2 min-w-[28px] text-center">{servings}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => adjustServings(1)}
                        disabled={servings >= 16}
                        className="h-7 w-7 p-0 text-amber-900"
                      >
                        +
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {(recipe.extendedIngredients || []).map((ing, idx) => (
                      <div
                        key={idx}
                        className="flex items-center space-x-3 p-3 rounded-xl border border-gray-100 bg-gray-50/40 hover:bg-amber-50/40 transition-colors"
                      >
                        <div className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" />
                        <span className="text-sm text-gray-800">
                          <strong className="font-semibold text-gray-900">
                            {calculateAmount(ing.amount)} {ing.unit}{" "}
                          </strong>
                          {ing.nameClean || ing.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                {/* Instructions Tab */}
                <TabsContent value="instructions" className="p-6 sm:p-8">
                  {stepsList.length > 0 ? (
                    <div className="space-y-6">
                      {stepsList.map((st, idx) => (
                        <div key={idx} className="flex items-start space-x-4">
                          <div className="w-8 h-8 rounded-full bg-amber-600 text-white font-bold text-sm flex items-center justify-center shrink-0 shadow-xs">
                            {st.number || idx + 1}
                          </div>
                          <div className="pt-1">
                            <p className="text-gray-800 text-sm leading-relaxed">{st.step}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div
                      className="prose prose-sm text-gray-700 max-w-none"
                      dangerouslySetInnerHTML={{ __html: recipe.instructions || "No detailed instructions provided." }}
                    />
                  )}
                </TabsContent>

                {/* Nutrition Tab */}
                <TabsContent value="nutrition" className="p-6 sm:p-8">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {(recipe.nutrition?.nutrients?.slice(0, 6) || [
                      { name: "Calories", amount: 480, unit: "kcal" },
                      { name: "Protein", amount: 28, unit: "g" },
                      { name: "Carbohydrates", amount: 45, unit: "g" },
                      { name: "Fat", amount: 18, unit: "g" },
                      { name: "Fiber", amount: 6, unit: "g" },
                      { name: "Sugar", amount: 5, unit: "g" },
                    ]).map((n, idx) => (
                      <div key={idx} className="p-4 rounded-xl bg-amber-50/50 border border-amber-100 text-center">
                        <div className="text-xl font-bold text-amber-800">
                          {Math.round(n.amount)} {n.unit}
                        </div>
                        <div className="text-xs font-medium text-gray-500 mt-0.5">{n.name}</div>
                      </div>
                    ))}
                  </div>
                  <p className="text-[11px] text-gray-400 text-center mt-4">* Estimated nutritional values per serving.</p>
                </TabsContent>
              </Tabs>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Chef Info Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200/80 p-6 space-y-4">
              <h3 className="font-bold text-gray-900 text-base">Created By</h3>
              <div className="flex items-center space-x-3.5">
                <Avatar className="h-12 w-12 ring-2 ring-amber-100">
                  <AvatarFallback className="bg-amber-600 text-white font-bold">
                    {(recipe.sourceName || "CC").slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-bold text-gray-900 text-sm">{recipe.sourceName || "Culinary Canvas Kitchen"}</p>
                  <p className="text-xs text-gray-500">Verified Recipe Contributor</p>
                </div>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">
                {recipe.creditsText || "Crafted to bring authentic flavors, balanced nutrition, and joy to your dining table."}
              </p>
            </div>

            {/* Chef's Pro Tips */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border border-amber-100 p-6 space-y-3">
              <div className="flex items-center space-x-2 text-amber-900 font-bold text-sm">
                <Sparkles className="h-4 w-4 text-amber-600" />
                <span>Chef's Success Secret</span>
              </div>
              <p className="text-xs text-amber-950/80 leading-relaxed">
                Prep all ingredients (mise en place) before starting heat. This ensures garlic and spices never burn while you are reaching for seasoning.
              </p>
            </div>

            {/* Similar Recommended Recipes */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200/80 p-6 space-y-4">
              <h3 className="font-bold text-gray-900 text-base">You May Also Like</h3>
              <div className="space-y-3">
                {[
                  { id: 715538, title: "Bruschetta Style Pork & Zucchini Salad", time: "25 min", img: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=400&q=80" },
                  { id: 644387, title: "Garlic Butter Pan-Seared Salmon", time: "20 min", img: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=400&q=80" },
                  { id: 640062, title: "Authentic Thai Green Curry", time: "30 min", img: "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?auto=format&fit=crop&w=400&q=80" },
                ]
                  .filter((r) => r.id !== recipeId)
                  .map((item) => (
                    <Link
                      key={item.id}
                      href={`/recipes/${item.id}`}
                      className="flex items-center space-x-3 p-2 rounded-xl hover:bg-amber-50/50 transition-colors group"
                    >
                      <img
                        src={item.img}
                        alt={item.title}
                        className="w-14 h-14 rounded-lg object-cover group-hover:scale-105 transition-transform"
                      />
                      <div>
                        <h4 className="font-semibold text-xs text-gray-900 group-hover:text-amber-600 transition-colors line-clamp-1">
                          {item.title}
                        </h4>
                        <span className="text-[11px] text-gray-500 flex items-center mt-1">
                          <Clock className="h-3 w-3 mr-1 text-amber-600" />
                          {item.time}
                        </span>
                      </div>
                    </Link>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Interactive Cooking Mode Modal */}
      <Dialog open={cookingModeOpen} onOpenChange={setCookingModeOpen}>
        <DialogContent className="sm:max-w-[600px] p-6">
          <DialogHeader>
            <div className="flex justify-between items-center pr-6">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-600">Step-by-Step Cooking Mode</span>
              <span className="text-xs text-gray-500 font-semibold">
                Step {currentStepIndex + 1} of {stepsList.length}
              </span>
            </div>
            <DialogTitle className="text-xl font-bold">{recipe.title}</DialogTitle>
          </DialogHeader>

          <div className="my-6 p-6 rounded-2xl bg-amber-50/70 border border-amber-100 min-h-[160px] flex items-center justify-center text-center">
            <p className="text-base sm:text-lg font-medium text-gray-900 leading-relaxed">
              {stepsList[currentStepIndex]?.step || "Follow standard recipe preparation."}
            </p>
          </div>

          <div className="flex justify-between items-center">
            <Button
              variant="outline"
              onClick={() => setCurrentStepIndex((prev) => Math.max(0, prev - 1))}
              disabled={currentStepIndex === 0}
            >
              Previous Step
            </Button>

            {currentStepIndex < stepsList.length - 1 ? (
              <Button
                onClick={() => setCurrentStepIndex((prev) => prev + 1)}
                className="bg-amber-600 hover:bg-amber-700 text-white"
              >
                Next Step
                <ChevronRight className="ml-1.5 h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={handleCompleteCooking} className="bg-emerald-600 hover:bg-emerald-700 text-white">
                <CheckCircle2 className="mr-1.5 h-4 w-4" />
                Finish Cooking & Save
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function RecipeDetailSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50/50">
      <DashboardHeader />
      <main className="container mx-auto px-4 py-8 max-w-6xl space-y-6">
        <div className="h-6 w-32 bg-gray-200 rounded animate-pulse" />
        <div className="h-[360px] bg-gray-200 rounded-2xl animate-pulse" />
        <div className="h-64 bg-gray-200 rounded-2xl animate-pulse" />
      </main>
    </div>
  )
}

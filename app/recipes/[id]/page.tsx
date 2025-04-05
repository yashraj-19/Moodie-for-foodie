"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Clock, ChefHat, Users, Bookmark, Heart, Share2, Star, Printer, ArrowLeft } from "lucide-react"
import DashboardHeader from "@/components/dashboard-header"
import type { Recipe } from "@/lib/api"

export default function RecipeDetail({ params }: { params: { id: string } }) {
  const recipeId = Number.parseInt(params.id)
  const [recipe, setRecipe] = useState<Recipe | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [servings, setServings] = useState(4)

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
      } catch (error) {
        console.error("Error fetching recipe:", error)
        setError("Failed to load recipe. Please try again later.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchRecipe()
  }, [recipeId])

  const adjustServings = (amount: number) => {
    const newServings = servings + amount
    if (newServings >= 1 && newServings <= 12) {
      setServings(newServings)
    }
  }

  // Calculate ingredient amounts based on servings
  const calculateAmount = (amount: number) => {
    if (!recipe) return amount
    const factor = servings / (recipe.servings || 1)
    return (amount * factor).toFixed(1).replace(/\.0$/, "")
  }

  if (isLoading) {
    return <RecipeDetailSkeleton />
  }

  if (error || !recipe) {
    return (
      <div className="min-h-screen bg-gray-50">
        <DashboardHeader />
        <main className="container mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Recipe Not Found</h1>
            <p className="text-gray-600 mb-6">{error || "We couldn't find the recipe you're looking for."}</p>
            <Link href="/recipes">
              <Button className="bg-amber-600 hover:bg-amber-700">Browse Recipes</Button>
            </Link>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/recipes" className="inline-flex items-center text-amber-600 hover:text-amber-700">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Recipes
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="relative h-[300px] md:h-[400px]">
                <img
                  src={recipe.image || "/placeholder.svg?height=500&width=800"}
                  alt={recipe.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4 flex space-x-2">
                  <Button
                    variant="secondary"
                    size="icon"
                    className="rounded-full bg-white/80 backdrop-blur-sm hover:bg-white"
                  >
                    <Heart className="h-5 w-5 text-red-500" />
                  </Button>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="rounded-full bg-white/80 backdrop-blur-sm hover:bg-white"
                  >
                    <Bookmark className="h-5 w-5 text-amber-600" />
                  </Button>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="rounded-full bg-white/80 backdrop-blur-sm hover:bg-white"
                  >
                    <Share2 className="h-5 w-5 text-gray-700" />
                  </Button>
                </div>
              </div>

              <div className="p-6">
                <div className="flex flex-wrap gap-2 mb-4">
                  {recipe.diets && recipe.diets.length > 0 && (
                    <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200">{recipe.diets[0]}</Badge>
                  )}
                  <Badge variant="outline" className="border-gray-200">
                    <Clock className="h-3 w-3 mr-1" />
                    {recipe.readyInMinutes} min
                  </Badge>
                  <Badge variant="outline" className="border-gray-200">
                    <ChefHat className="h-3 w-3 mr-1" />
                    {recipe.readyInMinutes <= 20 ? "Easy" : recipe.readyInMinutes <= 45 ? "Medium" : "Hard"}
                  </Badge>
                  <Badge variant="outline" className="border-gray-200">
                    <Users className="h-3 w-3 mr-1" />
                    Serves {recipe.servings}
                  </Badge>
                </div>

                <h1 className="text-3xl font-bold text-gray-900 mb-2">{recipe.title}</h1>

                <div className="flex items-center mb-4">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${
                          i < Math.floor(recipe.spoonacularScore ? recipe.spoonacularScore / 20 : 4)
                            ? "text-amber-500 fill-amber-500"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="ml-2 text-sm text-gray-600">
                    {(recipe.spoonacularScore ? recipe.spoonacularScore / 20 : 4).toFixed(1)} (
                    {recipe.aggregateLikes || 0} likes)
                  </span>
                </div>

                <div className="text-gray-700 mb-6" dangerouslySetInnerHTML={{ __html: recipe.summary }} />

                <div className="flex flex-wrap gap-4">
                  <Button className="bg-amber-600 hover:bg-amber-700">Start Cooking</Button>
                  <Button variant="outline" className="flex items-center">
                    <Printer className="h-4 w-4 mr-2" />
                    Print Recipe
                  </Button>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <Tabs defaultValue="ingredients">
                <TabsList className="w-full border-b p-0 h-auto">
                  <TabsTrigger
                    value="ingredients"
                    className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-amber-600 py-3"
                  >
                    Ingredients
                  </TabsTrigger>
                  <TabsTrigger
                    value="instructions"
                    className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-amber-600 py-3"
                  >
                    Instructions
                  </TabsTrigger>
                  <TabsTrigger
                    value="nutrition"
                    className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-amber-600 py-3"
                  >
                    Nutrition
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="ingredients" className="p-6">
                  <div className="mb-4 flex justify-between items-center">
                    <h3 className="text-lg font-semibold">Ingredients</h3>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">Servings:</span>
                      <div className="flex border rounded-md">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 px-2"
                          onClick={() => adjustServings(-1)}
                          disabled={servings <= 1}
                        >
                          -
                        </Button>
                        <div className="flex items-center px-2 border-x">{servings}</div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 px-2"
                          onClick={() => adjustServings(1)}
                          disabled={servings >= 12}
                        >
                          +
                        </Button>
                      </div>
                    </div>
                  </div>

                  <ul className="space-y-3">
                    {recipe.extendedIngredients &&
                      recipe.extendedIngredients.map((ingredient, index) => (
                        <li key={index} className="flex items-start">
                          <div className="flex h-5 w-5 items-center justify-center rounded-full border border-amber-600 mr-3 mt-0.5">
                            <div className="h-2 w-2 rounded-full bg-amber-600"></div>
                          </div>
                          <span>
                            {calculateAmount(ingredient.amount)} {ingredient.unit}{" "}
                            {ingredient.nameClean || ingredient.name}
                          </span>
                        </li>
                      ))}
                  </ul>
                </TabsContent>

                <TabsContent value="instructions" className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Instructions</h3>
                  {recipe.analyzedInstructions && recipe.analyzedInstructions.length > 0 ? (
                    <ol className="space-y-6">
                      {recipe.analyzedInstructions[0].steps.map((step, index) => (
                        <li key={index} className="flex">
                          <div className="flex-shrink-0 mr-4">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100 text-amber-600 font-semibold">
                              {step.number}
                            </div>
                          </div>
                          <div className="pt-1">
                            <p>{step.step}</p>
                          </div>
                        </li>
                      ))}
                    </ol>
                  ) : (
                    <div
                      className="prose max-w-none"
                      dangerouslySetInnerHTML={{ __html: recipe.instructions || "No instructions available." }}
                    />
                  )}
                </TabsContent>

                <TabsContent value="nutrition" className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Nutrition Information</h3>
                  <p className="text-sm text-gray-500 mb-4">Per serving</p>

                  {recipe.nutrition ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {recipe.nutrition.nutrients.slice(0, 6).map((nutrient, index) => (
                        <div key={index} className="bg-gray-50 p-4 rounded-lg">
                          <div className="text-2xl font-bold text-amber-600">
                            {nutrient.amount.toFixed(0)}
                            {nutrient.unit}
                          </div>
                          <div className="text-sm text-gray-500">{nutrient.name}</div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-gray-500">Nutrition information not available.</div>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">Chef's Tips</h3>
              <ul className="space-y-3">
                {recipe.analyzedInstructions &&
                  recipe.analyzedInstructions[0]?.steps.slice(0, 3).map((step, index) => (
                    <li key={index} className="flex items-start">
                      <div className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-100 text-amber-600 mr-3 mt-0.5">
                        <span className="text-xs">💡</span>
                      </div>
                      <span className="text-gray-700">{step.step.substring(0, 100)}...</span>
                    </li>
                  ))}
                {(!recipe.analyzedInstructions || recipe.analyzedInstructions.length === 0) && (
                  <li className="flex items-start">
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-100 text-amber-600 mr-3 mt-0.5">
                      <span className="text-xs">💡</span>
                    </div>
                    <span className="text-gray-700">
                      For best results, read through the entire recipe before starting.
                    </span>
                  </li>
                )}
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">About the Chef</h3>
              <div className="flex items-center space-x-4 mb-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src="/placeholder.svg?height=100&width=100" />
                  <AvatarFallback>CC</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{recipe.sourceName || "Culinary Canvas"}</p>
                  <p className="text-sm text-gray-500">Recipe Creator</p>
                </div>
              </div>
              <p className="text-gray-700 text-sm">
                {recipe.creditsText ||
                  "This recipe was carefully crafted to provide a delicious and satisfying culinary experience."}
              </p>
              <Button variant="link" className="text-amber-600 p-0 h-auto mt-2">
                View all recipes by this chef
              </Button>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">Similar Recipes</h3>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Link href={`/recipes/${recipeId + i}`} key={i} className="flex items-center space-x-3 group">
                    <div className="w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
                      <img
                        src={`/placeholder.svg?height=100&width=100`}
                        alt={`Similar recipe ${i}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <div>
                      <h4 className="font-medium text-sm group-hover:text-amber-600 transition-colors">
                        Similar Recipe {i}
                      </h4>
                      <p className="text-xs text-gray-500">30 min • Easy</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

function RecipeDetailSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <div className="w-32 h-6 bg-gray-200 rounded animate-pulse" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="h-[300px] md:h-[400px] bg-gray-200 animate-pulse" />

              <div className="p-6">
                <div className="flex flex-wrap gap-2 mb-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-6 w-20 bg-gray-200 rounded animate-pulse" />
                  ))}
                </div>

                <div className="h-10 bg-gray-200 rounded animate-pulse mb-2" />

                <div className="flex items-center mb-4">
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="h-5 w-5 bg-gray-200 rounded animate-pulse" />
                    ))}
                  </div>
                  <div className="ml-2 h-4 w-24 bg-gray-200 rounded animate-pulse" />
                </div>

                <div className="space-y-2 mb-6">
                  <div className="h-4 bg-gray-200 rounded animate-pulse" />
                  <div className="h-4 bg-gray-200 rounded animate-pulse" />
                  <div className="h-4 bg-gray-200 rounded animate-pulse" />
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3" />
                </div>

                <div className="flex flex-wrap gap-4">
                  <div className="h-10 w-32 bg-gray-200 rounded animate-pulse" />
                  <div className="h-10 w-32 bg-gray-200 rounded animate-pulse" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="border-b">
                <div className="flex">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex-1 h-12 bg-gray-200 animate-pulse m-1 rounded" />
                  ))}
                </div>
              </div>

              <div className="p-6">
                <div className="space-y-4">
                  <div className="h-6 bg-gray-200 rounded animate-pulse w-1/3 mb-4" />

                  <div className="space-y-3">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <div key={i} className="flex items-start">
                        <div className="h-5 w-5 bg-gray-200 rounded-full animate-pulse mr-3 mt-0.5" />
                        <div className="h-5 bg-gray-200 rounded animate-pulse flex-1" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-lg shadow-md p-6">
                <div className="h-6 bg-gray-200 rounded animate-pulse w-1/2 mb-4" />
                <div className="space-y-3">
                  {[1, 2, 3].map((j) => (
                    <div key={j} className="h-4 bg-gray-200 rounded animate-pulse" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}


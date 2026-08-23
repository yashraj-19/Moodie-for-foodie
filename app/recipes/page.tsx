"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Search, X, SlidersHorizontal, Bookmark, BookOpen } from "lucide-react"
import DashboardHeader from "@/components/dashboard-header"
import RecipeCard from "@/components/recipe-card"
import type { SearchResult } from "@/lib/api"
import { useAuth } from "@/context/auth-context"
import { hydrateRecipes } from "@/lib/recipe-client"

export default function RecipesPage() {
  const { user } = useAuth()
  const [searchQuery, setSearchQuery] = useState("")
  const [submittedQuery, setSubmittedQuery] = useState("")
  const [activeFilters, setActiveFilters] = useState<string[]>([])
  const [recipes, setRecipes] = useState<SearchResult[]>([])
  const [allFetchedRecipes, setAllFetchedRecipes] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("all")
  const [sortOption, setSortOption] = useState("popularity")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalResults, setTotalResults] = useState(0)
  const resultsPerPage = 12

  // Filter state
  const [cuisineFilters, setCuisineFilters] = useState<string[]>([])
  const [dietFilters, setDietFilters] = useState<string[]>([])
  const [mealTypeFilters, setMealTypeFilters] = useState<string[]>([])
  const [maxTime, setMaxTime] = useState<number>(120)
  const [difficultyFilters, setDifficultyFilters] = useState<string[]>([])
  const [hydratedSavedRecipes, setHydratedSavedRecipes] = useState<SearchResult[]>([])

  useEffect(() => {
    fetchRecipes()
  }, [currentPage, sortOption, cuisineFilters, dietFilters, mealTypeFilters, maxTime, difficultyFilters, submittedQuery])

  useEffect(() => {
    let cancelled = false
    hydrateRecipes(user?.savedRecipeIds || []).then((hydrated) => {
      if (!cancelled) setHydratedSavedRecipes(hydrated)
    })
    return () => { cancelled = true }
  }, [user?.savedRecipeIds])

  const fetchRecipes = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const params = new URLSearchParams({
        sort: sortOption,
        number: resultsPerPage.toString(),
        offset: ((currentPage - 1) * resultsPerPage).toString(),
      })

      if (submittedQuery) {
        params.append("query", submittedQuery)
      }

      if (cuisineFilters.length > 0) {
        params.append("cuisine", cuisineFilters.join(","))
      }

      if (dietFilters.length > 0) {
        params.append("diet", dietFilters.join(","))
      }

      if (mealTypeFilters.length > 0) {
        params.append("type", mealTypeFilters.join(","))
      }

      if (maxTime < 120) {
        params.append("maxReadyTime", maxTime.toString())
      }

      // If user selected difficulty
      if (difficultyFilters.includes("Easy") && !params.has("maxReadyTime")) {
        params.append("maxReadyTime", "25")
      }

      const response = await fetch(`/api/recipes/search?${params.toString()}`)

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `API request failed with status ${response.status}`)
      }

      const data = await response.json()
      const results: SearchResult[] = data.results || []
      setRecipes(results)
      setTotalResults(data.totalResults || results.length)

      setAllFetchedRecipes((prev) => {
        const combined = [...prev, ...results]
        return combined.filter((r, idx, self) => idx === self.findIndex((x) => x.id === r.id))
      })
    } catch (err) {
      console.error("Error fetching recipes:", err)
      setError(err instanceof Error ? err.message : "Failed to fetch recipes")
      setRecipes([])
      setTotalResults(0)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setCurrentPage(1)
    setSubmittedQuery(searchQuery.trim())
  }

  const addFilter = (filter: string, type: "cuisine" | "diet" | "mealType" | "difficulty") => {
    if (!activeFilters.includes(filter)) {
      setActiveFilters([...activeFilters, filter])
    }

    switch (type) {
      case "cuisine":
        if (!cuisineFilters.includes(filter)) setCuisineFilters([...cuisineFilters, filter])
        break
      case "diet":
        if (!dietFilters.includes(filter)) setDietFilters([...dietFilters, filter])
        break
      case "mealType":
        if (!mealTypeFilters.includes(filter)) setMealTypeFilters([...mealTypeFilters, filter])
        break
      case "difficulty":
        if (!difficultyFilters.includes(filter)) setDifficultyFilters([...difficultyFilters, filter])
        break
    }
    setCurrentPage(1)
  }

  const removeFilter = (filter: string) => {
    setActiveFilters(activeFilters.filter((f) => f !== filter))
    setCuisineFilters(cuisineFilters.filter((f) => f !== filter))
    setDietFilters(dietFilters.filter((f) => f !== filter))
    setMealTypeFilters(mealTypeFilters.filter((f) => f !== filter))
    setDifficultyFilters(difficultyFilters.filter((f) => f !== filter))
    setCurrentPage(1)
  }

  const clearFilters = () => {
    setActiveFilters([])
    setCuisineFilters([])
    setDietFilters([])
    setMealTypeFilters([])
    setDifficultyFilters([])
    setMaxTime(120)
    setSearchQuery("")
    setSubmittedQuery("")
    setCurrentPage(1)
  }

  const handleTimeChange = (value: number[]) => {
    const time = value[0]
    setMaxTime(time)
    const existingTimeFilters = activeFilters.filter((f) => !f.includes("Under"))
    if (time < 120) {
      setActiveFilters([...existingTimeFilters, `Under ${time} min`])
    } else {
      setActiveFilters(existingTimeFilters)
    }
    setCurrentPage(1)
  }

  const totalPages = Math.max(1, Math.ceil(totalResults / resultsPerPage))
  const pageNumbers = totalPages <= 7
    ? Array.from({ length: totalPages }, (_, index) => index + 1)
    : Array.from(new Set([1, 2, 3, currentPage - 1, currentPage, currentPage + 1, totalPages - 1, totalPages])).filter((page) => page > 0 && page <= totalPages).sort((a, b) => a - b)

  // Saved recipes from loaded list matching user saved ids
  const savedRecipesList = hydratedSavedRecipes.filter((r) => user?.savedRecipeIds?.includes(r.id))

  // For You recipes prioritizing user's preferences
  const personalizedRecipes = [...recipes].sort((a, b) => {
    const score = (recipe: SearchResult) => {
      const text = `${recipe.title} ${recipe.image}`.toLowerCase()
      const cuisineMatch = user?.favoriteCuisines?.some((cuisine) => text.includes(cuisine.toLowerCase())) ? 2 : 0
      const savedMatch = user?.savedRecipeIds?.includes(recipe.id) ? 1 : 0
      const likedMatch = user?.likedRecipeIds?.includes(recipe.id) ? 1 : 0
      return cuisineMatch + savedMatch + likedMatch
    }
    return score(b) - score(a)
  })

  const displayRecipes =
    activeTab === "all" ? recipes : activeTab === "personalized" ? personalizedRecipes : savedRecipesList

  return (
    <div className="min-h-screen bg-gray-50/50 pb-16">
      <DashboardHeader />

      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-xs">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Explore Recipes</h1>
            <p className="text-gray-500 text-sm mt-1">Discover, filter, and master chef-curated meals</p>
          </div>

          <form onSubmit={handleSearch} className="flex items-center space-x-2 w-full md:w-auto">
            <div className="relative flex-1 md:w-[320px]">
              <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search ingredients, pasta, chicken..."
                className="pl-10 pr-8 bg-gray-50/70 border-gray-200"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
            <Button type="submit" className="bg-amber-600 hover:bg-amber-700 text-white">
              Search
            </Button>
          </form>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-sm flex items-center justify-between">
            <p>{error}</p>
            <Button variant="outline" size="sm" onClick={clearFilters} className="bg-white">
              Reset Filters
            </Button>
          </div>
        )}

        {activeFilters.length > 0 && (
          <div className="mb-6 flex flex-wrap items-center gap-2 bg-white p-3.5 rounded-xl border border-gray-100">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider mr-1">Active Filters:</span>
            {activeFilters.map((filter) => (
              <Badge key={filter} variant="secondary" className="bg-amber-50 text-amber-900 border border-amber-200 py-1 pl-2.5 pr-1.5 flex items-center gap-1">
                <span className="text-xs">{filter}</span>
                <button onClick={() => removeFilter(filter)} className="rounded-full hover:bg-amber-200 p-0.5">
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
            <Button variant="ghost" size="sm" onClick={clearFilters} className="text-xs text-amber-700 h-7 px-2">
              Clear All
            </Button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          {/* Filters Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-xs border border-gray-200/80 p-5">
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-100">
                <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                  <SlidersHorizontal className="h-4 w-4 text-amber-600" />
                  Filter By
                </h2>
                {activeFilters.length > 0 && (
                  <button onClick={clearFilters} className="text-xs text-amber-600 hover:underline">
                    Reset
                  </button>
                )}
              </div>

              <Accordion type="multiple" defaultValue={["meal-type", "cuisine", "diet"]} className="w-full">
                <AccordionItem value="meal-type">
                  <AccordionTrigger className="text-sm font-semibold py-2.5">Meal Type</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2 pt-1">
                      {["breakfast", "main course", "dessert", "salad", "soup", "appetizer"].map((type) => (
                        <div key={type} className="flex items-center space-x-2">
                          <Checkbox
                            id={`meal-${type}`}
                            checked={mealTypeFilters.includes(type)}
                            onCheckedChange={(checked) => {
                              if (checked) addFilter(type, "mealType")
                              else removeFilter(type)
                            }}
                          />
                          <Label htmlFor={`meal-${type}`} className="text-xs font-medium text-gray-700 capitalize cursor-pointer">
                            {type}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="diet">
                  <AccordionTrigger className="text-sm font-semibold py-2.5">Dietary Preference</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2 pt-1">
                      {["vegetarian", "vegan", "gluten free", "dairy free", "ketogenic", "paleo"].map((diet) => (
                        <div key={diet} className="flex items-center space-x-2">
                          <Checkbox
                            id={`diet-${diet}`}
                            checked={dietFilters.includes(diet)}
                            onCheckedChange={(checked) => {
                              if (checked) addFilter(diet, "diet")
                              else removeFilter(diet)
                            }}
                          />
                          <Label htmlFor={`diet-${diet}`} className="text-xs font-medium text-gray-700 capitalize cursor-pointer">
                            {diet}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="cuisine">
                  <AccordionTrigger className="text-sm font-semibold py-2.5">Cuisine</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2 pt-1">
                      {["italian", "mexican", "chinese", "japanese", "indian", "thai", "mediterranean", "french", "american"].map((cuisine) => (
                        <div key={cuisine} className="flex items-center space-x-2">
                          <Checkbox
                            id={`cuisine-${cuisine}`}
                            checked={cuisineFilters.includes(cuisine)}
                            onCheckedChange={(checked) => {
                              if (checked) addFilter(cuisine, "cuisine")
                              else removeFilter(cuisine)
                            }}
                          />
                          <Label htmlFor={`cuisine-${cuisine}`} className="text-xs font-medium text-gray-700 capitalize cursor-pointer">
                            {cuisine}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="time">
                  <AccordionTrigger className="text-sm font-semibold py-2.5">Cooking Time</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-3 pt-1">
                      <div className="flex justify-between text-[11px] text-gray-400 font-medium">
                        <span>15 min</span>
                        <span>120+ min</span>
                      </div>
                      <Slider value={[maxTime]} max={120} min={15} step={15} onValueChange={handleTimeChange} />
                      <div className="text-center text-xs text-amber-700 font-semibold bg-amber-50 py-1 rounded-md">
                        {maxTime >= 120 ? "Any Duration" : `Under ${maxTime} minutes`}
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>

          {/* Recipes Grid */}
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-white rounded-2xl shadow-xs border border-gray-200/80 p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-4 border-b border-gray-100">
                <Tabs defaultValue="all" value={activeTab} className="w-full sm:w-auto" onValueChange={setActiveTab}>
                  <TabsList className="bg-gray-100/80">
                    <TabsTrigger value="all">All Recipes ({totalResults})</TabsTrigger>
                    <TabsTrigger value="personalized">For You</TabsTrigger>
                    <TabsTrigger value="saved">Saved ({user?.savedRecipeIds?.length || 0})</TabsTrigger>
                  </TabsList>
                </Tabs>

                <div className="flex items-center space-x-2 w-full sm:w-auto">
                  <Select value={sortOption} onValueChange={(val) => { setSortOption(val); setCurrentPage(1); }}>
                    <SelectTrigger className="w-full sm:w-[170px] text-xs">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="popularity">Most Popular</SelectItem>
                      <SelectItem value="time">Quickest</SelectItem>
                      <SelectItem value="healthiness">Healthiest</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <RecipeCardSkeleton key={i} />
                  ))}
                </div>
              ) : displayRecipes.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {displayRecipes.map((recipe) => (
                    <RecipeCard key={recipe.id} recipe={recipe} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 bg-gray-50/50 rounded-xl border border-dashed border-gray-200 p-8">
                  {activeTab === "saved" ? (
                    <>
                      <Bookmark className="h-10 w-10 text-amber-500 mx-auto mb-3" />
                      <h3 className="font-bold text-gray-900 text-lg mb-1">No Saved Recipes Yet</h3>
                      <p className="text-gray-500 text-sm mb-4">Click the bookmark icon on any recipe card to save it here.</p>
                      <Button onClick={() => setActiveTab("all")} className="bg-amber-600 hover:bg-amber-700 text-white">
                        <BookOpen className="h-4 w-4 mr-2" />
                        Explore Recipes
                      </Button>
                    </>
                  ) : (
                    <>
                      <h3 className="font-bold text-gray-900 text-lg mb-1">No Recipes Found</h3>
                      <p className="text-gray-500 text-sm mb-4">Try adjusting your search terms or clearing some filters.</p>
                      <Button onClick={clearFilters} className="bg-amber-600 hover:bg-amber-700 text-white">
                        Clear Filters
                      </Button>
                    </>
                  )}
                </div>
              )}

              {/* Pagination */}
              {activeTab === "all" && totalPages > 1 && (
                <div className="flex justify-center items-center gap-1.5 mt-8 pt-4 border-t border-gray-100">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    className="text-xs"
                  >
                    Previous
                  </Button>
                  {pageNumbers.map((page, index) => (
                    index > 0 && page - pageNumbers[index - 1] > 1 ? (
                      <span key={`gap-${page}`} className="px-1 text-xs text-gray-400">...</span>
                    ) : null
                  )).filter(Boolean)}
                  {pageNumbers.map((page) => (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(page)}
                      className={`w-8 h-8 p-0 text-xs ${currentPage === page ? "bg-amber-600 hover:bg-amber-700 text-white" : ""}`}
                    >
                      {page}
                    </Button>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    className="text-xs"
                  >
                    Next
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

function RecipeCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-xs">
      <div className="aspect-video bg-gray-100 animate-pulse" />
      <div className="p-4 space-y-3">
        <div className="h-5 bg-gray-100 rounded-md animate-pulse w-3/4" />
        <div className="flex space-x-3">
          <div className="h-3.5 w-16 bg-gray-100 rounded animate-pulse" />
          <div className="h-3.5 w-16 bg-gray-100 rounded animate-pulse" />
        </div>
      </div>
      <div className="p-3 border-t border-gray-50 flex justify-between bg-gray-50/50">
        <div className="h-7 w-14 bg-gray-100 rounded animate-pulse" />
        <div className="h-7 w-14 bg-gray-100 rounded animate-pulse" />
      </div>
    </div>
  )
}

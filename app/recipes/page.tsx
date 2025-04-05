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
import { Search, Filter, X } from "lucide-react"
import DashboardHeader from "@/components/dashboard-header"
import RecipeCard from "@/components/recipe-card"
import type { SearchResult } from "@/lib/api"

export default function RecipesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeFilters, setActiveFilters] = useState<string[]>([])
  const [recipes, setRecipes] = useState<SearchResult[]>([])
  const [savedRecipes, setSavedRecipes] = useState<SearchResult[]>([])
  const [personalizedRecipes, setPersonalizedRecipes] = useState<SearchResult[]>([])
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

  useEffect(() => {
    // Fetch initial recipes
    fetchRecipes()

    // For demo purposes, fetch some recipes for personalized and saved tabs
    fetchPersonalizedRecipes()
    fetchSavedRecipes()
  }, [currentPage, sortOption])

  // Separate effect for filters to avoid too many API calls
  useEffect(() => {
    if (activeTab === "all") {
      fetchRecipes()
    }
  }, [cuisineFilters, dietFilters, mealTypeFilters, maxTime, difficultyFilters, activeTab])

  const fetchRecipes = async () => {
    setIsLoading(true)
    setError(null)

    try {
      // Build query parameters
      const params = new URLSearchParams({
        sort: sortOption,
        number: resultsPerPage.toString(),
        offset: ((currentPage - 1) * resultsPerPage).toString(),
      })

      // Only add search query if it's not empty
      if (searchQuery.trim()) {
        params.append("query", searchQuery)
      }

      // Add cuisine filters
      if (cuisineFilters.length > 0) {
        params.append("cuisine", cuisineFilters.join(","))
      }

      // Add diet filters
      if (dietFilters.length > 0) {
        params.append("diet", dietFilters.join(","))
      }

      // Add meal type filters
      if (mealTypeFilters.length > 0) {
        params.append("type", mealTypeFilters.join(","))
      }

      // Add max cooking time
      if (maxTime < 120) {
        params.append("maxReadyTime", maxTime.toString())
      }

      const response = await fetch(`/api/recipes/search?${params.toString()}`)

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `API request failed with status ${response.status}`)
      }

      const data = await response.json()
      setRecipes(data.results || [])
      setTotalResults(data.totalResults || 0)
    } catch (error) {
      console.error("Error fetching recipes:", error)
      setError(error instanceof Error ? error.message : "Failed to fetch recipes")
      setRecipes([])
      setTotalResults(0)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchPersonalizedRecipes = async () => {
    try {
      const response = await fetch("/api/recipes/random?number=6")

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`)
      }

      const data = await response.json()
      setPersonalizedRecipes(data || [])
    } catch (error) {
      console.error("Error fetching personalized recipes:", error)
      setPersonalizedRecipes([])
    }
  }

  const fetchSavedRecipes = async () => {
    try {
      // In a real app, this would fetch from a user's saved recipes
      // For demo, we'll just fetch some random recipes
      const response = await fetch("/api/recipes/random?number=6")

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`)
      }

      const data = await response.json()
      setSavedRecipes(data || [])
    } catch (error) {
      console.error("Error fetching saved recipes:", error)
      setSavedRecipes([])
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setCurrentPage(1) // Reset to first page on new search
    fetchRecipes()
  }

  const addFilter = (filter: string, type: "cuisine" | "diet" | "mealType" | "difficulty") => {
    if (!activeFilters.includes(filter)) {
      setActiveFilters([...activeFilters, filter])
    }

    // Update specific filter arrays
    switch (type) {
      case "cuisine":
        if (!cuisineFilters.includes(filter)) {
          setCuisineFilters([...cuisineFilters, filter])
        }
        break
      case "diet":
        if (!dietFilters.includes(filter)) {
          setDietFilters([...dietFilters, filter])
        }
        break
      case "mealType":
        if (!mealTypeFilters.includes(filter)) {
          setMealTypeFilters([...mealTypeFilters, filter])
        }
        break
      case "difficulty":
        if (!difficultyFilters.includes(filter)) {
          setDifficultyFilters([...difficultyFilters, filter])
        }
        break
    }

    // Reset to first page when adding filters
    setCurrentPage(1)
  }

  const removeFilter = (filter: string) => {
    setActiveFilters(activeFilters.filter((f) => f !== filter))

    // Remove from specific filter arrays
    setCuisineFilters(cuisineFilters.filter((f) => f !== filter))
    setDietFilters(dietFilters.filter((f) => f !== filter))
    setMealTypeFilters(mealTypeFilters.filter((f) => f !== filter))
    setDifficultyFilters(difficultyFilters.filter((f) => f !== filter))

    // Reset to first page when removing filters
    setCurrentPage(1)
  }

  const clearFilters = () => {
    setActiveFilters([])
    setCuisineFilters([])
    setDietFilters([])
    setMealTypeFilters([])
    setDifficultyFilters([])
    setMaxTime(120)
    setCurrentPage(1)
  }

  const handleTimeChange = (value: number[]) => {
    const time = value[0]
    setMaxTime(time)

    // Update active filters
    const existingTimeFilters = activeFilters.filter((f) => !f.includes("Under"))
    setActiveFilters([...existingTimeFilters, `Under ${time} min`])

    // Reset to first page
    setCurrentPage(1)
  }

  const handleTabChange = (value: string) => {
    setActiveTab(value)
  }

  const handleSortChange = (value: string) => {
    setSortOption(value)
    setCurrentPage(1)
  }

  const totalPages = Math.ceil(totalResults / resultsPerPage)

  // Determine which recipes to display based on active tab
  const displayRecipes =
    activeTab === "all" ? recipes : activeTab === "personalized" ? personalizedRecipes : savedRecipes

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />

      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Recipes</h1>
            <p className="text-gray-600">Discover delicious recipes tailored to your preferences</p>
          </div>
          <form onSubmit={handleSearch} className="flex space-x-2 w-full md:w-auto">
            <div className="relative flex-1 md:w-[300px]">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search recipes..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button type="submit" variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </form>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md text-red-600">
            <p>{error}</p>
            <Button
              variant="link"
              className="p-0 h-auto text-red-600"
              onClick={() => {
                setError(null)
                clearFilters()
                fetchRecipes()
              }}
            >
              Try again with default settings
            </Button>
          </div>
        )}

        {activeFilters.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-medium text-gray-700">Active Filters:</h2>
              <Button variant="link" size="sm" className="h-auto p-0 text-amber-600" onClick={clearFilters}>
                Clear All
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {activeFilters.map((filter) => (
                <Badge key={filter} variant="secondary" className="bg-amber-50 text-amber-800 hover:bg-amber-100">
                  {filter}
                  <button
                    onClick={() => removeFilter(filter)}
                    className="ml-1 rounded-full hover:bg-amber-200 h-4 w-4 inline-flex items-center justify-center"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">Filters</h2>

              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="meal-type">
                  <AccordionTrigger className="text-sm font-medium">Meal Type</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2">
                      {["breakfast", "main course", "dessert", "appetizer", "salad", "soup"].map((type) => (
                        <div key={type} className="flex items-center space-x-2">
                          <Checkbox
                            id={`meal-${type.toLowerCase().replace(/\s/g, "-")}`}
                            checked={mealTypeFilters.includes(type)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                addFilter(type, "mealType")
                              } else {
                                removeFilter(type)
                              }
                            }}
                          />
                          <Label
                            htmlFor={`meal-${type.toLowerCase().replace(/\s/g, "-")}`}
                            className="text-sm font-normal capitalize"
                          >
                            {type}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="diet">
                  <AccordionTrigger className="text-sm font-medium">Dietary Restrictions</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2">
                      {["vegetarian", "vegan", "gluten free", "dairy free", "ketogenic", "paleo", "low fodmap"].map(
                        (diet) => (
                          <div key={diet} className="flex items-center space-x-2">
                            <Checkbox
                              id={`diet-${diet.toLowerCase().replace(/\s/g, "-")}`}
                              checked={dietFilters.includes(diet)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  addFilter(diet, "diet")
                                } else {
                                  removeFilter(diet)
                                }
                              }}
                            />
                            <Label
                              htmlFor={`diet-${diet.toLowerCase().replace(/\s/g, "-")}`}
                              className="text-sm font-normal capitalize"
                            >
                              {diet}
                            </Label>
                          </div>
                        ),
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="cuisine">
                  <AccordionTrigger className="text-sm font-medium">Cuisine</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2">
                      {[
                        "italian",
                        "mexican",
                        "chinese",
                        "japanese",
                        "indian",
                        "thai",
                        "mediterranean",
                        "french",
                        "american",
                      ].map((cuisine) => (
                        <div key={cuisine} className="flex items-center space-x-2">
                          <Checkbox
                            id={`cuisine-${cuisine.toLowerCase()}`}
                            checked={cuisineFilters.includes(cuisine)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                addFilter(cuisine, "cuisine")
                              } else {
                                removeFilter(cuisine)
                              }
                            }}
                          />
                          <Label
                            htmlFor={`cuisine-${cuisine.toLowerCase()}`}
                            className="text-sm font-normal capitalize"
                          >
                            {cuisine}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="time">
                  <AccordionTrigger className="text-sm font-medium">Cooking Time</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-xs text-gray-500">0 min</span>
                          <span className="text-xs text-gray-500">120+ min</span>
                        </div>
                        <Slider value={[maxTime]} max={120} step={15} onValueChange={handleTimeChange} />
                        <div className="text-center text-sm text-amber-600 font-medium mt-2">
                          Under {maxTime} minutes
                        </div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="difficulty">
                  <AccordionTrigger className="text-sm font-medium">Difficulty</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2">
                      {["Easy", "Medium", "Hard"].map((difficulty) => (
                        <div key={difficulty} className="flex items-center space-x-2">
                          <Checkbox
                            id={`difficulty-${difficulty.toLowerCase()}`}
                            checked={difficultyFilters.includes(difficulty)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                addFilter(difficulty, "difficulty")
                              } else {
                                removeFilter(difficulty)
                              }
                            }}
                          />
                          <Label htmlFor={`difficulty-${difficulty.toLowerCase()}`} className="text-sm font-normal">
                            {difficulty}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <Tabs defaultValue="all" className="w-full sm:w-auto" onValueChange={handleTabChange}>
                  <TabsList>
                    <TabsTrigger value="all">All Recipes</TabsTrigger>
                    <TabsTrigger value="personalized">For You</TabsTrigger>
                    <TabsTrigger value="saved">Saved</TabsTrigger>
                  </TabsList>
                </Tabs>

                <div className="flex items-center space-x-2 w-full sm:w-auto">
                  <Select defaultValue="popularity" onValueChange={handleSortChange}>
                    <SelectTrigger className="w-full sm:w-[180px]">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="popularity">Relevance</SelectItem>
                      <SelectItem value="time">Cooking Time</SelectItem>
                      <SelectItem value="healthiness">Healthiness</SelectItem>
                      <SelectItem value="random">Random</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <RecipeCardSkeleton key={i} />
                  ))}
                </div>
              ) : displayRecipes.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {displayRecipes.map((recipe) => (
                    <RecipeCard key={recipe.id} recipe={recipe} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500 mb-4">No recipes found matching your criteria.</p>
                  <Button onClick={clearFilters} className="bg-amber-600 hover:bg-amber-700">
                    Clear Filters
                  </Button>
                </div>
              )}

              {activeTab === "all" && totalPages > 1 && (
                <div className="flex justify-center mt-8">
                  <div className="flex space-x-1">
                    <Button
                      variant="outline"
                      size="icon"
                      className="w-8 h-8"
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(currentPage - 1)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="15 18 9 12 15 6" />
                      </svg>
                    </Button>

                    {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                      // Logic to show current page and surrounding pages
                      let pageNum = i + 1
                      if (totalPages > 5) {
                        if (currentPage > 3 && currentPage < totalPages - 1) {
                          pageNum = currentPage - 2 + i
                        } else if (currentPage >= totalPages - 1) {
                          pageNum = totalPages - 4 + i
                        }
                      }

                      return (
                        <Button
                          key={i}
                          variant="outline"
                          size="sm"
                          className={`w-8 h-
                          size="sm" 
                          className={\`w-8 h-8 ${
                            pageNum === currentPage ? "bg-amber-600 text-white hover:bg-amber-700" : ""
                          }`}
                          onClick={() => setCurrentPage(pageNum)}
                        >
                          {pageNum}
                        </Button>
                      )
                    })}

                    {totalPages > 5 && currentPage < totalPages - 2 && (
                      <>
                        <Button variant="outline" size="sm" className="w-8 h-8">
                          ...
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-8 h-8"
                          onClick={() => setCurrentPage(totalPages)}
                        >
                          {totalPages}
                        </Button>
                      </>
                    )}

                    <Button
                      variant="outline"
                      size="icon"
                      className="w-8 h-8"
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage(currentPage + 1)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="9 18 15 12 9 6" />
                      </svg>
                    </Button>
                  </div>
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
    <div className="overflow-hidden rounded-lg border bg-white shadow">
      <div className="aspect-video bg-gray-200 animate-pulse" />
      <div className="p-4">
        <div className="h-6 bg-gray-200 rounded animate-pulse mb-2" />
        <div className="flex items-center text-sm text-gray-500 space-x-4 mb-3">
          <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
          <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
        </div>
        <div className="flex items-center mt-3">
          <div className="flex space-x-1">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="w-4 h-4 bg-gray-200 rounded animate-pulse" />
            ))}
          </div>
          <div className="h-4 w-16 bg-gray-200 rounded animate-pulse ml-2" />
        </div>
      </div>
      <div className="p-4 pt-0 flex justify-between">
        <div className="h-8 w-16 bg-gray-200 rounded animate-pulse" />
        <div className="h-8 w-16 bg-gray-200 rounded animate-pulse" />
      </div>
    </div>
  )
}


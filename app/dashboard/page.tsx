"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Clock, ChefHat, Heart, Bookmark, Search, TrendingUp, Utensils } from "lucide-react"
import DashboardHeader from "@/components/dashboard-header"
import RecipeCard from "@/components/recipe-card"
import MoodSelector from "@/components/mood-selector"
import type { SearchResult } from "@/lib/api"

export default function Dashboard() {
  const [forYouRecipes, setForYouRecipes] = useState<SearchResult[]>([])
  const [trendingRecipes, setTrendingRecipes] = useState<SearchResult[]>([])
  const [savedRecipes, setSavedRecipes] = useState<SearchResult[]>([])
  const [moodRecipes, setMoodRecipes] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isMoodLoading, setIsMoodLoading] = useState(false)

  useEffect(() => {
    // Fetch initial recipes
    const fetchInitialRecipes = async () => {
      setIsLoading(true)
      try {
        // Fetch personalized recipes
        const forYouResponse = await fetch("/api/recipes/search?sort=popularity&number=6")
        const forYouData = await forYouResponse.json()
        setForYouRecipes(forYouData.results || [])

        // Fetch trending recipes
        const trendingResponse = await fetch("/api/recipes/search?sort=trending&number=3")
        const trendingData = await trendingResponse.json()
        setTrendingRecipes(trendingData.results || [])

        // For demo purposes, just use some of the same recipes for "saved"
        setSavedRecipes((forYouData.results || []).slice(0, 2))
      } catch (error) {
        console.error("Error fetching initial recipes:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchInitialRecipes()
  }, [])

  const handleMoodSelect = (recipes: SearchResult[]) => {
    setMoodRecipes(recipes)
  }

  const handleMoodLoading = (loading: boolean) => {
    setIsMoodLoading(loading)
  }

  // Determine which recipes to show in the "For You" tab
  const displayRecipes = moodRecipes.length > 0 ? moodRecipes : forYouRecipes

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />

      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Main Content */}
          <div className="flex-1 space-y-6">
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-800">Welcome back, Alex!</h2>
                <Link href="/recipes">
                  <Button variant="ghost" size="sm" className="text-amber-600">
                    <Search className="h-4 w-4 mr-2" />
                    Search Recipes
                  </Button>
                </Link>
              </div>

              <MoodSelector onMoodSelect={handleMoodSelect} onLoading={handleMoodLoading} />

              <Tabs defaultValue="for-you" className="w-full">
                <TabsList className="w-full max-w-md mx-auto grid grid-cols-3">
                  <TabsTrigger value="for-you">For You</TabsTrigger>
                  <TabsTrigger value="trending">Trending</TabsTrigger>
                  <TabsTrigger value="saved">Saved</TabsTrigger>
                </TabsList>
                <TabsContent value="for-you" className="mt-6">
                  {isLoading || isMoodLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {[1, 2, 3, 4, 5, 6].map((i) => (
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
                      <p className="text-gray-500">No recipes found. Try a different mood or check back later.</p>
                    </div>
                  )}
                </TabsContent>
                <TabsContent value="trending" className="mt-6">
                  {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {[1, 2, 3].map((i) => (
                        <RecipeCardSkeleton key={i} />
                      ))}
                    </div>
                  ) : trendingRecipes.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {trendingRecipes.map((recipe) => (
                        <RecipeCard key={recipe.id} recipe={recipe} />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <p className="text-gray-500">No trending recipes found. Check back later.</p>
                    </div>
                  )}
                </TabsContent>
                <TabsContent value="saved" className="mt-6">
                  {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {[1, 2].map((i) => (
                        <RecipeCardSkeleton key={i} />
                      ))}
                    </div>
                  ) : savedRecipes.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {savedRecipes.map((recipe) => (
                        <RecipeCard key={recipe.id} recipe={recipe} />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <p className="text-gray-500">No saved recipes yet. Start exploring and save your favorites!</p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </section>

            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-800">Community Favorites</h2>
                <Button variant="link" className="text-amber-600">
                  View All
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {isLoading
                  ? [1, 2, 3].map((i) => <CommunityCardSkeleton key={i} />)
                  : [1, 2, 3].map((i) => (
                      <Card key={i} className="overflow-hidden hover:shadow-lg transition-shadow">
                        <div className="aspect-video relative">
                          <img
                            src={forYouRecipes[i]?.image || `/placeholder.svg?height=200&width=300`}
                            alt={`Community recipe ${i}`}
                            className="object-cover w-full h-full"
                          />
                          <div className="absolute top-2 right-2">
                            <Badge className="bg-white text-amber-600 hover:bg-gray-100">
                              <TrendingUp className="h-3 w-3 mr-1" />
                              Popular
                            </Badge>
                          </div>
                        </div>
                        <CardHeader className="p-4 pb-0">
                          <div className="flex items-center space-x-2 mb-2">
                            <Avatar className="h-6 w-6">
                              <AvatarImage src={`/placeholder.svg?height=50&width=50`} />
                              <AvatarFallback>U{i}</AvatarFallback>
                            </Avatar>
                            <span className="text-sm text-gray-600">@user{i}</span>
                          </div>
                          <CardTitle className="text-lg">
                            {forYouRecipes[i]?.title || `Amazing Community Recipe ${i}`}
                          </CardTitle>
                        </CardHeader>
                        <CardFooter className="p-4 pt-2 flex justify-between">
                          <div className="flex items-center text-gray-500 text-sm">
                            <Heart className="h-4 w-4 mr-1 text-red-500" />
                            {120 + i * 10}
                          </div>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Bookmark className="h-4 w-4 text-amber-600" />
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="w-full md:w-80 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Your Profile</CardTitle>
                <CardDescription>Personalize your experience</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src="/placeholder.svg?height=100&width=100" />
                    <AvatarFallback>AL</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">Alex Lee</p>
                    <p className="text-sm text-gray-500">Joined April 2025</p>
                  </div>
                </div>
                <div className="mt-6 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Recipes Saved</span>
                    <span className="font-medium">24</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Recipes Cooked</span>
                    <span className="font-medium">12</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Favorite Cuisine</span>
                    <span className="font-medium">Italian</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  Edit Profile
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Cooking Tips</CardTitle>
                <CardDescription>Based on your skill level</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="bg-amber-100 p-2 rounded-full">
                    <ChefHat className="h-5 w-5 text-amber-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">Knife Skills</h4>
                    <p className="text-xs text-gray-500">Learn proper cutting techniques for faster prep</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="bg-amber-100 p-2 rounded-full">
                    <Clock className="h-5 w-5 text-amber-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">Meal Prep</h4>
                    <p className="text-xs text-gray-500">Save time by prepping ingredients in advance</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="bg-amber-100 p-2 rounded-full">
                    <Utensils className="h-5 w-5 text-amber-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">Flavor Pairing</h4>
                    <p className="text-xs text-gray-500">Discover complementary ingredients for better taste</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="link" className="w-full text-amber-600">
                  View All Tips
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Upcoming Events</CardTitle>
                <CardDescription>Join cooking classes and workshops</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border-l-2 border-amber-500 pl-3">
                  <p className="font-medium text-sm">Virtual Cooking Class</p>
                  <p className="text-xs text-gray-500">May 15, 2025 • 6:00 PM</p>
                </div>
                <div className="border-l-2 border-gray-200 pl-3">
                  <p className="font-medium text-sm">Seasonal Ingredients Workshop</p>
                  <p className="text-xs text-gray-500">May 22, 2025 • 5:30 PM</p>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="link" className="w-full text-amber-600">
                  View Calendar
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}

function RecipeCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <div className="aspect-video bg-gray-200 animate-pulse" />
      <CardContent className="p-4">
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
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between">
        <div className="h-8 w-16 bg-gray-200 rounded animate-pulse" />
        <div className="h-8 w-16 bg-gray-200 rounded animate-pulse" />
      </CardFooter>
    </Card>
  )
}

function CommunityCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <div className="aspect-video bg-gray-200 animate-pulse" />
      <CardHeader className="p-4 pb-0">
        <div className="flex items-center space-x-2 mb-2">
          <div className="h-6 w-6 bg-gray-200 rounded-full animate-pulse" />
          <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
        </div>
        <div className="h-6 bg-gray-200 rounded animate-pulse" />
      </CardHeader>
      <CardFooter className="p-4 pt-2 flex justify-between">
        <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
        <div className="h-8 w-8 bg-gray-200 rounded animate-pulse" />
      </CardFooter>
    </Card>
  )
}


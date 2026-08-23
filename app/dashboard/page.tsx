"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Clock, ChefHat, Heart, Bookmark, Search, TrendingUp, Utensils, Sparkles, Calendar, BookOpen, Plus, Pencil, Trash2 } from "lucide-react"
import DashboardHeader from "@/components/dashboard-header"
import RecipeCard from "@/components/recipe-card"
import MoodSelector from "@/components/mood-selector"
import type { SearchResult } from "@/lib/api"
import { useAuth } from "@/context/auth-context"
import { toast } from "sonner"
import { hydrateRecipes } from "@/lib/recipe-client"
import { calculateTasteDNA, rankRecipes } from "@/lib/recommendations"

export default function Dashboard() {
  const { user, isRecipeSaved, toggleSaveRecipe, isRecipeLiked, toggleLikeRecipe, updateProfile, recordMood, createCollection, renameCollection, deleteCollection } = useAuth()
  const [forYouRecipes, setForYouRecipes] = useState<SearchResult[]>([])
  const [trendingRecipes, setTrendingRecipes] = useState<SearchResult[]>([])
  const [moodRecipes, setMoodRecipes] = useState<SearchResult[]>([])
  const [hydratedSavedRecipes, setHydratedSavedRecipes] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isMoodLoading, setIsMoodLoading] = useState(false)

  // Modals state
  const [editProfileOpen, setEditProfileOpen] = useState(false)
  const [tipsModalOpen, setTipsModalOpen] = useState(false)
  const [calendarModalOpen, setCalendarModalOpen] = useState(false)
  const [editName, setEditName] = useState(user?.name || "")
  const [editCuisine, setEditCuisine] = useState(user?.favoriteCuisines?.[0] || "Italian")
  const [collectionName, setCollectionName] = useState("")

  useEffect(() => {
    if (user) {
      setEditName(user.name)
      setEditCuisine(user.favoriteCuisines?.[0] || "Italian")
    }
  }, [user])

  useEffect(() => {
    const fetchInitialRecipes = async () => {
      setIsLoading(true)
      try {
        const params = new URLSearchParams({ sort: "popularity", number: "6" })
        const selectedDiet = user?.dietaryRestrictions?.find((diet) => diet.toLowerCase() === "vegan") || user?.dietaryRestrictions?.find((diet) => diet.toLowerCase() === "vegetarian") || user?.dietaryRestrictions?.[0]
        if (selectedDiet) params.set("diet", selectedDiet)
        if (user?.favoriteCuisines?.length) params.set("cuisine", user.favoriteCuisines.join(","))
        const timeMatch = user?.cookingTime?.match(/(\d+)\D+(\d+)/)
        if (timeMatch) params.set("maxReadyTime", timeMatch[2])
        const [forYouResponse, trendingResponse] = await Promise.all([
          fetch(`/api/recipes/search?${params.toString()}`),
          fetch("/api/recipes/random?number=6"),
        ])
        const [forYouData, trendingData] = await Promise.all([
          forYouResponse.json(),
          trendingResponse.json(),
        ])
        setForYouRecipes(forYouData.results || [])
        setTrendingRecipes(trendingData || [])
      } catch (error) {
        console.error("Error fetching initial recipes:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchInitialRecipes()
  }, [user?.id])

  useEffect(() => {
    let cancelled = false
    hydrateRecipes(user?.savedRecipeIds || []).then((recipes) => {
      if (!cancelled) setHydratedSavedRecipes(recipes)
    })
    return () => { cancelled = true }
  }, [user?.savedRecipeIds])

  const handleMoodSelect = (recipes: SearchResult[]) => {
    setMoodRecipes(recipes)
  }

  const handleMoodLoading = (loading: boolean) => {
    setIsMoodLoading(loading)
  }

  const handleSaveProfile = () => {
    if (!editName.trim()) {
      toast.error("Name cannot be empty")
      return
    }
    updateProfile({
      name: editName.trim(),
      favoriteCuisines: [editCuisine.trim(), ...(user?.favoriteCuisines?.slice(1) || [])],
    })
    toast.success("Profile updated successfully")
    setEditProfileOpen(false)
  }

  // Saved recipes list from both feeds
  const allLoadedRecipes = [...forYouRecipes, ...trendingRecipes, ...moodRecipes]
  const savedRecipes = hydratedSavedRecipes.filter((recipe) => user?.savedRecipeIds?.includes(recipe.id))

  const displayRecipes = moodRecipes.length > 0 ? moodRecipes : forYouRecipes
  const rankedRecipes = user ? rankRecipes(displayRecipes, user, moodRecipes.length > 0 ? (user.moodHistory || []).at(-1)?.mood : undefined) : displayRecipes
  const tasteDNA = user ? calculateTasteDNA(user) : []
  const lastMood = user?.moodHistory?.at(-1)?.mood

  const getInitials = (name: string) => {
    if (!name) return "AL"
    const parts = name.split(" ")
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
    return name.slice(0, 2).toUpperCase()
  }

  return (
    <div className="min-h-screen bg-gray-50/50">
      <DashboardHeader />

      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Main Content Area */}
          <div className="flex-1 w-full space-y-8">
            <section className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-2xl border border-gray-100 shadow-xs">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
                    Welcome back, {user?.name || "Alex"}!
                    <Sparkles className="h-5 w-5 text-amber-500 fill-amber-400" />
                  </h2>
                  <p className="text-gray-500 text-sm mt-0.5">
                    What delicious adventure are we cooking today?
                  </p>
                </div>
                <Link href="/recipes">
                  <Button variant="outline" size="sm" className="border-amber-200 text-amber-800 hover:bg-amber-50">
                    <Search className="h-4 w-4 mr-2 text-amber-600" />
                    Browse All Recipes
                  </Button>
                </Link>
              </div>

              {/* Mood Selector Component */}
              <MoodSelector onMoodSelect={handleMoodSelect} onLoading={handleMoodLoading} onMoodChosen={recordMood} diet={user?.dietaryRestrictions?.find((diet) => diet.toLowerCase() === "vegan") || user?.dietaryRestrictions?.find((diet) => diet.toLowerCase() === "vegetarian") || user?.dietaryRestrictions?.[0]} />

              {lastMood && (
                <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
                  <strong>Welcome back.</strong> Last time you were craving {lastMood}. Continue exploring.
                </div>
              )}

              {tasteDNA.length > 0 && (
                <Card className="border-amber-100 bg-white">
                  <CardHeader className="pb-2"><CardTitle className="text-lg">Your Taste DNA</CardTitle><CardDescription>Based on your local activity</CardDescription></CardHeader>
                  <CardContent className="space-y-2">
                    {tasteDNA.map(({ mood, percentage }) => <div key={mood} className="flex items-center gap-3 text-sm"><span className="w-16 capitalize text-gray-600">{mood}</span><div className="h-2 flex-1 rounded-full bg-amber-100"><div className="h-2 rounded-full bg-amber-500" style={{ width: `${percentage}%` }} /></div><span className="w-10 text-right font-semibold text-amber-700">{percentage}%</span></div>)}
                  </CardContent>
                </Card>
              )}

              {/* Recipe Tabs */}
              <Tabs defaultValue="for-you" className="w-full">
                <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                  <TabsList className="bg-gray-100/80 p-1">
                    <TabsTrigger value="for-you" className="data-[state=active]:bg-white data-[state=active]:shadow-xs">
                      For You
                    </TabsTrigger>
                    <TabsTrigger value="trending" className="data-[state=active]:bg-white data-[state=active]:shadow-xs">
                      Trending
                    </TabsTrigger>
                    <TabsTrigger value="saved" className="data-[state=active]:bg-white data-[state=active]:shadow-xs">
                      Saved ({user?.savedRecipeIds?.length || 0})
                    </TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="for-you" className="mt-6">
                  {isLoading || isMoodLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                      {[1, 2, 3, 4, 5, 6].map((i) => (
                        <RecipeCardSkeleton key={i} />
                      ))}
                    </div>
                  ) : displayRecipes.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                      {rankedRecipes.map((recipe) => (
                        <RecipeCard key={recipe.id} recipe={recipe} />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 bg-white rounded-xl border border-gray-100 p-8">
                      <p className="text-gray-500 mb-3">No recipes found for this mood filter.</p>
                      <Button onClick={() => setMoodRecipes([])} variant="outline" className="text-amber-600">
                        Reset Mood Filter
                      </Button>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="trending" className="mt-6">
                  {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                      {[1, 2, 3].map((i) => (
                        <RecipeCardSkeleton key={i} />
                      ))}
                    </div>
                  ) : trendingRecipes.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                      {trendingRecipes.map((recipe) => (
                        <RecipeCard key={recipe.id} recipe={recipe} />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
                      <p className="text-gray-500">No trending recipes found. Check back later.</p>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="saved" className="mt-6">
                  {savedRecipes.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                      {savedRecipes.map((recipe) => (
                        <RecipeCard key={recipe.id} recipe={recipe} />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-200 p-8">
                      <Bookmark className="h-10 w-10 text-amber-400 mx-auto mb-3" />
                      <h3 className="font-semibold text-gray-800 text-lg mb-1">Your Cookbook is Empty</h3>
                      <p className="text-gray-500 text-sm max-w-md mx-auto mb-4">
                        Click the bookmark icon on any recipe to save it to your personal cookbook.
                      </p>
                      <Link href="/recipes">
                        <Button className="bg-amber-600 hover:bg-amber-700 text-white">
                          <BookOpen className="h-4 w-4 mr-2" />
                          Explore Recipes
                        </Button>
                      </Link>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </section>

            {/* Community Favorites Section */}
            <section className="space-y-4 pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Community Highlights</h2>
                  <p className="text-xs text-gray-500">Popular dishes made and loved by foodies</p>
                </div>
                <Link href="/community">
                  <Button variant="link" className="text-amber-600 p-0 h-auto font-semibold">
                    Visit Community &rarr;
                  </Button>
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {(forYouRecipes.slice(0, 3)).map((recipe, i) => {
                  const isSaved = isRecipeSaved(recipe.id)
                  const isLiked = isRecipeLiked(recipe.id)
                  return (
                    <Card key={recipe.id || i} className="overflow-hidden hover:shadow-lg transition-all border-gray-200 flex flex-col justify-between">
                      <div>
                        <Link href={`/recipes/${recipe.id}`} className="block aspect-video relative overflow-hidden bg-amber-50">
                          <img
                            src={recipe.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80"}
                            alt={recipe.title}
                            className="object-cover w-full h-full hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute top-2 right-2">
                            <Badge className="bg-white/95 text-amber-700 shadow-xs border-0 font-medium">
                              <TrendingUp className="h-3 w-3 mr-1" />
                              Trending
                            </Badge>
                          </div>
                        </Link>
                        <CardHeader className="p-4 pb-2">
                          <div className="flex items-center space-x-2 mb-2">
                            <Avatar className="h-6 w-6">
                              <AvatarFallback className="bg-amber-100 text-amber-800 text-[10px]">
                                {`U${i + 1}`}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-xs text-gray-600 font-medium">@foodie_chef_{i + 1}</span>
                          </div>
                          <Link href={`/recipes/${recipe.id}`}>
                            <CardTitle className="text-base font-bold text-gray-900 line-clamp-2 hover:text-amber-600 transition-colors">
                              {recipe.title}
                            </CardTitle>
                          </Link>
                        </CardHeader>
                      </div>
                      <CardFooter className="p-4 pt-0 flex justify-between items-center border-t border-gray-50 mt-2 bg-gray-50/50">
                        <button
                          onClick={() => {
                            toggleLikeRecipe(recipe.id)
                            toast.success(isLiked ? "Unliked" : "Liked recipe!")
                          }}
                          className="flex items-center text-gray-500 hover:text-red-500 text-xs font-medium"
                        >
                          <Heart className={`h-4 w-4 mr-1 ${isLiked ? "fill-red-500 text-red-500" : ""}`} />
                          {140 + i * 25 + (isLiked ? 1 : 0)}
                        </button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            const s = toggleSaveRecipe(recipe.id)
                            toast.success(s ? "Saved to cookbook" : "Removed from cookbook")
                          }}
                          className="h-8 w-8 p-0"
                        >
                          <Bookmark className={`h-4 w-4 ${isSaved ? "fill-amber-600 text-amber-600" : "text-gray-400"}`} />
                        </Button>
                      </CardFooter>
                    </Card>
                  )
                })}
              </div>
            </section>
          </div>

          {/* Right Sidebar */}
          <div className="w-full lg:w-80 space-y-6 shrink-0">
            {/* User Profile Summary Card */}
            <Card className="border-gray-200/80 shadow-xs">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Your Kitchen Profile</CardTitle>
                <CardDescription>Preferences & Cooking Activity</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3.5">
                  <Avatar className="h-14 w-14 ring-2 ring-amber-100">
                    <AvatarImage src={user?.avatar || ""} />
                    <AvatarFallback className="bg-amber-600 text-white font-bold text-sm">
                      {getInitials(user?.name || "Alex Lee")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-bold text-gray-900">{user?.name || "Alex Lee"}</p>
                    <p className="text-xs text-gray-500">{user?.email || "alex@example.com"}</p>
                    <Badge variant="outline" className="mt-1 text-[10px] text-amber-700 border-amber-200 bg-amber-50">
                      {user?.cookingSkill || "Intermediate"} Cook
                    </Badge>
                  </div>
                </div>

                <div className="pt-2 border-t border-gray-100 space-y-2.5">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Recipes Saved</span>
                    <span className="font-bold text-gray-900">{user?.savedRecipeIds?.length || 0}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Recipes Cooked</span>
                    <span className="font-bold text-gray-900">{user?.cookedRecipeIds?.length || 0}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Favorite Cuisine</span>
                    <span className="font-bold text-amber-600">{user?.favoriteCuisines?.[0] || "Italian"}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-0">
                <Button
                  variant="outline"
                  className="w-full text-xs font-semibold hover:bg-amber-50 hover:text-amber-700 hover:border-amber-200"
                  onClick={() => setEditProfileOpen(true)}
                >
                  Edit Profile & Preferences
                </Button>
              </CardFooter>
            </Card>

            <Card className="border-gray-200/80 shadow-xs">
              <CardHeader className="pb-3"><CardTitle className="text-base">Recipe Collections</CardTitle><CardDescription>Organize your saved recipes</CardDescription></CardHeader>
              <CardContent className="space-y-2">
                {(user?.collections || []).map((collection) => (
                  <div key={collection.id} className="flex items-center justify-between rounded-lg border border-gray-100 px-3 py-2 text-sm">
                    <span>{collection.name} <span className="text-xs text-gray-400">({collection.recipeIds.length})</span></span>
                    <span className="flex gap-1">
                      <Button variant="ghost" size="icon" className="h-7 w-7" aria-label={`Rename ${collection.name}`} onClick={() => { const name = window.prompt("Rename collection", collection.name); if (name) renameCollection(collection.id, name) }}><Pencil className="h-3 w-3" /></Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-gray-400 hover:text-red-600" aria-label={`Delete ${collection.name}`} onClick={() => deleteCollection(collection.id)}><Trash2 className="h-3 w-3" /></Button>
                    </span>
                  </div>
                ))}
                <div className="flex gap-2 pt-2">
                  <Input value={collectionName} onChange={(event) => setCollectionName(event.target.value)} placeholder="New collection" className="h-8 text-xs" />
                  <Button size="sm" className="h-8 bg-amber-600 hover:bg-amber-700" aria-label="Create collection" onClick={() => { if (createCollection(collectionName)) setCollectionName("") }}><Plus className="h-4 w-4" /></Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Cooking Tips Card */}
            <Card className="border-gray-200/80 shadow-xs">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center justify-between">
                  <span>Chef Tips for You</span>
                  <ChefHat className="h-4 w-4 text-amber-600" />
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3.5 text-sm">
                <div className="flex items-start space-x-3">
                  <div className="bg-amber-100 p-2 rounded-lg text-amber-700 shrink-0">
                    <Utensils className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-xs text-gray-900">Salting Pasta Water</h4>
                    <p className="text-[11px] text-gray-500 leading-tight">Salt generously like sea water for richer pasta flavor.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="bg-orange-100 p-2 rounded-lg text-orange-700 shrink-0">
                    <Clock className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-xs text-gray-900">Resting Meat</h4>
                    <p className="text-[11px] text-gray-500 leading-tight">Let steaks and chicken rest 5 mins before slicing to keep juices.</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-0">
                <Button
                  variant="link"
                  className="w-full text-amber-600 text-xs p-0 h-auto font-medium"
                  onClick={() => setTipsModalOpen(true)}
                >
                  View All Kitchen Tips &rarr;
                </Button>
              </CardFooter>
            </Card>

            {/* Upcoming Community Workshops */}
            <Card className="border-gray-200/80 shadow-xs">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center justify-between">
                  <span>Live Masterclasses</span>
                  <Calendar className="h-4 w-4 text-amber-600" />
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-xs">
                <div className="border-l-2 border-amber-500 pl-3 py-1">
                  <p className="font-semibold text-gray-900">Artisan Sourdough 101</p>
                  <p className="text-gray-500">Live Stream • Saturday 4:00 PM</p>
                </div>
                <div className="border-l-2 border-orange-400 pl-3 py-1">
                  <p className="font-semibold text-gray-900">Thai Street Flavors</p>
                  <p className="text-gray-500">Interactive Q&A • Sunday 6:00 PM</p>
                </div>
              </CardContent>
              <CardFooter className="pt-0">
                <Button
                  variant="link"
                  className="w-full text-amber-600 text-xs p-0 h-auto font-medium"
                  onClick={() => setCalendarModalOpen(true)}
                >
                  View Schedule & RSVP &rarr;
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </main>

      {/* Edit Profile Modal */}
      <Dialog open={editProfileOpen} onOpenChange={setEditProfileOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
            <DialogDescription>Update your display name and favorite cuisine</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="dashboard-name">Display Name</Label>
              <Input
                id="dashboard-name"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder="Alex Lee"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dashboard-cuisine">Primary Favorite Cuisine</Label>
              <Input
                id="dashboard-cuisine"
                value={editCuisine}
                onChange={(e) => setEditCuisine(e.target.value)}
                placeholder="Italian, Mexican, Thai..."
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setEditProfileOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveProfile} className="bg-amber-600 hover:bg-amber-700 text-white">
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Chef Tips Modal */}
      <Dialog open={tipsModalOpen} onOpenChange={setTipsModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ChefHat className="h-5 w-5 text-amber-600" />
              Professional Kitchen Tips
            </DialogTitle>
            <DialogDescription>Essential culinary wisdom for better home cooking</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2 text-sm max-h-[60vh] overflow-y-auto">
            <div className="bg-amber-50 p-3.5 rounded-lg border border-amber-100">
              <h4 className="font-bold text-amber-900 mb-1">1. Keep Your Knives Sharp</h4>
              <p className="text-gray-700 text-xs">A dull knife slips and crushes food cells; a sharp knife cuts cleanly and prevents teary eyes when slicing onions.</p>
            </div>
            <div className="bg-amber-50 p-3.5 rounded-lg border border-amber-100">
              <h4 className="font-bold text-amber-900 mb-1">2. Dry Meat Before Searing</h4>
              <p className="text-gray-700 text-xs">Moisture creates steam in the pan preventing the Maillard reaction. Pat proteins completely dry with paper towels.</p>
            </div>
            <div className="bg-amber-50 p-3.5 rounded-lg border border-amber-100">
              <h4 className="font-bold text-amber-900 mb-1">3. Balance with Acid</h4>
              <p className="text-gray-700 text-xs">If a dish tastes flat even after salting, add a splash of lemon juice, lime, or vinegar to wake up flavors.</p>
            </div>
            <div className="bg-amber-50 p-3.5 rounded-lg border border-amber-100">
              <h4 className="font-bold text-amber-900 mb-1">4. Taste As You Go</h4>
              <p className="text-gray-700 text-xs">Season incrementally at every stage of cooking rather than dumping all seasonings at the very end.</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Calendar / Events Modal */}
      <Dialog open={calendarModalOpen} onOpenChange={setCalendarModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-amber-600" />
              Upcoming Culinary Masterclasses
            </DialogTitle>
            <DialogDescription>Join free interactive workshops hosted by professional chefs</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2 text-sm">
            {[
              { title: "Artisan Sourdough 101", date: "This Saturday, 4:00 PM EST", chef: "Chef Pierre Dubois" },
              { title: "Thai Street Food Masterclass", date: "This Sunday, 6:00 PM EST", chef: "Chef Somchai Prasert" },
              { title: "Perfect Homemade Pasta", date: "Next Wednesday, 7:00 PM EST", chef: "Chef Marco Rossi" },
            ].map((event, idx) => (
              <div key={idx} className="p-3.5 rounded-xl border border-gray-200 bg-white flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-gray-900 text-sm">{event.title}</h4>
                  <p className="text-xs text-amber-700 font-medium">{event.date}</p>
                  <p className="text-[11px] text-gray-500">With {event.chef}</p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => toast.success(`RSVP confirmed for "${event.title}"! We'll notify you.`)}
                  className="hover:bg-amber-50 hover:text-amber-700 text-xs"
                >
                  RSVP
                </Button>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
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

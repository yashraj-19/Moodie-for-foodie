"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronRight, UtensilsCrossed, Sparkles, ChefHat, Heart, Star, Clock, BookOpen } from "lucide-react"
import { useAuth } from "@/context/auth-context"
import { toast } from "sonner"

export default function Home() {
  const { isAuthenticated, user } = useAuth()
  const [newsletterEmail, setNewsletterEmail] = useState("")

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newsletterEmail || !newsletterEmail.includes("@")) {
      toast.error("Please enter a valid email address")
      return
    }
    toast.success("Thank you for subscribing!", {
      description: "Weekly chef specials and mood-inspired recipes will arrive in your inbox.",
    })
    setNewsletterEmail("")
  }

  const featuredRecipes = [
    {
      id: 716429,
      title: "Pasta with Garlic, Scallions & Crispy Breadcrumbs",
      time: "30 min",
      difficulty: "Easy",
      diet: "Vegetarian",
      rating: 4.9,
      reviews: 432,
      image: "https://images.unsplash.com/photo-1621996346565-e3d5d6281292?auto=format&fit=crop&w=600&q=80",
    },
    {
      id: 644387,
      title: "Garlic Butter Pan-Seared Salmon with Asparagus",
      time: "20 min",
      difficulty: "Easy",
      diet: "Gluten-Free",
      rating: 4.8,
      reviews: 612,
      image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=600&q=80",
    },
    {
      id: 640062,
      title: "Authentic Thai Green Curry with Tofu & Veggies",
      time: "30 min",
      difficulty: "Medium",
      diet: "Vegan",
      rating: 4.9,
      reviews: 530,
      image: "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?auto=format&fit=crop&w=600&q=80",
    },
  ]

  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* Top Navbar */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-xs">
        <div className="container mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-600 to-orange-500 flex items-center justify-center shadow-sm text-white">
              <UtensilsCrossed className="h-5 w-5" />
            </div>
            <div>
              <span className="font-bold text-lg text-amber-600 leading-none block">Moodie</span>
              <span className="text-[10px] tracking-wider uppercase font-semibold text-gray-400">for foodie</span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium text-gray-600">
            <Link href="/recipes" className="hover:text-amber-600 transition-colors">
              Explore Recipes
            </Link>
            <Link href="/community" className="hover:text-amber-600 transition-colors">
              Community
            </Link>
          </nav>

          <div className="flex items-center space-x-3">
            {isAuthenticated ? (
              <Link href="/dashboard">
                <Button className="bg-amber-600 hover:bg-amber-700 text-white font-semibold">
                  Dashboard ({user?.name?.split(" ")[0]})
                  <ChevronRight className="ml-1.5 h-4 w-4" />
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm" className="font-medium text-gray-700">
                    Sign In
                  </Button>
                </Link>
                <Link href="/onboarding">
                  <Button size="sm" className="bg-amber-600 hover:bg-amber-700 text-white font-medium shadow-xs">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-16 md:py-24 lg:py-28 bg-gradient-to-b from-amber-50/80 via-orange-50/30 to-white">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="grid gap-12 lg:grid-cols-2 items-center">
              <div className="flex flex-col justify-center space-y-6">
                <div className="inline-flex items-center space-x-2 bg-amber-100/80 text-amber-800 px-3.5 py-1.5 rounded-full text-xs font-semibold w-fit">
                  <Sparkles className="h-3.5 w-3.5 text-amber-600" />
                  <span>Personalized Mood-Based Recipe Discovery</span>
                </div>
                <div className="space-y-3">
                  <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl xl:text-6xl text-gray-900 leading-[1.15]">
                    Discover Recipes Matching <span className="text-amber-600">Your Mood & Taste</span>
                  </h1>
                  <p className="max-w-[560px] text-gray-600 text-base md:text-lg leading-relaxed">
                    Feeling quick & easy, healthy, comfort food, spicy, or sweet? Get instant chef-curated recipes adapted
                    to your exact dietary preferences and available cooking time.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <Link href="/onboarding">
                    <Button size="lg" className="w-full sm:w-auto bg-amber-600 hover:bg-amber-700 text-white shadow-md font-semibold text-base px-7">
                      Personalize My Experience
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/recipes">
                    <Button size="lg" variant="outline" className="w-full sm:w-auto border-gray-300 font-semibold text-base px-7">
                      <BookOpen className="h-4 w-4 mr-2" />
                      Browse Recipes
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="mx-auto lg:mx-0 relative">
                <div className="relative h-[340px] w-[340px] sm:h-[420px] sm:w-[420px] lg:h-[480px] lg:w-[480px]">
                  <div className="absolute -inset-4 rounded-3xl bg-gradient-to-tr from-amber-400 to-orange-300 blur-2xl opacity-30"></div>
                  <div className="relative h-full w-full rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
                    <img
                      alt="Artisan culinary dish"
                      className="object-cover w-full h-full hover:scale-105 transition-transform duration-700"
                      src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="w-full py-16 md:py-24 bg-white border-t border-gray-100">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center justify-center space-y-4 text-center max-w-3xl mx-auto">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-3 py-1 rounded-full">
                Simple & Intuitive
              </span>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-gray-900">
                How Moodie for Foodie Works
              </h2>
              <p className="text-gray-500 text-sm md:text-base">
                Three effortless steps to transform your daily meals into exciting culinary discoveries.
              </p>
            </div>
            <div className="mx-auto grid max-w-5xl items-stretch gap-8 py-12 lg:grid-cols-3">
              <div className="flex flex-col p-6 rounded-2xl bg-amber-50/50 border border-amber-100 space-y-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-600 text-white font-bold text-lg shadow-sm">
                  1
                </div>
                <h3 className="text-lg font-bold text-gray-900">Select Your Mood & Diet</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Tell us what you're craving today—quick, comfort, healthy, or spicy—along with any dietary exclusions.
                </p>
              </div>
              <div className="flex flex-col p-6 rounded-2xl bg-amber-50/50 border border-amber-100 space-y-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-600 text-white font-bold text-lg shadow-sm">
                  2
                </div>
                <h3 className="text-lg font-bold text-gray-900">Get Instant Recommendations</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Browse matching recipes with scaled ingredient portions, preparation times, and detailed nutrition.
                </p>
              </div>
              <div className="flex flex-col p-6 rounded-2xl bg-amber-50/50 border border-amber-100 space-y-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-600 text-white font-bold text-lg shadow-sm">
                  3
                </div>
                <h3 className="text-lg font-bold text-gray-900">Cook with Guided Steps</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Follow interactive step-by-step cooking mode, track recipes you've mastered, and save your favorites.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Recipes Section */}
        <section className="w-full py-16 md:py-24 bg-gray-50/70 border-t border-gray-100">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center justify-center space-y-3 text-center max-w-2xl mx-auto mb-12">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-600 bg-amber-100/80 px-3 py-1 rounded-full">
                Chef Selected
              </span>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-gray-900">
                Trending Community Recipes
              </h2>
              <p className="text-gray-500 text-sm">
                Explore some of our highest-rated recipes loved by thousands of foodies.
              </p>
            </div>
            <div className="mx-auto grid max-w-5xl gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {featuredRecipes.map((item) => (
                <Link
                  key={item.id}
                  href={`/recipes/${item.id}`}
                  className="group bg-white rounded-2xl overflow-hidden border border-gray-200/80 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    <div className="aspect-video overflow-hidden relative bg-amber-50">
                      <img
                        alt={item.title}
                        className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                        src={item.image}
                      />
                      <span className="absolute top-3 right-3 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-semibold text-amber-800 shadow-xs">
                        {item.diet}
                      </span>
                    </div>
                    <div className="p-5">
                      <h3 className="font-bold text-gray-900 text-base group-hover:text-amber-600 transition-colors line-clamp-2 mb-2 leading-snug">
                        {item.title}
                      </h3>
                      <div className="flex items-center text-xs text-gray-500 space-x-3 mb-3">
                        <span className="flex items-center">
                          <Clock className="h-3.5 w-3.5 mr-1 text-amber-600" />
                          {item.time}
                        </span>
                        <span>•</span>
                        <span>{item.difficulty}</span>
                      </div>
                      <div className="flex items-center text-xs text-amber-500">
                        <div className="flex mr-1.5">
                          {[...Array(5)].map((_, j) => (
                            <Star key={j} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          ))}
                        </div>
                        <span className="text-gray-500">({item.reviews} reviews)</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 pt-0 border-t border-gray-50 bg-gray-50/50 flex justify-between items-center text-xs font-semibold text-amber-600">
                    <span>View Recipe Details</span>
                    <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              ))}
            </div>
            <div className="flex justify-center mt-10">
              <Link href="/recipes">
                <Button size="lg" className="bg-amber-600 hover:bg-amber-700 text-white font-semibold shadow-sm px-8">
                  View All Recipes
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full py-12 bg-amber-950 text-white">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 pb-10 border-b border-amber-900">
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center text-white">
                  <UtensilsCrossed className="h-4 w-4" />
                </div>
                <span className="font-bold text-lg text-white">Moodie for Foodie</span>
              </div>
              <p className="text-xs text-amber-200/70 leading-relaxed">
                Personalized recipe discovery and cooking guidance tailored to your lifestyle and taste.
              </p>
            </div>
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-amber-300 uppercase tracking-wider">Explore</h3>
              <ul className="space-y-2 text-xs text-amber-100/80">
                <li>
                  <Link href="/recipes" className="hover:text-white transition-colors">
                    All Recipes
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard" className="hover:text-white transition-colors">
                    Mood Selector
                  </Link>
                </li>
                <li>
                  <Link href="/community" className="hover:text-white transition-colors">
                    Community Highlights
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-amber-300 uppercase tracking-wider">Account</h3>
              <ul className="space-y-2 text-xs text-amber-100/80">
                <li>
                  <Link href="/onboarding" className="hover:text-white transition-colors">
                    Get Started (Onboarding)
                  </Link>
                </li>
                <li>
                  <Link href="/login" className="hover:text-white transition-colors">
                    Sign In
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard" className="hover:text-white transition-colors">
                    My Saved Cookbook
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-amber-300 uppercase tracking-wider">Newsletter</h3>
              <p className="text-xs text-amber-200/70">Get weekly chef tips and personalized seasonal recipes.</p>
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <input
                  type="email"
                  placeholder="Your email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className="flex h-9 w-full rounded-md border border-amber-800 bg-amber-900/60 px-3 py-1 text-xs text-white placeholder:text-amber-300/50 focus:outline-none focus:ring-1 focus:ring-amber-400"
                />
                <Button size="sm" type="submit" className="bg-amber-500 hover:bg-amber-600 text-white text-xs px-3">
                  Join
                </Button>
              </form>
            </div>
          </div>
          <div className="pt-6 text-center text-xs text-amber-300/60 flex flex-col sm:flex-row justify-between items-center gap-2">
            <p>© {new Date().getFullYear()} Moodie for Foodie. All rights reserved.</p>
            <p className="text-amber-400/80">Made with ❤️ for passionate foodies & home chefs</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

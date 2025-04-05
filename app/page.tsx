import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronRight } from "lucide-react"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-amber-50 to-white">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none text-amber-600">
                    Discover Your Next Culinary Adventure
                  </h1>
                  <p className="max-w-[600px] text-gray-500 md:text-xl">
                    Personalized recipes, cooking tips, and food recommendations tailored to your taste and dietary
                    preferences.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/onboarding">
                    <Button size="lg" className="bg-amber-600 hover:bg-amber-700">
                      Get Started
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/recipes">
                    <Button size="lg" variant="outline">
                      Explore Recipes
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="mx-auto lg:mx-0 relative">
                <div className="relative h-[350px] w-[350px] sm:h-[400px] sm:w-[400px] lg:h-[500px] lg:w-[500px]">
                  <div className="absolute top-0 left-0 h-full w-full rounded-full bg-amber-100 blur-3xl opacity-30"></div>
                  <div className="relative h-full w-full rounded-2xl overflow-hidden shadow-2xl">
                    <img
                      alt="Delicious food collage"
                      className="object-cover w-full h-full"
                      src="/placeholder.svg?height=500&width=500"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-amber-600">
                  How It Works
                </h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Discover a new way to find recipes that match your preferences and dietary needs.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-12">
              <div className="flex flex-col justify-center space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-amber-600">
                  <span className="font-bold text-xl">1</span>
                </div>
                <h3 className="text-xl font-bold">Create Your Profile</h3>
                <p className="text-gray-500">
                  Tell us about your dietary preferences, restrictions, and favorite cuisines.
                </p>
              </div>
              <div className="flex flex-col justify-center space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-amber-600">
                  <span className="font-bold text-xl">2</span>
                </div>
                <h3 className="text-xl font-bold">Get Personalized Recommendations</h3>
                <p className="text-gray-500">Our AI analyzes your preferences to suggest recipes you'll love.</p>
              </div>
              <div className="flex flex-col justify-center space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-amber-600">
                  <span className="font-bold text-xl">3</span>
                </div>
                <h3 className="text-xl font-bold">Cook & Share</h3>
                <p className="text-gray-500">
                  Follow step-by-step instructions and share your creations with the community.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-amber-50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-amber-600">
                  Featured Recipes
                </h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Explore some of our most popular recipes loved by our community.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl gap-8 py-12 sm:grid-cols-2 md:gap-12 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="group relative overflow-hidden rounded-lg shadow-lg transition-all hover:shadow-xl"
                >
                  <Link href={`/recipes/${i}`}>
                    <div className="aspect-video overflow-hidden">
                      <img
                        alt={`Featured recipe ${i}`}
                        className="object-cover w-full h-full transition-transform group-hover:scale-105"
                        src={`/placeholder.svg?height=200&width=300`}
                      />
                    </div>
                    <div className="p-4 bg-white">
                      <h3 className="font-semibold text-lg">Delicious Recipe {i}</h3>
                      <p className="text-sm text-gray-500 mt-1">30 min • Easy • Vegetarian</p>
                      <div className="flex items-center mt-3">
                        <div className="flex">
                          {[...Array(5)].map((_, j) => (
                            <svg
                              key={j}
                              className={`w-4 h-4 ${j < 4 ? "text-amber-500" : "text-gray-300"}`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                        <span className="text-xs text-gray-500 ml-2">(120 reviews)</span>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
            <div className="flex justify-center">
              <Link href="/recipes">
                <Button variant="outline" size="lg">
                  View All Recipes
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="w-full py-6 bg-amber-600 text-white">
        <div className="container px-4 md:px-6">
          <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Culinary Canvas</h3>
              <p className="text-sm text-amber-100">Discover recipes tailored to your preferences and dietary needs.</p>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Links</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/about" className="hover:underline">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/recipes" className="hover:underline">
                    Recipes
                  </Link>
                </li>
                <li>
                  <Link href="/community" className="hover:underline">
                    Community
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Support</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/faq" className="hover:underline">
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:underline">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="hover:underline">
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Newsletter</h3>
              <p className="text-sm text-amber-100">Subscribe to get the latest recipes and updates.</p>
              <div className="flex space-x-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex h-10 w-full rounded-md border border-amber-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                <Button size="sm" className="bg-white text-amber-600 hover:bg-amber-100">
                  Subscribe
                </Button>
              </div>
            </div>
          </div>
          <div className="mt-10 border-t border-amber-500 pt-6 text-center text-sm text-amber-200">
            <p>© 2025 Culinary Canvas. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}


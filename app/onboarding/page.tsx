"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChevronLeft, ChevronRight, Check, UtensilsCrossed } from "lucide-react"
import { useAuth } from "@/context/auth-context"
import { toast } from "sonner"

const DIET_OPTIONS = [
  "Vegetarian",
  "Vegan",
  "Gluten-Free",
  "Dairy-Free",
  "Keto",
  "Paleo",
  "Low-Carb",
  "Nut-Free",
]

const CUISINE_OPTIONS = [
  "Italian",
  "Mexican",
  "Chinese",
  "Japanese",
  "Indian",
  "Thai",
  "Mediterranean",
  "French",
  "American",
  "Middle Eastern",
  "Korean",
  "Vietnamese",
]

export default function Onboarding() {
  const router = useRouter()
  const { signup } = useAuth()
  const [step, setStep] = useState(1)
  const totalSteps = 4

  // Form State
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [selectedDiets, setSelectedDiets] = useState<string[]>([])
  const [allergies, setAllergies] = useState("")
  const [cookingSkill, setCookingSkill] = useState("Intermediate")
  const [cookingTime, setCookingTime] = useState("30-60")
  const [selectedCuisines, setSelectedCuisines] = useState<string[]>(["Italian", "Mediterranean"])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleDietToggle = (diet: string) => {
    setSelectedDiets((prev) =>
      prev.includes(diet) ? prev.filter((d) => d !== diet) : [...prev, diet]
    )
  }

  const handleCuisineToggle = (cuisine: string) => {
    setSelectedCuisines((prev) =>
      prev.includes(cuisine) ? prev.filter((c) => c !== cuisine) : [...prev, cuisine]
    )
  }

  const nextStep = async () => {
    if (step === 1) {
      if (!name.trim()) {
        toast.error("Please enter your name")
        return
      }
      if (!email.trim() || !email.includes("@")) {
        toast.error("Please enter a valid email address")
        return
      }
    }

    if (step < totalSteps) {
      setStep(step + 1)
    } else {
      // Final submission
      setIsSubmitting(true)
      const res = await signup({
        name: name.trim() || "Foodie Explorer",
        email: email.trim() || "user@example.com",
        password,
        dietaryRestrictions: selectedDiets,
        allergies: allergies.trim() || "None",
        cookingSkill,
        cookingTime,
        favoriteCuisines: selectedCuisines.length > 0 ? selectedCuisines : ["Italian", "Asian"],
      })
      setIsSubmitting(false)

      if (res.success) {
        toast.success(`Welcome to Moodie for Foodie, ${name || "friend"}!`)
        router.push("/dashboard")
      } else {
        toast.error(res.error || "Failed to complete setup")
      }
    }
  }

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white flex flex-col items-center justify-center p-4">
      <div className="mb-6 text-center">
        <Link href="/" className="inline-flex items-center space-x-2">
          <div className="w-9 h-9 rounded-full bg-amber-600 flex items-center justify-center text-white shadow-sm">
            <UtensilsCrossed className="h-5 w-5" />
          </div>
          <span className="font-bold text-xl text-amber-600">Moodie for Foodie</span>
        </Link>
      </div>

      <Card className="w-full max-w-2xl shadow-xl border-amber-100">
        <CardContent className="p-6 sm:p-8">
          <div className="mb-8">
            <div className="flex justify-between items-center mb-3">
              <h1 className="text-2xl font-bold text-gray-800">
                {step === 1 && "Create Your Food Profile"}
                {step === 2 && "Dietary Preferences"}
                {step === 3 && "Cooking Experience"}
                {step === 4 && "Favorite Cuisines"}
              </h1>
              <span className="text-xs font-semibold px-2.5 py-1 bg-amber-100 text-amber-800 rounded-full">
                Step {step} of {totalSteps}
              </span>
            </div>
            <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-amber-600 h-full rounded-full transition-all duration-300 ease-out"
                style={{ width: `${(step / totalSteps) * 100}%` }}
              />
            </div>
          </div>

          {step === 1 && (
            <div className="space-y-6">
              <p className="text-gray-600 text-sm">
                Let's get to know you so we can personalize recipes to your tastes and dietary goals.
              </p>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Your Name</Label>
                  <Input
                    id="name"
                    placeholder="e.g. Alex Lee"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="e.g. alex@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Create Password (Optional)</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <p className="text-gray-600 text-sm">
                Select your dietary restrictions so recipes fit your health and lifestyle preferences.
              </p>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Do you follow any diets?</Label>
                  <div className="grid grid-cols-2 gap-3 pt-1">
                    {DIET_OPTIONS.map((diet) => {
                      const isChecked = selectedDiets.includes(diet)
                      return (
                        <div
                          key={diet}
                          onClick={() => handleDietToggle(diet)}
                          className={`flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                            isChecked
                              ? "border-amber-500 bg-amber-50 text-amber-900 font-medium"
                              : "border-gray-200 hover:bg-gray-50 text-gray-700"
                          }`}
                        >
                          <Checkbox
                            id={diet.toLowerCase()}
                            checked={isChecked}
                            onCheckedChange={() => handleDietToggle(diet)}
                          />
                          <span className="text-sm select-none">{diet}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>
                <div className="space-y-2 pt-2">
                  <Label htmlFor="allergies">Any allergies or ingredients to avoid?</Label>
                  <Input
                    id="allergies"
                    placeholder="e.g., Shellfish, peanuts, cilantro, dairy"
                    value={allergies}
                    onChange={(e) => setAllergies(e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <p className="text-gray-600 text-sm">
                Tell us about your comfort level in the kitchen so we recommend the right complexity.
              </p>
              <div className="space-y-5">
                <div className="space-y-3">
                  <Label className="text-sm font-semibold">Cooking Skill Level</Label>
                  <RadioGroup value={cookingSkill} onValueChange={setCookingSkill} className="space-y-2">
                    {[
                      { id: "Beginner", desc: "Just starting out with simple, quick recipes" },
                      { id: "Intermediate", desc: "Comfortable following most recipes & techniques" },
                      { id: "Advanced", desc: "Love complex techniques & gourmet cooking" },
                    ].map((item) => (
                      <div
                        key={item.id}
                        onClick={() => setCookingSkill(item.id)}
                        className={`flex items-center space-x-3 p-3.5 rounded-lg border cursor-pointer transition-colors ${
                          cookingSkill === item.id
                            ? "border-amber-500 bg-amber-50"
                            : "border-gray-200 hover:bg-gray-50"
                        }`}
                      >
                        <RadioGroupItem value={item.id} id={item.id.toLowerCase()} />
                        <div>
                          <Label htmlFor={item.id.toLowerCase()} className="font-semibold text-gray-900 cursor-pointer">
                            {item.id}
                          </Label>
                          <p className="text-xs text-gray-500">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
                <div className="space-y-2 pt-2">
                  <Label className="text-sm font-semibold">Typical time available for cooking</Label>
                  <Tabs value={cookingTime} onValueChange={setCookingTime}>
                    <TabsList className="grid grid-cols-4 w-full">
                      <TabsTrigger value="15-30">15-30 min</TabsTrigger>
                      <TabsTrigger value="30-60">30-60 min</TabsTrigger>
                      <TabsTrigger value="60-90">60-90 min</TabsTrigger>
                      <TabsTrigger value="90+">90+ min</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6">
              <p className="text-gray-600 text-sm">
                Select your favorite cuisines (choose at least 1) to curate your personalized discovery feed.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {CUISINE_OPTIONS.map((cuisine) => {
                  const isSelected = selectedCuisines.includes(cuisine)
                  return (
                    <div
                      key={cuisine}
                      onClick={() => handleCuisineToggle(cuisine)}
                      className={`border rounded-lg p-3.5 cursor-pointer transition-all ${
                        isSelected
                          ? "border-amber-500 bg-amber-50 text-amber-900 font-semibold shadow-xs"
                          : "border-gray-200 hover:bg-gray-50 text-gray-700"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm">{cuisine}</span>
                        <div
                          className={`w-5 h-5 rounded-full flex items-center justify-center transition-colors ${
                            isSelected ? "bg-amber-600 text-white" : "border border-gray-300"
                          }`}
                        >
                          {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          <div className="flex justify-between items-center mt-8 pt-4 border-t border-gray-100">
            <Button
              type="button"
              variant="outline"
              onClick={prevStep}
              disabled={step === 1}
              className={step === 1 ? "invisible" : ""}
            >
              <ChevronLeft className="mr-1.5 h-4 w-4" />
              Back
            </Button>
            <Button
              type="button"
              onClick={nextStep}
              disabled={isSubmitting}
              className="bg-amber-600 hover:bg-amber-700 text-white min-w-[130px]"
            >
              {isSubmitting ? (
                "Setting Up..."
              ) : step < totalSteps ? (
                <>
                  Next
                  <ChevronRight className="ml-1.5 h-4 w-4" />
                </>
              ) : (
                "Complete Setup"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

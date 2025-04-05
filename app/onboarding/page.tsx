"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChevronLeft, ChevronRight, Check } from "lucide-react"

export default function Onboarding() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const totalSteps = 4

  const nextStep = () => {
    if (step < totalSteps) {
      setStep(step + 1)
    } else {
      router.push("/dashboard")
    }
  }

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white flex flex-col items-center justify-center p-4">
      <Card className="w-full max-w-3xl shadow-lg">
        <CardContent className="p-6">
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-2xl font-bold text-amber-600">
                {step === 1 && "Welcome to Culinary Canvas"}
                {step === 2 && "Dietary Preferences"}
                {step === 3 && "Cooking Experience"}
                {step === 4 && "Favorite Cuisines"}
              </h1>
              <div className="text-sm text-gray-500">
                Step {step} of {totalSteps}
              </div>
            </div>
            <div className="w-full bg-gray-200 h-2 rounded-full">
              <div
                className="bg-amber-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(step / totalSteps) * 100}%` }}
              ></div>
            </div>
          </div>

          {step === 1 && (
            <div className="space-y-6">
              <p className="text-gray-600">Let's get to know you better so we can personalize your experience.</p>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Your Name</Label>
                  <Input id="name" placeholder="Enter your name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" placeholder="Enter your email" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Create Password</Label>
                  <Input id="password" type="password" placeholder="Create a password" />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <p className="text-gray-600">
                Tell us about your dietary preferences so we can recommend suitable recipes.
              </p>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Do you have any dietary restrictions?</Label>
                  <div className="grid grid-cols-2 gap-4">
                    {["Vegetarian", "Vegan", "Gluten-Free", "Dairy-Free", "Keto", "Paleo", "Low-Carb", "Nut-Free"].map(
                      (diet) => (
                        <div key={diet} className="flex items-center space-x-2">
                          <Checkbox id={diet.toLowerCase()} />
                          <Label htmlFor={diet.toLowerCase()} className="text-sm font-normal">
                            {diet}
                          </Label>
                        </div>
                      ),
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Any allergies or ingredients to avoid?</Label>
                  <Input placeholder="E.g., shellfish, peanuts, etc." />
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <p className="text-gray-600">
                Let us know about your cooking experience so we can suggest appropriate recipes.
              </p>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>How would you describe your cooking skills?</Label>
                  <RadioGroup defaultValue="intermediate">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="beginner" id="beginner" />
                      <Label htmlFor="beginner">Beginner - I'm just starting out</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="intermediate" id="intermediate" />
                      <Label htmlFor="intermediate">Intermediate - I can follow most recipes</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="advanced" id="advanced" />
                      <Label htmlFor="advanced">Advanced - I'm comfortable with complex techniques</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="professional" id="professional" />
                      <Label htmlFor="professional">Professional - I have professional training</Label>
                    </div>
                  </RadioGroup>
                </div>
                <div className="space-y-2">
                  <Label>How much time do you typically spend cooking a meal?</Label>
                  <Tabs defaultValue="30-60">
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
              <p className="text-gray-600">Select your favorite cuisines to help us recommend recipes you'll love.</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {[
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
                ].map((cuisine) => (
                  <div
                    key={cuisine}
                    className="border rounded-lg p-3 cursor-pointer hover:bg-amber-50 hover:border-amber-300 transition-colors group"
                  >
                    <div className="flex items-center justify-between">
                      <span>{cuisine}</span>
                      <div className="w-5 h-5 rounded-full border border-gray-300 group-hover:border-amber-500 flex items-center justify-center">
                        <Check className="w-3 h-3 text-amber-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={step === 1}
              className={step === 1 ? "invisible" : ""}
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <Button onClick={nextStep} className="bg-amber-600 hover:bg-amber-700">
              {step < totalSteps ? (
                <>
                  Next
                  <ChevronRight className="ml-2 h-4 w-4" />
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


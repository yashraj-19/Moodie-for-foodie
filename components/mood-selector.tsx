"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronRight } from "lucide-react"
import type { SearchResult } from "@/lib/api"

const moods = [
  { id: "quick", emoji: "⚡", label: "Quick & Easy" },
  { id: "healthy", emoji: "🥗", label: "Healthy" },
  { id: "comfort", emoji: "🍲", label: "Comfort Food" },
  { id: "sweet", emoji: "🍰", label: "Sweet Tooth" },
  { id: "spicy", emoji: "🌶️", label: "Spicy" },
  { id: "budget", emoji: "💰", label: "Budget-Friendly" },
]

interface MoodSelectorProps {
  onMoodSelect: (recipes: SearchResult[]) => void
  onLoading: (isLoading: boolean) => void
}

export default function MoodSelector({ onMoodSelect, onLoading }: MoodSelectorProps) {
  const [selectedMood, setSelectedMood] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleMoodSelect = (mood: string) => {
    setSelectedMood(mood)
  }

  const findRecipes = async () => {
    if (!selectedMood) return

    setIsLoading(true)
    onLoading(true)

    try {
      const response = await fetch(`/api/recipes/mood?mood=${selectedMood}`)

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`)
      }

      const data = await response.json()
      onMoodSelect(data.results || [])
    } catch (error) {
      console.error("Error fetching mood-based recipes:", error)
      onMoodSelect([])
    } finally {
      setIsLoading(false)
      onLoading(false)
    }
  }

  return (
    <Card className="p-4 bg-gradient-to-r from-amber-50 to-orange-50">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-medium">What are you in the mood for today?</h3>
          {selectedMood && (
            <Button variant="link" className="text-amber-600 p-0" onClick={() => setSelectedMood(null)}>
              Reset
            </Button>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {moods.map((mood) => (
            <Button
              key={mood.id}
              variant={selectedMood === mood.id ? "default" : "outline"}
              className={`
                rounded-full text-sm px-4 
                ${
                  selectedMood === mood.id
                    ? "bg-amber-600 hover:bg-amber-700 text-white"
                    : "hover:bg-amber-50 hover:text-amber-600 hover:border-amber-200"
                }
              `}
              onClick={() => handleMoodSelect(mood.id)}
            >
              <span className="mr-1">{mood.emoji}</span>
              {mood.label}
            </Button>
          ))}
        </div>
        {selectedMood && (
          <Button className="w-full mt-3 bg-amber-600 hover:bg-amber-700" onClick={findRecipes} disabled={isLoading}>
            {isLoading ? (
              "Finding Recipes..."
            ) : (
              <>
                Find {moods.find((m) => m.id === selectedMood)?.label} Recipes
                <ChevronRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        )}
      </div>
    </Card>
  )
}


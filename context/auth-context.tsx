"use client"

import React, { createContext, useContext, useState, useEffect } from "react"

export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  dietaryRestrictions: string[]
  allergies: string
  cookingSkill: string
  cookingTime: string
  favoriteCuisines: string[]
  savedRecipeIds: number[]
  likedRecipeIds: number[]
  cookedRecipeIds: number[]
  joinedDate: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password?: string) => Promise<{ success: boolean; error?: string }>
  signup: (data: Partial<User> & { password?: string }) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  updateProfile: (data: Partial<User>) => void
  toggleSaveRecipe: (recipeId: number) => boolean
  isRecipeSaved: (recipeId: number) => boolean
  toggleLikeRecipe: (recipeId: number) => boolean
  isRecipeLiked: (recipeId: number) => boolean
  markRecipeCooked: (recipeId: number) => void
}

const DEFAULT_USER: User = {
  id: "user-1",
  name: "Alex Lee",
  email: "alex@example.com",
  avatar: "",
  dietaryRestrictions: ["Vegetarian"],
  allergies: "None",
  cookingSkill: "Intermediate",
  cookingTime: "30-60",
  favoriteCuisines: ["Italian", "Mediterranean", "Thai"],
  savedRecipeIds: [716429, 644387],
  likedRecipeIds: [716429, 638604],
  cookedRecipeIds: [715538, 640062],
  joinedDate: "April 2025",
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const USER_STORAGE_KEY = "moodie_current_user"
const ALL_USERS_KEY = "moodie_users_list"

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    try {
      const stored = localStorage.getItem(USER_STORAGE_KEY)
      if (stored) {
        setUser(JSON.parse(stored))
      } else {
        setUser(DEFAULT_USER)
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(DEFAULT_USER))
      }
    } catch (e) {
      console.error("Failed to load user from localStorage", e)
      setUser(DEFAULT_USER)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const saveUserToStorage = (updatedUser: User | null) => {
    setUser(updatedUser)
    try {
      if (updatedUser) {
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updatedUser))
        const rawUsers = localStorage.getItem(ALL_USERS_KEY)
        const users: User[] = rawUsers ? JSON.parse(rawUsers) : [DEFAULT_USER]
        const idx = users.findIndex((u) => u.id === updatedUser.id || u.email === updatedUser.email)
        if (idx >= 0) {
          users[idx] = updatedUser
        } else {
          users.push(updatedUser)
        }
        localStorage.setItem(ALL_USERS_KEY, JSON.stringify(users))
      } else {
        localStorage.removeItem(USER_STORAGE_KEY)
      }
    } catch (e) {
      console.error("Failed to save user to localStorage", e)
    }
  }

  const login = async (email: string, password?: string): Promise<{ success: boolean; error?: string }> => {
    if (!email || !email.includes("@")) {
      return { success: false, error: "Please provide a valid email address." }
    }

    try {
      const rawUsers = localStorage.getItem(ALL_USERS_KEY)
      const users: User[] = rawUsers ? JSON.parse(rawUsers) : [DEFAULT_USER]
      const existing = users.find((u) => u.email.toLowerCase() === email.toLowerCase())

      if (existing) {
        saveUserToStorage(existing)
        return { success: true }
      }

      const newUser: User = {
        id: `user-${Date.now()}`,
        name: email.split("@")[0].replace(/[^a-zA-Z0-9]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
        email,
        dietaryRestrictions: [],
        allergies: "None",
        cookingSkill: "Intermediate",
        cookingTime: "30-60",
        favoriteCuisines: ["Italian", "Asian"],
        savedRecipeIds: [],
        likedRecipeIds: [],
        cookedRecipeIds: [],
        joinedDate: new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" }),
      }

      saveUserToStorage(newUser)
      return { success: true }
    } catch (err) {
      return { success: false, error: "An unexpected error occurred during login." }
    }
  }

  const signup = async (data: Partial<User> & { password?: string }): Promise<{ success: boolean; error?: string }> => {
    if (!data.email || !data.email.includes("@")) {
      return { success: false, error: "Please provide a valid email address." }
    }
    if (!data.name || data.name.trim().length === 0) {
      return { success: false, error: "Please enter your name." }
    }

    const newUser: User = {
      id: `user-${Date.now()}`,
      name: data.name.trim(),
      email: data.email.trim(),
      dietaryRestrictions: data.dietaryRestrictions || [],
      allergies: data.allergies || "None",
      cookingSkill: data.cookingSkill || "Intermediate",
      cookingTime: data.cookingTime || "30-60",
      favoriteCuisines: data.favoriteCuisines || ["Italian", "Mexican", "Asian"],
      savedRecipeIds: [],
      likedRecipeIds: [],
      cookedRecipeIds: [],
      joinedDate: new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" }),
    }

    saveUserToStorage(newUser)
    return { success: true }
  }

  const logout = () => {
    saveUserToStorage(null)
  }

  const updateProfile = (data: Partial<User>) => {
    if (!user) return
    const updated = { ...user, ...data }
    saveUserToStorage(updated)
  }

  const toggleSaveRecipe = (recipeId: number): boolean => {
    if (!user) return false
    const isSaved = user.savedRecipeIds.includes(recipeId)
    const newSaved = isSaved
      ? user.savedRecipeIds.filter((id) => id !== recipeId)
      : [...user.savedRecipeIds, recipeId]

    updateProfile({ savedRecipeIds: newSaved })
    return !isSaved
  }

  const isRecipeSaved = (recipeId: number): boolean => {
    if (!user) return false
    return user.savedRecipeIds.includes(recipeId)
  }

  const toggleLikeRecipe = (recipeId: number): boolean => {
    if (!user) return false
    const isLiked = user.likedRecipeIds.includes(recipeId)
    const newLiked = isLiked
      ? user.likedRecipeIds.filter((id) => id !== recipeId)
      : [...user.likedRecipeIds, recipeId]

    updateProfile({ likedRecipeIds: newLiked })
    return !isLiked
  }

  const isRecipeLiked = (recipeId: number): boolean => {
    if (!user) return false
    return user.likedRecipeIds.includes(recipeId)
  }

  const markRecipeCooked = (recipeId: number) => {
    if (!user) return
    if (!user.cookedRecipeIds.includes(recipeId)) {
      updateProfile({ cookedRecipeIds: [...user.cookedRecipeIds, recipeId] })
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        signup,
        logout,
        updateProfile,
        toggleSaveRecipe,
        isRecipeSaved,
        toggleLikeRecipe,
        isRecipeLiked,
        markRecipeCooked,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}


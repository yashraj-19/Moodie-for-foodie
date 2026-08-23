"use client"

import React, { createContext, useContext, useState, useEffect } from "react"

export interface User {
  id: string
  name: string
  email: string
  password: string
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
  moodHistory?: MoodHistoryEntry[]
  collections?: RecipeCollection[]
}

export interface MoodHistoryEntry {
  mood: string
  selectedAt: string
}

export interface RecipeCollection {
  id: string
  name: string
  recipeIds: number[]
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
  recordMood: (mood: string) => void
  createCollection: (name: string) => boolean
  renameCollection: (collectionId: string, name: string) => boolean
  deleteCollection: (collectionId: string) => void
  toggleRecipeInCollection: (collectionId: string, recipeId: number) => void
}

const DEFAULT_USER: User = {
  id: "user-1",
  name: "Alex Lee",
  email: "alex@example.com",
  password: "password",
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
  moodHistory: [],
  collections: [],
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const SESSION_STORAGE_KEY = "moodie_session"
const ALL_USERS_KEY = "moodie_users"

function normalizeUser(value: User): User {
  return { ...value, moodHistory: value.moodHistory || [], collections: value.collections || [] }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    try {
      const storedSession = localStorage.getItem(SESSION_STORAGE_KEY)
      const rawUsers = localStorage.getItem(ALL_USERS_KEY)
      const users: User[] = rawUsers ? JSON.parse(rawUsers) : []
      if (storedSession) {
        const sessionId = JSON.parse(storedSession).userId
        const sessionUser = users.find((candidate) => candidate.id === sessionId)
        setUser(sessionUser ? normalizeUser(sessionUser) : null)
      } else {
        setUser(null)
      }
    } catch (e) {
      console.error("Failed to load user from localStorage", e)
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const saveUserToStorage = (updatedUser: User | null) => {
    setUser(updatedUser)
    try {
      if (updatedUser) {
        const rawUsers = localStorage.getItem(ALL_USERS_KEY)
        const users: User[] = rawUsers ? JSON.parse(rawUsers) : []
        const idx = users.findIndex((u) => u.id === updatedUser.id || u.email === updatedUser.email)
        if (idx >= 0) {
          users[idx] = updatedUser
        } else {
          users.push(updatedUser)
        }
        localStorage.setItem(ALL_USERS_KEY, JSON.stringify(users))
        localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify({ userId: updatedUser.id }))
      } else {
        localStorage.removeItem(SESSION_STORAGE_KEY)
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
      const users: User[] = rawUsers ? JSON.parse(rawUsers) : email.trim().toLowerCase() === DEFAULT_USER.email ? [DEFAULT_USER] : []
      const existing = users.find((u) => u.email.toLowerCase() === email.toLowerCase())

      if (existing && existing.password === password) {
        saveUserToStorage(existing)
        return { success: true }
      }
      return { success: false, error: existing ? "That password is incorrect." : "No account found for this email." }
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
    if (!data.password || data.password.length < 4) {
      return { success: false, error: "Please choose a password with at least 4 characters." }
    }

    const rawUsers = localStorage.getItem(ALL_USERS_KEY)
    const users: User[] = rawUsers ? JSON.parse(rawUsers) : []
    if (users.some((candidate) => candidate.email.toLowerCase() === data.email!.trim().toLowerCase())) {
      return { success: false, error: "An account with that email already exists." }
    }

    const newUser: User = {
      id: `user-${Date.now()}`,
      name: data.name.trim(),
      email: data.email.trim(),
      password: data.password,
      dietaryRestrictions: data.dietaryRestrictions || [],
      allergies: data.allergies || "None",
      cookingSkill: data.cookingSkill || "Intermediate",
      cookingTime: data.cookingTime || "30-60",
      favoriteCuisines: data.favoriteCuisines || ["Italian", "Mexican", "Asian"],
      savedRecipeIds: [],
      likedRecipeIds: [],
      cookedRecipeIds: [],
      joinedDate: new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" }),
      moodHistory: [],
      collections: [],
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

  const recordMood = (mood: string) => {
    if (!user) return
    updateProfile({
      moodHistory: [...(user.moodHistory || []), { mood, selectedAt: new Date().toISOString() }].slice(-30),
    })
  }

  const createCollection = (name: string) => {
    if (!user || !name.trim() || (user.collections || []).some((collection) => collection.name.toLowerCase() === name.trim().toLowerCase())) return false
    updateProfile({ collections: [...(user.collections || []), { id: `collection-${Date.now()}`, name: name.trim(), recipeIds: [] }] })
    return true
  }

  const renameCollection = (collectionId: string, name: string) => {
    if (!user || !name.trim()) return false
    updateProfile({ collections: (user.collections || []).map((collection) => collection.id === collectionId ? { ...collection, name: name.trim() } : collection) })
    return true
  }

  const deleteCollection = (collectionId: string) => {
    if (!user) return
    updateProfile({ collections: (user.collections || []).filter((collection) => collection.id !== collectionId) })
  }

  const toggleRecipeInCollection = (collectionId: string, recipeId: number) => {
    if (!user) return
    updateProfile({
      collections: (user.collections || []).map((collection) => {
        if (collection.id !== collectionId) return collection
        const recipeIds = collection.recipeIds.includes(recipeId) ? collection.recipeIds.filter((id) => id !== recipeId) : [...collection.recipeIds, recipeId]
        return { ...collection, recipeIds }
      }),
    })
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
        recordMood,
        createCollection,
        renameCollection,
        deleteCollection,
        toggleRecipeInCollection,
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


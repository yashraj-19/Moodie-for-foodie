"use client"

import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Bell, Menu, X, Home, BookOpen, Users, Settings, LogOut, UtensilsCrossed, Sparkles } from "lucide-react"
import { useMobile } from "@/hooks/use-mobile"
import { useAuth } from "@/context/auth-context"
import { toast } from "sonner"

export default function DashboardHeader() {
  const router = useRouter()
  const pathname = usePathname()
  const isMobile = useMobile()
  const { user, isAuthenticated, logout, updateProfile } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [editName, setEditName] = useState(user?.name || "")
  const [editAllergies, setEditAllergies] = useState(user?.allergies || "")

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  const handleLogout = () => {
    logout()
    toast.success("Signed out successfully")
    router.push("/login")
  }

  const handleSaveSettings = () => {
    if (!editName.trim()) {
      toast.error("Name cannot be empty")
      return
    }
    updateProfile({
      name: editName.trim(),
      allergies: editAllergies.trim(),
    })
    toast.success("Profile updated successfully")
    setSettingsOpen(false)
  }

  const getInitials = (name: string) => {
    if (!name) return "MF"
    const parts = name.split(" ")
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
    }
    return name.slice(0, 2).toUpperCase()
  }

  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-gray-200 sticky top-0 z-30 shadow-xs">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {isMobile && (
              <Button variant="ghost" size="icon" onClick={toggleMobileMenu} aria-label="Toggle menu">
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5 text-gray-700" />}
              </Button>
            )}
            <Link href={isAuthenticated ? "/dashboard" : "/"} className="flex items-center space-x-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-600 to-orange-500 flex items-center justify-center shadow-sm text-white group-hover:scale-105 transition-transform">
                <UtensilsCrossed className="h-5 w-5" />
              </div>
              <div>
                <span className="font-bold text-lg text-amber-600 leading-none block">Moodie</span>
                <span className="text-[10px] tracking-wider uppercase font-semibold text-gray-400">for foodie</span>
              </div>
            </Link>
          </div>

          {!isMobile && (
            <nav className="flex items-center space-x-1 sm:space-x-2">
              <Link href="/dashboard">
                <Button
                  variant="ghost"
                  size="sm"
                  className={`${
                    pathname === "/dashboard" ? "text-amber-600 bg-amber-50 font-semibold" : "text-gray-600 hover:text-amber-600"
                  }`}
                >
                  <Home className="h-4 w-4 mr-1.5" />
                  Dashboard
                </Button>
              </Link>
              <Link href="/recipes">
                <Button
                  variant="ghost"
                  size="sm"
                  className={`${
                    pathname.startsWith("/recipes") ? "text-amber-600 bg-amber-50 font-semibold" : "text-gray-600 hover:text-amber-600"
                  }`}
                >
                  <BookOpen className="h-4 w-4 mr-1.5" />
                  Recipes
                </Button>
              </Link>
              <Link href="/community">
                <Button
                  variant="ghost"
                  size="sm"
                  className={`${
                    pathname === "/community" ? "text-amber-600 bg-amber-50 font-semibold" : "text-gray-600 hover:text-amber-600"
                  }`}
                >
                  <Users className="h-4 w-4 mr-1.5" />
                  Community
                </Button>
              </Link>
            </nav>
          )}

          <div className="flex items-center space-x-3">
            {isAuthenticated ? (
              <>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="relative text-gray-600 hover:text-amber-600">
                      <Bell className="h-5 w-5" />
                      <span className="absolute top-1 right-1 w-2 h-2 bg-amber-500 rounded-full animate-pulse"></span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-72" align="end">
                    <DropdownMenuLabel className="font-semibold text-sm">Notifications</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <div className="p-3 text-xs text-gray-600 space-y-2">
                      <div className="flex items-start space-x-2 bg-amber-50 p-2 rounded-md">
                        <Sparkles className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold text-gray-900">Personalized for you</p>
                          <p className="text-gray-500">New {user?.favoriteCuisines?.[0] || "Italian"} recipes added today.</p>
                        </div>
                      </div>
                      <div className="p-2 text-gray-500">
                        You have {user?.savedRecipeIds?.length || 0} recipes saved in your cookbook.
                      </div>
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-9 w-9 rounded-full ring-2 ring-amber-100 hover:ring-amber-300 transition-all p-0">
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={user?.avatar || ""} alt={user?.name || "User"} />
                        <AvatarFallback className="bg-amber-600 text-white font-semibold text-xs">
                          {getInitials(user?.name || "Alex Lee")}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-60" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-semibold leading-none text-gray-900">{user?.name || "Alex Lee"}</p>
                        <p className="text-xs leading-none text-gray-500">{user?.email || "alex@example.com"}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => {
                        setEditName(user?.name || "")
                        setEditAllergies(user?.allergies || "")
                        setSettingsOpen(true)
                      }}
                      className="cursor-pointer"
                    >
                      <Settings className="mr-2 h-4 w-4 text-gray-500" />
                      <span>Edit Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600 focus:text-red-600">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Link href="/login">
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link href="/onboarding">
                  <Button size="sm" className="bg-amber-600 hover:bg-amber-700 text-white">
                    Get Started
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile navigation drawer */}
        {isMobile && mobileMenuOpen && (
          <div className="mt-3 py-3 border-t border-gray-100 animate-in slide-in-from-top-2 duration-200">
            <nav className="flex flex-col space-y-1">
              <Link
                href="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center space-x-3 p-2.5 rounded-lg text-sm font-medium ${
                  pathname === "/dashboard" ? "bg-amber-50 text-amber-600" : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <Home className="h-4 w-4" />
                <span>Dashboard</span>
              </Link>
              <Link
                href="/recipes"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center space-x-3 p-2.5 rounded-lg text-sm font-medium ${
                  pathname.startsWith("/recipes") ? "bg-amber-50 text-amber-600" : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <BookOpen className="h-4 w-4" />
                <span>Explore Recipes</span>
              </Link>
              <Link
                href="/community"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center space-x-3 p-2.5 rounded-lg text-sm font-medium ${
                  pathname === "/community" ? "bg-amber-50 text-amber-600" : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <Users className="h-4 w-4" />
                <span>Community Hub</span>
              </Link>
            </nav>
          </div>
        )}
      </div>

      {/* Edit Profile Dialog */}
      <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
            <DialogDescription>Update your personal details and dietary preferences</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Your Name</Label>
              <Input
                id="edit-name"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder="Your Name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-allergies">Allergies / Excluded Ingredients</Label>
              <Input
                id="edit-allergies"
                value={editAllergies}
                onChange={(e) => setEditAllergies(e.target.value)}
                placeholder="e.g. Peanuts, Shellfish, Cilantro"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSettingsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveSettings} className="bg-amber-600 hover:bg-amber-700 text-white">
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </header>
  )
}

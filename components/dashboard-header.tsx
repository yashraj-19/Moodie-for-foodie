"use client"

import Link from "next/link"
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Bell, Menu, X, Home, Search, BookOpen, Users, Settings, LogOut } from "lucide-react"
import { useMobile } from "@/hooks/use-mobile"

export default function DashboardHeader() {
  const isMobile = useMobile()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  return (
    <header className="bg-white border-b sticky top-0 z-10">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {isMobile && (
              <Button variant="ghost" size="icon" onClick={toggleMobileMenu} aria-label="Toggle menu">
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            )}
            <Link href="/dashboard" className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-amber-600 flex items-center justify-center">
                <span className="text-white font-bold">CC</span>
              </div>
              {!isMobile && <span className="font-bold text-lg text-amber-600">Culinary Canvas</span>}
            </Link>
          </div>

          {!isMobile && (
            <nav className="flex items-center space-x-6">
              <Link href="/dashboard" className="text-gray-600 hover:text-amber-600 flex items-center space-x-1">
                <Home className="h-4 w-4" />
                <span>Home</span>
              </Link>
              <Link href="/recipes" className="text-gray-600 hover:text-amber-600 flex items-center space-x-1">
                <BookOpen className="h-4 w-4" />
                <span>Recipes</span>
              </Link>
              <Link href="/community" className="text-gray-600 hover:text-amber-600 flex items-center space-x-1">
                <Users className="h-4 w-4" />
                <span>Community</span>
              </Link>
            </nav>
          )}

          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder.svg?height=50&width=50" alt="User" />
                    <AvatarFallback>AL</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">Alex Lee</p>
                    <p className="text-xs leading-none text-gray-500">alex@example.com</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {isMobile && mobileMenuOpen && (
          <div className="mt-4 py-4 border-t">
            <nav className="flex flex-col space-y-4">
              <Link
                href="/dashboard"
                className="text-gray-600 hover:text-amber-600 flex items-center space-x-2 p-2 rounded-md hover:bg-gray-100"
              >
                <Home className="h-5 w-5" />
                <span>Home</span>
              </Link>
              <Link
                href="/recipes"
                className="text-gray-600 hover:text-amber-600 flex items-center space-x-2 p-2 rounded-md hover:bg-gray-100"
              >
                <BookOpen className="h-5 w-5" />
                <span>Recipes</span>
              </Link>
              <Link
                href="/community"
                className="text-gray-600 hover:text-amber-600 flex items-center space-x-2 p-2 rounded-md hover:bg-gray-100"
              >
                <Users className="h-5 w-5" />
                <span>Community</span>
              </Link>
              <Link
                href="/search"
                className="text-gray-600 hover:text-amber-600 flex items-center space-x-2 p-2 rounded-md hover:bg-gray-100"
              >
                <Search className="h-5 w-5" />
                <span>Search</span>
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}


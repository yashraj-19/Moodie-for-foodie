"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/context/auth-context"
import { toast } from "sonner"
import { UtensilsCrossed, ArrowRight } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid email address")
      return
    }

    setIsLoading(true)
    const result = await login(email, password)
    setIsLoading(false)

    if (result.success) {
      toast.success("Welcome back!")
      router.push("/dashboard")
    } else {
      toast.error(result.error || "Failed to sign in")
    }
  }

  const handleQuickDemoLogin = async () => {
    setIsLoading(true)
    await login("alex@example.com", "password")
    setIsLoading(false)
    toast.success("Signed in as Alex Lee (Demo Account)")
    router.push("/dashboard")
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white flex flex-col justify-center items-center p-4">
      <div className="mb-8 text-center">
        <Link href="/" className="inline-flex items-center space-x-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 to-orange-500 flex items-center justify-center text-white shadow-md">
            <UtensilsCrossed className="h-5 w-5" />
          </div>
          <span className="font-bold text-2xl text-amber-600 tracking-tight">Moodie for Foodie</span>
        </Link>
        <p className="text-gray-500 text-sm mt-1">Discover recipes tailored to your mood and taste</p>
      </div>

      <Card className="w-full max-w-md shadow-xl border-amber-100 bg-white">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold text-gray-900">Sign in to your account</CardTitle>
          <CardDescription>Access your saved recipes, customized meal plans & cooking history</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="alex@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <span className="text-xs text-amber-600 hover:underline cursor-pointer">Forgot password?</span>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-3">
            <Button type="submit" className="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign In"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full border-amber-200 text-amber-900 hover:bg-amber-50"
              onClick={handleQuickDemoLogin}
              disabled={isLoading}
            >
              Sign In with Demo Account (Alex Lee)
            </Button>
            <div className="text-center text-sm text-gray-500 pt-2">
              Don't have an account?{" "}
              <Link href="/onboarding" className="font-semibold text-amber-600 hover:underline">
                Get Started
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

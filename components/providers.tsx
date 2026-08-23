"use client"

import * as React from "react"
import { AuthProvider } from "@/context/auth-context"
import { Toaster } from "@/components/ui/sonner"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      {children}
      <Toaster position="bottom-right" richColors />
    </AuthProvider>
  )
}


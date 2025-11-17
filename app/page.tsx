'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'

export default function Home() {
  const router = useRouter()
  const { isAuthenticated, isLoading } = useAuth()
  const [hasRedirected, setHasRedirected] = useState(false)

  useEffect(() => {
    // Only redirect once, prevent infinite loops
    if (hasRedirected || isLoading) return

    // Only run in browser (not during SSR/build)
    if (typeof window === 'undefined') return

    // Small delay to prevent race conditions
    const timer = setTimeout(() => {
      if (!hasRedirected) {
        setHasRedirected(true)
        if (isAuthenticated) {
          router.replace('/dashboard')
        } else {
          router.replace('/login')
        }
      }
    }, 100)

    return () => clearTimeout(timer)
  }, [isAuthenticated, isLoading, router, hasRedirected])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-muted-foreground">Yuklanmoqda...</p>
      </div>
    </div>
  )
}


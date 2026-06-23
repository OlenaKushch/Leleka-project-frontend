'use client'

import { useEffect } from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { useAuthStore } from '@/store/auth.store'
import { isPublicAuthRoute } from '@/lib/routes'

export const useProtectedRoute = () => {
  const { isAuthenticated, hydrated, user } = useAuthStore()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!hydrated) return

    const isPublic = isPublicAuthRoute(pathname)

    if (!isAuthenticated && !isPublic) {
      router.replace('/auth/login')
    }

    if (isAuthenticated && isPublic) {
      router.replace(user?.hasCompletedOnboarding ? '/' : '/profile/edit')
    }
  }, [hydrated, isAuthenticated, pathname, router, user?.hasCompletedOnboarding])
}

export const useAuthErrorToast = (showError: (message: string) => void) => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const error = searchParams.get('error')
    const message = searchParams.get('message')

    if (error === 'google' && message) {
      showError(message)

      const params = new URLSearchParams(searchParams.toString())
      params.delete('error')
      params.delete('message')
      const query = params.toString()
      router.replace(query ? `${pathname}?${query}` : pathname)
    }
  }, [searchParams, router, pathname, showError])
}

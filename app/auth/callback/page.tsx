'use client'

import { Suspense, useEffect, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { Loader } from '@/components/Loader/Loader'
import { useAuthStore } from '@/store/auth.store'
import { apiClient } from '@/lib/apiClient'
import type { User } from '@/types/user'

function AuthCallbackContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const queryClient = useQueryClient()
  const setUser = useAuthStore(state => state.setUser)
  const handledRef = useRef(false)

  useEffect(() => {
    if (handledRef.current) return
    handledRef.current = true

    const error = searchParams.get('error')
    const message = searchParams.get('message')

    if (error) {
      toast.error(message || 'Помилка Google авторизації')
      router.replace('/auth/login')
      return
    }

    const completeAuth = async () => {
      try {
        const { data } = await apiClient.get<{ user?: User } & User>('/users/me')
        const user = data?.user ?? data

        if (!user) {
          throw new Error('Session not found')
        }

        queryClient.setQueryData(['me'], user)
        setUser(user)
        router.replace(user.hasCompletedOnboarding ? '/' : '/profile/edit')
      } catch {
        toast.error('Не вдалося підтвердити сесію після Google авторизації')
        router.replace('/auth/login')
      }
    }

    void completeAuth()
  }, [searchParams, router, queryClient, setUser])

  return (
    <div style={{ display: 'grid', placeItems: 'center', minHeight: '40vh' }}>
      <Loader />
    </div>
  )
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={<Loader />}>
      <AuthCallbackContent />
    </Suspense>
  )
}

'use client'

import { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import type { User } from '@/types/user'
import { hasAccessToken } from '@/lib/accessToken'
import { isValidUser } from '@/lib/authValidation'
import { useAuthStore } from '@/store/auth.store'
import { fetchCurrentUser } from '@/services/users.service'

export function useMe() {
  const setUser = useAuthStore(s => s.setUser)
  const clearAuth = useAuthStore(s => s.clearAuth)
  const isAuthenticated = useAuthStore(s => s.isAuthenticated)
  const hydrated = useAuthStore(s => s.hydrated)

  const query = useQuery<User | null>({
    queryKey: ['me'],
    queryFn: async (): Promise<User | null> => {
      try {
        return await fetchCurrentUser()
      } catch (error: unknown) {
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          return null
        }
        throw error
      }
    },
    retry: false,
    staleTime: Infinity,
    enabled: hydrated && isAuthenticated && hasAccessToken(),
  })

  useEffect(() => {
    if (query.isLoading || query.isPlaceholderData) return

    if (query.data) {
      if (isValidUser(query.data)) {
        setUser(query.data)
      } else {
        clearAuth()
      }
    } else if (query.isFetched && query.data === null && !query.isFetching) {
      clearAuth()
    }
  }, [
    query.isFetched,
    query.data,
    query.isLoading,
    query.isFetching,
    query.isPlaceholderData,
    setUser,
    clearAuth,
  ])

  return query
}

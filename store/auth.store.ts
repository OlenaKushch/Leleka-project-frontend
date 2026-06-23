import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User } from '../types/user'
import { isValidUser } from '@/lib/authValidation'
import { clearAccessToken, hasAccessToken } from '@/lib/accessToken'

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  hydrated: boolean 
  
  setUser: (userData: Partial<User> | User | null) => void
  clearAuth: () => void
  setHydrated: (state: boolean) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      hydrated: false,

      setUser: (userData) =>
        set((state) => {
          if (userData === null) {
            return { user: null, isAuthenticated: false }
          }
          const updatedUser = state.user
            ? { ...state.user, ...userData }
            : (userData as User)

          const authenticated = isValidUser(updatedUser)

          return {
            user: authenticated ? updatedUser : null,
            isAuthenticated: authenticated,
          }
        }),

      clearAuth: () => {
        clearAccessToken()
        set({
          user: null,
          isAuthenticated: false,
        })
      },

      setHydrated: (state) => set({ hydrated: state }),
    }),
    {
      name: 'auth-storage',
      partialize: state => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => state => {
        if (state?.user && !isValidUser(state.user)) {
          state.clearAuth()
        } else if (state?.isAuthenticated && !hasAccessToken()) {
          state.clearAuth()
        }
        state?.setHydrated(true)
      },
    }
  )
)
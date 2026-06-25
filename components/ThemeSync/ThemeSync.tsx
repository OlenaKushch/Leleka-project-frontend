'use client'

import { useEffect } from 'react'
import { useThemeStore } from '@/store/theme.store'
import { useAuthStore } from '@/store/auth.store'

export default function ThemeSync() {
  const theme = useThemeStore(state => state.theme)
  const setTheme = useThemeStore(state => state.setTheme)

  const hydrated = useAuthStore(state => state.hydrated)
  const isAuthenticated = useAuthStore(state => state.isAuthenticated)
  const userTheme = useAuthStore(state => state.user?.theme)

  // Тема походить від профілю: авторизований юзер -> його тема,
  // гість або після логауту -> стандартна 'neutral' (жовта).
  // Залежності змінюються лише при вході/виході чи збереженні профілю,
  // тож живий прев'ю теми в формі профілю це не перебиває.
  useEffect(() => {
    if (!hydrated) return

    const nextTheme =
      isAuthenticated && (userTheme === 'boy' || userTheme === 'girl')
        ? userTheme
        : 'neutral'

    setTheme(nextTheme)
  }, [hydrated, isAuthenticated, userTheme, setTheme])

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  return null
}

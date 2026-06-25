import { create } from 'zustand'

export type ThemeType = 'boy' | 'girl' | 'neutral'

interface ThemeState {
  theme: ThemeType
  setTheme: (theme: ThemeType) => void
}

// Тему НЕ зберігаємо в localStorage: вона походить виключно з профілю юзера.
// Для гостя/після логауту лишається стандартна 'neutral' (жовта).
export const useThemeStore = create<ThemeState>()((set) => ({
  theme: 'neutral',
  setTheme: (theme) => set({ theme }),
}))

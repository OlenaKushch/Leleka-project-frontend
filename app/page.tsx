'use client'

import { DashboardContent } from '@/components/Dashboard/DashboardContent'
import { LandingPage } from '@/components/landing/LandingPage'
import { Loader } from '@/components/Loader/Loader'
import { useAuthStore } from '@/store/auth.store'

export default function HomePage() {
  const hydrated = useAuthStore(state => state.hydrated)
  const isAuthenticated = useAuthStore(state => state.isAuthenticated)

  if (!hydrated) {
    return <Loader variant="fullscreen" />
  }

  if (isAuthenticated) {
    return <DashboardContent />
  }

  return <LandingPage />
}

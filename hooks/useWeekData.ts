'use client'

import { useQuery } from '@tanstack/react-query'
import { hasAccessToken } from '@/lib/accessToken'
import { useAuthStore } from '@/store/auth.store'
import {
  fetchCurrentJourneyWeek,
  fetchMyDayWeek,
  fetchWeekData,
} from '@/services/client/weeks.client'

const WEEK_STALE_TIME = 5 * 60 * 1000

export function useWeekData() {
  const hydrated = useAuthStore(state => state.hydrated)
  const isAuthenticated = useAuthStore(state => state.isAuthenticated)
  const dueDate = useAuthStore(state => state.user?.dueDate ?? '')

  return useQuery({
    queryKey: ['weekData', isAuthenticated && hasAccessToken() ? 'private' : 'public', dueDate],
    queryFn: fetchWeekData,
    enabled: hydrated,
    staleTime: WEEK_STALE_TIME,
    retry: 1,
  })
}

export function useMyDayWeek(enabled = true) {
  const hydrated = useAuthStore(state => state.hydrated)
  const dueDate = useAuthStore(state => state.user?.dueDate ?? '')

  return useQuery({
    queryKey: ['myDayWeek', dueDate],
    queryFn: fetchCurrentJourneyWeek,
    enabled: enabled && hydrated && hasAccessToken(),
    staleTime: WEEK_STALE_TIME,
    retry: 1,
  })
}

export function useAuthenticatedWeekData(enabled = true) {
  const hydrated = useAuthStore(state => state.hydrated)
  const dueDate = useAuthStore(state => state.user?.dueDate ?? '')

  return useQuery({
    queryKey: ['authenticatedWeekData', dueDate],
    queryFn: fetchMyDayWeek,
    enabled: enabled && hydrated && hasAccessToken(),
    staleTime: WEEK_STALE_TIME,
    retry: 1,
  })
}

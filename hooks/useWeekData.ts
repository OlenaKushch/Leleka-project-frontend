'use client'

import { useQuery } from '@tanstack/react-query'
import {
  fetchCurrentJourneyWeek,
  fetchMyDayWeek,
  fetchWeekData,
} from '@/services/client/weeks.client'

const WEEK_STALE_TIME = 5 * 60 * 1000

export function useWeekData() {
  return useQuery({
    queryKey: ['weekData'],
    queryFn: fetchWeekData,
    staleTime: WEEK_STALE_TIME,
    retry: 1,
  })
}

export function useMyDayWeek(enabled = true) {
  return useQuery({
    queryKey: ['myDayWeek'],
    queryFn: fetchCurrentJourneyWeek,
    enabled,
    staleTime: WEEK_STALE_TIME,
    retry: 1,
  })
}

export function useAuthenticatedWeekData(enabled = true) {
  return useQuery({
    queryKey: ['authenticatedWeekData'],
    queryFn: fetchMyDayWeek,
    enabled,
    staleTime: WEEK_STALE_TIME,
    retry: 1,
  })
}

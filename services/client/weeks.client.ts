import { apiClient } from '@/lib/apiClient'
import {
  mapDashboardToWeekData,
  type NestDashboardResponse,
  type NestJourneyWeeksResponse,
} from '@/lib/weeksMappers'
import type { WeekData } from '@/types/babyData'

const DEFAULT_PUBLIC_WEEK = 20

export async function fetchMyDayWeek(): Promise<WeekData> {
  const { data } = await apiClient.get<NestDashboardResponse>('/weeks/me')
  return mapDashboardToWeekData(data)
}

export async function fetchPublicWeek(): Promise<WeekData> {
  const { data } = await apiClient.get<NestDashboardResponse>('/weeks', {
    params: { weekNumber: DEFAULT_PUBLIC_WEEK },
  })
  return mapDashboardToWeekData(data)
}

export async function fetchWeekData(): Promise<WeekData> {
  try {
    return await fetchMyDayWeek()
  } catch {
    return fetchPublicWeek()
  }
}

export async function fetchCurrentJourneyWeek(): Promise<number> {
  const { data } = await apiClient.get<NestJourneyWeeksResponse>('/journey/weeks')
  return data.currentWeekNumber
}

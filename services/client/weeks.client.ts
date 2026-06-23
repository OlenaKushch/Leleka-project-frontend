import axios from 'axios'
import { apiClient } from '@/lib/apiClient'
import { hasAccessToken } from '@/lib/accessToken'
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
  if (!hasAccessToken()) {
    return fetchPublicWeek()
  }

  try {
    return await fetchMyDayWeek()
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      return fetchPublicWeek()
    }

    throw error
  }
}

export async function fetchCurrentJourneyWeek(): Promise<number> {
  const { data } = await apiClient.get<NestJourneyWeeksResponse>('/journey/weeks')
  return data.currentWeekNumber
}

import { serverFetch } from '@/lib/serverApiClient'
import {
  mapDashboardToWeekData,
  type NestDashboardResponse,
} from '@/lib/weeksMappers'
import type { BabyInfo, MomInfo, WeekData } from '@/types/babyData'

const DEFAULT_PUBLIC_WEEK = 20

export const getFirstWeekInfo = async (): Promise<WeekData> => {
  const res = await serverFetch(`/weeks?weekNumber=${DEFAULT_PUBLIC_WEEK}`)

  if (!res.ok) throw new Error('Failed to fetch public week info')
  const data = (await res.json()) as NestDashboardResponse
  return mapDashboardToWeekData(data)
}

export const getMyDayWeekInfo = async (): Promise<WeekData> => {
  const res = await serverFetch('/weeks/me')

  if (!res.ok) throw new Error('Failed to fetch my day')
  const data = (await res.json()) as NestDashboardResponse
  return mapDashboardToWeekData(data)
}

export const getWeekBabyInfo = async (weekNumber: number): Promise<BabyInfo> => {
  const res = await serverFetch(`/journey/${weekNumber}/baby`)

  if (!res.ok) throw new Error('Failed to fetch baby info')
  return res.json()
}

export const getWeekMomInfo = async (weekNumber: number): Promise<MomInfo> => {
  const res = await serverFetch(`/journey/${weekNumber}/mom`)

  if (!res.ok) throw new Error('Failed to fetch mom info')
  return res.json()
}

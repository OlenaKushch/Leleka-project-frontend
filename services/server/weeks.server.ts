import { BabyInfo, MomInfo, WeekData } from '@/types/babyData'
import { serverFetch } from '@/lib/serverApiClient'

export const getFirstWeekInfo = async (): Promise<WeekData> => {
  const res = await serverFetch('/weeks/public/my-day')

  if (!res.ok) throw new Error('Failed to fetch public week info')
  return res.json()
}

export const getMyDayWeekInfo = async (): Promise<WeekData> => {
  const res = await serverFetch('/weeks/me/my-day')

  if (!res.ok) throw new Error('Failed to fetch my day')
  return res.json()
}

export const getWeekBabyInfo = async (): Promise<BabyInfo> => {
  const res = await serverFetch('/weeks/me/journey/baby')

  if (!res.ok) throw new Error('Failed to fetch baby info')
  return res.json()
}

export const getWeekMomInfo = async (): Promise<MomInfo> => {
  const res = await serverFetch('/weeks/me/journey/mom')

  if (!res.ok) throw new Error('Failed to fetch mom info')
  return res.json()
}

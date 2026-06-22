import type { BabyInfo, MomInfo, WeekData } from '@/types/babyData'

export interface NestDashboardResponse {
  weekNumber: number
  daysToBirth: number
  baby: {
    analogy: string
    babySize: number
    babyWeight: number
    image: string
    activity: string
  }
  momTip: string | null
}

export interface NestJourneyWeeksResponse {
  currentWeekNumber: number
}

export function mapDashboardToWeekData(data: NestDashboardResponse): WeekData {
  return {
    weekNumber: data.weekNumber,
    daysToMeeting: data.daysToBirth,
    image: data.baby.image,
    imageAlt: data.baby.analogy,
    babySize: data.baby.babySize,
    babyWeight: data.baby.babyWeight,
    babyActivity: data.baby.activity,
    babyDevelopment: data.baby.analogy,
    momDailyTips: data.momTip ? [data.momTip] : [],
  }
}

export function mapBabyInfo(data: BabyInfo): BabyInfo {
  return {
    ...data,
    imageAlt: data.imageAlt || data.analogy || 'Малюк',
  }
}

export function mapMomInfo(data: MomInfo): MomInfo {
  const feelings = data.feelings ?? { states: [], sensationDescr: '' }
  const comfortTips = Array.isArray(data.comfortTips) ? data.comfortTips : []

  return {
    weekNumber: data.weekNumber,
    feelings: {
      states: Array.isArray(feelings.states) ? feelings.states : [],
      sensationDescr: feelings.sensationDescr ?? '',
    },
    comfortTips,
  }
}

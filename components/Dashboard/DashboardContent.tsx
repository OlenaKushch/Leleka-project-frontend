'use client'

import { GreetingBlock } from '@/components/GreetingBlock/GreetingBlock'
import { MomTipCard } from '@/components/MomTipCard/mom-tip-card'
import { BabyTodayCard } from '@/components/BabyTodayCard/baby-today-card'
import StatusBlock from '@/components/StatusBlock/StatusBlock'
import { FeelingCheckCard } from '@/components/FeelingCheckCard/FeelingCheckCard'
import TasksList from '@/components/tasks/TasksReminderCard'
import { useWeekData } from '@/hooks/useWeekData'
import { DashboardSkeleton } from './DashboardSkeleton'
import css from '@/app/page.module.css'

export function DashboardContent() {
  const { data: weekData, isLoading, isError, refetch } = useWeekData()

  if (isLoading) {
    return <DashboardSkeleton />
  }

  if (isError || !weekData) {
    return (
      <div className={css.container}>
        <GreetingBlock />
        <div className={css.errorState}>
          <p>Не вдалося завантажити дані. Сервер може прокидатися.</p>
          <button type="button" onClick={() => refetch()}>
            Спробувати ще раз
          </button>
        </div>
      </div>
    )
  }

  const momDailyTips = weekData.momDailyTips ?? []
  const tipIndex = momDailyTips.length > 1 ? 6 - (weekData.daysToMeeting % 7) : 0

  return (
    <div className={css.container}>
      <GreetingBlock />
      <div className={css.column}>
        <div className={css.left}>
          <div className={css.dashboardCard}>
            <StatusBlock currentWeek={weekData.weekNumber} daysLeft={weekData.daysToMeeting} />
          </div>
          <div className={`${css.dashboardCard} ${css.dashboardCardTall}`}>
            <BabyTodayCard
              image={weekData.image}
              imageAlt={weekData.imageAlt}
              babySize={weekData.babySize}
              babyWeight={weekData.babyWeight}
              babyActivity={weekData.babyActivity}
              babyDevelopment={weekData.babyDevelopment}
            />
          </div>
          <div className={css.dashboardCard}>
            <MomTipCard tipIndex={tipIndex} momDailyTips={momDailyTips} />
          </div>
        </div>
        <div className={css.right}>
          <div className={`${css.dashboardCard} ${css.dashboardCardTasks}`}>
            <TasksList />
          </div>
          <div className={css.dashboardCard}>
            <FeelingCheckCard />
          </div>
        </div>
      </div>
    </div>
  )
}

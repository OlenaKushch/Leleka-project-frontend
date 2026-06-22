'use client'

import { useState } from 'react'
import { useProtectedRoute } from '@/hooks/useProtectedRoute'
import { GreetingBlock } from '@/components/GreetingBlock/GreetingBlock'
import JourneyDetails from '@/components/JourneyDetails/JourneyDetails'
import WeekSelector from '@/components/WeekSelector/WeekSelector'
import { Loader } from '@/components/Loader/Loader'
import { useMyDayWeek } from '@/hooks/useWeekData'
import css from './JourneyPage.module.css'

export default function JourneyPage() {
  useProtectedRoute()

  const { data: currentWeek, isLoading, isError, refetch } = useMyDayWeek()
  const [selectedWeek, setSelectedWeek] = useState<number | null>(null)

  const activeWeek = selectedWeek ?? currentWeek ?? null

  if (isLoading) {
    return <Loader variant="fullscreen" />
  }

  if (isError || typeof currentWeek !== 'number' || activeWeek === null) {
    return (
      <div className={css.errorState}>
        <p>Не вдалося завантажити поточний тиждень.</p>
        <button type="button" onClick={() => refetch()}>
          Спробувати ще раз
        </button>
      </div>
    )
  }

  return (
    <div className={css.container}>
      <GreetingBlock />
      <WeekSelector
        currentWeek={currentWeek}
        selectedWeek={activeWeek}
        onWeekSelect={setSelectedWeek}
      />
      <JourneyDetails weekNumber={activeWeek} />
    </div>
  )
}

'use client'

import React, { useEffect, useState } from 'react'
import { useProtectedRoute } from '@/hooks/useProtectedRoute'
import { GreetingBlock } from '@/components/GreetingBlock/GreetingBlock'
import JourneyDetails from '@/components/JourneyDetails/JourneyDetails'
import WeekSelector from '@/components/WeekSelector/WeekSelector'
import css from './JourneyPage.module.css'
import { apiClient } from '@/lib/apiClient'
import type { WeekData } from '@/types/babyData'
import { Loader } from '@/components/Loader/Loader'

export default function JourneyPage() {
  useProtectedRoute()

  const [currentWeek, setCurrentWeek] = useState<number | null>(null)
  const [selectedWeek, setSelectedWeek] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadWeek = async () => {
      setError(null)
      const res = await apiClient.get<WeekData>('/weeks/me/my-day')
      setCurrentWeek(res.data.weekNumber)
      setSelectedWeek(res.data.weekNumber)
    }

    loadWeek().catch((e) => {
      console.error(e)
      setError('Не вдалося завантажити поточний тиждень')
    })
  }, [])

  if (error) {
    return <div style={{ padding: 16 }}>{error}</div>
  }

  if (currentWeek === null || selectedWeek === null) {
    return <Loader />
  }

  return (
    <div className={css.container}>
      <GreetingBlock />
      <WeekSelector
        currentWeek={currentWeek}
        selectedWeek={selectedWeek}
        onWeekSelect={setSelectedWeek}
      />
      <JourneyDetails weekNumber={selectedWeek} />
    </div>
  )
}

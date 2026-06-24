'use client'

import { useEffect, useRef } from 'react'
import css from './WeekSelector.module.css'

interface WeekSelectorProps {
  currentWeek: number
  selectedWeek: number
  onWeekSelect: (week: number) => void
}

const TOTAL_WEEKS = 42

const WeekSelector = ({
  currentWeek,
  selectedWeek,
  onWeekSelect,
}: WeekSelectorProps) => {
  const listRef = useRef<HTMLUListElement | null>(null)

  const weeks = Array.from({ length: TOTAL_WEEKS }, (_, i) => i + 1)

  /* ================= CENTER ON SELECT ================= */

  useEffect(() => {
    const list = listRef.current
    if (!list) return

    const el = list.querySelector(
      `[data-week="${selectedWeek}"]`
    ) as HTMLElement | null

    el?.scrollIntoView({
      behavior: 'smooth',
      inline: 'center',
      block: 'nearest',
    })
  }, [selectedWeek])

  /* ================= CLICK ================= */

  const handleWeekClick = (week: number) => {
    onWeekSelect(week)
  }

  /* ================= RENDER ================= */

  return (
    <ul ref={listRef} className={css.list}>
      {weeks.map(week => (
        <li
          key={week}
          data-week={week}
          className={`${css.week} ${
            week === selectedWeek
              ? css.active
              : week === currentWeek
              ? css.current
              : week < currentWeek
              ? css.past
              : css.future
          }`}
          onClick={() => handleWeekClick(week)}
        >
          <span className={css.value}>{week}</span>
          <span className={css.text}>Тиждень</span>
        </li>
      ))}
    </ul>
  )
}

export default WeekSelector

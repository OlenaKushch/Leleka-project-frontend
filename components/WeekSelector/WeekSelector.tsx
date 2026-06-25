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

  const goToPrev = () => onWeekSelect(Math.max(1, selectedWeek - 1))
  const goToNext = () => onWeekSelect(Math.min(TOTAL_WEEKS, selectedWeek + 1))

  /* ================= RENDER ================= */

  return (
    <div className={css.wrapper}>
      <button
        type="button"
        className={css.navBtn}
        onClick={goToPrev}
        disabled={selectedWeek <= 1}
        aria-label="Попередній тиждень"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M15 6L9 12L15 18"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

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

      <button
        type="button"
        className={css.navBtn}
        onClick={goToNext}
        disabled={selectedWeek >= TOTAL_WEEKS}
        aria-label="Наступний тиждень"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M9 6L15 12L9 18"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  )
}

export default WeekSelector

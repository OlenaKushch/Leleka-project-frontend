'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useQuery, useQueryClient } from '@tanstack/react-query'

import { useAuthStore } from '@/store/auth.store'
import { hasAccessToken } from '@/lib/accessToken'
import { AddDiaryEntryModal } from '@/components/add-diary-entry-modal/AddDiaryEntryModal'
import { DiaryService } from '@/services/diary.service'

import css from './FeelingCheckCard.module.css'

const isToday = (isoDate: string): boolean => {
  const date = new Date(isoDate)
  const now = new Date()
  return (
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate()
  )
}

export const FeelingCheckCard = () => {
  const router = useRouter()
  const user = useAuthStore(state => state.user)
  const queryClient = useQueryClient()

  const [isModalOpen, setIsModalOpen] = useState(false)

  const canFetch = Boolean(user) && hasAccessToken()

  const { data: emotions = [] } = useQuery({
    queryKey: ['emotions'],
    queryFn: () => DiaryService.getEmotions(),
    enabled: canFetch,
    staleTime: 60 * 60 * 1000,
  })

  const { data: entries = [] } = useQuery({
    queryKey: ['diaries'],
    queryFn: () => DiaryService.getEntries(),
    enabled: canFetch,
  })

  const todayEmotions = useMemo(() => {
    const titleById = new Map(emotions.map(e => [e._id, e.title]))

    const ids = new Set<string>()
    for (const entry of entries) {
      if (!isToday(entry.date)) continue
      for (const id of entry.emotions ?? []) ids.add(id)
    }

    return Array.from(ids)
      .map(id => titleById.get(id))
      .filter((title): title is string => Boolean(title))
  }, [entries, emotions])

  const handleClick = () => {
    if (!user) {
      router.push('/auth/register')
      return
    }

    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
  }

  const handleSubmitSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['diaries'] })
    setIsModalOpen(false)
  }

  return (
    <section className={css.feelingcheck_section}>
      <h2 className={css.feelingcheck_title}>Як ви себе почуваєте?</h2>

      {todayEmotions.length > 0 ? (
        <div className={css.feelingcheck_emotions}>
          <p className={css.feelingcheck_emotions_label}>Сьогодні ви відчуваєте:</p>
          <ul className={css.feelingcheck_chips}>
            {todayEmotions.map(title => (
              <li key={title} className={css.feelingcheck_chip}>
                {title}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p className={css.feelingcheck_recommendation}>
          Рекомендація на сьогодні: <br />
          <span className={css.feelingcheck_span}>Занотуйте незвичні відчуття у тілі.</span>
        </p>
      )}

      <button type="button" className={css.feelingcheck_button} onClick={handleClick}>
        Зробити запис у щоденник
      </button>

      {user && isModalOpen && (
        <AddDiaryEntryModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSubmitSuccess={handleSubmitSuccess}
        />
      )}
    </section>
  )
}

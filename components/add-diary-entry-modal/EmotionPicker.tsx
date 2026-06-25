'use client'

import { useMemo, useState } from 'react'
import type { Emotion } from '@/interfaces/diary'
import {
  categorizeEmotion,
  getEmotionEmoji,
  getRecentEmotionIds,
  POPULAR_EMOTION_TITLES,
  recordRecentEmotion,
  type EmotionCategory,
} from '@/lib/emotionUtils'
import styles from './AddDiaryEntryForm.module.css'

interface EmotionPickerProps {
  emotions: Emotion[]
  selectedIds: string[]
  onChange: (ids: string[]) => void
}

const TAB_LABELS: Record<EmotionCategory, string> = {
  emotion: 'Емоції',
  body: 'Тіло',
}

export function EmotionPicker({ emotions, selectedIds, onChange }: EmotionPickerProps) {
  const [search, setSearch] = useState('')
  const [activeTab, setActiveTab] = useState<EmotionCategory>('emotion')
  const [recentVersion, setRecentVersion] = useState(0)

  const titleById = useMemo(() => {
    const map = new Map<string, string>()
    for (const emotion of emotions) map.set(emotion._id, emotion.title)
    return map
  }, [emotions])

  const selectedItems = useMemo(
    () =>
      selectedIds
        .map(id => ({ id, title: titleById.get(id) }))
        .filter((item): item is { id: string; title: string } => Boolean(item.title)),
    [selectedIds, titleById]
  )

  const filteredEmotions = useMemo(() => {
    const query = search.trim().toLowerCase()
    return emotions.filter(emotion => {
      if (categorizeEmotion(emotion.title) !== activeTab) return false
      if (!query) return true
      return emotion.title.toLowerCase().includes(query)
    })
  }, [emotions, activeTab, search])

  const popularEmotions = useMemo(() => {
    const popularSet = new Set<string>(POPULAR_EMOTION_TITLES)
    return emotions.filter(emotion => popularSet.has(emotion.title))
  }, [emotions])

  const recentEmotions = useMemo(() => {
    const recentIds = getRecentEmotionIds()
    return recentIds
      .map(id => emotions.find(emotion => emotion._id === id))
      .filter((emotion): emotion is Emotion => Boolean(emotion))
  }, [emotions, recentVersion])

  const toggleEmotion = (emotionId: string) => {
    const exists = selectedIds.includes(emotionId)
    const next = exists
      ? selectedIds.filter(id => id !== emotionId)
      : [...selectedIds, emotionId]

    if (!exists) {
      recordRecentEmotion(emotionId)
      setRecentVersion(version => version + 1)
    }
    onChange(next)
  }

  const removeEmotion = (emotionId: string) => {
    onChange(selectedIds.filter(id => id !== emotionId))
  }

  const renderQuickChip = (emotion: Emotion) => {
    const checked = selectedIds.includes(emotion._id)
    return (
      <button
        key={emotion._id}
        type="button"
        className={`${styles.quickChip} ${checked ? styles.quickChipActive : ''}`}
        onClick={() => toggleEmotion(emotion._id)}
      >
        <span aria-hidden="true">{getEmotionEmoji(emotion.title)}</span>
        {emotion.title}
      </button>
    )
  }

  const renderOption = (emotion: Emotion) => {
    const checked = selectedIds.includes(emotion._id)
    return (
      <label key={emotion._id} className={`${styles.optionRow} ${checked ? styles.optionRowChecked : ''}`}>
        <input
          type="checkbox"
          checked={checked}
          onChange={() => toggleEmotion(emotion._id)}
          className={styles.nativeCheckbox}
        />
        <span className={`${styles.checkboxBox} ${checked ? styles.checkboxBoxChecked : ''}`}>
          {checked && (
            <svg className={styles.checkboxTick} viewBox="0 0 24 24" aria-hidden="true">
              <path d="M9.0 16.2L4.8 12l-1.4 1.4L9 19 20.6 7.4 19.2 6z" fill="currentColor" />
            </svg>
          )}
        </span>
        <span className={styles.optionEmoji} aria-hidden="true">
          {getEmotionEmoji(emotion.title)}
        </span>
        <span className={styles.optionText}>{emotion.title}</span>
      </label>
    )
  }

  return (
    <div className={styles.emotionPicker}>
      {selectedItems.length > 0 && (
        <div className={styles.selectedChips}>
          {selectedItems.map(item => (
            <span key={item.id} className={styles.chip}>
              <span aria-hidden="true">{getEmotionEmoji(item.title)}</span>
              {item.title}
              <button
                type="button"
                className={styles.chipRemove}
                onClick={() => removeEmotion(item.id)}
                aria-label={`Прибрати ${item.title}`}
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}

      <div className={styles.searchWrap}>
        <svg className={styles.searchIcon} width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Zm8.2 2.3-4.2-4.2"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
        <input
          type="search"
          value={search}
          onChange={event => setSearch(event.target.value)}
          placeholder="Пошук відчуття…"
          className={styles.searchInput}
        />
      </div>

      <div className={styles.tabs} role="tablist" aria-label="Тип відчуття">
        {(['emotion', 'body'] as const).map(tab => (
          <button
            key={tab}
            type="button"
            role="tab"
            aria-selected={activeTab === tab}
            className={`${styles.tab} ${activeTab === tab ? styles.tabActive : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {TAB_LABELS[tab]}
          </button>
        ))}
      </div>

      {!search && (
        <div className={styles.quickSections}>
          {popularEmotions.length > 0 && (
            <div className={styles.quickSection}>
              <p className={styles.quickLabel}>Популярні</p>
              <div className={styles.quickChips}>{popularEmotions.map(renderQuickChip)}</div>
            </div>
          )}

          {recentEmotions.length > 0 && (
            <div className={styles.quickSection}>
              <p className={styles.quickLabel}>Нещодавні</p>
              <div className={styles.quickChips}>{recentEmotions.map(renderQuickChip)}</div>
            </div>
          )}
        </div>
      )}

      <div className={styles.emotionPanel}>
        <div className={styles.panelHeader}>{TAB_LABELS[activeTab]}</div>
        <div className={styles.emotionList}>
          {filteredEmotions.length > 0 ? (
            filteredEmotions.map(renderOption)
          ) : (
            <p className={styles.emptySearch}>Нічого не знайдено</p>
          )}
        </div>
      </div>
    </div>
  )
}

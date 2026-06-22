'use client'

import React, { useEffect, useId, useMemo, useRef, useState } from 'react'
import { Field, Form, Formik, ErrorMessage, FormikHelpers } from 'formik'
import * as Yup from 'yup'
import toast from 'react-hot-toast'
import axios from 'axios'
import { apiClient } from '@/lib/apiClient'
import { Emotion, DiaryEntry } from '@/interfaces/diary'
import styles from './AddDiaryEntryForm.module.css'

interface FormValues {
  title: string
  emotions: string[]
  description: string
}

interface AddDiaryEntryFormProps {
  initialData?: DiaryEntry | null
  isEdit?: boolean
  onSubmitSuccess: (savedEntry: DiaryEntry) => void
  onClose: () => void
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
}

const validationSchema = Yup.object({
  title: Yup.string().min(2, 'Має бути щонайменше 2 символи').required('Заголовок обовʼязковий'),
  emotions: Yup.array().min(1, 'Виберіть хоча б одну емоцію').required('Оберіть емоцію'),
  description: Yup.string().min(5, 'Опишіть ваші думки детальніше').required('Поле обовʼязкове'),
})

export default function AddDiaryEntryForm({
  initialData,
  isEdit = false,
  onSubmitSuccess,
  onClose,
  setLoading,
}: AddDiaryEntryFormProps) {
  const fieldId = useId()
  const [availableEmotions, setAvailableEmotions] = useState<Emotion[]>([])
  const [isEmotionsOpen, setIsEmotionsOpen] = useState(false)
  const emotionsWrapRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const fetchEmotions = async () => {
      try {
        const { data } = await apiClient.get<Emotion[]>('/emotions/emotions')
        setAvailableEmotions(data)
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          console.error('Помилка:', error.response?.status)
        }
      }
    }
    fetchEmotions()
  }, [])

  const initialValues: FormValues = useMemo(() => {
    if (initialData) {
      return {
        title: initialData.title || '',
        emotions: Array.isArray(initialData.emotions)
          ? initialData.emotions.map((e: string | Emotion) => (typeof e === 'string' ? e : e._id))
          : [],
        description: initialData.description || '',
      }
    }
    return { title: '', emotions: [], description: '' }
  }, [initialData])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (emotionsWrapRef.current && !emotionsWrapRef.current.contains(event.target as Node)) {
        setIsEmotionsOpen(false)
      }
    }
    if (isEmotionsOpen) document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isEmotionsOpen])

  const emotionTitleById = useMemo(() => {
    const m = new Map<string, string>()
    for (const e of availableEmotions) m.set(e._id, e.title)
    return m
  }, [availableEmotions])

  const handleSubmit = async (values: FormValues, { setSubmitting }: FormikHelpers<FormValues>) => {
    setLoading(true)
    try {
      let response

      if (isEdit && initialData) {
        response = await apiClient.patch<DiaryEntry>(`/diaries/me/${initialData._id}`, values)
      } else {
        response = await apiClient.post<DiaryEntry>('/diaries/me', values)
      }

      onSubmitSuccess(response.data)
      onClose()
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.status === 401 ? 'Авторизуйтесь знову' : 'Помилка збереження')
      }
    } finally {
      setLoading(false)
      setSubmitting(false)
    }
  }

  const handleDropdownToggle = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsEmotionsOpen(prev => !prev)
  }

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
      enableReinitialize={true}
    >
      {({ isSubmitting, values, setFieldValue }) => {
        const selected = values.emotions
          .map(id => ({ id, title: emotionTitleById.get(id) }))
          .filter((x): x is { id: string; title: string } => Boolean(x.title))

        const toggleEmotion = (emotionId: string) => {
          const exists = values.emotions.includes(emotionId)
          const next = exists
            ? values.emotions.filter(id => id !== emotionId)
            : [...values.emotions, emotionId]
          setFieldValue('emotions', next)
        }

        return (
          <Form className={styles.form}>
            <div className={styles.fieldGroup}>
              <label htmlFor={`${fieldId}-title`} className={styles.label}>
                Заголовок
              </label>
              <Field
                id={`${fieldId}-title`}
                name="title"
                className={styles.input}
                placeholder="Введіть заголовок запису"
              />
              <ErrorMessage name="title" component="div" className={styles.errorMessage} />
            </div>

            <div
              className={`${styles.fieldGroup} ${styles.fieldGroupCategories}`}
              ref={emotionsWrapRef}
            >
              <label className={styles.label}>Категорії</label>
              <div className={styles.dropdownWrapper}>
                <button
                  type="button"
                  className={`${styles.dropdownControl} ${
                    isEmotionsOpen ? styles.dropdownControlOpen : ''
                  }`}
                  onClick={handleDropdownToggle}
                >
                  <div className={styles.dropdownValue}>
                    {selected.length === 0 ? (
                      <span className={styles.dropdownPlaceholder}>Оберіть категорію</span>
                    ) : (
                      <div className={styles.chips}>
                        {selected.map(item => (
                          <span key={item.id} className={styles.chip}>
                            {item.title}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <svg
                    className={`${styles.chevronIcon} ${
                      isEmotionsOpen ? styles.chevronIconOpen : ''
                    }`}
                    width="24"
                    height="24"
                  >
                    <use href="/sprite.svg#icon-chevron_right" />
                  </svg>
                </button>
                {isEmotionsOpen && (
                  <div className={styles.dropdownPanel} onMouseDown={e => e.stopPropagation()}>
                    <div className={styles.dropdownScroll}>
                      {availableEmotions.map(e => {
                        const checked = values.emotions.includes(e._id)
                        return (
                          <div
                            key={e._id}
                            className={`${styles.optionRow} ${
                              checked ? styles.optionRowChecked : ''
                            }`}
                            onClick={ev => {
                              ev.preventDefault()
                              toggleEmotion(e._id)
                            }}
                          >
                            <input
                              type="checkbox"
                              checked={checked}
                              readOnly
                              className={styles.nativeCheckbox}
                            />
                            <span
                              className={`${styles.checkboxBox} ${
                                checked ? styles.checkboxBoxChecked : ''
                              }`}
                            >
                              {checked && (
                                <svg className={styles.checkboxTick} viewBox="0 0 24 24">
                                  <path
                                    d="M9.0 16.2L4.8 12l-1.4 1.4L9 19 20.6 7.4 19.2 6z"
                                    fill="currentColor"
                                  />
                                </svg>
                              )}
                            </span>
                            <span className={styles.optionText}>{e.title}</span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>
              <ErrorMessage name="emotions" component="div" className={styles.errorMessage} />
            </div>

            <div className={`${styles.fieldGroup} ${styles.fieldGroupTextarea}`}>
              <label htmlFor={`${fieldId}-desc`} className={styles.label}>
                Запис
              </label>
              <Field
                as="textarea"
                id={`${fieldId}-desc`}
                name="description"
                className={styles.textarea}
                placeholder="Запишіть, як ви себе відчуваєте"
              />
              <ErrorMessage name="description" component="div" className={styles.errorMessage} />
            </div>

            <div className={styles.buttonGroup}>
              <button type="submit" disabled={isSubmitting} className={styles.buttonPrimary}>
                {isSubmitting ? 'Збереження...' : 'Зберегти'}
              </button>
            </div>
          </Form>
        )
      }}
    </Formik>
  )
}

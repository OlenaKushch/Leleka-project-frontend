'use client'

import React, { useEffect, useId, useMemo } from 'react'
import { Field, Form, Formik, ErrorMessage, FormikHelpers } from 'formik'
import * as Yup from 'yup'
import toast from 'react-hot-toast'
import axios from 'axios'
import { apiClient } from '@/lib/apiClient'
import { Emotion, DiaryEntry } from '@/interfaces/diary'
import { DiaryService } from '@/services/diary.service'
import { EmotionPicker } from './EmotionPicker'
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
  const [availableEmotions, setAvailableEmotions] = React.useState<Emotion[]>([])

  useEffect(() => {
    const fetchEmotions = async () => {
      try {
        const emotions = await DiaryService.getEmotions()
        setAvailableEmotions(emotions)
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          console.error('Помилка:', error.response?.status)
        }
        toast.error('Не вдалося завантажити список емоцій')
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

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
      enableReinitialize={true}
    >
      {({ isSubmitting, values, setFieldValue }) => (
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

          <div className={`${styles.fieldGroup} ${styles.fieldGroupCategories}`}>
            <label className={styles.label}>Категорії</label>
            <EmotionPicker
              emotions={availableEmotions}
              selectedIds={values.emotions}
              onChange={ids => setFieldValue('emotions', ids)}
            />
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
      )}
    </Formik>
  )
}

'use client'

import { useEffect, useRef } from 'react'
import styles from './ProfileEditForm.module.css'
import { Formik, Form, Field, FormikHelpers, useFormikContext, FieldProps } from 'formik'
import * as Yup from 'yup'
import toast from 'react-hot-toast'
import { useAuthStore } from '@/store/auth.store'
import { useThemeStore } from '@/store/theme.store'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateProfile, sendVerificationEmail } from '@/services/users.service'
import type { User } from '@/types/user'
import { invalidatePregnancyQueries } from '@/lib/authSession'

/* -------------------- validation -------------------- */

const validationSchema = Yup.object({
  name: Yup.string().required('Обовʼязкове поле'),
  email: Yup.string().email('Некоректний email').required('Обовʼязкове поле'),
  dueDate: Yup.date().required('Вкажіть дату'),
})

interface FormValues {
  name: string
  email: string
  theme: 'boy' | 'girl' | 'neutral'
  dueDate: string
}

/* -------------------- helpers -------------------- */

const ThemeWatcher = () => {
  const { values } = useFormikContext<FormValues>()
  const { setTheme } = useThemeStore()

  useEffect(() => {
    if (values.theme) {
      setTheme(values.theme)
    }
  }, [values.theme, setTheme])

  return null
}

/* 👉 кастомний DateField */
const DateField = ({ field, form }: FieldProps) => {
  const ref = useRef<HTMLInputElement>(null)

  return (
    <input
      {...field}
      ref={ref}
      type="date"
      className={styles.input}
      min={form.values.dueDate ? undefined : undefined}
      onClick={() => ref.current?.showPicker?.()}
    />
  )
}

/* -------------------- component -------------------- */

export const ProfileEditForm = () => {
  const { user, setUser } = useAuthStore()
  const { theme: localTheme, setTheme } = useThemeStore()
  const queryClient = useQueryClient()

  const initialEmail = user?.email
  const today = new Date().toISOString().split('T')[0]

  const maxDate = new Date()
  maxDate.setDate(maxDate.getDate() + 280)
  const maxDateStr = maxDate.toISOString().split('T')[0]

  const { mutate, isPending } = useMutation<Partial<User>, Error, Partial<User>>({
    mutationFn: updateProfile,
    onSuccess: updatedVars => {
      if (user) {
        setUser({ ...user, ...updatedVars })
      }
    },
    onError: error => toast.error(error.message),
  })

  const handleSubmit = (values: FormValues, { setSubmitting }: FormikHelpers<FormValues>) => {
    const payload: Partial<User> = {}

    if (values.name !== user?.name) payload.name = values.name
    if (values.theme !== user?.theme) payload.theme = values.theme

    const formattedDate = values.dueDate ? new Date(values.dueDate).toISOString() : undefined
    const currentStoredDate = user?.dueDate
      ? new Date(user.dueDate).toISOString().split('T')[0]
      : ''

    if (values.dueDate !== currentStoredDate) {
      payload.dueDate = formattedDate
    }

    if (values.email !== initialEmail) {
      payload.email = values.email
    }

    if (Object.keys(payload).length === 0) {
      toast.error('Змін не виявлено')
      setSubmitting(false)
      return
    }

    mutate(payload, {
      onSuccess: async () => {
        await invalidatePregnancyQueries(queryClient)

        if (payload.email) {
          sendVerificationEmail(payload.email).catch((err: Error) => toast.error(err.message))
          toast.success('Лист для верифікації надіслано на нову пошту')
        } else {
          toast.success('Профіль оновлено')
        }
      },
      onSettled: () => setSubmitting(false),
    })
  }

  return (
    <Formik
      enableReinitialize
      initialValues={{
        name: user?.name || '',
        email: user?.email || '',
        theme: (user?.theme as 'boy' | 'girl' | 'neutral') || localTheme || 'neutral',
        dueDate: user?.dueDate ? new Date(user.dueDate).toISOString().split('T')[0] : '',
      }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ resetForm, dirty, errors, touched }) => (
        <Form className={styles.form}>
          <ThemeWatcher />

          <div className={styles.fields}>
            <div className={styles.field}>
              <label className={styles.label}>Імʼя</label>
              <Field name="name" className={styles.input} placeholder="Ваше ім'я" />
              {touched.name && errors.name && <span className={styles.error}>{errors.name}</span>}
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Пошта</label>
              <Field name="email" className={styles.input} placeholder="example@mail.com" />
              {touched.email && errors.email && (
                <span className={styles.error}>{errors.email}</span>
              )}
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Стать дитини</label>
              <Field as="select" name="theme" className={styles.select}>
                <option value="girl">Дівчинка</option>
                <option value="boy">Хлопчик</option>
                <option value="neutral">Ще не знаю</option>
              </Field>
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Планова дата пологів</label>
              <Field name="dueDate" component={DateField} min={today} max={maxDateStr} />
              {touched.dueDate && errors.dueDate && (
                <span className={styles.error}>{errors.dueDate}</span>
              )}
            </div>
          </div>

          <div className={styles.actions}>
            <button
              type="button"
              className={styles.cancel}
              onClick={() => {
                resetForm()
                if (user?.theme) setTheme(user.theme as 'boy' | 'girl' | 'neutral')
              }}
              disabled={!dirty || isPending}
            >
              Відмінити зміни
            </button>
            <button type="submit" className={styles.submit} disabled={isPending || !dirty}>
              {isPending ? 'Збереження...' : 'Зберегти зміни'}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  )
}

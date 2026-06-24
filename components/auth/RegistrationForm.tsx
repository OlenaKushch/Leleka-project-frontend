'use client'

import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { useRouter } from 'next/navigation'
import { useQueryClient } from '@tanstack/react-query'
import { register } from '@/services/auth.service'
import { applyAuthSession } from '@/lib/authSession'
import { useAuthStore } from '@/store/auth.store'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { AuthScreenLayout } from '@/components/auth/AuthScreenLayout'
import styles from '@/components/auth/AuthScreenLayout.module.css'
import { GoogleButton } from './GoogleButton'

const initialValues = {
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
}

const validationSchema = Yup.object({
  name: Yup.string().max(32, 'Максимум 32 символи').required('Обовʼязкове поле'),
  email: Yup.string()
    .email('Некоректний email')
    .max(64, 'Максимум 64 символи')
    .required('Обовʼязкове поле'),
  password: Yup.string()
    .min(8, 'Мінімум 8 символів')
    .max(128, 'Максимум 128 символів')
    .required('Обовʼязкове поле'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Паролі не збігаються')
    .required('Обовʼязкове поле'),
})

export const RegistrationForm = () => {
  const router = useRouter()
  const queryClient = useQueryClient()
  const setUser = useAuthStore(state => state.setUser)

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      validateOnMount={true}
      validateOnChange={true}
      onSubmit={async (values, { resetForm, setSubmitting }) => {
        const { name, email, password } = values

        try {
          const user = await register({ name, email, password })
          await applyAuthSession(queryClient, user)
          setUser(user)
          resetForm()
          router.replace('/profile/edit')
        } catch (error: unknown) {
          resetForm({ values: { ...values, password: '', confirmPassword: '' } })
          if (error instanceof Error) {
            toast.error(error.message)
          } else {
            toast.error('Сталася невідома помилка')
          }
        } finally {
          setSubmitting(false)
        }
      }}
    >
      {({ isSubmitting, isValid }) => (
        <AuthScreenLayout>
          <div className={styles.auth_container}>
            <Form>
              <h1 className={styles.auth_title}>Реєстрація</h1>
              <div className={styles.auth_wrap_input}>
                <div className={styles.auth_field}>
                  <label htmlFor="name" className={styles.auth_label}>
                    Імʼя<span className={styles.auth_required}>*</span>
                  </label>
                  <Field
                    className={styles.auth_input}
                    name="name"
                    maxLength={32}
                    type="text"
                    placeholder="Ваше імʼя"
                    autoComplete="name"
                  />
                  <ErrorMessage name="name">
                    {msg => <div className={styles.ui_error}>{msg}</div>}
                  </ErrorMessage>
                </div>

                <div className={styles.auth_field}>
                  <label htmlFor="email" className={styles.auth_label}>
                    Пошта<span className={styles.auth_required}>*</span>
                  </label>
                  <Field
                    className={styles.auth_input}
                    name="email"
                    maxLength={64}
                    type="email"
                    placeholder="Пошта"
                    autoComplete="email"
                  />
                  <ErrorMessage name="email">
                    {msg => <div className={styles.ui_error}>{msg}</div>}
                  </ErrorMessage>
                </div>

                <div className={styles.auth_field}>
                  <label htmlFor="password" className={styles.auth_label}>
                    Пароль<span className={styles.auth_required}>*</span>
                  </label>
                  <Field
                    className={styles.auth_input}
                    id="password"
                    name="password"
                    maxLength={128}
                    type="password"
                    placeholder="Пароль"
                    autoComplete="new-password"
                  />
                  <ErrorMessage name="password">
                    {msg => <div className={styles.ui_error}>{msg}</div>}
                  </ErrorMessage>
                </div>

                <div className={styles.auth_field}>
                  <label htmlFor="confirmPassword" className={styles.auth_label}>
                    Підтвердження пароля<span className={styles.auth_required}>*</span>
                  </label>
                  <Field
                    className={styles.auth_input}
                    id="confirmPassword"
                    name="confirmPassword"
                    maxLength={128}
                    type="password"
                    placeholder="Повторіть пароль"
                    autoComplete="new-password"
                  />
                  <ErrorMessage name="confirmPassword">
                    {msg => <div className={styles.ui_error}>{msg}</div>}
                  </ErrorMessage>
                </div>

                <button
                  className={styles.auth_button}
                  type="submit"
                  disabled={isSubmitting || !isValid}
                >
                  Зареєструватися
                </button>
                <div className={styles.google_button_wrap}>
                  <GoogleButton mode="register" />
                </div>
              </div>

              <div className={styles.auth_text}>
                Ви вже маєте акаунт?
                <Link className={styles.auth_text_link} href="/auth/login">
                  Увійти
                </Link>
              </div>
            </Form>
          </div>
        </AuthScreenLayout>
      )}
    </Formik>
  )
}

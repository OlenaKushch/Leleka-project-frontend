'use client'

import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { useRouter } from 'next/navigation'
import { useQueryClient } from '@tanstack/react-query'
import { login } from '@/services/auth.service'
import { applyAuthSession } from '@/lib/authSession'
import { useAuthStore } from '@/store/auth.store'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { AuthScreenLayout } from '@/components/auth/AuthScreenLayout'
import styles from '@/components/auth/AuthScreenLayout.module.css'
import { GoogleButton } from './GoogleButton'

const validationSchema = Yup.object({
  email: Yup.string()
    .email('Некоректний email')
    .max(64, 'Максимум 64 символи')
    .required('Обовʼязкове поле'),
  password: Yup.string()
    .min(8, 'Мінімум 8 символів')
    .max(128, 'Максимум 128 символів')
    .required('Обовʼязкове поле'),
})

export const LoginForm = () => {
  const router = useRouter()
  const queryClient = useQueryClient()
  const setUser = useAuthStore(state => state.setUser)

  return (
    <Formik
      initialValues={{ email: '', password: '' }}
      validationSchema={validationSchema}
      validateOnMount={true}
      validateOnChange={true}
      onSubmit={async values => {
        try {
          const user = await login(values)
          await applyAuthSession(queryClient, user)
          setUser(user)
          router.replace(user.hasCompletedOnboarding ? '/' : '/profile/edit')
        } catch (error: unknown) {
          if (error instanceof Error) {
            toast.error(error.message)
          } else {
            toast.error('Сталася невідома помилка')
          }
        }
      }}
    >
      {({ isSubmitting, isValid }) => (
        <AuthScreenLayout>
          <div className={styles.auth_container}>
            <Form>
              <h1 className={styles.auth_title}>Вхід</h1>
              <div className={styles.auth_wrap_input}>
                <Field
                  className={styles.auth_input}
                  name="email"
                  maxLength={64}
                  type="email"
                  placeholder="Пошта"
                />
                <ErrorMessage name="email">
                  {msg => <div className={styles.ui_error}>{msg}</div>}
                </ErrorMessage>
                <Field
                  className={styles.auth_input}
                  name="password"
                  maxLength={128}
                  type="password"
                  placeholder="Пароль"
                />
                <ErrorMessage name="password">
                  {msg => <div className={styles.ui_error}>{msg}</div>}
                </ErrorMessage>
                <button
                  className={styles.auth_button}
                  type="submit"
                  disabled={isSubmitting || !isValid}
                >
                  Увійти
                </button>
                <div className={styles.google_button_wrap}>
                  <GoogleButton mode="login" />
                </div>
              </div>

              <div className={styles.auth_text}>
                Немає акаунту?
                <Link className={styles.auth_text_link} href="/auth/register">
                  Зареєструватися
                </Link>
              </div>
            </Form>
          </div>
        </AuthScreenLayout>
      )}
    </Formik>
  )
}

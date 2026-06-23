'use client'

import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { useQueryClient } from '@tanstack/react-query'
import { register } from '@/services/auth.service'
import { applyAuthSession } from '@/lib/authSession'
import { useAuthStore } from '@/store/auth.store'
import Link from 'next/link'
import toast from 'react-hot-toast'
import css from '@/components/auth/RegistrationForm.module.css'
import AppLogo from '@/components/auth/AppLogo'
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
  const isAuthenticated = useAuthStore(state => state.isAuthenticated)
  const hydrated = useAuthStore(state => state.hydrated)

  useEffect(() => {
    if (hydrated && isAuthenticated) {
      router.replace('/')
    }
  }, [hydrated, isAuthenticated, router])

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
          router.replace(user.hasCompletedOnboarding ? '/' : '/profile/edit')
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
        <div className={css.auth_wrapper}>
          <div className={css.auth_form}>
            <Form>
              <div className={css.auth_logo}>
                  <AppLogo className={css.auth_logo_img} />
              </div>
              <div className={css.auth_container}>
                <h1 className={css.auth_title}>Реєстрація</h1>
                <div className={css.auth_wrap_input}>
                  <div className={css.auth_field}>
                    <label htmlFor="name" className={css.auth_label}>
                      Імʼя<span className={css.auth_required}>*</span>{' '}
                    </label>
                    <Field
                      className={css.auth_input}
                      name="name"
                      maxLength={32}
                      type="text"
                      placeholder="Ваше імʼя"
                      autoComplete="name"
                    ></Field>
                    <ErrorMessage name="name">
                      {msg => <div className={css.ui_error}>{msg}</div>}
                    </ErrorMessage>
                  </div>

                  <div className={css.auth_field}>
                    <label htmlFor="email" className={css.auth_label}>
                      Пошта<span className={css.auth_required}>*</span>{' '}
                    </label>
                    <Field
                      className={css.auth_input}
                      name="email"
                      maxLength={64}
                      type="email"
                      placeholder="Пошта"
                      autoComplete="email"
                    ></Field>
                    <ErrorMessage name="email">
                      {msg => <div className={css.ui_error}>{msg}</div>}
                    </ErrorMessage>
                  </div>

                  <div className={css.auth_field}>
                    <label htmlFor="password" className={css.auth_label}>
                      Пароль<span className={css.auth_required}>*</span>{' '}
                    </label>
                    <Field
                      className={css.auth_input}
                      id="password"
                      name="password"
                      maxLength={128}
                      type="password"
                      placeholder="Пароль"
                      autoComplete="new-password"
                    ></Field>
                    <ErrorMessage name="password">
                      {msg => <div className={css.ui_error}>{msg}</div>}
                    </ErrorMessage>
                  </div>

                  <div className={css.auth_field}>
                    <label htmlFor="confirmPassword" className={css.auth_label}>
                      Підтвердження пароля<span className={css.auth_required}>*</span>{' '}
                    </label>
                    <Field
                      className={css.auth_input}
                      id="confirmPassword"
                      name="confirmPassword"
                      maxLength={128}
                      type="password"
                      placeholder="Повторіть пароль"
                      autoComplete="new-password"
                    ></Field>
                    <ErrorMessage name="confirmPassword">
                      {msg => <div className={css.ui_error}>{msg}</div>}
                    </ErrorMessage>
                  </div>

                  <button
                    className={css.auth_button}
                    type="submit"
                    disabled={isSubmitting || !isValid}
                  >
                    Зареєструватися
                  </button>
                  <div className={css.google_button_wrap}>
                    <GoogleButton mode='register'/>
                    </div>
                </div>

                <div className={css.auth_text}>
                  Ви вже маєте акаунт?
                  <Link className={css.auth_text_link} href="/auth/login">
                    Увійти
                  </Link>
                </div>
              </div>
            </Form>
          </div>
          <div className={css.auth_image}>
            <Image
              src="/images/twoStorksInTheNest/two_storks_in_the_nest.jpg"
              alt="Білі лелеки в гнізді"
              fill
              priority
              sizes="50vw"
              style={{ objectFit: 'contain', objectPosition: 'center' }}
            />
          </div>
        </div>
      )}
    </Formik>
  )
}

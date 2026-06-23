'use client'

import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { useQueryClient } from '@tanstack/react-query'
import { login } from '@/services/auth.service'
import { applyAuthSession } from '@/lib/authSession'
import { useAuthStore } from '@/store/auth.store'
import Link from 'next/link'
import toast from 'react-hot-toast'
import css from '@/components/auth/LoginForm.module.css'
import AppLogo from '@/components/auth/AppLogo'
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
        <div className={css.auth_wrapper}>
          <div className={css.auth_form}>
            <Form>
              <div className={css.auth_logo}> 
                  <AppLogo className={css.auth_logo_img} /> 
              </div>

              <div className={css.auth_container}>
                <h1 className={css.auth_title}>Вхід</h1>
                <div className={css.auth_wrap_input}>
                  <Field
                    className={css.auth_input}
                    name="email"
                    maxLength={64}
                    type="email"
                    placeholder="Пошта"
                  ></Field>
                  <ErrorMessage name="email">
                    {msg => <div className={css.ui_error}>{msg}</div>}
                  </ErrorMessage>
                  <Field
                    className={css.auth_input}
                    name="password"
                    maxLength={128}
                    type="password"
                    placeholder="Пароль"
                  ></Field>
                  <ErrorMessage name="password">
                    {msg => <div className={css.ui_error}>{msg}</div>}
                  </ErrorMessage>
                  <button
                    className={css.auth_button}
                    type="submit"
                    disabled={isSubmitting || !isValid}
                  >
                    Увійти
                  </button>
                  <div className={css.google_button_wrap}>
                    <GoogleButton mode='login' />
                  </div>
                </div>

                <div className={css.auth_text}>
                  Нeмає акаунту?
                  <Link className={css.auth_text_link} href="/auth/register">
                    Зареєструватися
                  </Link>
                </div>
              </div>
            </Form>
          </div>
          <div className={css.auth_image}>
            <Image
              src="/images/eggsInTheNest/eggs_in_the_nest.jpg"
              alt="Яйця лелек у гнізді"
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

'use client'

import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

import { updateProfile, updateUserAvatar } from '@/services/users.service'
import { useAuthStore } from '@/store/auth.store'
import { useThemeStore } from '@/store/theme.store'
import type { User } from '@/types/user'

import OnboardingAvatar from '@/components/OnboardingAvatar/OnboardingAvatar'
import OnboardingCustomDate from '@/components/OnboardingCustomDate/OnboardingCustomDate'
import OnboardingCustomSelect from '@/components/OnboardingCustomSelect/OnboardingCustomSelect'
import styles from './OnboardingForm.module.css'
import { invalidatePregnancyQueries } from '@/lib/authSession'

export interface OnboardingValues {
  name: string
  theme: 'boy' | 'girl' | 'neutral'
  dueDate: string
  avatar: File | null
}

const schema = Yup.object({
  name: Yup.string()
    .min(2, 'Ім’я має бути не менше 2 символів')
    .required('Обов’язкове поле'),
  theme: Yup.string()
    .oneOf(['boy', 'girl', 'neutral'])
    .required('Обов’язкове поле'),
  dueDate: Yup.string().required('Обов’язкове поле'),
})

export default function OnboardingForm() {
  const router = useRouter()
  const { user, setUser } = useAuthStore()
  const setTheme = useThemeStore(state => state.setTheme)
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: async (values: OnboardingValues) => {
      let newAvatarUrl = user?.avatar

      if (values.avatar) {
        try {
          const avatarRes = await updateUserAvatar(values.avatar)
          if (avatarRes.avatar) {
            newAvatarUrl = avatarRes.avatar
          }
        } catch {
          toast.error('Не вдалося завантажити фото, спробуйте пізніше')
        }
      }

      await updateProfile({
        name: values.name,
        theme: values.theme,
        dueDate: values.dueDate,
      })

      const updatedData: Partial<User> = {
        name: values.name,
        theme: values.theme,
        dueDate: values.dueDate,
        avatar: newAvatarUrl,
        hasCompletedOnboarding: true,
      }

      return updatedData
    },
    onSuccess: async updatedData => {
      if (user) {
        setUser({ ...user, ...updatedData })
      } else {
        setUser(updatedData as User)
      }

      await invalidatePregnancyQueries(queryClient)

      setTheme(updatedData.theme ?? 'neutral')
      toast.success('Онбординг завершено')
      router.push('/diary')
    },
    onError: () => {
      toast.error('Помилка збереження')
    },
  })

  if (!user) return null

  return (
    <Formik<OnboardingValues>
      initialValues={{
        name: user.name ?? '',
        theme: (user.theme as 'boy' | 'girl' | 'neutral') || 'neutral',
        dueDate: user.dueDate || '',
        avatar: null,
      }}
      validationSchema={schema}
      validateOnBlur={false}
      validateOnChange={false}
      onSubmit={(values, { setTouched }) => {
        setTouched(
          {
            name: true,
            theme: true,
            dueDate: true,
            avatar: false,
          },
          true
        )

        mutation.mutate(values)
      }}
    >
      {({ isSubmitting }) => (
        <Form className={styles.form}>
          <OnboardingAvatar />

          <div className={styles.fields}>
            <OnboardingCustomSelect />
            <OnboardingCustomDate />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={styles.submit}
          >
            Зберегти
          </button>
        </Form>
      )}
    </Formik>
  )
}
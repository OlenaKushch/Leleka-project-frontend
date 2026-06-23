'use client'

import { Suspense } from 'react'
import { LoginForm } from '@/components/auth/LoginForm'
import { RegistrationForm } from '@/components/auth/RegistrationForm'
import { AuthErrorHandler } from '@/components/auth/AuthErrorHandler'

type Props = {
  authType: 'login' | 'register'
}

export const AuthPage = ({ authType }: Props) => {
  return (
    <div>
      <Suspense fallback={null}>
        <AuthErrorHandler />
      </Suspense>
      {authType === 'login' && <LoginForm />}
      {authType === 'register' && <RegistrationForm key="register-form" />}
    </div>
  )
}

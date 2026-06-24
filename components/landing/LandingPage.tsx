'use client'

import Link from 'next/link'
import { AuthScreenLayout } from '@/components/auth/AuthScreenLayout'
import { GoogleButton } from '@/components/auth/GoogleButton'
import styles from '@/components/auth/AuthScreenLayout.module.css'

export function LandingPage() {
  return (
    <AuthScreenLayout>
      <div className={styles.auth_container}>
        <h1 className={styles.auth_title}>Лелека</h1>
        <p className={styles.auth_description}>
          Ваш супутник у вагітності. Відстежуйте тижні розвитку малюка, ведіть
          щоденник емоцій, плануйте завдання та отримуйте щоденні поради для
          комфортної подорожі до зустрічі з дитиною.
        </p>

        <div className={styles.auth_wrap_input}>
          <Link href="/auth/login" className={styles.auth_button}>
            Увійти
          </Link>
          <Link href="/auth/register" className={styles.auth_buttonSecondary}>
            Зареєструватися
          </Link>
          <div className={styles.google_button_wrap}>
            <GoogleButton mode="login" />
          </div>
        </div>
      </div>
    </AuthScreenLayout>
  )
}

'use client'

import styles from './GreetingBlock.module.css'
import { useAuthStore } from '@/store/auth.store'

export const GreetingBlock = () => {
  const user = useAuthStore(state => state.user)

  return (
    <section className={styles.block}>
      <h2 className={styles.title}>
        Вітаю
        {user?.name ? (
          <>
            , <span className={styles.name}>{user.name}</span>
          </>
        ) : null}
        !
      </h2>
    </section>
  )
}

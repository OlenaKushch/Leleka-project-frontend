'use client'

import { useEffect } from 'react'
import { useUiStore } from '@/store/ui.store'
import { useAuthStore } from '@/store/auth.store'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import styles from './BurgerMenu.module.scss'
import { UserBar } from '@/components/layout/UserBar/UserBar'
import { AuthBar } from '@/components/layout/AuthBar/AuthBar'
import AppLogo from '@/components/auth/AppLogo'
import { NAV_ITEMS } from '@/components/layout/navigation'
import { isValidUser } from '@/lib/authValidation'

export const BurgerMenu = () => {
  const { isBurgerMenuOpen, closeBurgerMenu } = useUiStore()
  const { user } = useAuthStore()
  const pathname = usePathname()

  useEffect(() => {
    if (!isBurgerMenuOpen) return

    document.body.style.overflow = 'hidden'
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeBurgerMenu()
    }
    document.addEventListener('keydown', onEsc)

    return () => {
      document.body.style.overflow = ''
      document.removeEventListener('keydown', onEsc)
    }
  }, [isBurgerMenuOpen, closeBurgerMenu])

  if (!isBurgerMenuOpen) return null

  return (
    <>
      <div className={styles.overlay} onClick={closeBurgerMenu} aria-hidden="true" />
      <aside className={styles.panel} role="dialog" aria-modal="true" aria-label="Меню">
        <div className={styles.container}>
          <div className={styles.header}>
            <Link href="/" className={styles.logo} onClick={closeBurgerMenu}>
              <AppLogo className={styles.logoImg} />
            </Link>
            <button
              type="button"
              className={styles.closeButton}
              onClick={closeBurgerMenu}
              aria-label="Закрити меню"
            >
              ×
            </button>
          </div>

          <nav className={styles.nav}>
            {NAV_ITEMS.map(item => (
              <Link
                key={item.href}
                href={isValidUser(user) ? item.href : '/auth/login'}
                className={`${styles.link} ${pathname === item.href ? styles.active : ''}`}
                onClick={closeBurgerMenu}
              >
                <Image src={item.icon} alt={item.label} width={24} height={24} />
                {item.label}
              </Link>
            ))}
          </nav>

          <div className={styles.footer}>{isValidUser(user) ? <UserBar /> : <AuthBar />}</div>
        </div>
      </aside>
    </>
  )
}

'use client'

import { ReactNode } from 'react'
import { Sidebar } from './Sidebar/Sidebar'
import { Header } from './Header/Header'
import { Breadcrumbs } from './Breadcrumbs/Breadcrumbs'
import { BurgerMenu } from './BurgerMenu/BurgerMenu'
import styles from './Layout.module.scss'
import { usePathname } from 'next/navigation'
import { useAuthStore } from '@/store/auth.store'

export function Layout({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const hydrated = useAuthStore(state => state.hydrated)
  const isAuthenticated = useAuthStore(state => state.isAuthenticated)
  const isAuthPage = pathname?.startsWith('/auth')
  const isGuestLanding = pathname === '/' && hydrated && !isAuthenticated
  const isFullscreenPage = isAuthPage || isGuestLanding
  const shouldShowSidebar = !isFullscreenPage

  return (
    <div className={styles.layout}>
      <div className={styles.container}>
        {shouldShowSidebar && <Sidebar />}
        {shouldShowSidebar && <BurgerMenu />}

        <div className={isFullscreenPage ? styles.authContent : styles.content}>
          {shouldShowSidebar && <Header />}
          {shouldShowSidebar && <Breadcrumbs />}
          <main className={styles.main}>{children}</main>
        </div>
      </div>
    </div>
  )
}

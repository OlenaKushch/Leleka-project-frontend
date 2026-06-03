'use client'

import { ReactNode } from 'react'
import { Sidebar } from './Sidebar/Sidebar'
import { Header } from './Header/Header'
import { Breadcrumbs } from './Breadcrumbs/Breadcrumbs'
import { BurgerMenu } from './BurgerMenu/BurgerMenu'
import styles from './Layout.module.scss'
import { usePathname } from 'next/navigation'

export function Layout({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const isAuthPage = pathname?.startsWith('/auth')
  const shouldShowSidebar = !isAuthPage

  return (
    <div className={styles.layout}>
      <div className={styles.container}>
        {shouldShowSidebar && <Sidebar />}
        {shouldShowSidebar && <BurgerMenu />}

        <div className={!shouldShowSidebar ? styles.authContent : styles.content}>
          <Header />
          <Breadcrumbs />
          <main className={styles.main}>{children}</main>
        </div>
      </div>
    </div>
  )
}

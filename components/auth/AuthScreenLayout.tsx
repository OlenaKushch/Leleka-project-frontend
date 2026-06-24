'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ReactNode } from 'react'
import AppLogo from './AppLogo'
import styles from './AuthScreenLayout.module.css'

const DEFAULT_IMAGE = '/images/eggsInTheNest/eggs_in_the_nest.jpg'

type AuthScreenLayoutProps = {
  children: ReactNode
  imageSrc?: string
  imageAlt?: string
}

export function AuthScreenLayout({
  children,
  imageSrc = DEFAULT_IMAGE,
  imageAlt = 'Яйця лелек у гнізді',
}: AuthScreenLayoutProps) {
  return (
    <div className={styles.auth_wrapper}>
      <div className={styles.auth_form}>
        <Link href="/" className={styles.auth_logo} aria-label="На головну">
          <AppLogo className={styles.auth_logo_img} />
        </Link>
        {children}
      </div>
      <div className={styles.auth_image}>
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          priority
          sizes="50vw"
          style={{ objectFit: 'contain', objectPosition: 'center' }}
        />
      </div>
    </div>
  )
}

export { styles as authScreenStyles }

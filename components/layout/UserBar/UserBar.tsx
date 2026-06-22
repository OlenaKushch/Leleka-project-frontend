'use client'

import Image from 'next/image'
import { useAuthStore } from '@/store/auth.store'
import { AuthService } from '@/services/auth.service'
import { useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ConfirmationModal } from '@/components/confirmation-modal/confirmation-modal.component'
import { formatUserEmail, isValidUser } from '@/lib/authValidation'
import styles from './UserBar.module.scss'

export const UserBar = () => {
  const { user, clearAuth } = useAuthStore()
  const [isLoading, setIsLoading] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const queryClient = useQueryClient()
  const router = useRouter()

  const getAvatarSrc = () => {
    const avatar = user?.avatar

    if (!avatar || avatar === 'avatar') {
      return '/images/unknownAvatarImage/unknown_avatar_Image.jpg'
    }

    if (avatar.length > 100 && !avatar.startsWith('data:image') && !avatar.startsWith('http')) {
      return `data:image/jpeg;base64,${avatar}`
    }

    return avatar
  }

  const handleConfirmLogout = async () => {
    setIsLoading(true)
    try {
      await AuthService.logout()
    } finally {
      clearAuth()
      queryClient.clear()
      setIsModalOpen(false)
      setIsLoading(false)
      router.replace('/')
    }
  }

  if (!user || !isValidUser(user)) return null

  const email = formatUserEmail(user.email)

  return (
    <>
      <div className={styles.userBar}>
        <div className={styles.userBar__info}>
          <Image
            src={getAvatarSrc()}
            alt=""
            width={40}
            height={40}
            className={styles.userBar__avatar}
          />
          <div className={styles.userBar__details}>
            <span className={styles.userBar__name}>{user.name}</span>
            <span className={styles.userBar__email}>{email}</span>
          </div>
        </div>
        <button
          type="button"
          className={`${styles.userBar__logout} ${isLoading ? styles.userBar__logoutLoading : ''}`}
          onClick={() => setIsModalOpen(true)}
          disabled={isLoading}
          aria-label="Вийти"
        >
          {isLoading ? (
            <span className={styles.userBar__loader} aria-hidden="true" />
          ) : (
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M12.5538 29.1497C12.0938 29.1497 11.695 28.9808 11.3573 28.643C11.0195 28.3053 10.8506 27.9065 10.8506 27.4465V12.554C10.8506 12.0923 11.0195 11.6921 11.3573 11.3532C11.695 11.0142 12.0938 10.8447 12.5538 10.8447H19.1593C19.3997 10.8447 19.6017 10.9281 19.7653 11.095C19.929 11.262 20.0108 11.4661 20.0108 11.7072C20.0108 11.9486 19.929 12.1501 19.7653 12.3117C19.6017 12.4732 19.3997 12.554 19.1593 12.554H12.5538V27.4465H19.1593C19.3997 27.4465 19.6017 27.5287 19.7653 27.6932C19.929 27.8577 20.0108 28.0608 20.0108 28.3025C20.0108 28.5441 19.929 28.7457 19.7653 28.9072C19.6017 29.0689 19.3997 29.1497 19.1593 29.1497H12.5538ZM25.8918 20.852H17.8158C17.5755 20.852 17.3735 20.7696 17.2098 20.605C17.0462 20.4405 16.9643 20.2374 16.9643 19.9957C16.9643 19.7542 17.0462 19.5526 17.2098 19.391C17.3735 19.2293 17.5755 19.1485 17.8158 19.1485H25.8418L23.9186 17.2252C23.7486 17.0544 23.6678 16.8543 23.6761 16.625C23.6844 16.3955 23.7736 16.1967 23.9436 16.0287C24.1134 15.8569 24.3158 15.772 24.5508 15.774C24.7857 15.776 24.9894 15.8619 25.1621 16.0317L28.5588 19.4285C28.7247 19.5998 28.8076 19.7991 28.8076 20.0262C28.8076 20.2534 28.7247 20.452 28.5588 20.622L25.1871 23.9937C25.0204 24.1636 24.8223 24.2453 24.5928 24.239C24.3632 24.2326 24.1602 24.1446 23.9838 23.9747C23.8203 23.8047 23.7375 23.6019 23.7353 23.3662C23.7332 23.1304 23.8193 22.9271 23.9936 22.7562L25.8918 20.852Z"
              fill="black"
            />
          </svg>
          )}
        </button>
      </div>

      <ConfirmationModal
        isOpen={isModalOpen}
        title="Ви впевнені, що хочете вийти?"
        confirmText="Вийти"
        cancelText="Скасувати"
        onConfirm={handleConfirmLogout}
        onCancel={() => setIsModalOpen(false)}
        variant="danger"
        isLoading={isLoading}
      />
    </>
  )
}

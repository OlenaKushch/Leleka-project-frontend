'use client'

import React, { useEffect } from 'react'
import { CloseOutlined } from '@ant-design/icons'
import styles from './confirmation-modal.module.css'

interface ConfirmationModalProps {
  isOpen: boolean
  title: string
  description?: string
  confirmText?: string
  cancelText?: string
  onConfirm: () => void
  onCancel: () => void
  variant?: 'danger' | 'primary'
  isLoading?: boolean
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  title,
  description,
  confirmText = 'Так',
  cancelText = 'Ні',
  onConfirm,
  onCancel,
  variant = 'primary',
  isLoading = false,
}) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onCancel()
    }
    if (isOpen) document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onCancel])

  if (!isOpen) return null

  return (
    <div className={styles.backdrop} onClick={onCancel}>
      <div className={styles.content} onClick={e => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onCancel}>
          <CloseOutlined />
        </button>

        <h2 className={styles.title}>{title}</h2>
        {description && <p className={styles.description}>{description}</p>}

        <div className={styles.actions}>
          <button className={`${styles.btn} ${styles.cancel}`} onClick={onCancel} disabled={isLoading}>
            {cancelText}
          </button>
          <button
            className={`${styles.btn} ${styles.confirm} ${styles[variant]}`}
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? 'Завантаження...' : confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}

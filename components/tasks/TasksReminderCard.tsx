'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuthStore } from '@/store/auth.store'
import { isAuthSessionReady } from '@/lib/authValidation'
import { hasAccessToken } from '@/lib/accessToken'
import type { Task } from '@/types/task'
import AddTaskModal from '../add-task-modal/AddTaskModal'
import { ConfirmationModal } from '@/components/confirmation-modal/confirmation-modal.component'
import styles from './TasksReminderCard.module.css'
import { getTasks, updateTasksStatus, deleteTask } from '@/services/tasks.service'
import toast from 'react-hot-toast'

const TasksList = () => {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null)
  const { user, isAuthenticated, hydrated } = useAuthStore()
  const canManageTasks = isAuthSessionReady(user, isAuthenticated)

  useEffect(() => {
    document.body.style.overflow = isModalOpen || taskToDelete ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [isModalOpen, taskToDelete])

  const { data: tasks = [], isLoading } = useQuery<Task[]>({
    queryKey: ['tasks'],
    queryFn: getTasks,
    enabled: hydrated && canManageTasks,
  })

  const { mutate: toggleTask } = useMutation({
    mutationFn: ({ id, isDone }: { id: string; isDone: boolean }) => updateTasksStatus(id, isDone),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    },
  })

  const { mutate: removeTask, isPending: isDeleting } = useMutation({
    mutationFn: (id: string) => deleteTask(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
      toast.success('Завдання видалено')
      setTaskToDelete(null)
    },
    onError: () => {
      toast.error('Не вдалося видалити завдання')
    },
  })

  if (!hydrated) {
    return (
      <section className={styles.card}>
        <div className={styles.header}>
          <h3 className={styles.title}>Важливі завдання</h3>
        </div>
        <p className={styles.emptyText}>Завантаження...</p>
      </section>
    )
  }

  const handleOpenModal = () => {
    if (!canManageTasks) {
      if (isAuthenticated && !hasAccessToken()) {
        toast.error('Сесію авторизації втрачено. Увійдіть знову.')
        router.push('/auth/login')
        return
      }

      router.push('/auth/register')
      return
    }

    setIsModalOpen(true)
  }

  return (
    <section className={styles.card}>
      <div className={styles.header}>
        <h3 className={styles.title}>Важливі завдання</h3>
        <button className={styles.plusBtn} onClick={handleOpenModal}>
          <svg className={styles.icon} width="21" height="21">
            <use href="/sprite.svg#icon-add_circle" />
          </svg>
        </button>
      </div>

      {!canManageTasks && (
        <>
          <p className={styles.emptyBold}>Наразі немає жодних завдань</p>
          <p className={styles.emptyText}>Увійдіть, щоб створювати завдання!</p>
          {/* <button className={styles.createBtn} onClick={() => router.push('/auth/register')}>
            Створити завдання
          </button> */}
        </>
      )}

      {canManageTasks && tasks.length === 0 && !isLoading && (
        <>
          <p className={styles.emptyBold}>Наразі немає жодних завдань</p>
          <p className={styles.emptyText}>Створіть мерщій нове завдання!</p>
          {/* <button className={styles.createBtn} onClick={handleOpenModal}>
            Створити завдання
          </button> */}
        </>
      )}

    {canManageTasks && tasks.length > 0 && (
  <ul className={styles.list}>
    {tasks.map(task => (
      <li key={task._id} className={styles.item}>
        
        <span className={styles.date}>
          {new Date(task.date).toLocaleDateString("uk-UA", {
            day: "2-digit",
            month: "2-digit",
          })}
        </span>

        
        <div className={styles.taskRow}>
    <input
      type="checkbox"
      checked={task.isDone}
      onChange={() =>
        toggleTask({ id: task._id, isDone: !task.isDone })
      }
      className={styles.checkbox}
    />
    <span className={`${styles.taskText} ${task.isDone ? styles.done : ""}`}>
      {task.name}
    </span>
    <button
      type="button"
      className={styles.deleteBtn}
      onClick={() => setTaskToDelete(task)}
      aria-label={`Видалити завдання: ${task.name}`}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2m2 0v12a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7h12ZM10 11v6M14 11v6"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  </div>
</li>
    ))}
  </ul>
)}


      <AddTaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onTaskSaved={() => queryClient.invalidateQueries({ queryKey: ['tasks'] })}
      />

      <ConfirmationModal
        isOpen={Boolean(taskToDelete)}
        title="Ви впевнені, що хочете видалити завдання?"
        description={taskToDelete?.name}
        confirmText="Так"
        cancelText="Не видаляти"
        variant="danger"
        isLoading={isDeleting}
        onConfirm={() => taskToDelete && removeTask(taskToDelete._id)}
        onCancel={() => {
          if (!isDeleting) setTaskToDelete(null)
        }}
      />
    </section>
  )
}

export default TasksList
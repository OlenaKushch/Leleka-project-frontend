'use client'

import { Formik, Form, Field, ErrorMessage, FormikHelpers } from 'formik'
import { useRef } from 'react'
import * as Yup from 'yup'
import toast from 'react-hot-toast'
import styles from './AddTaskForm.module.css'
import { createTask, updateTask } from '@/services/tasks.service'

interface AddTaskFormProps {
  onTaskSaved: () => void
  taskToEdit?: {
    id: string
    name: string
    date: string
  } | null
}

type TaskFormValues = {
  name: string
  date: string
}

const taskValidationSchema = Yup.object({
  name: Yup.string()
    .min(3, 'Назва завдання повинна містити мінімум 3 символи')
    .max(100, 'Назва завдання не може перевищувати 100 символів')
    .required("Обов'язкове поле"),
  date: Yup.date().required("Обов'язкове поле").typeError('Введіть коректну дату'),
})

const getCurrentDate = (): string => {
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const openDatePicker = (input: HTMLInputElement | null) => {
  if (!input) return

  if (typeof input.showPicker === 'function') {
    try {
      input.showPicker()
      return
    } catch {
      // Some browsers block showPicker without a direct user gesture.
    }
  }

  input.focus()
}

const AddTaskForm = ({ onTaskSaved, taskToEdit }: AddTaskFormProps) => {
  const dateInputRef = useRef<HTMLInputElement>(null)
  const minDate = getCurrentDate()

  const initialValues: TaskFormValues = {
    name: taskToEdit?.name || '',
    date: taskToEdit?.date?.slice(0, 10) || minDate,
  }

  const handleSubmit = async (
    values: TaskFormValues,
    { setSubmitting }: FormikHelpers<TaskFormValues>
  ) => {
    try {
      if (taskToEdit) {
        await updateTask(taskToEdit.id, values)
        toast.success('Завдання оновлено!')
      } else {
        await createTask(values)
        toast.success('Завдання створено!')
      }

      onTaskSaved()
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Помилка при збереженні завдання'
      toast.error(message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={taskValidationSchema}
      onSubmit={handleSubmit}
      enableReinitialize
    >
      {({ isSubmitting, errors, touched }) => (
        <Form className={styles.form}>
          <div className={styles.fieldGroup}>
            <label htmlFor="name" className={styles.label}>
              Завдання <span className={styles.required}>*</span>
            </label>
            <Field
              id="name"
              name="name"
              type="text"
              placeholder="Введіть назву завдання"
              className={`${styles.input} ${errors.name && touched.name ? styles.error : ''}`}
            />
            <ErrorMessage name="name" component="div" className={styles.errorMessage} />
          </div>

          <div className={styles.fieldGroup}>
            <label htmlFor="date" className={styles.label}>
              Дата <span className={styles.required}>*</span>
            </label>
            <div
              className={styles.dateInputWrapper}
              onClick={() => openDatePicker(dateInputRef.current)}
            >
              <Field
                innerRef={dateInputRef}
                id="date"
                name="date"
                type="date"
                min={minDate}
                className={`${styles.input} ${styles.dateInput} ${
                  errors.date && touched.date ? styles.error : ''
                }`}
                onClick={(event: React.MouseEvent<HTMLInputElement>) => {
                  event.stopPropagation()
                  openDatePicker(event.currentTarget)
                }}
                onFocus={(event: React.FocusEvent<HTMLInputElement>) => {
                  openDatePicker(event.currentTarget)
                }}
              />
            </div>
            <ErrorMessage name="date" component="div" className={styles.errorMessage} />
          </div>

          <div className={styles.buttonGroup}>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`${styles.button} ${styles.submitButton}`}
            >
              {isSubmitting ? 'Збереження...' : 'Зберегти'}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  )
}

export default AddTaskForm

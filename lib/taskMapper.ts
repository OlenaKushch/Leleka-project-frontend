import type { Task } from '@/types/task'

export interface BackendTask {
  id: number
  name: string
  date: string | Date
  isDone: boolean
  createdAt: string
  updatedAt: string
}

export function mapBackendTask(task: BackendTask): Task {
  const date =
    task.date instanceof Date
      ? task.date.toISOString()
      : typeof task.date === 'string'
        ? task.date
        : new Date(task.date).toISOString()

  return {
    _id: String(task.id),
    name: task.name,
    isDone: task.isDone,
    date,
    owner: '',
    createdAt: task.createdAt,
    updatedAt: task.updatedAt,
  }
}

export function mapBackendTasks(tasks: BackendTask[]): Task[] {
  return Array.isArray(tasks) ? tasks.map(mapBackendTask) : []
}

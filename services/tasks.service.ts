import { apiClient } from '@/lib/apiClient'
import { mapBackendTask, mapBackendTasks, type BackendTask } from '@/lib/taskMapper'
import { Task } from '@/types/task'

export const getTasks = async (): Promise<Task[]> => {
  const { data } = await apiClient.get<BackendTask[]>('/tasks')
  return mapBackendTasks(data)
}

export const createTask = async (payload: { name: string; date: string }): Promise<Task> => {
  const { data } = await apiClient.post<BackendTask>('/tasks', payload)
  return mapBackendTask(data)
}

export const updateTask = async (
  taskId: string,
  payload: { name: string; date: string }
): Promise<Task> => {
  const { data } = await apiClient.put<BackendTask>(`/tasks/${taskId}`, payload)
  return mapBackendTask(data)
}

export const updateTasksStatus = async (taskId: string, isDone: boolean): Promise<Task> => {
  const { data } = await apiClient.patch<BackendTask>(`/tasks/${taskId}/status`, { isDone })
  return mapBackendTask(data)
}

export const deleteTask = async (taskId: string): Promise<void> => {
  await apiClient.delete(`/tasks/${taskId}`)
}

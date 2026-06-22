import axios, { AxiosError, AxiosInstance } from 'axios'
import { API_URL } from '@/lib/apiConfig'
import { apiError } from '@/utils/error'

interface ApiErrorResponse {
  message?: string
  error?: string
}

function applyErrorInterceptor(instance: AxiosInstance): AxiosInstance {
  instance.interceptors.response.use(
    response => response,
    (error: AxiosError<ApiErrorResponse>) => {
      const backendMessage = error.response?.data?.message || error.response?.data?.error

      if (backendMessage && apiError[backendMessage]) {
        error.message = apiError[backendMessage]
      } else if (backendMessage) {
        error.message = backendMessage
      }

      return Promise.reject(error)
    }
  )

  return instance
}

export const apiClient = applyErrorInterceptor(
  axios.create({
    baseURL: API_URL,
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json',
    },
  })
)

/** @deprecated Use `apiClient` — kept for gradual migration of imports */
export const api = apiClient

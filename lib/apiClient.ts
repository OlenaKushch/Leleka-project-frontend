import axios, { AxiosError, AxiosInstance } from 'axios'
import { API_URL, API_TIMEOUT_MS } from '@/lib/apiConfig'
import { getAccessToken } from '@/lib/accessToken'
import { apiError } from '@/utils/error'

interface ApiErrorResponse {
  message?: string
  error?: string
}

function applyRequestInterceptor(instance: AxiosInstance): AxiosInstance {
  instance.interceptors.request.use(config => {
    const token = getAccessToken()

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  })

  return instance
}

function applyErrorInterceptor(instance: AxiosInstance): AxiosInstance {
  instance.interceptors.response.use(
    response => response,
    (error: AxiosError<ApiErrorResponse>) => {
      if (error.code === 'ECONNABORTED') {
        error.message =
          'Сервер довго не відповідає. Можливо, він прокидається — спробуйте ще раз через хвилину.'
      }

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
  applyRequestInterceptor(
  axios.create({
    baseURL: API_URL,
    timeout: API_TIMEOUT_MS,
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json',
    },
  }),
  ),
)

export const api = apiClient

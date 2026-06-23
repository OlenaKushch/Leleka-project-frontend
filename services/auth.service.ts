import { apiClient } from '@/lib/apiClient'
import { clearAccessToken, setAccessToken } from '@/lib/accessToken'
import type { User } from '@/types/user'
import type { UserRegister, UserLogin } from '@/types/auth'
import { fetchCurrentUser } from '@/services/users.service'

type AuthResponse = {
  accessToken: string
}

async function establishSession(response: { data: AuthResponse }): Promise<User> {
  const token = response.data?.accessToken

  if (!token) {
    throw new Error('Не вдалося отримати токен авторизації')
  }

  setAccessToken(token)
  return fetchCurrentUser()
}

export const register = async (creds: UserRegister): Promise<User> => {
  const response = await apiClient.post<AuthResponse>('/auth/register', creds)
  return establishSession(response)
}

export const login = async (creds: UserLogin): Promise<User> => {
  const response = await apiClient.post<AuthResponse>('/auth/login', creds)
  return establishSession(response)
}

export const logout = async (): Promise<void> => {
  try {
    await apiClient.post('/auth/logout')
  } finally {
    clearAccessToken()
  }
}

export const AuthService = {
  register,
  login,
  logout,
}

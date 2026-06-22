import { apiClient } from '@/lib/apiClient'
import type { User } from '@/types/user'
import type { UserRegister, UserLogin } from '@/types/auth'

export const register = async (creds: UserRegister): Promise<User> => {
  const { data } = await apiClient.post<User>('/auth/register', creds)
  return data
}

export const login = async (creds: UserLogin): Promise<User> => {
  const { data } = await apiClient.post<User>('/auth/login', creds)
  return data
}

export const logout = async (): Promise<void> => {
  await apiClient.post('/auth/logout')
}

export const AuthService = {
  register,
  login,
  logout,
}

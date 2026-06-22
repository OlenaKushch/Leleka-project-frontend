import { apiClient } from '@/lib/apiClient'
import { mapBackendUser } from '@/lib/userMapper'
import type { User } from '@/types/user'
import type { UserRegister, UserLogin } from '@/types/auth'
import { fetchCurrentUser } from '@/services/users.service'

export const register = async (creds: UserRegister): Promise<User> => {
  await apiClient.post('/auth/register', creds)
  return fetchCurrentUser()
}

export const login = async (creds: UserLogin): Promise<User> => {
  await apiClient.post('/auth/login', creds)
  return fetchCurrentUser()
}

export const logout = async (): Promise<void> => {
  await apiClient.post('/auth/logout')
}

export const AuthService = {
  register,
  login,
  logout,
}

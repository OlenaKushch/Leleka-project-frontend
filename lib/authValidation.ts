import { hasAccessToken } from '@/lib/accessToken'
import type { User } from '@/types/user'

export function isValidUser(user: Partial<User> | null | undefined): user is User {
  return Boolean(
    user &&
      typeof user.id === 'string' &&
      user.id.length > 0 &&
      typeof user.email === 'string' &&
      user.email.length > 0 &&
      typeof user.name === 'string' &&
      user.name.length > 0
  )
}

export function isAuthSessionReady(
  user: Partial<User> | null | undefined,
  isAuthenticated: boolean
): boolean {
  return Boolean(isAuthenticated && hasAccessToken() && isValidUser(user))
}

export function formatUserEmail(email?: string, maxLength = 18): string {
  if (!email) return ''
  return email.length > maxLength ? `${email.substring(0, maxLength)}...` : email
}

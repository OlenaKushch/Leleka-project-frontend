import type { User } from '@/types/user'

export interface BackendProfileUser {
  id: number | string
  email: string
  name: string
  childGender?: 'MALE' | 'FEMALE' | 'UNKNOWN' | null
  dueDate?: string | Date | null
  avatarUrl?: string | null
}

function mapGenderToTheme(
  gender?: BackendProfileUser['childGender']
): User['theme'] {
  if (gender === 'MALE') return 'boy'
  if (gender === 'FEMALE') return 'girl'
  return 'neutral'
}

function mapThemeToGender(theme?: User['theme']): BackendProfileUser['childGender'] {
  if (theme === 'boy') return 'MALE'
  if (theme === 'girl') return 'FEMALE'
  return 'UNKNOWN'
}

function formatDueDate(value?: string | Date | null): string | undefined {
  if (!value) return undefined
  if (value instanceof Date) {
    return value.toISOString().slice(0, 10)
  }
  return value.slice(0, 10)
}

export function mapBackendUser(data: BackendProfileUser): User {
  const dueDate = formatDueDate(data.dueDate)
  const theme = mapGenderToTheme(data.childGender)

  return {
    id: String(data.id ?? ''),
    name: data.name ?? '',
    email: data.email ?? '',
    avatar: data.avatarUrl ?? undefined,
    theme,
    dueDate,
    hasCompletedOnboarding: Boolean(dueDate && data.childGender),
  }
}

export function mapUserUpdateToBackend(data: Partial<User>) {
  return {
    ...(data.name !== undefined && { name: data.name }),
    ...(data.theme !== undefined && { childGender: mapThemeToGender(data.theme) }),
    ...(data.dueDate !== undefined && { dueDate: data.dueDate }),
  }
}

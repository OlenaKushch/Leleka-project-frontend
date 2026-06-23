const STORAGE_KEY = 'accessToken'

export function getAccessToken(): string | null {
  if (typeof window === 'undefined') {
    return null
  }

  return localStorage.getItem(STORAGE_KEY)
}

export function setAccessToken(token: string): void {
  if (typeof window === 'undefined') {
    return
  }

  localStorage.setItem(STORAGE_KEY, token)
}

export function clearAccessToken(): void {
  if (typeof window === 'undefined') {
    return
  }

  localStorage.removeItem(STORAGE_KEY)
}

export function hasAccessToken(): boolean {
  return Boolean(getAccessToken())
}

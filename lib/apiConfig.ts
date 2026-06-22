export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || 'https://stork-helpers-api.onrender.com/api'

export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

export function getGoogleAuthUrl(mode: 'login' | 'register'): string {
  const url = new URL(`${API_URL}/auth/google`)
  url.searchParams.set('redirect_uri', `${APP_URL}/auth/callback`)
  url.searchParams.set('mode', mode)
  return url.toString()
}

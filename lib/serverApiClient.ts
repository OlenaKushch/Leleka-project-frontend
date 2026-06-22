import { headers } from 'next/headers'
import { API_URL } from '@/lib/apiConfig'

type FetchOptions = Omit<RequestInit, 'headers'> & {
  headers?: Record<string, string>
}

export async function serverFetch(path: string, options: FetchOptions = {}): Promise<Response> {
  const headerList = await headers()
  const cookie = headerList.get('cookie')

  const requestHeaders: Record<string, string> = {
    ...options.headers,
  }

  if (cookie) {
    requestHeaders.Cookie = cookie
  }

  return fetch(`${API_URL}${path}`, {
    ...options,
    headers: requestHeaders,
    cache: 'no-store',
  })
}

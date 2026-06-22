export const PUBLIC_AUTH_ROUTES = [
  '/auth/login',
  '/auth/register',
  '/auth/callback',
] as const

export const PROTECTED_ROUTE_PREFIXES = ['/profile', '/diary', '/journey'] as const

export function isPublicAuthRoute(pathname: string): boolean {
  return PUBLIC_AUTH_ROUTES.some(route => pathname.startsWith(route))
}

export function isProtectedRoute(pathname: string): boolean {
  return PROTECTED_ROUTE_PREFIXES.some(prefix => pathname.startsWith(prefix))
}

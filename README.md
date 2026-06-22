# Leleka — Frontend

Next.js frontend for the Stork Helpers pregnancy tracking app.

## Tech stack

- Next.js 16 (App Router)
- TypeScript, React
- Axios → NestJS API
- Zustand, React Query
- CSS Modules / SCSS

## Architecture

The frontend talks **directly** to the NestJS backend at `NEXT_PUBLIC_API_URL`.

```
Browser ──withCredentials──► NestJS API
Next.js RSC (SSR) ──Cookie forward──► NestJS API
```

There is **no Next.js BFF/proxy layer**. Auth cookies are set by NestJS on the API domain.

### NestJS requirements

- CORS: `credentials: true`, allowed origin = `NEXT_PUBLIC_APP_URL`
- HttpOnly session cookies (`accessToken`, `refreshToken`, etc.)
- Google OAuth: `GET /auth/google?redirect_uri={APP_URL}/auth/callback` → redirect back to frontend after login

## Environment variables

Copy `.env.example` to `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project structure

```
app/                 # Pages (App Router)
components/          # UI components
hooks/               # Custom hooks
lib/
  apiClient.ts       # Browser axios client → NestJS
  apiConfig.ts       # API_URL, APP_URL, OAuth helpers
  serverApiClient.ts # SSR fetch with cookie forwarding
services/
  auth.service.ts    # Login, register, logout
  *.service.ts       # Domain API calls
  server/            # Server-only data fetching
store/               # Zustand stores
```

## Auth flow

1. **Email/password** — `POST {API_URL}/auth/login` with `withCredentials`
2. **Google** — redirect to `{API_URL}/auth/google`, callback at `/auth/callback`
3. **Session** — `useMe()` hydrates user from `GET /users/me`
4. **Protected routes** — client-side via `useProtectedRoute` + Zustand

## Scripts

| Command        | Description          |
|----------------|----------------------|
| `npm run dev`  | Development server   |
| `npm run build`| Production build     |
| `npm run start`| Production server    |
| `npm run lint` | ESLint               |

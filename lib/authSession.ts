import type { QueryClient } from '@tanstack/react-query'
import type { User } from '@/types/user'

export async function applyAuthSession(queryClient: QueryClient, user: User | null): Promise<void> {
  await queryClient.cancelQueries({ queryKey: ['me'] })
  queryClient.setQueryData(['me'], user)
  await queryClient.invalidateQueries({ queryKey: ['tasks'] })
  await invalidatePregnancyQueries(queryClient)
}

export async function invalidatePregnancyQueries(queryClient: QueryClient): Promise<void> {
  await queryClient.invalidateQueries({ queryKey: ['weekData'] })
  await queryClient.invalidateQueries({ queryKey: ['myDayWeek'] })
  await queryClient.invalidateQueries({ queryKey: ['authenticatedWeekData'] })
}

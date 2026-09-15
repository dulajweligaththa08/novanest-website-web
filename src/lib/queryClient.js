import { QueryClient, keepPreviousData } from '@tanstack/react-query'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime:           1000 * 60 * 5,  // 5 minutes — data stays fresh longer
      gcTime:              1000 * 60 * 10, // 10 minutes — keep in cache after unmount
      retry:               2,              // retry twice before showing error
      retryDelay:          (attempt) => Math.min(1000 * 2 ** attempt, 8000),
      refetchOnWindowFocus: false,
      refetchOnMount:      true,           // always fetch fresh when component mounts
    },
  },
})

export { keepPreviousData }
export default queryClient

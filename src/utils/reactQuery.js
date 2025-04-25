import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60,             // 5 minutes: data is "fresh"
      cacheTime: 1000 * 6,            // 10 minutes: data stays in cache
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
      refetchInterval: false,               // No polling by default
      retry: 2,
    },
    mutations: {
      onError: (error) => {
        console.error('Mutation error:', error);
      },
      retry: 1,                             // Retry once for POST/PUT
    },
  },
});

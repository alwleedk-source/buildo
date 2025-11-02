'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Cache data for 3 minutes (safe increase from 1 min)
            staleTime: 3 * 60 * 1000,
            // Keep unused data in cache for 5 minutes
            gcTime: 5 * 60 * 1000,
            // Don't refetch on window focus
            refetchOnWindowFocus: false,
            // Don't refetch on mount if data is fresh
            refetchOnMount: false,
            // Retry failed requests once
            retry: 1,
            // Default query function
            queryFn: async ({ queryKey }) => {
              const response = await fetch(queryKey[0] as string);
              if (!response.ok) {
                throw new Error(`Failed to fetch ${queryKey[0]}`);
              }
              return response.json();
            },
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}

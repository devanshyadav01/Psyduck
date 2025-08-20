import React, { useMemo } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { shouldRetry } from '../../lib/utils/api';
import { config, isDevelopment } from '../../config/environment';

interface QueryProviderProps {
  children: React.ReactNode;
}

// Create optimized query client with better defaults
const createQueryClient = (): QueryClient => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: shouldRetry,
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 10 * 60 * 1000, // 10 minutes
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
        refetchInterval: false,
      },
      mutations: {
        retry: 1,
        onError: (error) => {
          console.error('Mutation error:', error);
        },
      },
    },
    logger: {
      log: isDevelopment ? console.log : () => {},
      warn: isDevelopment ? console.warn : () => {},
      error: console.error,
    },
  });
};

export const QueryProvider: React.FC<QueryProviderProps> = ({ children }) => {
  // Memoize query client to prevent recreation
  const queryClient = useMemo(() => createQueryClient(), []);

  const isDevToolsEnabled = useMemo(() => 
    isDevelopment && config.features.devTools, 
    []
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {isDevToolsEnabled && (
        <ReactQueryDevtools 
          initialIsOpen={false}
          buttonPosition="bottom-right"
          position="bottom-right"
          panelProps={{
            style: { fontFamily: 'inherit' }
          }}
        />
      )}
    </QueryClientProvider>
  );
};
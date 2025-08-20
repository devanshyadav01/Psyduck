import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from 'sonner';

import { AuthProvider } from './contexts/AuthContext';
import { UIProvider } from './contexts/UIContext';
import { AppContent } from './components/AppContent';
import { DevInfo } from './components/DevInfo';
import { useRealTimeSync } from './hooks/useAPI';
import { config, isDevelopment } from './config/environment';

// Monaco Editor type declaration
declare global {
  interface Window {
    monaco: any;
    require: any;
  }
}

// Create a query client instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        // Don't retry on 401 (unauthorized) or 403 (forbidden)
        if (error instanceof Error && error.message.includes('401')) return false;
        if (error instanceof Error && error.message.includes('403')) return false;
        return failureCount < 3;
      },
      staleTime: 2 * 60 * 1000, // 2 minutes default stale time
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    },
    mutations: {
      retry: 1,
    },
  },
});

// Real-time sync wrapper component
function RealTimeSyncProvider({ children }: { children: React.ReactNode }) {
  useRealTimeSync();
  return <>{children}</>;
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <UIProvider>
          <RealTimeSyncProvider>
            <AppContent />
            
            {/* Development Info Panel */}
            <DevInfo />
            
            {/* Toast notifications */}
            <Toaster 
              position="top-right"
              toastOptions={{
                style: {
                  background: 'hsl(var(--card))',
                  color: 'hsl(var(--card-foreground))',
                  border: '1px solid hsl(var(--border))',
                },
              }}
              closeButton
              richColors
            />
            
            {/* React Query DevTools - only in development */}
            {isDevelopment && config.features.devTools && (
              <ReactQueryDevtools 
                initialIsOpen={false} 
                buttonPosition="bottom-right"
              />
            )}
          </RealTimeSyncProvider>
        </UIProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
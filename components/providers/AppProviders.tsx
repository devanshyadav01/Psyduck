import React from 'react';
import { QueryProvider } from './QueryProvider';
import { ThemeProvider } from './ThemeProvider';
import { DevTools } from './DevTools';
import { RealTimeSyncProvider } from './RealTimeSyncProvider';
import { RouterProvider } from '../../contexts/RouterContext';
import { AuthProvider } from '../../contexts/AuthContext';
import { UIProvider } from '../../contexts/UIContext';

interface AppProvidersProps {
  children: React.ReactNode;
}

export const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
  return (
    <QueryProvider>
      <RouterProvider>
        <AuthProvider>
          <UIProvider>
            <ThemeProvider>
              <RealTimeSyncProvider>
                {children}
                <DevTools />
              </RealTimeSyncProvider>
            </ThemeProvider>
          </UIProvider>
        </AuthProvider>
      </RouterProvider>
    </QueryProvider>
  );
};
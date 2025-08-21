import React, { Suspense } from 'react';
import { LoadingFallback } from './LoadingFallback';

// Lazy-loaded providers with performance optimization
export const QueryProvider = React.lazy(() => 
  import('../providers/QueryProvider').then(module => ({ 
    default: module.QueryProvider 
  })).catch(() => ({ 
    default: ({ children }: { children: React.ReactNode }) => <>{children}</> 
  }))
);

export const RouterProvider = React.lazy(() =>
  import('../../contexts/RouterContext').then(module => ({ 
    default: module.RouterProvider 
  })).catch(() => ({ 
    default: ({ children }: { children: React.ReactNode }) => <>{children}</> 
  }))
);

export const AuthProvider = React.lazy(() =>
  import('../../contexts/AuthContext').then(module => ({ 
    default: module.AuthProvider 
  })).catch(() => ({ 
    default: ({ children }: { children: React.ReactNode }) => <>{children}</> 
  }))
);

export const UIProvider = React.lazy(() =>
  import('../../contexts/UIContext').then(module => ({ 
    default: module.UIProvider 
  })).catch(() => ({ 
    default: ({ children }: { children: React.ReactNode }) => <>{children}</> 
  }))
);

export const ThemeProvider = React.lazy(() =>
  import('../providers/ThemeProvider').then(module => ({ 
    default: module.ThemeProvider 
  })).catch(() => ({ 
    default: ({ children }: { children: React.ReactNode }) => <>{children}</> 
  }))
);

export const RealTimeSyncProvider = React.lazy(() =>
  import('../providers/RealTimeSyncProvider').then(module => ({ 
    default: module.RealTimeSyncProvider 
  })).catch(() => ({ 
    default: ({ children }: { children: React.ReactNode }) => <>{children}</> 
  }))
);

export const DevTools = React.lazy(() =>
  import('../providers/DevTools').then(module => ({ 
    default: module.DevTools 
  })).catch(() => ({ 
    default: () => null 
  }))
);

// Main app content with lazy loading
export const AppContent = React.lazy(() =>
  import('../AppContent').then(module => ({ 
    default: module.AppContent 
  })).catch(() => ({
    default: () => (
      <div className="p-5 text-center text-psyduck-primary">
        <h1>🦆 Loading...</h1>
        <p>Starting Psyduck Learning Platform...</p>
      </div>
    )
  }))
);

export const FloatingElementsContainer = React.lazy(() =>
  import('../FloatingElementsContainer').then(module => ({ 
    default: module.FloatingElementsContainer 
  })).catch(() => ({ 
    default: () => null 
  }))
);

export const RoutePreloader = React.lazy(() =>
  import('../RoutePreloader').then(module => ({ 
    default: module.RoutePreloader 
  })).catch(() => ({ 
    default: () => null 
  }))
);

export const PerformanceMonitor = React.lazy(() =>
  import('../PerformanceMonitor').then(module => ({ 
    default: module.PerformanceMonitor 
  })).catch(() => ({ 
    default: () => null 
  }))
);

// Optimized provider composition with suspense boundaries
export const AppProviders: React.FC<{ children: React.ReactNode }> = React.memo(({ children }) => {
  return (
    <Suspense fallback={<LoadingFallback name="core services" />}>
      <QueryProvider>
        <Suspense fallback={<LoadingFallback name="router" />}>
          <RouterProvider>
            <Suspense fallback={<LoadingFallback name="authentication" />}>
              <AuthProvider>
                <Suspense fallback={<LoadingFallback name="UI context" />}>
                  <UIProvider>
                    <Suspense fallback={<LoadingFallback name="theme" />}>
                      <ThemeProvider>
                        <Suspense fallback={<LoadingFallback name="real-time sync" />}>
                          <RealTimeSyncProvider>
                            {children}
                            {process.env.NODE_ENV === 'development' && (
                              <Suspense fallback={null}>
                                <DevTools />
                              </Suspense>
                            )}
                          </RealTimeSyncProvider>
                        </Suspense>
                      </ThemeProvider>
                    </Suspense>
                  </UIProvider>
                </Suspense>
              </AuthProvider>
            </Suspense>
          </RouterProvider>
        </Suspense>
      </QueryProvider>
    </Suspense>
  );
});

AppProviders.displayName = 'AppProviders';
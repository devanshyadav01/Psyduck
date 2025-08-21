import React, { createContext, useContext, ReactNode, useCallback, useEffect, useState, useRef } from 'react';
import { navigationTracker } from '../lib/performance/navigation';

interface RouteConfig {
  path: string;
  title?: string;
  requiresAuth?: boolean;
}

interface RouterContextType {
  currentRoute: RouteConfig;
  navigate: (path: string, options?: { replace?: boolean }) => void;
  goBack: () => void;
}

const RouterContext = createContext<RouterContextType | undefined>(undefined);

export function useRouterContext() {
  const context = useContext(RouterContext);
  if (context === undefined) {
    console.error('useRouterContext must be used within RouterProvider');
    // Fallback with minimal implementation
    return {
      currentRoute: { path: window.location.pathname },
      navigate: (path: string) => window.history.pushState(null, '', path),
      goBack: () => window.history.back(),
    };
  }
  return context;
}

interface RouterProviderProps {
  children: ReactNode;
}

export function RouterProvider({ children }: RouterProviderProps) {
  // Performance optimization: Use refs to avoid unnecessary re-renders
  const navigationInProgress = useRef(false);
  const lastNavigationTime = useRef(0);
  const urlCheckIntervalRef = useRef<NodeJS.Timeout>();

  // Initialize current route from URL
  const [currentRoute, setCurrentRoute] = useState<RouteConfig>(() => {
    const initialPath = window.location.pathname;
    if (process.env.NODE_ENV === 'development') {
      console.log('🧭 RouterProvider initializing with path:', initialPath);
    }
    return { path: initialPath };
  });

  // Optimized navigate function with debouncing
  const navigate = useCallback((path: string, options?: { replace?: boolean }) => {
    const now = Date.now();
    
    // Debounce rapid navigation calls (prevent double-clicks, etc.)
    if (navigationInProgress.current || (now - lastNavigationTime.current < 100)) {
      if (process.env.NODE_ENV === 'development') {
        console.log('🧭 Navigation debounced for path:', path);
      }
      return;
    }

    // Don't navigate if we're already on this path
    if (path === currentRoute.path && path === window.location.pathname) {
      if (process.env.NODE_ENV === 'development') {
        console.log('🧭 Already on path:', path);
      }
      return;
    }

    navigationInProgress.current = true;
    lastNavigationTime.current = now;

    if (process.env.NODE_ENV === 'development') {
      console.log('🧭 RouterProvider navigate:', { from: currentRoute.path, to: path });
    }

    try {
      // Start performance tracking
      navigationTracker.startNavigation(path);

      // Performance: Use requestAnimationFrame for smooth navigation
      requestAnimationFrame(() => {
        // Update browser URL
        if (options?.replace) {
          window.history.replaceState(null, '', path);
        } else {
          window.history.pushState(null, '', path);
        }
        
        // Update route state
        setCurrentRoute({ path });
        
        // Mark navigation as complete
        navigationInProgress.current = false;
        
        // End performance tracking after a short delay to account for component loading
        setTimeout(() => {
          navigationTracker.endNavigation();
        }, 50);
      });
      
    } catch (error) {
      console.error('🧭 Navigation error:', error);
      navigationInProgress.current = false;
      navigationTracker.endNavigation();
    }
  }, [currentRoute.path]);

  const goBack = useCallback(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('🧭 Going back from RouterProvider');
    }
    window.history.back();
  }, []);

  // Optimized popstate and URL change handling
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      const newPath = window.location.pathname;
      if (newPath !== currentRoute.path) {
        if (process.env.NODE_ENV === 'development') {
          console.log('🧭 PopState event - updating to:', newPath);
        }
        setCurrentRoute({ path: newPath });
      }
    };

    const handleUrlChange = () => {
      const newPath = window.location.pathname;
      if (newPath !== currentRoute.path && !navigationInProgress.current) {
        if (process.env.NODE_ENV === 'development') {
          console.log('🧭 URL changed detected:', newPath);
        }
        setCurrentRoute({ path: newPath });
      }
    };

    // Listen for browser navigation
    window.addEventListener('popstate', handlePopState);
    
    // Reduced polling frequency for better performance (500ms instead of 100ms)
    // and only poll when necessary
    const startUrlPolling = () => {
      if (!urlCheckIntervalRef.current) {
        urlCheckIntervalRef.current = setInterval(handleUrlChange, 500);
      }
    };

    const stopUrlPolling = () => {
      if (urlCheckIntervalRef.current) {
        clearInterval(urlCheckIntervalRef.current);
        urlCheckIntervalRef.current = undefined;
      }
    };

    // Only start polling when the page gains focus (optimization)
    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopUrlPolling();
      } else {
        startUrlPolling();
        handleUrlChange(); // Check immediately on focus
      }
    };

    // Start polling and visibility handling
    startUrlPolling();
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('popstate', handlePopState);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      stopUrlPolling();
    };
  }, [currentRoute.path]);

  // Memoize context value to prevent unnecessary re-renders
  const contextValue = React.useMemo(() => ({
    currentRoute,
    navigate,
    goBack,
  }), [currentRoute, navigate, goBack]);

  if (process.env.NODE_ENV === 'development') {
    console.log('🧭 RouterProvider render with route:', currentRoute.path);
  }

  return (
    <RouterContext.Provider value={contextValue}>
      {children}
    </RouterContext.Provider>
  );
}
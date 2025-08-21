import { useState, useEffect, useCallback } from 'react';

interface RouteConfig {
  path: string;
  title?: string;
  requiresAuth?: boolean;
}

// This hook is now primarily for backward compatibility
// Components should use useRouterContext from RouterContext instead
export function useRouter() {
  const [currentRoute, setCurrentRoute] = useState<RouteConfig>(() => {
    const initialPath = window.location.pathname;
    console.log('🧭 useRouter hook initializing with path:', initialPath);
    return { path: initialPath };
  });

  const navigate = useCallback((path: string, options?: { replace?: boolean }) => {
    console.log('🧭 useRouter hook navigate called:', { 
      from: currentRoute.path, 
      to: path, 
      options,
      currentUrl: window.location.pathname 
    });
    
    // Don't navigate if we're already on this path
    if (path === currentRoute.path && path === window.location.pathname) {
      console.log('🧭 useRouter hook - already on path:', path);
      return;
    }

    try {
      if (options?.replace) {
        window.history.replaceState(null, '', path);
        console.log('🧭 useRouter hook - history replaced to:', path);
      } else {
        window.history.pushState(null, '', path);
        console.log('🧭 useRouter hook - history pushed to:', path);
      }
      
      // Update the route state to trigger re-renders
      const newRoute = { path };
      setCurrentRoute(newRoute);
      console.log('🧭 useRouter hook - route state updated to:', newRoute);
      
      // Dispatch custom event to notify other components
      window.dispatchEvent(new CustomEvent('routechange', { detail: { path } }));
      
    } catch (error) {
      console.error('🧭 useRouter hook - navigation error:', error);
    }
  }, [currentRoute.path]);

  const goBack = useCallback(() => {
    console.log('🧭 useRouter hook - going back');
    window.history.back();
  }, []);

  // Handle browser back/forward buttons and custom route events
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      const newPath = window.location.pathname;
      console.log('🧭 useRouter hook - PopState event, updating to:', newPath);
      setCurrentRoute({ path: newPath });
    };

    const handleRouteChange = (event: CustomEvent) => {
      const newPath = event.detail.path;
      console.log('🧭 useRouter hook - custom route change event:', newPath);
      if (newPath !== currentRoute.path) {
        setCurrentRoute({ path: newPath });
      }
    };

    // Handle browser back/forward buttons
    window.addEventListener('popstate', handlePopState);
    // Handle custom route change events
    window.addEventListener('routechange', handleRouteChange as EventListener);
    
    // Initialize route on mount if URL doesn't match state
    const currentPath = window.location.pathname;
    if (currentPath !== currentRoute.path) {
      console.log('🧭 useRouter hook - URL/state mismatch on mount. URL:', currentPath, 'State:', currentRoute.path);
      setCurrentRoute({ path: currentPath });
    }

    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('routechange', handleRouteChange as EventListener);
    };
  }, [currentRoute.path]);

  // Debug effect to log state changes
  useEffect(() => {
    console.log('🧭 useRouter hook - route state changed:', {
      currentRoute: currentRoute.path,
      actualUrl: window.location.pathname,
      match: currentRoute.path === window.location.pathname,
      timestamp: new Date().toISOString()
    });
  }, [currentRoute.path]);

  return {
    currentRoute,
    navigate,
    goBack,
  };
}
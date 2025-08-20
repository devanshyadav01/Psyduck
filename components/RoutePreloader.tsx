import React, { useEffect } from 'react';
import { preloadCriticalRoutes, preloadRoute } from '../lib/performance/navigation';
import { useRouterContext } from '../contexts/RouterContext';

// Component that preloads routes based on user behavior
export const RoutePreloader: React.FC = React.memo(() => {
  const { currentRoute } = useRouterContext();

  // Preload critical routes on mount
  useEffect(() => {
    // Delay preloading to avoid blocking initial render
    const timer = setTimeout(() => {
      preloadCriticalRoutes();
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  // Predictive preloading based on current route
  useEffect(() => {
    if (!currentRoute?.path) return;

    const preloadRelatedRoutes = () => {
      switch (currentRoute.path) {
        case '/dashboard':
          // Users often go to projects from dashboard
          preloadRoute('/projects');
          preloadRoute('/profile');
          break;
        
        case '/projects':
          // Users often go to IDE from projects
          preloadRoute('/dashboard');
          break;
        
        case '/profile':
          // Users might go to settings from profile
          preloadRoute('/settings');
          break;
        
        default:
          break;
      }
    };

    // Use requestIdleCallback for non-critical preloading
    if ('requestIdleCallback' in window) {
      requestIdleCallback(preloadRelatedRoutes);
    } else {
      setTimeout(preloadRelatedRoutes, 1000);
    }
  }, [currentRoute?.path]);

  // This component doesn't render anything
  return null;
});

RoutePreloader.displayName = 'RoutePreloader';

// Hook for components to trigger smart preloading
export const useSmartPreloading = (routes: string[]) => {
  useEffect(() => {
    const preloadOnHover = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const link = target.closest('[data-preload-route]');
      
      if (link) {
        const route = link.getAttribute('data-preload-route');
        if (route && routes.includes(route)) {
          preloadRoute(route);
        }
      }
    };

    // Add hover listener for smart preloading
    document.addEventListener('mouseover', preloadOnHover);
    
    return () => {
      document.removeEventListener('mouseover', preloadOnHover);
    };
  }, [routes]);
};

export default RoutePreloader;
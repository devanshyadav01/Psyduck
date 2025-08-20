// Navigation performance utilities for Psyduck platform

interface NavigationMetrics {
  startTime: number;
  endTime?: number;
  route: string;
  duration?: number;
  componentLoadTime?: number;
}

class NavigationPerformanceTracker {
  private static instance: NavigationPerformanceTracker;
  private metrics: Map<string, NavigationMetrics> = new Map();
  private currentNavigation: string | null = null;

  static getInstance(): NavigationPerformanceTracker {
    if (!NavigationPerformanceTracker.instance) {
      NavigationPerformanceTracker.instance = new NavigationPerformanceTracker();
    }
    return NavigationPerformanceTracker.instance;
  }

  // Start tracking a navigation
  startNavigation(route: string): void {
    const navigationId = `nav-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    this.currentNavigation = navigationId;
    
    this.metrics.set(navigationId, {
      startTime: performance.now(),
      route,
    });

    // Use Performance API marks for better tracking
    if ('performance' in window && 'mark' in performance) {
      performance.mark(`navigation-start-${route}`);
    }

    if (process.env.NODE_ENV === 'development') {
      console.log(`🚀 Navigation started: ${route}`);
    }
  }

  // End tracking a navigation
  endNavigation(): void {
    if (!this.currentNavigation) return;

    const metric = this.metrics.get(this.currentNavigation);
    if (!metric) return;

    const endTime = performance.now();
    const duration = endTime - metric.startTime;

    metric.endTime = endTime;
    metric.duration = duration;

    // Use Performance API measures
    if ('performance' in window && 'measure' in performance) {
      try {
        performance.measure(
          `navigation-${metric.route}`,
          `navigation-start-${metric.route}`
        );
      } catch (e) {
        // Ignore if mark doesn't exist
      }
    }

    if (process.env.NODE_ENV === 'development') {
      console.log(`⚡ Navigation completed: ${metric.route} in ${duration.toFixed(2)}ms`);
      
      // Warn about slow navigations
      if (duration > 1000) {
        console.warn(`🐌 Slow navigation detected: ${metric.route} took ${duration.toFixed(2)}ms`);
      }
    }

    this.currentNavigation = null;
  }

  // Track component load time within navigation
  trackComponentLoad(componentName: string, loadTime: number): void {
    if (!this.currentNavigation) return;

    const metric = this.metrics.get(this.currentNavigation);
    if (metric) {
      metric.componentLoadTime = loadTime;
      
      if (process.env.NODE_ENV === 'development') {
        console.log(`📦 Component loaded: ${componentName} in ${loadTime.toFixed(2)}ms`);
      }
    }
  }

  // Get performance metrics for analysis
  getMetrics(): NavigationMetrics[] {
    return Array.from(this.metrics.values()).filter(m => m.duration !== undefined);
  }

  // Get average navigation time
  getAverageNavigationTime(): number {
    const completedMetrics = this.getMetrics();
    if (completedMetrics.length === 0) return 0;

    const totalTime = completedMetrics.reduce((sum, metric) => sum + (metric.duration || 0), 0);
    return totalTime / completedMetrics.length;
  }

  // Clear old metrics (keep only last 50 navigations)
  cleanup(): void {
    const metrics = Array.from(this.metrics.entries())
      .sort(([, a], [, b]) => (b.startTime) - (a.startTime))
      .slice(50);

    this.metrics.clear();
    metrics.forEach(([key, value]) => {
      this.metrics.set(key, value);
    });
  }
}

// Singleton instance
export const navigationTracker = NavigationPerformanceTracker.getInstance();

// Hook for tracking navigation performance
export const useNavigationPerformance = (route: string) => {
  React.useEffect(() => {
    navigationTracker.startNavigation(route);
    
    return () => {
      navigationTracker.endNavigation();
    };
  }, [route]);
};

// Hook for tracking component load performance
export const useComponentLoadPerformance = (componentName: string) => {
  React.useEffect(() => {
    const startTime = performance.now();
    
    return () => {
      const loadTime = performance.now() - startTime;
      navigationTracker.trackComponentLoad(componentName, loadTime);
    };
  }, [componentName]);
};

// Route preloading utilities
export const preloadRoute = async (routePath: string): Promise<void> => {
  try {
    switch (routePath) {
      case '/dashboard':
        await import('../../components/Dashboard');
        break;
      case '/projects':
        await import('../../components/ProjectCatalog');
        break;
      case '/profile':
        await import('../../components/Profile');
        break;
      case '/leaderboard':
        await import('../../components/Leaderboard');
        break;
      case '/settings':
        await import('../../components/Settings');
        break;
      case '/notifications':
        await import('../../components/Notifications');
        break;
      default:
        // Don't preload unknown routes
        break;
    }
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`📦 Preloaded route: ${routePath}`);
    }
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.warn(`Failed to preload route: ${routePath}`, error);
    }
  }
};

// Preload commonly accessed routes
export const preloadCriticalRoutes = (): void => {
  // Use requestIdleCallback for better performance
  const preload = () => {
    preloadRoute('/dashboard');
    preloadRoute('/projects');
    preloadRoute('/profile');
  };

  if ('requestIdleCallback' in window) {
    requestIdleCallback(preload);
  } else {
    setTimeout(preload, 1000);
  }
};

// Bundle size monitoring (development only)
export const monitorBundleSize = (): void => {
  if (process.env.NODE_ENV !== 'development') return;

  // Monitor performance entries for script loads
  const observer = new PerformanceObserver((list) => {
    list.getEntries().forEach((entry) => {
      if (entry.name.includes('.js') && entry.transferSize) {
        console.log(`📊 Script loaded: ${entry.name.split('/').pop()} (${(entry.transferSize / 1024).toFixed(2)}KB)`);
      }
    });
  });

  observer.observe({ entryTypes: ['resource'] });
};

// React import for hooks
import React from 'react';
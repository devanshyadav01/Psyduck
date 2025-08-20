// Performance optimization utilities
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// Memoization utility
export const memoize = <T extends (...args: any[]) => any>(
  func: T
): T => {
  const cache = new Map();
  
  return ((...args: Parameters<T>) => {
    const key = JSON.stringify(args);
    
    if (cache.has(key)) {
      return cache.get(key);
    }
    
    const result = func(...args);
    cache.set(key, result);
    
    return result;
  }) as T;
};

// Performance monitoring
export const measurePerformance = (name: string, fn: () => void) => {
  if ('performance' in window && 'mark' in performance) {
    performance.mark(`${name}-start`);
    fn();
    performance.mark(`${name}-end`);
    performance.measure(name, `${name}-start`, `${name}-end`);
  } else {
    fn();
  }
};

// Bundle size analyzer
export const getBundleInfo = () => {
  if (!('performance' in window)) return null;
  
  const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
  
  return {
    transferSize: Math.round(navigation.transferSize / 1024), // KB
    encodedSize: Math.round(navigation.encodedBodySize / 1024), // KB
    decodedSize: Math.round(navigation.decodedBodySize / 1024), // KB
  };
};

// Memory usage monitoring
export const getMemoryUsage = () => {
  if ('memory' in performance) {
    const memory = (performance as any).memory;
    return {
      used: Math.round(memory.usedJSHeapSize / 1024 / 1024), // MB
      total: Math.round(memory.totalJSHeapSize / 1024 / 1024), // MB
      limit: Math.round(memory.jsHeapSizeLimit / 1024 / 1024) // MB
    };
  }
  return null;
};

// Lazy loading utility
export const lazyLoad = <T>(
  importFunc: () => Promise<{ default: T }>,
  fallback?: T
): Promise<T> => {
  return importFunc()
    .then(module => module.default)
    .catch(error => {
      console.error('Lazy loading failed:', error);
      if (fallback) {
        return fallback;
      }
      throw error;
    });
};

// Preload resources
export const preloadResource = (url: string, as: string = 'script') => {
  const link = document.createElement('link');
  link.rel = 'preload';
  link.href = url;
  link.as = as;
  document.head.appendChild(link);
};

// Image optimization
export const optimizeImage = (
  src: string,
  width?: number,
  height?: number,
  quality: number = 80
): string => {
  // For Unsplash images, add optimization parameters
  if (src.includes('unsplash.com')) {
    const url = new URL(src);
    if (width) url.searchParams.set('w', width.toString());
    if (height) url.searchParams.set('h', height.toString());
    url.searchParams.set('q', quality.toString());
    url.searchParams.set('auto', 'format');
    return url.toString();
  }
  
  return src;
};

// Component render tracking
export const trackRender = (componentName: string) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`🎯 ${componentName} rendered at ${new Date().toISOString()}`);
  }
};

// Error reporting
export const reportError = (error: Error, context?: string) => {
  console.error(`Error in ${context || 'Unknown'}:`, error);
  
  // Could integrate with error tracking service here
  if (window.gtag) {
    window.gtag('event', 'exception', {
      description: error.message,
      fatal: false,
      context
    });
  }
};

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}
// App-specific performance utilities
export const performanceUtils = {
  mark: (name: string) => {
    if ('performance' in window && 'mark' in performance) {
      performance.mark(name);
    }
  },
  
  measure: (name: string, start: string, end: string) => {
    if ('performance' in window && 'measure' in performance) {
      try {
        performance.measure(name, start, end);
      } catch (e) {
        // Ignore if marks don't exist
      }
    }
  }
};
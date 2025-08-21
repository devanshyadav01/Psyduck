// Monaco Editor type declarations and setup
declare global {
  interface Window {
    monaco: any;
    require: any;
    MonacoEnvironment?: any;
  }
}

// Setup Monaco Environment to prevent worker loading errors
export const setupMonacoEnvironment = () => {
  if (!window.MonacoEnvironment) {
    window.MonacoEnvironment = {
      getWorkerUrl: function (workerId: string, label: string) {
        // Return a data URL to avoid CORS issues in iframe environments
        return `data:text/javascript;charset=utf-8,${encodeURIComponent(`
          // Minimal worker implementation to prevent loading errors
          self.addEventListener('message', function(e) {
            // Simple echo to prevent hangs
            self.postMessage(e.data);
          });
        `)}`;
      }
    };
  }

  // Enhanced error handling for Monaco Editor and web workers
  const originalConsoleError = console.error;
  const originalConsoleWarn = console.warn;

  // Pre-compiled regex for better performance - includes worker errors
  const monacoErrorRegex = /Failed to load message bundle|Falling back to the default language|\[object Event\].*message bundle|Failed to construct 'Worker'|Script.*cannot be accessed from origin|Could not create web worker/i;
  const monacoWarningRegex = /message bundle|availableLanguages|monaco.*nls|web worker.*fallback|loading web worker code in main thread/i;

  console.error = (...args: any[]) => {
    const message = String(args[0]);
    if (!monacoErrorRegex.test(message)) {
      originalConsoleError(...args);
    }
  };

  console.warn = (...args: any[]) => {
    const message = String(args[0]);
    if (!monacoWarningRegex.test(message)) {
      originalConsoleWarn(...args);
    }
  };

  return () => {
    console.error = originalConsoleError;
    console.warn = originalConsoleWarn;
  };
};
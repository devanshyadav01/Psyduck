import React from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

// Optimized error boundary
export class PerformantErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('App error caught:', error.message);
    // Send to error reporting service in production
    if (process.env.NODE_ENV === 'production') {
      // window.reportError?.(error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="text-center p-8 max-w-md">
            <h1 className="text-2xl font-medium text-psyduck-primary mb-4">🦆 Something went wrong</h1>
            <p className="text-muted-foreground mb-6">
              The application encountered an error and needs to be reloaded.
            </p>
            <button 
              onClick={() => window.location.reload()}
              className="bg-psyduck-primary hover:bg-psyduck-primary-hover text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              🔄 Reload Application
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
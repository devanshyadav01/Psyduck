import React from 'react';

interface LoadingFallbackProps {
  name?: string;
}

// Loading fallback component
export const LoadingFallback: React.FC<LoadingFallbackProps> = React.memo(({ name = 'component' }) => (
  <div className="flex items-center justify-center p-4">
    <div className="flex items-center space-x-2 text-psyduck-primary">
      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-psyduck-primary"></div>
      <span className="text-sm">Loading {name}...</span>
    </div>
  </div>
));

LoadingFallback.displayName = 'LoadingFallback';

// Main app loading screen
export const AppLoadingScreen: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="text-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-psyduck-primary mx-auto mb-4"></div>
      <h1 className="text-xl font-medium text-psyduck-primary">🦆 Starting Psyduck</h1>
      <p className="text-sm text-muted-foreground mt-2">Loading your learning platform...</p>
    </div>
  </div>
);
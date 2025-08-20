import React, { useMemo, Suspense } from 'react';
import { loadAppConfiguration } from './lib/app/configuration';
import { useAppInitialization } from './lib/app/initialization';
import { PerformantErrorBoundary } from './components/app/ErrorBoundary';
import { AppLoadingScreen } from './components/app/LoadingFallback';
import { 
  AppProviders, 
  AppContent, 
  FloatingElementsContainer, 
  RoutePreloader, 
  PerformanceMonitor 
} from './components/app/LazyComponents';

// Load configuration once
const { APP_CONFIG, config, isDevelopment } = loadAppConfiguration();

// Main App component with maximum optimization
export default function App() {
  useAppInitialization(APP_CONFIG, config, isDevelopment);

  // Memoize the entire app structure with stable reference
  const appContent = useMemo(() => (
    <PerformantErrorBoundary>
      <AppProviders>
        <Suspense fallback={<AppLoadingScreen />}>
          <AppContent />
        </Suspense>
        
        {/* Fixed Floating Elements Container - completely isolated from document flow */}
        <Suspense fallback={null}>
          <FloatingElementsContainer />
        </Suspense>
        
        {/* Development Performance Monitor */}
        {process.env.NODE_ENV === 'development' && (
          <Suspense fallback={null}>
            <PerformanceMonitor />
          </Suspense>
        )}
        
        <Suspense fallback={null}>
          <RoutePreloader />
        </Suspense>
      </AppProviders>
    </PerformantErrorBoundary>
  ), []);

  return appContent;
}
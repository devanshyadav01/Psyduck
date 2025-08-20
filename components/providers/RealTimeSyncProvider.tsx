import React, { useMemo } from 'react';

// Safe imports with fallbacks
let useRealTimeSync, config;

try {
  const apiHooks = require('../../hooks/useAPI');
  useRealTimeSync = apiHooks.useRealTimeSync || (() => {
    console.log('Real-time sync disabled - hook not available');
  });
} catch (error) {
  console.warn('RealTimeSyncProvider: Failed to load useAPI hooks');
  useRealTimeSync = () => {
    console.log('Real-time sync disabled - hook not available');
  };
}

try {
  const configModule = require('../../config/environment');
  config = configModule.config || { 
    features: { realTime: false, mockApi: true },
    api: { useMockApi: true }
  };
} catch (error) {
  console.warn('RealTimeSyncProvider: Failed to load config');
  config = { 
    features: { realTime: false, mockApi: true },
    api: { useMockApi: true }
  };
}

interface RealTimeSyncProviderProps {
  children: React.ReactNode;
}

export const RealTimeSyncProvider: React.FC<RealTimeSyncProviderProps> = React.memo(({ children }) => {
  const isRealTimeEnabled = useMemo(() => {
    const hasRealTime = config.features?.realTime || false;
    const isNotMock = !config.api?.useMockApi && !config.features?.mockApi;
    return hasRealTime && isNotMock;
  }, []);
  
  // Only call the hook if real-time is enabled
  if (isRealTimeEnabled) {
    try {
      useRealTimeSync();
    } catch (error) {
      console.warn('RealTimeSyncProvider: Error calling useRealTimeSync:', error);
    }
  }
  
  return <>{children}</>;
});

RealTimeSyncProvider.displayName = 'RealTimeSyncProvider';
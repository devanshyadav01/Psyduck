import React, { useState, useCallback } from 'react';

// Safe import with fallbacks
let config, isDevelopment, APP_CONFIG, Z_INDEX;

try {
  const configModule = require('../../config/environment');
  config = configModule.config || { app: { environment: 'development' }, features: { devTools: true } };
  isDevelopment = configModule.isDevelopment !== undefined ? configModule.isDevelopment : true;
} catch (error) {
  console.warn('DevTools: Failed to load environment config, using defaults');
  config = { app: { environment: 'development' }, features: { devTools: true } };
  isDevelopment = true;
}

try {
  const constantsModule = require('../../lib/constants');
  APP_CONFIG = constantsModule.APP_CONFIG || {
    EMOJI: '🦆',
    NAME: 'Psyduck Learning Platform',
    DESCRIPTION: 'Project-Based Learning with Gamification',
    VERSION: '1.0.0'
  };
  Z_INDEX = constantsModule.Z_INDEX || {
    DEV_TOOLS: 9998,
    TOAST: 9999
  };
} catch (error) {
  console.warn('DevTools: Failed to load constants, using defaults');
  APP_CONFIG = {
    EMOJI: '🦆',
    NAME: 'Psyduck Learning Platform',
    DESCRIPTION: 'Project-Based Learning with Gamification',
    VERSION: '1.0.0'
  };
  Z_INDEX = {
    DEV_TOOLS: 9998,
    TOAST: 9999
  };
}

export const DevTools: React.FC = React.memo(() => {
  const [showInfo, setShowInfo] = useState(false);

  const toggleInfo = useCallback(() => {
    setShowInfo(prev => !prev);
  }, []);

  const closeInfo = useCallback(() => {
    setShowInfo(false);
  }, []);

  // Only show in development mode
  if (!isDevelopment || !config.features?.devTools) {
    return null;
  }

  return (
    <>
      {/* Toggle button */}
      <div 
        className="fixed bottom-4 left-4" 
        style={{ zIndex: Z_INDEX.DEV_TOOLS + 1 }}
      >
        <button
          onClick={toggleInfo}
          className="w-8 h-8 bg-psyduck-primary text-white rounded-full shadow-lg hover:bg-psyduck-primary-hover transition-colors flex items-center justify-center text-xs focus-ring"
          title="Development Info"
          aria-label="Toggle development information"
        >
          {APP_CONFIG.EMOJI}
        </button>
      </div>

      {/* Info panel */}
      {showInfo && (
        <div 
          className="fixed bottom-14 left-4 bg-card border border-border rounded-lg p-3 shadow-xl text-xs max-w-xs"
          style={{ zIndex: Z_INDEX.DEV_TOOLS }}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium text-psyduck-primary">
              {APP_CONFIG.NAME} - Dev Mode
            </span>
            <button
              onClick={closeInfo}
              className="text-muted-foreground hover:text-foreground w-4 h-4 flex items-center justify-center focus-ring"
              aria-label="Close development info"
            >
              ✕
            </button>
          </div>
          <div className="space-y-1 text-muted-foreground">
            <div>
              <span className="font-medium">Environment:</span>{' '}
              <span className="text-foreground">{config.app?.environment || 'development'}</span>
            </div>
            <div>
              <span className="font-medium">Mock API:</span>{' '}
              <span className="text-foreground">{config.api?.useMockApi ? 'Yes' : 'No'}</span>
            </div>
            <div>
              <span className="font-medium">Version:</span>{' '}
              <span className="text-foreground">{config.app?.version || APP_CONFIG.VERSION}</span>
            </div>
            <div>
              <span className="font-medium">Real-time:</span>{' '}
              <span className="text-foreground">{config.features?.realTime ? 'Enabled' : 'Disabled'}</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
});

DevTools.displayName = 'DevTools';
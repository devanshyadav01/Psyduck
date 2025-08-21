import { useEffect } from 'react';
import { performanceUtils } from '../performance/appUtils';
import { setupMonacoEnvironment } from './monaco';

// App initialization hook with performance optimization
export const useAppInitialization = (APP_CONFIG: any, config: any, isDevelopment: boolean) => {
  useEffect(() => {
    performanceUtils.mark('app-initialization-start');

    // Development logging (reduced for performance)
    if (isDevelopment) {
      console.log(`🦆 ${APP_CONFIG.NAME} v${config.app?.version || APP_CONFIG.VERSION}`);
      console.log('🚀 Mode:', config.app?.environment || 'development');
    }

    // Setup Monaco Environment
    const cleanupMonaco = setupMonacoEnvironment();

    // Initialize performance monitoring
    if (process.env.NODE_ENV === 'development') {
      import('../performance/navigation').then(({ monitorBundleSize }) => {
        monitorBundleSize();
      }).catch(() => {});
    }

    performanceUtils.mark('app-initialization-end');
    performanceUtils.measure('app-initialization', 'app-initialization-start', 'app-initialization-end');

    return cleanupMonaco;
  }, [APP_CONFIG.NAME, APP_CONFIG.VERSION, config.app?.environment, config.app?.version, isDevelopment]);
};
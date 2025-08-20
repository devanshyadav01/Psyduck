interface Config {
  api: {
    baseUrl: string;
    wsUrl: string;
    timeout: number;
    useMockApi: boolean;
  };
  app: {
    environment: 'development' | 'staging' | 'production';
    version: string;
    name: string;
  };
  features: {
    devTools: boolean;
    realTime: boolean;
    analytics: boolean;
    codeExecution: boolean;
    socialAuth: boolean;
    mockApi: boolean;
  };
  external: {
    sentry?: {
      dsn: string;
      environment: string;
    };
    analytics?: {
      googleAnalyticsId: string;
    };
  };
  upload: {
    maxFileSize: number;
    allowedTypes: string[];
  };
  monaco: {
    cdnUrl: string;
  };
}

// Default configuration
const defaultConfig: Config = {
  api: {
    baseUrl: 'http://localhost:8000/api',
    wsUrl: 'ws://localhost:8000',
    timeout: 10000,
    useMockApi: true,
  },
  app: {
    environment: 'development',
    version: '1.0.0',
    name: 'Psyduck',
  },
  features: {
    devTools: true,
    realTime: true,
    analytics: false,
    codeExecution: true,
    socialAuth: false,
    mockApi: true,
  },
  external: {},
  upload: {
    maxFileSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  },
  monaco: {
    cdnUrl: 'https://unpkg.com/monaco-editor@latest/min/vs',
  },
};

// Safely get environment variable
function getEnvVar(key: string, fallback: string = ''): string {
  try {
    if (typeof import.meta !== 'undefined' && import.meta.env) {
      return import.meta.env[key] || fallback;
    }
    // Fallback for environments where import.meta.env is not available
    if (typeof process !== 'undefined' && process.env) {
      return process.env[key] || fallback;
    }
    return fallback;
  } catch (error) {
    console.warn(`Failed to access environment variable ${key}:`, error);
    return fallback;
  }
}

// Load configuration from environment variables
function loadConfig(): Config {
  const environment = getEnvVar('VITE_ENVIRONMENT', defaultConfig.app.environment) as any;
  const isDev = environment === 'development';

  return {
    api: {
      baseUrl: getEnvVar('VITE_API_URL', defaultConfig.api.baseUrl),
      wsUrl: getEnvVar('VITE_WS_URL', defaultConfig.api.wsUrl),
      timeout: parseInt(getEnvVar('VITE_API_TIMEOUT', '10000')),
      useMockApi: getEnvVar('VITE_USE_MOCK_API', isDev ? 'true' : 'false') === 'true',
    },
    app: {
      environment,
      version: getEnvVar('VITE_APP_VERSION', defaultConfig.app.version),
      name: getEnvVar('VITE_APP_NAME', defaultConfig.app.name),
    },
    features: {
      devTools: getEnvVar('VITE_ENABLE_DEV_TOOLS', isDev ? 'true' : 'false') === 'true',
      realTime: getEnvVar('VITE_ENABLE_REAL_TIME', 'true') !== 'false',
      analytics: getEnvVar('VITE_ENABLE_ANALYTICS', 'false') === 'true',
      codeExecution: getEnvVar('VITE_ENABLE_CODE_EXECUTION', 'true') !== 'false',
      socialAuth: getEnvVar('VITE_ENABLE_SOCIAL_AUTH', 'false') === 'true',
      mockApi: getEnvVar('VITE_ENABLE_MOCK_API', isDev ? 'true' : 'false') === 'true',
    },
    external: {
      ...(getEnvVar('VITE_SENTRY_DSN') && {
        sentry: {
          dsn: getEnvVar('VITE_SENTRY_DSN'),
          environment: getEnvVar('VITE_ENVIRONMENT', 'development'),
        },
      }),
      ...(getEnvVar('VITE_GA_TRACKING_ID') && {
        analytics: {
          googleAnalyticsId: getEnvVar('VITE_GA_TRACKING_ID'),
        },
      }),
    },
    upload: {
      maxFileSize: parseInt(getEnvVar('VITE_MAX_FILE_SIZE', '5242880')),
      allowedTypes: getEnvVar('VITE_ALLOWED_FILE_TYPES', defaultConfig.upload.allowedTypes.join(',')).split(','),
    },
    monaco: {
      cdnUrl: getEnvVar('VITE_MONACO_CDN', defaultConfig.monaco.cdnUrl),
    },
  };
}

export const config = loadConfig();

// Helper functions
export const isDevelopment = config.app.environment === 'development';
export const isProduction = config.app.environment === 'production';
export const isFeatureEnabled = (feature: keyof Config['features']) => config.features[feature];

// Validation function to ensure required config is present
export function validateConfig(): void {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!config.api.baseUrl) {
    errors.push('API base URL is required');
  }

  if (!config.api.wsUrl && config.features.realTime) {
    warnings.push('WebSocket URL is required when real-time features are enabled');
  }

  if (config.api.useMockApi || config.features.mockApi) {
    console.info('🎭 Mock API is enabled - using simulated backend responses');
  }

  if (warnings.length > 0) {
    console.warn(`Configuration warnings:\n${warnings.join('\n')}`);
  }

  if (errors.length > 0) {
    console.error(`Configuration errors:\n${errors.join('\n')}`);
    // Don't throw in development, just warn
    if (isProduction) {
      throw new Error(`Configuration validation failed:\n${errors.join('\n')}`);
    }
  }
}

// Initialize configuration validation
try {
  validateConfig();
} catch (error) {
  console.error('Configuration validation failed:', error);
}

export default config;
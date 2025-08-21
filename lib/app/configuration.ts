// Safe fallback constants and configuration loading
const FALLBACK_CONFIG = {
  app: { 
    environment: 'development',
    version: '1.0.0'
  },
  api: { 
    useMockApi: true 
  },
  features: { 
    devTools: true,
    realTime: false,
    mockApi: true
  }
};

const FALLBACK_APP_CONFIG = {
  EMOJI: '🦆',
  NAME: 'Psyduck Learning Platform',
  DESCRIPTION: 'Project-Based Learning with Gamification',
  VERSION: '1.0.0'
};

// Safely load configuration
export const loadAppConfiguration = () => {
  let APP_CONFIG = FALLBACK_APP_CONFIG;
  let config = FALLBACK_CONFIG;
  let isDevelopment = true;

  try {
    const constants = require('../../lib/constants');
    if (constants.APP_CONFIG) {
      APP_CONFIG = { ...FALLBACK_APP_CONFIG, ...constants.APP_CONFIG };
    }
  } catch (error) {
    console.warn('App: Using fallback APP_CONFIG');
  }

  try {
    const env = require('../../config/environment');
    if (env.config) {
      config = { ...FALLBACK_CONFIG, ...env.config };
    }
    if (env.isDevelopment !== undefined) {
      isDevelopment = env.isDevelopment;
    }
  } catch (error) {
    console.warn('App: Using fallback environment config');
  }

  return { APP_CONFIG, config, isDevelopment };
};
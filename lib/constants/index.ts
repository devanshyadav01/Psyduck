export const APP_CONFIG = {
  NAME: 'Psyduck Learning Platform',
  VERSION: '1.0.0',
  DESCRIPTION: 'Project-Based Learning with Gamification',
  EMOJI: '🦆',
} as const;

export const QUERY_KEYS = {
  PROJECTS: ['projects'] as const,
  ENROLLED_PROJECTS: ['enrolled-projects'] as const,
  DASHBOARD_PROJECTS: ['dashboard-projects'] as const,
  DASHBOARD_STATS: ['dashboard-stats'] as const,
  USER: (id: string) => ['user', id] as const,
  LEADERBOARD: ['leaderboard'] as const,
  NOTIFICATIONS: ['notifications'] as const,
} as const;

export const ROUTES = {
  HOME: '/',
  DASHBOARD: '/dashboard',
  PROJECTS: '/projects',
  PROJECT_DETAIL: (id: string) => `/projects/${id}`,
  PROJECT_IDE: (id: string) => `/projects/${id}/ide`,
  PROFILE: '/profile',
  LEADERBOARD: '/leaderboard',
  SETTINGS: '/settings',
  AUTH: '/auth',
  LOGIN: '/login',
  REGISTER: '/register',
} as const;

export const STORAGE_KEYS = {
  UI_PREFERENCES: 'psyduck_ui_preferences',
  AUTH_TOKEN: 'psyduck_auth_token',
  USER_DATA: 'psyduck_user_data',
} as const;

export const ANIMATION_DURATION = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
} as const;

export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  '2XL': 1536,
} as const;

export const Z_INDEX = {
  DROPDOWN: 1000,
  STICKY: 1020,
  FIXED: 1030,
  MODAL_BACKDROP: 1040,
  MODAL: 1050,
  POPOVER: 1060,
  TOOLTIP: 1070,
  TOAST: 9999,
  DEV_TOOLS: 9998,
} as const;
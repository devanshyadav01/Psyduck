import { QUERY_KEYS } from '../constants';

/**
 * Utility functions for API operations
 */

export const createQueryKey = {
  projects: () => QUERY_KEYS.PROJECTS,
  enrolledProjects: () => QUERY_KEYS.ENROLLED_PROJECTS,
  dashboardProjects: () => QUERY_KEYS.DASHBOARD_PROJECTS,
  dashboardStats: () => QUERY_KEYS.DASHBOARD_STATS,
  user: (id: string) => QUERY_KEYS.USER(id),
  leaderboard: () => QUERY_KEYS.LEADERBOARD,
  notifications: () => QUERY_KEYS.NOTIFICATIONS,
} as const;

export const isAuthError = (error: unknown): boolean => {
  if (error instanceof Error) {
    return error.message.includes('401') || error.message.includes('403');
  }
  return false;
};

export const shouldRetry = (failureCount: number, error: unknown): boolean => {
  if (isAuthError(error)) {
    return false;
  }
  return failureCount < 2;
};

export const createApiErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  return 'An unexpected error occurred';
};
import { RouteConfig, PageKey } from "../types/routing";

export const ROUTE_CONFIG: Record<PageKey, RouteConfig> = {
  home: {
    key: 'home',
    protected: false,
    showChatbot: false,
  },
  auth: {
    key: 'auth',
    protected: false,
    showChatbot: false,
  },
  dashboard: {
    key: 'dashboard',
    protected: true,
    showChatbot: true,
  },
  projects: {
    key: 'projects',
    protected: true,
    showChatbot: true,
  },
  activity: {
    key: 'activity',
    protected: true,
    showChatbot: true,
  },
  leaderboard: {
    key: 'leaderboard',
    protected: true,
    showChatbot: true,
  },
  search: {
    key: 'search',
    protected: true,
    showChatbot: true,
  },
  profile: {
    key: 'profile',
    protected: true,
    showChatbot: true,
  },
  notifications: {
    key: 'notifications',
    protected: true,
    showChatbot: true,
  },
  settings: {
    key: 'settings',
    protected: true,
    showChatbot: true,
  },
  ide: {
    key: 'ide',
    protected: true,
    showChatbot: false,
  },
};

export const PROTECTED_PAGES: PageKey[] = Object.values(ROUTE_CONFIG)
  .filter(route => route.protected)
  .map(route => route.key);

export const DEFAULT_PAGE: PageKey = 'home';
export const AUTH_PAGE: PageKey = 'auth';
export const DASHBOARD_PAGE: PageKey = 'dashboard';
export const PROJECTS_PAGE: PageKey = 'projects';
export const IDE_PAGE: PageKey = 'ide';
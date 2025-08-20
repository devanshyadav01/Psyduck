export type PageKey = 
  | 'home'
  | 'auth'
  | 'dashboard'
  | 'projects'
  | 'activity'
  | 'leaderboard'
  | 'search'
  | 'profile'
  | 'recruiting-form'
  | 'content-creator'
  | 'notifications'
  | 'settings'
  | 'ide';

export interface RouteConfig {
  key: PageKey;
  protected: boolean;
  showChatbot: boolean;
}

export interface NavigationHandlers {
  onGetStarted: () => void;
  onLogin: () => void;
  onViewProjects: () => void;
  onViewActivity: () => void;
  onStartProject: () => void;
  onCloseIDE: () => void;
}
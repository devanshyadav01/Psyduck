import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { socketService, NotificationData } from '../services/socketService';
import { toast } from 'sonner';

export interface Notification extends NotificationData {
  id: string;
  read: boolean;
}

interface UIState {
  theme: 'light' | 'dark' | 'system';
  sidebarCollapsed: boolean;
  notifications: Notification[];
  unreadCount: number;
  isOnline: boolean;
  loading: Record<string, boolean>;
  searchOpen: boolean;
  commandPaletteOpen: boolean;
}

interface UIContextType extends UIState {
  toggleTheme: () => void;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  addNotification: (notification: Omit<Notification, 'id' | 'read'>) => void;
  removeNotification: (id: string) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  clearAllNotifications: () => void;
  setLoading: (key: string, loading: boolean) => void;
  isLoading: (key: string) => boolean;
  toggleSearch: () => void;
  toggleCommandPalette: () => void;
}

const initialState: UIState = {
  theme: 'system',
  sidebarCollapsed: false,
  notifications: [],
  unreadCount: 0,
  isOnline: navigator.onLine,
  loading: {},
  searchOpen: false,
  commandPaletteOpen: false,
};

const UIContext = createContext<UIContextType | undefined>(undefined);

export function useUI() {
  const context = useContext(UIContext);
  if (context === undefined) {
    throw new Error('useUI must be used within a UIProvider');
  }
  return context;
}

interface UIProviderProps {
  children: React.ReactNode;
}

export function UIProvider({ children }: UIProviderProps) {
  const [state, setState] = useState<UIState>(() => {
    // Load saved preferences from localStorage
    const saved = localStorage.getItem('psyduck_ui_preferences');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return { ...initialState, ...parsed };
      } catch (error) {
        console.error('Failed to parse saved UI preferences:', error);
      }
    }
    return initialState;
  });

  // Memoized preferences for localStorage
  const preferences = useMemo(() => ({
    theme: state.theme,
    sidebarCollapsed: state.sidebarCollapsed,
  }), [state.theme, state.sidebarCollapsed]);

  // Save preferences to localStorage when they change
  useEffect(() => {
    localStorage.setItem('psyduck_ui_preferences', JSON.stringify(preferences));
  }, [preferences]);

  // Apply theme changes to document with improved system theme detection
  useEffect(() => {
    const applyTheme = () => {
      const root = document.documentElement;
      let appliedTheme = state.theme;

      // Handle system theme
      if (state.theme === 'system') {
        appliedTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      }
      
      // Apply theme classes
      root.classList.remove('light', 'dark');
      root.classList.add(appliedTheme);
      
      // Set data attribute for CSS targeting
      root.setAttribute('data-theme', appliedTheme);
      
      // Update meta theme-color for mobile browsers
      const metaThemeColor = document.querySelector('meta[name="theme-color"]');
      if (metaThemeColor) {
        metaThemeColor.setAttribute('content', 
          appliedTheme === 'dark' ? '#212121' : '#ffffff'
        );
      }
    };

    applyTheme();
  }, [state.theme]);

  // Listen for system theme changes with better cleanup
  useEffect(() => {
    if (state.theme !== 'system') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      const root = document.documentElement;
      root.classList.remove('light', 'dark');
      root.classList.add(e.matches ? 'dark' : 'light');
      root.setAttribute('data-theme', e.matches ? 'dark' : 'light');
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [state.theme]);

  // Optimized online/offline status monitoring
  useEffect(() => {
    const handleOnline = () => {
      setState(prev => ({ ...prev, isOnline: true }));
      toast.success('Connection restored');
    };

    const handleOffline = () => {
      setState(prev => ({ ...prev, isOnline: false }));
      toast.error('Connection lost. Some features may not work.');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Setup real-time notification listener with better error handling
  useEffect(() => {
    if (!socketService.isConnected()) return;

    const unsubscribe = socketService.subscribeToNotifications((data: NotificationData) => {
      const notification: Notification = {
        ...data,
        read: false,
      };

      setState(prev => ({
        ...prev,
        notifications: [notification, ...prev.notifications].slice(0, 50), // Keep only latest 50
        unreadCount: prev.unreadCount + 1,
      }));

      // Show toast notification with better action handling
      const toastOptions = {
        description: data.message,
        action: data.actionUrl ? {
          label: 'View',
          onClick: () => {
            try {
              window.location.href = data.actionUrl!;
            } catch (error) {
              console.error('Failed to navigate to action URL:', error);
            }
          },
        } : undefined,
      };

      switch (data.type) {
        case 'success':
          toast.success(data.title, toastOptions);
          break;
        case 'error':
          toast.error(data.title, toastOptions);
          break;
        case 'warning':
          toast.warning(data.title, toastOptions);
          break;
        default:
          toast.info(data.title, toastOptions);
      }
    });

    return unsubscribe;
  }, []);

  // Optimized keyboard shortcuts with better event handling
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Prevent shortcuts when typing in input fields
      if (event.target instanceof HTMLInputElement || 
          event.target instanceof HTMLTextAreaElement ||
          (event.target as HTMLElement)?.isContentEditable) {
        return;
      }

      // Cmd/Ctrl + K for command palette
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault();
        toggleCommandPalette();
      }

      // Cmd/Ctrl + / for search
      if ((event.metaKey || event.ctrlKey) && event.key === '/') {
        event.preventDefault();
        toggleSearch();
      }

      // Escape to close modals
      if (event.key === 'Escape') {
        setState(prev => ({
          ...prev,
          searchOpen: false,
          commandPaletteOpen: false,
        }));
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []); // Remove dependencies to prevent recreation

  // Memoized callback functions to prevent unnecessary re-renders
  const toggleTheme = useCallback(() => {
    setState(prev => ({
      ...prev,
      theme: prev.theme === 'light' ? 'dark' : prev.theme === 'dark' ? 'system' : 'light',
    }));
  }, []);

  const setTheme = useCallback((theme: 'light' | 'dark' | 'system') => {
    setState(prev => ({ ...prev, theme }));
  }, []);

  const toggleSidebar = useCallback(() => {
    setState(prev => ({ ...prev, sidebarCollapsed: !prev.sidebarCollapsed }));
  }, []);

  const setSidebarCollapsed = useCallback((collapsed: boolean) => {
    setState(prev => ({ ...prev, sidebarCollapsed: collapsed }));
  }, []);

  const addNotification = useCallback((notification: Omit<Notification, 'id' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`, // More unique ID
      read: false,
    };

    setState(prev => ({
      ...prev,
      notifications: [newNotification, ...prev.notifications].slice(0, 50),
      unreadCount: prev.unreadCount + 1,
    }));
  }, []);

  const removeNotification = useCallback((id: string) => {
    setState(prev => {
      const notification = prev.notifications.find(n => n.id === id);
      const wasUnread = notification && !notification.read;
      
      return {
        ...prev,
        notifications: prev.notifications.filter(n => n.id !== id),
        unreadCount: wasUnread ? Math.max(0, prev.unreadCount - 1) : prev.unreadCount,
      };
    });
  }, []);

  const markNotificationRead = useCallback((id: string) => {
    setState(prev => {
      const notification = prev.notifications.find(n => n.id === id);
      if (!notification || notification.read) return prev;

      return {
        ...prev,
        notifications: prev.notifications.map(n => 
          n.id === id ? { ...n, read: true } : n
        ),
        unreadCount: Math.max(0, prev.unreadCount - 1),
      };
    });
  }, []);

  const markAllNotificationsRead = useCallback(() => {
    setState(prev => ({
      ...prev,
      notifications: prev.notifications.map(n => ({ ...n, read: true })),
      unreadCount: 0,
    }));
  }, []);

  const clearAllNotifications = useCallback(() => {
    setState(prev => ({
      ...prev,
      notifications: [],
      unreadCount: 0,
    }));
  }, []);

  const setLoading = useCallback((key: string, loading: boolean) => {
    setState(prev => ({
      ...prev,
      loading: {
        ...prev.loading,
        [key]: loading,
      },
    }));
  }, []);

  const isLoading = useCallback((key: string) => {
    return state.loading[key] || false;
  }, [state.loading]);

  const toggleSearch = useCallback(() => {
    setState(prev => ({ ...prev, searchOpen: !prev.searchOpen }));
  }, []);

  const toggleCommandPalette = useCallback(() => {
    setState(prev => ({ ...prev, commandPaletteOpen: !prev.commandPaletteOpen }));
  }, []);

  // Memoize the context value to prevent unnecessary re-renders
  const value = useMemo((): UIContextType => ({
    ...state,
    toggleTheme,
    setTheme,
    toggleSidebar,
    setSidebarCollapsed,
    addNotification,
    removeNotification,
    markNotificationRead,
    markAllNotificationsRead,
    clearAllNotifications,
    setLoading,
    isLoading,
    toggleSearch,
    toggleCommandPalette,
  }), [
    state,
    toggleTheme,
    setTheme,
    toggleSidebar,
    setSidebarCollapsed,
    addNotification,
    removeNotification,
    markNotificationRead,
    markAllNotificationsRead,
    clearAllNotifications,
    setLoading,
    isLoading,
    toggleSearch,
    toggleCommandPalette,
  ]);

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
}
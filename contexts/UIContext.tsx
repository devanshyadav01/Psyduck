import React, { createContext, useContext, useState, useEffect } from 'react';
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

  // Save preferences to localStorage when they change
  useEffect(() => {
    const preferences = {
      theme: state.theme,
      sidebarCollapsed: state.sidebarCollapsed,
    };
    localStorage.setItem('psyduck_ui_preferences', JSON.stringify(preferences));
  }, [state.theme, state.sidebarCollapsed]);

  // Apply theme changes to document
  useEffect(() => {
    const root = document.documentElement;
    const theme = state.theme === 'system' 
      ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
      : state.theme;
    
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [state.theme]);

  // Listen for system theme changes
  useEffect(() => {
    if (state.theme !== 'system') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      const root = document.documentElement;
      if (mediaQuery.matches) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [state.theme]);

  // Monitor online/offline status
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

  // Setup real-time notification listener
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

      // Show toast notification
      const toastOptions = {
        description: data.message,
        action: data.actionUrl ? {
          label: 'View',
          onClick: () => window.location.href = data.actionUrl!,
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

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
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
        if (state.searchOpen) {
          setState(prev => ({ ...prev, searchOpen: false }));
        }
        if (state.commandPaletteOpen) {
          setState(prev => ({ ...prev, commandPaletteOpen: false }));
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [state.searchOpen, state.commandPaletteOpen]);

  const toggleTheme = () => {
    setState(prev => ({
      ...prev,
      theme: prev.theme === 'light' ? 'dark' : prev.theme === 'dark' ? 'system' : 'light',
    }));
  };

  const setTheme = (theme: 'light' | 'dark' | 'system') => {
    setState(prev => ({ ...prev, theme }));
  };

  const toggleSidebar = () => {
    setState(prev => ({ ...prev, sidebarCollapsed: !prev.sidebarCollapsed }));
  };

  const setSidebarCollapsed = (collapsed: boolean) => {
    setState(prev => ({ ...prev, sidebarCollapsed: collapsed }));
  };

  const addNotification = (notification: Omit<Notification, 'id' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      read: false,
    };

    setState(prev => ({
      ...prev,
      notifications: [newNotification, ...prev.notifications].slice(0, 50),
      unreadCount: prev.unreadCount + 1,
    }));
  };

  const removeNotification = (id: string) => {
    setState(prev => {
      const notification = prev.notifications.find(n => n.id === id);
      const wasUnread = notification && !notification.read;
      
      return {
        ...prev,
        notifications: prev.notifications.filter(n => n.id !== id),
        unreadCount: wasUnread ? prev.unreadCount - 1 : prev.unreadCount,
      };
    });
  };

  const markNotificationRead = (id: string) => {
    setState(prev => ({
      ...prev,
      notifications: prev.notifications.map(n => 
        n.id === id ? { ...n, read: true } : n
      ),
      unreadCount: Math.max(0, prev.unreadCount - 1),
    }));
  };

  const markAllNotificationsRead = () => {
    setState(prev => ({
      ...prev,
      notifications: prev.notifications.map(n => ({ ...n, read: true })),
      unreadCount: 0,
    }));
  };

  const clearAllNotifications = () => {
    setState(prev => ({
      ...prev,
      notifications: [],
      unreadCount: 0,
    }));
  };

  const setLoading = (key: string, loading: boolean) => {
    setState(prev => ({
      ...prev,
      loading: {
        ...prev.loading,
        [key]: loading,
      },
    }));
  };

  const isLoading = (key: string) => {
    return state.loading[key] || false;
  };

  const toggleSearch = () => {
    setState(prev => ({ ...prev, searchOpen: !prev.searchOpen }));
  };

  const toggleCommandPalette = () => {
    setState(prev => ({ ...prev, commandPaletteOpen: !prev.commandPaletteOpen }));
  };

  const value: UIContextType = {
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
  };

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
}
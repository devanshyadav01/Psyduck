import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { authService, User } from '../services/authService';
import { socketService } from '../services/socketService';
import { toast } from 'sonner';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

type AuthAction =
  | { type: 'AUTH_START' }
  | { type: 'AUTH_SUCCESS'; payload: User }
  | { type: 'AUTH_ERROR'; payload: string }
  | { type: 'AUTH_LOGOUT' }
  | { type: 'UPDATE_USER'; payload: Partial<User> }
  | { type: 'CLEAR_ERROR' };

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'AUTH_START':
      return { ...state, isLoading: true, error: null };
    
    case 'AUTH_SUCCESS':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
    
    case 'AUTH_ERROR':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
      };
    
    case 'AUTH_LOGOUT':
      return {
        ...initialState,
        isLoading: false,
      };
    
    case 'UPDATE_USER':
      return {
        ...state,
        user: state.user ? { ...state.user, ...action.payload } : null,
      };
    
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    
    default:
      return state;
  }
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (userData: {
    email: string;
    password: string;
    username: string;
    firstName: string;
    lastName: string;
    skillLevel: 'beginner' | 'intermediate' | 'advanced';
  }) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, newPassword: string) => Promise<void>;
  verifyEmail: (token: string) => Promise<void>;
  resendVerification: () => Promise<void>;
  clearError: () => void;
  refreshAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Initialize auth state on app load
  useEffect(() => {
    const initializeAuth = async () => {
      const token = authService.getCurrentUser ? localStorage.getItem('psyduck_token') : null;
      
      if (!token) {
        dispatch({ type: 'AUTH_LOGOUT' });
        return;
      }

      try {
        dispatch({ type: 'AUTH_START' });
        const user = await authService.getCurrentUser();
        dispatch({ type: 'AUTH_SUCCESS', payload: user });
        
        // Connect to Socket.IO for real-time updates
        socketService.connect(token);
        
        // Setup real-time listeners
        setupRealtimeListeners();
        
      } catch (error) {
        console.error('Auth initialization failed:', error);
        localStorage.removeItem('psyduck_token');
        dispatch({ type: 'AUTH_ERROR', payload: 'Authentication failed' });
      }
    };

    initializeAuth();

    // Cleanup on unmount
    return () => {
      socketService.disconnect();
    };
  }, []);

  // Setup real-time event listeners
  const setupRealtimeListeners = () => {
    // XP Updates
    const unsubscribeXP = socketService.subscribeToXPUpdates((data) => {
      if (data.userId === state.user?.id) {
        dispatch({ 
          type: 'UPDATE_USER', 
          payload: { totalXp: data.newTotal } 
        });
        
        if (data.levelUp) {
          toast.success(`🎉 Level Up! You're now level ${Math.floor(Math.sqrt(data.newTotal / 100))}`);
        } else {
          toast.success(`+${data.amount} XP earned from ${data.source.replace('_', ' ')}`);
        }
      }
    });

    // Badge Updates
    const unsubscribeBadges = socketService.subscribeToBadgeUpdates((data) => {
      if (data.userId === state.user?.id) {
        toast.success(`🏆 Badge Unlocked: ${data.badgeName}! (+${data.xpAwarded} XP)`);
      }
    });

    // Store unsubscribe functions for cleanup
    return () => {
      unsubscribeXP();
      unsubscribeBadges();
    };
  };

  const login = async (email: string, password: string) => {
    try {
      dispatch({ type: 'AUTH_START' });
      const response = await authService.login({ email, password });
      dispatch({ type: 'AUTH_SUCCESS', payload: response.user });
      
      // Connect to Socket.IO
      socketService.connect(response.token);
      setupRealtimeListeners();
      
      toast.success(`Welcome back, ${response.user.firstName}! 🦆`);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Login failed';
      dispatch({ type: 'AUTH_ERROR', payload: message });
      toast.error(message);
    }
  };

  const register = async (userData: {
    email: string;
    password: string;
    username: string;
    firstName: string;
    lastName: string;
    skillLevel: 'beginner' | 'intermediate' | 'advanced';
  }) => {
    try {
      dispatch({ type: 'AUTH_START' });
      const response = await authService.register(userData);
      dispatch({ type: 'AUTH_SUCCESS', payload: response.user });
      
      // Connect to Socket.IO
      socketService.connect(response.token);
      setupRealtimeListeners();
      
      toast.success(`Welcome to Psyduck, ${response.user.firstName}! 🎉`);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Registration failed';
      dispatch({ type: 'AUTH_ERROR', payload: message });
      toast.error(message);
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      socketService.disconnect();
      dispatch({ type: 'AUTH_LOGOUT' });
      toast.info('Logged out successfully');
    }
  };

  const updateProfile = async (data: Partial<User>) => {
    try {
      const updatedUser = await authService.updateProfile(data);
      dispatch({ type: 'UPDATE_USER', payload: updatedUser });
      toast.success('Profile updated successfully');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update profile';
      toast.error(message);
      throw error;
    }
  };

  const forgotPassword = async (email: string) => {
    try {
      await authService.forgotPassword({ email });
      toast.success('Password reset email sent! Check your inbox.');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to send reset email';
      toast.error(message);
      throw error;
    }
  };

  const resetPassword = async (token: string, newPassword: string) => {
    try {
      await authService.resetPassword({ token, newPassword });
      toast.success('Password reset successfully! You can now login.');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to reset password';
      toast.error(message);
      throw error;
    }
  };

  const verifyEmail = async (token: string) => {
    try {
      await authService.verifyEmail(token);
      dispatch({ type: 'UPDATE_USER', payload: { emailVerified: true } });
      toast.success('Email verified successfully!');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Email verification failed';
      toast.error(message);
      throw error;
    }
  };

  const resendVerification = async () => {
    try {
      await authService.resendVerification();
      toast.success('Verification email sent! Check your inbox.');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to resend verification';
      toast.error(message);
      throw error;
    }
  };

  const refreshAuth = async () => {
    try {
      const response = await authService.refreshToken();
      dispatch({ type: 'AUTH_SUCCESS', payload: response.user });
    } catch (error) {
      console.error('Token refresh failed:', error);
      logout();
    }
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  // Auto-refresh token before expiration
  useEffect(() => {
    if (!state.isAuthenticated) return;

    const refreshInterval = setInterval(() => {
      refreshAuth();
    }, 14 * 60 * 1000); // Refresh every 14 minutes (token expires in 15 minutes)

    return () => clearInterval(refreshInterval);
  }, [state.isAuthenticated]);

  const value: AuthContextType = {
    ...state,
    login,
    register,
    logout,
    updateProfile,
    forgotPassword,
    resetPassword,
    verifyEmail,
    resendVerification,
    clearError,
    refreshAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
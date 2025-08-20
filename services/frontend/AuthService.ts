// Frontend Authentication Service
import { apiClient, ApiResponse } from '../api/ApiClient';
import { User } from '../../contexts/AuthContext';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  username: string;
  firstName?: string;
  lastName?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken?: string;
}

type BackendAuthResponse = {
  accessToken: string;
  refreshToken?: string;
  user: User;
};

class AuthServiceFrontend {
  private currentUser: User | null = null;
  private authToken: string | null = null;

  // Set authentication state
  setAuth(token: string | null, user: User | null): void {
    this.authToken = token;
    this.currentUser = user;
  }

  // Get current user
  getCurrentUser(): User | null {
    return this.currentUser;
  }

  // Get auth token
  getAuthToken(): string | null {
    return this.authToken;
  }

  // Login user
  async login(email: string, password: string): Promise<ApiResponse<AuthResponse>> {
    try {
      const response = await apiClient.post<AuthResponse | BackendAuthResponse>('/auth/login', {
        email,
        password
      });

      if (response.success && response.data) {
        // Normalize backend shape { accessToken, user } to { token, user }
        const data: any = response.data;
        const token = data.token || data.accessToken;
        const normalized: AuthResponse = {
          token,
          refreshToken: data.refreshToken,
          user: data.user
        };
        this.setAuth(normalized.token, normalized.user);
        return { ...response, data: normalized } as ApiResponse<AuthResponse>;
      }

      return response as ApiResponse<AuthResponse>;
    } catch (error) {
      console.error('AuthService login error:', error);
      return {
        data: null,
        success: false,
        message: error instanceof Error ? error.message : 'Login failed'
      };
    }
  }

  // Register new user
  async register(data: RegisterRequest): Promise<ApiResponse<AuthResponse>> {
    try {
      const response = await apiClient.post<AuthResponse | BackendAuthResponse>('/auth/register', data);

      if (response.success && response.data) {
        const respData: any = response.data;
        const token = respData.token || respData.accessToken;
        const normalized: AuthResponse = {
          token,
          refreshToken: respData.refreshToken,
          user: respData.user
        };
        this.setAuth(normalized.token, normalized.user);
        return { ...response, data: normalized } as ApiResponse<AuthResponse>;
      }

      return response as ApiResponse<AuthResponse>;
    } catch (error) {
      console.error('AuthService register error:', error);
      return {
        data: null,
        success: false,
        message: error instanceof Error ? error.message : 'Registration failed'
      };
    }
  }

  // Logout user
  async logout(): Promise<ApiResponse<null>> {
    try {
      const response = await apiClient.post<null>('/auth/logout');
      
      // Clear auth state regardless of API response
      this.setAuth(null, null);
      
      return response;
    } catch (error) {
      console.error('AuthService logout error:', error);
      // Still clear auth state on error
      this.setAuth(null, null);
      return {
        data: null,
        success: false,
        message: error instanceof Error ? error.message : 'Logout failed'
      };
    }
  }

  // Refresh authentication token
  async refreshToken(refreshToken: string): Promise<ApiResponse<{ token: string; refreshToken: string }>> {
    try {
      const response = await apiClient.post<{ token: string; refreshToken: string }>('/auth/refresh', {
        refreshToken
      });

      if (response.success && response.data) {
        this.authToken = response.data.token;
        apiClient.setAuth(response.data.token, this.currentUser);
      }

      return response;
    } catch (error) {
      console.error('AuthService refresh token error:', error);
      return {
        data: null,
        success: false,
        message: error instanceof Error ? error.message : 'Token refresh failed'
      };
    }
  }

  // Get user profile
  async getUserProfile(): Promise<ApiResponse<User>> {
    try {
      const response = await apiClient.get<User>('/user/profile');

      if (response.success && response.data) {
        this.currentUser = response.data;
      }

      return response;
    } catch (error) {
      console.error('AuthService get profile error:', error);
      return {
        data: null,
        success: false,
        message: error instanceof Error ? error.message : 'Failed to get user profile'
      };
    }
  }

  // Update user profile
  async updateUserProfile(updates: Partial<User>): Promise<ApiResponse<User>> {
    try {
      const response = await apiClient.put<User>('/user/profile', updates);

      if (response.success && response.data) {
        this.currentUser = response.data;
      }

      return response;
    } catch (error) {
      console.error('AuthService update profile error:', error);
      return {
        data: null,
        success: false,
        message: error instanceof Error ? error.message : 'Failed to update user profile'
      };
    }
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return this.authToken !== null && this.currentUser !== null;
  }

  // Check if user has specific permission/role
  hasPermission(permission: string): boolean {
    if (!this.currentUser) return false;
    
    // Implement permission checking logic here
    // For now, return true for premium users for content creation
    if (permission === 'content_creation') {
      return this.currentUser.subscription === 'premium';
    }
    
    return true;
  }

  // Clear authentication data
  clearData(): void {
    this.setAuth(null, null);
  }

  // Validate token without making API call
  isTokenValid(): boolean {
    if (!this.authToken) return false;
    
    try {
      // Basic JWT validation (decode and check expiry)
      const parts = this.authToken.split('.');
      if (parts.length !== 3) return false;
      
      const payload = JSON.parse(atob(parts[1]));
      const now = Date.now() / 1000;
      
      return payload.exp > now;
    } catch {
      return false;
    }
  }
}

// Create singleton instance
export const authServiceFrontend = new AuthServiceFrontend();

// Export for use in components and hooks
export default authServiceFrontend;
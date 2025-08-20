import { apiService } from './apiService';

export interface User {
  id: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  avatarUrl?: string;
  bio?: string;
  totalXp: number;
  currentStreak: number;
  longestStreak: number;
  skillLevel: 'beginner' | 'intermediate' | 'advanced';
  isActive: boolean;
  createdAt: string;
  profile?: UserProfile;
}

export interface UserProfile {
  yearsOfExperience: number;
  currentRole?: string;
  company?: string;
  location?: string;
  portfolioUrl?: string;
  linkedinUrl?: string;
  githubUsername?: string;
  openToOpportunities: boolean;
  profileCompletionPercentage: number;
}

export interface RegisterData {
  email: string;
  password: string;
  username: string;
  firstName: string;
  lastName: string;
  skillLevel: 'beginner' | 'intermediate' | 'advanced';
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordReset {
  token: string;
  newPassword: string;
}

class AuthService {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await apiService.post<AuthResponse>('/auth/login', credentials);
    apiService.setToken(response.token);
    return response;
  }

  async register(userData: RegisterData): Promise<AuthResponse> {
    const response = await apiService.post<AuthResponse>('/auth/register', userData);
    apiService.setToken(response.token);
    return response;
  }

  async refreshToken(): Promise<AuthResponse> {
    const response = await apiService.post<AuthResponse>('/auth/refresh');
    apiService.setToken(response.token);
    return response;
  }

  async logout(): Promise<void> {
    try {
      await apiService.post('/auth/logout');
    } finally {
      apiService.clearToken();
    }
  }

  async getCurrentUser(): Promise<User> {
    return apiService.get<User>('/auth/me');
  }

  async updateProfile(updates: Partial<User>): Promise<User> {
    return apiService.put<User>('/users/me', updates);
  }

  async updateUserProfile(updates: Partial<UserProfile>): Promise<UserProfile> {
    return apiService.put<UserProfile>('/users/me/profile', updates);
  }

  async forgotPassword(data: PasswordResetRequest): Promise<{ message: string }> {
    return apiService.post('/auth/forgot-password', data);
  }

  async resetPassword(data: PasswordReset): Promise<{ message: string }> {
    return apiService.post('/auth/reset-password', data);
  }

  async verifyEmail(token: string): Promise<{ message: string }> {
    return apiService.post('/auth/verify-email', { token });
  }

  async resendVerification(): Promise<{ message: string }> {
    return apiService.post('/auth/resend-verification');
  }

  async uploadAvatar(file: File): Promise<{ avatarUrl: string }> {
    return apiService.upload('/users/me/avatar', file);
  }

  async deleteAccount(): Promise<{ message: string }> {
    return apiService.delete('/users/me');
  }

  // Social auth methods
  async githubAuth(code: string): Promise<AuthResponse> {
    const response = await apiService.post<AuthResponse>('/auth/github/callback', { code });
    apiService.setToken(response.token);
    return response;
  }

  async googleAuth(token: string): Promise<AuthResponse> {
    const response = await apiService.post<AuthResponse>('/auth/google/callback', { token });
    apiService.setToken(response.token);
    return response;
  }

  async linkedinAuth(code: string): Promise<AuthResponse> {
    const response = await apiService.post<AuthResponse>('/auth/linkedin/callback', { code });
    apiService.setToken(response.token);
    return response;
  }
}

export const authService = new AuthService();
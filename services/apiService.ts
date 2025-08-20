import { config } from '../config/environment';
import { mockApiService } from './mockApiService';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  meta?: {
    timestamp: string;
    request_id: string;
    pagination?: {
      page: number;
      per_page: number;
      total: number;
      total_pages: number;
    };
  };
}

interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
    details?: Array<{
      field: string;
      message: string;
    }>;
  };
  meta: {
    timestamp: string;
    request_id: string;
  };
}

class ApiService {
  private baseURL: string;
  private token: string | null;
  private useMockApi: boolean = false;

  constructor() {
    this.baseURL = config.api.baseUrl;
    this.token = localStorage.getItem('psyduck_token');
    this.useMockApi = config.app.environment === 'development';
  }

  private async checkApiAvailability(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseURL}/health`, {
        method: 'GET',
        timeout: 3000,
      } as any);
      return response.ok;
    } catch (error) {
      console.warn('Real API not available, falling back to mock API');
      return false;
    }
  }

  private async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<T> {
    // Check if we should use mock API
    if (this.useMockApi || !(await this.checkApiAvailability())) {
      return this.handleMockRequest<T>(endpoint, options);
    }

    const url = `${this.baseURL}${endpoint}`;
    
    const requestConfig: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        'X-Client-Version': '1.0.0',
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, requestConfig);
      const data = await response.json();
      
      if (!response.ok) {
        const error = data as ApiError;
        throw new Error(error.error?.message || `HTTP ${response.status}`);
      }

      const apiResponse = data as ApiResponse<T>;
      return apiResponse.data;
    } catch (error) {
      console.error('API Request failed:', {
        url,
        error: error instanceof Error ? error.message : error,
        options: requestConfig
      });
      
      // Handle network errors by falling back to mock
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        console.warn('Network error detected, falling back to mock API');
        return this.handleMockRequest<T>(endpoint, options);
      }
      
      throw error;
    }
  }

  private async handleMockRequest<T>(endpoint: string, options: RequestInit): Promise<T> {
    const method = options.method || 'GET';
    const body = options.body ? JSON.parse(options.body as string) : null;

    console.log(`🎭 Mock API: ${method} ${endpoint}`, body || '');

    try {
      // Route to appropriate mock service method
      switch (true) {
        // Auth endpoints
        case endpoint === '/auth/login' && method === 'POST':
          return await mockApiService.login(body) as T;
        
        case endpoint === '/auth/register' && method === 'POST':
          return await mockApiService.register(body) as T;
        
        case endpoint === '/auth/me' && method === 'GET':
          return await mockApiService.getCurrentUser() as T;
        
        case endpoint === '/users/me' && method === 'PUT':
          return await mockApiService.updateProfile(body) as T;

        // Project endpoints
        case endpoint === '/projects' && method === 'GET':
          return await mockApiService.getProjects() as T;
        
        case endpoint.startsWith('/projects/') && !endpoint.includes('/enroll') && method === 'GET':
          const projectId = endpoint.split('/')[2];
          return await mockApiService.getProjectById(projectId) as T;
        
        case endpoint === '/users/me/projects' && method === 'GET':
          return await mockApiService.getUserProjects() as T;
        
        case endpoint.includes('/enroll') && method === 'POST':
          const enrollProjectId = endpoint.split('/')[2];
          return await mockApiService.enrollProject(enrollProjectId) as T;

        // Code execution endpoints
        case endpoint === '/code/execute' && method === 'POST':
          return await mockApiService.executeCode(body) as T;

        // Gamification endpoints
        case endpoint === '/users/me/xp' && method === 'GET':
          return await mockApiService.getXPSummary() as T;
        
        case endpoint === '/users/me/streak' && method === 'GET':
          return await mockApiService.getStreakData() as T;
        
        case endpoint === '/users/me/badges' && method === 'GET':
          return await mockApiService.getUserBadges() as T;
        
        case endpoint === '/users/me/daily-checkin' && method === 'POST':
          return await mockApiService.recordDailyCheckin() as T;
        
        case endpoint === '/leaderboard' && method === 'GET':
          return await mockApiService.getLeaderboard() as T;

        // Default fallback
        default:
          console.warn(`Mock API: Unhandled endpoint ${method} ${endpoint}`);
          // Return empty response for unhandled endpoints
          return {} as T;
      }
    } catch (error) {
      console.error('Mock API Error:', error);
      throw error;
    }
  }

  async get<T>(endpoint: string, params?: Record<string, string>): Promise<T> {
    const searchParams = params ? new URLSearchParams(params) : '';
    const url = searchParams ? `${endpoint}?${searchParams}` : endpoint;
    return this.request<T>(url);
  }

  async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'DELETE',
    });
  }

  async upload<T>(endpoint: string, file: File, additionalData?: Record<string, string>): Promise<T> {
    const formData = new FormData();
    formData.append('file', file);
    
    if (additionalData) {
      Object.entries(additionalData).forEach(([key, value]) => {
        formData.append(key, value);
      });
    }

    return this.request<T>(endpoint, {
      method: 'POST',
      body: formData,
      headers: {
        // Don't set Content-Type for FormData, let browser set it
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
      },
    });
  }

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('psyduck_token', token);
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('psyduck_token');
  }

  getToken(): string | null {
    return this.token;
  }

  // Method to force mock API usage (useful for testing)
  setMockMode(useMock: boolean) {
    this.useMockApi = useMock;
    console.log(`API Service: ${useMock ? 'Mock' : 'Real'} API mode enabled`);
  }
}

export const apiService = new ApiService();
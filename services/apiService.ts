// Legacy API Service - Backwards compatibility layer
// This file provides backwards compatibility for existing components
// while routing calls to the new service architecture

import { serviceManager } from './frontend/ServiceManager';
import { apiClient } from './api/ApiClient';
import { User } from '../contexts/AuthContext';

// Initialize service manager
let isInitialized = false;

const ensureInitialized = async () => {
  if (!isInitialized) {
    await serviceManager.initialize();
    isInitialized = true;
  }
};

// Main API Service that routes to new architecture
class ApiService {
  private useMockApi: boolean = true; // Always use mock API in this environment
  private baseUrl: string = 'https://api.psyduck.dev/v1';
  
  constructor() {
    // Remove process.env dependency
    this.useMockApi = true;
  }

  // Set authentication for the service
  async setAuth(token: string | null, user: User | null) {
    await ensureInitialized();
    serviceManager.setAuth(token, user);
  }

  // Generic HTTP methods for backward compatibility
  async get(endpoint: string, options: any = {}) {
    await ensureInitialized();
    return apiClient.get(endpoint, options);
  }

  async post(endpoint: string, data: any = {}, options: any = {}) {
    await ensureInitialized();
    return apiClient.post(endpoint, data, options);
  }

  async put(endpoint: string, data: any = {}, options: any = {}) {
    await ensureInitialized();
    return apiClient.put(endpoint, data, options);
  }

  async delete(endpoint: string, options: any = {}) {
    await ensureInitialized();
    return apiClient.delete(endpoint, options);
  }

  // Authentication endpoints
  async login(email: string, password: string) {
    await ensureInitialized();
    const authService = serviceManager.getService('auth');
    return authService?.login(email, password) || this.post('/auth/login', { email, password });
  }

  async register(email: string, password: string, username: string) {
    await ensureInitialized();
    const authService = serviceManager.getService('auth');
    return authService?.register({ email, password, username }) || this.post('/auth/register', { email, password, username });
  }

  async logout() {
    await ensureInitialized();
    const authService = serviceManager.getService('auth');
    return authService?.logout() || this.post('/auth/logout');
  }

  // User profile endpoints
  async getUserProfile() {
    await ensureInitialized();
    const authService = serviceManager.getService('auth');
    return authService?.getUserProfile() || this.get('/user/profile');
  }

  async updateUserProfile(updates: Partial<User>) {
    await ensureInitialized();
    const authService = serviceManager.getService('auth');
    return authService?.updateUserProfile(updates) || this.put('/user/profile', updates);
  }

  // Projects endpoints
  async getEnrolledProjects() {
    await ensureInitialized();
    const projectService = serviceManager.getService('projects');
    return projectService?.getEnrolledProjects() || this.get('/projects/enrolled');
  }

  async getAvailableProjects() {
    await ensureInitialized();
    const projectService = serviceManager.getService('projects');
    return projectService?.getAvailableProjects() || this.get('/projects');
  }

  async enrollInProject(projectId: string) {
    await ensureInitialized();
    const projectService = serviceManager.getService('projects');
    return projectService?.enrollInProject(projectId) || this.post('/projects/enroll', { projectId });
  }

  // Gamification endpoints
  async getUserStats() {
    await ensureInitialized();
    const gamificationService = serviceManager.getService('gamification');
    return gamificationService?.getUserStats() || this.get('/user/stats');
  }

  async getLeaderboard(timeframe?: 'weekly' | 'monthly' | 'all-time') {
    await ensureInitialized();
    const gamificationService = serviceManager.getService('gamification');
    return gamificationService?.getLeaderboard(timeframe) || this.get('/gamification/leaderboard', { params: { timeframe } });
  }

  // Notifications endpoints
  async getNotifications() {
    await ensureInitialized();
    const notificationService = serviceManager.getService('notifications');
    return notificationService?.getNotifications() || this.get('/notifications');
  }

  async markNotificationAsRead(notificationId: string) {
    await ensureInitialized();
    const notificationService = serviceManager.getService('notifications');
    return notificationService?.markAsRead(notificationId) || this.post('/notifications/mark-read', { notificationId });
  }

  // Search endpoints
  async searchProjects(query: string, filters?: any) {
    await ensureInitialized();
    const projectService = serviceManager.getService('projects');
    return projectService?.searchProjects(query, filters) || this.get('/search/projects', { params: { q: query, ...filters } });
  }

  // Analytics endpoints
  async getUserAnalytics() {
    await ensureInitialized();
    return this.get('/user/analytics');
  }

  // Code execution
  async executeCode(code: string, language: string, input?: string) {
    await ensureInitialized();
    const codeService = serviceManager.getService('code');
    return codeService?.executeCode({ code, language, input }) || this.post('/code/execute', { code, language, input });
  }

  // Utility methods for common patterns
  async request(method: 'GET' | 'POST' | 'PUT' | 'DELETE', endpoint: string, data?: any, options?: any) {
    await ensureInitialized();
    
    switch (method.toUpperCase()) {
      case 'GET':
        return this.get(endpoint, options);
      case 'POST':
        return this.post(endpoint, data, options);
      case 'PUT':
        return this.put(endpoint, data, options);
      case 'DELETE':
        return this.delete(endpoint, options);
      default:
        throw new Error(`Unsupported HTTP method: ${method}`);
    }
  }

  // Health check for the API
  async healthCheck() {
    await ensureInitialized();
    return apiClient.healthCheck();
  }

  // Get service manager for advanced usage
  getServiceManager() {
    return serviceManager;
  }

  // Get API client for direct access
  getApiClient() {
    return apiClient;
  }
}

// Create singleton instance
export const apiService = new ApiService();

// Export for use in components and contexts
export default apiService;
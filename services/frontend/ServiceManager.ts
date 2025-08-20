// Frontend Service Manager - High-level service coordination
import { apiClient, ApiResponse } from '../api/ApiClient';
import { User } from '../../contexts/AuthContext';

// Service manager for coordinating all frontend services
export class ServiceManager {
  private static instance: ServiceManager;
  private isInitialized = false;
  private services: Map<string, any> = new Map();

  private constructor() {
    // Private constructor for singleton
  }

  static getInstance(): ServiceManager {
    if (!ServiceManager.instance) {
      ServiceManager.instance = new ServiceManager();
    }
    return ServiceManager.instance;
  }

  // Initialize the service manager
  async initialize(): Promise<void> {
    if (this.isInitialized) {
      return;
    }

    try {
      // Initialize API client
      await this.initializeApiClient();

      // Initialize other services
      await this.initializeServices();

      this.isInitialized = true;
      console.log('🦆 ServiceManager initialized successfully');
    } catch (error) {
      console.error('Failed to initialize ServiceManager:', error);
      throw error;
    }
  }

  private async initializeApiClient(): Promise<void> {
    // API client is already initialized as a singleton
    // Perform health check
    try {
      const healthResponse = await apiClient.healthCheck();
      if (!healthResponse.success) {
        console.warn('API health check failed:', healthResponse.message);
      }
    } catch (error) {
      console.warn('API health check error:', error);
    }
  }

  private async initializeServices(): Promise<void> {
    // Initialize individual service modules
    const authService = await import('./AuthService');
    const projectService = await import('./ProjectService');
    const gamificationService = await import('./GamificationService');
    const notificationService = await import('./NotificationService');
    const codeService = await import('./CodeService');

    // Register services
    this.services.set('auth', authService.authServiceFrontend);
    this.services.set('projects', projectService.projectServiceFrontend);
    this.services.set('gamification', gamificationService.gamificationServiceFrontend);
    this.services.set('notifications', notificationService.notificationServiceFrontend);
    this.services.set('code', codeService.codeServiceFrontend);
  }

  // Get a specific service
  getService<T>(serviceName: string): T | null {
    return this.services.get(serviceName) || null;
  }

  // Set authentication for all services
  setAuth(token: string | null, user: User | null): void {
    // Set auth on API client
    apiClient.setAuth(token, user);

    // Notify all services of auth change
    this.services.forEach(service => {
      if (service && typeof service.setAuth === 'function') {
        service.setAuth(token, user);
      }
    });
  }

  // Clear all service data (useful for logout)
  clearAllData(): void {
    this.services.forEach(service => {
      if (service && typeof service.clearData === 'function') {
        service.clearData();
      }
    });
  }

  // Get API client instance
  getApiClient() {
    return apiClient;
  }

  // Check if services are ready
  isReady(): boolean {
    return this.isInitialized;
  }

  // Get configuration information
  getConfig() {
    return {
      isInitialized: this.isInitialized,
      apiConfig: apiClient.getConfig(),
      serviceCount: this.services.size,
      registeredServices: Array.from(this.services.keys())
    };
  }
}

// Export singleton instance
export const serviceManager = ServiceManager.getInstance();

// Export for use in components and contexts
export default serviceManager;
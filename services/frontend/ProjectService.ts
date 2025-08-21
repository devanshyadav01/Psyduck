// Frontend Project Service
import { apiClient, ApiResponse } from '../api/ApiClient';

export interface Project {
  id: string;
  title: string;
  description: string;
  domain: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedHours: number;
  tags: string[];
  prerequisites: string[];
  learningObjectives: string[];
  technologies: string[];
  thumbnailUrl?: string;
  isPartnerProject: boolean;
  xpReward: number;
  createdAt: string;
  updatedAt: string;
}

export interface EnrolledProject extends Project {
  enrollmentDate: string;
  progress: number;
  completedSteps: string[];
  currentStep?: string;
  timeSpent: number;
  lastActivityAt: string;
  status: 'not_started' | 'in_progress' | 'completed' | 'paused';
}

export interface ProjectFilters {
  domain?: string;
  difficulty?: string;
  tags?: string[];
  page?: number;
  limit?: number;
}

class ProjectServiceFrontend {
  private availableProjects: Project[] = [];
  private enrolledProjects: EnrolledProject[] = [];
  private lastFetch: number = 0;
  private cacheDuration: number = 5 * 60 * 1000; // 5 minutes

  // Set authentication (called by service manager)
  setAuth(token: string | null, user: any | null): void {
    // Clear cache when auth changes
    if (!token) {
      this.clearData();
    }
  }

  // Get available projects with caching
  async getAvailableProjects(filters: ProjectFilters = {}): Promise<ApiResponse<Project[]>> {
    try {
      const now = Date.now();
      const isCacheValid = (now - this.lastFetch) < this.cacheDuration && this.availableProjects.length > 0;

      if (isCacheValid && Object.keys(filters).length === 0) {
        return {
          data: this.availableProjects,
          success: true,
          message: 'Projects retrieved from cache'
        };
      }

      const response = await apiClient.get<Project[]>('/projects', { params: filters });

      if (response.success && response.data) {
        this.availableProjects = response.data;
        this.lastFetch = now;
      }

      return response;
    } catch (error) {
      console.error('ProjectService get available projects error:', error);
      return {
        data: null,
        success: false,
        message: error instanceof Error ? error.message : 'Failed to get available projects'
      };
    }
  }

  // Get enrolled projects
  async getEnrolledProjects(): Promise<ApiResponse<EnrolledProject[]>> {
    try {
      const response = await apiClient.get<EnrolledProject[]>('/projects/enrolled');

      if (response.success && response.data) {
        this.enrolledProjects = response.data;
      }

      return response;
    } catch (error) {
      console.error('ProjectService get enrolled projects error:', error);
      return {
        data: null,
        success: false,
        message: error instanceof Error ? error.message : 'Failed to get enrolled projects'
      };
    }
  }

  // Get specific project details
  async getProjectDetails(projectId: string): Promise<ApiResponse<Project>> {
    try {
      // Check cache first
      const cachedProject = this.availableProjects.find(p => p.id === projectId);
      if (cachedProject) {
        return {
          data: cachedProject,
          success: true,
          message: 'Project details retrieved from cache'
        };
      }

      const response = await apiClient.get<Project>(`/projects/${projectId}`);
      return response;
    } catch (error) {
      console.error('ProjectService get project details error:', error);
      return {
        data: null,
        success: false,
        message: error instanceof Error ? error.message : 'Failed to get project details'
      };
    }
  }

  // Enroll in a project
  async enrollInProject(projectId: string): Promise<ApiResponse<EnrolledProject>> {
    try {
      const response = await apiClient.post<EnrolledProject>('/projects/enroll', {
        projectId
      });

      if (response.success && response.data) {
        // Add to enrolled projects cache
        this.enrolledProjects.push(response.data);
      }

      return response;
    } catch (error) {
      console.error('ProjectService enroll in project error:', error);
      return {
        data: null,
        success: false,
        message: error instanceof Error ? error.message : 'Failed to enroll in project'
      };
    }
  }

  // Update project progress
  async updateProjectProgress(
    projectId: string,
    progressData: {
      completedSteps: string[];
      currentStep: string;
      timeSpent: number;
      codeSubmissions?: any[];
    }
  ): Promise<ApiResponse<any>> {
    try {
      const response = await apiClient.put(`/projects/${projectId}/progress`, progressData);

      if (response.success) {
        // Update local cache
        const enrolledProject = this.enrolledProjects.find(p => p.id === projectId);
        if (enrolledProject) {
          enrolledProject.completedSteps = progressData.completedSteps;
          enrolledProject.currentStep = progressData.currentStep;
          enrolledProject.timeSpent = progressData.timeSpent;
          enrolledProject.progress = (progressData.completedSteps.length / 10) * 100; // Assuming 10 steps per project
          enrolledProject.lastActivityAt = new Date().toISOString();
        }
      }

      return response;
    } catch (error) {
      console.error('ProjectService update progress error:', error);
      return {
        data: null,
        success: false,
        message: error instanceof Error ? error.message : 'Failed to update project progress'
      };
    }
  }

  // Search projects
  async searchProjects(query: string, filters: ProjectFilters = {}): Promise<ApiResponse<any>> {
    try {
      const response = await apiClient.get('/search/projects', {
        params: { q: query, ...filters }
      });

      return response;
    } catch (error) {
      console.error('ProjectService search projects error:', error);
      return {
        data: null,
        success: false,
        message: error instanceof Error ? error.message : 'Failed to search projects'
      };
    }
  }

  // Get project categories/domains
  getAvailableDomains(): string[] {
    const domains = new Set<string>();
    this.availableProjects.forEach(project => {
      domains.add(project.domain);
    });
    return Array.from(domains).sort();
  }

  // Get available difficulty levels
  getAvailableDifficulties(): string[] {
    return ['beginner', 'intermediate', 'advanced'];
  }

  // Get all available tags
  getAvailableTags(): string[] {
    const tags = new Set<string>();
    this.availableProjects.forEach(project => {
      project.tags.forEach(tag => tags.add(tag));
    });
    return Array.from(tags).sort();
  }

  // Get projects by domain
  getProjectsByDomain(domain: string): Project[] {
    return this.availableProjects.filter(project => project.domain === domain);
  }

  // Get projects by difficulty
  getProjectsByDifficulty(difficulty: string): Project[] {
    return this.availableProjects.filter(project => project.difficulty === difficulty);
  }

  // Get enrolled project by ID
  getEnrolledProject(projectId: string): EnrolledProject | null {
    return this.enrolledProjects.find(project => project.id === projectId) || null;
  }

  // Check if user is enrolled in project
  isEnrolledInProject(projectId: string): boolean {
    return this.enrolledProjects.some(project => project.id === projectId);
  }

  // Get user's project statistics
  getUserProjectStats() {
    const total = this.enrolledProjects.length;
    const completed = this.enrolledProjects.filter(p => p.status === 'completed').length;
    const inProgress = this.enrolledProjects.filter(p => p.status === 'in_progress').length;
    const notStarted = this.enrolledProjects.filter(p => p.status === 'not_started').length;

    const totalTimeSpent = this.enrolledProjects.reduce((sum, project) => sum + project.timeSpent, 0);
    const averageProgress = total > 0 ? this.enrolledProjects.reduce((sum, project) => sum + project.progress, 0) / total : 0;

    return {
      total,
      completed,
      inProgress,
      notStarted,
      totalTimeSpent,
      averageProgress
    };
  }

  // Clear all cached data
  clearData(): void {
    this.availableProjects = [];
    this.enrolledProjects = [];
    this.lastFetch = 0;
  }

  // Force refresh cache
  async refreshCache(): Promise<void> {
    this.lastFetch = 0;
    await this.getAvailableProjects();
    await this.getEnrolledProjects();
  }
}

// Create singleton instance
export const projectServiceFrontend = new ProjectServiceFrontend();

// Export for use in components and hooks
export default projectServiceFrontend;
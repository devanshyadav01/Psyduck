import { apiService } from './apiService';

export interface Domain {
  id: string;
  name: string;
  slug: string;
  description: string;
  iconUrl?: string;
  colorHex?: string;
  sortOrder: number;
  isActive: boolean;
}

export interface Skill {
  id: string;
  domainId: string;
  name: string;
  slug: string;
  description: string;
  difficultyLevel: 'beginner' | 'intermediate' | 'advanced';
  xpValue: number;
}

export interface Project {
  id: string;
  domainId: string;
  title: string;
  slug: string;
  description: string;
  detailedDescription: string;
  difficultyLevel: 'beginner' | 'intermediate' | 'advanced';
  estimatedHours: number;
  xpReward: number;
  githubTemplateUrl?: string;
  previewImageUrl?: string;
  techStack: string[];
  learningObjectives: string[];
  prerequisites: string[];
  projectType: 'guided' | 'open_ended' | 'assessment';
  isPremium: boolean;
  isActive: boolean;
  domain: Domain;
  milestones: ProjectMilestone[];
  isEnrolled?: boolean;
  userProgress?: UserProjectProgress;
}

export interface ProjectMilestone {
  id: string;
  projectId: string;
  title: string;
  description: string;
  instructions: string;
  sortOrder: number;
  xpReward: number;
  estimatedMinutes: number;
  isRequired: boolean;
  validationCriteria: Record<string, any>;
}

export interface UserProjectProgress {
  id: string;
  userId: string;
  projectId: string;
  status: 'not_started' | 'in_progress' | 'completed' | 'abandoned';
  progressPercentage: number;
  startedAt?: string;
  completedAt?: string;
  totalTimeSpent: number;
  githubRepoUrl?: string;
  finalSubmissionUrl?: string;
  mentorId?: string;
  rating?: number;
  feedback?: string;
}

export interface ProjectFilters {
  domain?: string;
  difficulty?: string;
  search?: string;
  isPremium?: boolean;
  page?: number;
  limit?: number;
}

export interface EnrollmentResponse {
  userProject: UserProjectProgress;
  message: string;
}

export interface ProgressUpdate {
  milestoneId: string;
  status: 'not_started' | 'in_progress' | 'completed' | 'skipped';
  timeSpent: number;
  submissionData?: Record<string, any>;
}

class ProjectService {
  // Domain management
  async getDomains(): Promise<Domain[]> {
    return apiService.get<Domain[]>('/domains');
  }

  async getDomainById(id: string): Promise<Domain> {
    return apiService.get<Domain>(`/domains/${id}`);
  }

  async getDomainSkills(domainId: string): Promise<Skill[]> {
    return apiService.get<Skill[]>(`/domains/${domainId}/skills`);
  }

  // Project catalog
  async getProjects(filters?: ProjectFilters): Promise<Project[]> {
    const params: Record<string, string> = {};
    
    if (filters?.domain) params.domain = filters.domain;
    if (filters?.difficulty) params.difficulty = filters.difficulty;
    if (filters?.search) params.search = filters.search;
    if (filters?.isPremium !== undefined) params.isPremium = filters.isPremium.toString();
    if (filters?.page) params.page = filters.page.toString();
    if (filters?.limit) params.limit = filters.limit.toString();

    return apiService.get<Project[]>('/projects', params);
  }

  async getProjectById(id: string): Promise<Project> {
    return apiService.get<Project>(`/projects/${id}`);
  }

  async getProjectMilestones(projectId: string): Promise<ProjectMilestone[]> {
    return apiService.get<ProjectMilestone[]>(`/projects/${projectId}/milestones`);
  }

  // User project management
  async enrollProject(projectId: string): Promise<EnrollmentResponse> {
    return apiService.post<EnrollmentResponse>(`/projects/${projectId}/enroll`);
  }

  async getUserProjects(): Promise<UserProjectProgress[]> {
    return apiService.get<UserProjectProgress[]>('/users/me/projects');
  }

  async getUserProject(projectId: string): Promise<UserProjectProgress> {
    return apiService.get<UserProjectProgress>(`/users/me/projects/${projectId}`);
  }

  async updateProjectProgress(
    projectId: string, 
    updates: Partial<UserProjectProgress>
  ): Promise<UserProjectProgress> {
    return apiService.put<UserProjectProgress>(`/users/me/projects/${projectId}/progress`, updates);
  }

  // Milestone progress
  async updateMilestoneProgress(
    projectId: string, 
    milestoneId: string, 
    progress: ProgressUpdate
  ): Promise<{ success: boolean; xpAwarded?: number }> {
    return apiService.put(
      `/projects/${projectId}/milestones/${milestoneId}/progress`, 
      progress
    );
  }

  async getMilestoneProgress(
    projectId: string, 
    milestoneId: string
  ): Promise<any> {
    return apiService.get(`/projects/${projectId}/milestones/${milestoneId}/progress`);
  }

  // Project discussions
  async getProjectDiscussions(projectId: string): Promise<any[]> {
    return apiService.get(`/projects/${projectId}/discussions`);
  }

  async createDiscussion(
    projectId: string, 
    data: { title: string; content: string; type: string }
  ): Promise<any> {
    return apiService.post(`/projects/${projectId}/discussions`, data);
  }

  // Project templates and resources
  async getProjectTemplate(projectId: string): Promise<{ templateUrl: string }> {
    return apiService.get(`/projects/${projectId}/template`);
  }

  async getProjectResources(projectId: string): Promise<any[]> {
    return apiService.get(`/projects/${projectId}/resources`);
  }

  // Project ratings and feedback
  async rateProject(
    projectId: string, 
    rating: number, 
    feedback?: string
  ): Promise<{ message: string }> {
    return apiService.post(`/projects/${projectId}/rate`, { rating, feedback });
  }

  async getProjectStats(projectId: string): Promise<{
    completionRate: number;
    averageRating: number;
    totalEnrollments: number;
    averageCompletionTime: number;
  }> {
    return apiService.get(`/projects/${projectId}/stats`);
  }

  // Convenience method to get enrolled projects with full project details
  async getEnrolledProjects(): Promise<Project[]> {
    try {
      // Try to use the dedicated endpoint first
      return await apiService.get<Project[]>('/users/me/projects/enrolled');
    } catch (error) {
      console.warn('Enrolled projects endpoint not available, falling back to manual method');
      
      // Fallback to the manual method
      const userProjects = await this.getUserProjects();
      const projectIds = userProjects.map(up => up.projectId);
      
      if (projectIds.length === 0) {
        return [];
      }
      
      // Fetch full project details for enrolled projects
      const projects = await Promise.all(
        projectIds.map(id => this.getProjectById(id).catch(() => null))
      );
      
      // Filter out any failed requests and add user progress
      return projects
        .filter((project): project is Project => project !== null)
        .map(project => {
          const userProgress = userProjects.find(up => up.projectId === project.id);
          return {
            ...project,
            isEnrolled: true,
            userProgress
          };
        });
    }
  }
}

export const projectService = new ProjectService();
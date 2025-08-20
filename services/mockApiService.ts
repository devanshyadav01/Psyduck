import { User, AuthResponse, RegisterData, LoginCredentials } from './authService';
import { Project, Domain, UserProjectProgress, ProjectMilestone } from './projectService';
import { ExecutionResult, CodeSubmission } from './codeService';
import { XPTransaction, UserBadge, Badge, LeaderboardResponse, StreakData } from './gamificationService';

// Mock data storage
let mockUsers: User[] = [];
let mockProjects: Project[] = [];
let mockUserProjects: UserProjectProgress[] = [];
let mockBadges: Badge[] = [];
let mockUserBadges: UserBadge[] = [];
let mockXPHistory: XPTransaction[] = [];
let currentUser: User | null = null;

// Initialize mock data
function initializeMockData() {
  // Mock domains
  const domains: Domain[] = [
    {
      id: '1',
      name: 'MERN Stack',
      slug: 'mern-stack',
      description: 'Full-stack web development with MongoDB, Express, React, and Node.js',
      colorHex: '#61DAFB',
      sortOrder: 1,
      isActive: true
    },
    {
      id: '2',
      name: 'Data Analytics',
      slug: 'data-analytics',
      description: 'Analyze and visualize data using Python, SQL, and modern tools',
      colorHex: '#FF6B6B',
      sortOrder: 2,
      isActive: true
    },
    {
      id: '3',
      name: 'Mobile Development',
      slug: 'mobile-dev',
      description: 'Build mobile apps with React Native and Flutter',
      colorHex: '#4ECDC4',
      sortOrder: 3,
      isActive: true
    }
  ];

  // Mock projects
  mockProjects = [
    {
      id: '1',
      domainId: '1',
      title: 'Todo App with React',
      slug: 'todo-app-react',
      description: 'Build a complete todo application with React and local storage',
      detailedDescription: 'Learn React fundamentals by building a fully functional todo application. You\'ll implement state management, local storage, and modern React patterns.',
      difficultyLevel: 'beginner',
      estimatedHours: 8,
      xpReward: 500,
      techStack: ['React', 'JavaScript', 'HTML', 'CSS'],
      learningObjectives: ['React state management', 'Local storage API', 'Event handling'],
      prerequisites: ['Basic JavaScript knowledge', 'HTML/CSS fundamentals'],
      projectType: 'guided',
      isPremium: false,
      isActive: true,
      domain: domains[0],
      milestones: [
        {
          id: '1',
          projectId: '1',
          title: 'Setup Project Structure',
          description: 'Initialize React app and setup basic components',
          instructions: 'Create a new React app and setup the basic folder structure',
          sortOrder: 1,
          xpReward: 100,
          estimatedMinutes: 30,
          isRequired: true,
          validationCriteria: {}
        }
      ]
    },
    {
      id: '2',
      domainId: '1',
      title: 'E-commerce Dashboard',
      slug: 'ecommerce-dashboard',
      description: 'Create an admin dashboard for managing an e-commerce store',
      detailedDescription: 'Build a comprehensive admin dashboard with charts, user management, and order tracking.',
      difficultyLevel: 'intermediate',
      estimatedHours: 20,
      xpReward: 1200,
      techStack: ['React', 'Node.js', 'Express', 'MongoDB'],
      learningObjectives: ['Dashboard design', 'Data visualization', 'API integration'],
      prerequisites: ['React basics', 'JavaScript ES6+'],
      projectType: 'guided',
      isPremium: false,
      isActive: true,
      domain: domains[0],
      milestones: []
    },
    {
      id: '3',
      domainId: '2',
      title: 'Data Visualization Dashboard',
      slug: 'data-viz-dashboard',
      description: 'Build interactive charts and graphs using modern visualization libraries',
      detailedDescription: 'Create stunning data visualizations with D3.js and React. Learn to tell stories with data.',
      difficultyLevel: 'advanced',
      estimatedHours: 15,
      xpReward: 1000,
      techStack: ['React', 'D3.js', 'Python', 'Pandas'],
      learningObjectives: ['Data visualization', 'Statistical analysis', 'Interactive charts'],
      prerequisites: ['React knowledge', 'Basic statistics'],
      projectType: 'open_ended',
      isPremium: true,
      isActive: true,
      domain: domains[1],
      milestones: []
    }
  ];

  // Mock badges
  mockBadges = [
    {
      id: '1',
      name: 'First Steps',
      slug: 'first-steps',
      description: 'Complete your first project',
      iconUrl: '/badges/first-steps.svg',
      category: 'completion',
      criteria: { projectsCompleted: 1 },
      xpValue: 100,
      rarity: 'common',
      isActive: true
    },
    {
      id: '2',
      name: 'Code Streak',
      slug: 'code-streak',
      description: 'Maintain a 7-day coding streak',
      iconUrl: '/badges/streak.svg',
      category: 'streak',
      criteria: { streakDays: 7 },
      xpValue: 200,
      rarity: 'rare',
      isActive: true
    },
    {
      id: '3',
      name: 'React Master',
      slug: 'react-master',
      description: 'Complete 5 React projects',
      iconUrl: '/badges/react-master.svg',
      category: 'skill',
      criteria: { reactProjects: 5 },
      xpValue: 500,
      rarity: 'epic',
      isActive: true
    }
  ];
}

// Helper function to generate realistic delays
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Helper function to generate UUIDs
const generateId = () => Math.random().toString(36).substr(2, 9);

class MockApiService {
  constructor() {
    initializeMockData();
  }

  // Auth endpoints
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    await delay(800); // Simulate network delay

    const user = mockUsers.find(u => u.email === credentials.email);
    if (!user) {
      throw new Error('Invalid email or password');
    }

    // In a real app, you'd verify the password hash
    currentUser = user;
    
    return {
      user,
      token: 'mock-jwt-token-' + Date.now(),
      refreshToken: 'mock-refresh-token-' + Date.now()
    };
  }

  async register(userData: RegisterData): Promise<AuthResponse> {
    await delay(1000); // Simulate network delay

    // Check if user already exists
    if (mockUsers.find(u => u.email === userData.email)) {
      throw new Error('User with this email already exists');
    }

    if (mockUsers.find(u => u.username === userData.username)) {
      throw new Error('Username is already taken');
    }

    const newUser: User = {
      id: generateId(),
      email: userData.email,
      username: userData.username,
      firstName: userData.firstName,
      lastName: userData.lastName,
      totalXp: 0,
      currentStreak: 0,
      longestStreak: 0,
      skillLevel: userData.skillLevel,
      isActive: true,
      createdAt: new Date().toISOString(),
      profile: {
        yearsOfExperience: 0,
        openToOpportunities: true,
        profileCompletionPercentage: 60
      }
    };

    mockUsers.push(newUser);
    currentUser = newUser;

    return {
      user: newUser,
      token: 'mock-jwt-token-' + Date.now(),
      refreshToken: 'mock-refresh-token-' + Date.now()
    };
  }

  async getCurrentUser(): Promise<User> {
    await delay(300);
    
    if (!currentUser) {
      throw new Error('Not authenticated');
    }

    return currentUser;
  }

  async updateProfile(updates: Partial<User>): Promise<User> {
    await delay(500);

    if (!currentUser) {
      throw new Error('Not authenticated');
    }

    currentUser = { ...currentUser, ...updates };
    const userIndex = mockUsers.findIndex(u => u.id === currentUser!.id);
    if (userIndex !== -1) {
      mockUsers[userIndex] = currentUser;
    }

    return currentUser;
  }

  // Project endpoints
  async getProjects(): Promise<Project[]> {
    await delay(600);
    return mockProjects;
  }

  async getProjectById(id: string): Promise<Project> {
    await delay(400);
    
    const project = mockProjects.find(p => p.id === id);
    if (!project) {
      throw new Error('Project not found');
    }

    return project;
  }

  async getUserProjects(): Promise<UserProjectProgress[]> {
    await delay(500);

    if (!currentUser) {
      throw new Error('Not authenticated');
    }

    // Generate some mock user projects if none exist
    if (mockUserProjects.length === 0) {
      mockUserProjects = [
        {
          id: generateId(),
          userId: currentUser.id,
          projectId: '1',
          status: 'in_progress',
          progressPercentage: 65,
          startedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          totalTimeSpent: 420 // 7 hours in minutes
        },
        {
          id: generateId(),
          userId: currentUser.id,
          projectId: '2',
          status: 'completed',
          progressPercentage: 100,
          startedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          completedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
          totalTimeSpent: 1200, // 20 hours
          rating: 5
        }
      ];
    }

    return mockUserProjects.filter(up => up.userId === currentUser!.id);
  }

  async enrollProject(projectId: string): Promise<{ userProject: UserProjectProgress; message: string }> {
    await delay(700);

    if (!currentUser) {
      throw new Error('Not authenticated');
    }

    const project = mockProjects.find(p => p.id === projectId);
    if (!project) {
      throw new Error('Project not found');
    }

    // Check if already enrolled
    if (mockUserProjects.find(up => up.userId === currentUser!.id && up.projectId === projectId)) {
      throw new Error('Already enrolled in this project');
    }

    const userProject: UserProjectProgress = {
      id: generateId(),
      userId: currentUser.id,
      projectId,
      status: 'not_started',
      progressPercentage: 0,
      totalTimeSpent: 0
    };

    mockUserProjects.push(userProject);

    return {
      userProject,
      message: 'Successfully enrolled in project!'
    };
  }

  // Code execution endpoints
  async executeCode(submission: CodeSubmission): Promise<ExecutionResult> {
    await delay(1500); // Simulate code execution time

    const mockResults: ExecutionResult[] = [
      {
        id: generateId(),
        success: true,
        output: 'Hello, World!\n42\nProgram completed successfully.',
        executionTime: 145,
        memoryUsage: 2048,
        status: 'completed'
      },
      {
        id: generateId(),
        success: false,
        output: '',
        executionTime: 89,
        memoryUsage: 1024,
        status: 'error',
        errorMessage: 'SyntaxError: Unexpected token \'}\'',
      },
      {
        id: generateId(),
        success: true,
        output: '[1, 2, 3, 4, 5]\nSum: 15\nAverage: 3.0',
        executionTime: 234,
        memoryUsage: 3072,
        status: 'completed',
        testResults: [
          { testCase: 1, passed: true, input: [1, 2, 3], expected: 6, actual: 6 },
          { testCase: 2, passed: true, input: [4, 5], expected: 9, actual: 9 }
        ]
      }
    ];

    // Return a random result for demo purposes
    return mockResults[Math.floor(Math.random() * mockResults.length)];
  }

  // Gamification endpoints
  async getXPSummary(): Promise<{
    totalXp: number;
    level: { currentLevel: number; progressToNextLevel: number };
    weeklyXp: number;
    monthlyXp: number;
    recentTransactions: XPTransaction[];
  }> {
    await delay(400);

    if (!currentUser) {
      throw new Error('Not authenticated');
    }

    const currentLevel = Math.floor(Math.sqrt(currentUser.totalXp / 100));
    const xpForCurrentLevel = currentLevel * currentLevel * 100;
    const xpForNextLevel = (currentLevel + 1) * (currentLevel + 1) * 100;
    const progressToNextLevel = ((currentUser.totalXp - xpForCurrentLevel) / (xpForNextLevel - xpForCurrentLevel)) * 100;

    // Generate recent transactions if none exist
    if (mockXPHistory.length === 0) {
      mockXPHistory = [
        {
          id: generateId(),
          userId: currentUser.id,
          amount: 100,
          sourceType: 'daily_login',
          description: 'Daily check-in bonus',
          createdAt: new Date().toISOString()
        },
        {
          id: generateId(),
          userId: currentUser.id,
          amount: 500,
          sourceType: 'project_completion',
          sourceId: '1',
          description: 'Completed Todo App project',
          createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
        }
      ];
    }

    return {
      totalXp: currentUser.totalXp,
      level: {
        currentLevel,
        progressToNextLevel: Math.max(0, Math.min(100, progressToNextLevel))
      },
      weeklyXp: 750,
      monthlyXp: 2340,
      recentTransactions: mockXPHistory.slice(0, 5)
    };
  }

  async getStreakData(): Promise<StreakData> {
    await delay(300);

    if (!currentUser) {
      throw new Error('Not authenticated');
    }

    return {
      currentStreak: currentUser.currentStreak,
      longestStreak: currentUser.longestStreak,
      lastActivityDate: new Date().toISOString(),
      streakFreezeUsed: 0,
      streakFreezeAvailable: 3
    };
  }

  async getUserBadges(): Promise<UserBadge[]> {
    await delay(500);

    if (!currentUser) {
      throw new Error('Not authenticated');
    }

    // Generate some mock user badges
    if (mockUserBadges.length === 0) {
      mockUserBadges = [
        {
          id: generateId(),
          userId: currentUser.id,
          badge: mockBadges[0],
          earnedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
        }
      ];
    }

    return mockUserBadges.filter(ub => ub.userId === currentUser!.id);
  }

  async recordDailyCheckin(): Promise<{
    xpAwarded: number;
    streakBonus: number;
    newStreak: number;
    message: string;
  }> {
    await delay(600);

    if (!currentUser) {
      throw new Error('Not authenticated');
    }

    const baseXP = 50;
    const streakBonus = Math.min(currentUser.currentStreak * 10, 100);
    const totalXP = baseXP + streakBonus;

    // Update user
    currentUser.totalXp += totalXP;
    currentUser.currentStreak += 1;
    currentUser.longestStreak = Math.max(currentUser.longestStreak, currentUser.currentStreak);

    return {
      xpAwarded: baseXP,
      streakBonus,
      newStreak: currentUser.currentStreak,
      message: 'Daily check-in complete!'
    };
  }

  async getLeaderboard(): Promise<LeaderboardResponse> {
    await delay(700);

    const mockLeaderboard = [
      { rank: 1, user: { id: '1', username: 'codemaster', level: 12 }, xp: 15420, change: 2 },
      { rank: 2, user: { id: '2', username: 'devqueen', level: 11 }, xp: 13890, change: -1 },
      { rank: 3, user: { id: '3', username: 'jswarrior', level: 11 }, xp: 12650, change: 1 },
      { rank: 4, user: { id: '4', username: 'pythonista', level: 10 }, xp: 11230, change: 0 },
      { rank: 5, user: { id: '5', username: 'reactninja', level: 10 }, xp: 10890, change: -2 },
    ];

    return {
      leaderboard: mockLeaderboard,
      userPosition: currentUser ? {
        rank: 42,
        user: { id: currentUser.id, username: currentUser.username, level: Math.floor(Math.sqrt(currentUser.totalXp / 100)) },
        xp: currentUser.totalXp,
        change: 5
      } : undefined,
      meta: {
        totalUsers: 1247,
        lastUpdated: new Date().toISOString()
      }
    };
  }
}

export const mockApiService = new MockApiService();
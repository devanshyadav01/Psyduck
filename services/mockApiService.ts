import { User } from '../contexts/AuthContext';

// Mock API Service for development and testing
class MockApiService {
  private baseUrl = 'https://api.psyduck.dev/v1';
  private authToken: string | null = null;
  private currentUser: User | null = null;
  
  // Initialize with auth state
  setAuth(token: string | null, user: User | null) {
    this.authToken = token;
    this.currentUser = user;
  }

  // Check if user is authenticated
  private isAuthenticated(): boolean {
    return this.authToken !== null && this.currentUser !== null;
  }

  // Simulate API delay
  private async delay(ms: number = 100 + Math.random() * 300): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Generic request handler
  private async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<{ data: T; success: boolean; message?: string }> {
    await this.delay();

    // Handle authentication for protected endpoints
    const protectedEndpoints = [
      '/user/profile',
      '/user/progress',
      '/user/enrolled-projects',
      '/user/statistics',
      '/projects/enrolled',
      '/gamification/stats',
      '/notifications'
    ];

    const isProtectedEndpoint = protectedEndpoints.some(pe => endpoint.includes(pe));
    
    if (isProtectedEndpoint && !this.isAuthenticated()) {
      console.warn(`Mock API: Attempted to access protected endpoint ${endpoint} without authentication`);
      return {
        data: [] as T, // Return empty array instead of null for better UX
        success: false,
        message: 'Authentication required'
      };
    }

    // Log API calls in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`Mock API: ${options.method || 'GET'} ${endpoint}`);
    }

    return {
      data: null as T,
      success: true,
      message: 'Mock response'
    };
  }

  // Authentication endpoints
  async login(email: string, password: string) {
    await this.delay(800);
    
    // Demo credentials
    if (email === 'demo@psyduck.dev' && password === 'demo123') {
      const token = 'mock-jwt-token-demo-user';
      const user: User = {
        id: 'demo-user-123',
        username: 'demo',
        email: 'demo@psyduck.dev',
        displayName: 'Demo User',
        membership: 'premium',
        xp: 2340,
        level: 7,
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=demo',
        joinedAt: new Date('2024-01-15'),
        streak: 12,
        badges: ['first-project', 'week-streak', 'code-reviewer', 'premium-member'],
        projects: {
          completed: 8,
          inProgress: 2,
          total: 10
        }
      };
      
      this.setAuth(token, user);
      
      return {
        data: { token, user },
        success: true,
        message: 'Login successful'
      };
    }

    // Mock successful login for valid-looking credentials
    if (email.includes('@') && password.length >= 6) {
      const token = `mock-jwt-token-${Date.now()}`;
      const user: User = {
        id: `user-${Date.now()}`,
        username: email.split('@')[0],
        email,
        displayName: email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1),
        membership: 'free',
        xp: 0,
        level: 1,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
        joinedAt: new Date(),
        streak: 0,
        badges: ['new-member'],
        projects: {
          completed: 0,
          inProgress: 0,
          total: 0
        }
      };
      
      this.setAuth(token, user);
      
      return {
        data: { token, user },
        success: true,
        message: 'Login successful'
      };
    }

    return {
      data: null,
      success: false,
      message: 'Invalid credentials'
    };
  }

  async register(email: string, password: string, username: string) {
    await this.delay(1000);
    
    const token = `mock-jwt-token-${Date.now()}`;
    const user: User = {
      id: `user-${Date.now()}`,
      username,
      email,
      displayName: username.charAt(0).toUpperCase() + username.slice(1),
      membership: 'free',
      xp: 0,
      level: 1,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
      joinedAt: new Date(),
      streak: 0,
      badges: ['new-member'],
      projects: {
        completed: 0,
        inProgress: 0,
        total: 0
      }
    };
    
    this.setAuth(token, user);
    
    return {
      data: { token, user },
      success: true,
      message: 'Registration successful'
    };
  }

  async logout() {
    await this.delay(200);
    this.setAuth(null, null);
    
    return {
      data: null,
      success: true,
      message: 'Logged out successfully'
    };
  }

  // User profile endpoints
  async getUserProfile() {
    if (!this.isAuthenticated()) {
      return {
        data: null,
        success: false,
        message: 'Not authenticated'
      };
    }

    return {
      data: this.currentUser,
      success: true
    };
  }

  async updateUserProfile(updates: Partial<User>) {
    if (!this.isAuthenticated()) {
      return {
        data: null,
        success: false,
        message: 'Not authenticated'
      };
    }

    // Simulate profile update
    this.currentUser = { ...this.currentUser!, ...updates };
    
    return {
      data: this.currentUser,
      success: true,
      message: 'Profile updated successfully'
    };
  }

  // Projects endpoints
  async getEnrolledProjects() {
    await this.delay();
    
    if (!this.isAuthenticated()) {
      return {
        data: [],
        success: false,
        message: 'Not authenticated'
      };
    }

    // Mock enrolled projects data
    const enrolledProjects = [
      {
        id: 'project-1',
        title: 'Build a Todo App with React',
        description: 'Learn React fundamentals by building a complete todo application with state management, local storage, and modern UI components.',
        domain: 'Web Development',
        difficulty: 'Beginner' as const,
        xpReward: 150,
        estimatedTime: '2-3 hours',
        progress: 75,
        status: 'in-progress',
        enrolledAt: new Date('2024-08-15'),
        lastAccessed: new Date('2024-08-19'),
        technologies: ['React', 'JavaScript', 'HTML', 'CSS', 'Local Storage'],
        prerequisites: ['Basic JavaScript knowledge'],
        featured: false,
        completionRate: 85,
        rating: 4.5,
        studentsCount: 1250
      },
      {
        id: 'project-2', 
        title: 'REST API with Node.js',
        description: 'Build a complete REST API with authentication, database integration, middleware, and proper error handling using Node.js and Express.',
        domain: 'Web Development',
        difficulty: 'Intermediate' as const,
        xpReward: 250,
        estimatedTime: '4-5 hours',
        progress: 30,
        status: 'in-progress',
        enrolledAt: new Date('2024-08-10'),
        lastAccessed: new Date('2024-08-18'),
        technologies: ['Node.js', 'Express', 'MongoDB', 'JWT', 'Bcrypt'],
        prerequisites: ['JavaScript fundamentals', 'Basic understanding of HTTP'],
        featured: true,
        completionRate: 78,
        rating: 4.7,
        studentsCount: 890
      }
    ];

    return {
      data: enrolledProjects,
      success: true
    };
  }

  async getAvailableProjects() {
    await this.delay();
    
    // Generate comprehensive mock projects data
    const baseProjects = [
      {
        id: 'project-3',
        title: 'Machine Learning Image Classifier',
        description: 'Build an image classification model using TensorFlow and Python. Learn data preprocessing, model training, and deployment.',
        domain: 'AI/ML',
        difficulty: 'Advanced' as const,
        xpReward: 400,
        estimatedTime: '6-8 hours',
        technologies: ['Python', 'TensorFlow', 'Keras', 'NumPy', 'Matplotlib'],
        prerequisites: ['Python basics', 'Mathematics knowledge', 'Understanding of ML concepts'],
        featured: true,
        completionRate: 72,
        rating: 4.8,
        studentsCount: 456
      },
      {
        id: 'project-4',
        title: 'Flutter Mobile App',
        description: 'Create a cross-platform mobile app with Flutter. Includes navigation, state management, API integration, and native features.',
        domain: 'Mobile Development',
        difficulty: 'Intermediate' as const,
        xpReward: 300,
        estimatedTime: '5-6 hours',
        technologies: ['Flutter', 'Dart', 'Firebase', 'HTTP', 'Provider'],
        prerequisites: ['Programming basics', 'Object-oriented concepts'],
        featured: false,
        completionRate: 81,
        rating: 4.6,
        studentsCount: 723
      },
      {
        id: 'project-5',
        title: 'Data Visualization Dashboard',
        description: 'Build an interactive data dashboard using Python and modern visualization libraries. Learn to create compelling data stories.',
        domain: 'Data Science',
        difficulty: 'Intermediate' as const,
        xpReward: 275,
        estimatedTime: '4-5 hours',
        technologies: ['Python', 'Pandas', 'Plotly', 'Streamlit', 'NumPy'],
        prerequisites: ['Python basics', 'Basic statistics'],
        featured: false,
        completionRate: 76,
        rating: 4.4,
        studentsCount: 634
      },
      {
        id: 'project-6',
        title: 'DevOps Pipeline with Docker',
        description: 'Learn containerization and CI/CD by building a complete deployment pipeline with Docker, GitHub Actions, and cloud platforms.',
        domain: 'DevOps',
        difficulty: 'Advanced' as const,
        xpReward: 350,
        estimatedTime: '5-7 hours',
        technologies: ['Docker', 'GitHub Actions', 'AWS', 'Linux', 'Bash'],
        prerequisites: ['Command line basics', 'Understanding of web applications'],
        featured: true,
        completionRate: 68,
        rating: 4.7,
        studentsCount: 392
      },
      {
        id: 'project-7',
        title: 'UI/UX Design System',
        description: 'Create a comprehensive design system with components, tokens, and guidelines. Learn modern design principles and tools.',
        domain: 'UI/UX Design',
        difficulty: 'Intermediate' as const,
        xpReward: 200,
        estimatedTime: '3-4 hours',
        technologies: ['Figma', 'Design Tokens', 'Component Libraries', 'Prototyping'],
        prerequisites: ['Basic design knowledge'],
        featured: false,
        completionRate: 89,
        rating: 4.3,
        studentsCount: 567
      },
      {
        id: 'project-8',
        title: 'E-commerce Website with Next.js',
        description: 'Build a full-stack e-commerce platform with user authentication, payment processing, and admin dashboard.',
        domain: 'Web Development',
        difficulty: 'Advanced' as const,
        xpReward: 450,
        estimatedTime: '8-10 hours',
        technologies: ['Next.js', 'React', 'Stripe', 'PostgreSQL', 'Prisma', 'TypeScript'],
        prerequisites: ['React knowledge', 'Database basics'],
        featured: true,
        completionRate: 65,
        rating: 4.9,
        studentsCount: 289
      },
      {
        id: 'project-9',
        title: 'Python Web Scraping Bot',
        description: 'Learn web scraping techniques and automation by building a bot that collects and analyzes web data.',
        domain: 'Data Science',
        difficulty: 'Beginner' as const,
        xpReward: 175,
        estimatedTime: '2-3 hours',
        technologies: ['Python', 'BeautifulSoup', 'Requests', 'Pandas', 'Selenium'],
        prerequisites: ['Python basics'],
        featured: false,
        completionRate: 82,
        rating: 4.2,
        studentsCount: 891
      },
      {
        id: 'project-10',
        title: 'React Native Chat App',
        description: 'Build a real-time chat application with React Native, including user authentication, media sharing, and push notifications.',
        domain: 'Mobile Development',
        difficulty: 'Advanced' as const,
        xpReward: 375,
        estimatedTime: '6-7 hours',
        technologies: ['React Native', 'Socket.io', 'Firebase', 'Redux', 'Expo'],
        prerequisites: ['React knowledge', 'Mobile development basics'],
        featured: false,
        completionRate: 71,
        rating: 4.6,
        studentsCount: 445
      },
      {
        id: 'project-11',
        title: 'JavaScript Game Development',
        description: 'Create an interactive browser game using vanilla JavaScript, canvas API, and modern game development patterns.',
        domain: 'Web Development',
        difficulty: 'Beginner' as const,
        xpReward: 125,
        estimatedTime: '2-3 hours',
        technologies: ['JavaScript', 'HTML5 Canvas', 'CSS3', 'Web APIs'],
        prerequisites: ['Basic JavaScript'],
        featured: false,
        completionRate: 87,
        rating: 4.1,
        studentsCount: 1156
      },
      {
        id: 'project-12',
        title: 'Kubernetes Microservices',
        description: 'Deploy and manage microservices architecture using Kubernetes, including service discovery, load balancing, and monitoring.',
        domain: 'DevOps',
        difficulty: 'Advanced' as const,
        xpReward: 425,
        estimatedTime: '7-9 hours',
        technologies: ['Kubernetes', 'Docker', 'Helm', 'Prometheus', 'Grafana'],
        prerequisites: ['Docker knowledge', 'Understanding of microservices'],
        featured: true,
        completionRate: 58,
        rating: 4.8,
        studentsCount: 234
      }
    ];

    return {
      data: baseProjects,
      success: true
    };
  }

  async enrollInProject(projectId: string) {
    if (!this.isAuthenticated()) {
      return {
        data: null,
        success: false,
        message: 'Not authenticated'
      };
    }

    await this.delay(500);
    
    return {
      data: { projectId, enrolledAt: new Date(), progress: 0 },
      success: true,
      message: 'Successfully enrolled in project'
    };
  }

  // Gamification endpoints
  async getUserStats() {
    if (!this.isAuthenticated()) {
      return {
        data: null,
        success: false,
        message: 'Not authenticated'
      };
    }

    const stats = {
      totalXP: this.currentUser?.xp || 0,
      level: this.currentUser?.level || 1,
      streak: this.currentUser?.streak || 0,
      projectsCompleted: this.currentUser?.projects?.completed || 0,
      badges: this.currentUser?.badges || [],
      weeklyXP: 180,
      monthlyXP: 720,
      rank: 42,
      nextLevelXP: ((this.currentUser?.level || 1) + 1) * 100
    };

    return {
      data: stats,
      success: true
    };
  }

  async getLeaderboard(timeframe: 'weekly' | 'monthly' | 'all-time' = 'weekly') {
    await this.delay();
    
    // Mock leaderboard data
    const leaderboard = Array.from({ length: 20 }, (_, i) => ({
      rank: i + 1,
      userId: `user-${i + 1}`,
      username: `user${i + 1}`,
      displayName: `User ${i + 1}`,
      xp: 1000 - (i * 50),
      level: Math.max(1, 10 - Math.floor(i / 2)),
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=user${i + 1}`,
      streak: Math.max(0, 15 - i),
      isCurrentUser: i === 5 // Mock current user at rank 6
    }));

    return {
      data: leaderboard,
      success: true
    };
  }

  async getBadges() {
    await this.delay();
    const badges = [
      { id: 'first-project', name: 'First Project', description: 'Completed your first project' },
      { id: 'week-streak', name: 'Week Streak', description: '7-day learning streak' },
      { id: 'code-reviewer', name: 'Code Reviewer', description: 'Gave helpful feedback' },
    ];
    return {
      data: badges,
      success: true
    };
  }

  // Notifications endpoints
  async getNotifications() {
    if (!this.isAuthenticated()) {
      return {
        data: [],
        success: false,
        message: 'Not authenticated'
      };
    }

    const notifications = [
      {
        id: 'notif-1',
        type: 'achievement',
        title: 'New Badge Earned!',
        message: 'You earned the "Code Reviewer" badge',
        timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
        read: false,
        actionUrl: '/profile?tab=badges'
      },
      {
        id: 'notif-2',
        type: 'project',
        title: 'Project Update',
        message: 'New hints available for "Build a Todo App"',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
        read: false,
        actionUrl: '/projects/project-1'
      },
      {
        id: 'notif-3',
        type: 'social',
        title: 'Streak Achievement',
        message: 'Congratulations on your 12-day streak!',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
        read: true,
        actionUrl: '/dashboard'
      }
    ];

    return {
      data: notifications,
      success: true
    };
  }

  async markNotificationAsRead(notificationId: string) {
    if (!this.isAuthenticated()) {
      return {
        data: null,
        success: false,
        message: 'Not authenticated'
      };
    }

    await this.delay(200);
    
    return {
      data: { notificationId, read: true },
      success: true
    };
  }

  // Search endpoints
  async searchProjects(query: string, filters?: any) {
    await this.delay();
    
    const allProjects = await this.getAvailableProjects();
    const filteredProjects = allProjects.data?.filter(project => 
      project.title.toLowerCase().includes(query.toLowerCase()) ||
      project.description.toLowerCase().includes(query.toLowerCase()) ||
      project.technologies.some(tech => tech.toLowerCase().includes(query.toLowerCase()))
    ) || [];

    return {
      data: filteredProjects,
      success: true
    };
  }

  // Analytics endpoints (for premium users)
  async getUserAnalytics() {
    if (!this.isAuthenticated()) {
      return {
        data: null,
        success: false,
        message: 'Not authenticated'
      };
    }

    if (this.currentUser?.membership === 'free') {
      return {
        data: null,
        success: false,
        message: 'Premium membership required'
      };
    }

    const analytics = {
      studyTime: {
        today: 45,
        week: 280,
        month: 1200
      },
      codeLines: {
        week: 450,
        month: 1800
      },
      accuracy: {
        overall: 87,
        lastWeek: 92
      },
      preferredLanguages: [
        { language: 'JavaScript', percentage: 45 },
        { language: 'Python', percentage: 30 },
        { language: 'React', percentage: 25 }
      ],
      progressTrend: Array.from({ length: 30 }, (_, i) => ({
        date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000),
        xp: Math.floor(Math.random() * 50) + 10
      }))
    };

    return {
      data: analytics,
      success: true
    };
  }
}

// Create singleton instance
export const mockApiService = new MockApiService();

// Export for use in components
export default mockApiService;
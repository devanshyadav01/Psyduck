# Psyduck Frontend Architecture Documentation

## Table of Contents
1. [Frontend Overview](#frontend-overview)
2. [Architecture Patterns](#architecture-patterns)
3. [Project Structure](#project-structure)
4. [Component Hierarchy](#component-hierarchy)
5. [State Management](#state-management)
6. [Routing System](#routing-system)
7. [Authentication Flow](#authentication-flow)
8. [Core Components](#core-components)
9. [UI Design System](#ui-design-system)
10. [API Integration](#api-integration)
11. [Real-time Features](#real-time-features)
12. [Performance Optimization](#performance-optimization)
13. [Testing Strategy](#testing-strategy)
14. [Development Workflow](#development-workflow)
15. [Deployment & Build Process](#deployment--build-process)

---

## Frontend Overview

### Technology Stack
- **Framework**: React 18+ with TypeScript
- **Styling**: Tailwind CSS v4.0 with custom design tokens
- **UI Components**: ShadCN/UI component library
- **State Management**: React Context + useReducer pattern
- **Routing**: Custom routing system with type safety
- **Code Editor**: Monaco Editor (VS Code editor)
- **Real-time**: Socket.IO client for live updates
- **Build Tool**: Vite for fast development and building
- **Package Manager**: npm/pnpm

### Key Features
- **Responsive Design**: Mobile-first approach with desktop enhancements
- **Dark/Light Mode**: System-aware theme switching
- **Real-time Updates**: Live progress tracking, notifications, and chat
- **Code Execution**: In-browser code editing with syntax highlighting
- **Gamification UI**: Progress bars, XP displays, badge collections
- **Social Features**: User profiles, leaderboards, discussion forums
- **Accessibility**: WCAG 2.1 AA compliant components

---

## Architecture Patterns

### 1. Component-Based Architecture

```
App Component (Root)
├── AuthProvider (Global State)
├── ThemeProvider (UI State)
├── SocketProvider (Real-time State)
└── AppContent (Main Router)
    ├── Header (Navigation)
    ├── Sidebar (Navigation)
    ├── Main Content Area
    │   ├── Page Components
    │   ├── Feature Components
    │   └── Shared Components
    └── Footer (Optional)
```

### 2. State Management Pattern

```typescript
// Global State Structure
interface AppState {
  user: UserState;
  auth: AuthState;
  ui: UIState;
  realtime: RealtimeState;
}

// Context Providers Hierarchy
<AuthProvider>
  <ThemeProvider>
    <SocketProvider>
      <NotificationProvider>
        <AppContent />
      </NotificationProvider>
    </SocketProvider>
  </ThemeProvider>
</AuthProvider>
```

### 3. Data Flow Pattern

```
API Call → Loading State → Success/Error State → UI Update → Cache Update
     ↓
User Action → State Update → Component Re-render → Side Effects
```

---

## Project Structure

### Directory Organization

```
src/
├── components/           # React components
│   ├── ui/              # Base UI components (ShadCN)
│   ├── features/        # Feature-specific components
│   ├── layout/          # Layout components
│   └── shared/          # Shared/common components
├── hooks/               # Custom React hooks
├── contexts/            # React Context providers
├── services/            # API services and utilities
├── types/               # TypeScript type definitions
├── utils/               # Utility functions
├── config/              # Configuration files
├── assets/              # Static assets
└── styles/              # CSS and styling files
```

### Component Categories

#### 1. Layout Components
```typescript
// components/layout/
- Header.tsx          // Main navigation header
- Sidebar.tsx         // Collapsible sidebar navigation  
- Footer.tsx          // Page footer
- Layout.tsx          // Main layout wrapper
- LoadingScreen.tsx   // Full-screen loading component
```

#### 2. Feature Components
```typescript
// components/features/
- Dashboard/          // User dashboard components
- IDE/               // Code editor components
- Projects/          // Project-related components
- Profile/           // User profile components
- Leaderboard/       // Gamification components
- Chat/              // Real-time chat components
```

#### 3. Shared Components
```typescript
// components/shared/
- Modal.tsx          // Reusable modal component
- Toast.tsx          // Notification toasts
- Loading.tsx        // Loading indicators
- ErrorBoundary.tsx  // Error handling
- ProtectedRoute.tsx // Route protection
```

---

## Component Hierarchy

### App Component Structure

```typescript
// App.tsx - Root component
export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

// AppContent.tsx - Main application content
export function AppContent() {
  const { user, isAuthenticated } = useAuth();
  const currentRoute = useRouter();

  if (!isAuthenticated) {
    return <LandingPage />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1">
          <PageRenderer route={currentRoute} />
        </main>
      </div>
      <FloatingChatbot />
      <Notifications />
    </div>
  );
}
```

### Authentication Flow Components

```typescript
// Authentication component hierarchy
Auth
├── LandingPage
│   ├── HeroSection
│   ├── FeaturesList  
│   └── GetStartedCTA
├── Login
│   ├── LoginForm
│   ├── SocialLogin
│   └── ForgotPassword
└── Register
    ├── RegistrationForm
    ├── SkillSelector
    └── EmailVerification
```

### Dashboard Component Structure

```typescript
// Dashboard component breakdown
Dashboard
├── WelcomeHeader
├── StatsOverview
│   ├── XPDisplay
│   ├── StreakCounter
│   └── LevelProgress
├── ActiveProjects
│   └── ProjectCard[]
├── RecentActivity
│   └── ActivityItem[]
├── Achievements
│   └── BadgeDisplay[]
└── QuickActions
    ├── StartNewProject
    ├── ContinueProject
    └── ViewLeaderboard
```

---

## State Management

### Authentication Context

```typescript
// contexts/AuthContext.tsx
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<void>;
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const login = async (email: string, password: string) => {
    dispatch({ type: 'LOGIN_START' });
    try {
      const response = await authService.login(email, password);
      localStorage.setItem('token', response.token);
      dispatch({ type: 'LOGIN_SUCCESS', payload: response.user });
    } catch (error) {
      dispatch({ type: 'LOGIN_ERROR', payload: error.message });
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    dispatch({ type: 'LOGOUT' });
  };

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
```

### UI State Management

```typescript
// contexts/UIContext.tsx
interface UIState {
  theme: 'light' | 'dark' | 'system';
  sidebarCollapsed: boolean;
  activeModal: string | null;
  notifications: Notification[];
  loading: Record<string, boolean>;
}

export const UIProvider: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  const [state, setState] = useState<UIState>(initialUIState);

  const toggleSidebar = () => {
    setState(prev => ({
      ...prev,
      sidebarCollapsed: !prev.sidebarCollapsed
    }));
  };

  const showNotification = (notification: Omit<Notification, 'id'>) => {
    const newNotification = {
      ...notification,
      id: Date.now().toString()
    };
    
    setState(prev => ({
      ...prev,
      notifications: [...prev.notifications, newNotification]
    }));

    // Auto-remove after 5 seconds
    setTimeout(() => {
      removeNotification(newNotification.id);
    }, 5000);
  };

  return (
    <UIContext.Provider value={{ 
      ...state, 
      toggleSidebar, 
      showNotification 
    }}>
      {children}
    </UIContext.Provider>
  );
};
```

### Project State Management

```typescript
// hooks/useProject.ts
export const useProject = (projectId: string) => {
  const [state, setState] = useState<ProjectState>({
    project: null,
    progress: null,
    milestones: [],
    isLoading: true,
    error: null
  });

  const updateProgress = async (milestoneId: string, progress: number) => {
    try {
      setState(prev => ({ ...prev, isLoading: true }));
      
      const response = await projectService.updateMilestoneProgress(
        projectId, 
        milestoneId, 
        progress
      );
      
      setState(prev => ({
        ...prev,
        progress: response.progress,
        isLoading: false
      }));
      
      // Emit real-time update
      socket.emit('progress:update', {
        projectId,
        milestoneId,
        progress
      });
      
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error.message,
        isLoading: false
      }));
    }
  };

  return { ...state, updateProgress };
};
```

---

## Routing System

### Custom Router Implementation

```typescript
// hooks/useRouter.ts
export const useRouter = () => {
  const [currentRoute, setCurrentRoute] = useState<RouteConfig>(
    getCurrentRoute()
  );

  const navigate = (path: string, options?: NavigationOptions) => {
    const route = findRoute(path);
    if (!route) {
      throw new Error(`Route not found: ${path}`);
    }

    // Handle route guards
    if (route.requiresAuth && !isAuthenticated()) {
      setCurrentRoute(routes.login);
      return;
    }

    // Update browser history
    if (options?.replace) {
      window.history.replaceState(null, '', path);
    } else {
      window.history.pushState(null, '', path);
    }

    setCurrentRoute(route);
  };

  const goBack = () => {
    window.history.back();
  };

  useEffect(() => {
    const handlePopState = () => {
      setCurrentRoute(getCurrentRoute());
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  return {
    currentRoute,
    navigate,
    goBack,
    params: parseRouteParams(currentRoute.path),
    query: parseQueryParams()
  };
};
```

### Route Configuration

```typescript
// config/routes.ts
export interface RouteConfig {
  path: string;
  component: React.ComponentType<any>;
  requiresAuth?: boolean;
  roles?: string[];
  title?: string;
  description?: string;
}

export const routes: Record<string, RouteConfig> = {
  home: {
    path: '/',
    component: LandingPage,
    title: 'Psyduck - Learn to Code Through Projects'
  },
  login: {
    path: '/login',
    component: Login,
    title: 'Login - Psyduck'
  },
  dashboard: {
    path: '/dashboard',
    component: Dashboard,
    requiresAuth: true,
    title: 'Dashboard - Psyduck'
  },
  projects: {
    path: '/projects',
    component: ProjectCatalog,
    requiresAuth: true,
    title: 'Projects - Psyduck'
  },
  projectDetail: {
    path: '/projects/:id',
    component: ProjectDetail,
    requiresAuth: true,
    title: 'Project - Psyduck'
  },
  ide: {
    path: '/projects/:projectId/ide',
    component: IDE,
    requiresAuth: true,
    title: 'Code Editor - Psyduck'
  },
  profile: {
    path: '/profile',
    component: Profile,
    requiresAuth: true,
    title: 'Profile - Psyduck'
  },
  leaderboard: {
    path: '/leaderboard',
    component: Leaderboard,
    requiresAuth: true,
    title: 'Leaderboard - Psyduck'
  }
};
```

### Page Renderer Component

```typescript
// components/PageRenderer.tsx
export const PageRenderer: React.FC<{ route: RouteConfig }> = ({ route }) => {
  const Component = route.component;
  const { user } = useAuth();

  // Route guards
  if (route.requiresAuth && !user) {
    return <Navigate to="/login" />;
  }

  if (route.roles && !route.roles.includes(user?.role)) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <ErrorBoundary>
      <Suspense fallback={<LoadingScreen />}>
        <Component />
      </Suspense>
    </ErrorBoundary>
  );
};
```

---

## Authentication Flow

### Login Process

```typescript
// components/Login.tsx
export const Login: React.FC = () => {
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const { navigate } = useRouter();
  const { showNotification } = useUI();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login(credentials.email, credentials.password);
      showNotification({
        type: 'success',
        title: 'Welcome back!',
        message: 'You have successfully logged in.'
      });
      navigate('/dashboard');
    } catch (error) {
      showNotification({
        type: 'error',
        title: 'Login Failed',
        message: error.message
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Sign In</CardTitle>
          <CardDescription>
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={credentials.email}
                onChange={(e) => setCredentials(prev => ({
                  ...prev,
                  email: e.target.value
                }))}
                required
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={credentials.password}
                onChange={(e) => setCredentials(prev => ({
                  ...prev,
                  password: e.target.value
                }))}
                required
              />
            </div>
            <Button 
              type="submit" 
              className="w-full bg-psyduck-primary hover:bg-psyduck-primary-hover"
              disabled={isLoading}
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
```

### Protected Route Component

```typescript
// components/ProtectedRoute.tsx
export const ProtectedRoute: React.FC<{
  children: React.ReactNode;
  roles?: string[];
}> = ({ children, roles }) => {
  const { user, isAuthenticated } = useAuth();
  const { navigate } = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (roles && !roles.includes(user?.role)) {
      navigate('/dashboard');
      return;
    }
  }, [isAuthenticated, user, roles]);

  if (!isAuthenticated) {
    return <LoadingScreen />;
  }

  if (roles && !roles.includes(user?.role)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card>
          <CardContent className="p-6 text-center">
            <h2>Access Denied</h2>
            <p>You don't have permission to access this page.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
};
```

---

## Core Components

### Dashboard Component

```typescript
// components/Dashboard.tsx
export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const data = await dashboardService.getDashboardData();
        setDashboardData(data);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1>Welcome back, {user?.firstName}!</h1>
          <p className="text-muted-foreground">
            Ready to continue your learning journey?
          </p>
        </div>
        <div className="flex items-center gap-4">
          <StreakCounter streak={user?.currentStreak} />
          <XPDisplay xp={user?.totalXp} />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="Projects Completed"
          value={dashboardData?.completedProjects || 0}
          icon={<Trophy className="h-4 w-4" />}
          trend={dashboardData?.projectsTrend}
        />
        <StatCard
          title="Current Level"
          value={calculateLevel(user?.totalXp)}
          icon={<Star className="h-4 w-4" />}
          progress={getLevelProgress(user?.totalXp)}
        />
        <StatCard
          title="Leaderboard Rank"
          value={`#${dashboardData?.leaderboardRank || '---'}`}
          icon={<Medal className="h-4 w-4" />}
        />
        <StatCard
          title="Weekly XP"
          value={dashboardData?.weeklyXP || 0}
          icon={<TrendingUp className="h-4 w-4" />}
          trend={dashboardData?.xpTrend}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Projects */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Continue Learning</CardTitle>
              <CardDescription>
                Pick up where you left off
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ActiveProjectsList projects={dashboardData?.activeProjects} />
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity & Achievements */}
        <div className="space-y-6">
          <RecentActivity activities={dashboardData?.recentActivity} />
          <Achievements badges={dashboardData?.recentBadges} />
        </div>
      </div>
    </div>
  );
};
```

### IDE Component

```typescript
// components/IDE.tsx
export const IDE: React.FC = () => {
  const { projectId } = useParams();
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [output, setOutput] = useState('');
  const [isExecuting, setIsExecuting] = useState(false);
  const monacoRef = useRef<any>(null);

  useEffect(() => {
    // Load Monaco Editor
    const loadMonaco = async () => {
      if (window.monaco) {
        initializeEditor();
        return;
      }

      // Load Monaco from CDN
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/monaco-editor@latest/min/vs/loader.js';
      script.onload = () => {
        window.require.config({ 
          paths: { vs: 'https://unpkg.com/monaco-editor@latest/min/vs' }
        });
        window.require(['vs/editor/editor.main'], initializeEditor);
      };
      document.head.appendChild(script);
    };

    loadMonaco();
  }, []);

  const initializeEditor = () => {
    if (monacoRef.current) {
      const editor = window.monaco.editor.create(monacoRef.current, {
        value: code,
        language: language,
        theme: 'vs-dark',
        automaticLayout: true,
        minimap: { enabled: false },
        fontSize: 14,
        wordWrap: 'on',
        suggestOnTriggerCharacters: true,
        quickSuggestions: true,
      });

      editor.onDidChangeModelContent(() => {
        setCode(editor.getValue());
      });

      return () => editor.dispose();
    }
  };

  const executeCode = async () => {
    setIsExecuting(true);
    setOutput('Executing...');

    try {
      const response = await codeService.executeCode({
        projectId,
        code,
        language,
        input: ''
      });

      setOutput(response.output);
      
      // Show success notification
      if (response.success) {
        showNotification({
          type: 'success',
          title: 'Code Executed Successfully',
          message: `Execution time: ${response.executionTime}ms`
        });
      }
    } catch (error) {
      setOutput(`Error: ${error.message}`);
      showNotification({
        type: 'error',
        title: 'Execution Failed',
        message: error.message
      });
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <div className="h-screen flex flex-col">
      {/* IDE Header */}
      <div className="bg-card border-b p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="javascript">JavaScript</SelectItem>
              <SelectItem value="python">Python</SelectItem>
              <SelectItem value="java">Java</SelectItem>
              <SelectItem value="cpp">C++</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            onClick={executeCode}
            disabled={isExecuting}
            className="bg-psyduck-success hover:bg-psyduck-success/90"
          >
            <Play className="h-4 w-4 mr-2" />
            {isExecuting ? 'Running...' : 'Run Code'}
          </Button>
        </div>
      </div>

      {/* IDE Content */}
      <div className="flex-1 flex">
        {/* Code Editor */}
        <div className="flex-1 border-r">
          <div 
            ref={monacoRef} 
            className="h-full w-full"
          />
        </div>

        {/* Output Panel */}
        <div className="w-1/3 bg-card">
          <div className="p-4 border-b">
            <h3>Output</h3>
          </div>
          <div className="p-4">
            <pre className="text-sm whitespace-pre-wrap">
              {output || 'Run your code to see the output here...'}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
```

### Project Catalog Component

```typescript
// components/ProjectCatalog.tsx
export const ProjectCatalog: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filters, setFilters] = useState({
    domain: '',
    difficulty: '',
    search: ''
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await projectService.getProjects(filters);
        setProjects(data);
      } catch (error) {
        console.error('Failed to fetch projects:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, [filters]);

  const handleEnrollProject = async (projectId: string) => {
    try {
      await projectService.enrollProject(projectId);
      showNotification({
        type: 'success',
        title: 'Enrolled Successfully',
        message: 'You can now start working on this project!'
      });
      // Refresh projects list
      setProjects(prev => 
        prev.map(p => 
          p.id === projectId 
            ? { ...p, isEnrolled: true }
            : p
        )
      );
    } catch (error) {
      showNotification({
        type: 'error',
        title: 'Enrollment Failed',
        message: error.message
      });
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1>Project Catalog</h1>
          <p className="text-muted-foreground">
            Choose a project to start your learning journey
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <Input
          placeholder="Search projects..."
          value={filters.search}
          onChange={(e) => setFilters(prev => ({
            ...prev,
            search: e.target.value
          }))}
          className="max-w-sm"
        />
        
        <Select 
          value={filters.domain} 
          onValueChange={(value) => setFilters(prev => ({
            ...prev,
            domain: value
          }))}
        >
          <SelectTrigger className="w-48">
            <SelectValue placeholder="All Domains" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Domains</SelectItem>
            <SelectItem value="mern">MERN Stack</SelectItem>
            <SelectItem value="mobile">Mobile Development</SelectItem>
            <SelectItem value="ai-ml">AI/ML</SelectItem>
            <SelectItem value="data-analytics">Data Analytics</SelectItem>
          </SelectContent>
        </Select>

        <Select 
          value={filters.difficulty} 
          onValueChange={(value) => setFilters(prev => ({
            ...prev,
            difficulty: value
          }))}
        >
          <SelectTrigger className="w-32">
            <SelectValue placeholder="All Levels" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Levels</SelectItem>
            <SelectItem value="beginner">Beginner</SelectItem>
            <SelectItem value="intermediate">Intermediate</SelectItem>
            <SelectItem value="advanced">Advanced</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Projects Grid */}
      {isLoading ? (
        <ProjectsSkeleton />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map(project => (
            <ProjectCard
              key={project.id}
              project={project}
              onEnroll={handleEnrollProject}
            />
          ))}
        </div>
      )}
    </div>
  );
};
```

---

## UI Design System

### Design Tokens

```typescript
// types/theme.ts
export interface Theme {
  colors: {
    primary: {
      50: string;
      100: string;
      500: string;    // Main brand color
      600: string;
      900: string;
    };
    success: {
      50: string;
      500: string;    // Success actions
      900: string;
    };
    background: {
      primary: string;
      secondary: string;
      card: string;
    };
    text: {
      primary: string;
      secondary: string;
      muted: string;
    };
  };
  spacing: {
    xs: string;       // 4px
    sm: string;       // 8px
    md: string;       // 16px
    lg: string;       // 24px
    xl: string;       // 32px
    '2xl': string;    // 48px
  };
  borderRadius: {
    sm: string;       // 4px
    md: string;       // 8px
    lg: string;       // 12px
    xl: string;       // 16px
  };
  typography: {
    h1: TextStyle;
    h2: TextStyle;
    h3: TextStyle;
    body: TextStyle;
    caption: TextStyle;
  };
}
```

### Component Variants

```typescript
// Design system component variants
export const buttonVariants = {
  primary: "bg-psyduck-primary hover:bg-psyduck-primary-hover text-white",
  secondary: "bg-secondary hover:bg-secondary/80",
  success: "bg-psyduck-success hover:bg-psyduck-success/90 text-white",
  outline: "border border-input bg-background hover:bg-accent",
  ghost: "hover:bg-accent hover:text-accent-foreground",
};

export const cardVariants = {
  default: "bg-card text-card-foreground shadow-sm border",
  elevated: "bg-card text-card-foreground shadow-md border",
  outline: "border-2 bg-transparent",
  success: "bg-psyduck-soft border-psyduck-success/20",
};

export const badgeVariants = {
  default: "bg-primary text-primary-foreground",
  secondary: "bg-secondary text-secondary-foreground",
  success: "bg-psyduck-success text-white",
  warning: "bg-yellow-500 text-white",
  destructive: "bg-destructive text-destructive-foreground",
};
```

### Custom Components

```typescript
// components/ui/XPDisplay.tsx
export const XPDisplay: React.FC<{ xp: number; showLevel?: boolean }> = ({ 
  xp, 
  showLevel = true 
}) => {
  const level = calculateLevel(xp);
  const nextLevelXP = getXPForLevel(level + 1);
  const currentLevelXP = getXPForLevel(level);
  const progress = ((xp - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100;

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1">
        <Star className="h-4 w-4 text-psyduck-primary" />
        <span className="font-medium">{xp.toLocaleString()} XP</span>
      </div>
      
      {showLevel && (
        <div className="flex items-center gap-2">
          <Badge variant="secondary">Level {level}</Badge>
          <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-psyduck-primary transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

// components/ui/StreakCounter.tsx
export const StreakCounter: React.FC<{ streak: number }> = ({ streak }) => {
  return (
    <div className="flex items-center gap-2 px-3 py-1 bg-orange-50 rounded-full">
      <Flame className="h-4 w-4 text-orange-500" />
      <span className="font-medium text-orange-700">
        {streak} day streak
      </span>
    </div>
  );
};

// components/ui/ProgressRing.tsx
export const ProgressRing: React.FC<{
  progress: number;
  size?: number;
  strokeWidth?: number;
  children?: React.ReactNode;
}> = ({ 
  progress, 
  size = 120, 
  strokeWidth = 8, 
  children 
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative inline-block">
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          className="text-gray-200"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="text-psyduck-primary transition-all duration-300"
        />
      </svg>
      
      {children && (
        <div className="absolute inset-0 flex items-center justify-center">
          {children}
        </div>
      )}
    </div>
  );
};
```

---

## API Integration

### API Service Layer

```typescript
// services/apiService.ts
class ApiService {
  private baseURL: string;
  private token: string | null;

  constructor() {
    this.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';
    this.token = localStorage.getItem('token');
  }

  private async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API Request failed:', error);
      throw error;
    }
  }

  get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint);
  }

  post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  put<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'DELETE',
    });
  }

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('token', token);
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('token');
  }
}

export const apiService = new ApiService();
```

### Specific Service Implementations

```typescript
// services/authService.ts
export const authService = {
  async login(email: string, password: string): Promise<AuthResponse> {
    return apiService.post('/auth/login', { email, password });
  },

  async register(userData: RegisterData): Promise<AuthResponse> {
    return apiService.post('/auth/register', userData);
  },

  async refreshToken(): Promise<AuthResponse> {
    return apiService.post('/auth/refresh');
  },

  async logout(): Promise<void> {
    await apiService.post('/auth/logout');
    apiService.clearToken();
  },

  async getCurrentUser(): Promise<User> {
    return apiService.get('/auth/me');
  }
};

// services/projectService.ts
export const projectService = {
  async getProjects(filters?: ProjectFilters): Promise<Project[]> {
    const queryParams = new URLSearchParams(filters as any).toString();
    return apiService.get(`/projects?${queryParams}`);
  },

  async getProjectById(id: string): Promise<ProjectDetail> {
    return apiService.get(`/projects/${id}`);
  },

  async enrollProject(id: string): Promise<void> {
    return apiService.post(`/projects/${id}/enroll`);
  },

  async updateProgress(
    projectId: string, 
    milestoneId: string, 
    progress: number
  ): Promise<ProgressUpdate> {
    return apiService.put(`/projects/${projectId}/milestones/${milestoneId}/progress`, {
      progress
    });
  }
};

// services/codeService.ts
export const codeService = {
  async executeCode(submission: CodeSubmission): Promise<ExecutionResult> {
    return apiService.post('/code/execute', submission);
  },

  async saveCode(
    projectId: string, 
    milestoneId: string, 
    code: string
  ): Promise<void> {
    return apiService.post('/code/save', {
      projectId,
      milestoneId,
      code
    });
  },

  async getCodeHistory(projectId: string): Promise<CodeHistory[]> {
    return apiService.get(`/code/history/${projectId}`);
  }
};
```

### React Query Integration

```typescript
// hooks/useApiQuery.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export const useProjects = (filters?: ProjectFilters) => {
  return useQuery({
    queryKey: ['projects', filters],
    queryFn: () => projectService.getProjects(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useProject = (id: string) => {
  return useQuery({
    queryKey: ['project', id],
    queryFn: () => projectService.getProjectById(id),
    enabled: !!id,
  });
};

export const useEnrollProject = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: projectService.enrollProject,
    onSuccess: () => {
      // Invalidate and refetch projects
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
};

export const useExecuteCode = () => {
  return useMutation({
    mutationFn: codeService.executeCode,
    onSuccess: (data) => {
      // Handle successful execution
      console.log('Code executed successfully:', data);
    },
    onError: (error) => {
      // Handle execution error
      console.error('Code execution failed:', error);
    }
  });
};
```

---

## Real-time Features

### Socket.IO Integration

```typescript
// services/socketService.ts
import { io, Socket } from 'socket.io-client';

class SocketService {
  private socket: Socket | null = null;
  private token: string | null = null;

  connect(token: string) {
    this.token = token;
    
    this.socket = io(process.env.REACT_APP_WS_URL || 'ws://localhost:3000', {
      auth: { token },
      transports: ['websocket'],
    });

    this.setupEventListeners();
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  private setupEventListeners() {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('Connected to server');
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from server');
    });

    this.socket.on('error', (error) => {
      console.error('Socket error:', error);
    });
  }

  // Progress Updates
  subscribeToProgressUpdates(callback: (data: ProgressUpdate) => void) {
    this.socket?.on('progress:updated', callback);
  }

  unsubscribeFromProgressUpdates(callback: (data: ProgressUpdate) => void) {
    this.socket?.off('progress:updated', callback);
  }

  // XP Updates
  subscribeToXPUpdates(callback: (data: XPUpdate) => void) {
    this.socket?.on('xp:updated', callback);
  }

  // Badge Awards
  subscribeToBadgeUpdates(callback: (data: BadgeUpdate) => void) {
    this.socket?.on('badge:awarded', callback);
  }

  // Real-time Notifications
  subscribeToNotifications(callback: (data: Notification) => void) {
    this.socket?.on('notification:new', callback);
  }

  // Chat Messages
  subscribeToChat(projectId: string, callback: (data: ChatMessage) => void) {
    this.socket?.emit('chat:join_project', { projectId });
    this.socket?.on('chat:new_message', callback);
  }

  sendChatMessage(projectId: string, message: string) {
    this.socket?.emit('chat:send_message', {
      projectId,
      message
    });
  }
}

export const socketService = new SocketService();
```

### Real-time Hooks

```typescript
// hooks/useSocket.ts
export const useSocket = () => {
  const { user } = useAuth();

  useEffect(() => {
    if (user?.token) {
      socketService.connect(user.token);
    }

    return () => {
      socketService.disconnect();
    };
  }, [user?.token]);

  return socketService;
};

// hooks/useRealTimeProgress.ts
export const useRealTimeProgress = (projectId: string) => {
  const [progress, setProgress] = useState<ProjectProgress | null>(null);

  useEffect(() => {
    const handleProgressUpdate = (data: ProgressUpdate) => {
      if (data.projectId === projectId) {
        setProgress(data.progress);
      }
    };

    socketService.subscribeToProgressUpdates(handleProgressUpdate);

    return () => {
      socketService.unsubscribeFromProgressUpdates(handleProgressUpdate);
    };
  }, [projectId]);

  return progress;
};

// hooks/useRealTimeNotifications.ts
export const useRealTimeNotifications = () => {
  const { showNotification } = useUI();

  useEffect(() => {
    const handleNotification = (notification: Notification) => {
      showNotification(notification);
      
      // Play sound for important notifications
      if (notification.priority === 'high') {
        playNotificationSound();
      }
    };

    socketService.subscribeToNotifications(handleNotification);

    return () => {
      socketService.unsubscribeFromNotifications(handleNotification);
    };
  }, [showNotification]);
};
```

---

## Performance Optimization

### Code Splitting & Lazy Loading

```typescript
// Lazy loading components
import { lazy, Suspense } from 'react';

const Dashboard = lazy(() => import('./components/Dashboard'));
const IDE = lazy(() => import('./components/IDE'));
const ProjectCatalog = lazy(() => import('./components/ProjectCatalog'));
const Profile = lazy(() => import('./components/Profile'));
const Leaderboard = lazy(() => import('./components/Leaderboard'));

// Route-based code splitting
export const AppContent: React.FC = () => {
  const { currentRoute } = useRouter();

  const renderPage = () => {
    const Component = currentRoute.component;
    
    return (
      <Suspense fallback={<PageLoadingSkeleton />}>
        <Component />
      </Suspense>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1">
          {renderPage()}
        </main>
      </div>
    </div>
  );
};
```

### Memoization & Optimization

```typescript
// Optimized component with memoization
export const ProjectCard = React.memo<{
  project: Project;
  onEnroll: (id: string) => void;
}>(({ project, onEnroll }) => {
  const handleEnroll = useCallback(() => {
    onEnroll(project.id);
  }, [project.id, onEnroll]);

  const difficultyColor = useMemo(() => {
    switch (project.difficulty) {
      case 'beginner': return 'text-green-600';
      case 'intermediate': return 'text-yellow-600';
      case 'advanced': return 'text-red-600';
      default: return 'text-gray-600';
    }
  }, [project.difficulty]);

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex items-center justify-between">
          <Badge variant="secondary" className={difficultyColor}>
            {project.difficulty}
          </Badge>
          <span className="text-sm text-muted-foreground">
            {project.estimatedHours}h
          </span>
        </div>
        <CardTitle className="line-clamp-2">
          {project.title}
        </CardTitle>
        <CardDescription className="line-clamp-3">
          {project.description}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="flex-1">
        <div className="space-y-2">
          <div className="flex flex-wrap gap-1">
            {project.techStack?.slice(0, 3).map(tech => (
              <Badge key={tech} variant="outline" className="text-xs">
                {tech}
              </Badge>
            ))}
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Star className="h-4 w-4" />
            <span>{project.xpReward} XP</span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter>
        <Button 
          onClick={handleEnroll}
          disabled={project.isEnrolled}
          className="w-full"
        >
          {project.isEnrolled ? 'Enrolled' : 'Start Project'}
        </Button>
      </CardFooter>
    </Card>
  );
});
```

### Virtual Scrolling

```typescript
// Virtual list for large datasets
import { FixedSizeList as List } from 'react-window';

export const VirtualizedLeaderboard: React.FC<{
  users: LeaderboardUser[];
}> = ({ users }) => {
  const Row = ({ index, style }: { index: number; style: React.CSSProperties }) => {
    const user = users[index];
    
    return (
      <div style={style} className="flex items-center p-4 border-b">
        <div className="flex items-center gap-4 w-full">
          <span className="text-2xl font-bold text-muted-foreground w-12">
            #{index + 1}
          </span>
          <Avatar className="h-10 w-10">
            <AvatarImage src={user.avatarUrl} />
            <AvatarFallback>{user.username[0]}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <p className="font-medium">{user.username}</p>
            <p className="text-sm text-muted-foreground">
              Level {user.level}
            </p>
          </div>
          <div className="text-right">
            <p className="font-bold text-psyduck-primary">
              {user.xp.toLocaleString()} XP
            </p>
            <p className="text-sm text-muted-foreground">
              {user.projectsCompleted} projects
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <List
      height={600}
      itemCount={users.length}
      itemSize={80}
      itemData={users}
    >
      {Row}
    </List>
  );
};
```

### Image Optimization

```typescript
// Optimized image component
export const OptimizedImage: React.FC<{
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
}> = ({ src, alt, width, height, className }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);

  const getSrcSet = (baseSrc: string) => {
    const sizes = [400, 800, 1200];
    return sizes
      .map(size => `${baseSrc}?w=${size} ${size}w`)
      .join(', ');
  };

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {!isLoaded && !error && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
      )}
      
      {error ? (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
          <ImageIcon className="h-8 w-8 text-gray-400" />
        </div>
      ) : (
        <img
          src={src}
          srcSet={getSrcSet(src)}
          sizes="(max-width: 768px) 100vw, 50vw"
          alt={alt}
          width={width}
          height={height}
          loading="lazy"
          onLoad={() => setIsLoaded(true)}
          onError={() => setError(true)}
          className={`transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        />
      )}
    </div>
  );
};
```

---

## Testing Strategy

### Unit Testing Setup

```typescript
// tests/components/Dashboard.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { Dashboard } from '../../components/Dashboard';
import { AuthProvider } from '../../contexts/AuthContext';
import * as dashboardService from '../../services/dashboardService';

// Mock the dashboard service
vi.mock('../../services/dashboardService');

const mockDashboardData = {
  completedProjects: 5,
  activeProjects: 2,
  totalXP: 2500,
  currentStreak: 7,
  leaderboardRank: 42,
  weeklyXP: 300,
  recentActivity: [],
  recentBadges: []
};

const renderDashboard = () => {
  const mockUser = {
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    totalXp: 2500,
    currentStreak: 7
  };

  return render(
    <AuthProvider value={{ user: mockUser, isAuthenticated: true }}>
      <Dashboard />
    </AuthProvider>
  );
};

describe('Dashboard Component', () => {
  beforeEach(() => {
    vi.mocked(dashboardService.getDashboardData).mockResolvedValue(mockDashboardData);
  });

  test('renders welcome message with user name', async () => {
    renderDashboard();
    
    await waitFor(() => {
      expect(screen.getByText(/Welcome back, John/)).toBeInTheDocument();
    });
  });

  test('displays user stats correctly', async () => {
    renderDashboard();
    
    await waitFor(() => {
      expect(screen.getByText('2,500 XP')).toBeInTheDocument();
      expect(screen.getByText('7 day streak')).toBeInTheDocument();
      expect(screen.getByText('5')).toBeInTheDocument(); // completed projects
    });
  });

  test('shows loading state initially', () => {
    renderDashboard();
    
    expect(screen.getByTestId('dashboard-skeleton')).toBeInTheDocument();
  });
});
```

### Integration Testing

```typescript
// tests/integration/auth.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { Login } from '../../components/Login';
import { AuthProvider } from '../../contexts/AuthContext';

// Mock API server
const server = setupServer(
  http.post('/api/auth/login', async ({ request }) => {
    const { email, password } = await request.json();
    
    if (email === 'test@example.com' && password === 'password123') {
      return HttpResponse.json({
        success: true,
        data: {
          user: { id: '1', email, firstName: 'Test' },
          token: 'fake-token'
        }
      });
    }
    
    return HttpResponse.json(
      { success: false, error: { message: 'Invalid credentials' } },
      { status: 401 }
    );
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('Authentication Flow', () => {
  test('successful login flow', async () => {
    const user = userEvent.setup();
    
    render(
      <AuthProvider>
        <Login />
      </AuthProvider>
    );

    // Fill in login form
    await user.type(screen.getByLabelText(/email/i), 'test@example.com');
    await user.type(screen.getByLabelText(/password/i), 'password123');
    
    // Submit form
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    // Verify success
    await waitFor(() => {
      expect(screen.getByText(/welcome back/i)).toBeInTheDocument();
    });
  });

  test('handles login error', async () => {
    const user = userEvent.setup();
    
    render(
      <AuthProvider>
        <Login />
      </AuthProvider>
    );

    await user.type(screen.getByLabelText(/email/i), 'wrong@example.com');
    await user.type(screen.getByLabelText(/password/i), 'wrongpassword');
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
    });
  });
});
```

### E2E Testing with Playwright

```typescript
// tests/e2e/user-journey.spec.ts
import { test, expect } from '@playwright/test';

test.describe('User Journey', () => {
  test('complete project enrollment and code execution flow', async ({ page }) => {
    // Login
    await page.goto('/login');
    await page.fill('[data-testid="email-input"]', 'test@example.com');
    await page.fill('[data-testid="password-input"]', 'password123');
    await page.click('[data-testid="login-button"]');

    // Navigate to projects
    await page.waitForURL('/dashboard');
    await page.click('[data-testid="projects-nav-link"]');

    // Enroll in a project
    await page.waitForURL('/projects');
    await page.click('[data-testid="project-card"]:first-child [data-testid="enroll-button"]');

    // Verify enrollment success
    await expect(page.locator('[data-testid="success-notification"]')).toBeVisible();

    // Navigate to IDE
    await page.click('[data-testid="start-coding-button"]');
    await page.waitForURL(/\/projects\/.*\/ide/);

    // Write and execute code
    await page.fill('[data-testid="code-editor"]', 'console.log("Hello, World!");');
    await page.click('[data-testid="run-code-button"]');

    // Verify code execution
    await expect(page.locator('[data-testid="code-output"]')).toContainText('Hello, World!');

    // Check XP update
    await expect(page.locator('[data-testid="xp-display"]')).not.toContainText('0 XP');
  });

  test('leaderboard and social features', async ({ page }) => {
    await page.goto('/login');
    // ... login steps

    // Navigate to leaderboard
    await page.click('[data-testid="leaderboard-nav-link"]');
    await page.waitForURL('/leaderboard');

    // Verify leaderboard loads
    await expect(page.locator('[data-testid="leaderboard-table"]')).toBeVisible();
    await expect(page.locator('[data-testid="user-rank"]')).toBeVisible();

    // Test filtering
    await page.selectOption('[data-testid="domain-filter"]', 'mern');
    await expect(page.locator('[data-testid="leaderboard-table"]')).toBeVisible();

    // Test user profile navigation
    await page.click('[data-testid="leaderboard-user"]:first-child');
    await expect(page.url()).toMatch(/\/profile\/.+/);
  });
});
```

---

## Development Workflow

### Development Scripts

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "test": "vitest",
    "test:e2e": "playwright test",
    "test:coverage": "vitest run --coverage",
    "lint": "eslint src --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "lint:fix": "eslint src --ext ts,tsx --fix",
    "type-check": "tsc --noEmit",
    "format": "prettier --write src",
    "analyze": "npm run build && npx vite-bundle-analyzer dist"
  }
}
```

### Pre-commit Hooks

```json
// .husky/pre-commit
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

# Type check
npm run type-check

# Lint and format
npm run lint:fix
npm run format

# Run tests
npm run test run

# Add formatted files
git add .
```

### Environment Configuration

```typescript
// config/environment.ts
export const config = {
  apiUrl: process.env.REACT_APP_API_URL || 'http://localhost:3000/api',
  wsUrl: process.env.REACT_APP_WS_URL || 'ws://localhost:3000',
  environment: process.env.NODE_ENV || 'development',
  enableDevTools: process.env.NODE_ENV === 'development',
  
  // Feature flags
  features: {
    realTimeChat: process.env.REACT_APP_ENABLE_CHAT === 'true',
    codeExecution: process.env.REACT_APP_ENABLE_CODE_EXEC !== 'false',
    analytics: process.env.REACT_APP_ENABLE_ANALYTICS === 'true',
  },
  
  // External services
  sentry: {
    dsn: process.env.REACT_APP_SENTRY_DSN,
    environment: process.env.NODE_ENV,
  },
  
  analytics: {
    googleAnalyticsId: process.env.REACT_APP_GA_ID,
  },
};
```

---

## Deployment & Build Process

### Build Configuration

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@components': resolve(__dirname, './src/components'),
      '@hooks': resolve(__dirname, './src/hooks'),
      '@services': resolve(__dirname, './src/services'),
      '@types': resolve(__dirname, './src/types'),
      '@utils': resolve(__dirname, './src/utils'),
    },
  },
  
  build: {
    target: 'esnext',
    minify: 'terser',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu'],
          monaco: ['monaco-editor'],
        },
      },
    },
  },
  
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
      '/ws': {
        target: 'ws://localhost:8000',
        ws: true,
      },
    },
  },
  
  preview: {
    port: 3000,
  },
});
```

### Docker Configuration

```dockerfile
# Dockerfile
FROM node:18-alpine as build

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci --only=production

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built assets
COPY --from=build /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

### CI/CD Pipeline

```yaml
# .github/workflows/frontend-deploy.yml
name: Frontend Deploy

on:
  push:
    branches: [main]
    paths: ['src/**', 'public/**', 'package*.json']

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run type check
        run: npm run type-check
      
      - name: Run tests
        run: npm run test:coverage
      
      - name: Run E2E tests
        run: npm run test:e2e
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          file: ./coverage/lcov.info

  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build application
        run: npm run build
        env:
          REACT_APP_API_URL: ${{ secrets.API_URL }}
          REACT_APP_WS_URL: ${{ secrets.WS_URL }}
      
      - name: Upload build artifacts
        uses: actions/upload-artifact@v3
        with:
          name: dist
          path: dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - name: Download build artifacts
        uses: actions/download-artifact@v3
        with:
          name: dist
          path: dist
      
      - name: Deploy to S3
        run: |
          aws s3 sync dist/ s3://${{ secrets.S3_BUCKET }} --delete
          aws cloudfront create-invalidation --distribution-id ${{ secrets.CLOUDFRONT_ID }} --paths "/*"
        env:
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
```

This comprehensive frontend documentation provides a complete guide for understanding, developing, and maintaining the Psyduck platform's React-based frontend. The architecture emphasizes modularity, performance, and maintainability while supporting all the platform's core features including gamification, real-time updates, and code execution capabilities.
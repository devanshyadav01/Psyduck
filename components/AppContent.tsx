import React, { useEffect, Suspense, useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useUI } from '../contexts/UIContext';
import { useRouterContext } from '../contexts/RouterContext';

// Lazy load components for better performance
const LoadingScreen = React.lazy(() => 
  import('./LoadingScreen').then(module => ({ default: module.LoadingScreen }))
);

const LandingPage = React.lazy(() => 
  import('./LandingPage').then(module => ({ default: module.LandingPage }))
);

const Login = React.lazy(() => 
  import('./Login').then(module => ({ default: module.Login }))
);

const Register = React.lazy(() => 
  import('./Register').then(module => ({ default: module.Register }))
);

const Header = React.lazy(() => 
  import('./Header').then(module => ({ default: module.Header }))
);

// Critical components that need to be loaded immediately
const Dashboard = React.lazy(() => 
  import('./Dashboard').then(module => ({ default: module.Dashboard }))
);

const ProjectCatalog = React.lazy(() => 
  import('./ProjectCatalog').then(module => ({ default: module.ProjectCatalog }))
);

const Profile = React.lazy(() => 
  import('./Profile').then(module => ({ default: module.Profile }))
);

const Leaderboard = React.lazy(() => 
  import('./Leaderboard').then(module => ({ default: module.Leaderboard }))
);

const IDE = React.lazy(() => 
  import('./IDE').then(module => ({ default: module.IDE }))
);

const Settings = React.lazy(() => 
  import('./Settings').then(module => ({ default: module.Settings }))
);

const Notifications = React.lazy(() => 
  import('./Notifications').then(module => ({ default: module.Notifications }))
);

const RecruitingForm = React.lazy(() => 
  import('./RecruitingForm').then(module => ({ default: module.RecruitingForm }))
);

const ContentCreator = React.lazy(() => 
  import('./ContentCreator').then(module => ({ default: module.ContentCreator }))
);

// Optimized loading fallback
const PageLoadingFallback: React.FC<{ page?: string }> = React.memo(({ page }) => (
  <div className="min-h-[200px] flex items-center justify-center">
    <div className="flex items-center space-x-3 text-psyduck-primary">
      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-psyduck-primary"></div>
      <span className="text-sm font-medium">Loading {page || 'page'}...</span>
    </div>
  </div>
));

PageLoadingFallback.displayName = 'PageLoadingFallback';

// Optimized page renderer with better memoization
const PageRenderer = React.memo(({ path }: { path: string }) => {
  if (process.env.NODE_ENV === 'development') {
    console.log('🎯 PageRenderer rendering:', path);
  }
  
  // Handle IDE routes with parameters (performance critical)
  if (path.includes('/projects/') && path.includes('/ide')) {
    const pathParts = path.split('/');
    const projectIdIndex = pathParts.indexOf('projects') + 1;
    const projectId = pathParts[projectIdIndex];
    
    let milestoneId: string | undefined;
    const milestoneIndex = pathParts.indexOf('milestones');
    if (milestoneIndex !== -1 && milestoneIndex + 1 < pathParts.length) {
      milestoneId = pathParts[milestoneIndex + 1];
    }
    
    const ideKey = `ide-${projectId}-${milestoneId || 'default'}`;
    
    return (
      <Suspense fallback={<PageLoadingFallback page="IDE" />}>
        <div key={ideKey}>
          <IDE 
            projectId={projectId} 
            milestoneId={milestoneId || 'default'} 
            key={ideKey}
          />
        </div>
      </Suspense>
    );
  }
  
  // Route-based rendering with lazy loading
  switch (path) {
    case '/':
    case '/dashboard':
      return (
        <Suspense fallback={<PageLoadingFallback page="Dashboard" />}>
          <Dashboard />
        </Suspense>
      );
    
    case '/projects':
      return (
        <Suspense fallback={<PageLoadingFallback page="Projects" />}>
          <ProjectCatalog />
        </Suspense>
      );
    
    case '/profile':
      return (
        <Suspense fallback={<PageLoadingFallback page="Profile" />}>
          <Profile />
        </Suspense>
      );
    
    case '/leaderboard':
      return (
        <Suspense fallback={<PageLoadingFallback page="Leaderboard" />}>
          <Leaderboard />
        </Suspense>
      );
    
    case '/settings':
      return (
        <Suspense fallback={<PageLoadingFallback page="Settings" />}>
          <Settings />
        </Suspense>
      );
    
    case '/notifications':
      return (
        <Suspense fallback={<PageLoadingFallback page="Notifications" />}>
          <Notifications />
        </Suspense>
      );
    
    case '/recruiting-form':
      return (
        <Suspense fallback={<PageLoadingFallback page="Recruiting Form" />}>
          <RecruitingForm />
        </Suspense>
      );
    
    case '/content-creator':
      return (
        <Suspense fallback={<PageLoadingFallback page="Content Creator" />}>
          <div className="min-h-screen bg-background">
            <ContentCreator />
          </div>
        </Suspense>
      );
    
    default:
      // Handle dynamic project routes
      if (path.startsWith('/projects/')) {
        return (
          <Suspense fallback={<PageLoadingFallback page="Project Details" />}>
            <ProjectCatalog />
          </Suspense>
        );
      }
      
      // Fallback to dashboard
      return (
        <Suspense fallback={<PageLoadingFallback page="Dashboard" />}>
          <Dashboard />
        </Suspense>
      );
  }
});

PageRenderer.displayName = 'PageRenderer';

// Optimized page content wrapper
const PageContent = React.memo(({ currentPath }: { currentPath?: string }) => {
  const path = currentPath || window.location.pathname;
  
  return <PageRenderer path={path} />;
});

PageContent.displayName = 'PageContent';

// Main AppContent component with maximum optimization
export const AppContent = React.memo(() => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { sidebarCollapsed } = useUI();
  const { currentRoute, navigate } = useRouterContext();

  if (process.env.NODE_ENV === 'development') {
    console.log('🎯 AppContent render:', {
      isAuthenticated,
      isLoading,
      currentRoute: currentRoute?.path,
      user: user?.username,
    });
  }

  // Optimized redirect logic
  useEffect(() => {
    if (isAuthenticated && (currentRoute?.path === '/login' || currentRoute?.path === '/register')) {
      if (process.env.NODE_ENV === 'development') {
        console.log('🎯 Authenticated user on auth page, redirecting to dashboard');
      }
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, currentRoute?.path, navigate]);

  // Memoize route checking for better performance
  const isIDERoute = useMemo(() => 
    currentRoute?.path?.includes('/ide') || false, 
    [currentRoute?.path]
  );

  // Show loading screen while checking authentication
  if (isLoading) {
    return (
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-psyduck-primary"></div>
        </div>
      }>
        <LoadingScreen />
      </Suspense>
    );
  }

  // Handle unauthenticated users
  if (!isAuthenticated) {
    if (process.env.NODE_ENV === 'development') {
      console.log('🎯 User not authenticated, showing public pages for:', currentRoute?.path);
    }
    
    // Handle specific public routes with lazy loading
    if (currentRoute?.path === '/login') {
      return (
        <Suspense fallback={<PageLoadingFallback page="Login" />}>
          <Login />
        </Suspense>
      );
    }
    
    if (currentRoute?.path === '/register') {
      return (
        <Suspense fallback={<PageLoadingFallback page="Register" />}>
          <Register />
        </Suspense>
      );
    }
    
    return (
      <Suspense fallback={<PageLoadingFallback page="Landing" />}>
        <LandingPage />
      </Suspense>
    );
  }

  if (process.env.NODE_ENV === 'development') {
    console.log('🎯 User authenticated, showing app for:', user?.username, 'route:', currentRoute?.path);
  }

  // Handle IDE routes (full-screen, no header)
  if (isIDERoute) {
    return (
      <div className="h-screen bg-background will-change-transform">
        <PageContent currentPath={currentRoute?.path} />
      </div>
    );
  }

  // Render main authenticated app with header
  return (
    <div className="min-h-screen bg-background">
      <Suspense fallback={
        <div className="h-16 bg-background border-b border-border flex items-center px-4">
          <div className="animate-pulse bg-muted h-8 w-32 rounded"></div>
        </div>
      }>
        <Header />
      </Suspense>
      
      <div className="flex">
        <main className="flex-1 relative contain-layout">
          <PageContent currentPath={currentRoute?.path} />
        </main>
      </div>
    </div>
  );
});

AppContent.displayName = 'AppContent';

export default AppContent;
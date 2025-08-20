import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useUI } from '../contexts/UIContext';
import { LoadingScreen } from './LoadingScreen';
import { LandingPage } from './LandingPage';
import { Dashboard } from './Dashboard';
import { Login } from './Login';
import { Register } from './Register';
import { ProjectCatalog } from './ProjectCatalog';
import { Profile } from './Profile';
import { Leaderboard } from './Leaderboard';
import { IDE } from './IDE';
import { Settings } from './Settings';
import { Header } from './Header';
import { useRouter } from '../hooks/useRouter';

export function AppContent() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { sidebarCollapsed } = useUI();
  const { currentRoute } = useRouter();

  // Show loading screen while checking authentication
  if (isLoading) {
    return <LoadingScreen />;
  }

  // Show landing page if not authenticated
  if (!isAuthenticated) {
    // Handle specific public routes
    if (currentRoute?.path === '/login') {
      return <Login />;
    }
    if (currentRoute?.path === '/register') {
      return <Register />;
    }
    return <LandingPage />;
  }

  // Render the main authenticated app
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <main className="flex-1">
          <PageContent route={currentRoute} />
        </main>
      </div>
    </div>
  );
}

function PageContent({ route }: { route: any }) {
  if (!route) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-2">Page Not Found</h2>
          <p className="text-muted-foreground">The page you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  // Simple route matching - in a real app you'd use a proper router
  const path = route.path || window.location.pathname;

  switch (path) {
    case '/':
    case '/dashboard':
      return <Dashboard />;
    case '/projects':
      return <ProjectCatalog />;
    case '/profile':
      return <Profile />;
    case '/leaderboard':
      return <Leaderboard />;
    case '/settings':
      return <Settings />;
    default:
      // Handle dynamic routes
      if (path.includes('/projects/') && path.includes('/ide')) {
        return <IDE />;
      }
      if (path.startsWith('/projects/')) {
        return <ProjectCatalog />;
      }
      return (
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-2">Page Not Found</h2>
            <p className="text-muted-foreground">The page you're looking for doesn't exist.</p>
          </div>
        </div>
      );
  }
}
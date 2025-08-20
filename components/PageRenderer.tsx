import { useAuth } from "./AuthContext";
import { PageKey, NavigationHandlers } from "../types/routing";
import { LandingPage } from "./LandingPage";
import { Dashboard } from "./Dashboard";
import { ProjectCatalog } from "./ProjectCatalog";
import { ActivityTracker } from "./ActivityTracker";
import { Leaderboard } from "./Leaderboard";
import { Search } from "./Search";
import { Profile } from "./Profile";
import { Notifications } from "./Notifications";
import { Settings } from "./Settings";
import { IDE } from "./IDE";
import { Auth } from "./Auth";

interface PageRendererProps {
  currentPage: PageKey;
  navigationHandlers: NavigationHandlers;
  shouldRedirectToAuth: boolean;
}

function AuthenticatedPageWrapper({ 
  children, 
  shouldRedirectToAuth 
}: { 
  children: React.ReactNode;
  shouldRedirectToAuth: boolean;
}) {
  if (shouldRedirectToAuth) {
    return <Auth />;
  }
  return <>{children}</>;
}

export function PageRenderer({ 
  currentPage, 
  navigationHandlers, 
  shouldRedirectToAuth 
}: PageRendererProps) {
  const { isAuthenticated } = useAuth();

  const renderPage = () => {
    switch (currentPage) {
      case "home":
        return (
          <LandingPage
            onGetStarted={navigationHandlers.onGetStarted}
            onLogin={navigationHandlers.onLogin}
          />
        );

      case "auth":
        return !isAuthenticated ? <Auth /> : <Dashboard 
          onViewProjects={navigationHandlers.onViewProjects}
          onViewActivity={navigationHandlers.onViewActivity}
        />;

      case "dashboard":
        return (
          <AuthenticatedPageWrapper shouldRedirectToAuth={shouldRedirectToAuth}>
            <Dashboard
              onViewProjects={navigationHandlers.onViewProjects}
              onViewActivity={navigationHandlers.onViewActivity}
            />
          </AuthenticatedPageWrapper>
        );

      case "projects":
        return (
          <AuthenticatedPageWrapper shouldRedirectToAuth={shouldRedirectToAuth}>
            <ProjectCatalog
              onStartProject={navigationHandlers.onStartProject}
            />
          </AuthenticatedPageWrapper>
        );

      case "activity":
        return (
          <AuthenticatedPageWrapper shouldRedirectToAuth={shouldRedirectToAuth}>
            <ActivityTracker />
          </AuthenticatedPageWrapper>
        );

      case "leaderboard":
        return (
          <AuthenticatedPageWrapper shouldRedirectToAuth={shouldRedirectToAuth}>
            <Leaderboard />
          </AuthenticatedPageWrapper>
        );

      case "search":
        return (
          <AuthenticatedPageWrapper shouldRedirectToAuth={shouldRedirectToAuth}>
            <Search
              onStartProject={navigationHandlers.onStartProject}
            />
          </AuthenticatedPageWrapper>
        );

      case "profile":
        return (
          <AuthenticatedPageWrapper shouldRedirectToAuth={shouldRedirectToAuth}>
            <Profile />
          </AuthenticatedPageWrapper>
        );

      case "notifications":
        return (
          <AuthenticatedPageWrapper shouldRedirectToAuth={shouldRedirectToAuth}>
            <Notifications />
          </AuthenticatedPageWrapper>
        );

      case "settings":
        return (
          <AuthenticatedPageWrapper shouldRedirectToAuth={shouldRedirectToAuth}>
            <Settings />
          </AuthenticatedPageWrapper>
        );

      case "ide":
        return (
          <AuthenticatedPageWrapper shouldRedirectToAuth={shouldRedirectToAuth}>
            <IDE onClose={navigationHandlers.onCloseIDE} />
          </AuthenticatedPageWrapper>
        );

      default:
        return (
          <LandingPage
            onGetStarted={navigationHandlers.onGetStarted}
            onLogin={navigationHandlers.onLogin}
          />
        );
    }
  };

  return renderPage();
}
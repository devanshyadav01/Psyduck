import { PageKey } from "../types/routing";
import { ROUTE_CONFIG } from "../config/routes";

export function isProtectedPage(page: PageKey): boolean {
  return ROUTE_CONFIG[page]?.protected ?? false;
}

export function shouldShowChatbot(page: PageKey, isAuthenticated: boolean): boolean {
  return isAuthenticated && (ROUTE_CONFIG[page]?.showChatbot ?? false);
}

export function getPageTitle(page: PageKey): string {
  const titles: Record<PageKey, string> = {
    home: "Psyduck - Project-Based Learning",
    auth: "Authentication - Psyduck",
    dashboard: "Dashboard - Psyduck",
    projects: "Projects - Psyduck",
    activity: "Activity - Psyduck",
    leaderboard: "Leaderboard - Psyduck",
    search: "Search - Psyduck",
    profile: "Profile - Psyduck",
    notifications: "Notifications - Psyduck",
    settings: "Settings - Psyduck",
    ide: "IDE - Psyduck",
  };
  
  return titles[page] || "Psyduck";
}
import { lazy } from "react";

// Lazy load all page components for better performance
// Proper syntax for lazy loading named exports
export const LazyLandingPage = lazy(() => 
  import("../LandingPage").then(module => ({ default: module.LandingPage }))
);

export const LazyDashboard = lazy(() => 
  import("../Dashboard").then(module => ({ default: module.Dashboard }))
);

export const LazyProjectCatalog = lazy(() => 
  import("../ProjectCatalog").then(module => ({ default: module.ProjectCatalog }))
);

export const LazyActivityTracker = lazy(() => 
  import("../ActivityTracker").then(module => ({ default: module.ActivityTracker }))
);

export const LazyLeaderboard = lazy(() => 
  import("../Leaderboard").then(module => ({ default: module.Leaderboard }))
);

export const LazySearch = lazy(() => 
  import("../Search").then(module => ({ default: module.Search }))
);

export const LazyProfile = lazy(() => 
  import("../Profile").then(module => ({ default: module.Profile }))
);

export const LazyNotifications = lazy(() => 
  import("../Notifications").then(module => ({ default: module.Notifications }))
);

export const LazySettings = lazy(() => 
  import("../Settings").then(module => ({ default: module.Settings }))
);

export const LazyIDE = lazy(() => 
  import("../IDE").then(module => ({ default: module.IDE }))
);

export const LazyAuth = lazy(() => 
  import("../Auth").then(module => ({ default: module.Auth }))
);
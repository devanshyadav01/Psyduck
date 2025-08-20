import { useState, useEffect } from 'react';

interface RouteConfig {
  path: string;
  title?: string;
  requiresAuth?: boolean;
}

export function useRouter() {
  const [currentRoute, setCurrentRoute] = useState<RouteConfig>({
    path: window.location.pathname,
  });

  const navigate = (path: string, options?: { replace?: boolean }) => {
    if (options?.replace) {
      window.history.replaceState(null, '', path);
    } else {
      window.history.pushState(null, '', path);
    }
    
    setCurrentRoute({ path });
  };

  const goBack = () => {
    window.history.back();
  };

  useEffect(() => {
    const handlePopState = () => {
      setCurrentRoute({ path: window.location.pathname });
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  return {
    currentRoute,
    navigate,
    goBack,
  };
}
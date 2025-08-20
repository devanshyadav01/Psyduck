import React from 'react';
import { Button } from './ui/button';
import { ArrowLeft } from 'lucide-react';
import { useRouterContext } from '../contexts/RouterContext';

export function BackButton() {
  const { currentRoute, navigate } = useRouterContext();

  // Don't show back button on dashboard/home pages
  const hiddenRoutes = ['/', '/dashboard'];
  if (hiddenRoutes.includes(currentRoute?.path || '')) {
    return null;
  }

  const handleBack = () => {
    // Smart back navigation based on current route
    const currentPath = currentRoute?.path || '';
    
    if (currentPath.startsWith('/projects/') && currentPath.includes('/ide')) {
      // From IDE, go back to the specific project page
      const projectId = currentPath.split('/')[2];
      navigate(`/projects/${projectId}`);
    } else if (currentPath.startsWith('/projects/') && !currentPath.includes('/ide')) {
      // From project detail, go back to projects catalog
      navigate('/projects');
    } else {
      // Default: go back to dashboard
      navigate('/dashboard');
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleBack}
      className="h-10 w-10 p-0 bg-background/90 backdrop-blur-sm hover:bg-background shadow-lg border-border/50 transition-all duration-200 hover:shadow-xl fixed-isolated floating-interactive"
      title="Go back"
    >
      <ArrowLeft className="h-4 w-4" />
    </Button>
  );
}
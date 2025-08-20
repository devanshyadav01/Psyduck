import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';
import { ChevronUp, ChevronDown, Navigation } from 'lucide-react';
import { useRouterContext } from '../contexts/RouterContext';
import { isDevelopment } from '../config/environment';

export function NavigationTest() {
  const { navigate, currentRoute } = useRouterContext();
  const [isOpen, setIsOpen] = useState(false);

  // Only show in development
  if (!isDevelopment) {
    return null;
  }

  const testRoutes = [
    { path: '/', label: 'Home' },
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/projects', label: 'Projects' },
    { path: '/profile', label: 'Profile' },
    { path: '/leaderboard', label: 'Leaderboard' },
    { path: '/settings', label: 'Settings' },
    { path: '/projects/demo-project/ide', label: 'IDE Test' },
  ];

  const handleNavigation = (path: string) => {
    console.log('🧭 NavigationTest - navigating to:', path);
    navigate(path);
  };

  const currentPath = currentRoute?.path || window.location.pathname;

  return (
    <div className="fixed bottom-4 left-4 z-50 w-72">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <Card className="bg-background/95 backdrop-blur border-blue-200 shadow-lg">
          <CollapsibleTrigger asChild>
            <CardHeader className="pb-2 cursor-pointer hover:bg-muted/50 transition-colors">
              <CardTitle className="text-sm flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Navigation className="h-4 w-4" />
                  Nav Test
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">
                    {currentPath.split('/').pop() || 'root'}
                  </span>
                  {isOpen ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronUp className="h-4 w-4" />
                  )}
                </div>
              </CardTitle>
            </CardHeader>
          </CollapsibleTrigger>
          
          <CollapsibleContent>
            <CardContent className="space-y-3">
              <div className="text-xs text-muted-foreground space-y-1 border-b pb-2">
                <div className="flex justify-between">
                  <span>State:</span>
                  <span className="font-mono">{currentRoute?.path}</span>
                </div>
                <div className="flex justify-between">
                  <span>URL:</span>
                  <span className="font-mono">{window.location.pathname}</span>
                </div>
                <div className="flex justify-between">
                  <span>Sync:</span>
                  <span className={currentPath === window.location.pathname ? 'text-green-600' : 'text-red-600'}>
                    {currentPath === window.location.pathname ? '✅' : '❌'}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {testRoutes.map((route) => {
                  const isActive = currentPath === route.path;
                  return (
                    <Button
                      key={route.path}
                      variant={isActive ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleNavigation(route.path)}
                      className={`text-xs transition-colors ${
                        isActive 
                          ? 'bg-psyduck-primary hover:bg-psyduck-primary-hover text-white' 
                          : 'hover:bg-psyduck-soft'
                      }`}
                    >
                      {route.label}
                      {isActive && <span className="ml-1">•</span>}
                    </Button>
                  );
                })}
              </div>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>
    </div>
  );
}
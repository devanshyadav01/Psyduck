import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from '../hooks/useRouter';
import { isDevelopment } from '../config/environment';

export function AuthDebug() {
  const { user, isAuthenticated, isLoading, error } = useAuth();
  const { currentRoute } = useRouter();

  // Only show in development
  if (!isDevelopment) {
    return null;
  }

  return (
    <div className="fixed bottom-20 right-4 z-50 w-80">
      <Card className="bg-background/95 backdrop-blur border-orange-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center justify-between">
            🔐 Auth Debug
            <Badge variant={isAuthenticated ? "default" : "secondary"} className="text-xs">
              {isAuthenticated ? 'Authenticated' : 'Not Auth'}
            </Badge>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-2 text-xs">
          <div className="flex justify-between">
            <span>Loading:</span>
            <Badge variant={isLoading ? "destructive" : "secondary"} className="text-xs">
              {isLoading ? 'Yes' : 'No'}
            </Badge>
          </div>
          
          <div className="flex justify-between">
            <span>Current Route:</span>
            <span className="font-mono text-xs">{currentRoute?.path || 'None'}</span>
          </div>
          
          <div className="flex justify-between">
            <span>User:</span>
            <span className="font-mono">{user?.username || 'None'}</span>
          </div>
          
          <div className="flex justify-between">
            <span>Email:</span>
            <span className="font-mono">{user?.email || 'None'}</span>
          </div>
          
          <div className="flex justify-between">
            <span>XP:</span>
            <span className="font-mono">{user?.totalXp || 0}</span>
          </div>
          
          {error && (
            <div className="p-2 bg-destructive/10 border border-destructive/20 rounded text-destructive">
              <strong>Error:</strong> {error}
            </div>
          )}
          
          <div className="pt-2 border-t">
            <div className="text-xs text-muted-foreground">
              Token: {localStorage.getItem('psyduck_token') ? 'Present' : 'Missing'}
            </div>
            <div className="text-xs text-muted-foreground">
              Stored User: {localStorage.getItem('psyduck_current_user') ? 'Present' : 'Missing'}
            </div>
            <div className="text-xs text-muted-foreground">
              URL: {window.location.pathname}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
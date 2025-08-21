import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { useRouterContext } from '../contexts/RouterContext';
import { isDevelopment } from '../config/environment';

export function RouterDebug() {
  const { currentRoute } = useRouterContext();
  const [updateCount, setUpdateCount] = useState(0);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Update counter when route changes
  useEffect(() => {
    setUpdateCount(prev => prev + 1);
    setLastUpdate(new Date());
  }, [currentRoute?.path]);

  // Only show in development
  if (!isDevelopment) {
    return null;
  }

  const isMatched = currentRoute?.path === window.location.pathname;

  return (
    <div className="fixed top-4 right-4 z-50 w-80">
      <Card className="bg-background/95 backdrop-blur border-green-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center justify-between">
            🧭 Router Debug
            <div className="flex gap-1">
              <Badge variant="outline" className="text-xs">
                #{updateCount}
              </Badge>
              <Badge 
                variant={isMatched ? "default" : "destructive"} 
                className="text-xs"
              >
                {isMatched ? 'Synced' : 'Unsynced'}
              </Badge>
            </div>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-2 text-xs">
          <div className="flex justify-between">
            <span>Route State:</span>
            <span className="font-mono">{currentRoute?.path || 'None'}</span>
          </div>
          
          <div className="flex justify-between">
            <span>URL Path:</span>
            <span className="font-mono">{window.location.pathname}</span>
          </div>
          
          <div className="flex justify-between">
            <span>URL Search:</span>
            <span className="font-mono">{window.location.search || 'None'}</span>
          </div>
          
          <div className="flex justify-between">
            <span>URL Hash:</span>
            <span className="font-mono">{window.location.hash || 'None'}</span>
          </div>
          
          <div className="flex justify-between">
            <span>Sync Status:</span>
            <Badge 
              variant={isMatched ? "default" : "destructive"}
              className="text-xs"
            >
              {isMatched ? '✅ Matched' : '❌ Mismatched'}
            </Badge>
          </div>
          
          <div className="pt-2 border-t space-y-1">
            <div className="flex justify-between">
              <span>Updates:</span>
              <span>{updateCount}</span>
            </div>
            
            <div className="flex justify-between">
              <span>Last Update:</span>
              <span>{lastUpdate.toLocaleTimeString()}</span>
            </div>
            
            <div className="flex justify-between">
              <span>Environment:</span>
              <span>{isDevelopment ? 'Dev' : 'Prod'}</span>
            </div>
          </div>
          
          <div className="pt-2 border-t">
            <div className="text-xs text-muted-foreground">
              Real-time router state monitoring
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
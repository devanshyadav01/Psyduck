import React, { useState } from 'react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Database, Settings } from 'lucide-react';
import { config, isDevelopment } from '../config/environment';
import { apiService } from '../services/apiService';

export function DevInfo() {
  const [showInfo, setShowInfo] = useState(false);

  if (!isDevelopment) {
    return null;
  }

  const toggleMockApi = () => {
    const newMode = !config.api.useMockApi;
    apiService.setMockMode(newMode);
    // Update config for UI consistency
    config.api.useMockApi = newMode;
    // Force a page reload to apply the change
    window.location.reload();
  };

  return (
    <div className="fixed bottom-4 left-4 z-[9999]">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setShowInfo(!showInfo)}
        className="bg-background/80 backdrop-blur border-psyduck-primary/20 hover:bg-psyduck-primary/10"
      >
        <Database className="h-4 w-4 mr-1" />
        Dev
      </Button>
      
      {showInfo && (
        <Card className="absolute bottom-12 left-0 w-64 bg-background/95 backdrop-blur border-psyduck-primary/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Development Mode
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-2 pb-3">
            <div className="flex items-center justify-between text-xs">
              <span>Environment:</span>
              <Badge variant="outline" className="text-xs">
                {config.app.environment}
              </Badge>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span>API Mode:</span>
              <Badge 
                variant={config.api.useMockApi ? "secondary" : "default"} 
                className="text-xs"
              >
                {config.api.useMockApi ? 'Mock' : 'Real'}
              </Badge>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span>Version:</span>
              <Badge variant="outline" className="text-xs">
                {config.app.version}
              </Badge>
            </div>

            <div className="pt-2 border-t">
              <Button 
                size="sm" 
                variant="outline" 
                className="w-full text-xs h-7"
                onClick={toggleMockApi}
              >
                Switch to {config.api.useMockApi ? 'Real' : 'Mock'} API
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
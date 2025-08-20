import React, { useState } from 'react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';
import { ChevronDown, Database, Settings, Wifi, WifiOff } from 'lucide-react';
import { config, isDevelopment } from '../config/environment';
import { apiService } from '../services/apiService';

export function DevInfo() {
  const [isOpen, setIsOpen] = useState(false);

  if (!isDevelopment) {
    return null;
  }

  const toggleMockApi = () => {
    const newMode = !config.api.useMockApi;
    apiService.setMockMode(newMode);
    // Force a page reload to apply the change
    window.location.reload();
  };

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <Button variant="outline" size="sm" className="bg-background/80 backdrop-blur">
            <Database className="h-4 w-4 mr-2" />
            Dev Mode
            <ChevronDown className={`h-4 w-4 ml-2 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </Button>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <Card className="mt-2 w-80 bg-background/95 backdrop-blur">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Development Info
              </CardTitle>
              <CardDescription className="text-xs">
                Current configuration and API status
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">API Mode:</span>
                <div className="flex items-center gap-2">
                  <Badge variant={config.api.useMockApi ? "secondary" : "default"} className="text-xs">
                    {config.api.useMockApi ? (
                      <>
                        <Database className="h-3 w-3 mr-1" />
                        Mock API
                      </>
                    ) : (
                      <>
                        <Wifi className="h-3 w-3 mr-1" />
                        Real API
                      </>
                    )}
                  </Badge>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm">Environment:</span>
                <Badge variant="outline" className="text-xs">
                  {config.app.environment}
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm">Real-time:</span>
                <Badge variant={config.features.realTime ? "default" : "secondary"} className="text-xs">
                  {config.features.realTime ? (
                    <>
                      <Wifi className="h-3 w-3 mr-1" />
                      Enabled
                    </>
                  ) : (
                    <>
                      <WifiOff className="h-3 w-3 mr-1" />
                      Disabled
                    </>
                  )}
                </Badge>
              </div>

              <div className="pt-2 border-t">
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="w-full text-xs"
                  onClick={toggleMockApi}
                >
                  Switch to {config.api.useMockApi ? 'Real' : 'Mock'} API
                </Button>
              </div>

              {config.api.useMockApi && (
                <div className="bg-muted/50 p-2 rounded text-xs">
                  <p className="font-medium mb-1">🎭 Mock API Active</p>
                  <p className="text-muted-foreground">
                    All API calls are simulated with realistic responses. 
                    Perfect for development and testing!
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
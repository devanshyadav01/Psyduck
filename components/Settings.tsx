import React, { useMemo, useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useTheme } from './providers/ThemeProvider';
import { apiService } from '../services/apiService';
import serviceManager from '../services/frontend/ServiceManager';

export function Settings() {
  const { theme, setTheme } = useTheme();
  const apiClient = serviceManager.getApiClient();
  const [useMockApi, setUseMockApi] = useState<boolean>(() => apiClient.isUsingMockApi());

  useEffect(() => {
    // Sync local state if external changes happen
    setUseMockApi(apiClient.isUsingMockApi());
  }, [apiClient]);

  const apiModeLabel = useMemo(() => (useMockApi ? 'Mock API' : 'Real API'), [useMockApi]);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1>Settings</h1>
        <p className="text-muted-foreground">
          Manage your account preferences
        </p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>API Mode</CardTitle>
            <CardDescription>
              Switch between mock and real backend APIs
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="api-mode">{apiModeLabel}</Label>
                <p className="text-xs text-muted-foreground">A reload is recommended after switching</p>
              </div>
              <Switch
                id="api-mode"
                checked={useMockApi}
                onCheckedChange={(checked: boolean) => {
                  setUseMockApi(checked);
                  apiClient.setUseMockApi(checked);
                  // Optional: ping health to verify
                  apiService.healthCheck().then(() => {
                    // no-op
                  }).catch(() => {
                    // no-op
                  });
                }}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
            <CardDescription>
              Customize how Psyduck looks for you
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="theme">Theme</Label>
              <Select value={theme} onValueChange={(value: 'light' | 'dark' | 'system') => setTheme(value)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>
              Choose what you want to be notified about
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="email-notifications">Email notifications</Label>
              <Switch id="email-notifications" />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="push-notifications">Push notifications</Label>
              <Switch id="push-notifications" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Account</CardTitle>
            <CardDescription>
              Manage your account settings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="destructive">
              Delete Account
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
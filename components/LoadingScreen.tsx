import React from 'react';
import { Loader2 } from 'lucide-react';

export function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-psyduck-primary" />
        <h2 className="text-xl font-semibold mb-2">Loading Psyduck</h2>
        <p className="text-muted-foreground">Preparing your learning environment...</p>
      </div>
    </div>
  );
}
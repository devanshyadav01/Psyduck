import React from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Play, Save } from 'lucide-react';

export function IDE() {
  return (
    <div className="h-screen flex flex-col">
      <div className="border-b p-4 flex items-center justify-between bg-card">
        <h2>Code Editor</h2>
        <div className="flex gap-2">
          <Button size="sm" variant="outline">
            <Save className="h-4 w-4 mr-2" />
            Save
          </Button>
          <Button size="sm" className="bg-psyduck-success hover:bg-psyduck-success/90">
            <Play className="h-4 w-4 mr-2" />
            Run Code
          </Button>
        </div>
      </div>
      
      <div className="flex-1 flex">
        <div className="flex-1 p-4">
          <Card className="h-full p-4">
            <div className="text-center text-muted-foreground">
              <p>Monaco Editor will be integrated here</p>
              <p className="text-sm mt-2">Code editor functionality coming soon...</p>
            </div>
          </Card>
        </div>
        
        <div className="w-1/3 border-l p-4">
          <Card className="h-full p-4">
            <h3 className="font-semibold mb-4">Output</h3>
            <div className="text-sm text-muted-foreground">
              Run your code to see output here...
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
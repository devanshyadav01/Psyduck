import React from 'react';
import { Separator } from '../ui/separator';
import { Lightbulb } from 'lucide-react';

interface SidePanelProps {
  projectId: string;
  milestoneId: string;
  currentLanguage: string;
}

export function SidePanel({ projectId, milestoneId, currentLanguage }: SidePanelProps) {
  return (
    <div className="w-80 border-l bg-card/50">
      <div className="p-4 space-y-4">
        <div>
          <h3 className="font-medium mb-2">Project Info</h3>
          <div className="text-sm text-muted-foreground space-y-1">
            <div>Project: {projectId}</div>
            <div>Milestone: {milestoneId}</div>
            <div>Language: {currentLanguage}</div>
          </div>
        </div>

        <Separator />

        <div>
          <h3 className="font-medium mb-2 flex items-center gap-2">
            <Lightbulb className="h-4 w-4" />
            Quick Tips
          </h3>
          <div className="text-sm text-muted-foreground space-y-2">
            <div className="flex items-start gap-2">
              <span className="text-psyduck-primary">•</span>
              <span>Press Ctrl+S to save your code</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-psyduck-primary">•</span>
              <span>Use Ctrl+/ to toggle comments</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-psyduck-primary">•</span>
              <span>Press F11 for fullscreen mode</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-psyduck-primary">•</span>
              <span>Your code auto-saves every few seconds</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
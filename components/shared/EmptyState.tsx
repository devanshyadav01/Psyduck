import React from 'react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { cn } from '../../lib/utils';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
  className
}) => {
  return (
    <Card className={cn('w-full', className)}>
      <CardContent className="flex flex-col items-center justify-center p-8 text-center">
        {icon && (
          <div className="mb-4 p-3 bg-muted rounded-full">
            {icon}
          </div>
        )}
        <h3 className="text-lg font-medium mb-2">{title}</h3>
        {description && (
          <p className="text-muted-foreground mb-4 max-w-sm">{description}</p>
        )}
        {action && (
          <Button 
            onClick={action.onClick}
            className="bg-psyduck-primary hover:bg-psyduck-primary-hover"
          >
            {action.label}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
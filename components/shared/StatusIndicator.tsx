import React from 'react';
import { cn } from '../../lib/utils';

interface StatusIndicatorProps {
  status: 'online' | 'offline' | 'away' | 'busy' | 'success' | 'error' | 'warning' | 'info';
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  label?: string;
  className?: string;
}

const statusConfig = {
  online: { color: 'bg-green-500', label: 'Online' },
  offline: { color: 'bg-gray-400', label: 'Offline' },
  away: { color: 'bg-yellow-500', label: 'Away' },
  busy: { color: 'bg-red-500', label: 'Busy' },
  success: { color: 'bg-psyduck-success', label: 'Success' },
  error: { color: 'bg-destructive', label: 'Error' },
  warning: { color: 'bg-yellow-500', label: 'Warning' },
  info: { color: 'bg-blue-500', label: 'Info' },
};

const sizeConfig = {
  sm: 'w-2 h-2',
  md: 'w-3 h-3',
  lg: 'w-4 h-4',
};

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  status,
  size = 'md',
  showLabel = false,
  label,
  className
}) => {
  const config = statusConfig[status];
  const displayLabel = label || config.label;

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div
        className={cn(
          'rounded-full',
          config.color,
          sizeConfig[size],
          'animate-pulse'
        )}
      />
      {showLabel && displayLabel && (
        <span className="text-sm text-muted-foreground">{displayLabel}</span>
      )}
    </div>
  );
};
import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '../../lib/utils';

interface BreadcrumbItem {
  label: string;
  href?: string;
  onClick?: () => void;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  showHome?: boolean;
  className?: string;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({
  items,
  showHome = true,
  className
}) => {
  const allItems = showHome
    ? [{ label: 'Home', href: '/' }, ...items]
    : items;

  return (
    <nav className={cn('flex items-center space-x-1 text-sm', className)}>
      {allItems.map((item, index) => (
        <React.Fragment key={index}>
          {index > 0 && (
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          )}
          
          {index === 0 && showHome ? (
            <button
              onClick={item.onClick}
              className="flex items-center text-muted-foreground hover:text-foreground transition-colors"
            >
              <Home className="h-4 w-4" />
            </button>
          ) : (
            <span
              className={cn(
                index === allItems.length - 1
                  ? 'text-foreground font-medium'
                  : 'text-muted-foreground hover:text-foreground',
                item.onClick && 'cursor-pointer transition-colors'
              )}
              onClick={item.onClick}
            >
              {item.label}
            </span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};
import React, { useState, useCallback } from 'react';
import { Button } from './ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { Badge } from './ui/badge';
import { Video, Crown } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useRouterContext } from '../contexts/RouterContext';

export const ContentCreatorFloatingButton = React.memo(() => {
  const { user } = useAuth();
  const { navigate, currentRoute } = useRouterContext();
  const [isHovered, setIsHovered] = useState(false);

  // Check if user has premium access
  const hasPremiumAccess = user?.membership === 'premium' || user?.membership === 'pro';
  
  // Don't show on content creator page itself
  const isOnContentCreatorPage = currentRoute?.path === '/content-creator';

  const handleClick = useCallback(() => {
    try {
      // Force flushing layout before navigation to avoid stale DOM state crashes
      requestAnimationFrame(() => {
        navigate('/content-creator');
      });
    } catch (error) {
      console.error('Navigation error:', error);
    }
  }, [navigate]);

  if (isOnContentCreatorPage) return null;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="relative floating-interactive">
            <Button
              onClick={handleClick}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              size="lg"
              className={`
                h-14 w-14 rounded-full shadow-lg transition-all duration-300 ease-out
                ${hasPremiumAccess 
                  ? 'bg-psyduck-primary hover:bg-psyduck-primary-hover text-white' 
                  : 'bg-gradient-to-br from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-white'
                }
                ${isHovered ? 'scale-110 shadow-xl' : 'scale-100'}
                hover:psyduck-glow
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-psyduck-primary focus-visible:ring-offset-2
                active:scale-95
              `}
              title={hasPremiumAccess ? "Content Creator Studio" : "Content Creator Studio (Premium)"}
            >
              <div className="relative">
                <Video className="h-6 w-6" />
                {!hasPremiumAccess && (
                  <Crown className="h-3 w-3 absolute -top-1 -right-1 text-yellow-200" />
                )}
              </div>
            </Button>
            
            {/* Premium Badge */}
            {hasPremiumAccess && (
              <Badge 
                variant="secondary" 
                className="absolute -top-2 -right-2 bg-yellow-100 text-yellow-800 text-xs px-1.5 py-0.5 border border-yellow-300"
              >
                Premium
              </Badge>
            )}

            {/* Pulsing ring animation for non-premium users */}
            {!hasPremiumAccess && (
              <div className="absolute inset-0 rounded-full border-2 border-yellow-400 animate-ping opacity-30" />
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent 
          side="left" 
          className="bg-background border shadow-lg"
          sideOffset={8}
        >
          <div className="flex items-center gap-2 py-1">
            <Video className="h-4 w-4 text-psyduck-primary" />
            <div className="text-left">
              <p className="font-medium">Content Creator Studio</p>
              <p className="text-xs text-muted-foreground">
                {hasPremiumAccess 
                  ? "Share your knowledge with the community" 
                  : "Premium feature - Upgrade to access"
                }
              </p>
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
});

ContentCreatorFloatingButton.displayName = 'ContentCreatorFloatingButton';
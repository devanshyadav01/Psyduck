import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from './ui/dropdown-menu';
import { Bell, Settings, LogOut, User, Code, Zap, UserPlus, CheckCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useRouterContext } from '../contexts/RouterContext';
import { isDevelopment } from '../config/environment';

export function Header() {
  const { user, logout } = useAuth();
  const { navigate, currentRoute } = useRouterContext();
  const [hasRecruitingProfile, setHasRecruitingProfile] = useState(false);

  // Check for existing recruiting profile
  useEffect(() => {
    if (user?.id) {
      const profile = localStorage.getItem(`recruiting_profile_${user.id}`);
      setHasRecruitingProfile(!!profile);
    }
  }, [user?.id]);

  const handleLogout = async () => {
    console.log('🎯 Header logout clicked');
    await logout();
    navigate('/');
  };

  const handleNavigation = (path: string) => {
    console.log('🎯 Header navigation to:', path, 'from:', currentRoute?.path);
    navigate(path);
  };

  // Get current path for highlighting active nav items
  const currentPath = currentRoute?.path || window.location.pathname;

  return (
    <header className="border-b bg-card">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => handleNavigation('/')}>
            <div className="text-2xl">🦆</div>
            <span className="text-xl font-bold psyduck-brand-text">Psyduck</span>
          </div>
          
          <nav className="flex items-center gap-4">
            <Button 
              variant={currentPath === '/dashboard' || currentPath === '/' ? "default" : "ghost"} 
              onClick={() => handleNavigation('/dashboard')}
              className="relative"
            >
              Dashboard
              {(currentPath === '/dashboard' || currentPath === '/') && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-psyduck-primary rounded-full" />
              )}
            </Button>
            
            <Button 
              variant={currentPath === '/projects' ? "default" : "ghost"} 
              onClick={() => handleNavigation('/projects')}
              className="relative"
            >
              Projects
              {currentPath === '/projects' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-psyduck-primary rounded-full" />
              )}
            </Button>
            
            <Button 
              variant={currentPath === '/leaderboard' ? "default" : "ghost"} 
              onClick={() => handleNavigation('/leaderboard')}
              className="relative"
            >
              Leaderboard
              {currentPath === '/leaderboard' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-psyduck-primary rounded-full" />
              )}
            </Button>

            {/* Development IDE Test Button */}
            {isDevelopment && (
              <Button 
                variant="outline"
                size="sm"
                onClick={() => handleNavigation('/projects/demo-project/ide')}
                className="border-dashed border-psyduck-primary text-psyduck-primary hover:bg-psyduck-soft"
              >
                <Code className="h-4 w-4 mr-1" />
                IDE Test
              </Button>
            )}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => handleNavigation('/notifications')}
            title="Notifications"
          >
            <Bell className="h-4 w-4" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.avatarUrl} />
                  <AvatarFallback>
                    {user?.firstName?.[0]}{user?.lastName?.[0]}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleNavigation('/profile')}>
                <User className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleNavigation('/recruiting-form')}>
                {hasRecruitingProfile ? (
                  <>
                    <CheckCircle className="mr-2 h-4 w-4 text-psyduck-success" />
                    View Recruiting Info
                  </>
                ) : (
                  <>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Complete Recruiting Info
                  </>
                )}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleNavigation('/settings')}>
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              
              {isDevelopment && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => handleNavigation('/projects/demo-project/ide')}>
                    <Code className="mr-2 h-4 w-4" />
                    IDE Demo
                  </DropdownMenuItem>
                </>
              )}
              
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
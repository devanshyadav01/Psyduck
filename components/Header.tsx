import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Progress } from "./ui/progress";
import { Flame, Trophy, Bell, Search, Moon, Sun } from "lucide-react";
import { useState } from "react";

interface HeaderProps {
  currentPage: string;
  onPageChange: (page: string) => void;
}

export function Header({ currentPage, onPageChange }: HeaderProps) {
  const [isDark, setIsDark] = useState(false);
  const userXP = 2450;
  const userLevel = 5;
  const xpToNextLevel = 500;
  const currentXP = userXP % 500;
  const streak = 12;

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo and Nav */}
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-psyduck-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">P</span>
              </div>
              <span className="text-xl font-bold">Psyduck</span>
            </div>
            
            <nav className="hidden md:flex items-center gap-6">
              <Button 
                variant={currentPage === 'home' ? 'default' : 'ghost'}
                onClick={() => onPageChange('home')}
                className={currentPage === 'home' ? 'bg-psyduck-primary hover:bg-psyduck-primary-hover' : ''}
              >
                Home
              </Button>
              <Button 
                variant={currentPage === 'dashboard' ? 'default' : 'ghost'}
                onClick={() => onPageChange('dashboard')}
                className={currentPage === 'dashboard' ? 'bg-psyduck-primary hover:bg-psyduck-primary-hover' : ''}
              >
                Dashboard
              </Button>
              <Button 
                variant={currentPage === 'projects' ? 'default' : 'ghost'}
                onClick={() => onPageChange('projects')}
                className={currentPage === 'projects' ? 'bg-psyduck-primary hover:bg-psyduck-primary-hover' : ''}
              >
                Projects
              </Button>
              <Button 
                variant={currentPage === 'activity' ? 'default' : 'ghost'}
                onClick={() => onPageChange('activity')}
                className={currentPage === 'activity' ? 'bg-psyduck-primary hover:bg-psyduck-primary-hover' : ''}
              >
                Activity
              </Button>
              <Button 
                variant={currentPage === 'leaderboard' ? 'default' : 'ghost'}
                onClick={() => onPageChange('leaderboard')}
                className={currentPage === 'leaderboard' ? 'bg-psyduck-primary hover:bg-psyduck-primary-hover' : ''}
              >
                Leaderboard
              </Button>
            </nav>
          </div>

          {/* User Info and Actions */}
          <div className="flex items-center gap-4">
            {/* Search */}
            <Button variant="ghost" size="sm">
              <Search className="h-4 w-4" />
            </Button>

            {/* Theme Toggle */}
            <Button variant="ghost" size="sm" onClick={toggleTheme}>
              {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>

            {/* Notifications */}
            <Button variant="ghost" size="sm">
              <Bell className="h-4 w-4" />
            </Button>

            {/* Streak */}
            <div className="hidden sm:flex items-center gap-2 bg-psyduck-success-light px-3 py-1 rounded-full">
              <Flame className="h-4 w-4 text-psyduck-success" />
              <span className="text-sm font-medium text-psyduck-success">{streak}</span>
            </div>

            {/* XP and Level */}
            <div className="hidden lg:flex items-center gap-3">
              <div className="text-right">
                <div className="flex items-center gap-2">
                  <Trophy className="h-4 w-4 text-psyduck-primary" />
                  <span className="text-sm font-medium">Level {userLevel}</span>
                </div>
                <div className="text-xs text-muted-foreground">
                  {currentXP}/{xpToNextLevel} XP
                </div>
              </div>
              <Progress value={(currentXP / xpToNextLevel) * 100} className="w-20" />
            </div>

            {/* Avatar */}
            <Avatar>
              <AvatarImage src="/avatar.jpg" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>
    </header>
  );
}
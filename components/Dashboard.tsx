import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Skeleton } from './ui/skeleton';

import { 
  Trophy, 
  Star, 
  Flame, 
  TrendingUp, 
  BookOpen, 
  Code, 
  Users,
  Target,
  Calendar,
  Play
} from 'lucide-react';

import { useAuth } from '../contexts/AuthContext';
import { useUI } from '../contexts/UIContext';
import { 
  useUserProjects, 
  useXPSummary, 
  useStreakData, 
  useUserBadges,
  useDailyCheckin 
} from '../hooks/useAPI';
import { useRouter } from '../hooks/useRouter';

function calculateLevel(xp: number): number {
  return Math.floor(Math.sqrt(xp / 100));
}

function formatTimeSpent(minutes: number): string {
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return `${hours}h ${remainingMinutes}m`;
}

function DashboardSkeleton() {
  return (
    <div className="p-6 space-y-6">
      {/* Header skeleton */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-80" />
        </div>
        <div className="flex gap-4">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-24" />
        </div>
      </div>

      {/* Stats grid skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <Skeleton className="h-12 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main content skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <Skeleton className="h-96 w-full" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
      </div>
    </div>
  );
}

function StatCard({ 
  title, 
  value, 
  icon, 
  trend, 
  progress,
  variant = 'default'
}: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: number;
  progress?: number;
  variant?: 'default' | 'success' | 'warning';
}) {
  const cardClass = variant === 'success' ? 'border-psyduck-success/20 bg-psyduck-success-light' : '';

  return (
    <Card className={cardClass}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              {icon}
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">{title}</p>
              <p className="text-2xl font-bold">{value}</p>
            </div>
          </div>
          {trend !== undefined && (
            <div className={`flex items-center gap-1 text-sm ${trend > 0 ? 'text-psyduck-success' : 'text-gray-500'}`}>
              <TrendingUp className="h-4 w-4" />
              {trend > 0 ? '+' : ''}{trend}%
            </div>
          )}
        </div>
        {progress !== undefined && (
          <div className="mt-4">
            <Progress value={progress} className="h-2" />
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function ActiveProjectCard({ project }: { project: any }) {
  const { navigate } = useRouter();

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-semibold mb-1">{project.title}</h3>
            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
              {project.description}
            </p>
            
            <div className="flex items-center gap-4 mb-3">
              <Badge variant="outline" className="text-xs">
                {project.difficulty}
              </Badge>
              <span className="text-xs text-muted-foreground">
                {project.estimatedHours}h estimated
              </span>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Progress</span>
                <span className="text-psyduck-primary font-medium">
                  {project.userProgress?.progressPercentage || 0}%
                </span>
              </div>
              <Progress value={project.userProgress?.progressPercentage || 0} />
            </div>
          </div>
        </div>
        
        <div className="flex gap-2 mt-4">
          <Button 
            size="sm" 
            className="flex-1 bg-psyduck-primary hover:bg-psyduck-primary-hover"
            onClick={() => navigate(`/projects/${project.id}/ide`)}
          >
            <Play className="h-4 w-4 mr-2" />
            Continue
          </Button>
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => navigate(`/projects/${project.id}`)}
          >
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function RecentBadge({ badge }: { badge: any }) {
  return (
    <div className="flex items-center gap-3 p-3 bg-psyduck-soft/20 rounded-lg">
      <div className="w-10 h-10 bg-psyduck-primary/10 rounded-lg flex items-center justify-center">
        <Trophy className="h-5 w-5 text-psyduck-primary" />
      </div>
      <div>
        <p className="font-medium text-sm">{badge.badge.name}</p>
        <p className="text-xs text-muted-foreground">{badge.badge.description}</p>
      </div>
    </div>
  );
}

export function Dashboard() {
  const { user } = useAuth();
  const { navigate } = useRouter();
  
  // API hooks with error handling
  const { data: userProjects, isLoading: projectsLoading, error: projectsError } = useUserProjects();
  const { data: xpSummary, isLoading: xpLoading, error: xpError } = useXPSummary();
  const { data: streakData, isLoading: streakLoading, error: streakError } = useStreakData();
  const { data: badges, isLoading: badgesLoading, error: badgesError } = useUserBadges();
  const { mutate: dailyCheckin, isPending: checkinLoading } = useDailyCheckin();

  const isLoading = projectsLoading || xpLoading || streakLoading || badgesLoading;
  const hasErrors = projectsError || xpError || streakError || badgesError;

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (hasErrors) {
    return (
      <div className="p-6 flex items-center justify-center min-h-96">
        <Card>
          <CardContent className="p-6 text-center">
            <h3 className="font-semibold mb-2">Unable to load dashboard</h3>
            <p className="text-sm text-muted-foreground mb-4">
              There was an error loading your dashboard data. Please try again.
            </p>
            <Button onClick={() => window.location.reload()}>
              Refresh Page
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const activeProjects = userProjects?.filter(p => p.status === 'in_progress') || [];
  const completedProjects = userProjects?.filter(p => p.status === 'completed') || [];
  const recentBadges = badges?.slice(0, 3) || [];
  
  const currentLevel = calculateLevel(user?.totalXp || 0);
  const levelProgress = xpSummary?.level?.progressToNextLevel || 0;

  const handleDailyCheckin = () => {
    const today = new Date().toDateString();
    const lastCheckin = streakData?.lastActivityDate ? new Date(streakData.lastActivityDate).toDateString() : '';
    
    if (today !== lastCheckin) {
      dailyCheckin();
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1>Welcome back, {user?.firstName}! 🦆</h1>
          <p className="text-muted-foreground">
            Ready to continue your learning journey?
          </p>
        </div>
        <div className="flex items-center gap-4">
          {/* Streak Display */}
          {streakData && (
            <div className="flex items-center gap-2 px-3 py-2 bg-orange-50 dark:bg-orange-950/20 rounded-full">
              <Flame className="h-4 w-4 text-orange-500" />
              <span className="font-medium text-orange-700 dark:text-orange-300">
                {streakData.currentStreak} day streak
              </span>
            </div>
          )}
          
          {/* XP Display */}
          <div className="flex items-center gap-2">
            <Star className="h-4 w-4 text-psyduck-primary" />
            <span className="font-medium">{(user?.totalXp || 0).toLocaleString()} XP</span>
            <Badge variant="secondary">Level {currentLevel}</Badge>
          </div>
          
          {/* Daily Check-in Button */}
          <Button
            onClick={handleDailyCheckin}
            disabled={checkinLoading}
            size="sm"
            className="bg-psyduck-success hover:bg-psyduck-success/90"
          >
            <Calendar className="h-4 w-4 mr-2" />
            {checkinLoading ? 'Checking in...' : 'Daily Check-in'}
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="Projects Completed"
          value={completedProjects.length}
          icon={<Trophy className="h-4 w-4 text-psyduck-primary" />}
          variant="success"
        />
        
        <StatCard
          title="Current Level"
          value={currentLevel}
          icon={<Star className="h-4 w-4 text-yellow-500" />}
          progress={levelProgress}
        />
        
        <StatCard
          title="Active Projects"
          value={activeProjects.length}
          icon={<BookOpen className="h-4 w-4 text-blue-500" />}
        />
        
        <StatCard
          title="Weekly XP"
          value={xpSummary?.weeklyXp || 0}
          icon={<TrendingUp className="h-4 w-4 text-green-500" />}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Projects */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="h-5 w-5" />
                Continue Learning
              </CardTitle>
              <CardDescription>
                Pick up where you left off
              </CardDescription>
            </CardHeader>
            <CardContent>
              {activeProjects.length > 0 ? (
                <div className="grid gap-4">
                  {activeProjects.slice(0, 3).map(project => (
                    <ActiveProjectCard key={project.id} project={project} />
                  ))}
                  {activeProjects.length > 3 && (
                    <Button 
                      variant="outline" 
                      onClick={() => navigate('/projects')}
                      className="mt-2"
                    >
                      View All Active Projects ({activeProjects.length})
                    </Button>
                  )}
                </div>
              ) : (
                <div className="text-center py-12">
                  <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">No active projects</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Start a new project to begin your learning journey
                  </p>
                  <Button 
                    onClick={() => navigate('/projects')}
                    className="bg-psyduck-primary hover:bg-psyduck-primary-hover"
                  >
                    Explore Projects
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Recent Achievements */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5" />
                Recent Achievements
              </CardTitle>
            </CardHeader>
            <CardContent>
              {recentBadges.length > 0 ? (
                <div className="space-y-3">
                  {recentBadges.map(badge => (
                    <RecentBadge key={badge.id} badge={badge} />
                  ))}
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    onClick={() => navigate('/profile?tab=badges')}
                  >
                    View All Badges ({badges?.length || 0})
                  </Button>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Trophy className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">
                    Complete projects to earn badges
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button 
                className="w-full justify-start bg-psyduck-primary hover:bg-psyduck-primary-hover"
                onClick={() => navigate('/projects')}
              >
                <BookOpen className="h-4 w-4 mr-2" />
                Browse Projects
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => navigate('/leaderboard')}
              >
                <Users className="h-4 w-4 mr-2" />
                View Leaderboard
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => navigate('/profile')}
              >
                <Star className="h-4 w-4 mr-2" />
                My Profile
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
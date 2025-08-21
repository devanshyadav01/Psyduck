import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  BookOpen, 
  Trophy, 
  Target, 
  TrendingUp, 
  Calendar,
  Star,
  Clock,
  Users,
  Zap,
  Award,
  PlayCircle,
  ChevronRight,
  Activity
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useRouterContext } from '../contexts/RouterContext';
import { mockApiService } from '../services/mockApiService';
import { toast } from 'sonner';

interface EnrolledProject {
  id: string;
  title: string;
  description: string;
  domain: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  progress: number;
  xpReward: number;
  estimatedTime: string;
  status: 'in-progress' | 'completed' | 'paused';
  lastAccessed: Date;
  technologies: string[];
}

interface UserStats {
  totalXP: number;
  level: number;
  streak: number;
  projectsCompleted: number;
  badges: string[];
  weeklyXP: number;
  monthlyXP: number;
  rank: number;
  nextLevelXP: number;
}

interface Notification {
  id: string;
  type: 'achievement' | 'project' | 'social';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
}

export function Dashboard() {
  const { user, isAuthenticated } = useAuth();
  const { navigate } = useRouterContext();
  
  const [enrolledProjects, setEnrolledProjects] = useState<EnrolledProject[]>([]);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Set up mock API authentication when user changes
  useEffect(() => {
    if (user) {
      // Generate a mock token for the authenticated user
      const mockToken = `mock-token-${user.id}`;
      mockApiService.setAuth(mockToken, user);
    } else {
      mockApiService.setAuth(null, null);
    }
  }, [user]);

  // Fetch dashboard data
  useEffect(() => {
    if (!isAuthenticated || !user) {
      setIsLoading(false);
      return;
    }

    const fetchDashboardData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Fetch all dashboard data in parallel
        const [projectsResponse, statsResponse, notificationsResponse] = await Promise.allSettled([
          mockApiService.getEnrolledProjects(),
          mockApiService.getUserStats(),
          mockApiService.getNotifications()
        ]);

        // Handle enrolled projects
        if (projectsResponse.status === 'fulfilled' && projectsResponse.value.success) {
          const data = (projectsResponse.value.data || []).map((p: any) => ({
            id: p.id,
            title: p.title,
            description: p.description,
            domain: p.domain,
            difficulty: (p.difficulty === 'Beginner' || p.difficulty === 'Intermediate' || p.difficulty === 'Advanced') ? p.difficulty : 'Beginner',
            progress: typeof p.progress === 'number' ? p.progress : 0,
            xpReward: p.xpReward || 0,
            estimatedTime: p.estimatedTime || '—',
            status: (p.status === 'in-progress' || p.status === 'completed' || p.status === 'paused') ? p.status : 'in-progress',
            lastAccessed: p.lastAccessed ? new Date(p.lastAccessed) : new Date(),
            technologies: Array.isArray(p.technologies) ? p.technologies : [],
          })) as EnrolledProject[];

          setEnrolledProjects(data);
        } else {
          console.warn('Failed to fetch enrolled projects:', projectsResponse.status === 'rejected' ? projectsResponse.reason : projectsResponse.value.message);
          // Fallback to empty array instead of showing error
          setEnrolledProjects([]);
        }

        // Handle user stats
        if (statsResponse.status === 'fulfilled' && statsResponse.value.success) {
          setUserStats(statsResponse.value.data);
        } else {
          console.warn('Failed to fetch user stats:', statsResponse.status === 'rejected' ? statsResponse.reason : statsResponse.value.message);
          // Fallback to user data from context
          setUserStats({
            totalXP: user.xp,
            level: user.level,
            streak: user.streak,
            projectsCompleted: user.projects?.completed || 0,
            badges: user.badges,
            weeklyXP: 0,
            monthlyXP: 0,
            rank: 0,
            nextLevelXP: (user.level + 1) * 100
          });
        }

        // Handle notifications
        if (notificationsResponse.status === 'fulfilled' && notificationsResponse.value.success) {
          const notes = (notificationsResponse.value.data || []).map((n: any) => ({
            id: n.id,
            type: (n.type === 'achievement' || n.type === 'project' || n.type === 'social') ? n.type : 'project',
            title: n.title,
            message: n.message,
            timestamp: n.timestamp ? new Date(n.timestamp) : new Date(),
            read: !!n.read,
            actionUrl: n.actionUrl,
          })) as Notification[];

          setNotifications(notes);
        } else {
          console.warn('Failed to fetch notifications:', notificationsResponse.status === 'rejected' ? notificationsResponse.reason : notificationsResponse.value.message);
          setNotifications([]);
        }

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setError('Failed to load dashboard data. Please try refreshing the page.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [isAuthenticated, user]);

  const handleProjectClick = (projectId: string) => {
    navigate(`/projects/${projectId}`);
  };

  const handleContinueProject = (projectId: string) => {
    navigate(`/projects/${projectId}/ide`);
  };

  const handleViewAllProjects = () => {
    navigate('/projects');
  };

  const handleViewProfile = () => {
    navigate('/profile');
  };

  const handleViewLeaderboard = () => {
    navigate('/leaderboard');
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 50) return 'bg-yellow-500';
    return 'bg-blue-500';
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return date.toLocaleDateString();
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-semibold mb-4">Please log in to view your dashboard</h2>
            <Button onClick={() => navigate('/auth')} className="bg-psyduck-primary hover:bg-psyduck-primary-hover">
              Go to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="space-y-6">
            {/* Loading skeleton */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-6">
                    <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                    <div className="h-8 bg-muted rounded w-1/2"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <Card className="animate-pulse">
                  <CardHeader>
                    <div className="h-6 bg-muted rounded w-1/3"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="h-24 bg-muted rounded"></div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
              <div>
                <Card className="animate-pulse">
                  <CardHeader>
                    <div className="h-6 bg-muted rounded w-1/2"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="h-16 bg-muted rounded"></div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="p-6 text-center">
            <div className="text-destructive mb-4">
              <Activity className="h-12 w-12 mx-auto mb-2" />
              <h2 className="text-xl font-semibold">Unable to Load Dashboard</h2>
            </div>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={() => window.location.reload()} variant="outline">
              Refresh Page
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const unreadNotifications = notifications.filter(n => !n.read);
  const recentProjects = enrolledProjects.slice(0, 3);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold">Welcome back, {user?.displayName}! 🦆</h1>
              <p className="text-muted-foreground mt-1">
                Ready to continue your coding journey?
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="text-psyduck-primary border-psyduck-primary">
                <Star className="h-3 w-3 mr-1" />
                Level {userStats?.level || user?.level}
              </Badge>
              {user?.membership === 'premium' && (
                <Badge className="bg-yellow-100 text-yellow-800">
                  <Trophy className="h-3 w-3 mr-1" />
                  Premium
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Stats Overview */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total XP</p>
                    <p className="text-2xl font-bold text-psyduck-primary">
                      {userStats?.totalXP?.toLocaleString() || user?.xp?.toLocaleString() || '0'}
                    </p>
                  </div>
                  <Zap className="h-8 w-8 text-psyduck-primary" />
                </div>
                <div className="mt-4">
                  <div className="flex items-center text-xs text-muted-foreground">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +{userStats?.weeklyXP || 0} this week
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Current Streak</p>
                    <p className="text-2xl font-bold text-psyduck-success">
                      {userStats?.streak || user?.streak || 0} days
                    </p>
                  </div>
                  <Calendar className="h-8 w-8 text-psyduck-success" />
                </div>
                <div className="mt-4">
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Target className="h-3 w-3 mr-1" />
                    Keep it up!
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Projects Completed</p>
                    <p className="text-2xl font-bold">
                      {userStats?.projectsCompleted || user?.projects?.completed || 0}
                    </p>
                  </div>
                  <BookOpen className="h-8 w-8 text-blue-500" />
                </div>
                <div className="mt-4">
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Award className="h-3 w-3 mr-1" />
                    {enrolledProjects.length} in progress
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Global Rank</p>
                    <p className="text-2xl font-bold text-purple-600">
                      #{userStats?.rank || 'N/A'}
                    </p>
                  </div>
                  <Users className="h-8 w-8 text-purple-600" />
                </div>
                <div className="mt-4">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handleViewLeaderboard}
                    className="text-xs p-0 h-auto"
                  >
                    View Leaderboard <ChevronRight className="h-3 w-3 ml-1" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Projects Section */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="h-5 w-5 text-psyduck-primary" />
                      Continue Learning
                    </CardTitle>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={handleViewAllProjects}
                      className="text-psyduck-primary hover:text-psyduck-primary-hover"
                    >
                      View All <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                  <CardDescription>
                    Pick up where you left off
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {recentProjects.length > 0 ? (
                    <div className="space-y-4">
                      {recentProjects.map((project) => (
                        <div
                          key={project.id}
                          className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                          onClick={() => handleProjectClick(project.id)}
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <h3 className="font-medium mb-1">{project.title}</h3>
                              <p className="text-sm text-muted-foreground mb-2">
                                {project.description}
                              </p>
                              <div className="flex items-center gap-2 mb-3">
                                <Badge variant="secondary" className={getDifficultyColor(project.difficulty)}>
                                  {project.difficulty}
                                </Badge>
                                <Badge variant="outline" className="text-xs">
                                  {project.domain}
                                </Badge>
                                <span className="text-xs text-muted-foreground flex items-center">
                                  <Clock className="h-3 w-3 mr-1" />
                                  {project.estimatedTime}
                                </span>
                              </div>
                            </div>
                            <Button
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleContinueProject(project.id);
                              }}
                              className="bg-psyduck-primary hover:bg-psyduck-primary-hover"
                            >
                              <PlayCircle className="h-4 w-4 mr-1" />
                              Continue
                            </Button>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground">Progress</span>
                              <span className="font-medium">{project.progress}%</span>
                            </div>
                            <Progress 
                              value={project.progress} 
                              className="h-2" 
                            />
                          </div>
                          
                          <div className="flex items-center justify-between mt-3 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Star className="h-3 w-3" />
                              {project.xpReward} XP
                            </div>
                            <span>Last accessed {formatTimeAgo(project.lastAccessed)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="font-medium mb-2">No projects yet</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Start your coding journey by enrolling in a project
                      </p>
                      <Button 
                        onClick={handleViewAllProjects}
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
              {/* Level Progress */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-yellow-500" />
                    Level Progress
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-psyduck-primary">
                        Level {userStats?.level || user?.level}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {userStats?.totalXP || user?.xp} / {userStats?.nextLevelXP || ((user?.level || 1) + 1) * 100} XP
                      </p>
                    </div>
                    <Progress 
                      value={((userStats?.totalXP || user?.xp || 0) % 100)} 
                      className="h-3" 
                    />
                    <p className="text-xs text-center text-muted-foreground">
                      {(userStats?.nextLevelXP || ((user?.level || 1) + 1) * 100) - (userStats?.totalXP || user?.xp || 0)} XP to next level
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity/Notifications */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="h-5 w-5 text-blue-500" />
                      Recent Activity
                    </CardTitle>
                    {unreadNotifications.length > 0 && (
                      <Badge variant="secondary" className="bg-psyduck-primary text-white">
                        {unreadNotifications.length}
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {notifications.length > 0 ? (
                    <div className="space-y-3">
                      {notifications.slice(0, 4).map((notification) => (
                        <div
                          key={notification.id}
                          className={`p-3 rounded-lg border transition-colors cursor-pointer ${
                            !notification.read ? 'bg-blue-50 border-blue-200' : 'bg-background'
                          }`}
                          onClick={() => {
                            if (notification.actionUrl) {
                              navigate(notification.actionUrl);
                            }
                          }}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`p-1 rounded-full ${
                              notification.type === 'achievement' ? 'bg-yellow-100' :
                              notification.type === 'project' ? 'bg-blue-100' : 'bg-green-100'
                            }`}>
                              {notification.type === 'achievement' ? (
                                <Trophy className="h-3 w-3 text-yellow-600" />
                              ) : notification.type === 'project' ? (
                                <BookOpen className="h-3 w-3 text-blue-600" />
                              ) : (
                                <Users className="h-3 w-3 text-green-600" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">
                                {notification.title}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {notification.message}
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {formatTimeAgo(notification.timestamp)}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <Activity className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">No recent activity</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={handleViewAllProjects}
                  >
                    <BookOpen className="h-4 w-4 mr-2" />
                    Browse Projects
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={handleViewProfile}
                  >
                    <Users className="h-4 w-4 mr-2" />
                    View Profile
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={handleViewLeaderboard}
                  >
                    <Trophy className="h-4 w-4 mr-2" />
                    Leaderboard
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
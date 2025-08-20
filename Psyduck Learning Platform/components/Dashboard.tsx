import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { 
  Trophy, 
  Flame, 
  Target, 
  Clock, 
  Star, 
  TrendingUp, 
  Code, 
  Smartphone, 
  BarChart, 
  Brain,
  PlayCircle,
  CheckCircle2,
  Users,
  Award,
  Zap,
  Calendar,
  ArrowRight
} from "lucide-react";

interface DashboardProps {
  onViewProjects: () => void;
  onViewActivity?: () => void;
}

export function Dashboard({ onViewProjects, onViewActivity }: DashboardProps) {
  const userStats = {
    name: "John Doe",
    level: 5,
    xp: 2450,
    xpToNext: 500,
    streak: 12,
    projectsCompleted: 8,
    totalProjects: 25,
    rank: 142,
    activeDaysThisMonth: 18,
    longestStreak: 25
  };

  const currentProjects = [
    {
      title: "Real-Time Chat App",
      domain: "MERN Stack",
      progress: 65,
      difficulty: "Intermediate",
      xpReward: 250,
      icon: Code,
      color: "bg-blue-500"
    },
    {
      title: "Fitness Tracker",
      domain: "Mobile Apps",
      progress: 30,
      difficulty: "Intermediate", 
      xpReward: 300,
      icon: Smartphone,
      color: "bg-green-500"
    }
  ];

  const recentAchievements = [
    { title: "Full-Stack Hero", description: "Completed 5 MERN projects", icon: Trophy, color: "text-yellow-500" },
    { title: "Streak Master", description: "10 day learning streak", icon: Flame, color: "text-orange-500" },
    { title: "Quick Learner", description: "Completed project in 2 days", icon: Zap, color: "text-blue-500" }
  ];

  const domains = [
    { name: "MERN Stack", completed: 3, total: 8, icon: Code, color: "bg-blue-500" },
    { name: "Mobile Apps", completed: 2, total: 6, icon: Smartphone, color: "bg-green-500" },
    { name: "Data Analytics", completed: 2, total: 7, icon: BarChart, color: "bg-purple-500" },
    { name: "AI/ML", completed: 1, total: 4, icon: Brain, color: "bg-orange-500" }
  ];

  const leaderboard = [
    { name: "Alice Chen", xp: 4500, avatar: "AC", position: 1 },
    { name: "Bob Smith", xp: 4200, avatar: "BS", position: 2 },
    { name: "Carol Davis", xp: 3800, avatar: "CD", position: 3 },
    { name: "You", xp: 2450, avatar: "JD", position: 142 }
  ];

  // Generate mini activity heatmap for the last 30 days
  const generateMiniActivity = () => {
    const days = [];
    for (let i = 29; i >= 0; i--) {
      const activity = Math.random() > 0.6 ? Math.floor(Math.random() * 4) + 1 : 0;
      days.push(activity);
    }
    return days;
  };

  const miniActivity = generateMiniActivity();

  const getActivityColor = (level: number): string => {
    switch (level) {
      case 0: return 'bg-muted';
      case 1: return 'bg-psyduck-success/20';
      case 2: return 'bg-psyduck-success/40';
      case 3: return 'bg-psyduck-success/70';
      case 4: return 'bg-psyduck-success';
      default: return 'bg-muted';
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Welcome back, {userStats.name}! 👋</h1>
          <p className="text-muted-foreground">Ready to continue your learning journey?</p>
        </div>
        <Button className="bg-psyduck-primary hover:bg-psyduck-primary-hover" onClick={onViewProjects}>
          Browse All Projects
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Level & XP */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Level & XP</CardTitle>
            <Trophy className="h-4 w-4 text-psyduck-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Level {userStats.level}</div>
            <div className="text-xs text-muted-foreground mb-2">
              {userStats.xp % userStats.xpToNext}/{userStats.xpToNext} XP to next level
            </div>
            <Progress value={((userStats.xp % userStats.xpToNext) / userStats.xpToNext) * 100} className="h-2" />
          </CardContent>
        </Card>

        {/* Streak */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
            <Flame className="h-4 w-4 text-psyduck-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-psyduck-success">{userStats.streak} days</div>
            <p className="text-xs text-muted-foreground">Keep it up! 🔥</p>
          </CardContent>
        </Card>

        {/* Projects Progress */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Projects</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userStats.projectsCompleted}/{userStats.totalProjects}</div>
            <p className="text-xs text-muted-foreground">Projects completed</p>
          </CardContent>
        </Card>

        {/* Rank */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Global Rank</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">#{userStats.rank}</div>
            <p className="text-xs text-muted-foreground">↑ 15 this week</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Current Projects */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Continue Learning
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {currentProjects.map((project, idx) => (
                <div key={idx} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 ${project.color} rounded-lg flex items-center justify-center`}>
                        <project.icon className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold">{project.title}</h4>
                        <p className="text-sm text-muted-foreground">{project.domain}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{project.difficulty}</Badge>
                      <Badge className="bg-psyduck-soft text-psyduck-primary">+{project.xpReward} XP</Badge>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{project.progress}%</span>
                    </div>
                    <Progress value={project.progress} className="h-2" />
                    <Button size="sm" className="w-full bg-psyduck-primary hover:bg-psyduck-primary-hover">
                      <PlayCircle className="h-4 w-4 mr-2" />
                      Continue Project
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Domain Progress */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Domain Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {domains.map((domain, idx) => (
                  <div key={idx} className="border rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`w-8 h-8 ${domain.color} rounded-lg flex items-center justify-center`}>
                        <domain.icon className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <h4 className="font-medium">{domain.name}</h4>
                        <p className="text-sm text-muted-foreground">{domain.completed}/{domain.total} projects</p>
                      </div>
                    </div>
                    <Progress value={(domain.completed / domain.total) * 100} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Activity Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Activity
                </div>
                <Button variant="ghost" size="sm" onClick={onViewActivity}>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-lg font-bold">{userStats.activeDaysThisMonth}</div>
                  <p className="text-xs text-muted-foreground">active days this month</p>
                </div>
                <div>
                  <div className="text-lg font-bold text-psyduck-success">{userStats.longestStreak}</div>
                  <p className="text-xs text-muted-foreground">longest streak</p>
                </div>
              </div>
              
              {/* Mini Activity Heatmap */}
              <div>
                <p className="text-xs text-muted-foreground mb-2">Last 30 days</p>
                <div className="grid grid-cols-10 gap-1">
                  {miniActivity.map((activity, idx) => (
                    <div 
                      key={idx}
                      className={`w-3 h-3 rounded-sm ${getActivityColor(activity)}`}
                    />
                  ))}
                </div>
              </div>
              
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full" 
                onClick={onViewActivity}
              >
                View Full Activity
              </Button>
            </CardContent>
          </Card>

          {/* Recent Achievements */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Recent Achievements
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentAchievements.map((achievement, idx) => (
                <div key={idx} className="flex items-center gap-3 p-2 rounded-lg bg-muted/50">
                  <achievement.icon className={`h-6 w-6 ${achievement.color}`} />
                  <div>
                    <h4 className="font-medium text-sm">{achievement.title}</h4>
                    <p className="text-xs text-muted-foreground">{achievement.description}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Leaderboard Preview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Leaderboard
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {leaderboard.map((user, idx) => (
                <div key={idx} className={`flex items-center gap-3 p-2 rounded-lg ${user.name === 'You' ? 'bg-psyduck-soft' : ''}`}>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium w-6">#{user.position}</span>
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="text-xs">{user.avatar}</AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.xp.toLocaleString()} XP</p>
                  </div>
                  {idx < 3 && (
                    <Trophy className={`h-4 w-4 ${idx === 0 ? 'text-yellow-500' : idx === 1 ? 'text-gray-400' : 'text-amber-600'}`} />
                  )}
                </div>
              ))}
              <Button variant="outline" size="sm" className="w-full">
                View Full Leaderboard
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
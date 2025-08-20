import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Calendar, Flame, Target, TrendingUp, Code } from "lucide-react";

interface ActivityDay {
  date: string;
  activity: number; // 0-4 scale (0 = no activity, 4 = high activity)
  projects: string[];
  xpEarned: number;
  hoursSpent: number;
}

interface ActivityStats {
  totalActiveDays: number;
  currentStreak: number;
  longestStreak: number;
  totalXP: number;
  totalHours: number;
  projectsWorkedOn: number;
}

export function ActivityTracker() {
  // Generate mock activity data for the past year
  const generateActivityData = (): ActivityDay[] => {
    const data: ActivityDay[] = [];
    const today = new Date();
    
    for (let i = 364; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      // Mock activity levels (more activity in recent months)
      const activityLevel = Math.random() > (i > 180 ? 0.7 : 0.4) 
        ? Math.floor(Math.random() * 4) + 1 
        : 0;
      
      const projects = activityLevel > 0 
        ? ['Real-Time Chat', 'Fitness Tracker', 'Sales Dashboard'].slice(0, Math.floor(Math.random() * 3) + 1)
        : [];
      
      data.push({
        date: date.toISOString().split('T')[0],
        activity: activityLevel,
        projects,
        xpEarned: activityLevel * (Math.floor(Math.random() * 50) + 25),
        hoursSpent: activityLevel * (Math.random() * 2 + 0.5)
      });
    }
    
    return data;
  };

  const activityData = generateActivityData();
  
  // Calculate stats
  const stats: ActivityStats = {
    totalActiveDays: activityData.filter(day => day.activity > 0).length,
    currentStreak: calculateCurrentStreak(activityData),
    longestStreak: calculateLongestStreak(activityData),
    totalXP: activityData.reduce((sum, day) => sum + day.xpEarned, 0),
    totalHours: Math.round(activityData.reduce((sum, day) => sum + day.hoursSpent, 0)),
    projectsWorkedOn: [...new Set(activityData.flatMap(day => day.projects))].length
  };

  function calculateCurrentStreak(data: ActivityDay[]): number {
    let streak = 0;
    for (let i = data.length - 1; i >= 0; i--) {
      if (data[i].activity > 0) {
        streak++;
      } else {
        break;
      }
    }
    return streak;
  }

  function calculateLongestStreak(data: ActivityDay[]): number {
    let maxStreak = 0;
    let currentStreak = 0;
    
    for (const day of data) {
      if (day.activity > 0) {
        currentStreak++;
        maxStreak = Math.max(maxStreak, currentStreak);
      } else {
        currentStreak = 0;
      }
    }
    
    return maxStreak;
  }

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

  const getActivityDescription = (level: number): string => {
    switch (level) {
      case 0: return 'No activity';
      case 1: return 'Low activity';
      case 2: return 'Medium activity';
      case 3: return 'High activity';
      case 4: return 'Very high activity';
      default: return 'No activity';
    }
  };

  // Group data by weeks for calendar layout
  const groupByWeeks = (data: ActivityDay[]) => {
    const weeks: ActivityDay[][] = [];
    let currentWeek: ActivityDay[] = [];
    
    data.forEach((day, index) => {
      const date = new Date(day.date);
      const dayOfWeek = date.getDay(); // 0 = Sunday
      
      if (index === 0) {
        // Fill empty days at the start of the first week
        for (let i = 0; i < dayOfWeek; i++) {
          currentWeek.push({
            date: '',
            activity: -1,
            projects: [],
            xpEarned: 0,
            hoursSpent: 0
          });
        }
      }
      
      currentWeek.push(day);
      
      if (currentWeek.length === 7) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
    });
    
    // Add remaining days to the last week
    if (currentWeek.length > 0) {
      while (currentWeek.length < 7) {
        currentWeek.push({
          date: '',
          activity: -1,
          projects: [],
          xpEarned: 0,
          hoursSpent: 0
        });
      }
      weeks.push(currentWeek);
    }
    
    return weeks;
  };

  const weeks = groupByWeeks(activityData);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Calendar className="h-8 w-8 text-psyduck-primary" />
          <div>
            <h1 className="text-3xl font-bold">Activity Tracker</h1>
            <p className="text-muted-foreground">Track your daily coding progress</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Days</CardTitle>
            <Target className="h-4 w-4 text-psyduck-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-psyduck-primary">{stats.totalActiveDays}</div>
            <p className="text-xs text-muted-foreground">days this year</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
            <Flame className="h-4 w-4 text-psyduck-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-psyduck-success">{stats.currentStreak}</div>
            <p className="text-xs text-muted-foreground">consecutive days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Longest Streak</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.longestStreak}</div>
            <p className="text-xs text-muted-foreground">days record</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Hours</CardTitle>
            <Code className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalHours}</div>
            <p className="text-xs text-muted-foreground">hours coded</p>
          </CardContent>
        </Card>
      </div>

      {/* Activity Calendar */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Daily Activity</span>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Less</span>
              <div className="flex gap-1">
                {[0, 1, 2, 3, 4].map(level => (
                  <div 
                    key={level} 
                    className={`w-3 h-3 rounded-sm ${getActivityColor(level)}`}
                    title={getActivityDescription(level)}
                  />
                ))}
              </div>
              <span>More</span>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <div className="min-w-[800px]">
              {/* Month labels */}
              <div className="flex mb-2">
                <div className="w-12"></div>
                {months.map(month => (
                  <div key={month} className="flex-1 text-xs text-muted-foreground text-center">
                    {month}
                  </div>
                ))}
              </div>
              
              {/* Calendar grid */}
              <div className="flex">
                {/* Day labels */}
                <div className="w-12 flex flex-col justify-between text-xs text-muted-foreground">
                  {days.filter((_, i) => i % 2 === 1).map(day => (
                    <div key={day} className="h-3 flex items-center">{day}</div>
                  ))}
                </div>
                
                {/* Activity squares */}
                <div className="flex-1 grid grid-cols-53 gap-1">
                  {weeks.map((week, weekIndex) => 
                    week.map((day, dayIndex) => {
                      if (day.activity === -1) {
                        return <div key={`${weekIndex}-${dayIndex}`} className="w-3 h-3" />;
                      }
                      
                      return (
                        <div
                          key={`${weekIndex}-${dayIndex}`}
                          className={`w-3 h-3 rounded-sm ${getActivityColor(day.activity)} cursor-pointer hover:ring-2 hover:ring-psyduck-primary/50 transition-all`}
                          title={`${day.date}: ${day.xpEarned} XP earned${day.projects.length > 0 ? `, worked on ${day.projects.join(', ')}` : ''}`}
                        />
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {activityData.slice(-7).reverse().filter(day => day.activity > 0).slice(0, 5).map((day) => (
              <div key={day.date} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-4 h-4 rounded-full ${getActivityColor(day.activity)}`} />
                  <div>
                    <p className="font-medium">
                      {new Date(day.date).toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </p>
                    {day.projects.length > 0 && (
                      <div className="flex gap-1 mt-1">
                        {day.projects.map(project => (
                          <Badge key={project} variant="outline" className="text-xs">
                            {project}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-psyduck-primary">+{day.xpEarned} XP</div>
                  <div className="text-xs text-muted-foreground">
                    {Math.round(day.hoursSpent * 10) / 10}h coded
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Trophy, Medal, Award, TrendingUp, TrendingDown, Minus, Crown, Star, Zap } from "lucide-react";

interface LeaderboardUser {
  id: string;
  name: string;
  username: string;
  avatar?: string;
  xp: number;
  level: number;
  projectsCompleted: number;
  streak: number;
  rank: number;
  previousRank: number;
  badges: string[];
  isCurrentUser?: boolean;
}

export function Leaderboard() {
  const globalLeaderboard: LeaderboardUser[] = [
    {
      id: "1",
      name: "Alice Chen",
      username: "alice_codes",
      xp: 8500,
      level: 12,
      projectsCompleted: 35,
      streak: 45,
      rank: 1,
      previousRank: 2,
      badges: ["Full-Stack Hero", "AI Pioneer", "Streak Master"]
    },
    {
      id: "2", 
      name: "Bob Smith",
      username: "bob_builds",
      xp: 7800,
      level: 11,
      projectsCompleted: 32,
      streak: 28,
      rank: 2,
      previousRank: 1,
      badges: ["Mobile Master", "Data Wizard"]
    },
    {
      id: "3",
      name: "Carol Davis", 
      username: "carol_dev",
      xp: 7200,
      level: 10,
      projectsCompleted: 29,
      streak: 35,
      rank: 3,
      previousRank: 4,
      badges: ["Frontend Expert", "Design Pro"]
    },
    {
      id: "4",
      name: "David Lee",
      username: "david_codes",
      xp: 6800,
      level: 10,
      projectsCompleted: 27,
      streak: 15,
      rank: 4,
      previousRank: 3,
      badges: ["Backend Boss"]
    },
    {
      id: "5",
      name: "Emma Wilson",
      username: "emma_dev",
      xp: 6500,
      level: 9,
      projectsCompleted: 26,
      streak: 22,
      rank: 5,
      previousRank: 6,
      badges: ["Quick Learner", "Team Player"]
    }
  ];

  const weeklyLeaderboard: LeaderboardUser[] = [
    {
      id: "3",
      name: "Carol Davis",
      username: "carol_dev", 
      xp: 850,
      level: 10,
      projectsCompleted: 3,
      streak: 7,
      rank: 1,
      previousRank: 4,
      badges: ["Weekly Champion"]
    },
    {
      id: "1",
      name: "Alice Chen",
      username: "alice_codes",
      xp: 720,
      level: 12,
      projectsCompleted: 2,
      streak: 7,
      rank: 2,
      previousRank: 1,
      badges: ["Consistency King"]
    },
    {
      id: "7",
      name: "You",
      username: "john_doe",
      xp: 650,
      level: 5,
      projectsCompleted: 2,
      streak: 7,
      rank: 3,
      previousRank: 8,
      badges: ["Rising Star"],
      isCurrentUser: true
    }
  ];

  const topPerformers = [
    { title: "Most Projects Completed", user: "Alice Chen", value: "35 projects", icon: Trophy },
    { title: "Longest Streak", user: "Alice Chen", value: "45 days", icon: Zap },
    { title: "Highest Level", user: "Alice Chen", value: "Level 12", icon: Star },
    { title: "Most XP This Week", user: "Carol Davis", value: "850 XP", icon: TrendingUp }
  ];

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Crown className="h-5 w-5 text-yellow-500" />;
      case 2: return <Medal className="h-5 w-5 text-gray-400" />;
      case 3: return <Award className="h-5 w-5 text-amber-600" />;
      default: return <span className="text-sm font-bold text-muted-foreground">#{rank}</span>;
    }
  };

  const getRankChange = (current: number, previous: number) => {
    if (current < previous) {
      return <TrendingUp className="h-4 w-4 text-green-500" />;
    } else if (current > previous) {
      return <TrendingDown className="h-4 w-4 text-red-500" />;
    }
    return <Minus className="h-4 w-4 text-gray-400" />;
  };

  const LeaderboardTable = ({ users, showXPGained = false }: { users: LeaderboardUser[], showXPGained?: boolean }) => (
    <div className="space-y-2">
      {users.map((user) => (
        <Card key={user.id} className={`p-4 ${user.isCurrentUser ? 'ring-2 ring-psyduck-primary bg-psyduck-soft/20' : ''}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 w-12">
                {getRankIcon(user.rank)}
                {getRankChange(user.rank, user.previousRank)}
              </div>
              
              <Avatar className="h-10 w-10">
                <AvatarImage src={user.avatar} />
                <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold">{user.name}</h4>
                  {user.isCurrentUser && <Badge className="bg-psyduck-primary text-white">You</Badge>}
                </div>
                <p className="text-sm text-muted-foreground">@{user.username}</p>
                <div className="flex gap-1 mt-1">
                  {user.badges.slice(0, 2).map((badge) => (
                    <Badge key={badge} variant="outline" className="text-xs">
                      {badge}
                    </Badge>
                  ))}
                  {user.badges.length > 2 && (
                    <Badge variant="outline" className="text-xs">
                      +{user.badges.length - 2}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-lg font-bold text-psyduck-primary">
                {showXPGained ? `+${user.xp.toLocaleString()}` : user.xp.toLocaleString()} XP
              </div>
              <div className="text-sm text-muted-foreground">Level {user.level}</div>
              <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                <span>{user.projectsCompleted} projects</span>
                <span>{user.streak}🔥</span>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Leaderboard</h1>
        <p className="text-muted-foreground">
          See how you stack up against other learners in the community
        </p>
      </div>

      {/* Top Performers */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {topPerformers.map((performer, idx) => (
          <Card key={idx}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{performer.title}</CardTitle>
              <performer.icon className="h-4 w-4 text-psyduck-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold">{performer.value}</div>
              <p className="text-xs text-muted-foreground">{performer.user}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Leaderboard Tabs */}
      <Tabs defaultValue="global" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="global">Global</TabsTrigger>
          <TabsTrigger value="weekly">This Week</TabsTrigger>
          <TabsTrigger value="friends">Friends</TabsTrigger>
        </TabsList>

        <TabsContent value="global" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-yellow-500" />
                Global Leaderboard
              </CardTitle>
            </CardHeader>
            <CardContent>
              <LeaderboardTable users={globalLeaderboard} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="weekly" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-psyduck-primary" />
                Weekly Leaderboard
              </CardTitle>
            </CardHeader>
            <CardContent>
              <LeaderboardTable users={weeklyLeaderboard} showXPGained={true} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="friends" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 text-psyduck-success" />
                Friends Leaderboard
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">Connect with friends to see how you compare!</p>
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">Invite friends with your referral code:</div>
                  <Badge className="bg-psyduck-soft text-psyduck-primary px-4 py-2 text-sm">
                    PSYDUCK2024
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Your Stats */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Your Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-psyduck-primary">142</div>
              <div className="text-sm text-muted-foreground">Global Rank</div>
              <div className="text-xs text-green-600 mt-1">↑ 15 this week</div>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-psyduck-success">2,450</div>
              <div className="text-sm text-muted-foreground">Total XP</div>
              <div className="text-xs text-green-600 mt-1">+650 this week</div>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold">8</div>
              <div className="text-sm text-muted-foreground">Projects Done</div>
              <div className="text-xs text-green-600 mt-1">+2 this week</div>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold">12</div>
              <div className="text-sm text-muted-foreground">Day Streak</div>
              <div className="text-xs text-green-600 mt-1">Keep it up! 🔥</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
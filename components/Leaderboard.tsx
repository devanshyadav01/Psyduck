import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { Trophy, Medal, Award } from 'lucide-react';

export function Leaderboard() {
  // Mock leaderboard data
  const leaderboard = [
    { rank: 1, username: 'codemaster', xp: 15420, level: 12 },
    { rank: 2, username: 'devqueen', xp: 13890, level: 11 },
    { rank: 3, username: 'jswarrior', xp: 12650, level: 11 },
    { rank: 4, username: 'pythonista', xp: 11230, level: 10 },
    { rank: 5, username: 'reactninja', xp: 10890, level: 10 },
  ];

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-5 w-5 text-yellow-500" />;
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />;
      case 3:
        return <Award className="h-5 w-5 text-amber-600" />;
      default:
        return <span className="font-bold text-lg">#{rank}</span>;
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1>Leaderboard</h1>
        <p className="text-muted-foreground">
          See how you rank against other learners
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-psyduck-primary" />
            Global Rankings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {leaderboard.map((user) => (
              <div 
                key={user.rank}
                className="flex items-center gap-4 p-4 rounded-lg border"
              >
                <div className="flex items-center justify-center w-12">
                  {getRankIcon(user.rank)}
                </div>
                
                <Avatar className="h-10 w-10">
                  <AvatarFallback>
                    {user.username[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <p className="font-medium">{user.username}</p>
                  <p className="text-sm text-muted-foreground">
                    Level {user.level}
                  </p>
                </div>
                
                <div className="text-right">
                  <p className="font-bold text-psyduck-primary">
                    {user.xp.toLocaleString()} XP
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Progress } from './ui/progress';
import { useAuth } from '../contexts/AuthContext';

export function Profile() {
  const { user } = useAuth();

  if (!user) return null;

  const currentLevel = Math.floor(Math.sqrt((user.totalXp || 0) / 100));
  const xpForCurrentLevel = currentLevel * currentLevel * 100;
  const xpForNextLevel = (currentLevel + 1) * (currentLevel + 1) * 100;
  const progressToNextLevel = ((user.totalXp - xpForCurrentLevel) / (xpForNextLevel - xpForCurrentLevel)) * 100;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-6">
        <Avatar className="h-24 w-24">
          <AvatarImage src={user.avatarUrl} />
          <AvatarFallback className="text-2xl">
            {user.firstName?.[0]}{user.lastName?.[0]}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1">
          <h1>{user.firstName} {user.lastName}</h1>
          <p className="text-muted-foreground">@{user.username}</p>
          <div className="flex items-center gap-4 mt-2">
            <Badge variant="secondary">Level {currentLevel}</Badge>
            <span className="text-sm text-muted-foreground">
              {user.totalXp.toLocaleString()} XP
            </span>
          </div>
        </div>
        
        <Button variant="outline">
          Edit Profile
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Level Progress</CardTitle>
            <CardDescription>
              Progress to Level {currentLevel + 1}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Level {currentLevel}</span>
                <span>Level {currentLevel + 1}</span>
              </div>
              <Progress value={progressToNextLevel} />
              <div className="text-sm text-muted-foreground text-center">
                {Math.round(xpForNextLevel - user.totalXp)} XP to next level
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Statistics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span>Current Streak</span>
              <span className="font-medium">{user.currentStreak} days</span>
            </div>
            <div className="flex justify-between">
              <span>Longest Streak</span>
              <span className="font-medium">{user.longestStreak} days</span>
            </div>
            <div className="flex justify-between">
              <span>Skill Level</span>
              <Badge variant="outline">{user.skillLevel}</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
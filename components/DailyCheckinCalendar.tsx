import React, { useState } from 'react';
import { Button } from './ui/button';
import { Calendar } from './ui/calendar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Flame, Check, Star, TrendingUp, Calendar as CalendarIcon, Target } from 'lucide-react';
import { toast } from 'sonner';

interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastActivityDate: string;
  streakFreezeUsed?: number;
  streakFreezeAvailable?: number;
}

interface DailyCheckinCalendarProps {
  streakData?: StreakData;
  onCheckin: () => void;
  isLoading?: boolean;
}

export function DailyCheckinCalendar({ streakData, onCheckin, isLoading }: DailyCheckinCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  // Generate mock activity data for the calendar
  const generateActivityDates = () => {
    const dates: Date[] = [];
    const today = new Date();
    const currentStreak = streakData?.currentStreak || 0;
    
    // Add dates for current streak
    for (let i = 0; i < currentStreak; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      dates.push(date);
    }
    
    // Add some random past activity dates for a realistic calendar
    const pastDays = 30;
    for (let i = currentStreak + 2; i < pastDays; i++) {
      if (Math.random() > 0.3) { // 70% chance of activity
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        dates.push(date);
      }
    }
    
    return dates;
  };

  const activityDates = generateActivityDates();
  const today = new Date();
  const hasCheckedInToday = streakData?.lastActivityDate 
    ? new Date(streakData.lastActivityDate).toDateString() === today.toDateString()
    : false;

  const isActivityDate = (date: Date) => {
    return activityDates.some(activityDate => 
      activityDate.toDateString() === date.toDateString()
    );
  };

  const handleCheckin = () => {
    if (hasCheckedInToday) {
      toast.info('You\'ve already checked in today! 🦆');
      return;
    }
    
    onCheckin();
    toast.success('Daily check-in complete! 🔥 Keep the streak alive!');
  };

  const thisMonthActivity = activityDates.filter(date => {
    const now = new Date();
    return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
  }).length;

  const thisWeekActivity = activityDates.filter(date => {
    const now = new Date();
    const weekStart = new Date(now.setDate(now.getDate() - now.getDay()));
    return date >= weekStart;
  }).length;

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2">
          <CalendarIcon className="h-5 w-5 text-psyduck-primary" />
          <h2 className="text-xl font-semibold">Daily Check-in</h2>
        </div>
        <p className="text-sm text-muted-foreground">
          Stay consistent with your learning journey
        </p>
      </div>

      {/* Streak Stats Cards */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-red-500/10" />
          <CardContent className="p-4 relative">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                <Flame className="h-5 w-5 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-orange-700 dark:text-orange-300">
                  {streakData?.currentStreak || 0}
                </p>
                <p className="text-xs text-orange-600 dark:text-orange-400 font-medium">
                  Current Streak
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-psyduck-primary/10 to-psyduck-success/10" />
          <CardContent className="p-4 relative">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-psyduck-primary/20 rounded-lg">
                <Target className="h-5 w-5 text-psyduck-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-psyduck-primary">
                  {streakData?.longestStreak || 0}
                </p>
                <p className="text-xs text-psyduck-primary font-medium">
                  Best Streak
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Check-in Button */}
      <Card className="text-center">
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-psyduck-primary to-psyduck-success rounded-full flex items-center justify-center">
              {hasCheckedInToday ? (
                <Check className="h-8 w-8 text-white" />
              ) : (
                <Star className="h-8 w-8 text-white" />
              )}
            </div>
            
            <div>
              <h3 className="font-semibold mb-1">
                {hasCheckedInToday ? 'All Set for Today!' : 'Ready to Check In?'}
              </h3>
              <p className="text-sm text-muted-foreground">
                {hasCheckedInToday 
                  ? 'You\'ve completed your daily check-in. Great job!'
                  : 'Mark your daily learning activity and keep your streak alive!'
                }
              </p>
            </div>

            <Button
              size="lg"
              onClick={handleCheckin}
              disabled={isLoading || hasCheckedInToday}
              className={`w-full ${
                hasCheckedInToday 
                  ? 'bg-psyduck-success hover:bg-psyduck-success cursor-not-allowed' 
                  : 'bg-psyduck-primary hover:bg-psyduck-primary-hover'
              } text-white`}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Checking in...
                </div>
              ) : hasCheckedInToday ? (
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4" />
                  Checked In Today
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4" />
                  Check In Now
                </div>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Calendar Section */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <CalendarIcon className="h-5 w-5 text-psyduck-primary" />
            Activity Calendar
          </CardTitle>
          <CardDescription>
            Track your daily learning progress
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center mb-4">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-lg border-0"
              classNames={{
                months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
                month: "space-y-4",
                caption: "flex justify-center pt-1 relative items-center",
                caption_label: "text-sm font-medium",
                nav: "space-x-1 flex items-center",
                nav_button: "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
                nav_button_previous: "absolute left-1",
                nav_button_next: "absolute right-1",
                table: "w-full border-collapse space-y-1",
                head_row: "flex",
                head_cell: "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
                row: "flex w-full mt-2",
                cell: "h-9 w-9 text-center text-sm p-0 relative focus-within:relative focus-within:z-20",
                day: "h-9 w-9 p-0 font-normal hover:bg-accent hover:text-accent-foreground rounded-md transition-colors",
                day_range_end: "day-range-end",
                day_selected: "bg-psyduck-primary text-white hover:bg-psyduck-primary-hover focus:bg-psyduck-primary",
                day_today: hasCheckedInToday 
                  ? "bg-psyduck-success text-white font-bold" 
                  : "bg-accent text-accent-foreground font-bold border-2 border-psyduck-primary",
                day_outside: "day-outside text-muted-foreground opacity-50",
                day_disabled: "text-muted-foreground opacity-50",
                day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
                day_hidden: "invisible",
              }}
              modifiers={{
                activity: activityDates,
              }}
              modifiersStyles={{
                activity: {
                  backgroundColor: 'var(--color-psyduck-success)',
                  color: 'white',
                  fontWeight: 'bold',
                  borderRadius: '6px',
                },
              }}
              showOutsideDays={false}
            />
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center gap-6 text-xs">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 bg-psyduck-success rounded-sm"></div>
              <span>Active day</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 bg-psyduck-primary rounded-sm"></div>
              <span>Selected</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 border-2 border-psyduck-primary bg-accent rounded-sm"></div>
              <span>Today</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Activity Statistics */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="space-y-1">
              <p className="text-lg font-bold text-psyduck-primary">{activityDates.length}</p>
              <p className="text-xs text-muted-foreground">Total Days</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="space-y-1">
              <p className="text-lg font-bold text-psyduck-success">{thisWeekActivity}</p>
              <p className="text-xs text-muted-foreground">This Week</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="space-y-1">
              <p className="text-lg font-bold text-orange-600">{Math.round((thisMonthActivity / 30) * 100)}%</p>
              <p className="text-xs text-muted-foreground">This Month</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Motivational Message */}
      {(streakData?.currentStreak || 0) > 0 && (
        <Card className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-psyduck-primary/5 to-psyduck-success/5" />
          <CardContent className="p-4 relative">
            <div className="flex items-center gap-3">
              <TrendingUp className="h-5 w-5 text-psyduck-success" />
              <div>
                <p className="font-medium text-psyduck-success">Great momentum!</p>
                <p className="text-sm text-muted-foreground">
                  You're on a {streakData?.currentStreak}-day streak. Keep up the excellent work!
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
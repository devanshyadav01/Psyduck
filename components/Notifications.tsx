import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Bell, Check, Star, Trophy, Users, MessageCircle, GitPullRequest, Calendar, Flame, Target, X } from 'lucide-react';

interface Notification {
  id: number;
  type: 'achievement' | 'project' | 'social' | 'system' | 'reminder';
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
  avatar?: string;
  priority: 'low' | 'medium' | 'high';
}

const mockNotifications: Notification[] = [
  {
    id: 1,
    type: 'achievement',
    title: 'New Achievement Unlocked!',
    description: 'You earned the "Streak Master" achievement for maintaining a 7-day coding streak.',
    timestamp: '2024-01-20T10:30:00Z',
    read: false,
    priority: 'high'
  },
  {
    id: 2,
    type: 'project',
    title: 'Project Review Received',
    description: 'Sarah Chen left a 5-star review on your "E-Commerce Platform" project.',
    timestamp: '2024-01-20T09:15:00Z',
    read: false,
    avatar: 'SC',
    priority: 'medium'
  },
  {
    id: 3,
    type: 'social',
    title: 'New Follower',
    description: 'Mike Johnson started following you and liked your recent project.',
    timestamp: '2024-01-19T16:45:00Z',
    read: true,
    avatar: 'MJ',
    priority: 'low'
  },
  {
    id: 4,
    type: 'system',
    title: 'New Projects Available',
    description: '5 new AI/ML projects have been added to the platform. Check them out!',
    timestamp: '2024-01-19T14:20:00Z',
    read: true,
    priority: 'medium'
  },
  {
    id: 5,
    type: 'reminder',
    title: 'Daily Coding Reminder',
    description: "Don't break your streak! You haven't coded today yet.",
    timestamp: '2024-01-19T12:00:00Z',
    read: false,
    priority: 'high'
  },
  {
    id: 6,
    type: 'project',
    title: 'Project Milestone Reached',
    description: 'Congratulations! Your "Fitness Tracker App" project reached 50% completion.',
    timestamp: '2024-01-18T11:30:00Z',
    read: true,
    priority: 'medium'
  },
  {
    id: 7,
    type: 'social',
    title: 'Comment on Your Project',
    description: 'Alex Kumar commented on your "Task Management App" project asking about the tech stack.',
    timestamp: '2024-01-18T08:20:00Z',
    read: true,
    avatar: 'AK',
    priority: 'low'
  },
  {
    id: 8,
    type: 'achievement',
    title: 'Level Up!',
    description: 'Congratulations! You reached Level 12 and earned 500 XP bonus.',
    timestamp: '2024-01-17T15:45:00Z',
    read: true,
    priority: 'high'
  }
];

const notificationIcons = {
  achievement: Trophy,
  project: Target,
  social: Users,
  system: Bell,
  reminder: Calendar
};

const priorityColors = {
  low: 'border-l-gray-300',
  medium: 'border-l-yellow-400', 
  high: 'border-l-red-400'
};

export function Notifications() {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [activeTab, setActiveTab] = useState('all');

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: number) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const removeNotification = (id: number) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const getFilteredNotifications = () => {
    if (activeTab === 'all') return notifications;
    if (activeTab === 'unread') return notifications.filter(n => !n.read);
    return notifications.filter(n => n.type === activeTab);
  };

  const getRelativeTime = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInHours = Math.floor((now.getTime() - time.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return `${Math.floor(diffInHours / 168)}w ago`;
  };

  const filteredNotifications = getFilteredNotifications();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Notifications</h1>
            {unreadCount > 0 && (
              <p className="text-muted-foreground mt-1">
                You have {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
              </p>
            )}
          </div>
          
          {unreadCount > 0 && (
            <Button onClick={markAllAsRead} variant="outline">
              <Check className="h-4 w-4 mr-2" />
              Mark All Read
            </Button>
          )}
        </div>

        {/* Notification Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="grid w-full grid-cols-6 lg:w-[600px]">
            <TabsTrigger value="all" className="relative">
              All
              {unreadCount > 0 && (
                <Badge className="ml-1 h-5 w-5 p-0 text-xs bg-psyduck-primary">
                  {unreadCount}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="unread">Unread</TabsTrigger>
            <TabsTrigger value="achievement">
              <Trophy className="h-4 w-4" />
            </TabsTrigger>
            <TabsTrigger value="project">
              <Target className="h-4 w-4" />
            </TabsTrigger>
            <TabsTrigger value="social">
              <Users className="h-4 w-4" />
            </TabsTrigger>
            <TabsTrigger value="system">
              <Bell className="h-4 w-4" />
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-6">
            {filteredNotifications.length === 0 ? (
              <div className="text-center py-12">
                <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No notifications</h3>
                <p className="text-muted-foreground">
                  {activeTab === 'unread' 
                    ? "You're all caught up! No unread notifications."
                    : "You don't have any notifications in this category yet."
                  }
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredNotifications.map((notification) => {
                  const IconComponent = notificationIcons[notification.type];
                  return (
                    <Card 
                      key={notification.id} 
                      className={`border-l-4 ${priorityColors[notification.priority]} ${
                        !notification.read ? 'bg-muted/30' : ''
                      }`}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start gap-4">
                          {/* Icon or Avatar */}
                          <div className="flex-shrink-0">
                            {notification.avatar ? (
                              <Avatar className="h-10 w-10">
                                <AvatarImage src="" alt="User" />
                                <AvatarFallback>{notification.avatar}</AvatarFallback>
                              </Avatar>
                            ) : (
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                notification.type === 'achievement' ? 'bg-psyduck-primary' :
                                notification.type === 'project' ? 'bg-blue-500' :
                                notification.type === 'social' ? 'bg-green-500' :
                                notification.type === 'system' ? 'bg-purple-500' :
                                'bg-orange-500'
                              }`}>
                                <IconComponent className="h-5 w-5 text-white" />
                              </div>
                            )}
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1">
                                <h3 className={`font-medium ${!notification.read ? 'font-semibold' : ''}`}>
                                  {notification.title}
                                </h3>
                                <p className="text-sm text-muted-foreground mt-1">
                                  {notification.description}
                                </p>
                                <p className="text-xs text-muted-foreground mt-2">
                                  {getRelativeTime(notification.timestamp)}
                                </p>
                              </div>

                              {/* Actions */}
                              <div className="flex items-center gap-2">
                                {!notification.read && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => markAsRead(notification.id)}
                                    className="h-8 w-8 p-0"
                                  >
                                    <Check className="h-4 w-4" />
                                  </Button>
                                )}
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeNotification(notification.id)}
                                  className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>

                            {/* Action Button */}
                            {notification.actionUrl && (
                              <Button variant="outline" size="sm" className="mt-3">
                                View Details
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Notification Settings */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Notification Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Achievement notifications</h4>
                  <p className="text-sm text-muted-foreground">Get notified when you unlock achievements</p>
                </div>
                <Button variant="outline" size="sm">Configure</Button>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Project updates</h4>
                  <p className="text-sm text-muted-foreground">Notifications about project progress and reviews</p>
                </div>
                <Button variant="outline" size="sm">Configure</Button>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Social interactions</h4>
                  <p className="text-sm text-muted-foreground">Followers, comments, and mentions</p>
                </div>
                <Button variant="outline" size="sm">Configure</Button>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Daily reminders</h4>
                  <p className="text-sm text-muted-foreground">Reminders to maintain your coding streak</p>
                </div>
                <Button variant="outline" size="sm">Configure</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
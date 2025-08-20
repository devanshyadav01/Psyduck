import React, { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Progress } from './ui/progress';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { ScrollArea } from './ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Separator } from './ui/separator';
import { toast } from 'sonner';
import { useAuth } from '../contexts/AuthContext';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Edit, 
  Camera, 
  Save, 
  X, 
  Trophy, 
  Lock, 
  Star, 
  Zap, 
  Target, 
  Award, 
  Shield, 
  Crown,
  Github,
  Linkedin,
  Globe,
  Mail,
  MapPin,
  Calendar,
  Code,
  BookOpen,
  TrendingUp,
  Users,
  Clock,
  ExternalLink,
  Plus,
  Check,
  AlertCircle,
  Briefcase,
  GraduationCap,
  Heart,
  Coffee
} from 'lucide-react';

interface ProfileUpdateData {
  firstName: string;
  lastName: string;
  email: string;
  bio?: string;
  skillLevel: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert' | 'beginner' | 'intermediate' | 'advanced';
  preferredLanguages: string[];
  timezone: string;
  avatarUrl?: string;
  location?: string;
  website?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
  jobTitle?: string;
  company?: string;
  yearsOfExperience?: number;
  interests?: string[];
  goals?: string[];
}

interface BadgeInfo {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  category: 'achievement' | 'milestone' | 'skill' | 'special';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlocked: boolean;
  unlockedAt?: Date;
  progress?: {
    current: number;
    required: number;
  };
}

interface LearningPath {
  id: string;
  name: string;
  description: string;
  progress: number;
  totalProjects: number;
  completedProjects: number;
  estimatedTime: string;
  skills: string[];
}

interface ActivityItem {
  id: string;
  type: 'project_completed' | 'badge_earned' | 'streak_milestone' | 'level_up' | 'challenge_won';
  title: string;
  description: string;
  date: Date;
  xpEarned?: number;
  icon: React.ComponentType<{ className?: string }>;
}

export function Profile() {
  const { user, updateProfile } = useAuth();
  const queryClient = useQueryClient();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isBadgeDialogOpen, setIsBadgeDialogOpen] = useState(false);
  const [selectedBadge, setSelectedBadge] = useState<BadgeInfo | null>(null);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState<ProfileUpdateData>({
    firstName: (user as any)?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    bio: (user as any)?.bio || '',
    skillLevel: (user as any)?.skillLevel || 'Beginner',
    preferredLanguages: (user as any)?.preferredLanguages || [],
    timezone: (user as any)?.timezone || 'UTC',
    avatarUrl: (user as any)?.avatarUrl || (user as any)?.avatar || '',
    location: (user as any)?.location || '',
    website: (user as any)?.website || '',
    githubUrl: (user as any)?.githubUrl || '',
    linkedinUrl: (user as any)?.linkedinUrl || '',
    portfolioUrl: (user as any)?.portfolioUrl || '',
    jobTitle: (user as any)?.jobTitle || '',
    company: (user as any)?.company || '',
    yearsOfExperience: (user as any)?.yearsOfExperience || 0,
    interests: (user as any)?.interests || [],
    goals: (user as any)?.goals || [],
  });

  // Mock learning paths data
  const learningPaths: LearningPath[] = [
    {
      id: 'fullstack-dev',
      name: 'Full Stack Developer',
      description: 'Master both frontend and backend development',
      progress: 65,
      totalProjects: 12,
      completedProjects: 8,
      estimatedTime: '6 months',
      skills: ['React', 'Node.js', 'MongoDB', 'Express']
    },
    {
      id: 'mobile-dev',
      name: 'Mobile Developer',
      description: 'Build native and cross-platform mobile apps',
      progress: 30,
      totalProjects: 8,
      completedProjects: 2,
      estimatedTime: '4 months',
      skills: ['React Native', 'Flutter', 'Firebase']
    },
    {
      id: 'data-scientist',
      name: 'Data Scientist',
      description: 'Analyze data and build ML models',
      progress: 15,
      totalProjects: 10,
      completedProjects: 1,
      estimatedTime: '8 months',
      skills: ['Python', 'Pandas', 'TensorFlow', 'SQL']
    }
  ];

  // Mock recent activity
  const recentActivity: ActivityItem[] = [
    {
      id: '1',
      type: 'project_completed',
      title: 'Completed "E-commerce Dashboard"',
      description: 'Built a complete dashboard with React and Node.js',
      date: new Date('2024-01-20'),
      xpEarned: 250,
      icon: Trophy
    },
    {
      id: '2',
      type: 'badge_earned',
      title: 'Earned "Week Warrior" badge',
      description: 'Maintained a 7-day coding streak',
      date: new Date('2024-01-18'),
      xpEarned: 100,
      icon: Award
    },
    {
      id: '3',
      type: 'level_up',
      title: 'Level Up! Reached Level 5',
      description: 'Congratulations on your progress!',
      date: new Date('2024-01-15'),
      xpEarned: 500,
      icon: Star
    }
  ];

  // Mock badge data with detailed information
  const getAllBadges = (): BadgeInfo[] => {
    const safeTotalXp = (((user as any)?.totalXp ?? user?.xp) || 0) as number;
    const safeCurrentStreak = (((user as any)?.currentStreak ?? user?.streak) || 0) as number;
    const safeLongestStreak = (((user as any)?.longestStreak ?? safeCurrentStreak) || 0) as number;
    const completedProjectsCount = Array.isArray((user as any)?.completedProjects)
      ? (user as any).completedProjects.length
      : (user?.projects?.completed ?? 0);

    return [
    {
      id: 'first-project',
      name: 'First Steps',
      description: 'Complete your first project and begin your coding journey.',
      icon: Star,
      category: 'milestone',
      rarity: 'common',
      unlocked: completedProjectsCount > 0,
      unlockedAt: completedProjectsCount ? new Date('2024-01-15') : undefined,
    },
    {
      id: 'streak-7',
      name: 'Week Warrior',
      description: 'Maintain a 7-day coding streak. Consistency is key!',
      icon: Zap,
      category: 'achievement',
      rarity: 'common',
      unlocked: safeLongestStreak >= 7,
      unlockedAt: safeLongestStreak >= 7 ? new Date('2024-01-22') : undefined,
      progress: {
        current: Math.min(safeCurrentStreak, 7),
        required: 7,
      },
    },
    {
      id: 'streak-30',
      name: 'Monthly Master',
      description: 'Achieve a 30-day coding streak. Your dedication is remarkable!',
      icon: Target,
      category: 'achievement',
      rarity: 'rare',
      unlocked: safeLongestStreak >= 30,
      progress: {
        current: Math.min(safeLongestStreak, 30),
        required: 30,
      },
    },
    {
      id: 'xp-1000',
      name: 'Rising Coder',
      description: 'Earn 1,000 XP through completing challenges and projects.',
      icon: Award,
      category: 'milestone',
      rarity: 'common',
      unlocked: safeTotalXp >= 1000,
      unlockedAt: safeTotalXp >= 1000 ? new Date('2024-02-01') : undefined,
      progress: {
        current: Math.min(safeTotalXp, 1000),
        required: 1000,
      },
    },
    {
      id: 'xp-5000',
      name: 'Code Veteran',
      description: 'Accumulate 5,000 XP. You\'re becoming a true coding expert!',
      icon: Shield,
      category: 'milestone',
      rarity: 'rare',
      unlocked: safeTotalXp >= 5000,
      progress: {
        current: Math.min(safeTotalXp, 5000),
        required: 5000,
      },
    },
    {
      id: 'projects-10',
      name: 'Project Master',
      description: 'Complete 10 different projects across various technologies.',
      icon: Trophy,
      category: 'achievement',
      rarity: 'epic',
      unlocked: completedProjectsCount >= 10,
      progress: {
        current: Math.min(completedProjectsCount, 10),
        required: 10,
      },
    },
    {
      id: 'beta-tester',
      name: 'Beta Explorer',
      description: 'Joined Psyduck during the beta phase. Thank you for being an early adopter!',
      icon: Crown,
      category: 'special',
      rarity: 'legendary',
      unlocked: true,
      unlockedAt: new Date('2024-01-01'),
    },
  ];
  };

  const badges = getAllBadges();
  const unlockedBadges = badges.filter(badge => badge.unlocked);
  const lockedBadges = badges.filter(badge => !badge.unlocked);

  // Check if form has unsaved changes
  const hasUnsavedChanges = React.useMemo(() => {
    if (!user) return false;
    
    return Object.keys(formData).some(key => {
      const formValue = formData[key as keyof ProfileUpdateData];
      const userValue = user[key as keyof typeof user];
      
      if (Array.isArray(formValue) && Array.isArray(userValue)) {
        return JSON.stringify(formValue) !== JSON.stringify(userValue);
      }
      
      return formValue !== userValue;
    });
  }, [formData, user]);

  // Profile photo upload handler
  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB');
      return;
    }

    setIsUploadingPhoto(true);

    try {
      // Simulate file upload (in real app, this would upload to cloud storage)
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Create a mock URL for the uploaded image
      const mockImageUrl = URL.createObjectURL(file);
      
      // Update the form data
      setFormData(prev => ({
        ...prev,
        avatarUrl: mockImageUrl,
      }));

      toast.success('Profile photo uploaded successfully!');
    } catch (error) {
      toast.error('Failed to upload photo. Please try again.');
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  // Profile update mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (data: ProfileUpdateData) => {
      if (!user?.id) throw new Error('User not authenticated');
      
      console.log('🔄 Updating profile with data:', data);
      
      // Use the updateProfile function from AuthContext
      await updateProfile(data);
      
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['user', user?.id] });
      setIsEditDialogOpen(false);
      console.log('✅ Profile updated successfully with data:', data);
      
      toast.success('Profile updated successfully!');
    },
    onError: (error) => {
      console.error('❌ Profile update failed:', error);
      toast.error(`Failed to update profile: ${error.message || 'Please try again.'}`);
    },
  });

  const handleInputChange = (field: keyof ProfileUpdateData, value: string | string[] | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.firstName.trim() || !formData.lastName.trim() || !formData.email.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    updateProfileMutation.mutate(formData);
  };

  const resetForm = () => {
    setFormData({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      bio: user?.bio || '',
      skillLevel: user?.skillLevel || 'Beginner',
      preferredLanguages: user?.preferredLanguages || [],
      timezone: user?.timezone || 'UTC',
      avatarUrl: user?.avatarUrl || '',
      location: user?.location || '',
      website: user?.website || '',
      githubUrl: user?.githubUrl || '',
      linkedinUrl: user?.linkedinUrl || '',
      portfolioUrl: user?.portfolioUrl || '',
      jobTitle: user?.jobTitle || '',
      company: user?.company || '',
      yearsOfExperience: user?.yearsOfExperience || 0,
      interests: user?.interests || [],
      goals: user?.goals || [],
    });
  };

  const getBadgeColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'text-gray-600 bg-gray-100 border-gray-300';
      case 'rare': return 'text-blue-600 bg-blue-100 border-blue-300';
      case 'epic': return 'text-purple-600 bg-purple-100 border-purple-300';
      case 'legendary': return 'text-yellow-600 bg-yellow-100 border-yellow-300';
      default: return 'text-gray-600 bg-gray-100 border-gray-300';
    }
  };

  const handleBadgeClick = (badge: BadgeInfo) => {
    setSelectedBadge(badge);
    setIsBadgeDialogOpen(true);
  };

  if (!user) return null;

  const safeTotalXp = (((user as any).totalXp ?? user.xp) || 0) as number;
  const currentLevel = Math.floor(Math.sqrt((safeTotalXp) / 100));
  const xpForCurrentLevel = currentLevel * currentLevel * 100;
  const xpForNextLevel = (currentLevel + 1) * (currentLevel + 1) * 100;
  const progressToNextLevel = (((safeTotalXp - xpForCurrentLevel) / (xpForNextLevel - xpForCurrentLevel)) * 100);
  const completedProjectsCount = Array.isArray((user as any).completedProjects)
    ? (user as any).completedProjects.length
    : (user.projects?.completed ?? 0);

  const skillLevelOptions = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];
  const languageOptions = ['JavaScript', 'Python', 'Java', 'C++', 'React', 'Node.js', 'TypeScript', 'Go', 'Rust'];
  const timezoneOptions = [
    'UTC',
    'America/New_York',
    'America/Los_Angeles',
    'Europe/London',
    'Europe/Paris',
    'Asia/Tokyo',
    'Asia/Shanghai',
    'Australia/Sydney',
  ];

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Enhanced Profile Header */}
      <Card className="relative overflow-hidden psyduck-fade-in">
        <div className="absolute inset-0 bg-gradient-to-r from-psyduck-primary/10 via-psyduck-success/5 to-transparent" />
        <CardContent className="p-8 relative">
          <div className="flex flex-col md:flex-row items-start gap-6">
            {/* Avatar Section */}
            <div className="relative flex-shrink-0">
              <Avatar className="h-32 w-32 border-4 border-white shadow-lg overflow-hidden">
                <AvatarImage 
                  src={formData.avatarUrl || (user as any).avatarUrl || (user as any).avatar}
                  alt="Profile picture"
                  className="object-cover"
                />
                <AvatarFallback className="text-3xl bg-psyduck-primary text-white">
                  {(user as any).firstName?.[0] || (user?.username?.[0] || 'U').toUpperCase()}
                  {(user as any).lastName?.[0] || ''}
                </AvatarFallback>
              </Avatar>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
                title="Upload profile photo"
              />
              <Button
                size="sm"
                variant="outline"
                className="absolute -bottom-2 -right-2 h-10 w-10 rounded-full p-0 bg-white shadow-lg"
                title="Change avatar"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploadingPhoto}
              >
                {isUploadingPhoto ? (
                  <div className="w-4 h-4 border-2 border-psyduck-primary border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Camera className="h-5 w-5" />
                )}
              </Button>
            </div>
            
            {/* User Info */}
            <div className="flex-1 space-y-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-bold">{(user as any).firstName || user.displayName} {(user as any).lastName || ''}</h1>
                  <Badge variant="secondary" className="bg-psyduck-primary text-white">
                    Level {currentLevel}
                  </Badge>
                </div>
                
                <div className="flex items-center gap-2 text-muted-foreground mb-2">
                  <span>@{user.username}</span>
                  {(user as any).jobTitle && (
                    <>
                      <Separator orientation="vertical" className="h-4" />
                      <Briefcase className="h-4 w-4" />
                      <span>{(user as any).jobTitle}</span>
                      {(user as any).company && <span>at {(user as any).company}</span>}
                    </>
                  )}
                </div>
                
                {(user as any).location && (
                  <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
                    <MapPin className="h-4 w-4" />
                    <span>{(user as any).location}</span>
                  </div>
                )}
                
                {(user as any).bio && (
                  <p className="text-muted-foreground mb-4 max-w-2xl">{(user as any).bio}</p>
                )}
                
                {/* Social Links */}
                <div className="flex items-center gap-3">
                  {(user as any).githubUrl && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="p-2"
                            onClick={() => window.open((user as any).githubUrl, '_blank')}
                          >
                            <Github className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>GitHub Profile</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                  
                  {(user as any).linkedinUrl && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="p-2"
                            onClick={() => window.open((user as any).linkedinUrl, '_blank')}
                          >
                            <Linkedin className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>LinkedIn Profile</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                  
                  {(user as any).portfolioUrl && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="p-2"
                            onClick={() => window.open((user as any).portfolioUrl, '_blank')}
                          >
                            <Globe className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Portfolio Website</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                  
                  {(user as any).website && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="p-2"
                            onClick={() => window.open((user as any).website, '_blank')}
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Personal Website</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-psyduck-primary">{(((user as any).totalXp ?? user.xp) || 0).toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">Total XP</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-psyduck-success">{(user as any).currentStreak ?? user.streak}</p>
                  <p className="text-sm text-muted-foreground">Day Streak</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-orange-600">{completedProjectsCount}</p>
                  <p className="text-sm text-muted-foreground">Projects</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-yellow-600">{unlockedBadges.length}</p>
                  <p className="text-sm text-muted-foreground">Badges</p>
                </div>
              </div>
            </div>
            
            {/* Edit Profile Button */}
            <Dialog open={isEditDialogOpen} onOpenChange={(open) => {
              setIsEditDialogOpen(open);
              if (!open) resetForm();
            }}>
              <DialogTrigger asChild>
                <Button variant="outline" className="gap-2 flex-shrink-0">
                  <Edit className="h-4 w-4" />
                  Edit Profile
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    Edit Profile
                    {hasUnsavedChanges && (
                      <div className="h-2 w-2 bg-psyduck-primary rounded-full" title="Unsaved changes" />
                    )}
                  </DialogTitle>
                  <DialogDescription>
                    Update your profile information, social links, and preferences.
                    {hasUnsavedChanges && (
                      <span className="text-psyduck-primary"> • You have unsaved changes</span>
                    )}
                  </DialogDescription>
                </DialogHeader>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <Tabs defaultValue="basic" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="basic">Basic Info</TabsTrigger>
                      <TabsTrigger value="social">Social Links</TabsTrigger>
                      <TabsTrigger value="preferences">Preferences</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="basic" className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="firstName">First Name *</Label>
                          <Input
                            id="firstName"
                            value={formData.firstName}
                            onChange={(e) => handleInputChange('firstName', e.target.value)}
                            placeholder="Enter first name"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="lastName">Last Name *</Label>
                          <Input
                            id="lastName"
                            value={formData.lastName}
                            onChange={(e) => handleInputChange('lastName', e.target.value)}
                            placeholder="Enter last name"
                            required
                          />
                        </div>
                      </div>
                      
                      <div>
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          placeholder="Enter email address"
                          required
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="jobTitle">Job Title</Label>
                          <Input
                            id="jobTitle"
                            value={formData.jobTitle}
                            onChange={(e) => handleInputChange('jobTitle', e.target.value)}
                            placeholder="e.g. Software Developer"
                          />
                        </div>
                        <div>
                          <Label htmlFor="company">Company</Label>
                          <Input
                            id="company"
                            value={formData.company}
                            onChange={(e) => handleInputChange('company', e.target.value)}
                            placeholder="e.g. Google, Microsoft"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <Label htmlFor="location">Location</Label>
                        <Input
                          id="location"
                          value={formData.location}
                          onChange={(e) => handleInputChange('location', e.target.value)}
                          placeholder="e.g. San Francisco, CA"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea
                          id="bio"
                          value={formData.bio}
                          onChange={(e) => handleInputChange('bio', e.target.value)}
                          placeholder="Tell us about yourself..."
                          rows={3}
                        />
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="social" className="space-y-4">
                      <div>
                        <Label htmlFor="githubUrl">GitHub Profile</Label>
                        <div className="relative">
                          <Github className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="githubUrl"
                            value={formData.githubUrl}
                            onChange={(e) => handleInputChange('githubUrl', e.target.value)}
                            placeholder="https://github.com/username"
                            className="pl-10"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <Label htmlFor="linkedinUrl">LinkedIn Profile</Label>
                        <div className="relative">
                          <Linkedin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="linkedinUrl"
                            value={formData.linkedinUrl}
                            onChange={(e) => handleInputChange('linkedinUrl', e.target.value)}
                            placeholder="https://linkedin.com/in/username"
                            className="pl-10"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <Label htmlFor="portfolioUrl">Portfolio Website</Label>
                        <div className="relative">
                          <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="portfolioUrl"
                            value={formData.portfolioUrl}
                            onChange={(e) => handleInputChange('portfolioUrl', e.target.value)}
                            placeholder="https://yourportfolio.com"
                            className="pl-10"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <Label htmlFor="website">Personal Website</Label>
                        <div className="relative">
                          <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="website"
                            value={formData.website}
                            onChange={(e) => handleInputChange('website', e.target.value)}
                            placeholder="https://yourwebsite.com"
                            className="pl-10"
                          />
                        </div>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="preferences" className="space-y-4">
                      <div>
                        <Label htmlFor="skillLevel">Skill Level</Label>
                        <Select 
                          value={formData.skillLevel} 
                          onValueChange={(value) => handleInputChange('skillLevel', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select your skill level" />
                          </SelectTrigger>
                          <SelectContent>
                            {skillLevelOptions.map((level) => (
                              <SelectItem key={level} value={level}>
                                {level}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="yearsOfExperience">Years of Experience</Label>
                        <Input
                          id="yearsOfExperience"
                          type="number"
                          min="0"
                          max="50"
                          value={formData.yearsOfExperience}
                          onChange={(e) => handleInputChange('yearsOfExperience', parseInt(e.target.value) || 0)}
                          placeholder="0"
                        />
                      </div>

                      <div>
                        <Label htmlFor="timezone">Timezone</Label>
                        <Select 
                          value={formData.timezone} 
                          onValueChange={(value) => handleInputChange('timezone', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select your timezone" />
                          </SelectTrigger>
                          <SelectContent>
                            {timezoneOptions.map((tz) => (
                              <SelectItem key={tz} value={tz}>
                                {tz.replace('_', ' ')}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </TabsContent>
                  </Tabs>

                  <DialogFooter className="gap-2">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setIsEditDialogOpen(false)}
                      disabled={updateProfileMutation.isPending}
                    >
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                    <Button 
                      type="submit" 
                      disabled={updateProfileMutation.isPending || !hasUnsavedChanges}
                      className={`text-white transition-colors ${
                        hasUnsavedChanges 
                          ? 'bg-psyduck-primary hover:bg-psyduck-primary-hover' 
                          : 'bg-muted-foreground cursor-not-allowed'
                      }`}
                    >
                      <Save className="h-4 w-4 mr-2" />
                      {updateProfileMutation.isPending 
                        ? 'Saving...' 
                        : hasUnsavedChanges 
                          ? 'Save Changes' 
                          : 'No Changes'
                      }
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>

      {/* Profile Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <div className="flex items-center justify-center">
          <TabsList className="grid w-full max-w-2xl grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="learning">Learning</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="stats">Statistics</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Level Progress */}
            <Card className="psyduck-fade-in">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-psyduck-success" />
                  Level Progress
                </CardTitle>
                <CardDescription>
                  Progress to Level {currentLevel + 1}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span>Level {currentLevel}</span>
                    <span>Level {currentLevel + 1}</span>
                  </div>
                  <Progress value={progressToNextLevel} className="h-3" />
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">
                      {Math.round(xpForNextLevel - (((user as any).totalXp ?? user.xp) || 0))} XP to next level
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Current Learning Path */}
            <Card className="psyduck-fade-in">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-psyduck-primary" />
                  Current Learning Path
                </CardTitle>
              </CardHeader>
              <CardContent>
                {learningPaths[0] && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{learningPaths[0].name}</h4>
                      <Badge variant="outline">{learningPaths[0].progress}%</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{learningPaths[0].description}</p>
                    <Progress value={learningPaths[0].progress} className="h-2" />
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>{learningPaths[0].completedProjects}/{learningPaths[0].totalProjects} projects</span>
                      <span>{learningPaths[0].estimatedTime} remaining</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card className="psyduck-fade-in">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Jump back into your learning journey
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button className="h-16 flex flex-col gap-2 bg-psyduck-primary hover:bg-psyduck-primary-hover">
                  <Code className="h-5 w-5" />
                  <span>Continue Coding</span>
                </Button>
                <Button variant="outline" className="h-16 flex flex-col gap-2">
                  <BookOpen className="h-5 w-5" />
                  <span>Browse Projects</span>
                </Button>
                <Button variant="outline" className="h-16 flex flex-col gap-2">
                  <Users className="h-5 w-5" />
                  <span>Join Community</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="learning" className="space-y-6">
          {/* Learning Paths */}
          <Card className="psyduck-fade-in">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-psyduck-primary" />
                Learning Paths
              </CardTitle>
              <CardDescription>
                Track your progress across different career paths
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {learningPaths.map(path => (
                  <div key={path.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-medium">{path.name}</h4>
                        <p className="text-sm text-muted-foreground">{path.description}</p>
                      </div>
                      <Badge variant={path.progress > 50 ? "default" : "outline"} className="font-medium">
                        {path.progress}%
                      </Badge>
                    </div>
                    
                    <Progress value={path.progress} className="mb-3" />
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Target className="h-4 w-4 text-muted-foreground" />
                        <span>{path.completedProjects}/{path.totalProjects} projects</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>{path.estimatedTime}</span>
                      </div>
                      <div className="col-span-2 md:col-span-1">
                        <div className="flex flex-wrap gap-1">
                          {path.skills.slice(0, 2).map(skill => (
                            <Badge key={skill} variant="secondary" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                          {path.skills.length > 2 && (
                            <Badge variant="secondary" className="text-xs">
                              +{path.skills.length - 2}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="achievements" className="space-y-6">
          {/* Badges & Achievements */}
          <Card className="psyduck-fade-in">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-yellow-500" />
                    Badges & Achievements
                  </CardTitle>
                  <CardDescription>
                    {unlockedBadges.length} unlocked • {lockedBadges.length} to discover
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Unlocked Badges */}
                {unlockedBadges.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-3 text-psyduck-success flex items-center gap-2">
                      <Check className="h-4 w-4" />
                      Unlocked ({unlockedBadges.length})
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                      {unlockedBadges.map((badge) => {
                        const IconComponent = badge.icon;
                        return (
                          <TooltipProvider key={badge.id}>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div
                                  className={`p-3 rounded-lg border-2 cursor-pointer hover:scale-105 transition-transform ${getBadgeColor(badge.rarity)}`}
                                  onClick={() => handleBadgeClick(badge)}
                                >
                                  <div className="flex flex-col items-center gap-2">
                                    <IconComponent className="h-8 w-8" />
                                    <span className="text-xs font-medium text-center leading-tight">
                                      {badge.name}
                                    </span>
                                  </div>
                                </div>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="font-medium">{badge.name}</p>
                                <p className="text-sm text-muted-foreground">{badge.description}</p>
                                {badge.unlockedAt && (
                                  <p className="text-xs text-muted-foreground mt-1">
                                    Unlocked: {badge.unlockedAt.toLocaleDateString()}
                                  </p>
                                )}
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Locked Badges */}
                {lockedBadges.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-3 text-muted-foreground flex items-center gap-2">
                      <Lock className="h-4 w-4" />
                      Locked ({lockedBadges.length})
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                      {lockedBadges.slice(0, 12).map((badge) => {
                        const IconComponent = badge.icon;
                        const progress = badge.progress;
                        return (
                          <TooltipProvider key={badge.id}>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div
                                  className="p-3 rounded-lg border-2 border-muted bg-muted/30 cursor-pointer hover:scale-105 transition-transform opacity-60"
                                  onClick={() => handleBadgeClick(badge)}
                                >
                                  <div className="flex flex-col items-center gap-2">
                                    <div className="relative">
                                      <IconComponent className="h-8 w-8 text-muted-foreground" />
                                      <Lock className="h-4 w-4 absolute -top-1 -right-1 text-muted-foreground" />
                                    </div>
                                    <span className="text-xs font-medium text-center leading-tight text-muted-foreground">
                                      {badge.name}
                                    </span>
                                    {progress && (
                                      <div className="w-full bg-muted rounded-full h-1">
                                        <div 
                                          className="bg-psyduck-primary h-1 rounded-full transition-all"
                                          data-progress-width={(progress.current / progress.required) * 100}
                                          style={{ width: `${(progress.current / progress.required) * 100}%` }}
                                        />
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="font-medium">{badge.name}</p>
                                <p className="text-sm text-muted-foreground">{badge.description}</p>
                                {progress && (
                                  <p className="text-xs text-muted-foreground mt-1">
                                    Progress: {progress.current}/{progress.required}
                                  </p>
                                )}
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="space-y-6">
          {/* Recent Activity */}
          <Card className="psyduck-fade-in">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-psyduck-primary" />
                Recent Activity
              </CardTitle>
              <CardDescription>
                Your coding journey highlights
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map(activity => {
                  const IconComponent = activity.icon;
                  return (
                    <div key={activity.id} className="flex items-start gap-4 p-4 border rounded-lg">
                      <div className="p-2 bg-psyduck-primary/10 rounded-lg">
                        <IconComponent className="h-5 w-5 text-psyduck-primary" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{activity.title}</h4>
                        <p className="text-sm text-muted-foreground">{activity.description}</p>
                        <div className="flex items-center gap-3 mt-2 text-sm">
                          <span className="text-muted-foreground">
                            {activity.date.toLocaleDateString()}
                          </span>
                          {activity.xpEarned && (
                            <Badge variant="secondary" className="bg-psyduck-success/10 text-psyduck-success">
                              +{activity.xpEarned} XP
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stats" className="space-y-6">
          {/* Detailed Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="psyduck-fade-in">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-psyduck-success" />
                  Learning Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Total XP</span>
                  <span className="font-medium">{(((user as any).totalXp ?? user.xp) || 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Current Level</span>
                  <span className="font-medium">Level {currentLevel}</span>
                </div>
                <div className="flex justify-between">
                  <span>Projects Completed</span>
                  <span className="font-medium">{completedProjectsCount}</span>
                </div>
                <div className="flex justify-between">
                  <span>Skill Level</span>
                  <Badge variant="outline">{(user as any).skillLevel || 'Beginner'}</Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="psyduck-fade-in">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Zap className="h-5 w-5 text-orange-500" />
                  Streak Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Current Streak</span>
                  <span className="font-medium text-psyduck-success">{(user as any).currentStreak ?? user.streak} days</span>
                </div>
                <div className="flex justify-between">
                  <span>Longest Streak</span>
                  <span className="font-medium">{(user as any).longestStreak ?? (user as any).currentStreak ?? user.streak} days</span>
                </div>
                <div className="flex justify-between">
                  <span>This Week</span>
                  <span className="font-medium">5 days</span>
                </div>
                <div className="flex justify-between">
                  <span>This Month</span>
                  <span className="font-medium">22 days</span>
                </div>
              </CardContent>
            </Card>

            <Card className="psyduck-fade-in">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Award className="h-5 w-5 text-yellow-500" />
                  Achievement Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Badges Earned</span>
                  <span className="font-medium">{unlockedBadges.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Completion Rate</span>
                  <span className="font-medium">
                    {Math.round((unlockedBadges.length / badges.length) * 100)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Rare Badges</span>
                  <span className="font-medium">
                    {unlockedBadges.filter(b => b.rarity === 'rare' || b.rarity === 'epic' || b.rarity === 'legendary').length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Learning Paths</span>
                  <span className="font-medium">{learningPaths.length}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Badge Detail Dialog */}
      <Dialog open={isBadgeDialogOpen} onOpenChange={setIsBadgeDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          {selectedBadge && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${getBadgeColor(selectedBadge.rarity)}`}>
                    <selectedBadge.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span>{selectedBadge.name}</span>
                      {!selectedBadge.unlocked && <Lock className="h-4 w-4 text-muted-foreground" />}
                    </div>
                    <Badge variant="outline" className={`text-xs mt-1 ${getBadgeColor(selectedBadge.rarity)}`}>
                      {selectedBadge.rarity.toUpperCase()}
                    </Badge>
                  </div>
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <p className="text-muted-foreground">{selectedBadge.description}</p>
                
                {selectedBadge.unlocked ? (
                  <div className="p-3 bg-psyduck-success-light rounded-lg">
                    <div className="flex items-center gap-2 text-psyduck-success">
                      <Trophy className="h-4 w-4" />
                      <span className="font-medium">Unlocked!</span>
                    </div>
                    {selectedBadge.unlockedAt && (
                      <p className="text-sm text-muted-foreground mt-1">
                        Earned on {selectedBadge.unlockedAt.toLocaleDateString()}
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {selectedBadge.progress && (
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>Progress</span>
                          <span>{selectedBadge.progress.current}/{selectedBadge.progress.required}</span>
                        </div>
                        <Progress 
                          value={(selectedBadge.progress.current / selectedBadge.progress.required) * 100} 
                          className="h-2"
                        />
                      </div>
                    )}
                    <div className="p-3 bg-muted rounded-lg">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Lock className="h-4 w-4" />
                        <span className="font-medium">Locked</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        Complete the requirements above to unlock this badge!
                      </p>
                    </div>
                  </div>
                )}
                
                <div className="text-sm text-muted-foreground">
                  <span className="font-medium">Category:</span> {selectedBadge.category}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Alert, AlertDescription } from './ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { 
  Video, 
  Plus, 
  X, 
  Eye, 
  Edit, 
  Trash2, 
  Upload, 
  CheckCircle, 
  AlertCircle, 
  Crown,
  Youtube,
  Tag,
  Clock,
  Users,
  TrendingUp,
  Star
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';
import { PremiumUpgradeDialog } from './PremiumUpgrade';

interface VideoContent {
  id: string;
  title: string;
  youtubeUrl: string;
  description: string;
  tags: string[];
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  estimatedDuration: string;
  createdAt: Date;
  status: 'pending' | 'approved' | 'rejected';
  views: number;
  likes: number;
  creatorId: string;
}

const AVAILABLE_TAGS = [
  // Programming Languages
  'JavaScript', 'Python', 'Java', 'C++', 'TypeScript', 'Go', 'Rust', 'PHP', 'C#', 'Ruby',
  // Web Development
  'React', 'Vue.js', 'Angular', 'Node.js', 'HTML', 'CSS', 'Tailwind CSS', 'Bootstrap', 'SASS', 'Webpack',
  // Backend & Databases
  'MongoDB', 'PostgreSQL', 'MySQL', 'Redis', 'GraphQL', 'REST API', 'Express.js', 'Django', 'Flask',
  // Mobile Development
  'React Native', 'Flutter', 'Swift', 'Kotlin', 'Ionic', 'Xamarin',
  // Data Science & AI
  'Machine Learning', 'Deep Learning', 'TensorFlow', 'PyTorch', 'Pandas', 'NumPy', 'Data Analysis',
  // DevOps & Tools
  'Docker', 'Kubernetes', 'AWS', 'Azure', 'Git', 'Linux', 'Jenkins', 'Terraform',
  // Design & UI/UX
  'UI Design', 'UX Design', 'Figma', 'Photoshop', 'Prototyping',
  // Project Types
  'Tutorial', 'Project Build', 'Code Review', 'Best Practices', 'Debugging', 'Performance', 'Testing'
];

const CATEGORIES = [
  'Web Development',
  'Mobile Development', 
  'Data Science',
  'Machine Learning',
  'DevOps',
  'UI/UX Design',
  'Programming Fundamentals',
  'Database Design',
  'System Design',
  'Career Guidance'
];

export function ContentCreator() {
  const { user, upgradeToPremium } = useAuth();
  const [activeTab, setActiveTab] = useState('create');
  const [submittedContent, setSubmittedContent] = useState<VideoContent[]>([]);
  const [selectedContent, setSelectedContent] = useState<VideoContent | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUpgrading, setIsUpgrading] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    youtubeUrl: '',
    description: '',
    tags: [] as string[],
    category: '',
    difficulty: 'Beginner' as const,
    estimatedDuration: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // Check if user has premium membership
  const hasPremiumAccess = user?.membership === 'premium' || user?.membership === 'pro';

  // Load submitted content on mount
  useEffect(() => {
    if (user?.id) {
      const savedContent = localStorage.getItem(`content_creator_${user.id}`);
      if (savedContent) {
        try {
          const raw = JSON.parse(savedContent);
          const normalized: VideoContent[] = Array.isArray(raw)
            ? raw.map((c: any) => ({
                id: String(c.id || `content_${Date.now()}`),
                title: String(c.title || ''),
                youtubeUrl: String(c.youtubeUrl || ''),
                description: String(c.description || ''),
                tags: Array.isArray(c.tags) ? c.tags.map(String) : [],
                category: String(c.category || ''),
                difficulty: (c.difficulty === 'Beginner' || c.difficulty === 'Intermediate' || c.difficulty === 'Advanced') ? c.difficulty : 'Beginner',
                estimatedDuration: String(c.estimatedDuration || ''),
                createdAt: new Date(c.createdAt || Date.now()),
                status: (c.status === 'pending' || c.status === 'approved' || c.status === 'rejected') ? c.status : 'pending',
                views: Number.isFinite(c.views) ? c.views : 0,
                likes: Number.isFinite(c.likes) ? c.likes : 0,
                creatorId: String(c.creatorId || user.id),
              }))
            : [];
          setSubmittedContent(normalized);
        } catch (error) {
          console.error('Error loading content:', error);
        }
      }
    }
  }, [user?.id]);

  // Simple YouTube URL validation using string methods only
  const validateYouTubeUrl = (url: string) => {
    if (!url || typeof url !== 'string') return false;
    
    const lowerUrl = url.toLowerCase();
    return (
      lowerUrl.includes('youtube.com') || 
      lowerUrl.includes('youtu.be') ||
      lowerUrl.includes('youtube.co.uk')
    ) && (
      lowerUrl.includes('watch') || 
      lowerUrl.includes('embed') || 
      lowerUrl.includes('youtu.be/')
    );
  };

  // Simple video ID extraction using string methods only
  const extractVideoId = (url: string) => {
    if (!url || typeof url !== 'string') return null;
    
    try {
      // Handle youtube.com/watch?v= format
      if (url.includes('youtube.com/watch')) {
        const vIndex = url.indexOf('v=');
        if (vIndex === -1) return null;
        
        const startIndex = vIndex + 2;
        let endIndex = url.indexOf('&', startIndex);
        if (endIndex === -1) endIndex = url.length;
        
        const videoId = url.substring(startIndex, endIndex);
        return videoId.length === 11 ? videoId : null;
      }
      
      // Handle youtu.be/ format
      if (url.includes('youtu.be/')) {
        const startIndex = url.indexOf('youtu.be/') + 9;
        let endIndex = url.indexOf('?', startIndex);
        if (endIndex === -1) endIndex = url.indexOf('#', startIndex);
        if (endIndex === -1) endIndex = url.length;
        
        const videoId = url.substring(startIndex, endIndex);
        return videoId.length === 11 ? videoId : null;
      }
      
      // Handle youtube.com/embed/ format
      if (url.includes('youtube.com/embed/')) {
        const startIndex = url.indexOf('youtube.com/embed/') + 18;
        let endIndex = url.indexOf('?', startIndex);
        if (endIndex === -1) endIndex = url.indexOf('#', startIndex);
        if (endIndex === -1) endIndex = url.length;
        
        const videoId = url.substring(startIndex, endIndex);
        return videoId.length === 11 ? videoId : null;
      }
      
      return null;
    } catch (error) {
      console.warn('Error extracting video ID:', error);
      return null;
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.youtubeUrl.trim()) {
      newErrors.youtubeUrl = 'YouTube URL is required';
    } else if (!validateYouTubeUrl(formData.youtubeUrl)) {
      newErrors.youtubeUrl = 'Please provide a valid YouTube URL';
    }
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (formData.description.length < 50) newErrors.description = 'Description must be at least 50 characters';
    if (selectedTags.length === 0) newErrors.tags = 'Please select at least one tag';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.estimatedDuration.trim()) newErrors.estimatedDuration = 'Estimated duration is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please correct the errors in the form');
      return;
    }

    setIsSubmitting(true);
    try {
      const newContent: VideoContent = {
        id: `content_${Date.now()}`,
        ...formData,
        tags: selectedTags,
        createdAt: new Date(),
        status: 'pending',
        views: 0,
        likes: 0,
        creatorId: user?.id || ''
      };

      const updatedContent = [...submittedContent, newContent];
      setSubmittedContent(updatedContent);
      
      // Save to localStorage
      if (user?.id) {
        localStorage.setItem(`content_creator_${user.id}`, JSON.stringify(updatedContent));
      }

      // Reset form
      setFormData({
        title: '',
        youtubeUrl: '',
        description: '',
        tags: [],
        category: '',
        difficulty: 'Beginner',
        estimatedDuration: ''
      });
      setSelectedTags([]);
      setErrors({});

      toast.success('Content submitted successfully! It will be reviewed by our team.');
      setActiveTab('manage');
    } catch (error) {
      console.error('Error submitting content:', error);
      toast.error('Failed to submit content. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const deleteContent = (contentId: string) => {
    const updatedContent = submittedContent.filter(content => content.id !== contentId);
    setSubmittedContent(updatedContent);
    
    if (user?.id) {
      localStorage.setItem(`content_creator_${user.id}`, JSON.stringify(updatedContent));
    }
    
    toast.success('Content deleted successfully');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'approved': return 'text-green-600 bg-green-100';
      case 'rejected': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getThumbnailUrl = (url: string) => {
    const videoId = extractVideoId(url);
    return videoId ? `https://img.youtube.com/vi/${videoId}/mqdefault.jpg` : null;
  };

  const handleUpgradeClick = async () => {
    setIsUpgrading(true);
    try {
      await upgradeToPremium();
    } finally {
      setIsUpgrading(false);
    }
  };

  if (!hasPremiumAccess) {
    return (
      <div className="min-h-screen bg-background">
        <div className="border-b bg-card">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center gap-3">
              <Crown className="h-6 w-6 text-yellow-500" />
              <div>
                <h1 className="text-xl font-semibold">Content Creator Studio</h1>
                <p className="text-sm text-muted-foreground">Share your knowledge with the community</p>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto text-center">
            <Card className="border-dashed border-2 border-yellow-500/50 bg-yellow-50/50">
              <CardContent className="p-8">
                <Crown className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
                <h2 className="text-xl font-semibold mb-2">Premium Feature</h2>
                <p className="text-muted-foreground mb-6">
                  The Content Creator Studio is exclusively available to Premium members. 
                  Upgrade your membership to start sharing your knowledge and earn rewards!
                </p>
                
                <div className="space-y-4 mb-6">
                  <div className="flex items-center justify-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-psyduck-success" />
                    <span>Submit educational video content</span>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-psyduck-success" />
                    <span>Earn XP and badges for approved content</span>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-psyduck-success" />
                    <span>Build your reputation in the community</span>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-psyduck-success" />
                    <span>Get recognized by potential employers</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <PremiumUpgradeDialog>
                    <Button className="w-full bg-yellow-500 hover:bg-yellow-600 text-white">
                      <Crown className="h-4 w-4 mr-2" />
                      Upgrade to Premium
                    </Button>
                  </PremiumUpgradeDialog>
                  
                  <Button 
                    variant="outline" 
                    onClick={handleUpgradeClick}
                    disabled={isUpgrading}
                    className="w-full"
                  >
                    {isUpgrading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2" />
                        Upgrading...
                      </>
                    ) : (
                      <>
                        <Star className="h-4 w-4 mr-2" />
                        Quick Upgrade
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Video className="h-6 w-6 text-psyduck-primary" />
              <div>
                <h1 className="text-xl font-semibold">Content Creator Studio</h1>
                <p className="text-sm text-muted-foreground">Share your knowledge with the community</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                <Crown className="h-3 w-3 mr-1" />
                Premium
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="create" className="gap-2">
                <Plus className="h-4 w-4" />
                Create Content
              </TabsTrigger>
              <TabsTrigger value="manage" className="gap-2">
                <Eye className="h-4 w-4" />
                Manage Content ({submittedContent.length})
              </TabsTrigger>
              <TabsTrigger value="analytics" className="gap-2">
                <TrendingUp className="h-4 w-4" />
                Analytics
              </TabsTrigger>
            </TabsList>

            {/* Create Content Tab */}
            <TabsContent value="create" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Upload className="h-5 w-5 text-psyduck-primary" />
                    Submit New Video Content
                  </CardTitle>
                  <CardDescription>
                    Share educational videos to help other learners. Your content will be reviewed by our team before being published.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Information */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Basic Information</h3>
                      
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="title">Video Title *</Label>
                          <Input
                            id="title"
                            value={formData.title}
                            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                            placeholder="e.g., Complete React Tutorial for Beginners"
                            className={errors.title ? 'border-destructive' : ''}
                          />
                          {errors.title && <p className="text-sm text-destructive">{errors.title}</p>}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="category">Category *</Label>
                          <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                            <SelectTrigger className={errors.category ? 'border-destructive' : ''}>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                              {CATEGORIES.map((category) => (
                                <SelectItem key={category} value={category}>
                                  {category}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {errors.category && <p className="text-sm text-destructive">{errors.category}</p>}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="youtubeUrl" className="flex items-center gap-2">
                          <Youtube className="h-4 w-4 text-red-500" />
                          YouTube URL *
                        </Label>
                        <Input
                          id="youtubeUrl"
                          value={formData.youtubeUrl}
                          onChange={(e) => setFormData(prev => ({ ...prev, youtubeUrl: e.target.value }))}
                          placeholder="https://www.youtube.com/watch?v=..."
                          className={errors.youtubeUrl ? 'border-destructive' : ''}
                        />
                        {errors.youtubeUrl && <p className="text-sm text-destructive">{errors.youtubeUrl}</p>}
                        {formData.youtubeUrl && validateYouTubeUrl(formData.youtubeUrl) && (
                          <div className="mt-2 p-3 border rounded-lg bg-muted/50">
                            <p className="text-sm text-muted-foreground mb-2">Video Preview:</p>
                            <div className="flex items-center gap-3">
                              <img 
                                src={getThumbnailUrl(formData.youtubeUrl) || ''} 
                                alt="Video thumbnail"
                                className="w-16 h-12 rounded object-cover"
                                onError={(e) => { e.currentTarget.style.display = 'none'; }}
                              />
                              <div className="text-sm">
                                <p className="font-medium">{formData.title || 'Video Title'}</p>
                                <p className="text-muted-foreground">YouTube Video</p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="description">Description *</Label>
                        <Textarea
                          id="description"
                          value={formData.description}
                          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                          placeholder="Describe what learners will learn from this video. Include key topics covered, prerequisites, and learning outcomes."
                          rows={4}
                          className={errors.description ? 'border-destructive' : ''}
                        />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>{formData.description.length}/500 characters</span>
                          <span>Minimum 50 characters required</span>
                        </div>
                        {errors.description && <p className="text-sm text-destructive">{errors.description}</p>}
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="difficulty">Difficulty Level *</Label>
                          <Select value={formData.difficulty} onValueChange={(value: any) => setFormData(prev => ({ ...prev, difficulty: value }))}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Beginner">Beginner</SelectItem>
                              <SelectItem value="Intermediate">Intermediate</SelectItem>
                              <SelectItem value="Advanced">Advanced</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="duration">Estimated Duration *</Label>
                          <Input
                            id="duration"
                            value={formData.estimatedDuration}
                            onChange={(e) => setFormData(prev => ({ ...prev, estimatedDuration: e.target.value }))}
                            placeholder="e.g., 15 minutes, 1 hour"
                            className={errors.estimatedDuration ? 'border-destructive' : ''}
                          />
                          {errors.estimatedDuration && <p className="text-sm text-destructive">{errors.estimatedDuration}</p>}
                        </div>
                      </div>
                    </div>

                    <Separator />

                    {/* Tags Selection */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Tag className="h-4 w-4 text-psyduck-primary" />
                        <Label>Tags * (Select relevant tags)</Label>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                        {AVAILABLE_TAGS.map((tag) => (
                          <button
                            key={tag}
                            type="button"
                            onClick={() => handleTagToggle(tag)}
                            className={`px-3 py-2 text-sm rounded-lg border transition-colors text-left ${
                              selectedTags.includes(tag)
                                ? 'bg-psyduck-primary text-white border-psyduck-primary'
                                : 'bg-background border-border hover:border-psyduck-primary'
                            }`}
                          >
                            {tag}
                          </button>
                        ))}
                      </div>
                      
                      {selectedTags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3">
                          <span className="text-sm font-medium">Selected tags:</span>
                          {selectedTags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="gap-1">
                              {tag}
                              <button
                                type="button"
                                onClick={() => handleTagToggle(tag)}
                                className="ml-1 hover:bg-destructive hover:text-destructive-foreground rounded-full"
                                aria-label={`Remove ${tag}`}
                                title={`Remove ${tag}`}
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </Badge>
                          ))}
                        </div>
                      )}
                      
                      {errors.tags && <p className="text-sm text-destructive">{errors.tags}</p>}
                    </div>

                    <Separator />

                    {/* Guidelines */}
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        <strong>Content Guidelines:</strong>
                        <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
                          <li>Content must be educational and relevant to programming/tech</li>
                          <li>Videos should be clear with good audio quality</li>
                          <li>Provide accurate information and cite sources when necessary</li>
                          <li>Respect copyright and only submit your own content or with permission</li>
                          <li>Content will be reviewed within 2-3 business days</li>
                        </ul>
                      </AlertDescription>
                    </Alert>

                    {/* Submit Button */}
                    <div className="flex justify-end">
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-psyduck-primary hover:bg-psyduck-primary-hover"
                      >
                        {isSubmitting ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                            Submitting...
                          </>
                        ) : (
                          <>
                            <Upload className="h-4 w-4 mr-2" />
                            Submit Content
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Manage Content Tab */}
            <TabsContent value="manage" className="space-y-6">
              {submittedContent.length === 0 ? (
                <Card>
                  <CardContent className="p-12 text-center">
                    <Video className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No Content Yet</h3>
                    <p className="text-muted-foreground mb-4">
                      You haven't submitted any content yet. Start creating and sharing your knowledge!
                    </p>
                    <Button onClick={() => setActiveTab('create')} className="bg-psyduck-primary hover:bg-psyduck-primary-hover">
                      <Plus className="h-4 w-4 mr-2" />
                      Create Your First Content
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-6">
                  {submittedContent.map((content) => (
                    <Card key={content.id}>
                      <CardContent className="p-6">
                        <div className="flex gap-4">
                          {getThumbnailUrl(content.youtubeUrl) ? (
                            <img 
                              src={getThumbnailUrl(content.youtubeUrl) as string} 
                              alt="Video thumbnail"
                              className="w-32 h-24 rounded object-cover flex-shrink-0"
                              onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                            />
                          ) : (
                            <div className="w-32 h-24 rounded bg-muted flex items-center justify-center text-xs text-muted-foreground flex-shrink-0">
                              No preview
                            </div>
                          )}
                          <div className="flex-1 space-y-3">
                            <div className="flex items-start justify-between">
                              <div>
                                <h3 className="text-lg font-medium">{content.title}</h3>
                                <p className="text-sm text-muted-foreground">{content.category} • {content.difficulty}</p>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge className={`${getStatusColor(content.status)} border-0`}>
                                  {content.status.charAt(0).toUpperCase() + content.status.slice(1)}
                                </Badge>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => deleteContent(content.id)}
                                  className="text-destructive hover:text-destructive"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                            
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {content.description}
                            </p>
                            
                            <div className="flex flex-wrap gap-1">
                              {content.tags.slice(0, 5).map((tag) => (
                                <Badge key={tag} variant="outline" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                              {content.tags.length > 5 && (
                                <Badge variant="outline" className="text-xs">
                                  +{content.tags.length - 5} more
                                </Badge>
                              )}
                            </div>
                            
                            <div className="flex items-center justify-between text-sm text-muted-foreground">
                              <div className="flex items-center gap-4">
                                <span className="flex items-center gap-1">
                                  <Clock className="h-4 w-4" />
                                  {content.estimatedDuration}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Users className="h-4 w-4" />
                                  {content.views} views
                                </span>
                                <span className="flex items-center gap-1">
                                  <Star className="h-4 w-4" />
                                  {content.likes} likes
                                </span>
                              </div>
                              <span>
                                Submitted {new Date(content.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Content</CardTitle>
                    <Video className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{submittedContent.length}</div>
                    <p className="text-xs text-muted-foreground">
                      Videos submitted
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Views</CardTitle>
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {submittedContent.reduce((sum, content) => sum + content.views, 0)}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Across all content
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Likes</CardTitle>
                    <Star className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {submittedContent.reduce((sum, content) => sum + content.likes, 0)}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Community engagement
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Approval Rate</CardTitle>
                    <CheckCircle className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {submittedContent.length > 0 
                        ? Math.round((submittedContent.filter(c => c.status === 'approved').length / submittedContent.length) * 100)
                        : 0}%
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Content approved
                    </p>
                  </CardContent>
                </Card>
              </div>

              {submittedContent.length === 0 && (
                <Card>
                  <CardContent className="p-12 text-center">
                    <TrendingUp className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No Analytics Yet</h3>
                    <p className="text-muted-foreground mb-4">
                      Submit your first content to start tracking analytics and performance metrics.
                    </p>
                    <Button onClick={() => setActiveTab('create')} className="bg-psyduck-primary hover:bg-psyduck-primary-hover">
                      <Plus className="h-4 w-4 mr-2" />
                      Create Content
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
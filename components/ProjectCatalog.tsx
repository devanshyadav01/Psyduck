import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { 
  Search, 
  Filter, 
  BookOpen, 
  Clock, 
  Users, 
  Star, 
  TrendingUp,
  Code,
  Database,
  Smartphone,
  Brain,
  Cloud,
  Palette,
  ChevronRight,
  Trophy,
  Play
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useRouterContext } from '../contexts/RouterContext';
import { apiService } from '../services/apiService';
import { toast } from 'sonner';

interface Project {
  id: string;
  title: string;
  description: string;
  domain: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  xpReward: number;
  estimatedTime: string;
  technologies: string[];
  prerequisites: string[];
  featured: boolean;
  enrolled?: boolean;
  progress?: number;
  completionRate?: number;
  rating?: number;
  studentsCount?: number;
}

const DOMAINS = [
  { name: 'All', icon: BookOpen, color: 'text-blue-500' },
  { name: 'Web Development', icon: Code, color: 'text-green-500' },
  { name: 'Mobile Development', icon: Smartphone, color: 'text-purple-500' },
  { name: 'Data Science', icon: Database, color: 'text-orange-500' },
  { name: 'AI/ML', icon: Brain, color: 'text-red-500' },
  { name: 'DevOps', icon: Cloud, color: 'text-blue-400' },
  { name: 'UI/UX Design', icon: Palette, color: 'text-pink-500' }
];

const DIFFICULTIES = ['All', 'Beginner', 'Intermediate', 'Advanced'];
const SORT_OPTIONS = [
  { label: 'Featured First', value: 'featured' },
  { label: 'Newest First', value: 'newest' },
  { label: 'Highest XP', value: 'xp-desc' },
  { label: 'Lowest XP', value: 'xp-asc' },
  { label: 'Most Popular', value: 'popular' },
  { label: 'Difficulty: Easy to Hard', value: 'difficulty-asc' },
  { label: 'Difficulty: Hard to Easy', value: 'difficulty-desc' }
];

export function ProjectCatalog() {
  const { user, isAuthenticated } = useAuth();
  const { navigate } = useRouterContext();
  
  const [availableProjects, setAvailableProjects] = useState<Project[]>([]);
  const [enrolledProjects, setEnrolledProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDomain, setSelectedDomain] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [sortBy, setSortBy] = useState('featured');
  const [activeTab, setActiveTab] = useState('browse');

  // Fetch projects on mount
  useEffect(() => {
    const fetchProjects = async () => {
      setIsLoading(true);
      try {
        // Fetch available projects
        const availableResponse = await apiService.getAvailableProjects();
        if (availableResponse.success && availableResponse.data) {
          setAvailableProjects(availableResponse.data);
        } else {
          console.warn('Failed to fetch available projects:', availableResponse.message);
          setAvailableProjects([]);
        }

        // Fetch enrolled projects if authenticated
        if (isAuthenticated) {
          const enrolledResponse = await apiService.getEnrolledProjects();
          if (enrolledResponse.success && enrolledResponse.data) {
            setEnrolledProjects(enrolledResponse.data);
          } else {
            console.warn('Failed to fetch enrolled projects:', enrolledResponse.message);
            setEnrolledProjects([]);
          }
        }
      } catch (error) {
        console.error('Error fetching projects:', error);
        toast.error('Failed to load projects. Please try again.');
        setAvailableProjects([]);
        setEnrolledProjects([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, [isAuthenticated]);

  // Filter and sort projects
  const filteredAndSortedProjects = useMemo(() => {
    let filtered = availableProjects.filter(project => {
      const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           (Array.isArray(project.technologies) && project.technologies.some(tech => tech.toLowerCase().includes(searchQuery.toLowerCase())));
      
      const matchesDomain = selectedDomain === 'All' || project.domain === selectedDomain;
      const matchesDifficulty = selectedDifficulty === 'All' || project.difficulty === selectedDifficulty;
      
      return matchesSearch && matchesDomain && matchesDifficulty;
    });

    // Sort projects
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'featured':
          if (a.featured !== b.featured) return b.featured ? 1 : -1;
          return b.xpReward - a.xpReward;
        case 'newest':
          return 0; // Would use createdAt if available
        case 'xp-desc':
          return b.xpReward - a.xpReward;
        case 'xp-asc':
          return a.xpReward - b.xpReward;
        case 'popular':
          return (b.studentsCount || 0) - (a.studentsCount || 0);
        case 'difficulty-asc':
          const difficultyOrder = { 'Beginner': 1, 'Intermediate': 2, 'Advanced': 3 };
          return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
        case 'difficulty-desc':
          const reverseDifficultyOrder = { 'Beginner': 3, 'Intermediate': 2, 'Advanced': 1 };
          return reverseDifficultyOrder[a.difficulty] - reverseDifficultyOrder[b.difficulty];
        default:
          return 0;
      }
    });

    return filtered;
  }, [availableProjects, searchQuery, selectedDomain, selectedDifficulty, sortBy]);

  // Handle project enrollment
  const handleEnrollInProject = async (projectId: string) => {
    if (!isAuthenticated) {
      toast.error('Please log in to enroll in projects');
      navigate('/login');
      return;
    }

    try {
      const response = await apiService.enrollInProject(projectId);
      
      if (response.success) {
        toast.success('Successfully enrolled in project!');
        
        // Find the project and move it to enrolled
        const project = availableProjects.find(p => p.id === projectId);
        if (project) {
          const enrolledProject = {
            ...project,
            enrolled: true,
            progress: 0
          };
          setEnrolledProjects(prev => {
            if (prev.some(p => p.id === projectId)) return prev;
            return [...prev, enrolledProject];
          });
        }
      } else {
        toast.error(response.message || 'Failed to enroll in project');
      }
    } catch (error) {
      console.error('Error enrolling in project:', error);
      toast.error('Failed to enroll in project. Please try again.');
    }
  };

  const handleProjectClick = (projectId: string) => {
    navigate(`/projects/${projectId}`);
  };

  const handleStartProject = (projectId: string) => {
    navigate(`/projects/${projectId}/ide`);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'Advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDomainIcon = (domain: string) => {
    const domainConfig = DOMAINS.find(d => d.name === domain);
    return domainConfig ? domainConfig.icon : BookOpen;
  };

  const getDomainColor = (domain: string) => {
    const domainConfig = DOMAINS.find(d => d.name === domain);
    return domainConfig?.color || 'text-gray-500';
  };

  const isEnrolled = (projectId: string) => {
    return enrolledProjects.some(p => p.id === projectId);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="space-y-6">
            {/* Loading skeleton */}
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-muted rounded w-1/3"></div>
              <div className="flex gap-4">
                <div className="h-10 bg-muted rounded w-64"></div>
                <div className="h-10 bg-muted rounded w-32"></div>
                <div className="h-10 bg-muted rounded w-32"></div>
              </div>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader>
                    <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-muted rounded w-full"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="h-3 bg-muted rounded w-full"></div>
                      <div className="h-3 bg-muted rounded w-2/3"></div>
                      <div className="flex gap-2">
                        <div className="h-6 bg-muted rounded w-16"></div>
                        <div className="h-6 bg-muted rounded w-20"></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-semibold">Project Catalog 🚀</h1>
              <p className="text-muted-foreground mt-1">
                Explore hands-on coding projects and level up your skills
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-psyduck-primary border-psyduck-primary">
                <BookOpen className="h-3 w-3 mr-1" />
                {availableProjects.length} Projects Available
              </Badge>
            </div>
          </div>

          {/* Domain Filter Pills */}
          <div className="flex flex-wrap gap-2">
            {DOMAINS.map((domain) => {
              const Icon = domain.icon;
              const isActive = selectedDomain === domain.name;
              return (
                <button
                  key={domain.name}
                  onClick={() => setSelectedDomain(domain.name)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    isActive 
                      ? 'bg-psyduck-primary text-white' 
                      : 'bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Icon className={`h-4 w-4 ${isActive ? 'text-white' : domain.color}`} />
                  {domain.name}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList>
            <TabsTrigger value="browse" className="gap-2">
              <Search className="h-4 w-4" />
              Browse Projects ({filteredAndSortedProjects.length})
            </TabsTrigger>
            {isAuthenticated && (
              <TabsTrigger value="enrolled" className="gap-2">
                <BookOpen className="h-4 w-4" />
                My Projects ({enrolledProjects.length})
              </TabsTrigger>
            )}
          </TabsList>

          {/* Browse Projects Tab */}
          <TabsContent value="browse" className="space-y-6">
            {/* Search and Filters */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search projects, technologies, or keywords..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <div className="flex gap-2">
                <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {DIFFICULTIES.map((difficulty) => (
                      <SelectItem key={difficulty} value={difficulty}>
                        {difficulty}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SORT_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Projects Grid */}
            {filteredAndSortedProjects.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredAndSortedProjects.map((project) => {
                  const DomainIcon = getDomainIcon(project.domain);
                  const enrolled = isEnrolled(project.id);
                  
                  return (
                    <Card 
                      key={project.id} 
                      className={`hover:shadow-lg transition-all duration-200 cursor-pointer ${
                        project.featured ? 'ring-2 ring-psyduck-primary/20' : ''
                      }`}
                      onClick={() => handleProjectClick(project.id)}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2">
                            <DomainIcon className={`h-5 w-5 ${getDomainColor(project.domain)}`} />
                            {project.featured && (
                              <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 text-xs">
                                <Star className="h-3 w-3 mr-1" />
                                Featured
                              </Badge>
                            )}
                          </div>
                          <Badge className={`text-xs ${getDifficultyColor(project.difficulty)}`}>
                            {project.difficulty}
                          </Badge>
                        </div>
                        
                        <CardTitle className="text-lg leading-tight">
                          {project.title}
                        </CardTitle>
                        <CardDescription className="line-clamp-2">
                          {project.description}
                        </CardDescription>
                      </CardHeader>
                      
                      <CardContent className="space-y-4">
                        {/* Technologies */}
                        <div className="flex flex-wrap gap-1">
                          {(project.technologies || []).slice(0, 3).map((tech) => (
                            <Badge key={tech} variant="outline" className="text-xs">
                              {tech}
                            </Badge>
                          ))}
                          {(project.technologies?.length || 0) > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{(project.technologies?.length || 0) - 3}
                            </Badge>
                          )}
                        </div>

                        {/* Project Stats */}
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {project.estimatedTime}
                            </div>
                            <div className="flex items-center gap-1">
                              <Star className="h-3 w-3" />
                              {project.xpReward} XP
                            </div>
                          </div>
                          {project.studentsCount && (
                            <div className="flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              {project.studentsCount}
                            </div>
                          )}
                        </div>

                        {/* Action Button */}
                        <div className="pt-2">
                          {enrolled ? (
                            <Button
                              className="w-full bg-psyduck-success hover:bg-psyduck-success/90 text-white"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleStartProject(project.id);
                              }}
                            >
                              <Play className="h-4 w-4 mr-2" />
                              Continue Project
                            </Button>
                          ) : (
                            <Button
                              className="w-full bg-psyduck-primary hover:bg-psyduck-primary-hover"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEnrollInProject(project.id);
                              }}
                            >
                              <BookOpen className="h-4 w-4 mr-2" />
                              Enroll Now
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-medium mb-2">No projects found</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Try adjusting your search or filters to find more projects
                </p>
                <Button 
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedDomain('All');
                    setSelectedDifficulty('All');
                  }}
                  variant="outline"
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </TabsContent>

          {/* Enrolled Projects Tab */}
          {isAuthenticated && (
            <TabsContent value="enrolled" className="space-y-6">
              {enrolledProjects.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {enrolledProjects.map((project) => {
                    const DomainIcon = getDomainIcon(project.domain);
                    
                    return (
                      <Card 
                        key={project.id}
                        className="hover:shadow-lg transition-all duration-200 cursor-pointer"
                        onClick={() => handleProjectClick(project.id)}
                      >
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <DomainIcon className={`h-5 w-5 ${getDomainColor(project.domain)}`} />
                              <Badge className={`text-xs ${getDifficultyColor(project.difficulty)}`}>
                                {project.difficulty}
                              </Badge>
                            </div>
                            <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs">
                              Enrolled
                            </Badge>
                          </div>
                          
                          <CardTitle className="text-lg leading-tight">
                            {project.title}
                          </CardTitle>
                          <CardDescription className="line-clamp-2">
                            {project.description}
                          </CardDescription>
                        </CardHeader>
                        
                        <CardContent className="space-y-4">
                          {/* Progress */}
                          {typeof project.progress === 'number' && (
                            <div className="space-y-2">
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">Progress</span>
                                <span className="font-medium">{project.progress}%</span>
                              </div>
                              <Progress value={project.progress} className="h-2" />
                            </div>
                          )}

                          {/* Technologies */}
                          <div className="flex flex-wrap gap-1">
                            {(project.technologies || []).slice(0, 3).map((tech) => (
                              <Badge key={tech} variant="outline" className="text-xs">
                                {tech}
                              </Badge>
                            ))}
                            {(project.technologies?.length || 0) > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{(project.technologies?.length || 0) - 3}
                              </Badge>
                            )}
                          </div>

                          {/* Project Stats */}
                          <div className="flex items-center justify-between text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {project.estimatedTime}
                            </div>
                            <div className="flex items-center gap-1">
                              <Star className="h-3 w-3" />
                              {project.xpReward} XP
                            </div>
                          </div>

                          {/* Action Button */}
                          <div className="pt-2">
                            <Button
                              className="w-full bg-psyduck-primary hover:bg-psyduck-primary-hover"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleStartProject(project.id);
                              }}
                            >
                              <Play className="h-4 w-4 mr-2" />
                              {project.progress && project.progress > 0 ? 'Continue' : 'Start'} Project
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12">
                  <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-medium mb-2">No enrolled projects yet</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Browse the catalog and enroll in projects to start learning
                  </p>
                  <Button 
                    onClick={() => setActiveTab('browse')}
                    className="bg-psyduck-primary hover:bg-psyduck-primary-hover"
                  >
                    <Search className="h-4 w-4 mr-2" />
                    Browse Projects
                  </Button>
                </div>
              )}
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  );
}
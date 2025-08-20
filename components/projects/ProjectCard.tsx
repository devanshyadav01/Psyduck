import React, { useCallback, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Progress } from '../ui/progress';
import { Separator } from '../ui/separator';
import { 
  Clock, 
  Users, 
  Star, 
  Play, 
  Eye, 
  Calendar,
  Award,
  Bookmark,
  BookmarkCheck,
  TrendingUp,
  Code2,
  ExternalLink
} from 'lucide-react';

interface Project {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  domain: string;
  technologies?: string[];
  estimatedDuration?: number;
  enrolledCount?: number;
  rating?: number;
  image?: string;
  type?: string;
  progress?: number;
  createdAt?: string;
  instructor?: {
    name: string;
    avatar?: string;
  };
  features?: string[];
  isPopular?: boolean;
  isNew?: boolean;
}

interface ProjectCardProps {
  project: Project;
  isEnrolled?: boolean;
  onStartProject: (projectId: string) => void;
  onViewProject: (projectId: string) => void;
  viewMode?: 'grid' | 'list';
}

// Memoized helper functions to prevent recreation
const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case 'beginner': return 'bg-green-100 text-green-800 border-green-200';
    case 'intermediate': return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'advanced': return 'bg-orange-100 text-orange-800 border-orange-200';
    case 'expert': return 'bg-red-100 text-red-800 border-red-200';
    default: return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const getDomainColor = (domain: string) => {
  switch (domain) {
    case 'mern-stack': return 'bg-blue-100 text-blue-800';
    case 'react-native': return 'bg-purple-100 text-purple-800';
    case 'flutter': return 'bg-cyan-100 text-cyan-800';
    case 'data-analytics': return 'bg-green-100 text-green-800';
    case 'ai-ml': return 'bg-orange-100 text-orange-800';
    case 'devops': return 'bg-red-100 text-red-800';
    case 'blockchain': return 'bg-yellow-100 text-yellow-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const getDifficultyIcon = (difficulty: string) => {
  switch (difficulty) {
    case 'beginner': return '🌱';
    case 'intermediate': return '🚀';
    case 'advanced': return '⚡';
    case 'expert': return '🏆';
    default: return '📚';
  }
};

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'guided': return '📚';
    case 'challenge': return '⚔️';
    case 'portfolio': return '💼';
    case 'open-source': return '🌍';
    case 'company': return '🏢';
    default: return '📚';
  }
};

const formatDuration = (weeks: number) => {
  if (weeks < 1) return `${Math.round(weeks * 7)} days`;
  if (weeks === 1) return '1 week';
  return `${weeks} weeks`;
};

// Helper function to safely format domain text
const formatDomainText = (domain: string | undefined | null): string => {
  if (!domain || typeof domain !== 'string') {
    return 'GENERAL';
  }
  return domain.replace(/-/g, ' ').toUpperCase();
};

// Helper function to safely format type text
const formatTypeText = (type: string | undefined | null): string => {
  if (!type || typeof type !== 'string') {
    return 'guided project';
  }
  return type.replace(/-/g, ' ');
};

export const ProjectCard = React.memo<ProjectCardProps>(({ 
  project, 
  isEnrolled = false, 
  onStartProject, 
  onViewProject,
  viewMode = 'grid'
}) => {
  // Memoized safe values
  const safeDomain = useMemo(() => project.domain || 'general', [project.domain]);
  const safeType = useMemo(() => project.type || 'guided', [project.type]);
  const rating = useMemo(() => project.rating || 4.5, [project.rating]);
  const duration = useMemo(() => project.estimatedDuration || 4, [project.estimatedDuration]);
  const enrolledCount = useMemo(() => project.enrolledCount || 0, [project.enrolledCount]);

  // Memoized callbacks to prevent unnecessary re-renders
  const handleStartProject = useCallback(() => {
    onStartProject(project.id);
  }, [onStartProject, project.id]);

  const handleViewProject = useCallback(() => {
    onViewProject(project.id);
  }, [onViewProject, project.id]);

  // Memoized instructor initials
  const instructorInitials = useMemo(() => {
    if (!project.instructor?.name) return '';
    return project.instructor.name.split(' ').map(n => n[0]).join('');
  }, [project.instructor?.name]);

  // Memoized technologies slice
  const displayTechnologies = useMemo(() => {
    if (!project.technologies) return [];
    return project.technologies.slice(0, viewMode === 'grid' ? 3 : 4);
  }, [project.technologies, viewMode]);

  const remainingTechCount = useMemo(() => {
    if (!project.technologies) return 0;
    const maxDisplay = viewMode === 'grid' ? 3 : 4;
    return Math.max(0, project.technologies.length - maxDisplay);
  }, [project.technologies, viewMode]);

  if (viewMode === 'list') {
    return (
      <Card className="hover:shadow-lg transition-all duration-300 hover:scale-[1.02] psyduck-fade-in group">
        <CardContent className="p-6">
          <div className="flex gap-6">
            {/* Project Image */}
            <div className="relative flex-shrink-0">
              <div className="w-24 h-24 bg-gradient-to-br from-psyduck-primary/20 to-psyduck-success/20 rounded-lg flex items-center justify-center">
                {project.image ? (
                  <img 
                    src={project.image} 
                    alt={project.title}
                    className="w-full h-full object-cover rounded-lg"
                    loading="lazy"
                  />
                ) : (
                  <Code2 className="h-8 w-8 text-psyduck-primary" />
                )}
              </div>
              
              {/* Status badges */}
              <div className="absolute -top-2 -right-2 flex flex-col gap-1">
                {project.isNew && (
                  <Badge variant="destructive" className="text-xs px-1 py-0">NEW</Badge>
                )}
                {project.isPopular && (
                  <Badge variant="secondary" className="text-xs px-1 py-0 bg-yellow-100 text-yellow-800">🔥</Badge>
                )}
              </div>
            </div>

            {/* Project Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-lg truncate group-hover:text-psyduck-primary transition-colors">
                      {project.title}
                    </h3>
                    {isEnrolled && (
                      <BookmarkCheck className="h-4 w-4 text-psyduck-success flex-shrink-0" />
                    )}
                  </div>
                  
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                    {project.description}
                  </p>
                </div>
                
                <div className="flex items-center gap-1 text-sm text-muted-foreground ml-4">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span>{rating}</span>
                </div>
              </div>

              {/* Tags and Metadata */}
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <Badge className={getDomainColor(safeDomain)}>
                  {formatDomainText(project.domain)}
                </Badge>
                
                <Badge variant="outline" className={getDifficultyColor(project.difficulty)}>
                  {getDifficultyIcon(project.difficulty)} {project.difficulty}
                </Badge>
                
                {project.type && (
                  <Badge variant="outline">
                    {getTypeIcon(safeType)} {formatTypeText(project.type)}
                  </Badge>
                )}
                
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span>{formatDuration(duration)}</span>
                </div>
                
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Users className="h-3 w-3" />
                  <span>{enrolledCount} enrolled</span>
                </div>
              </div>

              {/* Technologies */}
              {displayTechnologies.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {displayTechnologies.map(tech => (
                    <Badge key={tech} variant="secondary" className="text-xs">
                      {tech}
                    </Badge>
                  ))}
                  {remainingTechCount > 0 && (
                    <Badge variant="secondary" className="text-xs">
                      +{remainingTechCount} more
                    </Badge>
                  )}
                </div>
              )}

              {/* Progress for enrolled projects */}
              {isEnrolled && project.progress !== undefined && (
                <div className="mb-3">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Progress</span>
                    <span>{project.progress}%</span>
                  </div>
                  <Progress value={project.progress} className="h-2" />
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-2 flex-shrink-0">
              <Button
                onClick={handleStartProject}
                size="sm"
                className="bg-psyduck-primary hover:bg-psyduck-primary-hover text-white"
              >
                <Play className="h-4 w-4 mr-2" />
                {isEnrolled ? 'Continue' : 'Start'}
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleViewProject}
              >
                <Eye className="h-4 w-4 mr-2" />
                Details
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-foreground"
              >
                <Bookmark className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Grid view (default)
  return (
    <Card className="hover:shadow-lg transition-all duration-300 hover:scale-[1.02] psyduck-fade-in group relative overflow-hidden">
      {/* Status indicators */}
      <div className="absolute top-3 right-3 z-10 flex flex-col gap-1">
        {project.isNew && (
          <Badge variant="destructive" className="text-xs">NEW</Badge>
        )}
        {project.isPopular && (
          <Badge variant="secondary" className="text-xs bg-yellow-100 text-yellow-800">🔥 Popular</Badge>
        )}
        {isEnrolled && (
          <Badge variant="default" className="text-xs bg-psyduck-success">
            <BookmarkCheck className="h-3 w-3 mr-1" />
            Enrolled
          </Badge>
        )}
      </div>

      {/* Project Image/Icon */}
      <div className="relative h-40 bg-gradient-to-br from-psyduck-primary/20 to-psyduck-success/20">
        {project.image ? (
          <img 
            src={project.image} 
            alt={project.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <Code2 className="h-16 w-16 text-psyduck-primary opacity-60" />
          </div>
        )}
        
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        
        {/* Quick action button */}
        <Button
          size="sm"
          className="absolute bottom-3 right-3 bg-white/90 text-psyduck-primary hover:bg-white shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={handleViewProject}
        >
          <ExternalLink className="h-4 w-4" />
        </Button>
      </div>

      <CardHeader className="pb-3">
        <div className="flex items-start justify-between mb-2">
          <CardTitle className="text-lg leading-tight group-hover:text-psyduck-primary transition-colors line-clamp-2">
            {project.title}
          </CardTitle>
          <div className="flex items-center gap-1 text-sm text-muted-foreground flex-shrink-0 ml-2">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span>{rating}</span>
          </div>
        </div>
        
        <CardDescription className="line-clamp-2 text-sm">
          {project.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-0 pb-4">
        {/* Badges */}
        <div className="flex flex-wrap gap-2 mb-4">
          <Badge className={getDomainColor(safeDomain)} variant="secondary">
            {formatDomainText(project.domain)}
          </Badge>
          
          <Badge variant="outline" className={getDifficultyColor(project.difficulty)}>
            {getDifficultyIcon(project.difficulty)} {project.difficulty}
          </Badge>
          
          {project.type && (
            <Badge variant="outline" className="text-xs">
              {getTypeIcon(safeType)}
            </Badge>
          )}
        </div>

        {/* Metadata */}
        <div className="grid grid-cols-2 gap-3 text-sm text-muted-foreground mb-4">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{formatDuration(duration)}</span>
          </div>
          
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>{enrolledCount} enrolled</span>
          </div>
          
          {project.instructor && (
            <div className="flex items-center gap-2 col-span-2">
              <Avatar className="h-5 w-5">
                <AvatarImage src={project.instructor.avatar} />
                <AvatarFallback className="text-xs">
                  {instructorInitials}
                </AvatarFallback>
              </Avatar>
              <span className="text-xs">by {project.instructor.name}</span>
            </div>
          )}
        </div>

        {/* Technologies */}
        {displayTechnologies.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {displayTechnologies.map(tech => (
              <Badge key={tech} variant="secondary" className="text-xs">
                {tech}
              </Badge>
            ))}
            {remainingTechCount > 0 && (
              <Badge variant="secondary" className="text-xs">
                +{remainingTechCount}
              </Badge>
            )}
          </div>
        )}

        {/* Progress for enrolled projects */}
        {isEnrolled && project.progress !== undefined && (
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-2">
              <span>Progress</span>
              <span className="font-medium">{project.progress}%</span>
            </div>
            <Progress value={project.progress} className="h-2" />
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-0 gap-2">
        <Button
          onClick={handleStartProject}
          className="flex-1 bg-psyduck-primary hover:bg-psyduck-primary-hover text-white"
          size="sm"
        >
          <Play className="h-4 w-4 mr-2" />
          {isEnrolled ? 'Continue' : 'Start Project'}
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={handleViewProject}
          className="flex-shrink-0"
        >
          <Eye className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
});

ProjectCard.displayName = 'ProjectCard';
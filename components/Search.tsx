import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Search as SearchIcon, Filter, Star, Users, Code, Smartphone, BarChart, Brain, Clock, Trophy } from 'lucide-react';

const mockProjects = [
  {
    id: 1,
    title: "E-Commerce Platform",
    description: "Build a full-stack e-commerce platform with React, Node.js, and MongoDB",
    domain: "MERN Stack",
    difficulty: "Advanced",
    duration: "4-6 weeks",
    rating: 4.8,
    completions: 342,
    tags: ["React", "Node.js", "MongoDB", "Stripe"],
    image: ""
  },
  {
    id: 2,
    title: "Fitness Tracker App",
    description: "Create a mobile fitness tracking app with Flutter and Firebase",
    domain: "Mobile Apps",
    difficulty: "Intermediate",
    duration: "3-4 weeks", 
    rating: 4.6,
    completions: 128,
    tags: ["Flutter", "Firebase", "Charts", "Health API"],
    image: ""
  },
  {
    id: 3,
    title: "Sales Analytics Dashboard",
    description: "Build an interactive dashboard for sales data visualization",
    domain: "Data Analytics",
    difficulty: "Intermediate",
    duration: "2-3 weeks",
    rating: 4.7,
    completions: 215,
    tags: ["Python", "Pandas", "Plotly", "Streamlit"],
    image: ""
  },
  {
    id: 4,
    title: "Image Recognition System", 
    description: "Develop an AI system for image classification and object detection",
    domain: "AI/ML",
    difficulty: "Advanced",
    duration: "5-7 weeks",
    rating: 4.9,
    completions: 89,
    tags: ["TensorFlow", "Python", "OpenCV", "Neural Networks"],
    image: ""
  },
  {
    id: 5,
    title: "Task Management App",
    description: "Create a collaborative task management application",
    domain: "MERN Stack",
    difficulty: "Beginner",
    duration: "2-3 weeks",
    rating: 4.4,
    completions: 456,
    tags: ["React", "Express", "MongoDB", "Socket.io"],
    image: ""
  }
];

const mockUsers = [
  {
    id: 1,
    name: "Alice Chen",
    username: "alice_codes",
    level: 12,
    xp: 8500,
    streak: 45,
    completedProjects: 23,
    avatar: "",
    specialties: ["React", "Node.js", "Python"]
  },
  {
    id: 2,
    name: "Mike Johnson", 
    username: "mike_dev",
    level: 8,
    xp: 4200,
    streak: 12,
    completedProjects: 15,
    avatar: "",
    specialties: ["Flutter", "Dart", "Firebase"]
  },
  {
    id: 3,
    name: "Sarah Kim",
    username: "sarah_data",
    level: 15,
    xp: 12300,
    streak: 78,
    completedProjects: 31,
    avatar: "",
    specialties: ["Python", "TensorFlow", "Data Science"]
  }
];

const domainIcons = {
  "MERN Stack": Code,
  "Mobile Apps": Smartphone,
  "Data Analytics": BarChart,
  "AI/ML": Brain
};

const difficultyColors = {
  "Beginner": "bg-green-100 text-green-800",
  "Intermediate": "bg-yellow-100 text-yellow-800", 
  "Advanced": "bg-red-100 text-red-800"
};

interface SearchProps {
  onStartProject?: () => void;
}

export function Search({ onStartProject }: SearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('projects');
  const [domainFilter, setDomainFilter] = useState('all');
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const [sortBy, setSortBy] = useState('relevance');
  const [filteredProjects, setFilteredProjects] = useState(mockProjects);
  const [filteredUsers, setFilteredUsers] = useState(mockUsers);

  useEffect(() => {
    // Filter projects
    let filtered = mockProjects.filter(project => {
      const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           project.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesDomain = domainFilter === 'all' || project.domain === domainFilter;
      const matchesDifficulty = difficultyFilter === 'all' || project.difficulty === difficultyFilter;
      
      return matchesSearch && matchesDomain && matchesDifficulty;
    });

    // Sort projects
    if (sortBy === 'rating') {
      filtered.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'popular') {
      filtered.sort((a, b) => b.completions - a.completions);
    } else if (sortBy === 'newest') {
      filtered.sort((a, b) => b.id - a.id);
    }

    setFilteredProjects(filtered);

    // Filter users
    const filteredUsersList = mockUsers.filter(user => {
      return user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
             user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
             user.specialties.some(specialty => specialty.toLowerCase().includes(searchQuery.toLowerCase()));
    });

    setFilteredUsers(filteredUsersList);
  }, [searchQuery, domainFilter, difficultyFilter, sortBy]);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Search Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Search Psyduck</h1>
          <div className="relative mb-6">
            <SearchIcon className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search projects, users, technologies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 text-lg h-12"
            />
          </div>
        </div>

        {/* Search Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
            <TabsTrigger value="projects">Projects ({filteredProjects.length})</TabsTrigger>
            <TabsTrigger value="users">Users ({filteredUsers.length})</TabsTrigger>
          </TabsList>

          {/* Projects Tab */}
          <TabsContent value="projects" className="mt-6">
            {/* Filters */}
            <div className="flex flex-wrap gap-4 mb-6 p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <span className="text-sm font-medium">Filters:</span>
              </div>
              
              <Select value={domainFilter} onValueChange={setDomainFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Domain" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Domains</SelectItem>
                  <SelectItem value="MERN Stack">MERN Stack</SelectItem>
                  <SelectItem value="Mobile Apps">Mobile Apps</SelectItem>
                  <SelectItem value="Data Analytics">Data Analytics</SelectItem>
                  <SelectItem value="AI/ML">AI/ML</SelectItem>
                </SelectContent>
              </Select>

              <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="Beginner">Beginner</SelectItem>
                  <SelectItem value="Intermediate">Intermediate</SelectItem>
                  <SelectItem value="Advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="relevance">Relevance</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  <SelectItem value="popular">Most Popular</SelectItem>
                  <SelectItem value="newest">Newest</SelectItem>
                </SelectContent>
              </Select>

              {(domainFilter !== 'all' || difficultyFilter !== 'all') && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    setDomainFilter('all');
                    setDifficultyFilter('all');
                  }}
                >
                  Clear Filters
                </Button>
              )}
            </div>

            {/* Projects Results */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project) => {
                const DomainIcon = domainIcons[project.domain as keyof typeof domainIcons];
                return (
                  <Card key={project.id} className="hover:shadow-lg transition-shadow cursor-pointer group">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-psyduck-primary/10 rounded-lg flex items-center justify-center">
                            <DomainIcon className="h-5 w-5 text-psyduck-primary" />
                          </div>
                          <div>
                            <CardTitle className="text-base group-hover:text-psyduck-primary transition-colors">
                              {project.title}
                            </CardTitle>
                            <p className="text-sm text-muted-foreground">{project.domain}</p>
                          </div>
                        </div>
                        <Badge className={difficultyColors[project.difficulty as keyof typeof difficultyColors]}>
                          {project.difficulty}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                        {project.description}
                      </p>
                      
                      <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>{project.duration}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span>{project.rating}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          <span>{project.completions}</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1 mb-4">
                        {project.tags.slice(0, 3).map((tag, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {project.tags.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{project.tags.length - 3}
                          </Badge>
                        )}
                      </div>

                      <Button 
                        className="w-full bg-psyduck-primary hover:bg-psyduck-primary-hover"
                        onClick={() => onStartProject && onStartProject()}
                      >
                        Start Project
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {filteredProjects.length === 0 && (
              <div className="text-center py-12">
                <SearchIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No projects found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search terms or filters
                </p>
              </div>
            )}
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredUsers.map((user) => (
                <Card key={user.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h3 className="font-medium">{user.name}</h3>
                        <p className="text-sm text-muted-foreground">@{user.username}</p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1 text-sm">
                          <Trophy className="h-3 w-3 text-psyduck-primary" />
                          <span>Level {user.level}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">{user.xp.toLocaleString()} XP</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Projects Completed</span>
                        <span className="font-medium">{user.completedProjects}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Current Streak</span>
                        <span className="font-medium">{user.streak} days</span>
                      </div>
                      
                      <div>
                        <p className="text-sm text-muted-foreground mb-2">Specialties</p>
                        <div className="flex flex-wrap gap-1">
                          {user.specialties.map((specialty, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {specialty}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <Button variant="outline" className="w-full">
                        View Profile
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredUsers.length === 0 && (
              <div className="text-center py-12">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No users found</h3>
                <p className="text-muted-foreground">
                  Try different search terms to find users
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
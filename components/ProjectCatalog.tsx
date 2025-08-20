import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { 
  Code, 
  Smartphone, 
  BarChart, 
  Brain, 
  Clock, 
  Star, 
  Users, 
  Trophy,
  PlayCircle,
  CheckCircle2,
  Lock
} from "lucide-react";

interface Project {
  id: string;
  title: string;
  description: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  xpReward: number;
  estimatedTime: string;
  technologies: string[];
  enrolled: number;
  rating: number;
  completed: boolean;
  locked: boolean;
  requirements?: string[];
}

interface Domain {
  id: string;
  name: string;
  icon: any;
  color: string;
  description: string;
  projects: Project[];
}

export function ProjectCatalog() {
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all");

  const domains: Domain[] = [
    {
      id: "mern",
      name: "MERN Stack",
      icon: Code,
      color: "bg-blue-500",
      description: "Build full-stack web applications with MongoDB, Express, React, and Node.js",
      projects: [
        {
          id: "portfolio",
          title: "Personal Portfolio Website",
          description: "Create a responsive portfolio to showcase your projects and skills",
          difficulty: "Beginner",
          xpReward: 150,
          estimatedTime: "3-5 days",
          technologies: ["React", "CSS", "HTML"],
          enrolled: 1250,
          rating: 4.8,
          completed: true,
          locked: false
        },
        {
          id: "todo",
          title: "To-Do List App",
          description: "Build a task management app with CRUD operations",
          difficulty: "Beginner",
          xpReward: 200,
          estimatedTime: "4-6 days",
          technologies: ["React", "Node.js", "MongoDB"],
          enrolled: 980,
          rating: 4.6,
          completed: true,
          locked: false
        },
        {
          id: "chat",
          title: "Real-Time Chat App",
          description: "Create a messaging app with real-time communication",
          difficulty: "Intermediate",
          xpReward: 350,
          estimatedTime: "1-2 weeks",
          technologies: ["React", "Socket.io", "Node.js", "MongoDB"],
          enrolled: 750,
          rating: 4.9,
          completed: false,
          locked: false
        },
        {
          id: "ecommerce",
          title: "E-Commerce with Payments",
          description: "Build a complete online store with payment integration",
          difficulty: "Advanced",
          xpReward: 500,
          estimatedTime: "3-4 weeks",
          technologies: ["React", "Node.js", "MongoDB", "Stripe"],
          enrolled: 420,
          rating: 4.7,
          completed: false,
          locked: true,
          requirements: ["Complete 3 Intermediate projects"]
        }
      ]
    },
    {
      id: "mobile",
      name: "Mobile Apps",
      icon: Smartphone,
      color: "bg-green-500",
      description: "Create mobile applications using Flutter and React Native",
      projects: [
        {
          id: "calculator",
          title: "Calculator App",
          description: "Build a functional calculator with a beautiful UI",
          difficulty: "Beginner",
          xpReward: 120,
          estimatedTime: "2-3 days",
          technologies: ["Flutter", "Dart"],
          enrolled: 890,
          rating: 4.5,
          completed: false,
          locked: false
        },
        {
          id: "fitness",
          title: "Fitness Tracker",
          description: "Track workouts, calories, and fitness goals",
          difficulty: "Intermediate",
          xpReward: 300,
          estimatedTime: "1-2 weeks",
          technologies: ["Flutter", "SQLite", "Charts"],
          enrolled: 650,
          rating: 4.8,
          completed: false,
          locked: false
        },
        {
          id: "rideshare",
          title: "Ride-Sharing App",
          description: "Create a complete ride-sharing application",
          difficulty: "Advanced",
          xpReward: 550,
          estimatedTime: "4-5 weeks",
          technologies: ["Flutter", "Firebase", "Maps API", "Payment"],
          enrolled: 320,
          rating: 4.9,
          completed: false,
          locked: true,
          requirements: ["Complete 4 Intermediate projects"]
        }
      ]
    },
    {
      id: "data",
      name: "Data Analytics",
      icon: BarChart,
      color: "bg-purple-500",
      description: "Analyze and visualize data using Python, Power BI, and Tableau",
      projects: [
        {
          id: "sales-dashboard",
          title: "Sales Dashboard",
          description: "Create an interactive dashboard for sales data analysis",
          difficulty: "Beginner",
          xpReward: 180,
          estimatedTime: "3-4 days",
          technologies: ["Python", "Pandas", "Matplotlib"],
          enrolled: 720,
          rating: 4.6,
          completed: false,
          locked: false
        },
        {
          id: "customer-segmentation",
          title: "Customer Segmentation",
          description: "Use K-Means clustering to segment customers",
          difficulty: "Intermediate",
          xpReward: 320,
          estimatedTime: "1-2 weeks",
          technologies: ["Python", "Scikit-learn", "Seaborn"],
          enrolled: 480,
          rating: 4.7,
          completed: false,
          locked: false
        }
      ]
    },
    {
      id: "ai",
      name: "AI/ML",
      icon: Brain,
      color: "bg-orange-500",
      description: "Build intelligent applications with machine learning and AI",
      projects: [
        {
          id: "digit-recognition",
          title: "Handwritten Digit Recognition",
          description: "Build a neural network to recognize handwritten digits",
          difficulty: "Beginner",
          xpReward: 250,
          estimatedTime: "4-5 days",
          technologies: ["Python", "TensorFlow", "Keras"],
          enrolled: 920,
          rating: 4.8,
          completed: false,
          locked: false
        },
        {
          id: "recommendation",
          title: "Movie Recommendation System",
          description: "Create a collaborative filtering recommendation engine",
          difficulty: "Intermediate",
          xpReward: 380,
          estimatedTime: "2-3 weeks",
          technologies: ["Python", "Pandas", "Surprise"],
          enrolled: 580,
          rating: 4.9,
          completed: false,
          locked: false
        }
      ]
    }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner": return "bg-green-100 text-green-800";
      case "Intermediate": return "bg-yellow-100 text-yellow-800";
      case "Advanced": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const filterProjects = (projects: Project[]) => {
    if (selectedDifficulty === "all") return projects;
    return projects.filter(p => p.difficulty.toLowerCase() === selectedDifficulty);
  };

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Project Catalog</h1>
        <p className="text-muted-foreground">
          Choose from our curated collection of real-world projects to build your skills
        </p>
      </div>

      {/* Difficulty Filter */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          {["all", "beginner", "intermediate", "advanced"].map((level) => (
            <Button
              key={level}
              variant={selectedDifficulty === level ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedDifficulty(level)}
              className={selectedDifficulty === level ? "bg-psyduck-primary hover:bg-psyduck-primary-hover" : ""}
            >
              {level.charAt(0).toUpperCase() + level.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      {/* Domain Tabs */}
      <Tabs defaultValue="mern" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          {domains.map((domain) => (
            <TabsTrigger key={domain.id} value={domain.id} className="flex items-center gap-2">
              <domain.icon className="h-4 w-4" />
              <span className="hidden sm:inline">{domain.name}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {domains.map((domain) => (
          <TabsContent key={domain.id} value={domain.id} className="mt-6">
            {/* Domain Header */}
            <div className="mb-6 p-4 rounded-lg bg-gradient-to-r from-muted/50 to-transparent border">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 ${domain.color} rounded-lg flex items-center justify-center`}>
                  <domain.icon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">{domain.name}</h2>
                  <p className="text-muted-foreground">{domain.description}</p>
                </div>
              </div>
            </div>

            {/* Projects Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filterProjects(domain.projects).map((project) => (
                <Card key={project.id} className="hover:shadow-lg transition-shadow relative overflow-hidden">
                  {project.locked && (
                    <div className="absolute inset-0 bg-black/20 backdrop-blur-sm z-10 flex items-center justify-center">
                      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg text-center">
                        <Lock className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                        <p className="text-sm font-medium">Locked</p>
                        {project.requirements && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {project.requirements[0]}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                  
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg mb-2 flex items-center gap-2">
                          {project.title}
                          {project.completed && <CheckCircle2 className="h-5 w-5 text-psyduck-success" />}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground mb-3">{project.description}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 mb-3">
                      <Badge className={getDifficultyColor(project.difficulty)} variant="secondary">
                        {project.difficulty}
                      </Badge>
                      <Badge className="bg-psyduck-soft text-psyduck-primary">
                        +{project.xpReward} XP
                      </Badge>
                    </div>

                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {project.estimatedTime}
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {project.enrolled.toLocaleString()}
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-current text-yellow-500" />
                        {project.rating}
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="pt-0">
                    <div className="space-y-4">
                      <div>
                        <p className="text-xs font-medium mb-2">Technologies:</p>
                        <div className="flex flex-wrap gap-1">
                          {project.technologies.map((tech) => (
                            <Badge key={tech} variant="outline" className="text-xs">
                              {tech}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <Button 
                        className={`w-full ${
                          project.completed 
                            ? "bg-psyduck-success hover:bg-psyduck-success/90" 
                            : "bg-psyduck-primary hover:bg-psyduck-primary-hover"
                        }`}
                        disabled={project.locked}
                      >
                        {project.completed ? (
                          <>
                            <CheckCircle2 className="h-4 w-4 mr-2" />
                            View Solution
                          </>
                        ) : (
                          <>
                            <PlayCircle className="h-4 w-4 mr-2" />
                            Start Project
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filterProjects(domain.projects).length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No projects found for the selected difficulty level.</p>
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
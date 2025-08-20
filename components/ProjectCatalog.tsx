import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Skeleton } from './ui/skeleton';
import { BookOpen, Clock, Star } from 'lucide-react';

export function ProjectCatalog() {
  // Mock data for now
  const projects = [
    {
      id: '1',
      title: 'Todo App with React',
      description: 'Build a complete todo application with React and local storage',
      difficulty: 'beginner',
      estimatedHours: 8,
      xpReward: 500,
      domain: 'MERN Stack'
    },
    {
      id: '2',
      title: 'E-commerce Dashboard',
      description: 'Create an admin dashboard for managing an e-commerce store',
      difficulty: 'intermediate',
      estimatedHours: 20,
      xpReward: 1200,
      domain: 'MERN Stack'
    },
    {
      id: '3',
      title: 'Data Visualization App',
      description: 'Build interactive charts and graphs using D3.js',
      difficulty: 'advanced',
      estimatedHours: 15,
      xpReward: 1000,
      domain: 'Data Analytics'
    }
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1>Project Catalog</h1>
        <p className="text-muted-foreground">
          Choose a project to start your learning journey
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map(project => (
          <Card key={project.id} className="h-full flex flex-col">
            <CardHeader>
              <div className="flex items-center justify-between mb-2">
                <Badge variant="outline">{project.difficulty}</Badge>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  {project.estimatedHours}h
                </div>
              </div>
              <CardTitle className="line-clamp-2">{project.title}</CardTitle>
              <CardDescription className="line-clamp-3">
                {project.description}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="flex-1 flex flex-col justify-between">
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <BookOpen className="h-4 w-4" />
                  <span>{project.domain}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Star className="h-4 w-4 text-psyduck-primary" />
                  <span>{project.xpReward} XP</span>
                </div>
              </div>
              
              <Button className="w-full bg-psyduck-primary hover:bg-psyduck-primary-hover">
                Start Project
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
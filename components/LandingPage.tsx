import React from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { 
  Code, 
  Trophy, 
  Users, 
  Zap, 
  BookOpen, 
  Star,
  ArrowRight 
} from 'lucide-react';
import { useRouter } from '../hooks/useRouter';

export function LandingPage() {
  const { navigate } = useRouter();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="text-2xl">🦆</div>
            <span className="text-xl font-bold">Psyduck</span>
          </div>
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/login')}
            >
              Sign In
            </Button>
            <Button 
              className="bg-psyduck-primary hover:bg-psyduck-primary-hover"
              onClick={() => navigate('/register')}
            >
              Get Started
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Learn to Code Through 
            <span className="text-psyduck-primary"> Real Projects</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Master programming skills by building actual projects. Earn XP, unlock achievements, 
            and get hired by top companies.
          </p>
          <div className="flex gap-4 justify-center">
            <Button 
              size="lg"
              className="bg-psyduck-primary hover:bg-psyduck-primary-hover"
              onClick={() => navigate('/register')}
            >
              Start Learning Free
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline">
              Watch Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Why Choose Psyduck?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <Code className="h-8 w-8 text-psyduck-primary mb-2" />
                <CardTitle>Real-World Projects</CardTitle>
                <CardDescription>
                  Build actual applications that matter, not just toy examples
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card>
              <CardHeader>
                <Trophy className="h-8 w-8 text-psyduck-primary mb-2" />
                <CardTitle>Gamified Learning</CardTitle>
                <CardDescription>
                  Earn XP, unlock badges, and compete on leaderboards
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card>
              <CardHeader>
                <Users className="h-8 w-8 text-psyduck-primary mb-2" />
                <CardTitle>Get Hired</CardTitle>
                <CardDescription>
                  Top performers get direct access to hiring opportunities
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Start Your Journey?
          </h2>
          <p className="text-muted-foreground mb-8">
            Join thousands of developers building their skills through projects
          </p>
          <Button 
            size="lg"
            className="bg-psyduck-primary hover:bg-psyduck-primary-hover"
            onClick={() => navigate('/register')}
          >
            Get Started Now
          </Button>
        </div>
      </section>
    </div>
  );
}
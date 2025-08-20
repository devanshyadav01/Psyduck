import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { ArrowRight, Code, Smartphone, BarChart, Brain, Trophy, Users, Target, Zap } from "lucide-react";

interface LandingPageProps {
  onGetStarted: () => void;
}

export function LandingPage({ onGetStarted }: LandingPageProps) {
  const domains = [
    {
      icon: Code,
      title: "MERN Stack",
      description: "Build full-stack web applications",
      projects: ["Portfolio Website", "Chat App", "E-Commerce Platform"],
      color: "bg-blue-500"
    },
    {
      icon: Smartphone,
      title: "Mobile Apps",
      description: "Create mobile experiences with Flutter",
      projects: ["Calculator App", "Fitness Tracker", "Ride-Sharing App"],
      color: "bg-green-500"
    },
    {
      icon: BarChart,
      title: "Data Analytics",
      description: "Analyze and visualize data insights",
      projects: ["Sales Dashboard", "Customer Segmentation", "Fraud Detection"],
      color: "bg-purple-500"
    },
    {
      icon: Brain,
      title: "AI/ML",
      description: "Build intelligent applications",
      projects: ["Image Recognition", "Recommendation System", "Chatbot"],
      color: "bg-orange-500"
    }
  ];

  const features = [
    {
      icon: Target,
      title: "Project-Based Learning",
      description: "Learn by building real projects instead of just tutorials"
    },
    {
      icon: Trophy,
      title: "Gamified Experience",
      description: "Earn XP, badges, and maintain streaks while learning"
    },
    {
      icon: Users,
      title: "Real-World Projects",
      description: "Top performers get access to actual company projects"
    },
    {
      icon: Zap,
      title: "Direct Hiring",
      description: "Get discovered by partner companies for job opportunities"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4 text-center">
        <div className="container mx-auto max-w-4xl">
          <div className="mb-6">
            <Badge className="bg-psyduck-soft text-psyduck-primary border-psyduck-primary">
              🚀 Project-Based Learning Platform
            </Badge>
          </div>
          
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-psyduck-primary to-psyduck-success bg-clip-text text-transparent">
            Build Real Projects.<br />Level Up. Get Hired.
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Stop watching tutorials. Start building. Psyduck combines the best of GitHub, LeetCode, and Upwork 
            to help you learn through real projects and get hired by top companies.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-psyduck-primary hover:bg-psyduck-primary-hover text-white"
              onClick={onGetStarted}
            >
              Start Building Projects
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline">
              View Demo Projects
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 mt-16 max-w-md mx-auto">
            <div className="text-center">
              <div className="text-2xl font-bold text-psyduck-primary">500+</div>
              <div className="text-sm text-muted-foreground">Projects</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-psyduck-primary">10K+</div>
              <div className="text-sm text-muted-foreground">Learners</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-psyduck-primary">200+</div>
              <div className="text-sm text-muted-foreground">Companies</div>
            </div>
          </div>
        </div>
      </section>

      {/* Domains Section */}
      <section className="py-20 px-4 bg-psyduck-soft/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Choose Your Learning Path</h2>
            <p className="text-lg text-muted-foreground">
              Master in-demand skills through structured project roadmaps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {domains.map((domain) => (
              <Card key={domain.title} className="hover:shadow-lg transition-shadow cursor-pointer group">
                <CardHeader className="text-center">
                  <div className={`w-12 h-12 ${domain.color} rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                    <domain.icon className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-lg">{domain.title}</CardTitle>
                  <p className="text-sm text-muted-foreground">{domain.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {domain.projects.map((project, idx) => (
                      <div key={idx} className="text-sm bg-muted/50 px-3 py-2 rounded-md">
                        {project}
                      </div>
                    ))}
                  </div>
                  <Button className="w-full mt-4" variant="outline" size="sm">
                    View Projects
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Choose Psyduck?</h2>
            <p className="text-lg text-muted-foreground">
              Experience the perfect blend of learning, achievement, and career growth
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature) => (
              <div key={feature.title} className="text-center">
                <div className="w-16 h-16 bg-psyduck-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="h-8 w-8 text-psyduck-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-psyduck-primary">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Join thousands of developers who are building their future, one project at a time.
          </p>
          <Button 
            size="lg" 
            className="bg-white text-psyduck-primary hover:bg-gray-100"
            onClick={onGetStarted}
          >
            Get Started for Free
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>
    </div>
  );
}
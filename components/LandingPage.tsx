import React from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { 
  Code, 
  Trophy, 
  Users, 
  Zap, 
  BookOpen, 
  Star,
  ArrowRight,
  Info
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

      {/* Demo Notice */}
      <div className="bg-psyduck-soft/20 border-b">
        <div className="container mx-auto px-4 py-3">
          <Alert className="border-psyduck-primary/20 bg-psyduck-primary/5">
            <Info className="h-4 w-4 text-psyduck-primary" />
            <AlertDescription className="text-sm">
              🎮 <strong>Demo Mode:</strong> Try the platform instantly! Use email <code className="bg-muted px-1 rounded">demo@psyduck.dev</code> and password <code className="bg-muted px-1 rounded">demo123</code> to sign in.
            </AlertDescription>
          </Alert>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-psyduck-soft/10 via-transparent to-psyduck-primary/5" />
        <div className="container mx-auto px-4 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-psyduck-soft/20 border border-psyduck-primary/20 rounded-full px-4 py-2 mb-8">
                <Star className="h-4 w-4 text-psyduck-primary" />
                <span className="text-sm font-medium text-psyduck-primary">Project-Based Learning Platform</span>
              </div>
              
              <h1 className="text-5xl lg:text-7xl font-bold mb-8 leading-tight">
                Master Coding Through
                <span className="block text-psyduck-primary psyduck-brand-text">Real Projects</span>
              </h1>
              
              <p className="text-xl text-muted-foreground mb-10 max-w-xl lg:mx-0 mx-auto leading-relaxed">
                Build production-ready applications, earn XP and achievements, compete with peers, 
                and unlock direct pathways to hiring opportunities at top companies.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start">
                <Button 
                  size="lg"
                  className="bg-psyduck-primary hover:bg-psyduck-primary-hover text-white px-8 py-4 rounded-xl transition-all duration-300 transform hover:scale-105 psyduck-glow"
                  onClick={() => navigate('/register')}
                >
                  Start Learning Free
                  <ArrowRight className="ml-3 h-5 w-5" />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  className="border-2 border-psyduck-primary/30 text-psyduck-primary hover:bg-psyduck-primary hover:text-white px-8 py-4 rounded-xl transition-all duration-300"
                  onClick={() => navigate('/login')}
                >
                  <span className="mr-3 text-lg">🎮</span>
                  Try Demo Account
                </Button>
              </div>

              <div className="mt-12 grid grid-cols-3 gap-8 text-center lg:text-left">
                <div>
                  <div className="text-2xl font-bold text-psyduck-primary mb-1">50+</div>
                  <div className="text-sm text-muted-foreground">Real Projects</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-psyduck-primary mb-1">10K+</div>
                  <div className="text-sm text-muted-foreground">Active Learners</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-psyduck-primary mb-1">95%</div>
                  <div className="text-sm text-muted-foreground">Success Rate</div>
                </div>
              </div>
            </div>

            <div className="relative lg:block hidden">
              <div className="relative">
                <img 
                  src="https://images.unsplash.com/photo-1621036579842-9080c7119f67?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBjb2RpbmclMjB3b3Jrc3BhY2UlMjB0ZWNobm9sb2d5fGVufDF8fHx8MTc1NTcwOTc2Mnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="Professional coding workspace"
                  className="rounded-2xl shadow-2xl"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-psyduck-dark/10 to-transparent rounded-2xl" />
                
                {/* Floating cards */}
                <div className="absolute -top-6 -right-6 bg-white rounded-xl shadow-xl p-4 max-w-xs">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-psyduck-success/20 flex items-center justify-center">
                      <Trophy className="h-5 w-5 text-psyduck-success" />
                    </div>
                    <div>
                      <div className="font-semibold text-sm">Badge Unlocked!</div>
                      <div className="text-xs text-muted-foreground">Full-Stack Developer</div>
                    </div>
                  </div>
                </div>

                <div className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-xl p-4 max-w-xs">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-psyduck-primary/20 flex items-center justify-center">
                      <Code className="h-5 w-5 text-psyduck-primary" />
                    </div>
                    <div>
                      <div className="font-semibold text-sm">Project Complete</div>
                      <div className="text-xs text-muted-foreground">+250 XP Earned</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-muted/20 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              Why Developers Choose <span className="text-psyduck-primary">Psyduck</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Transform your coding journey with our unique blend of practical projects, 
              gamification, and career opportunities.
            </p>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-8">
            <Card className="relative group hover:shadow-xl transition-all duration-300 border-l-4 border-l-psyduck-primary/20 hover:border-l-psyduck-primary">
              <CardHeader className="pb-4">
                <div className="mb-4 p-3 bg-psyduck-primary/10 rounded-xl w-fit">
                  <Code className="h-8 w-8 text-psyduck-primary" />
                </div>
                <CardTitle className="text-xl mb-3">Real-World Projects</CardTitle>
                <CardDescription className="text-base leading-relaxed">
                  Build production-ready applications using modern tech stacks. Work on projects 
                  that mirror real industry challenges and showcase your skills to employers.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 text-sm text-psyduck-primary font-medium">
                  <ArrowRight className="h-4 w-4" />
                  <span>MERN, Flutter, AI/ML & more</span>
                </div>
              </CardContent>
            </Card>
            
            <Card className="relative group hover:shadow-xl transition-all duration-300 border-l-4 border-l-psyduck-success/20 hover:border-l-psyduck-success">
              <CardHeader className="pb-4">
                <div className="mb-4 p-3 bg-psyduck-success/10 rounded-xl w-fit">
                  <Trophy className="h-8 w-8 text-psyduck-success" />
                </div>
                <CardTitle className="text-xl mb-3">Gamified Learning</CardTitle>
                <CardDescription className="text-base leading-relaxed">
                  Level up your skills with XP points, unlock achievement badges, maintain learning 
                  streaks, and compete on leaderboards with fellow developers.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 text-sm text-psyduck-success font-medium">
                  <Zap className="h-4 w-4" />
                  <span>Stay motivated & engaged</span>
                </div>
              </CardContent>
            </Card>
            
            <Card className="relative group hover:shadow-xl transition-all duration-300 border-l-4 border-l-blue-500/20 hover:border-l-blue-500">
              <CardHeader className="pb-4">
                <div className="mb-4 p-3 bg-blue-50 rounded-xl w-fit">
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle className="text-xl mb-3">Career Opportunities</CardTitle>
                <CardDescription className="text-base leading-relaxed">
                  Top performers get direct access to hiring opportunities from our partner companies. 
                  Build your portfolio while getting discovered by recruiters.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 text-sm text-blue-600 font-medium">
                  <Star className="h-4 w-4" />
                  <span>Direct path to employment</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Additional benefits row */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
            <div className="text-center">
              <div className="h-12 w-12 rounded-full bg-psyduck-primary/10 flex items-center justify-center mx-auto mb-3">
                <BookOpen className="h-6 w-6 text-psyduck-primary" />
              </div>
              <h4 className="font-semibold mb-2">Self-Paced Learning</h4>
              <p className="text-sm text-muted-foreground">Learn at your own speed with flexible scheduling</p>
            </div>
            
            <div className="text-center">
              <div className="h-12 w-12 rounded-full bg-psyduck-success/10 flex items-center justify-center mx-auto mb-3">
                <Users className="h-6 w-6 text-psyduck-success" />
              </div>
              <h4 className="font-semibold mb-2">Community Support</h4>
              <p className="text-sm text-muted-foreground">Connect with peers and mentors in our community</p>
            </div>
            
            <div className="text-center">
              <div className="h-12 w-12 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-3">
                <Code className="h-6 w-6 text-blue-600" />
              </div>
              <h4 className="font-semibold mb-2">Modern Tech Stack</h4>
              <p className="text-sm text-muted-foreground">Work with cutting-edge technologies and frameworks</p>
            </div>
            
            <div className="text-center">
              <div className="h-12 w-12 rounded-full bg-purple-50 flex items-center justify-center mx-auto mb-3">
                <Zap className="h-6 w-6 text-purple-600" />
              </div>
              <h4 className="font-semibold mb-2">Instant Feedback</h4>
              <p className="text-sm text-muted-foreground">Get real-time code execution and testing results</p>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Features */}
      <section className="py-20 bg-gradient-to-r from-psyduck-primary/5 via-psyduck-soft/10 to-psyduck-success/5">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">
              Experience Psyduck Today
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Jump right in with our demo account. No registration required - start exploring 
              projects, coding in the browser, and experiencing gamified learning instantly.
            </p>
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border rounded-full px-6 py-3 shadow-lg">
              <div className="h-3 w-3 bg-psyduck-success rounded-full animate-pulse" />
              <span className="text-sm font-medium">Demo account ready - instant access!</span>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <Card className="text-center group hover:shadow-lg transition-all duration-300 bg-white/90 backdrop-blur-sm">
              <CardContent className="p-8">
                <div className="mb-4 p-4 bg-psyduck-primary/10 rounded-2xl w-fit mx-auto group-hover:scale-110 transition-transform duration-300">
                  <BookOpen className="h-8 w-8 text-psyduck-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-3">Browse Projects</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Explore 50+ real-world projects across different tech stacks and difficulty levels
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center group hover:shadow-lg transition-all duration-300 bg-white/90 backdrop-blur-sm">
              <CardContent className="p-8">
                <div className="mb-4 p-4 bg-psyduck-primary/10 rounded-2xl w-fit mx-auto group-hover:scale-110 transition-transform duration-300">
                  <Code className="h-8 w-8 text-psyduck-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-3">Code in Browser</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Full-featured IDE with syntax highlighting, autocomplete, and instant execution
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center group hover:shadow-lg transition-all duration-300 bg-white/90 backdrop-blur-sm">
              <CardContent className="p-8">
                <div className="mb-4 p-4 bg-psyduck-success/10 rounded-2xl w-fit mx-auto group-hover:scale-110 transition-transform duration-300">
                  <Trophy className="h-8 w-8 text-psyduck-success" />
                </div>
                <h3 className="text-lg font-semibold mb-3">Earn Rewards</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Gain XP points, unlock achievement badges, and track your learning progress
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center group hover:shadow-lg transition-all duration-300 bg-white/90 backdrop-blur-sm">
              <CardContent className="p-8">
                <div className="mb-4 p-4 bg-blue-50 rounded-2xl w-fit mx-auto group-hover:scale-110 transition-transform duration-300">
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold mb-3">Join Community</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Compete on leaderboards and connect with fellow developers worldwide
                </p>
              </CardContent>
            </Card>
          </div>
          
          <div className="text-center">
            <Button 
              size="lg"
              onClick={() => navigate('/login')}
              className="bg-white text-psyduck-primary border-2 border-psyduck-primary hover:bg-psyduck-primary hover:text-white px-8 py-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              <span className="mr-3 text-lg">🎮</span>
              Access Demo Account Now
              <ArrowRight className="ml-3 h-5 w-5" />
            </Button>
            <p className="text-sm text-muted-foreground mt-4">
              Use <code className="bg-white/50 px-2 py-1 rounded">demo@psyduck.dev</code> with password <code className="bg-white/50 px-2 py-1 rounded">demo123</code>
            </p>
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">Success Stories</h2>
            <p className="text-xl text-muted-foreground">Real developers, real results</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="p-6 hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-center gap-4 mb-4">
                <img 
                  src="https://images.unsplash.com/photo-1579389248774-07907f421a6b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWFtJTIwY29sbGFib3JhdGlvbiUyMG1vZGVybiUyMG9mZmljZXxlbnwxfHx8fDE3NTU2NzM4NTV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="Sarah Chen"
                  className="h-12 w-12 rounded-full object-cover"
                />
                <div>
                  <h4 className="font-semibold">Sarah Chen</h4>
                  <p className="text-sm text-muted-foreground">Full-Stack Developer at TechCorp</p>
                </div>
              </div>
              <p className="text-muted-foreground italic">
                "Psyduck's project-based approach helped me land my dream job. The real-world projects 
                gave me a portfolio that stood out to recruiters."
              </p>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-center gap-4 mb-4">
                <img 
                  src="https://images.unsplash.com/photo-1596496356933-e55641d98edf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsZWFybmluZyUyMHN0dWRlbnRzJTIwdGVjaG5vbG9neSUyMGVkdWNhdGlvbnxlbnwxfHx8fDE3NTU3MDk3Njl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="Alex Rodriguez"
                  className="h-12 w-12 rounded-full object-cover"
                />
                <div>
                  <h4 className="font-semibold">Alex Rodriguez</h4>
                  <p className="text-sm text-muted-foreground">Mobile App Developer</p>
                </div>
              </div>
              <p className="text-muted-foreground italic">
                "The gamification kept me motivated throughout my learning journey. I went from 
                beginner to getting hired in just 8 months!"
              </p>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow duration-300 md:col-span-2 lg:col-span-1">
              <div className="flex items-center gap-4 mb-4">
                <div className="h-12 w-12 rounded-full bg-psyduck-primary/20 flex items-center justify-center">
                  <span className="text-xl">👨‍💻</span>
                </div>
                <div>
                  <h4 className="font-semibold">Michael Kim</h4>
                  <p className="text-sm text-muted-foreground">Data Scientist at StartupXYZ</p>
                </div>
              </div>
              <p className="text-muted-foreground italic">
                "The AI/ML projects on Psyduck gave me hands-on experience that no traditional 
                course could provide. Highly recommended!"
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-gradient-to-r from-psyduck-primary to-psyduck-primary-hover text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-gradient-to-br from-white/5 via-transparent to-white/5" />
        <div className="container mx-auto px-4 text-center relative">
          <h2 className="text-4xl lg:text-5xl font-bold mb-8">
            Ready to Transform Your Coding Journey?
          </h2>
          <p className="text-xl opacity-90 mb-12 max-w-3xl mx-auto leading-relaxed">
            Join thousands of developers who have already accelerated their careers with Psyduck. 
            Start building real projects, earn achievements, and unlock exciting opportunities today.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button 
              size="lg"
              variant="secondary"
              className="bg-white text-psyduck-primary hover:bg-gray-50 px-10 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105"
              onClick={() => navigate('/register')}
            >
              Start Your Free Journey
              <ArrowRight className="ml-3 h-5 w-5" />
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="border-2 border-white text-white hover:bg-white hover:text-psyduck-primary px-10 py-4 rounded-xl font-semibold text-lg transition-all duration-300"
              onClick={() => navigate('/login')}
            >
              Try Demo First
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-psyduck-dark text-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="text-3xl">🦆</div>
                <span className="text-2xl font-bold">Psyduck</span>
              </div>
              <p className="text-gray-300 leading-relaxed">
                Empowering developers worldwide through project-based learning and gamified experiences.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-gray-300">
                <li><a href="#" className="hover:text-psyduck-primary transition-colors">Projects</a></li>
                <li><a href="#" className="hover:text-psyduck-primary transition-colors">Leaderboard</a></li>
                <li><a href="#" className="hover:text-psyduck-primary transition-colors">Achievements</a></li>
                <li><a href="#" className="hover:text-psyduck-primary transition-colors">Community</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-gray-300">
                <li><a href="#" className="hover:text-psyduck-primary transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-psyduck-primary transition-colors">Tutorials</a></li>
                <li><a href="#" className="hover:text-psyduck-primary transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-psyduck-primary transition-colors">Support</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-300">
                <li><a href="#" className="hover:text-psyduck-primary transition-colors">About</a></li>
                <li><a href="#" className="hover:text-psyduck-primary transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-psyduck-primary transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-psyduck-primary transition-colors">Terms</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-700 pt-8 text-center">
            <p className="text-gray-400">
              © 2024 Psyduck Learning Platform. Built with 🦆 and passion for coding education.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
import React, { useEffect } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { CheckCircle, ArrowRight, Calendar, Users, Briefcase } from 'lucide-react';
import { useRouterContext } from '../../contexts/RouterContext';

export function SuccessScreen() {
  const { navigate } = useRouterContext();

  // Auto-redirect after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/profile');
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-lg text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
        <CardHeader>
          <div className="mx-auto mb-4">
            <div className="relative">
              <CheckCircle className="h-20 w-20 text-psyduck-success animate-pulse" />
              <div className="absolute inset-0 rounded-full border-4 border-psyduck-success/20 animate-ping" />
            </div>
          </div>
          <CardTitle className="text-2xl text-psyduck-primary">Application Submitted Successfully!</CardTitle>
          <CardDescription>
            Your recruiting information has been saved and is ready for review by our partner companies.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 gap-3 text-sm">
            <div className="flex items-center justify-center gap-2 p-3 bg-psyduck-success/10 rounded-lg">
              <CheckCircle className="h-4 w-4 text-psyduck-success" />
              <span>Profile information saved</span>
            </div>
            <div className="flex items-center justify-center gap-2 p-3 bg-psyduck-success/10 rounded-lg">
              <CheckCircle className="h-4 w-4 text-psyduck-success" />
              <span>Documents uploaded securely</span>
            </div>
            <div className="flex items-center justify-center gap-2 p-3 bg-psyduck-success/10 rounded-lg">
              <CheckCircle className="h-4 w-4 text-psyduck-success" />
              <span>Video resume linked</span>
            </div>
          </div>
          
          <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
            <h3 className="font-medium text-left">What happens next?</h3>
            <div className="space-y-3 text-sm text-left">
              <div className="flex items-start gap-3">
                <Users className="h-4 w-4 text-psyduck-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">Profile Review</p>
                  <p className="text-muted-foreground">Our team will review your application within 2-3 business days</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Briefcase className="h-4 w-4 text-psyduck-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">Opportunity Matching</p>
                  <p className="text-muted-foreground">We'll match you with relevant job opportunities and projects</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Calendar className="h-4 w-4 text-psyduck-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">Direct Contact</p>
                  <p className="text-muted-foreground">Companies will reach out directly for interviews and opportunities</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="pt-2 space-y-3">
            <p className="text-sm text-muted-foreground">
              You can view and edit your recruiting information anytime from your profile.
            </p>
            
            <div className="flex gap-2">
              <Button 
                variant="outline"
                onClick={() => navigate('/dashboard')}
                className="flex-1"
              >
                Continue Learning
              </Button>
              <Button 
                onClick={() => navigate('/profile')}
                className="flex-1 bg-psyduck-primary hover:bg-psyduck-primary-hover"
              >
                View Profile
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
            
            <p className="text-xs text-muted-foreground">
              Redirecting to profile in 5 seconds...
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
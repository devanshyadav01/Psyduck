import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { 
  Crown, 
  Check, 
  Star, 
  Zap, 
  Shield, 
  Users, 
  Video, 
  BookOpen,
  Trophy,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';

interface PremiumFeature {
  icon: React.ReactNode;
  title: string;
  description: string;
  included: boolean;
}

const PREMIUM_FEATURES: PremiumFeature[] = [
  {
    icon: <Video className="h-5 w-5" />,
    title: "Content Creator Studio",
    description: "Submit and share educational content with the community",
    included: true
  },
  {
    icon: <BookOpen className="h-5 w-5" />,
    title: "Advanced Projects",
    description: "Access to premium projects and real-world challenges",
    included: true
  },
  {
    icon: <Users className="h-5 w-5" />,
    title: "Priority Support",
    description: "Get help faster with priority customer support",
    included: true
  },
  {
    icon: <Trophy className="h-5 w-5" />,
    title: "Exclusive Badges",
    description: "Earn premium badges and showcase your achievements",
    included: true
  },
  {
    icon: <Zap className="h-5 w-5" />,
    title: "Early Access",
    description: "Be the first to try new features and projects",
    included: true
  },
  {
    icon: <Shield className="h-5 w-5" />,
    title: "Ad-Free Experience",
    description: "Enjoy Psyduck without any distractions",
    included: true
  },
  {
    icon: <Star className="h-5 w-5" />,
    title: "Premium Profile",
    description: "Stand out with a premium profile badge",
    included: true
  },
  {
    icon: <Sparkles className="h-5 w-5" />,
    title: "Custom Themes",
    description: "Personalize your experience with premium themes",
    included: true
  }
];

interface PremiumUpgradeProps {
  isDialog?: boolean;
  onClose?: () => void;
}

export function PremiumUpgrade({ isDialog = false, onClose }: PremiumUpgradeProps) {
  const { user, upgradeToPremium } = useAuth();
  const [isUpgrading, setIsUpgrading] = useState(false);

  const handleUpgrade = async () => {
    setIsUpgrading(true);
    try {
      const success = await upgradeToPremium();
      if (success && onClose) {
        setTimeout(onClose, 1500); // Allow time for success toast
      }
    } catch (error) {
      console.error('Upgrade failed:', error);
    } finally {
      setIsUpgrading(false);
    }
  };

  const isPremium = user?.membership === 'premium' || user?.membership === 'pro';

  const UpgradeContent = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center mb-4">
          <Crown className="h-12 w-12 text-yellow-500" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Upgrade to Premium</h2>
        <p className="text-muted-foreground">
          Unlock all features and accelerate your learning journey
        </p>
      </div>

      {/* Pricing */}
      <Card className="border-2 border-yellow-500/50 bg-gradient-to-b from-yellow-50/50 to-orange-50/50">
        <CardHeader className="text-center pb-4">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Crown className="h-6 w-6 text-yellow-500" />
            <CardTitle className="text-xl">Premium Plan</CardTitle>
          </div>
          <div className="flex items-baseline justify-center gap-1">
            <span className="text-3xl font-bold">$9.99</span>
            <span className="text-muted-foreground">/month</span>
          </div>
          <CardDescription>
            Cancel anytime • 7-day free trial
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Features */}
      <div className="space-y-4">
        <h3 className="font-semibold text-lg">What's included:</h3>
        <div className="grid gap-3">
          {PREMIUM_FEATURES.map((feature, index) => (
            <div key={index} className="flex items-start gap-3 p-3 rounded-lg border bg-card/50">
              <div className="flex-shrink-0 p-2 rounded-lg bg-psyduck-primary/10 text-psyduck-primary">
                {feature.icon}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium">{feature.title}</h4>
                  <Check className="h-4 w-4 text-psyduck-success" />
                </div>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action Button */}
      <div className="pt-4">
        {isPremium ? (
          <div className="text-center">
            <Badge className="bg-yellow-100 text-yellow-800 text-sm px-4 py-2">
              <Crown className="h-4 w-4 mr-2" />
              You're already Premium!
            </Badge>
          </div>
        ) : (
          <Button
            onClick={handleUpgrade}
            disabled={isUpgrading}
            className="w-full h-12 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-semibold"
            size="lg"
          >
            {isUpgrading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                Processing...
              </>
            ) : (
              <>
                <Crown className="h-5 w-5 mr-2" />
                Start 7-Day Free Trial
              </>
            )}
          </Button>
        )}
      </div>

      {/* Trust indicators */}
      <div className="text-center text-sm text-muted-foreground">
        <p>🔒 Secure payment • 💳 No commitment • ⭐ Cancel anytime</p>
      </div>
    </div>
  );

  if (isDialog) {
    return (
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="sr-only">Premium Upgrade</DialogTitle>
          <DialogDescription className="sr-only">
            Upgrade to premium to unlock all features
          </DialogDescription>
        </DialogHeader>
        <UpgradeContent />
      </DialogContent>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <UpgradeContent />
    </div>
  );
}

// Standalone Premium Upgrade Dialog Component
export function PremiumUpgradeDialog({ 
  children, 
  onOpenChange 
}: { 
  children: React.ReactNode;
  onOpenChange?: (open: boolean) => void;
}) {
  return (
    <Dialog onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <PremiumUpgrade isDialog onClose={() => onOpenChange?.(false)} />
    </Dialog>
  );
}

export default PremiumUpgrade;
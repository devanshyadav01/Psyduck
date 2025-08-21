import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { navigationTracker } from '../lib/performance/navigation';
import { Activity, Clock, Zap, TrendingUp, BarChart3 } from 'lucide-react';

interface PerformanceStats {
  averageNavigationTime: number;
  totalNavigations: number;
  slowNavigations: number;
  fastNavigations: number;
  recentNavigations: Array<{
    route: string;
    duration: number;
    timestamp: number;
  }>;
}

export const PerformanceMonitor: React.FC = React.memo(() => {
  const [isVisible, setIsVisible] = useState(false);
  const [stats, setStats] = useState<PerformanceStats>({
    averageNavigationTime: 0,
    totalNavigations: 0,
    slowNavigations: 0,
    fastNavigations: 0,
    recentNavigations: []
  });

  // Update stats periodically
  useEffect(() => {
    const updateStats = () => {
      const metrics = navigationTracker.getMetrics();
      const averageTime = navigationTracker.getAverageNavigationTime();
      
      const recentNavigations = metrics
        .slice(-10)
        .map(metric => ({
          route: metric.route,
          duration: metric.duration || 0,
          timestamp: metric.startTime
        }));

      const slowNavigations = metrics.filter(m => (m.duration || 0) > 500).length;
      const fastNavigations = metrics.filter(m => (m.duration || 0) <= 200).length;

      setStats({
        averageNavigationTime: averageTime,
        totalNavigations: metrics.length,
        slowNavigations,
        fastNavigations,
        recentNavigations
      });
    };

    // Update immediately and then every 2 seconds
    updateStats();
    const interval = setInterval(updateStats, 2000);

    return () => clearInterval(interval);
  }, []);

  // Performance grade calculation
  const performanceGrade = useMemo(() => {
    if (stats.averageNavigationTime === 0) return { grade: 'N/A', color: 'bg-gray-500' };
    if (stats.averageNavigationTime < 200) return { grade: 'A+', color: 'bg-green-500' };
    if (stats.averageNavigationTime < 400) return { grade: 'A', color: 'bg-green-400' };
    if (stats.averageNavigationTime < 600) return { grade: 'B', color: 'bg-yellow-500' };
    if (stats.averageNavigationTime < 1000) return { grade: 'C', color: 'bg-orange-500' };
    return { grade: 'D', color: 'bg-red-500' };
  }, [stats.averageNavigationTime]);

  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  // Toggle button
  if (!isVisible) {
    return (
      <div 
        className="floating-container prevent-move z-floating"
        style={{
          position: 'fixed',
          bottom: '1rem',
          right: '5rem',
          zIndex: 998,
          pointerEvents: 'none'
        }}
      >
        <div style={{ pointerEvents: 'auto' }}>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setIsVisible(true)}
            className="bg-background/80 backdrop-blur-sm border-psyduck-primary/20 text-xs gpu-accelerated"
          >
            <Activity className="w-3 h-3 mr-1" />
            Perf
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="floating-container prevent-move z-floating"
      style={{
        position: 'fixed',
        bottom: '1rem',
        right: '1rem',
        zIndex: 998,
        pointerEvents: 'none',
        width: '20rem'
      }}
    >
      <div style={{ pointerEvents: 'auto' }}>
        <Card className="bg-background/95 backdrop-blur-sm border-psyduck-primary/20 shadow-lg gpu-accelerated">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm flex items-center gap-2">
              <Activity className="w-4 h-4 text-psyduck-primary" />
              Performance Monitor
            </CardTitle>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setIsVisible(false)}
              className="h-6 w-6 p-0"
            >
              ×
            </Button>
          </div>
          <CardDescription className="text-xs">
            Navigation performance metrics
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Performance Grade */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium">Overall Grade</span>
            <Badge className={`${performanceGrade.color} text-white text-xs px-2 py-1`}>
              {performanceGrade.grade}
            </Badge>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-muted/50 rounded-lg p-2">
              <div className="flex items-center gap-1 mb-1">
                <Clock className="w-3 h-3 text-psyduck-primary" />
                <span className="text-xs font-medium">Avg Time</span>
              </div>
              <div className="text-sm font-bold">
                {stats.averageNavigationTime.toFixed(0)}ms
              </div>
            </div>

            <div className="bg-muted/50 rounded-lg p-2">
              <div className="flex items-center gap-1 mb-1">
                <BarChart3 className="w-3 h-3 text-psyduck-success" />
                <span className="text-xs font-medium">Total</span>
              </div>
              <div className="text-sm font-bold">
                {stats.totalNavigations}
              </div>
            </div>

            <div className="bg-muted/50 rounded-lg p-2">
              <div className="flex items-center gap-1 mb-1">
                <Zap className="w-3 h-3 text-green-600" />
                <span className="text-xs font-medium">Fast</span>
              </div>
              <div className="text-sm font-bold">
                {stats.fastNavigations}
              </div>
            </div>

            <div className="bg-muted/50 rounded-lg p-2">
              <div className="flex items-center gap-1 mb-1">
                <TrendingUp className="w-3 h-3 text-red-600" />
                <span className="text-xs font-medium">Slow</span>
              </div>
              <div className="text-sm font-bold">
                {stats.slowNavigations}
              </div>
            </div>
          </div>

          {/* Recent Navigations */}
          {stats.recentNavigations.length > 0 && (
            <div>
              <div className="text-xs font-medium mb-2">Recent Navigations</div>
              <div className="space-y-1 max-h-32 overflow-y-auto psyduck-scrollbar">
                {stats.recentNavigations.slice(0, 5).map((nav, index) => (
                  <div key={index} className="flex items-center justify-between text-xs bg-muted/30 rounded px-2 py-1">
                    <span className="truncate flex-1 pr-2">{nav.route}</span>
                    <Badge 
                      variant="secondary" 
                      className={`text-xs px-1 py-0 ${
                        nav.duration > 500 ? 'bg-red-100 text-red-700' :
                        nav.duration > 200 ? 'bg-yellow-100 text-yellow-700' :
                        'bg-green-100 text-green-700'
                      }`}
                    >
                      {nav.duration.toFixed(0)}ms
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                navigationTracker.cleanup();
                console.log('🧹 Performance metrics cleared');
              }}
              className="text-xs flex-1"
            >
              Clear Data
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                const metrics = navigationTracker.getMetrics();
                console.table(metrics);
                console.log('📊 Performance data logged to console');
              }}
              className="text-xs flex-1"
            >
              Log Data
            </Button>
          </div>
        </CardContent>
        </Card>
      </div>
    </div>
  );
});

PerformanceMonitor.displayName = 'PerformanceMonitor';

export default PerformanceMonitor;
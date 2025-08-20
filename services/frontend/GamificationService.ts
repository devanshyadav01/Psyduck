// Frontend Gamification Service
import { apiClient, ApiResponse } from '../api/ApiClient';

export interface UserStats {
  level: number;
  xp: number;
  xpToNextLevel: number;
  totalProjectsCompleted: number;
  currentStreak: number;
  longestStreak: number;
  badges: Badge[];
  achievements: Achievement[];
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  iconUrl: string;
  category: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  requirements: string[];
  xpReward: number;
  earnedAt?: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  type: string;
  progress: number;
  maxProgress: number;
  completed: boolean;
  completedAt?: string;
}

export interface LeaderboardEntry {
  userId: string;
  username: string;
  profileImage?: string;
  rank: number;
  xp: number;
  level: number;
  projectsCompleted: number;
  currentStreak: number;
}

export interface LeaderboardData {
  rankings: LeaderboardEntry[];
  userRank?: number;
  totalUsers: number;
}

class GamificationServiceFrontend {
  private userStats: UserStats | null = null;
  private leaderboardData: Map<string, LeaderboardData> = new Map();
  private availableBadges: Badge[] = [];
  private lastStatsUpdate: number = 0;
  private cacheDuration: number = 2 * 60 * 1000; // 2 minutes

  // Set authentication (called by service manager)
  setAuth(token: string | null, user: any | null): void {
    if (!token) {
      this.clearData();
    }
  }

  // Get user statistics with caching
  async getUserStats(): Promise<ApiResponse<UserStats>> {
    try {
      const now = Date.now();
      const isCacheValid = (now - this.lastStatsUpdate) < this.cacheDuration && this.userStats !== null;

      if (isCacheValid) {
        return {
          data: this.userStats,
          success: true,
          message: 'User stats retrieved from cache'
        };
      }

      const response = await apiClient.get<UserStats>('/user/stats');

      if (response.success && response.data) {
        this.userStats = response.data;
        this.lastStatsUpdate = now;
      }

      return response;
    } catch (error) {
      console.error('GamificationService get user stats error:', error);
      return {
        data: null,
        success: false,
        message: error instanceof Error ? error.message : 'Failed to get user stats'
      };
    }
  }

  // Get leaderboard with caching
  async getLeaderboard(timeframe: 'weekly' | 'monthly' | 'all-time' = 'all-time'): Promise<ApiResponse<LeaderboardData>> {
    try {
      // Check cache first
      const cached = this.leaderboardData.get(timeframe);
      if (cached) {
        return {
          data: cached,
          success: true,
          message: 'Leaderboard retrieved from cache'
        };
      }

      const response = await apiClient.get<LeaderboardData>('/gamification/leaderboard', {
        params: { timeframe }
      });

      if (response.success && response.data) {
        this.leaderboardData.set(timeframe, response.data);
      }

      return response;
    } catch (error) {
      console.error('GamificationService get leaderboard error:', error);
      return {
        data: null,
        success: false,
        message: error instanceof Error ? error.message : 'Failed to get leaderboard'
      };
    }
  }

  // Get available badges
  async getBadges(): Promise<ApiResponse<{ available: Badge[]; earned: Badge[] }>> {
    try {
      const response = await apiClient.get<{ available: Badge[]; earned: Badge[] }>('/gamification/badges');

      if (response.success && response.data) {
        this.availableBadges = response.data.available;
      }

      return response;
    } catch (error) {
      console.error('GamificationService get badges error:', error);
      return {
        data: null,
        success: false,
        message: error instanceof Error ? error.message : 'Failed to get badges'
      };
    }
  }

  // Calculate XP progress
  getXPProgress(): { percentage: number; current: number; needed: number } {
    if (!this.userStats) {
      return { percentage: 0, current: 0, needed: 0 };
    }

    const { xp, xpToNextLevel } = this.userStats;
    const currentLevelXP = xp % 1000; // Assuming 1000 XP per level
    const percentage = (currentLevelXP / 1000) * 100;

    return {
      percentage,
      current: currentLevelXP,
      needed: xpToNextLevel
    };
  }

  // Get badge by category
  getBadgesByCategory(category: string): Badge[] {
    return this.availableBadges.filter(badge => badge.category === category);
  }

  // Get badge by rarity
  getBadgesByRarity(rarity: Badge['rarity']): Badge[] {
    return this.availableBadges.filter(badge => badge.rarity === rarity);
  }

  // Check if user has specific badge
  hasBadge(badgeId: string): boolean {
    if (!this.userStats) return false;
    return this.userStats.badges.some(badge => badge.id === badgeId);
  }

  // Get user's rank for specific timeframe
  getUserRank(timeframe: 'weekly' | 'monthly' | 'all-time' = 'all-time'): number | null {
    const leaderboard = this.leaderboardData.get(timeframe);
    return leaderboard?.userRank || null;
  }

  // Get users above/below current user in leaderboard
  getNearbyUsers(timeframe: 'weekly' | 'monthly' | 'all-time' = 'all-time', range: number = 2): LeaderboardEntry[] {
    const leaderboard = this.leaderboardData.get(timeframe);
    if (!leaderboard || !leaderboard.userRank) return [];

    const userRank = leaderboard.userRank;
    const startIndex = Math.max(0, userRank - range - 1);
    const endIndex = Math.min(leaderboard.rankings.length, userRank + range);

    return leaderboard.rankings.slice(startIndex, endIndex);
  }

  // Calculate streak bonus
  getStreakBonus(): number {
    if (!this.userStats) return 0;

    const { currentStreak } = this.userStats;
    
    // Calculate bonus based on streak length
    if (currentStreak >= 30) return 50; // 30+ days: 50% bonus
    if (currentStreak >= 14) return 25; // 14+ days: 25% bonus
    if (currentStreak >= 7) return 15;  // 7+ days: 15% bonus
    if (currentStreak >= 3) return 10;  // 3+ days: 10% bonus
    
    return 0;
  }

  // Get level information
  getLevelInfo(): { current: number; next: number; progress: number } {
    if (!this.userStats) {
      return { current: 1, next: 2, progress: 0 };
    }

    const { level, xp } = this.userStats;
    const currentLevelXP = xp % 1000; // Assuming 1000 XP per level
    const progress = (currentLevelXP / 1000) * 100;

    return {
      current: level,
      next: level + 1,
      progress
    };
  }

  // Get achievement progress
  getAchievementProgress(): { completed: number; total: number; percentage: number } {
    if (!this.userStats) {
      return { completed: 0, total: 0, percentage: 0 };
    }

    const { achievements } = this.userStats;
    const completed = achievements.filter(a => a.completed).length;
    const total = achievements.length;
    const percentage = total > 0 ? (completed / total) * 100 : 0;

    return { completed, total, percentage };
  }

  // Simulate XP gain (for UI feedback)
  simulateXPGain(amount: number): void {
    if (this.userStats) {
      this.userStats.xp += amount;
      this.userStats.xpToNextLevel = Math.max(0, this.userStats.xpToNextLevel - amount);
      
      // Check for level up
      if (this.userStats.xpToNextLevel <= 0) {
        this.userStats.level += 1;
        this.userStats.xpToNextLevel = 1000; // Next level requirement
      }
    }
  }

  // Get gamification summary
  getGamificationSummary() {
    if (!this.userStats) return null;

    const { level, xp, currentStreak, badges, achievements } = this.userStats;
    const completedAchievements = achievements.filter(a => a.completed).length;
    const rareBadges = badges.filter(b => b.rarity === 'rare' || b.rarity === 'epic' || b.rarity === 'legendary').length;

    return {
      level,
      xp,
      currentStreak,
      totalBadges: badges.length,
      rareBadges,
      completedAchievements,
      totalAchievements: achievements.length,
      streakBonus: this.getStreakBonus()
    };
  }

  // Clear all cached data
  clearData(): void {
    this.userStats = null;
    this.leaderboardData.clear();
    this.availableBadges = [];
    this.lastStatsUpdate = 0;
  }

  // Force refresh all gamification data
  async refreshAll(): Promise<void> {
    this.lastStatsUpdate = 0;
    this.leaderboardData.clear();
    
    await Promise.all([
      this.getUserStats(),
      this.getLeaderboard('weekly'),
      this.getLeaderboard('monthly'),
      this.getLeaderboard('all-time'),
      this.getBadges()
    ]);
  }

  // Get cached user stats (synchronous)
  getCachedUserStats(): UserStats | null {
    return this.userStats;
  }
}

// Create singleton instance
export const gamificationServiceFrontend = new GamificationServiceFrontend();

// Export for use in components and hooks
export default gamificationServiceFrontend;
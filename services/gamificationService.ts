import { apiService } from './apiService';

export interface XPTransaction {
  id: string;
  userId: string;
  amount: number;
  sourceType: 'project_completion' | 'milestone_completion' | 'daily_login' | 'streak_bonus' | 'assessment' | 'peer_review' | 'mentoring';
  sourceId?: string;
  description: string;
  createdAt: string;
}

export interface Badge {
  id: string;
  name: string;
  slug: string;
  description: string;
  iconUrl: string;
  category: 'completion' | 'streak' | 'skill' | 'community' | 'special';
  criteria: Record<string, any>;
  xpValue: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  isActive: boolean;
}

export interface UserBadge {
  id: string;
  userId: string;
  badge: Badge;
  earnedAt: string;
  progressData?: Record<string, any>;
}

export interface LeaderboardEntry {
  rank: number;
  user: {
    id: string;
    username: string;
    avatarUrl?: string;
    level: number;
  };
  xp: number;
  change: number; // Position change from last period
  projectsCompleted?: number;
  currentStreak?: number;
}

export interface LeaderboardResponse {
  leaderboard: LeaderboardEntry[];
  userPosition?: LeaderboardEntry;
  meta: {
    totalUsers: number;
    lastUpdated: string;
  };
}

export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastActivityDate: string;
  streakFreezeUsed: number;
  streakFreezeAvailable: number;
}

export interface LevelInfo {
  currentLevel: number;
  currentXp: number;
  xpForCurrentLevel: number;
  xpForNextLevel: number;
  progressToNextLevel: number; // Percentage
}

class GamificationService {
  // XP Management
  async getXPHistory(limit = 50): Promise<XPTransaction[]> {
    return apiService.get<XPTransaction[]>(`/users/me/xp/history?limit=${limit}`);
  }

  async getXPSummary(): Promise<{
    totalXp: number;
    level: LevelInfo;
    weeklyXp: number;
    monthlyXp: number;
    recentTransactions: XPTransaction[];
  }> {
    return apiService.get('/users/me/xp');
  }

  async recordDailyCheckin(): Promise<{
    xpAwarded: number;
    streakBonus: number;
    newStreak: number;
    message: string;
  }> {
    return apiService.post('/users/me/daily-checkin');
  }

  // Badge System
  async getAllBadges(): Promise<Badge[]> {
    return apiService.get<Badge[]>('/badges');
  }

  async getUserBadges(): Promise<UserBadge[]> {
    return apiService.get<UserBadge[]>('/users/me/badges');
  }

  async getBadgeProgress(badgeId: string): Promise<{
    badge: Badge;
    progress: Record<string, any>;
    completion: number; // Percentage
    requirements: Array<{
      name: string;
      current: number;
      required: number;
      completed: boolean;
    }>;
  }> {
    return apiService.get(`/badges/${badgeId}/progress`);
  }

  async getBadgesByCategory(category: Badge['category']): Promise<Badge[]> {
    return apiService.get<Badge[]>(`/badges?category=${category}`);
  }

  // Leaderboard
  async getLeaderboard(
    type: 'global' | 'weekly' | 'monthly' = 'global',
    domainId?: string,
    limit = 100
  ): Promise<LeaderboardResponse> {
    const params: Record<string, string> = { type, limit: limit.toString() };
    if (domainId) params.domain = domainId;
    
    return apiService.get<LeaderboardResponse>('/leaderboard', params);
  }

  async getStreakLeaderboard(limit = 50): Promise<{
    leaderboard: Array<{
      rank: number;
      user: {
        id: string;
        username: string;
        avatarUrl?: string;
      };
      currentStreak: number;
      longestStreak: number;
    }>;
  }> {
    return apiService.get(`/leaderboard/streaks?limit=${limit}`);
  }

  // Streak Management
  async getStreakData(): Promise<StreakData> {
    return apiService.get<StreakData>('/users/me/streak');
  }

  async useStreakFreeze(): Promise<{
    success: boolean;
    message: string;
    streakFreezeRemaining: number;
  }> {
    return apiService.post('/users/me/streak/freeze');
  }

  async getStreakHistory(): Promise<Array<{
    date: string;
    wasActive: boolean;
    xpEarned: number;
    activitiesCompleted: number;
  }>> {
    return apiService.get('/users/me/streak/history');
  }

  // Level System
  async getLevelInfo(): Promise<LevelInfo> {
    return apiService.get<LevelInfo>('/users/me/level');
  }

  async getLevelRewards(level: number): Promise<{
    level: number;
    rewards: Array<{
      type: 'xp' | 'badge' | 'feature' | 'cosmetic';
      name: string;
      description: string;
      value?: number;
    }>;
  }> {
    return apiService.get(`/levels/${level}/rewards`);
  }

  // Achievement Progress
  async getOverallProgress(): Promise<{
    completedProjects: number;
    totalProjects: number;
    domainsExplored: number;
    totalDomains: number;
    badgesEarned: number;
    totalBadges: number;
    currentStreak: number;
    bestStreak: number;
    totalTimeSpent: number; // in minutes
    averageSessionTime: number; // in minutes
  }> {
    return apiService.get('/users/me/progress');
  }

  async getDomainProgress(): Promise<Array<{
    domain: {
      id: string;
      name: string;
      colorHex: string;
    };
    completedProjects: number;
    totalProjects: number;
    xpEarned: number;
    skillsUnlocked: number;
    completion: number; // percentage
  }>> {
    return apiService.get('/users/me/domains/progress');
  }

  // Social Features
  async followUser(userId: string): Promise<{ message: string }> {
    return apiService.post(`/users/${userId}/follow`);
  }

  async unfollowUser(userId: string): Promise<{ message: string }> {
    return apiService.delete(`/users/${userId}/follow`);
  }

  async getFollowers(): Promise<Array<{
    id: string;
    username: string;
    avatarUrl?: string;
    level: number;
    totalXp: number;
    followedAt: string;
  }>> {
    return apiService.get('/users/me/followers');
  }

  async getFollowing(): Promise<Array<{
    id: string;
    username: string;
    avatarUrl?: string;
    level: number;
    totalXp: number;
    followedAt: string;
  }>> {
    return apiService.get('/users/me/following');
  }

  // Challenges and Competitions
  async getActiveChallenges(): Promise<Array<{
    id: string;
    title: string;
    description: string;
    type: 'daily' | 'weekly' | 'monthly' | 'special';
    requirements: Record<string, any>;
    rewards: {
      xp: number;
      badges?: string[];
    };
    startDate: string;
    endDate: string;
    participantCount: number;
    isParticipating: boolean;
    progress?: Record<string, any>;
  }>> {
    return apiService.get('/challenges/active');
  }

  async joinChallenge(challengeId: string): Promise<{ message: string }> {
    return apiService.post(`/challenges/${challengeId}/join`);
  }

  async getChallengeLeaderboard(challengeId: string): Promise<{
    challenge: {
      id: string;
      title: string;
      endDate: string;
    };
    leaderboard: Array<{
      rank: number;
      user: {
        id: string;
        username: string;
        avatarUrl?: string;
      };
      score: number;
      completionTime?: string;
    }>;
    userPosition?: {
      rank: number;
      score: number;
    };
  }> {
    return apiService.get(`/challenges/${challengeId}/leaderboard`);
  }
}

export const gamificationService = new GamificationService();
import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { projectService, ProjectFilters, Project, UserProjectProgress, ProgressUpdate } from '../services/projectService';
import { codeService, CodeSubmission, ExecutionResult, CodeHistory } from '../services/codeService';
import { gamificationService, XPTransaction, UserBadge, LeaderboardResponse, StreakData } from '../services/gamificationService';
import { authService, User, UserProfile } from '../services/authService';
import { useUI } from '../contexts/UIContext';
import { socketService } from '../services/socketService';
import { toast } from 'sonner';

// Project-related hooks
export function useProjects(filters?: ProjectFilters) {
  return useQuery({
    queryKey: ['projects', filters],
    queryFn: () => projectService.getProjects(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 3,
  });
}

export function useProject(id: string) {
  return useQuery({
    queryKey: ['project', id],
    queryFn: () => projectService.getProjectById(id),
    enabled: !!id,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

export function useUserProjects() {
  return useQuery({
    queryKey: ['user-projects'],
    queryFn: () => projectService.getUserProjects(),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

export function useUserProject(projectId: string) {
  return useQuery({
    queryKey: ['user-project', projectId],
    queryFn: () => projectService.getUserProject(projectId),
    enabled: !!projectId,
  });
}

export function useEnrollProject() {
  const queryClient = useQueryClient();
  const { setLoading } = useUI();

  return useMutation({
    mutationFn: projectService.enrollProject,
    onMutate: (projectId) => {
      setLoading(`enroll-${projectId}`, true);
    },
    onSuccess: (data, projectId) => {
      // Invalidate and refetch relevant queries
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['user-projects'] });
      queryClient.invalidateQueries({ queryKey: ['project', projectId] });
      
      toast.success('Successfully enrolled in project!');
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Failed to enroll in project');
    },
    onSettled: (data, error, projectId) => {
      setLoading(`enroll-${projectId}`, false);
    },
  });
}

export function useUpdateProjectProgress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ projectId, updates }: { projectId: string; updates: Partial<UserProjectProgress> }) =>
      projectService.updateProjectProgress(projectId, updates),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['user-project', variables.projectId] });
      queryClient.invalidateQueries({ queryKey: ['user-projects'] });
      
      if (data.status === 'completed') {
        toast.success('🎉 Project completed! Great job!');
      }
    },
    onError: (error) => {
      toast.error('Failed to update progress');
    },
  });
}

// Code execution hooks
export function useExecuteCode() {
  const { setLoading } = useUI();

  return useMutation({
    mutationFn: (submission: CodeSubmission) => {
      setLoading('code-execution', true);
      return codeService.executeCode(submission);
    },
    onSuccess: (result) => {
      if (result.success) {
        toast.success(`Code executed successfully in ${result.executionTime}ms`);
      } else {
        toast.error('Code execution failed');
      }
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Code execution failed');
    },
    onSettled: () => {
      setLoading('code-execution', false);
    },
  });
}

export function useCodeHistory(projectId: string) {
  return useQuery({
    queryKey: ['code-history', projectId],
    queryFn: () => codeService.getCodeHistory(projectId),
    enabled: !!projectId,
    staleTime: 5 * 60 * 1000,
  });
}

export function useSaveCode() {
  return useMutation({
    mutationFn: ({ projectId, milestoneId, language, code }: {
      projectId: string;
      milestoneId: string;
      language: string;
      code: string;
    }) => codeService.saveCode(projectId, milestoneId, language, code),
    onSuccess: () => {
      toast.success('Code saved successfully');
    },
    onError: () => {
      toast.error('Failed to save code');
    },
  });
}

export function useSubmitMilestoneCode() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ projectId, milestoneId, submission }: {
      projectId: string;
      milestoneId: string;
      submission: { code: string; language: string; description?: string };
    }) => codeService.submitMilestoneCode(projectId, milestoneId, submission),
    onSuccess: (result, variables) => {
      queryClient.invalidateQueries({ queryKey: ['user-project', variables.projectId] });
      queryClient.invalidateQueries({ queryKey: ['user-projects'] });
      
      if (result.success) {
        toast.success(`🎉 Milestone completed! +${result.xpAwarded} XP`);
      }
    },
    onError: (error) => {
      toast.error('Failed to submit code');
    },
  });
}

// Gamification hooks
export function useXPHistory(limit = 50) {
  return useQuery({
    queryKey: ['xp-history', limit],
    queryFn: () => gamificationService.getXPHistory(limit),
    staleTime: 2 * 60 * 1000,
  });
}

export function useXPSummary() {
  return useQuery({
    queryKey: ['xp-summary'],
    queryFn: () => gamificationService.getXPSummary(),
    staleTime: 1 * 60 * 1000, // 1 minute
  });
}

export function useUserBadges() {
  return useQuery({
    queryKey: ['user-badges'],
    queryFn: () => gamificationService.getUserBadges(),
    staleTime: 5 * 60 * 1000,
  });
}

export function useLeaderboard(type: 'global' | 'weekly' | 'monthly' = 'global', domainId?: string) {
  return useQuery({
    queryKey: ['leaderboard', type, domainId],
    queryFn: () => gamificationService.getLeaderboard(type, domainId),
    staleTime: 2 * 60 * 1000,
    retry: 2,
  });
}

export function useStreakData() {
  return useQuery({
    queryKey: ['streak-data'],
    queryFn: () => gamificationService.getStreakData(),
    staleTime: 1 * 60 * 1000,
  });
}

export function useDailyCheckin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => gamificationService.recordDailyCheckin(),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['streak-data'] });
      queryClient.invalidateQueries({ queryKey: ['xp-summary'] });
      
      toast.success(`Daily check-in complete! +${result.xpAwarded} XP ${result.streakBonus > 0 ? `(+${result.streakBonus} streak bonus)` : ''}`);
    },
    onError: (error) => {
      toast.error('Daily check-in failed');
    },
  });
}

// User profile hooks
export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (updates: Partial<User>) => authService.updateProfile(updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['current-user'] });
      toast.success('Profile updated successfully');
    },
    onError: (error) => {
      toast.error('Failed to update profile');
    },
  });
}

export function useUpdateUserProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (updates: Partial<UserProfile>) => authService.updateUserProfile(updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['current-user'] });
      toast.success('Profile updated successfully');
    },
    onError: (error) => {
      toast.error('Failed to update profile');
    },
  });
}

export function useUploadAvatar() {
  const queryClient = useQueryClient();
  const { setLoading } = useUI();

  return useMutation({
    mutationFn: (file: File) => {
      setLoading('avatar-upload', true);
      return authService.uploadAvatar(file);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['current-user'] });
      toast.success('Avatar updated successfully');
    },
    onError: (error) => {
      toast.error('Failed to upload avatar');
    },
    onSettled: () => {
      setLoading('avatar-upload', false);
    },
  });
}

// Generic loading state hook
export function useLoadingStates() {
  const { loading, setLoading, isLoading } = useUI();
  
  return {
    loading,
    setLoading,
    isLoading,
    // Helper methods for common loading states
    setProjectLoading: (projectId: string, loading: boolean) => setLoading(`project-${projectId}`, loading),
    isProjectLoading: (projectId: string) => isLoading(`project-${projectId}`),
    setCodeExecutionLoading: (loading: boolean) => setLoading('code-execution', loading),
    isCodeExecutionLoading: () => isLoading('code-execution'),
  };
}

// Real-time data synchronization hook
export function useRealTimeSync() {
  const queryClient = useQueryClient();

  // XP updates
  React.useEffect(() => {
    if (!socketService.isConnected()) return;

    const unsubscribe = socketService.subscribeToXPUpdates((data) => {
      // Update XP-related queries
      queryClient.invalidateQueries({ queryKey: ['xp-summary'] });
      queryClient.invalidateQueries({ queryKey: ['xp-history'] });
      queryClient.invalidateQueries({ queryKey: ['leaderboard'] });
    });

    return unsubscribe;
  }, [queryClient]);

  // Progress updates
  React.useEffect(() => {
    if (!socketService.isConnected()) return;

    const unsubscribe = socketService.subscribeToProgressUpdates((data) => {
      // Update project progress queries
      queryClient.invalidateQueries({ queryKey: ['user-project', data.projectId] });
      queryClient.invalidateQueries({ queryKey: ['user-projects'] });
    });

    return unsubscribe;
  }, [queryClient]);

  // Badge updates
  React.useEffect(() => {
    if (!socketService.isConnected()) return;

    const unsubscribe = socketService.subscribeToBadgeUpdates((data) => {
      // Update badge-related queries
      queryClient.invalidateQueries({ queryKey: ['user-badges'] });
    });

    return unsubscribe;
  }, [queryClient]);
}
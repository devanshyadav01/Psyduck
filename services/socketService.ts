import { io, Socket } from 'socket.io-client';
import { config } from '../config/environment';

export interface ProgressUpdate {
  userId: string;
  projectId: string;
  milestoneId?: string;
  progressPercentage: number;
  xpAwarded?: number;
  timestamp: string;
}

export interface XPUpdate {
  userId: string;
  amount: number;
  source: string;
  newTotal: number;
  levelUp?: boolean;
  timestamp: string;
}

export interface BadgeUpdate {
  userId: string;
  badgeId: string;
  badgeName: string;
  badgeIcon: string;
  xpAwarded: number;
  timestamp: string;
}

export interface NotificationData {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  actionUrl?: string;
  priority: 'low' | 'medium' | 'high';
  timestamp: string;
}

export interface ChatMessage {
  id: string;
  projectId: string;
  userId: string;
  username: string;
  avatarUrl?: string;
  message: string;
  type: 'text' | 'code' | 'image';
  timestamp: string;
}

export interface CodeCollaborationData {
  projectId: string;
  milestoneId: string;
  userId: string;
  username: string;
  code: string;
  language: string;
  cursor?: { line: number; column: number };
  timestamp: string;
}

class SocketService {
  private socket: Socket | null = null;
  private token: string | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  connect(token: string) {
    if (!config.features.realTime) {
      console.log('Real-time features are disabled');
      return;
    }

    this.token = token;
    
    try {
      this.socket = io(config.api.wsUrl, {
        auth: { token },
        transports: ['websocket'],
        upgrade: true,
        reconnection: true,
        reconnectionAttempts: this.maxReconnectAttempts,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
      });

      this.setupEventListeners();
    } catch (error) {
      console.error('Failed to connect to WebSocket:', error);
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  isConnected(): boolean {
    return this.socket?.connected ?? false;
  }

  private setupEventListeners() {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('🔌 Connected to Psyduck server');
      this.reconnectAttempts = 0;
    });

    this.socket.on('disconnect', (reason) => {
      console.log('🔌 Disconnected from server:', reason);
    });

    this.socket.on('reconnect', (attemptNumber) => {
      console.log(`🔌 Reconnected after ${attemptNumber} attempts`);
      this.reconnectAttempts = 0;
    });

    this.socket.on('reconnect_error', () => {
      this.reconnectAttempts++;
      console.warn(`🔌 Reconnection attempt ${this.reconnectAttempts} failed`);
    });

    this.socket.on('connect_error', (error) => {
      console.error('🔌 Connection error:', error.message);
    });
  }

  // Progress tracking
  subscribeToProgressUpdates(callback: (data: ProgressUpdate) => void): () => void {
    if (!this.socket) {
      console.warn('Socket not connected, cannot subscribe to progress updates');
      return () => {};
    }
    
    this.socket.on('progress:updated', callback);
    return () => this.socket?.off('progress:updated', callback);
  }

  emitProgressUpdate(data: Omit<ProgressUpdate, 'timestamp'>): void {
    if (!this.socket) return;
    this.socket.emit('progress:update', { ...data, timestamp: new Date().toISOString() });
  }

  // XP and gamification
  subscribeToXPUpdates(callback: (data: XPUpdate) => void): () => void {
    if (!this.socket) {
      console.warn('Socket not connected, cannot subscribe to XP updates');
      return () => {};
    }
    
    this.socket.on('xp:updated', callback);
    return () => this.socket?.off('xp:updated', callback);
  }

  subscribeToBadgeUpdates(callback: (data: BadgeUpdate) => void): () => void {
    if (!this.socket) {
      console.warn('Socket not connected, cannot subscribe to badge updates');
      return () => {};
    }
    
    this.socket.on('badge:awarded', callback);
    return () => this.socket?.off('badge:awarded', callback);
  }

  // Notifications
  subscribeToNotifications(callback: (data: NotificationData) => void): () => void {
    if (!this.socket) {
      console.warn('Socket not connected, cannot subscribe to notifications');
      return () => {};
    }
    
    this.socket.on('notification:new', callback);
    return () => this.socket?.off('notification:new', callback);
  }

  // Chat system
  joinProjectChat(projectId: string): void {
    if (!this.socket) return;
    this.socket.emit('chat:join_project', { projectId });
  }

  leaveProjectChat(projectId: string): void {
    if (!this.socket) return;
    this.socket.emit('chat:leave_project', { projectId });
  }

  subscribeToProjectChat(callback: (data: ChatMessage) => void): () => void {
    if (!this.socket) {
      console.warn('Socket not connected, cannot subscribe to project chat');
      return () => {};
    }
    
    this.socket.on('chat:new_message', callback);
    return () => this.socket?.off('chat:new_message', callback);
  }

  sendChatMessage(projectId: string, message: string, type: 'text' | 'code' = 'text'): void {
    if (!this.socket) return;
    this.socket.emit('chat:send_message', {
      projectId,
      message,
      type,
      timestamp: new Date().toISOString()
    });
  }

  // Code collaboration
  joinCodeSession(projectId: string, milestoneId: string): void {
    if (!this.socket) return;
    this.socket.emit('code:join_session', { projectId, milestoneId });
  }

  leaveCodeSession(projectId: string, milestoneId: string): void {
    if (!this.socket) return;
    this.socket.emit('code:leave_session', { projectId, milestoneId });
  }

  subscribeToCodeCollaboration(callback: (data: CodeCollaborationData) => void): () => void {
    if (!this.socket) {
      console.warn('Socket not connected, cannot subscribe to code collaboration');
      return () => {};
    }
    
    this.socket.on('code:updated', callback);
    return () => this.socket?.off('code:updated', callback);
  }

  emitCodeUpdate(data: Omit<CodeCollaborationData, 'timestamp'>): void {
    if (!this.socket) return;
    this.socket.emit('code:update', { ...data, timestamp: new Date().toISOString() });
  }

  // Typing indicators
  subscribeToTypingIndicators(callback: (data: {
    userId: string;
    username: string;
    isTyping: boolean;
    location: 'chat' | 'code';
  }) => void): () => void {
    if (!this.socket) {
      console.warn('Socket not connected, cannot subscribe to typing indicators');
      return () => {};
    }
    
    this.socket.on('typing:indicator', callback);
    return () => this.socket?.off('typing:indicator', callback);
  }

  emitTyping(location: 'chat' | 'code', isTyping: boolean): void {
    if (!this.socket) return;
    this.socket.emit('typing:start_stop', { location, isTyping });
  }

  // Mentorship sessions
  joinMentorshipSession(sessionId: string): void {
    if (!this.socket) return;
    this.socket.emit('mentorship:join_session', { sessionId });
  }

  leaveMentorshipSession(sessionId: string): void {
    if (!this.socket) return;
    this.socket.emit('mentorship:leave_session', { sessionId });
  }

  subscribeToMentorshipUpdates(callback: (data: {
    sessionId: string;
    type: 'user_joined' | 'user_left' | 'session_started' | 'session_ended';
    userId?: string;
    username?: string;
  }) => void): () => void {
    if (!this.socket) {
      console.warn('Socket not connected, cannot subscribe to mentorship updates');
      return () => {};
    }
    
    this.socket.on('mentorship:update', callback);
    return () => this.socket?.off('mentorship:update', callback);
  }

  // Leaderboard updates
  subscribeToLeaderboardUpdates(callback: (data: {
    type: 'global' | 'domain' | 'weekly';
    rankings: Array<{
      userId: string;
      username: string;
      rank: number;
      xp: number;
      change: number;
    }>;
  }) => void): () => void {
    if (!this.socket) {
      console.warn('Socket not connected, cannot subscribe to leaderboard updates');
      return () => {};
    }
    
    this.socket.on('leaderboard:updated', callback);
    return () => this.socket?.off('leaderboard:updated', callback);
  }
}

export const socketService = new SocketService();
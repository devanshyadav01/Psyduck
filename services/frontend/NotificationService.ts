// Frontend Notification Service
import { apiClient, ApiResponse } from '../api/ApiClient';

export interface Notification {
  id: string;
  userId: string;
  type: 'achievement' | 'project_update' | 'system' | 'social';
  title: string;
  message: string;
  isRead: boolean;
  metadata?: Record<string, any>;
  createdAt: string;
}

class NotificationServiceFrontend {
  private notifications: Notification[] = [];
  private unreadCount: number = 0;
  private lastFetch: number = 0;
  private cacheDuration: number = 1 * 60 * 1000; // 1 minute

  // Set authentication (called by service manager)
  setAuth(token: string | null, user: any | null): void {
    if (!token) {
      this.clearData();
    }
  }

  // Get notifications with caching
  async getNotifications(unreadOnly: boolean = false): Promise<ApiResponse<Notification[]>> {
    try {
      const now = Date.now();
      const isCacheValid = (now - this.lastFetch) < this.cacheDuration && this.notifications.length > 0;

      if (isCacheValid && !unreadOnly) {
        return {
          data: this.notifications,
          success: true,
          message: 'Notifications retrieved from cache'
        };
      }

      const response = await apiClient.get<Notification[]>('/notifications', {
        params: unreadOnly ? { unread: true } : {}
      });

      if (response.success && response.data) {
        this.notifications = response.data;
        this.lastFetch = now;
        this.updateUnreadCount();
      }

      return response;
    } catch (error) {
      console.error('NotificationService get notifications error:', error);
      return {
        data: null,
        success: false,
        message: error instanceof Error ? error.message : 'Failed to get notifications'
      };
    }
  }

  // Mark notification as read
  async markAsRead(notificationId: string): Promise<ApiResponse<null>> {
    try {
      const response = await apiClient.post<null>('/notifications/mark-read', {
        notificationId
      });

      if (response.success) {
        // Update local cache
        const notification = this.notifications.find(n => n.id === notificationId);
        if (notification && !notification.isRead) {
          notification.isRead = true;
          this.unreadCount = Math.max(0, this.unreadCount - 1);
        }
      }

      return response;
    } catch (error) {
      console.error('NotificationService mark as read error:', error);
      return {
        data: null,
        success: false,
        message: error instanceof Error ? error.message : 'Failed to mark notification as read'
      };
    }
  }

  // Mark all notifications as read
  async markAllAsRead(): Promise<ApiResponse<null>> {
    try {
      const response = await apiClient.post<null>('/notifications/mark-all-read');

      if (response.success) {
        // Update local cache
        this.notifications.forEach(notification => {
          notification.isRead = true;
        });
        this.unreadCount = 0;
      }

      return response;
    } catch (error) {
      console.error('NotificationService mark all as read error:', error);
      return {
        data: null,
        success: false,
        message: error instanceof Error ? error.message : 'Failed to mark all notifications as read'
      };
    }
  }

  // Get unread notifications count
  getUnreadCount(): number {
    return this.unreadCount;
  }

  // Get unread notifications
  getUnreadNotifications(): Notification[] {
    return this.notifications.filter(n => !n.isRead);
  }

  // Get notifications by type
  getNotificationsByType(type: Notification['type']): Notification[] {
    return this.notifications.filter(n => n.type === type);
  }

  // Get recent notifications
  getRecentNotifications(limit: number = 5): Notification[] {
    return this.notifications
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);
  }

  // Add new notification (for real-time updates)
  addNotification(notification: Notification): void {
    // Check if notification already exists
    const exists = this.notifications.some(n => n.id === notification.id);
    if (!exists) {
      this.notifications.unshift(notification);
      if (!notification.isRead) {
        this.unreadCount += 1;
      }
    }
  }

  // Remove notification
  removeNotification(notificationId: string): void {
    const index = this.notifications.findIndex(n => n.id === notificationId);
    if (index !== -1) {
      const notification = this.notifications[index];
      if (!notification.isRead) {
        this.unreadCount = Math.max(0, this.unreadCount - 1);
      }
      this.notifications.splice(index, 1);
    }
  }

  // Update unread count based on current notifications
  private updateUnreadCount(): void {
    this.unreadCount = this.notifications.filter(n => !n.isRead).length;
  }

  // Get notification statistics
  getNotificationStats() {
    const total = this.notifications.length;
    const unread = this.unreadCount;
    const byType = {
      achievement: this.notifications.filter(n => n.type === 'achievement').length,
      project_update: this.notifications.filter(n => n.type === 'project_update').length,
      system: this.notifications.filter(n => n.type === 'system').length,
      social: this.notifications.filter(n => n.type === 'social').length
    };

    return {
      total,
      unread,
      read: total - unread,
      byType
    };
  }

  // Create local notification (for immediate UI feedback)
  createLocalNotification(
    type: Notification['type'],
    title: string,
    message: string,
    metadata?: Record<string, any>
  ): Notification {
    const notification: Notification = {
      id: `local_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId: 'current_user',
      type,
      title,
      message,
      isRead: false,
      metadata,
      createdAt: new Date().toISOString()
    };

    this.addNotification(notification);
    return notification;
  }

  // Clear all cached data
  clearData(): void {
    this.notifications = [];
    this.unreadCount = 0;
    this.lastFetch = 0;
  }

  // Force refresh notifications
  async refresh(): Promise<void> {
    this.lastFetch = 0;
    await this.getNotifications();
  }

  // Get cached notifications (synchronous)
  getCachedNotifications(): Notification[] {
    return [...this.notifications];
  }

  // Check if user has unread notifications
  hasUnreadNotifications(): boolean {
    return this.unreadCount > 0;
  }
}

// Create singleton instance
export const notificationServiceFrontend = new NotificationServiceFrontend();

// Export for use in components and hooks
export default notificationServiceFrontend;
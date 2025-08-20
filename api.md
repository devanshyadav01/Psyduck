# Psyduck Learning Platform API Documentation

## Overview

This document defines the API contract for the Psyduck Learning Platform. The platform uses a RESTful API architecture with real-time features powered by Socket.IO.

**Base URL:** `https://api.psyduck.dev/v1`

**Environment:** Currently using Mock API for development

## Authentication

All authenticated endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer {token}
```

## Response Format

All API responses follow this standard format:

```typescript
interface ApiResponse<T = any> {
  data: T | null;
  success: boolean;
  message: string;
  timestamp?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
```

## Endpoints

### Authentication

#### POST `/auth/login`
Authenticate user with email and password.

**Request:**
```typescript
{
  email: string;
  password: string;
}
```

**Response:**
```typescript
{
  data: {
    user: User;
    token: string;
    refreshToken: string;
  };
  success: boolean;
  message: string;
}
```

#### POST `/auth/register`
Register a new user account.

**Request:**
```typescript
{
  email: string;
  password: string;
  username: string;
  firstName?: string;
  lastName?: string;
}
```

**Response:**
```typescript
{
  data: {
    user: User;
    token: string;
    refreshToken: string;
  };
  success: boolean;
  message: string;
}
```

#### POST `/auth/logout`
Logout user and invalidate tokens.

**Response:**
```typescript
{
  data: null;
  success: boolean;
  message: string;
}
```

#### POST `/auth/refresh`
Refresh authentication token.

**Request:**
```typescript
{
  refreshToken: string;
}
```

**Response:**
```typescript
{
  data: {
    token: string;
    refreshToken: string;
  };
  success: boolean;
  message: string;
}
```

### User Management

#### GET `/user/profile`
Get current user profile.

**Response:**
```typescript
{
  data: User;
  success: boolean;
  message: string;
}
```

#### PUT `/user/profile`
Update user profile.

**Request:**
```typescript
{
  username?: string;
  firstName?: string;
  lastName?: string;
  bio?: string;
  profileImage?: string;
  preferences?: UserPreferences;
}
```

**Response:**
```typescript
{
  data: User;
  success: boolean;
  message: string;
}
```

#### GET `/user/stats`
Get user gamification statistics.

**Response:**
```typescript
{
  data: {
    level: number;
    xp: number;
    xpToNextLevel: number;
    totalProjectsCompleted: number;
    currentStreak: number;
    longestStreak: number;
    badges: Badge[];
    achievements: Achievement[];
  };
  success: boolean;
  message: string;
}
```

#### GET `/user/analytics`
Get user learning analytics.

**Response:**
```typescript
{
  data: {
    studyTime: {
      today: number;
      thisWeek: number;
      thisMonth: number;
      total: number;
    };
    projectsProgress: {
      completed: number;
      inProgress: number;
      notStarted: number;
    };
    skillsBreakdown: {
      [skill: string]: {
        level: number;
        projectsCompleted: number;
        hoursSpent: number;
      };
    };
    performanceMetrics: {
      codeExecutions: number;
      successRate: number;
      averageSessionTime: number;
    };
  };
  success: boolean;
  message: string;
}
```

### Projects

#### GET `/projects`
Get all available projects with optional filtering.

**Query Parameters:**
- `domain?: string` - Filter by domain (MERN, Flutter, etc.)
- `difficulty?: string` - Filter by difficulty (beginner, intermediate, advanced)
- `tags?: string[]` - Filter by tags
- `page?: number` - Page number for pagination
- `limit?: number` - Number of items per page

**Response:**
```typescript
{
  data: Project[];
  success: boolean;
  message: string;
  pagination: PaginationInfo;
}
```

#### GET `/projects/{id}`
Get specific project details.

**Response:**
```typescript
{
  data: ProjectDetails;
  success: boolean;
  message: string;
}
```

#### GET `/projects/enrolled`
Get user's enrolled projects.

**Response:**
```typescript
{
  data: EnrolledProject[];
  success: boolean;
  message: string;
}
```

#### POST `/projects/enroll`
Enroll in a project.

**Request:**
```typescript
{
  projectId: string;
}
```

**Response:**
```typescript
{
  data: EnrolledProject;
  success: boolean;
  message: string;
}
```

#### PUT `/projects/{id}/progress`
Update project progress.

**Request:**
```typescript
{
  completedSteps: string[];
  currentStep: string;
  timeSpent: number;
  codeSubmissions?: {
    stepId: string;
    code: string;
    language: string;
    timestamp: string;
  }[];
}
```

**Response:**
```typescript
{
  data: ProjectProgress;
  success: boolean;
  message: string;
}
```

### Code Execution

#### POST `/code/execute`
Execute code in various programming languages.

**Request:**
```typescript
{
  code: string;
  language: string;
  input?: string;
  timeout?: number;
}
```

**Response:**
```typescript
{
  data: {
    output?: string;
    error?: string;
    executionTime: number;
    memoryUsage?: number;
    exitCode?: number;
  };
  success: boolean;
  message: string;
}
```

### Gamification

#### GET `/gamification/leaderboard`
Get global leaderboard.

**Query Parameters:**
- `timeframe?: string` - 'weekly' | 'monthly' | 'all-time'
- `category?: string` - 'xp' | 'projects' | 'streak'
- `limit?: number` - Number of top users to return

**Response:**
```typescript
{
  data: {
    rankings: LeaderboardEntry[];
    userRank?: number;
    totalUsers: number;
  };
  success: boolean;
  message: string;
}
```

#### GET `/gamification/badges`
Get available badges and user's earned badges.

**Response:**
```typescript
{
  data: {
    available: Badge[];
    earned: UserBadge[];
  };
  success: boolean;
  message: string;
}
```

### Notifications

#### GET `/notifications`
Get user notifications.

**Query Parameters:**
- `unread?: boolean` - Filter for unread notifications only
- `page?: number`
- `limit?: number`

**Response:**
```typescript
{
  data: Notification[];
  success: boolean;
  message: string;
  pagination: PaginationInfo;
}
```

#### POST `/notifications/mark-read`
Mark notification as read.

**Request:**
```typescript
{
  notificationId: string;
}
```

**Response:**
```typescript
{
  data: null;
  success: boolean;
  message: string;
}
```

#### POST `/notifications/mark-all-read`
Mark all notifications as read.

**Response:**
```typescript
{
  data: null;
  success: boolean;
  message: string;
}
```

### Search

#### GET `/search/projects`
Search projects with full-text search capabilities.

**Query Parameters:**
- `q: string` - Search query
- `domain?: string`
- `difficulty?: string`
- `tags?: string[]`
- `page?: number`
- `limit?: number`

**Response:**
```typescript
{
  data: {
    projects: Project[];
    suggestions: string[];
    filters: {
      domains: string[];
      difficulties: string[];
      tags: string[];
    };
  };
  success: boolean;
  message: string;
  pagination: PaginationInfo;
}
```

### Content Creation (Premium)

#### POST `/content/videos`
Submit video content for review (Premium users only).

**Request:**
```typescript
{
  title: string;
  description: string;
  videoUrl: string;
  tags: string[];
  domain: string;
  difficulty: string;
  estimatedDuration: number;
}
```

**Response:**
```typescript
{
  data: {
    submissionId: string;
    status: 'pending' | 'approved' | 'rejected';
    reviewNotes?: string;
  };
  success: boolean;
  message: string;
}
```

#### GET `/content/submissions`
Get user's content submissions.

**Response:**
```typescript
{
  data: ContentSubmission[];
  success: boolean;
  message: string;
}
```

### Real-time Events (Socket.IO)

#### Connection
Connect to Socket.IO server with authentication token.

#### Events

##### Client -> Server

- `join_project` - Join a project room for real-time updates
- `leave_project` - Leave a project room
- `code_share` - Share code with other users in the same project
- `typing_start` - Indicate user is typing
- `typing_stop` - Indicate user stopped typing

##### Server -> Client

- `project_update` - Project progress or content updated
- `user_achievement` - User earned a new badge or achievement
- `leaderboard_update` - Leaderboard position changed
- `notification_new` - New notification received
- `code_shared` - Another user shared code
- `user_typing` - Another user is typing
- `system_announcement` - System-wide announcements

## Data Types

### User
```typescript
interface User {
  id: string;
  email: string;
  username: string;
  firstName?: string;
  lastName?: string;
  profileImage?: string;
  bio?: string;
  level: number;
  xp: number;
  createdAt: string;
  updatedAt: string;
  subscription: 'free' | 'premium';
  preferences: UserPreferences;
}
```

### Project
```typescript
interface Project {
  id: string;
  title: string;
  description: string;
  domain: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedHours: number;
  tags: string[];
  prerequisites: string[];
  learningObjectives: string[];
  technologies: string[];
  thumbnailUrl?: string;
  isPartnerProject: boolean;
  xpReward: number;
  createdAt: string;
  updatedAt: string;
}
```

### EnrolledProject
```typescript
interface EnrolledProject extends Project {
  enrollmentDate: string;
  progress: number;
  completedSteps: string[];
  currentStep?: string;
  timeSpent: number;
  lastActivityAt: string;
  status: 'not_started' | 'in_progress' | 'completed' | 'paused';
}
```

### Badge
```typescript
interface Badge {
  id: string;
  name: string;
  description: string;
  iconUrl: string;
  category: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  requirements: string[];
  xpReward: number;
}
```

### Notification
```typescript
interface Notification {
  id: string;
  userId: string;
  type: 'achievement' | 'project_update' | 'system' | 'social';
  title: string;
  message: string;
  isRead: boolean;
  metadata?: Record<string, any>;
  createdAt: string;
}
```

## Error Codes

- `400` - Bad Request: Invalid request parameters
- `401` - Unauthorized: Authentication required or token invalid
- `403` - Forbidden: Insufficient permissions
- `404` - Not Found: Resource does not exist
- `409` - Conflict: Resource already exists or conflict with current state
- `429` - Too Many Requests: Rate limit exceeded
- `500` - Internal Server Error: Server-side error
- `503` - Service Unavailable: Service temporarily unavailable

## Rate Limiting

API endpoints are rate-limited to prevent abuse:

- Authentication endpoints: 5 requests per minute per IP
- General API endpoints: 100 requests per minute per user
- Code execution: 10 executions per minute per user
- Search endpoints: 30 requests per minute per user

## Development Notes

Currently using a comprehensive mock API service that simulates all endpoints with realistic data and response times. The mock service maintains state during the session and provides consistent responses for testing and development.
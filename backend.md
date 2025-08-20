# Psyduck Backend Architecture Documentation

## Table of Contents
1. [System Overview](#system-overview)
2. [Technology Stack](#technology-stack)
3. [Architecture Patterns](#architecture-patterns)
4. [Database Design](#database-design)
5. [API Design](#api-design)
6. [Microservices](#microservices)
7. [Authentication & Authorization](#authentication--authorization)
8. [External Integrations](#external-integrations)
9. [Code Execution Engine](#code-execution-engine)
10. [Gamification System](#gamification-system)
11. [Real-time Features](#real-time-features)
12. [Infrastructure & Deployment](#infrastructure--deployment)
13. [Monitoring & Logging](#monitoring--logging)
14. [Security Considerations](#security-considerations)
15. [Performance Optimization](#performance-optimization)
16. [Implementation Roadmap](#implementation-roadmap)

---

## System Overview

### Platform Vision
Psyduck is a project-based learning platform that combines the best features of GitHub (collaboration), LeetCode (skill assessment), and Upwork (real-world projects) with comprehensive gamification elements.

### Core Features
- **Project-Based Learning**: Structured learning paths across multiple domains
- **Gamification**: XP, badges, streaks, leaderboards
- **Code Execution**: Real-time IDE with multiple language support
- **Social Learning**: Collaboration, mentoring, community features
- **Professional Integration**: Direct hiring opportunities with partner companies
- **Analytics**: Comprehensive learning analytics and progress tracking

### System Requirements
- **Scalability**: Support 100K+ concurrent users
- **Performance**: <200ms API response times, <1s code execution
- **Availability**: 99.9% uptime SLA
- **Security**: Enterprise-grade security for code and user data
- **Global**: Multi-region deployment for worldwide accessibility

---

## Technology Stack

### Backend Framework
```
Primary: Node.js with Express.js/Fastify
Alternative: Python with FastAPI or Go with Gin
```

**Rationale**: Node.js provides excellent performance for I/O operations, vast ecosystem, and seamless JSON handling. TypeScript support ensures type safety.

### Database Stack
```
Primary Database: PostgreSQL 14+
Cache Layer: Redis 7+
Search Engine: Elasticsearch 8+
Time Series: InfluxDB (for analytics)
```

### Message Queue & Streaming
```
Message Queue: Apache Kafka / Amazon SQS
Pub/Sub: Redis Pub/Sub for real-time features
Event Streaming: Apache Kafka for analytics
```

### Container & Orchestration
```
Containerization: Docker
Orchestration: Kubernetes
Service Mesh: Istio (for microservices communication)
```

### Cloud Infrastructure
```
Primary: AWS (with multi-region setup)
CDN: CloudFront
Storage: S3 for static assets, EFS for shared storage
Compute: EKS for container orchestration
```

---

## Architecture Patterns

### 1. Microservices Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   API Gateway   │    │   Load Balancer │
│   (React App)   │◄──►│   (Kong/AWS)    │◄──►│   (ALB/NGINX)   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │
                                ▼
        ┌───────────────────────────────────────────────────────┐
        │                Microservices Layer                    │
        ├─────────────┬─────────────┬─────────────┬─────────────┤
        │   User      │   Project   │   Code      │   Game      │
        │   Service   │   Service   │   Execution │   Service   │
        │             │             │   Service   │             │
        ├─────────────┼─────────────┼─────────────┼─────────────┤
        │   Auth      │   Learning  │   Analytics │   Notif     │
        │   Service   │   Service   │   Service   │   Service   │
        └─────────────┴─────────────┴─────────────┴─────────────┘
                                │
                                ▼
        ┌───────────────────────────────────────────────────────┐
        │                  Data Layer                           │
        ├─────────────┬─────────────┬─────────────┬─────────────┤
        │ PostgreSQL  │   Redis     │ Elasticsearch│  InfluxDB  │
        │ (Primary)   │  (Cache)    │  (Search)   │ (Analytics) │
        └─────────────┴─────────────┴─────────────┴─────────────┘
```

### 2. Event-Driven Architecture

```
Event Flow:
User Action → API Gateway → Service → Event Bus → Interested Services → Database
                                    ↓
                              Analytics Service
                                    ↓
                              Real-time Updates
```

### 3. CQRS Pattern for Analytics
Separate read and write models for optimal performance in analytics and reporting.

---

## Database Design

### Core Entities Schema

#### 1. User Management
```sql
-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    avatar_url TEXT,
    github_username VARCHAR(100),
    linkedin_url TEXT,
    bio TEXT,
    timezone VARCHAR(50) DEFAULT 'UTC',
    preferred_language VARCHAR(10) DEFAULT 'en',
    skill_level ENUM('beginner', 'intermediate', 'advanced') DEFAULT 'beginner',
    total_xp INTEGER DEFAULT 0,
    current_streak INTEGER DEFAULT 0,
    longest_streak INTEGER DEFAULT 0,
    last_activity_date DATE,
    email_verified BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User profiles extended data
CREATE TABLE user_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    resume_url TEXT,
    portfolio_url TEXT,
    years_of_experience INTEGER DEFAULT 0,
    current_role VARCHAR(100),
    company VARCHAR(100),
    location VARCHAR(100),
    hourly_rate DECIMAL(10,2),
    availability_hours INTEGER DEFAULT 20,
    open_to_opportunities BOOLEAN DEFAULT false,
    profile_completion_percentage INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User skills
CREATE TABLE user_skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    skill_id UUID NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
    proficiency_level INTEGER CHECK (proficiency_level >= 1 AND proficiency_level <= 10),
    verified BOOLEAN DEFAULT false,
    earned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, skill_id)
);
```

#### 2. Learning Domains & Projects
```sql
-- Learning domains (MERN, Flutter, AI/ML, etc.)
CREATE TABLE domains (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    icon_url TEXT,
    color_hex VARCHAR(7),
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Skills within domains
CREATE TABLE skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    domain_id UUID NOT NULL REFERENCES domains(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL,
    description TEXT,
    difficulty_level ENUM('beginner', 'intermediate', 'advanced'),
    xp_value INTEGER DEFAULT 100,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(domain_id, slug)
);

-- Projects
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    domain_id UUID NOT NULL REFERENCES domains(id),
    title VARCHAR(200) NOT NULL,
    slug VARCHAR(200) UNIQUE NOT NULL,
    description TEXT NOT NULL,
    detailed_description TEXT,
    difficulty_level ENUM('beginner', 'intermediate', 'advanced') NOT NULL,
    estimated_hours INTEGER,
    xp_reward INTEGER DEFAULT 500,
    github_template_url TEXT,
    preview_image_url TEXT,
    tech_stack JSONB, -- Array of technologies
    learning_objectives JSONB, -- Array of learning goals
    prerequisites JSONB, -- Array of prerequisite skills
    project_type ENUM('guided', 'open_ended', 'assessment') DEFAULT 'guided',
    is_premium BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Project milestones/tasks
CREATE TABLE project_milestones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    instructions TEXT,
    sort_order INTEGER DEFAULT 0,
    xp_reward INTEGER DEFAULT 50,
    estimated_minutes INTEGER,
    is_required BOOLEAN DEFAULT true,
    validation_criteria JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 3. User Progress & Gamification
```sql
-- User project enrollment
CREATE TABLE user_projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    status ENUM('not_started', 'in_progress', 'completed', 'abandoned') DEFAULT 'not_started',
    progress_percentage INTEGER DEFAULT 0,
    started_at TIMESTAMP,
    completed_at TIMESTAMP,
    total_time_spent INTEGER DEFAULT 0, -- in minutes
    github_repo_url TEXT,
    final_submission_url TEXT,
    mentor_id UUID REFERENCES users(id),
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    feedback TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, project_id)
);

-- User milestone progress
CREATE TABLE user_milestone_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_project_id UUID NOT NULL REFERENCES user_projects(id) ON DELETE CASCADE,
    milestone_id UUID NOT NULL REFERENCES project_milestones(id) ON DELETE CASCADE,
    status ENUM('not_started', 'in_progress', 'completed', 'skipped') DEFAULT 'not_started',
    started_at TIMESTAMP,
    completed_at TIMESTAMP,
    time_spent INTEGER DEFAULT 0, -- in minutes
    submission_data JSONB,
    mentor_feedback TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_project_id, milestone_id)
);

-- XP transactions
CREATE TABLE xp_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    amount INTEGER NOT NULL,
    source_type ENUM('project_completion', 'milestone_completion', 'daily_login', 'streak_bonus', 'assessment', 'peer_review', 'mentoring') NOT NULL,
    source_id UUID, -- ID of the related entity (project, milestone, etc.)
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Badges
CREATE TABLE badges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    icon_url TEXT,
    category ENUM('completion', 'streak', 'skill', 'community', 'special') NOT NULL,
    criteria JSONB, -- Conditions for earning the badge
    xp_value INTEGER DEFAULT 0,
    rarity ENUM('common', 'rare', 'epic', 'legendary') DEFAULT 'common',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User badges
CREATE TABLE user_badges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    badge_id UUID NOT NULL REFERENCES badges(id) ON DELETE CASCADE,
    earned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    progress_data JSONB,
    UNIQUE(user_id, badge_id)
);

-- Daily activity tracking
CREATE TABLE daily_activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    activity_date DATE NOT NULL,
    minutes_active INTEGER DEFAULT 0,
    projects_worked_on INTEGER DEFAULT 0,
    milestones_completed INTEGER DEFAULT 0,
    xp_earned INTEGER DEFAULT 0,
    streak_day INTEGER DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, activity_date)
);
```

#### 4. Code Execution & Submissions
```sql
-- Code submissions
CREATE TABLE code_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    project_id UUID REFERENCES projects(id),
    milestone_id UUID REFERENCES project_milestones(id),
    language VARCHAR(50) NOT NULL,
    code TEXT NOT NULL,
    input_data TEXT,
    expected_output TEXT,
    actual_output TEXT,
    execution_time_ms INTEGER,
    memory_usage_kb INTEGER,
    status ENUM('pending', 'running', 'completed', 'error', 'timeout') DEFAULT 'pending',
    error_message TEXT,
    test_results JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Code execution environments
CREATE TABLE execution_environments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    language VARCHAR(50) NOT NULL,
    version VARCHAR(20) NOT NULL,
    docker_image VARCHAR(200) NOT NULL,
    memory_limit_mb INTEGER DEFAULT 128,
    timeout_seconds INTEGER DEFAULT 30,
    allowed_packages JSONB,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(language, version)
);
```

#### 5. Community & Social Features
```sql
-- User follows
CREATE TABLE user_follows (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    follower_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    following_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(follower_id, following_id),
    CHECK (follower_id != following_id)
);

-- Project discussions
CREATE TABLE discussions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    discussion_type ENUM('question', 'showcase', 'general') DEFAULT 'general',
    is_pinned BOOLEAN DEFAULT false,
    is_resolved BOOLEAN DEFAULT false,
    upvotes INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Discussion replies
CREATE TABLE discussion_replies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    discussion_id UUID NOT NULL REFERENCES discussions(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    parent_reply_id UUID REFERENCES discussion_replies(id),
    content TEXT NOT NULL,
    upvotes INTEGER DEFAULT 0,
    is_solution BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Mentorship relationships
CREATE TABLE mentorship_relationships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    mentor_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    mentee_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    domain_id UUID REFERENCES domains(id),
    status ENUM('pending', 'active', 'completed', 'cancelled') DEFAULT 'pending',
    started_at TIMESTAMP,
    ended_at TIMESTAMP,
    hourly_rate DECIMAL(10,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(mentor_id, mentee_id, domain_id)
);
```

#### 6. Professional Integration
```sql
-- Partner companies
CREATE TABLE partner_companies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(200) NOT NULL,
    slug VARCHAR(200) UNIQUE NOT NULL,
    description TEXT,
    logo_url TEXT,
    website_url TEXT,
    industry VARCHAR(100),
    company_size ENUM('startup', 'small', 'medium', 'large', 'enterprise'),
    headquarters_location VARCHAR(100),
    is_hiring_partner BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Real-world job opportunities
CREATE TABLE job_opportunities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES partner_companies(id),
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    requirements JSONB, -- Array of required skills
    preferred_skills JSONB, -- Array of preferred skills
    job_type ENUM('full_time', 'part_time', 'contract', 'internship') NOT NULL,
    experience_level ENUM('entry', 'mid', 'senior') NOT NULL,
    salary_min INTEGER,
    salary_max INTEGER,
    currency VARCHAR(3) DEFAULT 'USD',
    location VARCHAR(100),
    is_remote BOOLEAN DEFAULT false,
    application_deadline DATE,
    required_projects JSONB, -- Array of project IDs user must complete
    min_xp_required INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Job applications
CREATE TABLE job_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id UUID NOT NULL REFERENCES job_opportunities(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    cover_letter TEXT,
    portfolio_projects JSONB, -- Array of project IDs to showcase
    application_status ENUM('pending', 'under_review', 'interview', 'accepted', 'rejected') DEFAULT 'pending',
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status_updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    recruiter_notes TEXT,
    UNIQUE(job_id, user_id)
);
```

---

## API Design

### RESTful API Structure

#### Base URL Structure
```
https://api.psyduck.dev/v1/
```

#### Authentication
```
Authorization: Bearer <JWT_TOKEN>
X-API-Key: <API_KEY> (for service-to-service)
```

### Core API Endpoints

#### 1. Authentication & User Management
```javascript
// Authentication
POST   /auth/register
POST   /auth/login
POST   /auth/refresh
POST   /auth/logout
POST   /auth/forgot-password
POST   /auth/reset-password
POST   /auth/verify-email

// User Management
GET    /users/me
PUT    /users/me
GET    /users/:id/profile
PUT    /users/:id/profile
GET    /users/:id/stats
GET    /users/:id/projects
GET    /users/:id/badges
POST   /users/:id/follow
DELETE /users/:id/follow
```

#### 2. Learning & Projects
```javascript
// Domains & Skills
GET    /domains
GET    /domains/:id/skills
GET    /domains/:id/projects
GET    /skills/:id

// Projects
GET    /projects
GET    /projects/:id
POST   /projects/:id/enroll
GET    /projects/:id/milestones
POST   /projects/:id/milestones/:milestone_id/submit
GET    /projects/:id/discussions
POST   /projects/:id/discussions

// User Progress
GET    /users/me/progress
GET    /users/me/projects/:id/progress
PUT    /users/me/projects/:id/progress
```

#### 3. Code Execution
```javascript
// Code Submission & Execution
POST   /code/execute
GET    /code/submissions/:id
GET    /code/environments
POST   /code/save
GET    /code/history
```

#### 4. Gamification
```javascript
// XP & Achievements
GET    /users/me/xp
GET    /users/me/xp/history
GET    /users/me/badges
GET    /badges
GET    /leaderboard
GET    /users/me/streak
POST   /users/me/daily-checkin
```

#### 5. Social Features
```javascript
// Community
GET    /discussions
POST   /discussions
GET    /discussions/:id
POST   /discussions/:id/replies
POST   /discussions/:id/upvote

// Mentorship
GET    /mentors
POST   /mentorship/request
GET    /mentorship/relationships
PUT    /mentorship/relationships/:id/status
```

### API Response Standards

#### Success Response Format
```json
{
  "success": true,
  "data": {
    // Response data
  },
  "meta": {
    "timestamp": "2024-01-15T10:30:00Z",
    "request_id": "req_123456",
    "pagination": {
      "page": 1,
      "per_page": 20,
      "total": 100,
      "total_pages": 5
    }
  }
}
```

#### Error Response Format
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input parameters",
    "details": [
      {
        "field": "email",
        "message": "Email is required"
      }
    ]
  },
  "meta": {
    "timestamp": "2024-01-15T10:30:00Z",
    "request_id": "req_123456"
  }
}
```

---

## Microservices

### Service Breakdown

#### 1. User Service
```
Responsibilities:
- User registration, authentication, profile management
- User preferences and settings
- Password management and security

Technologies:
- Node.js + Express/Fastify
- PostgreSQL for user data
- Redis for session management
- bcrypt for password hashing
- JWT for token management

API Endpoints:
- /auth/* - Authentication endpoints
- /users/* - User management endpoints
```

#### 2. Project Service
```
Responsibilities:
- Project catalog management
- Learning paths and curriculum
- Project templates and resources
- Skill definitions and mappings

Technologies:
- Node.js + Express/Fastify
- PostgreSQL for project data
- Elasticsearch for project search
- AWS S3 for project assets

API Endpoints:
- /projects/* - Project management
- /domains/* - Learning domains
- /skills/* - Skill management
```

#### 3. Progress Service
```
Responsibilities:
- User learning progress tracking
- Milestone completion
- Time tracking and analytics
- Achievement calculations

Technologies:
- Node.js + Express/Fastify
- PostgreSQL for progress data
- InfluxDB for time-series analytics
- Redis for real-time updates

API Endpoints:
- /progress/* - Progress tracking
- /milestones/* - Milestone management
- /analytics/* - Learning analytics
```

#### 4. Code Execution Service
```
Responsibilities:
- Secure code execution in isolated environments
- Multi-language support
- Result validation and testing
- Resource monitoring

Technologies:
- Node.js + Express/Fastify
- Docker for containerization
- Kubernetes for orchestration
- Language-specific execution engines

API Endpoints:
- /execute/* - Code execution
- /validate/* - Code validation
- /environments/* - Environment management
```

#### 5. Gamification Service
```
Responsibilities:
- XP calculation and distribution
- Badge management and awarding
- Streak tracking
- Leaderboard generation

Technologies:
- Node.js + Express/Fastify
- PostgreSQL for game data
- Redis for leaderboard caching
- Event-driven architecture

API Endpoints:
- /xp/* - XP management
- /badges/* - Badge system
- /leaderboard/* - Rankings
- /streaks/* - Streak tracking
```

#### 6. Notification Service
```
Responsibilities:
- Real-time notifications
- Email notifications
- Push notifications
- Notification preferences

Technologies:
- Node.js + Socket.io
- Redis for pub/sub
- AWS SES for email
- Firebase for push notifications

API Endpoints:
- /notifications/* - Notification management
- WebSocket connections for real-time updates
```

#### 7. Analytics Service
```
Responsibilities:
- Learning analytics and insights
- Performance metrics
- User behavior tracking
- Reporting and dashboards

Technologies:
- Python + FastAPI
- InfluxDB for time-series data
- Elasticsearch for log aggregation
- Apache Kafka for event streaming

API Endpoints:
- /analytics/* - Analytics data
- /metrics/* - Performance metrics
- /reports/* - Generated reports
```

### Inter-Service Communication

#### 1. Synchronous Communication
```javascript
// Service-to-service HTTP calls using Circuit Breaker pattern
const CircuitBreaker = require('opossum');

const options = {
  timeout: 3000,
  errorThresholdPercentage: 50,
  resetTimeout: 30000
};

const breaker = new CircuitBreaker(callExternalService, options);
```

#### 2. Asynchronous Communication
```javascript
// Event-driven communication using Kafka
const kafka = require('kafkajs');

// Producer (Publishing events)
await producer.send({
  topic: 'user-progress-updated',
  messages: [{
    key: userId,
    value: JSON.stringify({
      userId,
      projectId,
      milestoneId,
      completedAt: new Date(),
      xpEarned: 50
    })
  }]
});

// Consumer (Listening to events)
await consumer.subscribe({ topic: 'user-progress-updated' });
await consumer.run({
  eachMessage: async ({ message }) => {
    const event = JSON.parse(message.value.toString());
    await gamificationService.awardXP(event);
  }
});
```

---

## Authentication & Authorization

### JWT-Based Authentication

#### Token Structure
```javascript
// Access Token (15 minutes)
{
  "sub": "user_id",
  "email": "user@example.com",
  "role": "user",
  "permissions": ["read:projects", "write:progress"],
  "iat": 1640995200,
  "exp": 1640996100,
  "iss": "psyduck-auth",
  "aud": "psyduck-api"
}

// Refresh Token (7 days)
{
  "sub": "user_id",
  "type": "refresh",
  "iat": 1640995200,
  "exp": 1641600000,
  "iss": "psyduck-auth"
}
```

#### Authentication Flow
```
1. User login → Validate credentials
2. Generate access token (15min) + refresh token (7 days)
3. Store refresh token in httpOnly cookie
4. Return access token in response
5. Client includes access token in Authorization header
6. API validates token on each request
7. When access token expires, use refresh token to get new access token
```

### Role-Based Access Control (RBAC)

#### User Roles
```javascript
const roles = {
  STUDENT: {
    name: 'student',
    permissions: [
      'read:projects',
      'write:progress',
      'read:discussions',
      'write:discussions',
      'execute:code'
    ]
  },
  MENTOR: {
    name: 'mentor',
    permissions: [
      ...roles.STUDENT.permissions,
      'read:mentees',
      'write:feedback',
      'read:analytics'
    ]
  },
  ADMIN: {
    name: 'admin',
    permissions: [
      'read:*',
      'write:*',
      'delete:*'
    ]
  },
  COMPANY_RECRUITER: {
    name: 'company_recruiter',
    permissions: [
      'read:candidates',
      'write:job_opportunities',
      'read:user_profiles'
    ]
  }
};
```

#### Authorization Middleware
```javascript
const authorize = (requiredPermissions) => {
  return (req, res, next) => {
    const userPermissions = req.user.permissions;
    
    const hasPermission = requiredPermissions.every(permission => 
      userPermissions.includes(permission) || 
      userPermissions.includes('*')
    );
    
    if (!hasPermission) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'INSUFFICIENT_PERMISSIONS',
          message: 'Access denied'
        }
      });
    }
    
    next();
  };
};

// Usage
app.get('/admin/users', 
  authenticate, 
  authorize(['read:admin', 'read:users']), 
  getUsersController
);
```

### OAuth Integration

#### Supported Providers
```javascript
// GitHub OAuth (for repository integration)
const githubConfig = {
  clientId: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  scope: ['user:email', 'repo'],
  redirectUri: `${process.env.API_URL}/auth/github/callback`
};

// Google OAuth (for easy sign-in)
const googleConfig = {
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  scope: ['email', 'profile'],
  redirectUri: `${process.env.API_URL}/auth/google/callback`
};

// LinkedIn OAuth (for professional profiles)
const linkedinConfig = {
  clientId: process.env.LINKEDIN_CLIENT_ID,
  clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
  scope: ['r_emailaddress', 'r_liteprofile'],
  redirectUri: `${process.env.API_URL}/auth/linkedin/callback`
};
```

---

## External Integrations

### 1. GitHub Integration

#### Repository Management
```javascript
// GitHub API client setup
const { Octokit } = require('@octokit/rest');

class GitHubService {
  constructor() {
    this.octokit = new Octokit({
      auth: process.env.GITHUB_TOKEN
    });
  }

  async createProjectRepository(userId, projectId, templateRepo) {
    // Create repository from template
    const response = await this.octokit.repos.createUsingTemplate({
      template_owner: 'psyduck-templates',
      template_repo: templateRepo,
      owner: userId,
      name: `psyduck-${projectId}`,
      description: 'Project created via Psyduck learning platform',
      private: false
    });

    return response.data;
  }

  async setupWebhooks(repoOwner, repoName, projectId) {
    // Setup webhooks for commit tracking
    await this.octokit.repos.createWebhook({
      owner: repoOwner,
      repo: repoName,
      name: 'web',
      config: {
        url: `${process.env.API_URL}/webhooks/github`,
        content_type: 'json',
        secret: process.env.GITHUB_WEBHOOK_SECRET
      },
      events: ['push', 'pull_request', 'issues']
    });
  }

  async analyzeCommits(repoOwner, repoName) {
    const commits = await this.octokit.repos.listCommits({
      owner: repoOwner,
      repo: repoName,
      per_page: 100
    });

    return {
      totalCommits: commits.data.length,
      lastCommitDate: commits.data[0]?.commit.author.date,
      commitFrequency: this.calculateCommitFrequency(commits.data)
    };
  }
}
```

### 2. AI-Powered Code Review

#### OpenAI Integration
```javascript
const OpenAI = require('openai');

class CodeReviewService {
  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
  }

  async reviewCode(code, language, context) {
    const prompt = `
      Review the following ${language} code for a ${context.projectType} project:
      
      ${code}
      
      Please provide:
      1. Code quality assessment (1-10)
      2. Best practices violations
      3. Security concerns
      4. Performance optimizations
      5. Suggestions for improvement
      
      Format the response as JSON with these fields.
    `;

    const completion = await this.openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
      max_tokens: 1000
    });

    return JSON.parse(completion.choices[0].message.content);
  }

  async generateCodeSuggestions(code, language, objective) {
    const prompt = `
      Given this ${language} code:
      ${code}
      
      The objective is: ${objective}
      
      Provide 3 specific code improvements or next steps to achieve the objective.
    `;

    const completion = await this.openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 500
    });

    return completion.choices[0].message.content;
  }
}
```

### 3. Video Call Integration (Mentorship)

#### Zoom/Google Meet Integration
```javascript
class VideoCallService {
  async createMentorshipSession(mentorId, menteeId, scheduledTime) {
    // Create Zoom meeting
    const zoomConfig = {
      topic: 'Psyduck Mentorship Session',
      type: 2, // Scheduled meeting
      start_time: scheduledTime,
      duration: 60,
      settings: {
        host_video: true,
        participant_video: true,
        join_before_host: false,
        waiting_room: true,
        registration_type: 1
      }
    };

    const response = await axios.post(
      'https://api.zoom.us/v2/users/me/meetings',
      zoomConfig,
      {
        headers: {
          'Authorization': `Bearer ${this.getZoomToken()}`,
          'Content-Type': 'application/json'
        }
      }
    );

    // Store meeting details and send notifications
    await this.storeMeetingDetails(mentorId, menteeId, response.data);
    await this.sendMeetingInvitations(mentorId, menteeId, response.data);

    return response.data;
  }
}
```

### 4. Payment Processing (Premium Features)

#### Stripe Integration
```javascript
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

class PaymentService {
  async createSubscription(userId, priceId) {
    const customer = await stripe.customers.create({
      metadata: { userId }
    });

    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{ price: priceId }],
      payment_behavior: 'default_incomplete',
      expand: ['latest_invoice.payment_intent'],
    });

    return {
      subscriptionId: subscription.id,
      clientSecret: subscription.latest_invoice.payment_intent.client_secret,
    };
  }

  async handleWebhook(event) {
    switch (event.type) {
      case 'invoice.payment_succeeded':
        await this.activatePremiumFeatures(event.data.object.customer);
        break;
      case 'invoice.payment_failed':
        await this.handlePaymentFailure(event.data.object.customer);
        break;
    }
  }
}
```

### 5. Email Service Integration

#### SendGrid Integration
```javascript
const sgMail = require('@sendgrid/mail');

class EmailService {
  constructor() {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  }

  async sendProjectCompletionEmail(user, project) {
    const msg = {
      to: user.email,
      from: 'noreply@psyduck.dev',
      templateId: 'd-project-completion-template',
      dynamic_template_data: {
        user_name: user.first_name,
        project_title: project.title,
        xp_earned: project.xp_reward,
        completion_badge_url: project.badge_url,
        next_projects: await this.getRecommendedProjects(user.id)
      }
    };

    await sgMail.send(msg);
  }

  async sendWeeklyProgressReport(user) {
    const weeklyStats = await this.getWeeklyStats(user.id);
    
    const msg = {
      to: user.email,
      from: 'progress@psyduck.dev',
      templateId: 'd-weekly-progress-template',
      dynamic_template_data: {
        user_name: user.first_name,
        week_xp: weeklyStats.xpEarned,
        projects_completed: weeklyStats.projectsCompleted,
        streak_count: weeklyStats.currentStreak,
        leaderboard_position: weeklyStats.leaderboardRank
      }
    };

    await sgMail.send(msg);
  }
}
```

---

## Code Execution Engine

### Secure Sandboxed Execution

#### Docker-Based Isolation
```javascript
class CodeExecutionService {
  constructor() {
    this.docker = new Docker();
    this.executionQueue = new Queue('code-execution');
  }

  async executeCode(submission) {
    const { language, code, input, testCases } = submission;
    
    // Create isolated container
    const container = await this.createExecutionContainer(language);
    
    try {
      // Copy code to container
      await this.copyCodeToContainer(container, code);
      
      // Execute with timeout and resource limits
      const result = await this.runCodeInContainer(container, input, testCases);
      
      // Validate output
      const validation = await this.validateOutput(result, testCases);
      
      return {
        success: true,
        output: result.stdout,
        executionTime: result.executionTime,
        memoryUsage: result.memoryUsage,
        validation,
        testResults: result.testResults
      };
      
    } catch (error) {
      return {
        success: false,
        error: error.message,
        executionTime: error.timeout ? 30000 : 0
      };
    } finally {
      // Cleanup container
      await container.remove({ force: true });
    }
  }

  async createExecutionContainer(language) {
    const config = this.getLanguageConfig(language);
    
    return await this.docker.createContainer({
      Image: config.dockerImage,
      Memory: config.memoryLimit * 1024 * 1024, // Convert MB to bytes
      CpuShares: 512, // Limit CPU usage
      NetworkMode: 'none', // No network access
      ReadonlyRootfs: true, // Read-only filesystem
      User: 'nobody', // Non-root user
      WorkingDir: '/app',
      Cmd: ['/bin/sh'],
      Tty: true,
      OpenStdin: true,
    });
  }

  getLanguageConfig(language) {
    const configs = {
      javascript: {
        dockerImage: 'node:18-alpine',
        memoryLimit: 128,
        timeoutSeconds: 30,
        executeCommand: 'node code.js'
      },
      python: {
        dockerImage: 'python:3.11-alpine',
        memoryLimit: 128,
        timeoutSeconds: 30,
        executeCommand: 'python code.py'
      },
      java: {
        dockerImage: 'openjdk:17-alpine',
        memoryLimit: 256,
        timeoutSeconds: 45,
        executeCommand: 'javac Code.java && java Code'
      },
      cpp: {
        dockerImage: 'gcc:alpine',
        memoryLimit: 128,
        timeoutSeconds: 45,
        executeCommand: 'g++ -o code code.cpp && ./code'
      },
      go: {
        dockerImage: 'golang:alpine',
        memoryLimit: 128,
        timeoutSeconds: 30,
        executeCommand: 'go run code.go'
      }
    };

    return configs[language] || configs.javascript;
  }
}
```

#### Kubernetes Job-Based Execution
```yaml
# kubernetes-job-template.yaml
apiVersion: batch/v1
kind: Job
metadata:
  name: code-execution-${submissionId}
  namespace: code-execution
spec:
  ttlSecondsAfterFinished: 300
  template:
    spec:
      restartPolicy: Never
      containers:
      - name: code-runner
        image: ${languageImage}
        resources:
          limits:
            memory: "128Mi"
            cpu: "0.5"
          requests:
            memory: "64Mi"
            cpu: "0.1"
        securityContext:
          runAsNonRoot: true
          runAsUser: 65534
          readOnlyRootFilesystem: true
          allowPrivilegeEscalation: false
        volumeMounts:
        - name: code-volume
          mountPath: /app
        - name: temp-volume
          mountPath: /tmp
        command: ["/bin/sh"]
        args: ["-c", "${executeCommand}"]
      volumes:
      - name: code-volume
        configMap:
          name: code-${submissionId}
      - name: temp-volume
        emptyDir: {}
      securityContext:
        fsGroup: 65534
```

### Language-Specific Handlers

#### JavaScript/Node.js Handler
```javascript
class JavaScriptExecutor {
  async execute(code, input, testCases) {
    // Wrap user code with safety measures
    const wrappedCode = `
      const originalConsole = console;
      const outputs = [];
      
      console.log = (...args) => {
        outputs.push(args.join(' '));
      };
      
      // User code
      ${code}
      
      // Test execution
      const runTests = () => {
        const results = [];
        ${this.generateTestCode(testCases)}
        return results;
      };
      
      // Return results
      JSON.stringify({
        outputs,
        testResults: runTests()
      });
    `;

    return await this.executeInContainer(wrappedCode);
  }

  generateTestCode(testCases) {
    return testCases.map((testCase, index) => `
      try {
        const input = ${JSON.stringify(testCase.input)};
        const expected = ${JSON.stringify(testCase.expected)};
        const actual = solve(input);
        results.push({
          testCase: ${index + 1},
          passed: JSON.stringify(actual) === JSON.stringify(expected),
          input,
          expected,
          actual
        });
      } catch (error) {
        results.push({
          testCase: ${index + 1},
          passed: false,
          error: error.message
        });
      }
    `).join('\n');
  }
}
```

#### Python Handler
```python
import sys
import json
import traceback
from contextlib import redirect_stdout, redirect_stderr
from io import StringIO

class PythonExecutor:
    def execute(self, code, input_data, test_cases):
        # Create safe execution environment
        safe_globals = {
            '__builtins__': {
                'len': len,
                'range': range,
                'enumerate': enumerate,
                'zip': zip,
                'map': map,
                'filter': filter,
                'sum': sum,
                'max': max,
                'min': min,
                'abs': abs,
                'round': round,
                'sorted': sorted,
                'list': list,
                'dict': dict,
                'set': set,
                'tuple': tuple,
                'str': str,
                'int': int,
                'float': float,
                'bool': bool,
                'print': print
            }
        }
        
        outputs = StringIO()
        errors = StringIO()
        
        try:
            with redirect_stdout(outputs), redirect_stderr(errors):
                # Execute user code
                exec(code, safe_globals)
                
                # Run test cases
                test_results = []
                for i, test_case in enumerate(test_cases):
                    try:
                        result = safe_globals['solve'](test_case['input'])
                        test_results.append({
                            'testCase': i + 1,
                            'passed': result == test_case['expected'],
                            'input': test_case['input'],
                            'expected': test_case['expected'],
                            'actual': result
                        })
                    except Exception as e:
                        test_results.append({
                            'testCase': i + 1,
                            'passed': False,
                            'error': str(e)
                        })
                
                return {
                    'success': True,
                    'outputs': outputs.getvalue().strip().split('\n'),
                    'testResults': test_results
                }
                
        except Exception as e:
            return {
                'success': False,
                'error': str(e),
                'traceback': traceback.format_exc()
            }
```

---

## Gamification System

### XP Calculation Engine

#### XP Sources and Values
```javascript
const XP_CONFIG = {
  // Project-based XP
  PROJECT_COMPLETION: {
    beginner: 500,
    intermediate: 1000,
    advanced: 2000
  },
  
  // Milestone completion
  MILESTONE_COMPLETION: {
    base: 50,
    multiplier: {
      beginner: 1.0,
      intermediate: 1.5,
      advanced: 2.0
    }
  },
  
  // Daily activities
  DAILY_LOGIN: 10,
  FIRST_CODE_SUBMISSION: 25,
  PERFECT_TEST_SCORE: 100,
  
  // Social activities
  HELPING_PEER: 30,
  QUALITY_DISCUSSION_POST: 20,
  MENTORING_SESSION: 150,
  
  // Streak bonuses
  STREAK_BONUS: {
    7: 100,   // 1 week
    30: 500,  // 1 month
    100: 2000, // 100 days
    365: 10000 // 1 year
  }
};

class XPCalculator {
  async calculateProjectXP(userId, projectId) {
    const project = await this.getProject(projectId);
    const userProgress = await this.getUserProgress(userId, projectId);
    
    let totalXP = 0;
    
    // Base project XP
    totalXP += XP_CONFIG.PROJECT_COMPLETION[project.difficulty_level];
    
    // Quality bonus (based on code review scores)
    const qualityScore = await this.getCodeQualityScore(userId, projectId);
    if (qualityScore >= 8) totalXP += 200;
    else if (qualityScore >= 6) totalXP += 100;
    
    // Speed bonus (completed faster than average)
    const averageTime = await this.getAverageCompletionTime(projectId);
    if (userProgress.completionTime < averageTime * 0.8) {
      totalXP += 150;
    }
    
    // Collaboration bonus
    if (userProgress.helpedPeers > 0) {
      totalXP += userProgress.helpedPeers * 25;
    }
    
    return totalXP;
  }

  async awardXP(userId, source, amount, metadata = {}) {
    const transaction = await db.transaction();
    
    try {
      // Record XP transaction
      await db.xp_transactions.create({
        user_id: userId,
        amount,
        source_type: source,
        source_id: metadata.sourceId,
        description: metadata.description
      }, { transaction });
      
      // Update user total XP
      const user = await db.users.findByPk(userId, { transaction });
      await user.update({
        total_xp: user.total_xp + amount
      }, { transaction });
      
      // Check for level up
      const newLevel = this.calculateLevel(user.total_xp + amount);
      const oldLevel = this.calculateLevel(user.total_xp);
      
      if (newLevel > oldLevel) {
        await this.handleLevelUp(userId, newLevel, transaction);
      }
      
      // Check for badge eligibility
      await this.checkBadgeEligibility(userId, transaction);
      
      await transaction.commit();
      
      // Publish XP awarded event
      await this.publishEvent('xp.awarded', {
        userId,
        amount,
        source,
        newTotal: user.total_xp + amount,
        levelUp: newLevel > oldLevel
      });
      
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  calculateLevel(totalXP) {
    // Level formula: level = floor(sqrt(xp / 100))
    return Math.floor(Math.sqrt(totalXP / 100));
  }
}
```

### Badge System

#### Badge Categories and Logic
```javascript
const BADGES = {
  // Completion badges
  FIRST_PROJECT: {
    id: 'first_project',
    name: 'Getting Started',
    description: 'Complete your first project',
    icon: 'trophy',
    category: 'completion',
    criteria: {
      type: 'project_completion',
      count: 1
    }
  },
  
  DOMAIN_MASTER: {
    id: 'domain_master',
    name: 'Domain Master',
    description: 'Complete all projects in a domain',
    icon: 'crown',
    category: 'completion',
    criteria: {
      type: 'domain_completion',
      percentage: 100
    }
  },
  
  // Skill badges
  CODE_QUALITY_EXPERT: {
    id: 'code_quality_expert',
    name: 'Code Quality Expert',
    description: 'Maintain average code quality score above 8.5',
    icon: 'star',
    category: 'skill',
    criteria: {
      type: 'code_quality_average',
      threshold: 8.5,
      minimumSubmissions: 10
    }
  },
  
  // Streak badges
  CONSISTENT_LEARNER: {
    id: 'consistent_learner',
    name: 'Consistent Learner',
    description: 'Maintain a 30-day learning streak',
    icon: 'fire',
    category: 'streak',
    criteria: {
      type: 'streak_length',
      days: 30
    }
  },
  
  // Community badges
  HELPFUL_MENTOR: {
    id: 'helpful_mentor',
    name: 'Helpful Mentor',
    description: 'Help 50 fellow learners',
    icon: 'heart',
    category: 'community',
    criteria: {
      type: 'help_count',
      count: 50
    }
  },
  
  // Special badges
  EARLY_ADOPTER: {
    id: 'early_adopter',
    name: 'Early Adopter',
    description: 'Joined during beta phase',
    icon: 'rocket',
    category: 'special',
    criteria: {
      type: 'registration_date',
      before: '2024-12-31'
    }
  }
};

class BadgeSystem {
  async checkBadgeEligibility(userId, transaction) {
    const user = await this.getUserWithStats(userId);
    const userBadges = await this.getUserBadges(userId);
    const earnedBadgeIds = userBadges.map(b => b.badge_id);
    
    for (const [badgeId, badge] of Object.entries(BADGES)) {
      if (earnedBadgeIds.includes(badgeId)) continue;
      
      const eligible = await this.checkBadgeCriteria(user, badge.criteria);
      
      if (eligible) {
        await this.awardBadge(userId, badgeId, transaction);
      }
    }
  }

  async checkBadgeCriteria(user, criteria) {
    switch (criteria.type) {
      case 'project_completion':
        return user.completedProjects >= criteria.count;
        
      case 'domain_completion':
        const domainStats = await this.getDomainCompletionStats(user.id);
        return domainStats.some(d => d.completion_percentage >= criteria.percentage);
        
      case 'code_quality_average':
        const avgQuality = await this.getAverageCodeQuality(user.id);
        return avgQuality >= criteria.threshold && 
               user.codeSubmissions >= criteria.minimumSubmissions;
        
      case 'streak_length':
        return user.current_streak >= criteria.days;
        
      case 'help_count':
        const helpCount = await this.getHelpCount(user.id);
        return helpCount >= criteria.count;
        
      case 'registration_date':
        return new Date(user.created_at) <= new Date(criteria.before);
        
      default:
        return false;
    }
  }

  async awardBadge(userId, badgeId, transaction) {
    await db.user_badges.create({
      user_id: userId,
      badge_id: badgeId,
      earned_at: new Date()
    }, { transaction });
    
    // Award XP for badge
    const badge = BADGES[badgeId];
    if (badge.xp_value) {
      await this.xpCalculator.awardXP(
        userId, 
        'badge_earned', 
        badge.xp_value,
        { sourceId: badgeId, description: `Earned badge: ${badge.name}` }
      );
    }
    
    // Publish badge earned event
    await this.publishEvent('badge.earned', {
      userId,
      badgeId,
      badgeName: badge.name
    });
  }
}
```

### Leaderboard System

#### Real-time Leaderboard Updates
```javascript
class LeaderboardService {
  constructor() {
    this.redis = new Redis(process.env.REDIS_URL);
  }

  async updateUserRanking(userId, newXP) {
    // Update global leaderboard
    await this.redis.zadd('leaderboard:global', newXP, userId);
    
    // Update weekly leaderboard
    const weekKey = `leaderboard:week:${this.getCurrentWeek()}`;
    const weeklyXP = await this.getWeeklyXP(userId);
    await this.redis.zadd(weekKey, weeklyXP, userId);
    await this.redis.expire(weekKey, 604800); // 1 week
    
    // Update domain-specific leaderboards
    const userDomains = await this.getUserDomains(userId);
    for (const domain of userDomains) {
      const domainXP = await this.getDomainXP(userId, domain.id);
      await this.redis.zadd(`leaderboard:domain:${domain.id}`, domainXP, userId);
    }
  }

  async getLeaderboard(type = 'global', limit = 100, userId = null) {
    let key = `leaderboard:${type}`;
    
    if (type === 'week') {
      key = `leaderboard:week:${this.getCurrentWeek()}`;
    } else if (type.startsWith('domain:')) {
      const domainId = type.split(':')[1];
      key = `leaderboard:domain:${domainId}`;
    }
    
    // Get top users
    const topUsers = await this.redis.zrevrange(key, 0, limit - 1, 'WITHSCORES');
    
    // Format results
    const leaderboard = [];
    for (let i = 0; i < topUsers.length; i += 2) {
      const userIdFromList = topUsers[i];
      const score = parseInt(topUsers[i + 1]);
      const rank = Math.floor(i / 2) + 1;
      
      const user = await this.getUserInfo(userIdFromList);
      leaderboard.push({
        rank,
        user: {
          id: user.id,
          username: user.username,
          avatar_url: user.avatar_url,
          level: this.calculateLevel(user.total_xp)
        },
        xp: score
      });
    }
    
    // If specific user requested, include their position
    if (userId) {
      const userRank = await this.redis.zrevrank(key, userId);
      const userScore = await this.redis.zscore(key, userId);
      
      if (userRank !== null) {
        const user = await this.getUserInfo(userId);
        return {
          leaderboard,
          userPosition: {
            rank: userRank + 1,
            user: {
              id: user.id,
              username: user.username,
              avatar_url: user.avatar_url,
              level: this.calculateLevel(user.total_xp)
            },
            xp: parseInt(userScore)
          }
        };
      }
    }
    
    return { leaderboard };
  }

  async getStreakLeaderboard(limit = 50) {
    const users = await db.users.findAll({
      attributes: ['id', 'username', 'avatar_url', 'current_streak', 'longest_streak'],
      order: [['current_streak', 'DESC'], ['longest_streak', 'DESC']],
      limit,
      where: {
        current_streak: { [db.Sequelize.Op.gt]: 0 }
      }
    });

    return users.map((user, index) => ({
      rank: index + 1,
      user: {
        id: user.id,
        username: user.username,
        avatar_url: user.avatar_url
      },
      currentStreak: user.current_streak,
      longestStreak: user.longest_streak
    }));
  }
}
```

---

## Real-time Features

### WebSocket Implementation

#### Socket.IO Setup
```javascript
const socketIo = require('socket.io');
const jwt = require('jsonwebtoken');

class SocketService {
  constructor(server) {
    this.io = socketIo(server, {
      cors: {
        origin: process.env.FRONTEND_URL,
        methods: ["GET", "POST"]
      }
    });
    
    this.setupMiddleware();
    this.setupEventHandlers();
  }

  setupMiddleware() {
    // Authentication middleware
    this.io.use(async (socket, next) => {
      try {
        const token = socket.handshake.auth.token;
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        const user = await this.getUserById(decoded.sub);
        if (!user) {
          return next(new Error('User not found'));
        }
        
        socket.userId = user.id;
        socket.user = user;
        next();
      } catch (error) {
        next(new Error('Authentication failed'));
      }
    });
  }

  setupEventHandlers() {
    this.io.on('connection', (socket) => {
      console.log(`User ${socket.userId} connected`);
      
      // Join user-specific room
      socket.join(`user:${socket.userId}`);
      
      // Join project rooms based on user's active projects
      this.joinProjectRooms(socket);
      
      // Handle code collaboration
      this.handleCodeCollaboration(socket);
      
      // Handle chat messages
      this.handleChatMessages(socket);
      
      // Handle typing indicators
      this.handleTypingIndicators(socket);
      
      // Handle disconnection
      socket.on('disconnect', () => {
        console.log(`User ${socket.userId} disconnected`);
        this.handleDisconnection(socket);
      });
    });
  }

  async joinProjectRooms(socket) {
    const activeProjects = await this.getUserActiveProjects(socket.userId);
    
    for (const project of activeProjects) {
      socket.join(`project:${project.id}`);
    }
  }

  handleCodeCollaboration(socket) {
    // Real-time code sharing
    socket.on('code:update', async (data) => {
      const { projectId, milestoneId, code, language } = data;
      
      // Validate user has access to project
      const hasAccess = await this.validateProjectAccess(socket.userId, projectId);
      if (!hasAccess) return;
      
      // Save code state
      await this.saveCodeState(socket.userId, projectId, milestoneId, code);
      
      // Broadcast to collaborators (if applicable)
      socket.to(`project:${projectId}`).emit('code:updated', {
        userId: socket.userId,
        username: socket.user.username,
        code,
        language,
        timestamp: new Date()
      });
    });

    // Real-time execution results
    socket.on('code:execute', async (data) => {
      const { projectId, code, language, input } = data;
      
      try {
        // Execute code
        const result = await this.codeExecutionService.executeCode({
          userId: socket.userId,
          projectId,
          code,
          language,
          input
        });
        
        // Send result back to user
        socket.emit('code:execution_result', result);
        
        // Update progress if successful
        if (result.success) {
          await this.updateMilestoneProgress(socket.userId, projectId, data.milestoneId);
        }
        
      } catch (error) {
        socket.emit('code:execution_error', {
          error: error.message
        });
      }
    });
  }

  handleChatMessages(socket) {
    // Project-specific chat
    socket.on('chat:send_message', async (data) => {
      const { projectId, message, type = 'text' } = data;
      
      const chatMessage = await this.saveChatMessage({
        projectId,
        userId: socket.userId,
        message,
        type
      });
      
      // Broadcast to project room
      this.io.to(`project:${projectId}`).emit('chat:new_message', {
        id: chatMessage.id,
        user: {
          id: socket.user.id,
          username: socket.user.username,
          avatar_url: socket.user.avatar_url
        },
        message,
        type,
        timestamp: chatMessage.created_at
      });
    });
    
    // Direct messages for mentorship
    socket.on('dm:send_message', async (data) => {
      const { recipientId, message } = data;
      
      const dmMessage = await this.saveDirectMessage({
        senderId: socket.userId,
        recipientId,
        message
      });
      
      // Send to recipient
      this.io.to(`user:${recipientId}`).emit('dm:new_message', {
        id: dmMessage.id,
        sender: {
          id: socket.user.id,
          username: socket.user.username,
          avatar_url: socket.user.avatar_url
        },
        message,
        timestamp: dmMessage.created_at
      });
    });
  }

  // Real-time notifications
  async sendNotification(userId, notification) {
    this.io.to(`user:${userId}`).emit('notification:new', notification);
  }

  // Real-time XP updates
  async sendXPUpdate(userId, xpData) {
    this.io.to(`user:${userId}`).emit('xp:updated', xpData);
  }

  // Real-time badge awards
  async sendBadgeAwarded(userId, badge) {
    this.io.to(`user:${userId}`).emit('badge:awarded', badge);
  }
}
```

### Push Notifications

#### Firebase Cloud Messaging
```javascript
const admin = require('firebase-admin');

class PushNotificationService {
  constructor() {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
      })
    });
    
    this.messaging = admin.messaging();
  }

  async sendProjectDeadlineReminder(userId, project) {
    const tokens = await this.getUserDeviceTokens(userId);
    if (!tokens.length) return;

    const message = {
      notification: {
        title: 'Project Deadline Approaching',
        body: `Your project "${project.title}" is due in 2 days!`,
        icon: '/icons/notification.png'
      },
      data: {
        type: 'project_deadline',
        projectId: project.id.toString(),
        url: `/projects/${project.id}`
      },
      tokens
    };

    try {
      const response = await this.messaging.sendMulticast(message);
      await this.handleSendResults(userId, tokens, response);
    } catch (error) {
      console.error('Push notification error:', error);
    }
  }

  async sendStreakReminder(userId, streakCount) {
    const tokens = await this.getUserDeviceTokens(userId);
    if (!tokens.length) return;

    const message = {
      notification: {
        title: 'Keep Your Streak Going! 🔥',
        body: `You have a ${streakCount}-day streak. Don't break it today!`,
        icon: '/icons/streak.png'
      },
      data: {
        type: 'streak_reminder',
        streakCount: streakCount.toString(),
        url: '/dashboard'
      },
      tokens
    };

    await this.messaging.sendMulticast(message);
  }

  async sendMentorshipRequest(mentorId, mentee) {
    const tokens = await this.getUserDeviceTokens(mentorId);
    if (!tokens.length) return;

    const message = {
      notification: {
        title: 'New Mentorship Request',
        body: `${mentee.username} wants you as their mentor`,
        icon: '/icons/mentorship.png'
      },
      data: {
        type: 'mentorship_request',
        menteeId: mentee.id.toString(),
        url: '/mentorship/requests'
      },
      tokens
    };

    await this.messaging.sendMulticast(message);
  }

  async handleSendResults(userId, tokens, response) {
    // Handle failed tokens (device uninstalled app, etc.)
    const failedTokens = [];
    
    response.responses.forEach((result, index) => {
      if (!result.success) {
        failedTokens.push(tokens[index]);
      }
    });

    if (failedTokens.length > 0) {
      await this.removeInvalidTokens(userId, failedTokens);
    }
  }
}
```

---

## Infrastructure & Deployment

### Container Orchestration

#### Kubernetes Deployment Configuration
```yaml
# namespace.yaml
apiVersion: v1
kind: Namespace
metadata:
  name: psyduck-prod

---
# api-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: psyduck-api
  namespace: psyduck-prod
spec:
  replicas: 3
  selector:
    matchLabels:
      app: psyduck-api
  template:
    metadata:
      labels:
        app: psyduck-api
    spec:
      containers:
      - name: api
        image: psyduck/api:latest
        ports:
        - containerPort: 3000
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: psyduck-secrets
              key: database-url
        - name: REDIS_URL
          valueFrom:
            secretKeyRef:
              name: psyduck-secrets
              key: redis-url
        - name: JWT_SECRET
          valueFrom:
            secretKeyRef:
              name: psyduck-secrets
              key: jwt-secret
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /ready
            port: 3000
          initialDelaySeconds: 5
          periodSeconds: 5

---
# api-service.yaml
apiVersion: v1
kind: Service
metadata:
  name: psyduck-api-service
  namespace: psyduck-prod
spec:
  selector:
    app: psyduck-api
  ports:
  - protocol: TCP
    port: 80
    targetPort: 3000
  type: ClusterIP

---
# ingress.yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: psyduck-ingress
  namespace: psyduck-prod
  annotations:
    kubernetes.io/ingress.class: "nginx"
    cert-manager.io/cluster-issuer: "letsencrypt-prod"
    nginx.ingress.kubernetes.io/rate-limit: "100"
    nginx.ingress.kubernetes.io/rate-limit-window: "1m"
spec:
  tls:
  - hosts:
    - api.psyduck.dev
    secretName: psyduck-tls
  rules:
  - host: api.psyduck.dev
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: psyduck-api-service
            port:
              number: 80
```

#### Horizontal Pod Autoscaling
```yaml
# hpa.yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: psyduck-api-hpa
  namespace: psyduck-prod
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: psyduck-api
  minReplicas: 3
  maxReplicas: 20
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
  - type: Resource
    resource:
      name: memory
      target:
        type: Utilization
        averageUtilization: 80
  behavior:
    scaleUp:
      stabilizationWindowSeconds: 60
      policies:
      - type: Percent
        value: 100
        periodSeconds: 15
    scaleDown:
      stabilizationWindowSeconds: 300
      policies:
      - type: Percent
        value: 10
        periodSeconds: 60
```

### CI/CD Pipeline

#### GitHub Actions Workflow
```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:14
        env:
          POSTGRES_PASSWORD: postgres
          POSTGRES_DB: psyduck_test
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432
      
      redis:
        image: redis:7
        options: >-
          --health-cmd "redis-cli ping"
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 6379:6379

    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run tests
      run: npm test
      env:
        DATABASE_URL: postgresql://postgres:postgres@localhost:5432/psyduck_test
        REDIS_URL: redis://localhost:6379
        JWT_SECRET: test-secret
    
    - name: Run integration tests
      run: npm run test:integration
    
    - name: Security audit
      run: npm audit --audit-level high

  build:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Set up Docker Buildx
      uses: docker/setup-buildx-action@v2
    
    - name: Login to Container Registry
      uses: docker/login-action@v2
      with:
        registry: ghcr.io
        username: ${{ github.actor }}
        password: ${{ secrets.GITHUB_TOKEN }}
    
    - name: Build and push Docker image
      uses: docker/build-push-action@v4
      with:
        context: .
        push: true
        tags: |
          ghcr.io/psyduck/api:latest
          ghcr.io/psyduck/api:${{ github.sha }}
        cache-from: type=gha
        cache-to: type=gha,mode=max

  deploy:
    needs: build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup kubectl
      uses: azure/setup-kubectl@v3
      with:
        version: 'latest'
    
    - name: Configure AWS credentials
      uses: aws-actions/configure-aws-credentials@v2
      with:
        aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
        aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
        aws-region: us-west-2
    
    - name: Update kubeconfig
      run: |
        aws eks update-kubeconfig --region us-west-2 --name psyduck-cluster
    
    - name: Deploy to Kubernetes
      run: |
        sed -i 's|psyduck/api:latest|ghcr.io/psyduck/api:${{ github.sha }}|g' k8s/api-deployment.yaml
        kubectl apply -f k8s/
        kubectl rollout status deployment/psyduck-api -n psyduck-prod
    
    - name: Verify deployment
      run: |
        kubectl get pods -n psyduck-prod
        kubectl get services -n psyduck-prod
```

### Infrastructure as Code

#### Terraform Configuration
```hcl
# main.tf
terraform {
  required_version = ">= 1.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
  
  backend "s3" {
    bucket = "psyduck-terraform-state"
    key    = "prod/terraform.tfstate"
    region = "us-west-2"
  }
}

provider "aws" {
  region = var.aws_region
}

# VPC and Networking
module "vpc" {
  source = "terraform-aws-modules/vpc/aws"
  
  name = "psyduck-vpc"
  cidr = "10.0.0.0/16"
  
  azs             = ["us-west-2a", "us-west-2b", "us-west-2c"]
  private_subnets = ["10.0.1.0/24", "10.0.2.0/24", "10.0.3.0/24"]
  public_subnets  = ["10.0.101.0/24", "10.0.102.0/24", "10.0.103.0/24"]
  
  enable_nat_gateway = true
  enable_vpn_gateway = false
  enable_dns_hostnames = true
  enable_dns_support = true
  
  tags = {
    Environment = "production"
    Project     = "psyduck"
  }
}

# EKS Cluster
module "eks" {
  source = "terraform-aws-modules/eks/aws"
  
  cluster_name    = "psyduck-cluster"
  cluster_version = "1.28"
  
  vpc_id     = module.vpc.vpc_id
  subnet_ids = module.vpc.private_subnets
  
  # Node groups
  eks_managed_node_groups = {
    main = {
      min_size     = 3
      max_size     = 20
      desired_size = 6
      
      instance_types = ["m5.large"]
      capacity_type  = "ON_DEMAND"
      
      k8s_labels = {
        Environment = "production"
        NodeGroup   = "main"
      }
    }
    
    code_execution = {
      min_size     = 2
      max_size     = 10
      desired_size = 3
      
      instance_types = ["c5.xlarge"]
      capacity_type  = "SPOT"
      
      k8s_labels = {
        Environment = "production"
        NodeGroup   = "code-execution"
      }
      
      taints = {
        dedicated = {
          key    = "code-execution"
          value  = "true"
          effect = "NO_SCHEDULE"
        }
      }
    }
  }
}

# RDS PostgreSQL
resource "aws_db_instance" "main" {
  identifier = "psyduck-postgres"
  
  engine         = "postgres"
  engine_version = "14.9"
  instance_class = "db.r5.2xlarge"
  
  allocated_storage     = 500
  max_allocated_storage = 2000
  storage_type         = "gp3"
  storage_encrypted    = true
  
  db_name  = "psyduck"
  username = "psyduck"
  password = var.db_password
  
  vpc_security_group_ids = [aws_security_group.rds.id]
  db_subnet_group_name   = aws_db_subnet_group.main.name
  
  backup_retention_period = 30
  backup_window          = "03:00-04:00"
  maintenance_window     = "Mon:04:00-Mon:05:00"
  
  skip_final_snapshot = false
  final_snapshot_identifier = "psyduck-postgres-final-snapshot"
  
  performance_insights_enabled = true
  monitoring_interval = 60
  monitoring_role_arn = aws_iam_role.rds_monitoring.arn
  
  tags = {
    Environment = "production"
    Project     = "psyduck"
  }
}

# ElastiCache Redis
resource "aws_elasticache_replication_group" "main" {
  replication_group_id       = "psyduck-redis"
  description                = "Redis cluster for Psyduck"
  
  node_type                  = "cache.r6g.large"
  parameter_group_name       = "default.redis7"
  port                       = 6379
  
  num_cache_clusters         = 3
  automatic_failover_enabled = true
  multi_az_enabled          = true
  
  subnet_group_name = aws_elasticache_subnet_group.main.name
  security_group_ids = [aws_security_group.redis.id]
  
  at_rest_encryption_enabled = true
  transit_encryption_enabled = true
  auth_token                 = var.redis_auth_token
  
  snapshot_retention_limit = 7
  snapshot_window         = "03:00-05:00"
  
  tags = {
    Environment = "production"
    Project     = "psyduck"
  }
}

# Application Load Balancer
resource "aws_lb" "main" {
  name               = "psyduck-alb"
  load_balancer_type = "application"
  
  subnets         = module.vpc.public_subnets
  security_groups = [aws_security_group.alb.id]
  
  enable_deletion_protection = true
  
  tags = {
    Environment = "production"
    Project     = "psyduck"
  }
}

# CloudWatch Log Groups
resource "aws_cloudwatch_log_group" "api" {
  name              = "/aws/eks/psyduck-cluster/api"
  retention_in_days = 30
  
  tags = {
    Environment = "production"
    Project     = "psyduck"
  }
}
```

---

## Monitoring & Logging

### Application Monitoring

#### Prometheus + Grafana Setup
```yaml
# monitoring/prometheus-config.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: prometheus-config
  namespace: monitoring
data:
  prometheus.yml: |
    global:
      scrape_interval: 15s
      evaluation_interval: 15s
    
    rule_files:
      - "psyduck_rules.yml"
    
    alerting:
      alertmanagers:
        - static_configs:
            - targets:
              - alertmanager:9093
    
    scrape_configs:
      - job_name: 'psyduck-api'
        static_configs:
          - targets: ['psyduck-api-service:80']
        metrics_path: /metrics
        scrape_interval: 30s
      
      - job_name: 'kubernetes-pods'
        kubernetes_sd_configs:
          - role: pod
        relabel_configs:
          - source_labels: [__meta_kubernetes_pod_annotation_prometheus_io_scrape]
            action: keep
            regex: true
          - source_labels: [__meta_kubernetes_pod_annotation_prometheus_io_path]
            action: replace
            target_label: __metrics_path__
            regex: (.+)

  psyduck_rules.yml: |
    groups:
      - name: psyduck.rules
        rules:
          - alert: HighErrorRate
            expr: rate(http_requests_total{status=~"5.."}[5m]) / rate(http_requests_total[5m]) > 0.1
            for: 2m
            labels:
              severity: critical
            annotations:
              summary: "High error rate detected"
              description: "Error rate is {{ $value | humanizePercentage }}"
          
          - alert: HighResponseTime
            expr: histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m])) > 1
            for: 5m
            labels:
              severity: warning
            annotations:
              summary: "High response time detected"
              description: "95th percentile response time is {{ $value }}s"
          
          - alert: DatabaseConnectionIssue
            expr: postgresql_up == 0
            for: 1m
            labels:
              severity: critical
            annotations:
              summary: "Database connection lost"
              description: "PostgreSQL database is not responding"
```

#### Application Metrics Collection
```javascript
const prometheus = require('prom-client');

// Create custom metrics
const httpRequestDuration = new prometheus.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status'],
  buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5, 7, 10]
});

const httpRequestTotal = new prometheus.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status']
});

const activeUsers = new prometheus.Gauge({
  name: 'active_users_total',
  help: 'Number of currently active users'
});

const codeExecutions = new prometheus.Counter({
  name: 'code_executions_total',
  help: 'Total number of code executions',
  labelNames: ['language', 'status']
});

const xpAwarded = new prometheus.Counter({
  name: 'xp_awarded_total',
  help: 'Total XP awarded',
  labelNames: ['source']
});

// Middleware to collect HTTP metrics
const metricsMiddleware = (req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = (Date.now() - start) / 1000;
    const route = req.route ? req.route.path : req.path;
    
    httpRequestDuration
      .labels(req.method, route, res.statusCode)
      .observe(duration);
    
    httpRequestTotal
      .labels(req.method, route, res.statusCode)
      .inc();
  });
  
  next();
};

// Custom business metrics
class BusinessMetrics {
  static recordCodeExecution(language, success) {
    codeExecutions
      .labels(language, success ? 'success' : 'failure')
      .inc();
  }
  
  static recordXPAwarded(source, amount) {
    xpAwarded
      .labels(source)
      .inc(amount);
  }
  
  static updateActiveUsers(count) {
    activeUsers.set(count);
  }
  
  static async getMetrics() {
    return prometheus.register.metrics();
  }
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: process.env.APP_VERSION || '1.0.0'
  });
});

// Metrics endpoint
app.get('/metrics', async (req, res) => {
  try {
    const metrics = await BusinessMetrics.getMetrics();
    res.set('Content-Type', prometheus.register.contentType);
    res.end(metrics);
  } catch (error) {
    res.status(500).send('Error generating metrics');
  }
});
```

### Centralized Logging

#### ELK Stack Configuration
```yaml
# logging/elasticsearch.yaml
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: elasticsearch
  namespace: logging
spec:
  serviceName: elasticsearch
  replicas: 3
  selector:
    matchLabels:
      app: elasticsearch
  template:
    metadata:
      labels:
        app: elasticsearch
    spec:
      containers:
      - name: elasticsearch
        image: docker.elastic.co/elasticsearch/elasticsearch:8.10.0
        ports:
        - containerPort: 9200
          name: rest
        - containerPort: 9300
          name: inter-node
        env:
        - name: cluster.name
          value: psyduck-logs
        - name: node.name
          valueFrom:
            fieldRef:
              fieldPath: metadata.name
        - name: discovery.seed_hosts
          value: "elasticsearch-0.elasticsearch,elasticsearch-1.elasticsearch,elasticsearch-2.elasticsearch"
        - name: cluster.initial_master_nodes
          value: "elasticsearch-0,elasticsearch-1,elasticsearch-2"
        - name: ES_JAVA_OPTS
          value: "-Xms2g -Xmx2g"
        resources:
          requests:
            memory: 4Gi
            cpu: 1000m
          limits:
            memory: 4Gi
            cpu: 2000m
        volumeMounts:
        - name: data
          mountPath: /usr/share/elasticsearch/data
  volumeClaimTemplates:
  - metadata:
      name: data
    spec:
      accessModes: ["ReadWriteOnce"]
      storageClassName: "gp3"
      resources:
        requests:
          storage: 100Gi

---
# logging/logstash.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: logstash
  namespace: logging
spec:
  replicas: 2
  selector:
    matchLabels:
      app: logstash
  template:
    metadata:
      labels:
        app: logstash
    spec:
      containers:
      - name: logstash
        image: docker.elastic.co/logstash/logstash:8.10.0
        ports:
        - containerPort: 5044
        env:
        - name: LS_JAVA_OPTS
          value: "-Xmx1g -Xms1g"
        resources:
          requests:
            memory: 2Gi
            cpu: 500m
          limits:
            memory: 2Gi
            cpu: 1000m
        volumeMounts:
        - name: config
          mountPath: /usr/share/logstash/pipeline
        - name: logstash-yml
          mountPath: /usr/share/logstash/config/logstash.yml
          subPath: logstash.yml
      volumes:
      - name: config
        configMap:
          name: logstash-config
      - name: logstash-yml
        configMap:
          name: logstash-config
          items:
          - key: logstash.yml
            path: logstash.yml
```

#### Structured Logging Implementation
```javascript
const winston = require('winston');
const { ElasticsearchTransport } = require('winston-elasticsearch');

// Configure Winston logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: {
    service: 'psyduck-api',
    version: process.env.APP_VERSION || '1.0.0',
    environment: process.env.NODE_ENV || 'development'
  },
  transports: [
    // Console output for development
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    }),
    
    // Elasticsearch for production
    new ElasticsearchTransport({
      level: 'info',
      clientOpts: {
        node: process.env.ELASTICSEARCH_URL,
        auth: {
          username: process.env.ELASTICSEARCH_USERNAME,
          password: process.env.ELASTICSEARCH_PASSWORD
        }
      },
      index: 'psyduck-logs'
    })
  ]
});

// Request logging middleware
const requestLogger = (req, res, next) => {
  const start = Date.now();
  
  // Log request
  logger.info('HTTP Request', {
    method: req.method,
    url: req.url,
    userAgent: req.get('User-Agent'),
    ip: req.ip,
    userId: req.user?.id,
    correlationId: req.headers['x-correlation-id'] || uuid.v4()
  });
  
  // Log response
  res.on('finish', () => {
    const duration = Date.now() - start;
    
    logger.info('HTTP Response', {
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      duration,
      userId: req.user?.id,
      correlationId: req.headers['x-correlation-id']
    });
  });
  
  next();
};

// Business event logging
class EventLogger {
  static logUserRegistration(user) {
    logger.info('User Registration', {
      event: 'user_registered',
      userId: user.id,
      email: user.email,
      source: user.registration_source
    });
  }
  
  static logProjectCompletion(userId, projectId, timeSpent) {
    logger.info('Project Completion', {
      event: 'project_completed',
      userId,
      projectId,
      timeSpent,
      timestamp: new Date().toISOString()
    });
  }
  
  static logCodeExecution(userId, language, success, executionTime) {
    logger.info('Code Execution', {
      event: 'code_executed',
      userId,
      language,
      success,
      executionTime,
      timestamp: new Date().toISOString()
    });
  }
  
  static logXPAwarded(userId, amount, source) {
    logger.info('XP Awarded', {
      event: 'xp_awarded',
      userId,
      amount,
      source,
      timestamp: new Date().toISOString()
    });
  }
  
  static logError(error, context = {}) {
    logger.error('Application Error', {
      error: {
        message: error.message,
        stack: error.stack,
        name: error.name
      },
      ...context
    });
  }
}

module.exports = { logger, requestLogger, EventLogger };
```

### Error Tracking

#### Sentry Integration
```javascript
const Sentry = require('@sentry/node');
const { ProfilingIntegration } = require('@sentry/profiling-node');

// Initialize Sentry
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  release: process.env.APP_VERSION,
  
  integrations: [
    new ProfilingIntegration(),
    new Sentry.Integrations.Http({ tracing: true }),
    new Sentry.Integrations.Express({ app })
  ],
  
  tracesSampleRate: 0.1,
  profilesSampleRate: 0.1,
  
  beforeSend(event, hint) {
    // Filter out sensitive information
    if (event.request) {
      delete event.request.headers?.authorization;
      delete event.request.headers?.cookie;
    }
    
    return event;
  }
});

// Error handling middleware
const errorHandler = (error, req, res, next) => {
  // Log error
  EventLogger.logError(error, {
    userId: req.user?.id,
    method: req.method,
    url: req.url,
    correlationId: req.headers['x-correlation-id']
  });
  
  // Report to Sentry
  Sentry.captureException(error, {
    user: {
      id: req.user?.id,
      email: req.user?.email
    },
    request: req,
    extra: {
      correlationId: req.headers['x-correlation-id']
    }
  });
  
  // Send response
  const statusCode = error.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    error: {
      code: error.code || 'INTERNAL_ERROR',
      message: statusCode === 500 ? 'Internal server error' : error.message
    },
    meta: {
      timestamp: new Date().toISOString(),
      request_id: req.headers['x-correlation-id']
    }
  });
};
```

---

## Security Considerations

### API Security

#### Rate Limiting
```javascript
const rateLimit = require('express-rate-limit');
const RedisStore = require('rate-limit-redis');
const Redis = require('ioredis');

const redis = new Redis(process.env.REDIS_URL);

// Different rate limits for different endpoints
const createRateLimiter = (windowMs, max, keyGenerator = null) => {
  return rateLimit({
    store: new RedisStore({
      sendCommand: (...args) => redis.call(...args),
    }),
    windowMs,
    max,
    keyGenerator: keyGenerator || ((req) => req.ip),
    message: {
      success: false,
      error: {
        code: 'RATE_LIMIT_EXCEEDED',
        message: 'Too many requests'
      }
    },
    standardHeaders: true,
    legacyHeaders: false,
  });
};

// General API rate limit
const generalLimiter = createRateLimiter(
  15 * 60 * 1000, // 15 minutes
  1000 // requests per window
);

// Authentication rate limit (more strict)
const authLimiter = createRateLimiter(
  15 * 60 * 1000, // 15 minutes
  5, // requests per window
  (req) => `auth:${req.ip}`
);

// Code execution rate limit (per user)
const codeExecutionLimiter = createRateLimiter(
  60 * 1000, // 1 minute
  10, // executions per minute
  (req) => `code:${req.user?.id || req.ip}`
);

// Apply rate limiters
app.use('/auth', authLimiter);
app.use('/code/execute', codeExecutionLimiter);
app.use(generalLimiter);
```

#### Input Validation & Sanitization
```javascript
const Joi = require('joi');
const xss = require('xss');
const helmet = require('helmet');

// Security headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      scriptSrc: ["'self'"],
      connectSrc: ["'self'", "wss:", "https:"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}));

// Input validation schemas
const validationSchemas = {
  userRegistration: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/).required(),
    username: Joi.string().alphanum().min(3).max(30).required(),
    firstName: Joi.string().max(100).required(),
    lastName: Joi.string().max(100).required()
  }),
  
  codeSubmission: Joi.object({
    projectId: Joi.string().uuid().required(),
    milestoneId: Joi.string().uuid().required(),
    language: Joi.string().valid('javascript', 'python', 'java', 'cpp', 'go').required(),
    code: Joi.string().max(50000).required(), // 50KB limit
    input: Joi.string().max(10000).optional()
  }),
  
  projectCreation: Joi.object({
    title: Joi.string().max(200).required(),
    description: Joi.string().max(5000).required(),
    difficulty: Joi.string().valid('beginner', 'intermediate', 'advanced').required(),
    domainId: Joi.string().uuid().required(),
    techStack: Joi.array().items(Joi.string()).max(10),
    estimatedHours: Joi.number().min(1).max(500)
  })
};

// Validation middleware
const validate = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true
    });
    
    if (error) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid input parameters',
          details: error.details.map(detail => ({
            field: detail.path.join('.'),
            message: detail.message
          }))
        }
      });
    }
    
    // Sanitize input
    req.validatedBody = sanitizeObject(value);
    next();
  };
};

// XSS protection
const sanitizeObject = (obj) => {
  if (typeof obj === 'string') {
    return xss(obj, {
      whiteList: {}, // No HTML tags allowed
      stripIgnoreTag: true,
      stripIgnoreTagBody: ['script']
    });
  }
  
  if (Array.isArray(obj)) {
    return obj.map(sanitizeObject);
  }
  
  if (obj && typeof obj === 'object') {
    const sanitized = {};
    for (const [key, value] of Object.entries(obj)) {
      sanitized[key] = sanitizeObject(value);
    }
    return sanitized;
  }
  
  return obj;
};

// Usage
app.post('/auth/register', 
  validate(validationSchemas.userRegistration),
  registerController
);

app.post('/code/submit',
  authenticate,
  validate(validationSchemas.codeSubmission),
  submitCodeController
);
```

#### Code Execution Security
```javascript
class SecureCodeExecutor {
  constructor() {
    this.docker = new Docker();
    this.securityRules = this.loadSecurityRules();
  }

  loadSecurityRules() {
    return {
      javascript: {
        blockedModules: ['fs', 'child_process', 'cluster', 'os', 'path', 'crypto'],
        blockedGlobals: ['process', 'global', 'Buffer', 'require'],
        timeoutMs: 30000,
        memoryLimitMB: 128
      },
      python: {
        blockedModules: ['os', 'sys', 'subprocess', 'importlib', '__builtin__', 'builtins'],
        blockedFunctions: ['exec', 'eval', 'compile', 'open', 'input', '__import__'],
        timeoutMs: 30000,
        memoryLimitMB: 128
      }
    };
  }

  async secureExecute(submission) {
    const { language, code, userId } = submission;
    
    // Pre-execution security checks
    if (!this.isCodeSafe(code, language)) {
      throw new Error('Code contains potentially unsafe operations');
    }
    
    // Rate limiting per user
    const executionCount = await this.getRecentExecutionCount(userId);
    if (executionCount > 100) { // 100 executions per hour
      throw new Error('Execution rate limit exceeded');
    }
    
    // Create isolated container
    const container = await this.createSecureContainer(language);
    
    try {
      // Execute with strict timeouts and resource limits
      const result = await this.executeInContainer(container, code, submission.input);
      
      // Log execution for monitoring
      await this.logExecution(userId, language, result.success, result.executionTime);
      
      return result;
      
    } finally {
      // Always cleanup container
      await this.cleanupContainer(container);
    }
  }

  isCodeSafe(code, language) {
    const rules = this.securityRules[language];
    if (!rules) return false;
    
    // Check for blocked modules/imports
    if (language === 'javascript') {
      for (const module of rules.blockedModules) {
        if (code.includes(`require('${module}')`) || code.includes(`require("${module}")`)) {
          return false;
        }
      }
      
      for (const global of rules.blockedGlobals) {
        if (new RegExp(`\\b${global}\\b`).test(code)) {
          return false;
        }
      }
    } else if (language === 'python') {
      for (const module of rules.blockedModules) {
        if (code.includes(`import ${module}`) || code.includes(`from ${module}`)) {
          return false;
        }
      }
      
      for (const func of rules.blockedFunctions) {
        if (new RegExp(`\\b${func}\\s*\\(`).test(code)) {
          return false;
        }
      }
    }
    
    // Check for suspicious patterns
    const suspiciousPatterns = [
      /while\s*\(\s*true\s*\)/i, // Infinite loops
      /for\s*\(\s*;\s*;\s*\)/i,  // Infinite loops
      /setInterval|setTimeout/i,  // Timers
      /XMLHttpRequest|fetch/i,    // Network requests
      /document\.|window\./i,     // DOM access
    ];
    
    for (const pattern of suspiciousPatterns) {
      if (pattern.test(code)) {
        return false;
      }
    }
    
    return true;
  }

  async createSecureContainer(language) {
    const config = this.getLanguageConfig(language);
    
    return await this.docker.createContainer({
      Image: config.dockerImage,
      Memory: config.memoryLimitMB * 1024 * 1024,
      CpuShares: 256, // Limited CPU
      NetworkMode: 'none', // No network access
      ReadonlyRootfs: true, // Read-only filesystem
      User: 'nobody:nogroup', // Non-root user
      SecurityOpt: [
        'no-new-privileges:true',
        'seccomp:unconfined' // Custom seccomp profile in production
      ],
      CapDrop: ['ALL'], // Drop all capabilities
      WorkingDir: '/tmp',
      Cmd: ['/bin/sh'],
      Tty: false,
      OpenStdin: false,
      AttachStdout: true,
      AttachStderr: true,
      HostConfig: {
        Memory: config.memoryLimitMB * 1024 * 1024,
        CpuShares: 256,
        PidsLimit: 50, // Limit number of processes
        Ulimits: [
          { Name: 'nofile', Soft: 100, Hard: 100 }, // File descriptors
          { Name: 'nproc', Soft: 50, Hard: 50 }     // Process count
        ]
      }
    });
  }
}
```

### Data Protection

#### Encryption at Rest
```javascript
const crypto = require('crypto');

class EncryptionService {
  constructor() {
    this.algorithm = 'aes-256-gcm';
    this.keyBuffer = Buffer.from(process.env.ENCRYPTION_KEY, 'hex');
  }

  encrypt(text) {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipher(this.algorithm, this.keyBuffer, iv);
    
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    const authTag = cipher.getAuthTag();
    
    return {
      encrypted,
      iv: iv.toString('hex'),
      authTag: authTag.toString('hex')
    };
  }

  decrypt(encryptedData) {
    const { encrypted, iv, authTag } = encryptedData;
    
    const decipher = crypto.createDecipher(
      this.algorithm, 
      this.keyBuffer, 
      Buffer.from(iv, 'hex')
    );
    
    decipher.setAuthTag(Buffer.from(authTag, 'hex'));
    
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  }

  // For sensitive user data
  encryptUserData(userData) {
    const sensitiveFields = ['ssn', 'credit_card', 'bank_account'];
    const encrypted = { ...userData };
    
    for (const field of sensitiveFields) {
      if (userData[field]) {
        encrypted[field] = this.encrypt(userData[field]);
      }
    }
    
    return encrypted;
  }
}

// Database column encryption
const encryptionService = new EncryptionService();

// Sequelize hook for automatic encryption
User.addHook('beforeCreate', (user) => {
  if (user.personal_info) {
    user.personal_info = encryptionService.encryptUserData(user.personal_info);
  }
});

User.addHook('afterFind', (users) => {
  if (!users) return;
  
  const userArray = Array.isArray(users) ? users : [users];
  
  for (const user of userArray) {
    if (user.personal_info) {
      user.personal_info = encryptionService.decryptUserData(user.personal_info);
    }
  }
});
```

---

## Performance Optimization

### Database Optimization

#### Query Optimization
```sql
-- Indexes for common queries
CREATE INDEX CONCURRENTLY idx_users_email ON users(email);
CREATE INDEX CONCURRENTLY idx_users_username ON users(username);
CREATE INDEX CONCURRENTLY idx_users_total_xp ON users(total_xp DESC);
CREATE INDEX CONCURRENTLY idx_users_current_streak ON users(current_streak DESC);

CREATE INDEX CONCURRENTLY idx_user_projects_user_id ON user_projects(user_id);
CREATE INDEX CONCURRENTLY idx_user_projects_project_id ON user_projects(project_id);
CREATE INDEX CONCURRENTLY idx_user_projects_status ON user_projects(status);
CREATE INDEX CONCURRENTLY idx_user_projects_completed_at ON user_projects(completed_at);

CREATE INDEX CONCURRENTLY idx_xp_transactions_user_id ON xp_transactions(user_id);
CREATE INDEX CONCURRENTLY idx_xp_transactions_created_at ON xp_transactions(created_at);

CREATE INDEX CONCURRENTLY idx_code_submissions_user_id ON code_submissions(user_id);
CREATE INDEX CONCURRENTLY idx_code_submissions_created_at ON code_submissions(created_at);

-- Composite indexes for complex queries
CREATE INDEX CONCURRENTLY idx_user_projects_composite ON user_projects(user_id, status, completed_at);
CREATE INDEX CONCURRENTLY idx_projects_domain_difficulty ON projects(domain_id, difficulty_level, is_active);

-- Partial indexes for better performance
CREATE INDEX CONCURRENTLY idx_active_projects ON projects(created_at) WHERE is_active = true;
CREATE INDEX CONCURRENTLY idx_completed_user_projects ON user_projects(completed_at) WHERE status = 'completed';
```

#### Connection Pooling
```javascript
const { Pool } = require('pg');

// PostgreSQL connection pool
const pgPool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20, // Maximum connections
  min: 5,  // Minimum connections
  idle: 30000, // 30 seconds idle timeout
  acquire: 60000, // 60 seconds acquire timeout
  evict: 1000, // Check for idle connections every second
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Redis connection pool
const Redis = require('ioredis');

const redisCluster = new Redis.Cluster([
  {
    host: process.env.REDIS_HOST_1,
    port: 6379,
  },
  {
    host: process.env.REDIS_HOST_2,
    port: 6379,
  },
  {
    host: process.env.REDIS_HOST_3,
    port: 6379,
  }
], {
  redisOptions: {
    password: process.env.REDIS_PASSWORD,
    connectTimeout: 10000,
    lazyConnect: true,
    maxRetriesPerRequest: 3,
    retryDelayOnFailover: 100,
    enableOfflineQueue: false,
  },
  maxRedirections: 16,
  retryDelayOnFailover: 100,
  enableOfflineQueue: false,
  scaleReads: 'slave'
});

// Query optimization service
class QueryOptimizer {
  // Batch operations to reduce database round trips
  async batchUpdateUserProgress(updates) {
    const query = `
      UPDATE user_projects 
      SET progress_percentage = data.progress, 
          updated_at = CURRENT_TIMESTAMP
      FROM (VALUES ${updates.map((_, i) => `($${i*2+1}, $${i*2+2})`).join(', ')}) 
      AS data(id, progress)
      WHERE user_projects.id = data.id::uuid
    `;
    
    const values = updates.flatMap(update => [update.id, update.progress]);
    return await pgPool.query(query, values);
  }

  // Use CTEs for complex queries
  async getUserDashboardData(userId) {
    const query = `
      WITH user_stats AS (
        SELECT 
          u.total_xp,
          u.current_streak,
          u.longest_streak,
          COUNT(DISTINCT up.id) FILTER (WHERE up.status = 'completed') as completed_projects,
          COUNT(DISTINCT up.id) FILTER (WHERE up.status = 'in_progress') as active_projects
        FROM users u
        LEFT JOIN user_projects up ON u.id = up.user_id
        WHERE u.id = $1
        GROUP BY u.id, u.total_xp, u.current_streak, u.longest_streak
      ),
      recent_activity AS (
        SELECT 
          source_type,
          SUM(amount) as total_xp,
          COUNT(*) as transaction_count
        FROM xp_transactions 
        WHERE user_id = $1 
          AND created_at >= CURRENT_DATE - INTERVAL '7 days'
        GROUP BY source_type
      ),
      leaderboard_position AS (
        SELECT COUNT(*) + 1 as rank
        FROM users 
        WHERE total_xp > (SELECT total_xp FROM users WHERE id = $1)
      )
      SELECT 
        us.*,
        COALESCE(json_agg(ra.*) FILTER (WHERE ra.source_type IS NOT NULL), '[]') as recent_activity,
        lp.rank as leaderboard_rank
      FROM user_stats us
      CROSS JOIN leaderboard_position lp
      LEFT JOIN recent_activity ra ON true
      GROUP BY us.total_xp, us.current_streak, us.longest_streak, 
               us.completed_projects, us.active_projects, lp.rank
    `;
    
    const result = await pgPool.query(query, [userId]);
    return result.rows[0];
  }
}
```

### Caching Strategy

#### Multi-Level Caching
```javascript
class CacheService {
  constructor() {
    // L1 Cache: In-memory (fastest)
    this.memoryCache = new Map();
    this.memoryCacheMaxSize = 1000;
    this.memoryCacheTTL = 5 * 60 * 1000; // 5 minutes
    
    // L2 Cache: Redis (fast, shared)
    this.redisCache = redisCluster;
    
    // L3 Cache: Database query cache
    this.setupDatabaseCache();
  }

  async get(key, fetchFunction, options = {}) {
    const {
      ttl = 3600, // 1 hour default
      useMemoryCache = true,
      useRedisCache = true,
      forceRefresh = false
    } = options;

    if (forceRefresh) {
      return await this.refreshCache(key, fetchFunction, ttl);
    }

    // L1: Check memory cache
    if (useMemoryCache) {
      const memCached = this.getFromMemory(key);
      if (memCached) {
        return memCached;
      }
    }

    // L2: Check Redis cache
    if (useRedisCache) {
      const redisCached = await this.getFromRedis(key);
      if (redisCached) {
        // Store in memory cache for faster subsequent access
        if (useMemoryCache) {
          this.setInMemory(key, redisCached);
        }
        return redisCached;
      }
    }

    // L3: Fetch from source
    const freshData = await fetchFunction();
    
    // Store in all cache levels
    await this.setMultiLevel(key, freshData, ttl);
    
    return freshData;
  }

  async setMultiLevel(key, data, ttl) {
    // Store in memory cache
    this.setInMemory(key, data);
    
    // Store in Redis cache
    await this.setInRedis(key, data, ttl);
  }

  getFromMemory(key) {
    const cached = this.memoryCache.get(key);
    if (!cached) return null;
    
    if (Date.now() > cached.expiry) {
      this.memoryCache.delete(key);
      return null;
    }
    
    return cached.data;
  }

  setInMemory(key, data) {
    // Implement LRU eviction
    if (this.memoryCache.size >= this.memoryCacheMaxSize) {
      const firstKey = this.memoryCache.keys().next().value;
      this.memoryCache.delete(firstKey);
    }
    
    this.memoryCache.set(key, {
      data,
      expiry: Date.now() + this.memoryCacheTTL
    });
  }

  async getFromRedis(key) {
    try {
      const cached = await this.redisCache.get(key);
      return cached ? JSON.parse(cached) : null;
    } catch (error) {
      console.error('Redis cache error:', error);
      return null;
    }
  }

  async setInRedis(key, data, ttl) {
    try {
      await this.redisCache.setex(key, ttl, JSON.stringify(data));
    } catch (error) {
      console.error('Redis cache error:', error);
    }
  }

  // Cache invalidation patterns
  async invalidatePattern(pattern) {
    // Invalidate memory cache
    for (const key of this.memoryCache.keys()) {
      if (key.includes(pattern)) {
        this.memoryCache.delete(key);
      }
    }
    
    // Invalidate Redis cache
    const keys = await this.redisCache.keys(`*${pattern}*`);
    if (keys.length > 0) {
      await this.redisCache.del(...keys);
    }
  }

  // Specific cache methods for common operations
  async getUserData(userId) {
    return await this.get(
      `user:${userId}`,
      async () => {
        return await User.findByPk(userId, {
          include: [
            { model: UserProfile },
            { model: UserSkill }
          ]
        });
      },
      { ttl: 1800 } // 30 minutes
    );
  }

  async getLeaderboard(type = 'global') {
    return await this.get(
      `leaderboard:${type}`,
      async () => {
        return await this.leaderboardService.getLeaderboard(type);
      },
      { ttl: 300 } // 5 minutes
    );
  }

  async getProjectCatalog(domainId = null, difficulty = null) {
    const cacheKey = `projects:${domainId || 'all'}:${difficulty || 'all'}`;
    
    return await this.get(
      cacheKey,
      async () => {
        const where = { is_active: true };
        if (domainId) where.domain_id = domainId;
        if (difficulty) where.difficulty_level = difficulty;
        
        return await Project.findAll({
          where,
          include: [{ model: Domain }],
          order: [['created_at', 'DESC']]
        });
      },
      { ttl: 3600 } // 1 hour
    );
  }
}
```

### CDN and Asset Optimization

#### CloudFront Configuration
```javascript
// Asset optimization service
class AssetOptimizationService {
  constructor() {
    this.cloudfront = new AWS.CloudFront();
    this.s3 = new AWS.S3();
  }

  async optimizeAndUploadImage(imageBuffer, key) {
    const sharp = require('sharp');
    
    // Create multiple sizes for responsive images
    const sizes = [
      { width: 150, suffix: '-thumbnail' },
      { width: 400, suffix: '-small' },
      { width: 800, suffix: '-medium' },
      { width: 1200, suffix: '-large' }
    ];

    const optimizedImages = await Promise.all(
      sizes.map(async (size) => {
        const optimized = await sharp(imageBuffer)
          .resize(size.width, null, { withoutEnlargement: true })
          .jpeg({ quality: 85, progressive: true })
          .toBuffer();

        const uploadKey = `${key}${size.suffix}.jpg`;
        
        await this.s3.upload({
          Bucket: process.env.S3_BUCKET,
          Key: uploadKey,
          Body: optimized,
          ContentType: 'image/jpeg',
          CacheControl: 'public, max-age=31536000', // 1 year
          Metadata: {
            originalKey: key,
            width: size.width.toString()
          }
        }).promise();

        return {
          url: `${process.env.CDN_URL}/${uploadKey}`,
          width: size.width
        };
      })
    );

    return optimizedImages;
  }

  async invalidateCache(paths) {
    const params = {
      DistributionId: process.env.CLOUDFRONT_DISTRIBUTION_ID,
      InvalidationBatch: {
        CallerReference: Date.now().toString(),
        Paths: {
          Quantity: paths.length,
          Items: paths
        }
      }
    };

    return await this.cloudfront.createInvalidation(params).promise();
  }
}
```

---

## Implementation Roadmap

### Phase 1: Core Infrastructure (Weeks 1-4)
1. **Week 1**: Database setup, basic API structure, authentication
2. **Week 2**: User management, project catalog, basic progress tracking
3. **Week 3**: Code execution engine, basic gamification
4. **Week 4**: Real-time features, basic monitoring

### Phase 2: Enhanced Features (Weeks 5-8)
1. **Week 5**: Advanced gamification, leaderboards, badges
2. **Week 6**: Social features, discussions, mentorship system
3. **Week 7**: External integrations (GitHub, OAuth providers)
4. **Week 8**: Mobile API optimization, push notifications

### Phase 3: Professional Features (Weeks 9-12)
1. **Week 9**: Job opportunities, company partnerships
2. **Week 10**: Advanced analytics, reporting dashboard
3. **Week 11**: AI-powered features, code review
4. **Week 12**: Performance optimization, security hardening

### Phase 4: Scale & Polish (Weeks 13-16)
1. **Week 13**: Load testing, performance optimization
2. **Week 14**: Advanced monitoring, alerting, logging
3. **Week 15**: Documentation, API testing suite
4. **Week 16**: Final security audit, deployment optimization

### Development Guidelines

#### Code Quality Standards
- **Test Coverage**: Minimum 80% code coverage
- **Code Review**: All changes require peer review
- **Documentation**: Comprehensive API documentation with examples
- **Performance**: All API endpoints must respond within 200ms (95th percentile)
- **Security**: Security scanning on every deployment

#### Deployment Strategy
- **Blue-Green Deployment**: Zero-downtime deployments
- **Feature Flags**: Gradual feature rollouts
- **Database Migrations**: Backward-compatible migrations with rollback plans
- **Monitoring**: Comprehensive monitoring from day one

#### Team Structure Recommendations
- **Backend Team Lead**: 1 senior developer
- **Backend Developers**: 2-3 mid-level developers
- **DevOps Engineer**: 1 dedicated DevOps engineer
- **QA Engineer**: 1 testing specialist
- **Product Manager**: 1 PM for requirements and coordination

This backend architecture provides a solid foundation for building Psyduck as a scalable, secure, and feature-rich learning platform. The modular design allows for incremental development and easy maintenance as the platform grows.
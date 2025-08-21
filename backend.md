# 🦆 Psyduck Backend Architecture Documentation

## Overview

This document outlines the backend architecture for the Psyduck Learning Platform. Currently, the platform operates with a comprehensive mock API system that simulates full backend functionality while maintaining production-ready architecture patterns.

## 🏗️ Architecture Overview

### Current Implementation
- **Mock API Service**: Comprehensive simulation of all backend endpoints
- **Service Layer Separation**: Clean separation between API client and frontend services
- **Type-Safe Communication**: Fully typed API contracts and responses
- **Real-time Simulation**: Mock Socket.IO integration for real-time features

### Production Architecture (Future)
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   API Gateway   │    │   Microservices │
│   (React)       │────│   (Express)     │────│   (Node.js)     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │               ┌───────┴───────┐              │
         │               │  Load Balancer │              │
         │               └───────────────┘               │
         │                       │                       │
    ┌────┴────┐            ┌─────┴─────┐          ┌─────┴─────┐
    │ CDN     │            │ Database  │          │ Cache     │
    │ Assets  │            │ (Postgres)│          │ (Redis)   │
    └─────────┘            └───────────┘          └───────────┘
```

## 📁 Service Layer Structure

### API Client Layer (`/services/api/`)

#### `ApiClient.ts`
Central HTTP client responsible for:
- **Authentication Management**: JWT token handling and refresh
- **Request/Response Handling**: Standardized API communication
- **Error Handling**: Comprehensive error handling and recovery
- **Mock API Routing**: Seamless routing to mock services during development

```typescript
// Example usage
import { apiClient } from './services/api/ApiClient';

const response = await apiClient.get<User[]>('/users');
if (response.success) {
  console.log('Users:', response.data);
}
```

### Frontend Service Layer (`/services/frontend/`)

#### `ServiceManager.ts`
Coordinates all frontend services:
- **Service Initialization**: Manages service lifecycle
- **Authentication Propagation**: Distributes auth state to all services
- **Service Discovery**: Provides access to specific services
- **Data Coordination**: Manages cross-service data flow

#### Domain-Specific Services

**`AuthService.ts`**
- User authentication and session management
- Profile management and updates
- Permission and role checking
- Token refresh and validation

**`ProjectService.ts`**
- Project catalog and search
- Enrollment and progress tracking
- Project filtering and categorization
- Analytics and statistics

**`GamificationService.ts`**
- XP and level management
- Badge and achievement system
- Leaderboard functionality
- Streak tracking and bonuses

**`NotificationService.ts`**
- Real-time notification handling
- Notification categorization and filtering
- Read/unread state management
- Local notification creation

**`CodeService.ts`**
- Code execution and validation
- Execution history tracking
- Language support and templates
- Syntax validation and linting

## 🔗 API Endpoints

### Authentication Endpoints

```typescript
POST /auth/login
POST /auth/register
POST /auth/logout
POST /auth/refresh
GET  /auth/me
```

### User Management

```typescript
GET  /user/profile
PUT  /user/profile
GET  /user/stats
GET  /user/analytics
PUT  /user/preferences
```

### Project Management

```typescript
GET  /projects                 # Get available projects
GET  /projects/{id}           # Get specific project
GET  /projects/enrolled       # Get enrolled projects
POST /projects/enroll         # Enroll in project
PUT  /projects/{id}/progress  # Update progress
GET  /projects/search         # Search projects
```

### Gamification

```typescript
GET  /gamification/stats      # User stats
GET  /gamification/leaderboard # Global leaderboard
GET  /gamification/badges     # Available and earned badges
POST /gamification/checkin    # Daily check-in
GET  /gamification/achievements # User achievements
```

### Code Execution

```typescript
POST /code/execute           # Execute code
GET  /code/languages        # Supported languages
GET  /code/templates        # Code templates
POST /code/save             # Save code submission
```

### Notifications

```typescript
GET  /notifications          # Get notifications
POST /notifications/mark-read # Mark as read
POST /notifications/mark-all-read # Mark all as read
DELETE /notifications/{id}   # Delete notification
```

### Content Creation (Premium)

```typescript
POST /content/videos         # Submit video content
GET  /content/submissions    # Get user submissions
PUT  /content/{id}/status   # Update submission status
GET  /content/tags          # Available tags
```

## 📊 Data Models

### User Model
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

### Project Model
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

### Gamification Models
```typescript
interface UserStats {
  level: number;
  xp: number;
  xpToNextLevel: number;
  totalProjectsCompleted: number;
  currentStreak: number;
  longestStreak: number;
  badges: Badge[];
  achievements: Achievement[];
}

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

## 🔄 Real-Time Features

### Socket.IO Events

#### Client → Server
```typescript
'join_project'     # Join project room
'leave_project'    # Leave project room
'code_share'       # Share code with others
'typing_start'     # Start typing indicator
'typing_stop'      # Stop typing indicator
```

#### Server → Client
```typescript
'project_update'      # Project content updated
'user_achievement'    # New achievement earned
'leaderboard_update'  # Leaderboard position changed
'notification_new'    # New notification
'code_shared'         # Code shared by another user
'user_typing'         # Another user typing
'system_announcement' # System-wide announcements
```

## 🚀 Deployment Architecture

### Production Environment

```yaml
# Docker Compose Example
version: '3.8'
services:
  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    environment:
      - REACT_APP_API_URL=https://api.psyduck.dev/v1
  
  api-gateway:
    build: ./api-gateway
    ports:
      - "8080:8080"
    environment:
      - DATABASE_URL=postgres://...
      - REDIS_URL=redis://...
  
  auth-service:
    build: ./services/auth
    environment:
      - JWT_SECRET=${JWT_SECRET}
      - DATABASE_URL=${DATABASE_URL}
  
  project-service:
    build: ./services/projects
    environment:
      - DATABASE_URL=${DATABASE_URL}
      - CACHE_URL=${REDIS_URL}
  
  database:
    image: postgres:15
    environment:
      - POSTGRES_DB=psyduck
      - POSTGRES_USER=${DB_USER}
      - POSTGRES_PASSWORD=${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
  
  redis:
    image: redis:7-alpine
    volumes:
      - redis_data:/data
```

### Microservices

1. **Authentication Service**
   - User registration and login
   - JWT token management
   - Password reset and recovery
   - Social auth integration

2. **Project Service**
   - Project catalog management
   - Enrollment and progress tracking
   - Search and filtering
   - Content management

3. **Gamification Service**
   - XP and level calculations
   - Badge and achievement logic
   - Leaderboard management
   - Streak tracking

4. **Notification Service**
   - Real-time notifications
   - Email notifications
   - Push notifications
   - Notification preferences

5. **Code Execution Service**
   - Secure code execution
   - Language runtime management
   - Resource limits and timeouts
   - Result caching

6. **Analytics Service**
   - User behavior tracking
   - Learning analytics
   - Performance metrics
   - Reporting and insights

## 🔐 Security Implementation

### Authentication
- **JWT Tokens**: Secure token-based authentication
- **Refresh Tokens**: Long-lived tokens for session management
- **Token Rotation**: Automatic token rotation for security
- **Rate Limiting**: Prevent brute force attacks

### Authorization
- **Role-Based Access Control (RBAC)**: User roles and permissions
- **Resource-Level Permissions**: Fine-grained access control
- **Premium Features**: Subscription-based feature gating
- **API Key Management**: Secure API key generation and management

### Data Protection
- **Encryption at Rest**: Database encryption
- **Encryption in Transit**: HTTPS/WSS for all communications
- **Input Validation**: Comprehensive input sanitization
- **SQL Injection Prevention**: Parameterized queries
- **XSS Protection**: Content Security Policy implementation

## 📈 Monitoring and Observability

### Application Monitoring
- **Health Checks**: Service health monitoring
- **Performance Metrics**: Response times and throughput
- **Error Tracking**: Comprehensive error logging
- **User Analytics**: Learning behavior tracking

### Infrastructure Monitoring
- **Server Metrics**: CPU, memory, disk usage
- **Database Performance**: Query performance and optimization
- **Cache Hit Rates**: Redis performance monitoring
- **Network Monitoring**: Traffic analysis and optimization

## 🧪 Testing Strategy

### API Testing
- **Unit Tests**: Individual service testing
- **Integration Tests**: Service interaction testing
- **End-to-End Tests**: Complete user journey testing
- **Load Testing**: Performance and scalability testing

### Security Testing
- **Penetration Testing**: Security vulnerability assessment
- **Dependency Scanning**: Third-party library security
- **Code Analysis**: Static security analysis
- **Compliance Testing**: GDPR and privacy compliance

## 🔄 Migration Path

### Phase 1: Foundation (Current)
- ✅ Mock API implementation
- ✅ Service layer architecture
- ✅ Type-safe API contracts
- ✅ Real-time simulation

### Phase 2: Backend Services
- 🔲 Authentication service implementation
- 🔲 Database schema design
- 🔲 API gateway setup
- 🔲 Basic CRUD operations

### Phase 3: Advanced Features
- 🔲 Code execution service
- 🔲 Real-time Socket.IO implementation
- 🔲 Advanced gamification logic
- 🔲 Analytics and reporting

### Phase 4: Production Deployment
- 🔲 Containerization and orchestration
- 🔲 CI/CD pipeline setup
- 🔲 Monitoring and alerting
- 🔲 Performance optimization

## 📚 Additional Resources

- **API Documentation**: See `api.md` for detailed API reference
- **Frontend Documentation**: See `frontend.md` for frontend architecture
- **Deployment Guide**: See deployment documentation for production setup
- **Contributing**: See contribution guidelines for development practices

---

**Backend Architecture by the Psyduck Development Team** 🦆

*Building scalable and secure learning platforms*
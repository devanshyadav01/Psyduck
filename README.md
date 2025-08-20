# Psyduck - Project-Based Learning Platform

<div align="center">
  <img src="https://via.placeholder.com/150x150?text=🦆" alt="Psyduck Logo" width="150" height="150">
  
  **Learn to Code Through Real-World Projects**
  
  [![Build Status](https://img.shields.io/github/workflow/status/psyduck-platform/frontend/CI)](https://github.com/psyduck-platform/frontend/actions)
  [![Coverage](https://img.shields.io/codecov/c/github/psyduck-platform/frontend)](https://codecov.io/gh/psyduck-platform/frontend)
  [![License](https://img.shields.io/github/license/psyduck-platform/frontend)](LICENSE)
  [![Version](https://img.shields.io/github/package-json/v/psyduck-platform/frontend)](package.json)
</div>

## 🚀 Overview

Psyduck is a revolutionary project-based learning platform that combines the best features of GitHub (collaboration), LeetCode (skill assessment), and Upwork (real-world projects) with comprehensive gamification elements. Our platform teaches users through building real projects organized into domains and difficulty levels, while maintaining engagement through XP, badges, streaks, and social features.

### ✨ Key Features

- **📚 Project-Based Learning**: Structured learning paths across MERN Stack, Flutter/React Native, Data Analytics, and AI/ML domains
- **🎮 Gamification System**: Earn XP, unlock badges, maintain learning streaks, and compete on leaderboards
- **💻 Integrated IDE**: Professional code editor with Monaco Editor, syntax highlighting, and real-time execution
- **🤝 Social Learning**: Collaborate with peers, get mentorship, participate in discussions
- **🏢 Professional Opportunities**: Direct hiring opportunities with partnered companies for top performers
- **📊 Analytics Dashboard**: Comprehensive learning analytics and progress tracking
- **🌙 Modern UI/UX**: Dark/light mode support with responsive design and accessibility features

## 🛠️ Technology Stack

### Frontend
- **React 18+** with TypeScript for type-safe development
- **Tailwind CSS v4.0** with custom design tokens for styling
- **ShadCN/UI** for consistent, accessible component library
- **Monaco Editor** for professional IDE experience
- **Socket.IO** for real-time features
- **React Query** for efficient data fetching and caching
- **Vite** for fast development and optimized builds

### Backend Integration
- RESTful API integration with comprehensive error handling
- Real-time WebSocket connections for live updates
- Secure authentication with JWT tokens
- File upload and management capabilities

## 📦 Installation

### Prerequisites

- **Node.js** 18+ and npm/pnpm
- **Git** for version control
- Modern web browser with ES2020+ support

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/psyduck-platform/frontend.git
   cd psyduck-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Environment setup**
   ```bash
   cp .env.example .env.local
   ```
   
   Configure your environment variables:
   ```env
   REACT_APP_API_URL=http://localhost:8000/api
   REACT_APP_WS_URL=ws://localhost:8000
   REACT_APP_ENVIRONMENT=development
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000` to see the application running.

### Docker Setup (Alternative)

```bash
# Build and run with Docker
docker build -t psyduck-frontend .
docker run -p 3000:80 psyduck-frontend
```

## 🏗️ Project Structure

```
src/
├── components/           # React components
│   ├── ui/              # Base UI components (ShadCN)
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   └── ...
│   ├── features/        # Feature-specific components
│   │   ├── Dashboard.tsx
│   │   ├── IDE.tsx
│   │   ├── ProjectCatalog.tsx
│   │   └── ...
│   ├── layout/          # Layout components
│   │   ├── Header.tsx
│   │   ├── Sidebar.tsx
│   │   └── ...
│   └── shared/          # Shared/common components
│       ├── LoadingScreen.tsx
│       ├── ErrorBoundary.tsx
│       └── ...
├── hooks/               # Custom React hooks
│   ├── useAuth.ts
│   ├── useRouter.ts
│   └── ...
├── contexts/            # React Context providers
│   ├── AuthContext.tsx
│   ├── UIContext.tsx
│   └── ...
├── services/            # API services and utilities
│   ├── apiService.ts
│   ├── authService.ts
│   └── ...
├── types/               # TypeScript type definitions
│   ├── api.ts
│   ├── user.ts
│   └── ...
├── utils/               # Utility functions
│   ├── navigation.ts
│   ├── formatting.ts
│   └── ...
├── config/              # Configuration files
│   ├── routes.ts
│   └── constants.ts
├── styles/              # CSS and styling files
│   └── globals.css
└── assets/              # Static assets
    ├── images/
    └── icons/
```

## 🎯 Core Components

### Authentication System
- **Login/Register**: Secure authentication with form validation
- **Password Reset**: Email-based password recovery
- **Social Login**: GitHub, Google, LinkedIn integration
- **Route Protection**: Automatic redirection for unauthorized access

### Dashboard
- **Progress Overview**: Visual progress tracking with charts
- **XP & Level Display**: Real-time gamification metrics
- **Active Projects**: Quick access to ongoing work
- **Achievement Gallery**: Badge collection and milestones

### IDE (Integrated Development Environment)
- **Monaco Editor**: VS Code-like editing experience
- **Multi-language Support**: JavaScript, Python, Java, C++, Go
- **Real-time Execution**: Secure code execution with output display
- **Syntax Highlighting**: Language-specific code formatting
- **Auto-completion**: IntelliSense-style code suggestions

### Project Catalog
- **Filterable Grid**: Search and filter projects by domain/difficulty
- **Detailed Views**: Comprehensive project information
- **Enrollment System**: One-click project enrollment
- **Progress Tracking**: Visual progress indicators

## 🎮 Gamification Features

### XP (Experience Points) System
- **Project Completion**: Earn XP based on project difficulty
- **Daily Activities**: Bonus XP for consistent engagement
- **Quality Bonuses**: Extra XP for high-quality code submissions
- **Social Participation**: XP rewards for helping peers

### Achievement System
- **Progress Badges**: Milestone-based achievements
- **Skill Badges**: Domain expertise recognition
- **Social Badges**: Community contribution rewards
- **Special Badges**: Limited-time and event-based achievements

### Leaderboards
- **Global Rankings**: Platform-wide XP leaderboards
- **Domain-Specific**: Rankings within learning domains
- **Weekly/Monthly**: Time-based competition periods
- **Streak Tracking**: Consecutive learning day tracking

## 🔧 Development

### Available Scripts

```bash
# Development
npm run dev              # Start development server
npm run type-check       # TypeScript type checking

# Testing
npm run test            # Run unit tests
npm run test:watch      # Run tests in watch mode
npm run test:coverage   # Generate coverage report
npm run test:e2e        # Run end-to-end tests

# Building
npm run build           # Production build
npm run preview         # Preview production build
npm run analyze         # Bundle size analysis

# Code Quality
npm run lint            # ESLint code linting
npm run lint:fix        # Fix linting errors
npm run format          # Prettier code formatting
```

### Code Style Guidelines

- **TypeScript**: Strict mode enabled with comprehensive type checking
- **ESLint**: Extended from React and TypeScript recommended configs
- **Prettier**: Consistent code formatting across the project
- **Husky**: Pre-commit hooks for quality assurance

### Component Development

```typescript
// Example component structure
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';

interface ExampleComponentProps {
  title: string;
  onAction: () => void;
}

export const ExampleComponent: React.FC<ExampleComponentProps> = ({
  title,
  onAction
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <Button onClick={onAction}>
          Take Action
        </Button>
      </CardContent>
    </Card>
  );
};
```

## 🧪 Testing

### Testing Strategy
- **Unit Tests**: Component-level testing with Vitest and React Testing Library
- **Integration Tests**: API integration and user flow testing
- **E2E Tests**: Full user journey testing with Playwright
- **Visual Regression**: UI component screenshot comparisons

### Running Tests

```bash
# Unit tests
npm run test

# E2E tests (requires backend running)
npm run test:e2e

# Coverage report
npm run test:coverage
```

### Writing Tests

```typescript
// Example test file
import { render, screen, fireEvent } from '@testing-library/react';
import { ExampleComponent } from './ExampleComponent';

describe('ExampleComponent', () => {
  test('renders title correctly', () => {
    render(
      <ExampleComponent 
        title="Test Title" 
        onAction={() => {}} 
      />
    );
    
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });

  test('calls onAction when button clicked', () => {
    const mockAction = jest.fn();
    render(
      <ExampleComponent 
        title="Test" 
        onAction={mockAction} 
      />
    );
    
    fireEvent.click(screen.getByText('Take Action'));
    expect(mockAction).toHaveBeenCalled();
  });
});
```

## 🌐 API Integration

### Service Layer Architecture

```typescript
// API service example
class ApiService {
  private baseURL = process.env.REACT_APP_API_URL;
  
  async get<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      headers: {
        'Authorization': `Bearer ${this.getToken()}`,
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    
    return response.json();
  }
  
  // ... other methods
}
```

### Environment Configuration

```bash
# .env.local
REACT_APP_API_URL=http://localhost:8000/api
REACT_APP_WS_URL=ws://localhost:8000
REACT_APP_ENVIRONMENT=development
REACT_APP_ENABLE_ANALYTICS=false
REACT_APP_SENTRY_DSN=your_sentry_dsn_here
```

## 🚀 Deployment

### Production Build

```bash
npm run build
```

This creates a `dist` folder with optimized production files.

### Deployment Options

#### 1. Static Hosting (Netlify, Vercel)
```bash
# Build and deploy
npm run build
# Upload dist folder to your hosting provider
```

#### 2. AWS S3 + CloudFront
```bash
# Build
npm run build

# Deploy to S3
aws s3 sync dist/ s3://your-bucket-name --delete
aws cloudfront create-invalidation --distribution-id YOUR_ID --paths "/*"
```

#### 3. Docker
```bash
# Build Docker image
docker build -t psyduck-frontend .

# Run container
docker run -p 80:80 psyduck-frontend
```

### Environment Variables for Production

```bash
REACT_APP_API_URL=https://api.psyduck.dev
REACT_APP_WS_URL=wss://api.psyduck.dev
REACT_APP_ENVIRONMENT=production
REACT_APP_ENABLE_ANALYTICS=true
REACT_APP_SENTRY_DSN=your_production_sentry_dsn
```

## 🤝 Contributing

We welcome contributions from the community! Please read our contributing guidelines before submitting PRs.

### Development Setup

1. **Fork the repository** on GitHub
2. **Clone your fork** locally
3. **Create a feature branch** from `main`
4. **Make your changes** with proper tests
5. **Submit a pull request** with a clear description

### Contribution Guidelines

- Follow the existing code style and conventions
- Write comprehensive tests for new features
- Update documentation for API changes
- Ensure all tests pass before submitting
- Use descriptive commit messages

### Code Review Process

1. Automated checks (tests, linting, type checking)
2. Peer review by team members
3. Manual testing of UI changes
4. Approval and merge to main branch

## 📊 Performance & Monitoring

### Performance Optimization
- **Code Splitting**: Route-based lazy loading
- **Tree Shaking**: Unused code elimination
- **Image Optimization**: Responsive images with lazy loading
- **Bundle Analysis**: Regular bundle size monitoring

### Monitoring Integration
- **Error Tracking**: Sentry integration for error monitoring
- **Analytics**: User behavior tracking (optional)
- **Performance Metrics**: Web Vitals monitoring
- **Real-time Monitoring**: Application health checks

## 🐛 Troubleshooting

### Common Issues

#### Development Server Won't Start
```bash
# Clear node modules and reinstall
rm -rf node_modules package-lock.json
npm install
npm run dev
```

#### TypeScript Errors
```bash
# Run type checking
npm run type-check

# Clear TypeScript cache
rm -rf node_modules/.cache
```

#### Build Failures
```bash
# Check for linting errors
npm run lint

# Verify all tests pass
npm run test
```

### Getting Help

- **Documentation**: Check our [Wiki](https://github.com/psyduck-platform/frontend/wiki)
- **Issues**: Report bugs on [GitHub Issues](https://github.com/psyduck-platform/frontend/issues)
- **Discussions**: Join our [Discord Community](https://discord.gg/psyduck)
- **Email**: Contact us at support@psyduck.dev

## 📈 Roadmap

### Short-term Goals (Next 3 months)
- [ ] Mobile app development (React Native)
- [ ] Advanced code analysis with AI
- [ ] Peer-to-peer code review system
- [ ] Enhanced mentorship features

### Medium-term Goals (6 months)
- [ ] Live coding sessions and webinars
- [ ] Company integration API for custom projects
- [ ] Advanced analytics dashboard for educators
- [ ] Multi-language support (i18n)

### Long-term Vision (1 year+)
- [ ] VR/AR coding environments
- [ ] Blockchain-based achievement verification
- [ ] Global coding competition platform
- [ ] Enterprise learning management features

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **React Team** for the amazing framework
- **Tailwind CSS** for the utility-first CSS framework
- **ShadCN** for the beautiful component library
- **Microsoft** for Monaco Editor
- **Community Contributors** who make this project possible

---

<div align="center">
  <p>Built with ❤️ by the Psyduck Team</p>
  <p>
    <a href="https://psyduck.dev">Website</a> •
    <a href="https://docs.psyduck.dev">Documentation</a> •
    <a href="https://discord.gg/psyduck">Discord</a> •
    <a href="https://twitter.com/psyduck_dev">Twitter</a>
  </p>
</div>
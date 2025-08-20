# Psyduck Development Guidelines

## 🎯 Project Overview
Psyduck is a gamified project-based learning platform that combines GitHub + LeetCode + Upwork with comprehensive gamification elements.

## 🎨 Design System Guidelines

### Colors & Branding
- **Primary Color**: `#E67514` (Psyduck Orange) - Use `bg-psyduck-primary` or `text-psyduck-primary`
- **Dark Background**: `#212121` - Use `bg-psyduck-dark`
- **Success Color**: `#06923E` - Use `bg-psyduck-success` or `text-psyduck-success`
- **Soft Backgrounds**: `#D3ECCD` - Use `bg-psyduck-soft`

### Typography
- Use the default typography system defined in globals.css
- Do NOT override font sizes, weights, or line-heights unless specifically requested
- Button text should use medium font weight (already applied by default)

### Layout & Spacing
- Use flexbox and grid by default, avoid absolute positioning unless necessary
- Maintain consistent spacing using Tailwind's spacing scale
- Ensure responsive design for mobile and desktop

## 🧩 Component Guidelines

### UI Components
- Use ShadCN components from `./components/ui/` directory
- Import format: `import { Button } from './components/ui/button'`
- Do NOT create custom versions of existing ShadCN components

### Custom Components
- Place reusable components in `/components` directory
- Use TypeScript interfaces for all props
- Include proper error handling and loading states
- Follow the naming convention: PascalCase for component names

### Gamification Elements
- Always include XP values, badges, streaks where appropriate
- Use Psyduck primary color for gamification elements
- Include progress indicators and achievement feedback

## 🔧 Development Standards

### Code Quality
- Use TypeScript for all components and utilities
- Include proper type definitions for props and state
- Handle loading states and errors gracefully
- Use React Query for data fetching and caching

### File Organization
- Keep components focused and single-purpose
- Extract constants, helpers, and utilities to separate files
- Use consistent import ordering: React, libraries, local imports
- File naming: kebab-case for utilities, PascalCase for components

### Error Handling
- Always include try-catch blocks for async operations
- Provide user-friendly error messages
- Use toast notifications for user feedback
- Log errors to console in development mode

## 📱 User Experience Guidelines

### Loading States
- Show skeleton loading for content areas
- Use spinners for button actions
- Display progress indicators for long operations
- Provide feedback for user actions

### Navigation
- Use consistent navigation patterns
- Highlight active navigation items
- Include breadcrumbs for deep navigation
- Ensure keyboard accessibility

### Forms
- Include proper form validation
- Show clear error states
- Use consistent button styles
- Provide success feedback

## 🎮 Gamification Patterns

### XP System
- Award XP for meaningful actions (project completion, daily login)
- Show XP gains with animated feedback
- Display current level and progress to next level

### Badges & Achievements
- Use consistent badge styling with Psyduck colors
- Show badge rarity with visual indicators
- Include badge descriptions and earning criteria

### Progress Tracking
- Show visual progress bars for projects
- Include time estimates and completion percentages
- Highlight milestones and achievements

## 🛠️ Technical Guidelines

### Performance
- Use React.memo for expensive components
- Implement lazy loading for routes and heavy components
- Optimize images and assets
- Monitor bundle size and performance metrics

### Accessibility
- Include proper ARIA labels and roles
- Ensure keyboard navigation support
- Use semantic HTML elements
- Test with screen readers

### Testing
- Write unit tests for utility functions
- Include integration tests for user flows
- Test error states and edge cases
- Ensure responsive design works across devices

## 🚀 Deployment Guidelines

### Environment Configuration
- Use environment variables for API endpoints
- Configure different settings for dev/staging/production
- Include proper error monitoring (Sentry)
- Set up analytics tracking

### Build Optimization
- Enable tree shaking for smaller bundles
- Use proper caching strategies
- Optimize images and static assets
- Configure CDN for static files

## 📋 Code Review Checklist

Before submitting code:
- [ ] TypeScript types are properly defined
- [ ] Components follow naming conventions
- [ ] Error handling is implemented
- [ ] Loading states are included
- [ ] Responsive design is verified
- [ ] Accessibility features are included
- [ ] Performance impact is considered
- [ ] Tests are written and passing
- [ ] Code is properly documented
# Psyduck Frontend Libraries Documentation

This document provides a comprehensive overview of all libraries used in the Psyduck learning platform frontend, organized by category with detailed explanations of their purpose and functionality.

## Table of Contents

1. [Core Framework](#core-framework)
2. [UI Component System](#ui-component-system)
3. [Styling & CSS](#styling--css)
4. [State Management & Data Fetching](#state-management--data-fetching)
5. [Code Editor & Development Tools](#code-editor--development-tools)
6. [Real-time Communication](#real-time-communication)
7. [Forms & Validation](#forms--validation)
8. [Charts & Data Visualization](#charts--data-visualization)
9. [Icons & Media](#icons--media)
10. [Utilities & Helpers](#utilities--helpers)
11. [Development & Build Tools](#development--build-tools)
12. [Testing Framework](#testing-framework)
13. [Code Quality & Linting](#code-quality--linting)

---

## Core Framework

### React & React DOM
```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0"
}
```

**Purpose**: Core React framework for building the user interface.

**Key Features**:
- **React 18**: Latest version with concurrent features, automatic batching, and improved performance
- **Hooks Support**: Modern React patterns with useState, useEffect, useContext, etc.
- **Concurrent Rendering**: Better user experience with non-blocking UI updates
- **Server Components**: Future-ready architecture for server-side rendering

**Usage in Psyduck**:
- Foundation for all UI components (Dashboard, IDE, Project Catalog)
- State management for user authentication and application data
- Real-time UI updates for progress tracking and notifications

---

## UI Component System

### Radix UI Primitives
```json
{
  "@radix-ui/react-accordion": "^1.1.2",
  "@radix-ui/react-alert-dialog": "^1.0.5",
  "@radix-ui/react-aspect-ratio": "^1.0.3",
  "@radix-ui/react-avatar": "^1.0.4",
  "@radix-ui/react-checkbox": "^1.0.4",
  "@radix-ui/react-collapsible": "^1.0.3",
  "@radix-ui/react-context-menu": "^2.1.5",
  "@radix-ui/react-dialog": "^1.0.5",
  "@radix-ui/react-dropdown-menu": "^2.0.6",
  "@radix-ui/react-hover-card": "^1.0.7",
  "@radix-ui/react-label": "^2.0.2",
  "@radix-ui/react-menubar": "^1.0.4",
  "@radix-ui/react-navigation-menu": "^1.1.4",
  "@radix-ui/react-popover": "^1.0.7",
  "@radix-ui/react-progress": "^1.0.3",
  "@radix-ui/react-radio-group": "^1.1.3",
  "@radix-ui/react-scroll-area": "^1.0.5",
  "@radix-ui/react-select": "^2.0.0",
  "@radix-ui/react-separator": "^1.0.3",
  "@radix-ui/react-slider": "^1.1.2",
  "@radix-ui/react-switch": "^1.0.3",
  "@radix-ui/react-tabs": "^1.0.4",
  "@radix-ui/react-toast": "^1.1.5",
  "@radix-ui/react-toggle": "^1.0.3",
  "@radix-ui/react-toggle-group": "^1.0.4",
  "@radix-ui/react-tooltip": "^1.0.7"
}
```

**Purpose**: Unstyled, accessible UI primitives that form the foundation of ShadCN/UI components.

**Key Features**:
- **Accessibility First**: WCAG 2.1 AA compliant components with proper ARIA attributes
- **Keyboard Navigation**: Full keyboard support with logical focus management
- **Unstyled**: Provides behavior without styling, allowing custom design implementation
- **Composable**: Flexible API that allows building complex UI patterns

**Usage in Psyduck**:
- **Dialog & Modals**: Project enrollment confirmations, settings panels
- **Dropdown Menus**: User profile menus, project filters, language selectors
- **Progress Bars**: XP progress, project completion tracking, skill level indicators
- **Tooltips**: Help text for gamification elements, button explanations
- **Tabs**: IDE panels, profile sections, leaderboard categories
- **Accordion**: FAQ sections, project milestone lists

### Additional UI Libraries

#### Vaul (Drawer)
```json
{ "vaul": "^0.8.0" }
```
**Purpose**: Mobile-friendly drawer component for slide-in panels.
**Usage**: Mobile navigation menus, chat panels, notification drawers.

#### CMDK (Command Menu)
```json
{ "cmdk": "^0.2.0" }
```
**Purpose**: Fast, accessible command palette component.
**Usage**: Global search, quick navigation, project switching.

#### Input OTP
```json
{ "input-otp": "^1.2.4" }
```
**Purpose**: One-time password input component with auto-focus and paste support.
**Usage**: Two-factor authentication during login, email verification.

---

## Styling & CSS

### Tailwind CSS Ecosystem
```json
{
  "tailwindcss": "^4.0.0-alpha.4",
  "@tailwindcss/typography": "^0.5.10",
  "autoprefixer": "^10.4.16",
  "postcss": "^8.4.32"
}
```

**Purpose**: Utility-first CSS framework for rapid UI development.

**Key Features**:
- **Version 4.0**: Latest alpha with improved performance and new features
- **Custom Design Tokens**: Psyduck brand colors (#E67514, #212121, #06923E, #D3ECCD)
- **Dark Mode Support**: Automatic theme switching based on user preference
- **Responsive Design**: Mobile-first approach with breakpoint utilities

**Usage in Psyduck**:
- Consistent spacing and layout across all components
- Responsive grid systems for project catalogs and dashboards
- Custom utilities for brand colors and gamification elements
- Typography plugin for rich text content in projects and discussions

### CSS Utility Libraries
```json
{
  "class-variance-authority": "^0.7.0",
  "clsx": "^2.0.0",
  "tailwind-merge": "^2.2.0"
}
```

**Purpose**: Libraries for dynamic CSS class composition and variant management.

**Key Features**:
- **CVA**: Type-safe variant creation for component styling
- **clsx**: Conditional class name utility
- **tailwind-merge**: Intelligent Tailwind class merging without conflicts

**Usage in Psyduck**:
- Button variants (primary, secondary, success) for different actions
- Card variants for different project types and states
- Badge variants for difficulty levels and achievement types

### Theme Management
```json
{ "next-themes": "^0.2.1" }
```
**Purpose**: Theme switching library with system preference support.
**Usage**: Dark/light mode toggle, theme persistence, system preference detection.

---

## State Management & Data Fetching

### TanStack Query (React Query)
```json
{
  "@tanstack/react-query": "^5.17.0",
  "@tanstack/react-query-devtools": "^5.17.0"
}
```

**Purpose**: Powerful data synchronization library for React applications.

**Key Features**:
- **Caching**: Intelligent caching with background updates
- **Synchronization**: Automatic refetching and window focus refetching  
- **Optimistic Updates**: Immediate UI updates before server confirmation
- **Error Handling**: Comprehensive error boundaries and retry logic
- **DevTools**: Development tools for debugging queries and cache

**Usage in Psyduck**:
- **User Data**: Profile information, progress tracking, XP/badge updates
- **Project Catalog**: Project listings with filtering and search
- **Leaderboards**: Real-time ranking updates with caching
- **Code Submissions**: Execution results and history tracking
- **Real-time Sync**: Background updates for collaborative features

---

## Code Editor & Development Tools

### Monaco Editor
```json
{
  "monaco-editor": "^0.45.0",
  "@monaco-editor/react": "^4.6.0"
}
```

**Purpose**: The code editor that powers VS Code, integrated into the browser.

**Key Features**:
- **Multi-language Support**: JavaScript, Python, Java, C++, Go with syntax highlighting
- **IntelliSense**: Auto-completion, error detection, and hover information
- **Themes**: Dark/light theme support matching application design
- **Advanced Features**: Find/replace, multi-cursor editing, code folding

**Usage in Psyduck**:
- **IDE Component**: Primary code editing interface for project development
- **Real-time Collaboration**: Live code sharing during mentorship sessions
- **Code Templates**: Pre-populated starter code for different project types
- **Syntax Validation**: Real-time error detection and suggestions

---

## Real-time Communication

### Socket.IO Client
```json
{ "socket.io-client": "^4.7.4" }
```

**Purpose**: Real-time bidirectional event-based communication library.

**Key Features**:
- **WebSocket Protocol**: Efficient real-time communication with fallbacks
- **Automatic Reconnection**: Handles connection drops gracefully
- **Room Management**: Join/leave project-specific communication channels
- **Event Handling**: Type-safe event emission and subscription

**Usage in Psyduck**:
- **Progress Updates**: Live XP, badge, and completion notifications
- **Chat System**: Real-time messaging in project discussions
- **Code Collaboration**: Live code sharing and cursor synchronization
- **Mentorship**: Real-time video call coordination and screen sharing
- **Leaderboard Updates**: Live ranking changes and competition updates

---

## Forms & Validation

### React Hook Form & Zod
```json
{
  "react-hook-form": "^7.48.2",
  "@hookform/resolvers": "^3.3.2",
  "zod": "^3.22.4"
}
```

**Purpose**: Performant form library with TypeScript-first schema validation.

**Key Features**:
- **Performance**: Minimal re-renders with uncontrolled components
- **Validation**: Integration with Zod for runtime type checking
- **TypeScript**: Full type safety for form data and validation errors
- **Developer Experience**: Simple API with excellent error handling

**Usage in Psyduck**:
- **Authentication Forms**: Login, registration, password reset with validation
- **Profile Management**: User information updates with real-time validation
- **Project Submission**: Code submission forms with file upload support
- **Settings Forms**: User preferences and notification settings

---

## Charts & Data Visualization

### Recharts
```json
{ "recharts": "^2.9.3" }
```

**Purpose**: Declarative charting library built with React components.

**Key Features**:
- **React Native**: Built specifically for React with component-based API
- **Responsive**: Automatic responsive behavior with container queries
- **Animation**: Smooth transitions and hover effects
- **Customization**: Extensive styling options and custom components

**Usage in Psyduck**:
- **Progress Charts**: XP growth over time, skill progression graphs
- **Analytics Dashboard**: Learning statistics, time spent analysis
- **Leaderboard Visualization**: Ranking changes, competition progress
- **Project Metrics**: Completion rates, difficulty distribution

---

## Icons & Media

### Lucide React
```json
{ "lucide-react": "^0.303.0" }
```

**Purpose**: Beautiful, customizable SVG icons designed for modern interfaces.

**Key Features**:
- **Consistent Design**: Uniform stroke width and design language
- **Lightweight**: Tree-shakeable icons with minimal bundle impact
- **Customizable**: Size, color, and stroke width customization
- **Accessibility**: Proper ARIA labels and screen reader support

**Usage in Psyduck**:
- **Navigation Icons**: Menu, home, profile, settings icons
- **Action Icons**: Play, pause, save, upload, download icons
- **Status Icons**: Success, error, warning, info indicators
- **Gamification**: Trophy, star, flame (streak), medal icons
- **Feature Icons**: Code, book, chat, video call icons

---

## Utilities & Helpers

### Date Handling
```json
{
  "date-fns": "^3.0.6",
  "react-day-picker": "^8.10.0"
}
```

**Purpose**: Modern JavaScript date utility library with calendar picker.

**Key Features**:
- **Modular**: Import only the functions you need
- **TypeScript**: Full type safety for date operations
- **Internationalization**: Multi-language date formatting support
- **Calendar Component**: Accessible date picker with range selection

**Usage in Psyduck**:
- **Streak Tracking**: Date calculations for learning streaks
- **Project Deadlines**: Due date management and reminders
- **Progress Timeline**: Activity history and milestone dates
- **Schedule Management**: Mentorship session scheduling

### Virtual Scrolling
```json
{
  "react-window": "^1.8.8",
  "react-window-infinite-loader": "^1.0.9"
}
```

**Purpose**: Efficient rendering of large lists and tables.

**Key Features**:
- **Performance**: Only renders visible items for optimal performance
- **Infinite Scrolling**: Load more data as user scrolls
- **Fixed/Variable Heights**: Support for different item sizes
- **Accessibility**: Keyboard navigation and screen reader support

**Usage in Psyduck**:
- **Leaderboards**: Efficiently render thousands of users
- **Project History**: Large lists of code submissions
- **Discussion Threads**: Long conversation lists
- **Search Results**: Large result sets with pagination

### Resizable Panels
```json
{ "react-resizable-panels": "^1.0.9" }
```
**Purpose**: Resizable panel layouts for complex interfaces.
**Usage**: IDE layout with adjustable code/output panels, dashboard widgets.

### Carousel Component
```json
{ "embla-carousel-react": "^8.0.0" }
```
**Purpose**: Touch-friendly carousel component with advanced features.
**Usage**: Project showcases, onboarding flows, image galleries.

---

## Development & Build Tools

### Vite Build System
```json
{
  "vite": "^5.0.8",
  "@vitejs/plugin-react": "^4.2.1",
  "vite-bundle-analyzer": "^0.7.0"
}
```

**Purpose**: Fast build tool and development server for modern web projects.

**Key Features**:
- **Hot Module Replacement**: Instant updates during development
- **ES Modules**: Native ES module support for faster builds
- **Bundle Optimization**: Automatic code splitting and tree shaking
- **Plugin System**: Extensible architecture with React support

**Usage in Psyduck**:
- Development server with instant Monaco Editor loading
- Production builds optimized for performance
- Bundle analysis for identifying optimization opportunities

### TypeScript
```json
{
  "typescript": "^5.2.2",
  "@types/react": "^18.2.43",
  "@types/react-dom": "^18.2.17",
  "@types/node": "^20.10.5",
  "@types/react-window": "^1.8.8"
}
```

**Purpose**: Static type checking for JavaScript with advanced type features.

**Key Features**:
- **Type Safety**: Catch errors at compile time
- **IntelliSense**: Better IDE support with auto-completion
- **Refactoring**: Safe code refactoring with type checking
- **Latest Features**: ES2022+ features with backward compatibility

**Usage in Psyduck**:
- Type-safe API calls and data structures
- Component prop validation and documentation
- Enhanced developer experience with better error messages

---

## Testing Framework

### Vitest & Testing Libraries
```json
{
  "vitest": "^1.1.0",
  "@vitest/coverage-v8": "^1.1.0",
  "@testing-library/react": "^14.1.2",
  "@testing-library/jest-dom": "^6.1.5",
  "@testing-library/user-event": "^14.5.1",
  "jsdom": "^23.0.1"
}
```

**Purpose**: Fast unit testing framework with React component testing utilities.

**Key Features**:
- **Speed**: Vite-powered test runner for fast execution
- **Coverage**: Built-in code coverage reporting
- **React Testing**: Component testing with user interaction simulation
- **DOM Environment**: Browser-like testing environment with jsdom

**Usage in Psyduck**:
- Component unit tests for UI behavior
- Hook testing for custom React hooks
- Integration tests for user workflows
- Code coverage monitoring for quality assurance

### E2E Testing
```json
{ "@playwright/test": "^1.40.1" }
```

**Purpose**: End-to-end testing framework for full application workflows.

**Key Features**:
- **Cross-browser**: Testing in Chrome, Firefox, Safari, and Edge
- **Real User Simulation**: Mouse, keyboard, and touch interactions
- **Network Interception**: Mock API responses for reliable testing
- **Visual Testing**: Screenshot comparison for UI regression detection

**Usage in Psyduck**:
- Complete user journey testing (registration → project completion)
- IDE functionality testing including code execution
- Real-time feature testing with WebSocket connections
- Mobile responsiveness testing across devices

---

## Code Quality & Linting

### ESLint Configuration
```json
{
  "eslint": "^8.55.0",
  "@typescript-eslint/eslint-plugin": "^6.14.0",
  "@typescript-eslint/parser": "^6.14.0",
  "eslint-plugin-react": "^7.33.2",
  "eslint-plugin-react-hooks": "^4.6.0",
  "eslint-plugin-react-refresh": "^0.4.5",
  "eslint-plugin-jsx-a11y": "^6.8.0"
}
```

**Purpose**: Static code analysis for identifying and fixing code quality issues.

**Key Features**:
- **TypeScript Support**: Advanced linting for TypeScript code
- **React Rules**: React-specific best practices and hooks rules
- **Accessibility**: JSX accessibility linting for inclusive design
- **Auto-fixing**: Automatic code fixes for common issues

**Usage in Psyduck**:
- Enforce consistent code style across team
- Catch potential bugs and performance issues
- Ensure accessibility compliance in components
- Maintain code quality standards through CI/CD

### Prettier & Formatting
```json
{
  "prettier": "^3.1.1",
  "prettier-plugin-tailwindcss": "^0.5.9"
}
```

**Purpose**: Opinionated code formatter for consistent style.

**Key Features**:
- **Automatic Formatting**: Consistent code style without configuration
- **Tailwind Integration**: Automatic class ordering for Tailwind CSS
- **Editor Integration**: Format on save in most editors
- **Team Consistency**: Eliminate code style debates

**Usage in Psyduck**:
- Consistent formatting across all source files
- Proper Tailwind class ordering for maintainability
- Automatic formatting in CI/CD pipeline

### Git Hooks & Commit Standards
```json
{
  "husky": "^8.0.3",
  "lint-staged": "^15.2.0",
  "@commitlint/cli": "^18.4.3",
  "@commitlint/config-conventional": "^18.4.3"
}
```

**Purpose**: Automated code quality checks before commits.

**Key Features**:
- **Pre-commit Hooks**: Run linting and tests before commits
- **Staged Files**: Only check modified files for performance
- **Commit Standards**: Enforce conventional commit message format
- **Quality Gates**: Prevent low-quality code from entering repository

**Usage in Psyduck**:
- Ensure all commits meet quality standards
- Prevent broken code from entering main branch
- Standardize commit messages for better project history
- Automate code formatting and linting workflow

---

## Notifications & Toast System

### Sonner
```json
{ "sonner": "^1.3.1" }
```

**Purpose**: Beautiful toast notification system with React integration.

**Key Features**:
- **Stacking**: Smart notification stacking with gesture support
- **Accessibility**: Screen reader support and keyboard navigation
- **Theming**: Automatic dark/light theme support
- **Positioning**: Flexible positioning with mobile optimization

**Usage in Psyduck**:
- **Success Notifications**: Project completion, XP earned, badges unlocked
- **Error Handling**: API errors, code execution failures
- **Real-time Updates**: New messages, mentorship requests, system updates
- **Progress Feedback**: File uploads, form submissions, loading states

---

This comprehensive library documentation ensures that all team members understand the purpose and implementation of each dependency in the Psyduck platform, facilitating better development practices and architectural decisions.
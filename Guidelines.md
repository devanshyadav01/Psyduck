# Psyduck Development Guidelines

## Project Overview
Psyduck is a project-based learning platform that combines GitHub + LeetCode + Upwork with gamification elements. The platform teaches users through building real projects organized into domains (MERN Stack, Flutter/React Native, Data Analytics, AI/ML) and difficulty levels (Beginner → Intermediate → Advanced).

## Design System
- **Primary Color**: #E67514 (Psyduck Orange)
- **Dark Background**: #212121
- **Success/Progress**: #06923E 
- **Soft Background**: #D3ECCD
- **Modern, gamified UI with progress bars, streak counters, and achievement systems**

## Project Structure & Architecture

### File Organization
- **Types**: All TypeScript types in `/types/` directory
- **Configuration**: App configuration and constants in `/config/` directory  
- **Hooks**: Custom React hooks in `/hooks/` directory
- **Utils**: Utility functions in `/utils/` directory
- **Components**: 
  - Main components in `/components/`
  - UI components in `/components/ui/`

### Routing & Navigation
- Use the centralized routing system via `useRouter` hook
- All route configuration is managed in `/config/routes.ts`
- Page keys are type-safe using the `PageKey` type
- Navigation handlers are standardized through `NavigationHandlers` interface

### Performance Guidelines
- Components are directly imported (no lazy loading currently)
- Proper loading states for better UX
- Efficient state management

### Code Organization Best Practices
- **Separation of Concerns**: Keep routing logic, authentication, and UI rendering separate
- **Type Safety**: Always use TypeScript types for props, state, and function parameters
- **Reusability**: Extract common logic into custom hooks
- **Modularity**: Break down large components into smaller, focused components
- **Configuration-Driven**: Use configuration objects instead of hardcoded values

### Component Guidelines
- Use functional components with hooks
- Implement proper error boundaries where needed
- Keep components focused on single responsibilities
- Extract complex logic into custom hooks
- Use proper TypeScript typing for all props
- Export components as named exports (not default exports)
- **IMPORTANT**: Do not use default parameters in component props (e.g., `= {}`)

### State Management
- Use React's built-in state management (useState, useContext) 
- Extract complex state logic into custom hooks
- Keep global state minimal and well-defined

### Styling Guidelines
- Use Tailwind CSS classes consistently
- Leverage CSS custom properties for theme colors
- Follow the established design system with Psyduck brand colors
- Maintain responsive design principles
- Use semantic HTML elements
- **IMPORTANT**: Do not use Tailwind classes for font size (e.g. text-2xl), font weight (e.g. font-bold), or line-height (e.g. leading-none), unless specifically requested by the user

### Authentication & Authorization
- All authentication logic is centralized in `AuthContext`
- Protected routes are configured declaratively
- Authentication state is managed globally
- Proper loading states during auth checks

### Error Handling
- Implement proper error boundaries
- Handle loading states consistently
- Provide meaningful error messages to users
- Log errors appropriately for debugging

### Brand Colors Usage
- Use `bg-psyduck-primary` for primary buttons and accents
- Use `bg-psyduck-dark` for dark backgrounds  
- Use `bg-psyduck-success` for success states and progress
- Use `bg-psyduck-soft` for soft background areas
- Use `text-psyduck-primary` for primary text accents
- Use `hover:bg-psyduck-primary-hover` for button hover states

### Component Export Standards
- Always use named exports for components: `export function ComponentName() {}`
- Never use default exports for components
- Never use default parameter syntax like `({ prop }: Props = {})`
- Always make required props explicit in the interface

### Testing Considerations
- Components should be easily testable in isolation
- Mock external dependencies properly
- Test both authenticated and unauthenticated states
- Ensure proper cleanup in effects and event listeners

## Recent Architecture Changes
- Removed lazy loading to simplify component imports
- Centralized routing logic in `useRouter` hook
- Type-safe navigation system with `PageKey` union type
- Configuration-driven route management
- Proper separation of concerns between routing, auth, and UI components
# 🦆 Psyduck Learning Platform

A revolutionary project-based learning platform that combines GitHub + LeetCode + Upwork with gamification elements, teaching users through real projects organized into domains (MERN Stack, Flutter/React Native, Data Analytics, AI/ML) and difficulty levels.

## ✨ Features

### 🎮 Gamified Learning
- **XP System**: Earn experience points for completing projects and challenges
- **Badges & Achievements**: Unlock special badges for various accomplishments
- **Streaks**: Build daily learning streaks with bonus rewards
- **Leaderboards**: Compete with other learners globally
- **Level Progression**: Advance through skill levels with clear milestones

### 📚 Project-Based Learning
- **Real Projects**: Learn through actual industry projects
- **Multiple Domains**: MERN Stack, Flutter/React Native, Data Analytics, AI/ML
- **Difficulty Levels**: Beginner, Intermediate, Advanced
- **Company Partnerships**: Real projects from partnered companies for high performers
- **Progress Tracking**: Detailed analytics on learning progress

### 💻 Professional IDE
- **Monaco Editor**: Full-featured code editor with syntax highlighting
- **Multi-Language Support**: JavaScript, Python, Java, C++, TypeScript, and more
- **Code Execution**: Run code directly in the browser with real-time results
- **Auto-completion**: Intelligent code completion and error detection
- **Theme Support**: Dark/Light themes with customization options

### 🤖 AI-Powered Assistance
- **Floating Chatbot**: Get help with coding questions and project guidance
- **Smart Suggestions**: AI-powered code suggestions and improvements
- **Learning Path Recommendations**: Personalized learning recommendations

### 🎥 Content Creation (Premium)
- **Video Submissions**: Premium users can submit educational content
- **Technical Tags**: Categorize content with predefined technical tags
- **Review System**: Content review and approval process
- **Creator Dashboard**: Track submissions and performance

### 🔄 Real-Time Features
- **Socket.IO Integration**: Real-time updates and notifications
- **Live Progress**: See your progress update in real-time
- **Instant Notifications**: Get notified of achievements and updates
- **Collaborative Features**: Share code and learn together

## 🚀 Technology Stack

### Frontend
- **React 18**: Latest React with concurrent features
- **TypeScript**: Full type safety throughout the application
- **Tailwind CSS v4**: Modern utility-first CSS framework
- **Tailwind Variables**: Custom design system with brand colors
- **Monaco Editor**: VS Code's editor in the browser
- **React Query**: Powerful data fetching and caching
- **Socket.IO Client**: Real-time communication

### Backend Integration
- **RESTful API**: Clean API architecture with proper separation
- **Service Layer**: Modular frontend services for different domains
- **Mock API**: Comprehensive mock API for development
- **Type-Safe Requests**: Fully typed API responses

### Development Tools
- **Performance Monitoring**: Built-in performance optimization
- **Error Boundaries**: Robust error handling
- **Route Preloading**: Optimized navigation experience
- **Bundle Optimization**: Code splitting and lazy loading

## 🎨 Design System

### Color Palette
- **Primary**: `#E67514` (Psyduck Orange)
- **Dark Background**: `#212121`
- **Success**: `#06923E`
- **Soft Background**: `#D3ECCD`
- **Hover States**: `#d16612`

### Typography
- **Base Font Size**: 14px
- **Font Weights**: 400 (normal), 500 (medium)
- **Responsive**: Scales appropriately across devices

### Components
- **ShadCN UI**: Complete component library
- **Floating Elements**: Isolated floating UI components
- **Responsive Design**: Mobile-first approach
- **Accessibility**: WCAG compliant components

## 📁 Project Structure

```
├── App.tsx                     # Main application entry point
├── components/                 # React components
│   ├── auth/                  # Authentication components
│   ├── projects/              # Project-related components
│   ├── ide/                   # IDE components
│   ├── recruiting/            # Premium recruiting features
│   ├── shared/               # Shared utility components
│   ├── providers/            # Context providers
│   └── ui/                   # ShadCN UI components
├── services/                  # Service layer
│   ├── api/                  # API client layer
│   ├── frontend/             # Frontend service layer
│   └── legacy files          # Backwards compatibility
├── contexts/                 # React contexts
├── hooks/                    # Custom React hooks
├── lib/                      # Utility libraries
├── types/                    # TypeScript type definitions
├── config/                   # Configuration files
└── styles/                   # CSS and styling
```

## 🔧 Service Architecture

### API Client Layer (`/services/api/`)
- **ApiClient.ts**: Core HTTP client with authentication
- **Mock Integration**: Seamless mock API routing
- **Type Safety**: Fully typed API responses
- **Error Handling**: Robust error handling and recovery

### Frontend Service Layer (`/services/frontend/`)
- **ServiceManager.ts**: Central service coordination
- **AuthService.ts**: Authentication and user management
- **ProjectService.ts**: Project management and progress tracking
- **GamificationService.ts**: XP, badges, and leaderboards
- **NotificationService.ts**: Real-time notifications
- **CodeService.ts**: Code execution and history

### Legacy Compatibility
- **apiService.ts**: Backwards compatibility layer
- **Seamless Migration**: Existing components work without changes
- **Gradual Adoption**: Migrate to new services over time

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- Modern web browser with ES2022 support

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd psyduck-learning-platform
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm start
   ```

4. **Open in browser**
   Navigate to `http://localhost:3000`

### Environment Setup

Create a `.env.local` file with the following variables:

```env
# API Configuration (currently using mock API)
REACT_APP_API_URL=https://api.psyduck.dev/v1
REACT_APP_USE_MOCK_API=true

# Socket.IO Configuration
REACT_APP_SOCKET_URL=wss://api.psyduck.dev

# Optional: Analytics and monitoring
REACT_APP_ANALYTICS_ID=your_analytics_id
```

## 🎯 Usage

### For Learners

1. **Sign Up**: Create your account and choose your learning path
2. **Browse Projects**: Explore projects by domain and difficulty
3. **Start Learning**: Enroll in projects and begin coding
4. **Track Progress**: Monitor your XP, badges, and progress
5. **Join Community**: Compete on leaderboards and connect with peers

### For Premium Users

1. **Content Creation**: Submit educational videos with technical tags
2. **Advanced Projects**: Access exclusive company-partnered projects
3. **Priority Support**: Get faster response times for help requests
4. **Analytics Dashboard**: Detailed learning analytics and insights

### For Developers

1. **API Integration**: Use the service layer for clean API integration
2. **Component Development**: Leverage the design system and UI components
3. **Performance Optimization**: Built-in performance monitoring and optimization
4. **Real-time Features**: Socket.IO integration for live features

## 📊 Performance

### Optimization Features
- **Code Splitting**: Automatic route-based code splitting
- **Lazy Loading**: Components loaded on demand
- **Service Workers**: Offline support and caching
- **Bundle Analysis**: Built-in bundle size monitoring
- **Performance Monitoring**: Real-time performance metrics

### Browser Support
- **Modern Browsers**: Chrome 88+, Firefox 84+, Safari 14+, Edge 88+
- **Mobile**: iOS Safari 14+, Chrome Android 88+
- **Features**: ES2022, WebAssembly, Service Workers

## 🔒 Security

### Authentication
- **JWT Tokens**: Secure token-based authentication
- **Token Refresh**: Automatic token renewal
- **Secure Storage**: Proper token storage practices
- **Permission System**: Role-based access control

### Data Protection
- **Input Validation**: Client and server-side validation
- **XSS Protection**: Proper content sanitization
- **CSRF Protection**: Cross-site request forgery prevention
- **Secure Headers**: Security headers implementation

## 🤝 Contributing

We welcome contributions! Please read our contributing guidelines:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit changes**: `git commit -m 'Add amazing feature'`
4. **Push to branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Development Guidelines
- Follow TypeScript best practices
- Write tests for new features
- Update documentation
- Follow the established code style
- Ensure accessibility compliance

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Monaco Editor**: For the excellent code editor
- **ShadCN UI**: For the beautiful component library
- **Tailwind CSS**: For the utility-first CSS framework
- **React Query**: For powerful data fetching
- **Socket.IO**: For real-time communication

## 📞 Support

- **Documentation**: Check the `/docs` folder for detailed guides
- **Issues**: Report bugs on GitHub Issues
- **Discussions**: Join GitHub Discussions for questions
- **Email**: contact@psyduck.dev

---

**Built with ❤️ by the Psyduck Learning Platform Team**

*Empowering developers through project-based learning and gamification* 🦆
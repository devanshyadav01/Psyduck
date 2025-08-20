import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Avatar, AvatarFallback } from './ui/avatar';
import { ScrollArea } from './ui/scroll-area';
import { 
  MessageSquare, 
  X, 
  Send, 
  Minimize, 
  Maximize, 
  Bot, 
  User,
  Lightbulb,
  Code,
  BookOpen,
  Zap
} from 'lucide-react';

interface ChatMessage {
  id: string;
  type: 'user' | 'bot';
  message: string;
  timestamp: Date;
  suggestions?: string[];
}

interface FloatingChatbotProps {
  className?: string;
  context?: 'general' | 'ide';
}

export function FloatingChatbot({ className = '', context = 'general' }: FloatingChatbotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  
  const getInitialMessage = () => {
    if (context === 'ide') {
      return {
        id: '1',
        type: 'bot' as const,
        message: "Hi! I'm your IDE coding assistant! 🛠️\n\nI can help you with:\n• Debugging your current code\n• Code optimization suggestions\n• Syntax explanations\n• Best practices for your project\n• Testing strategies\n\nWhat coding challenge are you facing?",
        timestamp: new Date(),
        suggestions: [
          "Debug this error message",
          "Optimize my code performance",
          "Explain this syntax",
          "Suggest testing approaches"
        ]
      };
    }
    
    return {
      id: '1',
      type: 'bot' as const,
      message: "Hi! I'm Psyduck AI, your coding assistant! 🦆\n\nI can help you with:\n• Code reviews and debugging\n• Project guidance and best practices\n• Learning resources and tutorials\n• Technical questions\n\nWhat would you like to work on today?",
      timestamp: new Date(),
      suggestions: [
        "Help me debug my React code",
        "Explain JavaScript concepts", 
        "Review my project structure",
        "Suggest learning resources"
      ]
    };
  };

  const [messages, setMessages] = useState<ChatMessage[]>([getInitialMessage()]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Dummy API function to simulate chatbot responses
  const getChatbotResponse = async (userMessage: string): Promise<string> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const lowercaseMessage = userMessage.toLowerCase();
    
    // Simple response logic based on keywords
    if (lowercaseMessage.includes('react') || lowercaseMessage.includes('jsx')) {
      return `Great question about React! 🚀\n\nReact is a powerful library for building user interfaces. Here are some key concepts:\n\n• Components are reusable pieces of UI\n• Use hooks like useState and useEffect for state management\n• Props pass data between components\n• JSX combines HTML-like syntax with JavaScript\n\nWould you like me to explain any of these concepts in more detail?`;
    }
    
    if (lowercaseMessage.includes('debug') || lowercaseMessage.includes('error') || lowercaseMessage.includes('bug')) {
      return `I'd be happy to help you debug! 🔍\n\nHere's my debugging approach:\n\n1. **Check the console** - Look for error messages\n2. **Add console.log statements** - Track variable values\n3. **Use browser dev tools** - Inspect elements and network requests\n4. **Isolate the problem** - Comment out code sections\n5. **Check syntax** - Look for missing brackets, semicolons, etc.\n\nCan you share the specific error message or code you're struggling with?`;
    }
    
    if (lowercaseMessage.includes('learn') || lowercaseMessage.includes('tutorial') || lowercaseMessage.includes('resource')) {
      return `Excellent! Learning is the key to growth! 📚\n\nHere are some fantastic resources:\n\n**For Beginners:**\n• MDN Web Docs - Comprehensive web development guide\n• freeCodeCamp - Interactive coding challenges\n• Codecademy - Structured learning paths\n\n**For Advanced:**\n• JavaScript.info - Deep JavaScript concepts\n• React documentation - Official React guides\n• GitHub repos - Real-world code examples\n\nWhat specific technology are you interested in learning?`;
    }
    
    if (lowercaseMessage.includes('project') || lowercaseMessage.includes('structure')) {
      return `Let's talk about project structure! 🏗️\n\nA well-organized project is crucial for maintainability:\n\n**Recommended Structure:**\n\nsrc/\n  components/     # Reusable UI components\n  pages/         # Page components\n  hooks/         # Custom hooks\n  utils/         # Helper functions\n  styles/        # CSS/styling files\n  types/         # TypeScript type definitions\n\n**Best Practices:**\n• Keep components small and focused\n• Use meaningful file names\n• Group related files together\n• Separate business logic from UI\n\nWhat type of project are you working on?`;
    }
    
    if (lowercaseMessage.includes('javascript') || lowercaseMessage.includes('js')) {
      return `JavaScript is an amazing language! ✨\n\n**Core Concepts to Master:**\n\n• **Variables & Scope** - let, const, var\n• **Functions** - Arrow functions, callbacks, closures\n• **Objects & Arrays** - Destructuring, spread operator\n• **Promises & Async/Await** - Handling asynchronous operations\n• **DOM Manipulation** - Interacting with web pages\n• **ES6+ Features** - Modern JavaScript syntax\n\nWhich JavaScript concept would you like me to explain further?`;
    }
    
    if (lowercaseMessage.includes('css') || lowercaseMessage.includes('styling')) {
      return `CSS styling is an art! 🎨\n\n**Modern CSS Techniques:**\n\n• **Flexbox** - One-dimensional layouts\n• **Grid** - Two-dimensional layouts\n• **CSS Variables** - Reusable values\n• **Responsive Design** - Mobile-first approach\n• **Animations** - Smooth transitions and effects\n• **CSS-in-JS** - Styling with JavaScript\n\n**Tips:**\n• Use semantic class names\n• Keep specificity low\n• Organize with methodologies like BEM\n\nWhat styling challenge are you facing?`;
    }
    
    if (lowercaseMessage.includes('hello') || lowercaseMessage.includes('hi') || lowercaseMessage.includes('hey')) {
      return `Hello there! 👋 Great to meet you!\n\nI'm here to help you on your coding journey. Whether you're:\n\n• Starting your first project\n• Debugging tricky code\n• Learning new concepts\n• Planning your next steps\n\nI've got your back! What brings you here today?`;
    }
    
    // Default response for unmatched queries
    const defaultResponses = [
      `That's an interesting question! 🤔\n\nWhile I may not have a specific answer for that right now, I can definitely help you find the right resources or break down the problem into smaller parts.\n\nCould you provide more context or rephrase your question?`,
      
      `I appreciate your question! 💭\n\nLet me suggest a few approaches:\n\n• Break the problem into smaller steps\n• Check the official documentation\n• Look for similar examples online\n• Try a different approach\n\nCan you tell me more about what you're trying to achieve?`,
      
      `Great question! 🚀\n\nI'm always learning too! For questions I can't answer immediately, I recommend:\n\n• Stack Overflow - Community-driven Q&A\n• GitHub discussions - Project-specific help\n• Developer Discord servers - Real-time chat\n• Official documentation - Most up-to-date info\n\nWhat specific area would you like to explore?`
    ];
    
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  };

  const sendMessage = async (message: string) => {
    if (!message.trim()) return;
    
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      message: message.trim(),
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setCurrentMessage('');
    setIsTyping(true);
    
    try {
      const response = await getChatbotResponse(message);
      
      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        message: response,
        timestamp: new Date(),
        suggestions: getSmartSuggestions(message)
      };
      
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        message: "Sorry, I'm having trouble connecting right now. Please try again in a moment! 🔄",
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const getSmartSuggestions = (userMessage: string): string[] => {
    const lowercaseMessage = userMessage.toLowerCase();
    
    if (lowercaseMessage.includes('react')) {
      return [
        "Show me React hooks examples",
        "Explain component lifecycle",
        "Help with React state management",
        "React best practices"
      ];
    }
    
    if (lowercaseMessage.includes('javascript')) {
      return [
        "Explain async/await",
        "Help with array methods",
        "Show me ES6 features",
        "Debug my JavaScript code"
      ];
    }
    
    if (lowercaseMessage.includes('css')) {
      return [
        "Flexbox vs Grid layout",
        "Responsive design tips",
        "CSS animations help",
        "Modern CSS techniques"
      ];
    }
    
    return [
      "Help me with project setup",
      "Code review guidance", 
      "Learning roadmap advice",
      "Debug common errors"
    ];
  };

  const handleSuggestionClick = (suggestion: string) => {
    sendMessage(suggestion);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(currentMessage);
  };

  const formatMessage = (message: string) => {
    return message.split('\n').map((line, index) => (
      <span key={index}>
        {line}
        {index < message.split('\n').length - 1 && <br />}
      </span>
    ));
  };

  if (!isOpen) {
    return (
      <div className={`fixed bottom-6 right-6 z-50 ${className}`}>
        <Button
          onClick={() => setIsOpen(true)}
          className="h-14 w-14 rounded-full shadow-lg bg-psyduck-primary hover:bg-psyduck-primary-hover"
          size="lg"
        >
          <MessageSquare className="h-6 w-6" />
        </Button>
      </div>
    );
  }

  return (
    <div className={`fixed bottom-6 right-6 z-50 ${className}`}>
      <Card className={`w-96 transition-all duration-200 shadow-2xl ${
        isMinimized ? 'h-16' : 'h-[500px]'
      }`}>
        <CardHeader className="flex flex-row items-center justify-between p-4 bg-psyduck-primary text-white rounded-t-lg">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
              <Bot className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-sm">Psyduck AI</CardTitle>
              <p className="text-xs opacity-90">Your coding assistant</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMinimized(!isMinimized)}
              className="h-8 w-8 p-0 hover:bg-white/20 text-white"
            >
              {isMinimized ? <Maximize className="h-4 w-4" /> : <Minimize className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="h-8 w-8 p-0 hover:bg-white/20 text-white"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        {!isMinimized && (
          <CardContent className="p-0 flex flex-col h-[436px]">
            {/* Messages Area */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div key={message.id} className={`flex gap-3 ${
                    message.type === 'user' ? 'justify-end' : 'justify-start'
                  }`}>
                    {message.type === 'bot' && (
                      <Avatar className="h-8 w-8 bg-psyduck-primary">
                        <AvatarFallback className="bg-psyduck-primary text-white">
                          <Bot className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                    )}
                    
                    <div className={`max-w-[80%] rounded-lg p-3 text-sm ${
                      message.type === 'user'
                        ? 'bg-psyduck-primary text-white ml-auto'
                        : 'bg-muted'
                    }`}>
                      <div className="whitespace-pre-wrap font-mono text-xs">
                        {formatMessage(message.message)}
                      </div>
                      
                      {message.suggestions && (
                        <div className="mt-3 space-y-1">
                          {message.suggestions.map((suggestion, index) => (
                            <Button
                              key={index}
                              variant="outline"
                              size="sm"
                              onClick={() => handleSuggestionClick(suggestion)}
                              className="w-full justify-start text-xs h-7"
                            >
                              <Lightbulb className="h-3 w-3 mr-2" />
                              {suggestion}
                            </Button>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    {message.type === 'user' && (
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>
                          <User className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                ))}
                
                {isTyping && (
                  <div className="flex gap-3 justify-start">
                    <Avatar className="h-8 w-8 bg-psyduck-primary">
                      <AvatarFallback className="bg-psyduck-primary text-white">
                        <Bot className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="bg-muted rounded-lg p-3 text-sm">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-75" />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150" />
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div ref={messagesEndRef} />
            </ScrollArea>

            {/* Input Area */}
            <div className="border-t p-4">
              <form onSubmit={handleSubmit} className="flex gap-2">
                <Input
                  value={currentMessage}
                  onChange={(e) => setCurrentMessage(e.target.value)}
                  placeholder="Ask me anything about coding..."
                  disabled={isTyping}
                  className="flex-1"
                />
                <Button
                  type="submit"
                  size="sm"
                  disabled={!currentMessage.trim() || isTyping}
                  className="bg-psyduck-primary hover:bg-psyduck-primary-hover"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </form>
              
              <div className="flex gap-1 mt-2">
                <Badge variant="outline" className="text-xs">
                  <Code className="h-3 w-3 mr-1" />
                  Code Help
                </Badge>
                <Badge variant="outline" className="text-xs">
                  <BookOpen className="h-3 w-3 mr-1" />
                  Tutorials
                </Badge>
                <Badge variant="outline" className="text-xs">
                  <Zap className="h-3 w-3 mr-1" />
                  Quick Tips
                </Badge>
              </div>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
}
import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { MessageCircle, X, Send, Minimize2, Maximize2 } from 'lucide-react';

interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  type?: 'text' | 'code' | 'suggestion';
}

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: '1',
    content: "Hi! I'm your coding assistant 🦆. I can help you with projects, debugging, and learning new concepts. What would you like to work on?",
    sender: 'bot',
    timestamp: new Date(),
    type: 'text'
  }
];

const QUICK_SUGGESTIONS = [
  "Explain this error",
  "Code review",
  "Best practices", 
  "Project help",
  "Debug assistance"
];

// Helpers for minimal Markdown rendering (code blocks, inline code, bold, italic, links)
const escapeHtml = (str: string) =>
  str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

const renderInline = (text: string): React.ReactNode[] => {
  const nodes: React.ReactNode[] = [];
  let remaining = text;

  // Links [text](url)
  const linkRegex = /\[([^\]]+)\]\((https?:[^\)\s]+)\)/;
  while (true) {
    const match = remaining.match(linkRegex);
    if (!match) break;
    const [full, label, url] = match;
    const index = match.index || 0;
    if (index > 0) nodes.push(escapeHtml(remaining.slice(0, index)));
    nodes.push(
      <a key={`link-${index}-${url}`} href={url} target="_blank" rel="noreferrer" className="underline text-psyduck-primary break-words">
        {label}
      </a>
    );
    remaining = remaining.slice(index + full.length);
  }
  if (remaining) nodes.push(escapeHtml(remaining));

  // Process inline code `code`
  const processed: React.ReactNode[] = [];
  nodes.forEach((node, i) => {
    if (typeof node !== 'string') {
      processed.push(node);
      return;
    }
    const parts = node.split(/`([^`]+)`/g);
    parts.forEach((part, idx) => {
      if (idx % 2 === 1) {
        processed.push(
          <code key={`code-${i}-${idx}`} className="px-1 py-0.5 rounded bg-muted text-foreground break-words">
            {part}
          </code>
        );
      } else {
        // Bold **text** and italic *text*
        const boldParts = part.split(/\*\*([^*]+)\*\*/g);
        boldParts.forEach((bp, bidx) => {
          if (bidx % 2 === 1) {
            processed.push(
              <strong key={`b-${i}-${idx}-${bidx}`} className="font-semibold">
                {bp}
              </strong>
            );
          } else {
            const italicParts = bp.split(/\*([^*]+)\*/g);
            italicParts.forEach((ip, iidx) => {
              if (iidx % 2 === 1) {
                processed.push(
                  <em key={`i-${i}-${idx}-${bidx}-${iidx}`} className="italic">
                    {ip}
                  </em>
                );
              } else {
                processed.push(ip);
              }
            });
          }
        });
      }
    });
  });

  return processed;
};

const renderMarkdown = (content: string): React.ReactNode => {
  const elements: React.ReactNode[] = [];
  const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = codeBlockRegex.exec(content)) !== null) {
    const index = match.index;
    if (index > lastIndex) {
      const text = content.slice(lastIndex, index);
      text.split('\n').forEach((line, li) => {
        elements.push(
          <div key={`p-${index}-${li}`} className="break-words whitespace-pre-wrap">
            {renderInline(line)}
          </div>
        );
      });
    }

    const lang = match[1] || '';
    const code = match[2] || '';
    elements.push(
      <pre key={`pre-${index}`} className="mt-2 mb-2 p-3 rounded bg-muted overflow-x-auto text-sm max-w-full">
        <code className="whitespace-pre">{code}</code>
      </pre>
    );
    lastIndex = index + match[0].length;
  }

  if (lastIndex < content.length) {
    const tail = content.slice(lastIndex);
    tail.split('\n').forEach((line, li) => {
      elements.push(
        <div key={`p-tail-${lastIndex}-${li}`} className="break-words whitespace-pre-wrap">
          {renderInline(line)}
        </div>
      );
    });
  }

  return <>{elements}</>;
};

// Optimized message component with React.memo
const ChatMessage = React.memo(({ message }: { message: ChatMessage }) => {
  const isBot = message.sender === 'bot';
  
  return (
    <div className={`flex ${isBot ? 'justify-start' : 'justify-end'} mb-4 w-full min-w-0`}>
      <div className={`max-w-[80%] md:max-w-[75%] rounded-lg px-3 py-2 break-words overflow-hidden ${
        isBot 
          ? 'bg-muted text-foreground' 
          : 'bg-psyduck-primary text-white'
      }`}>
        <div className="text-sm whitespace-pre-wrap break-words [overflow-wrap:anywhere] [word-break:break-word]">
          {renderMarkdown(message.content)}
        </div>
        <span className="text-xs opacity-70 mt-1 block">
          {message.timestamp.toLocaleTimeString()}
        </span>
      </div>
    </div>
  );
});

ChatMessage.displayName = 'ChatMessage';

// Mock AI response generator (optimized)
const generateBotResponse = async (userMessage: string): Promise<string> => {
  // Simulate AI thinking time (reduced for better performance)
  await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 500));
  
  const lowerMessage = userMessage.toLowerCase();
  
  // Use more efficient string matching
  const responses = {
    error: "I can help you debug! 🔍 Can you share the error message or code snippet? Here are some common debugging steps:\n\n1. Check the console for error messages\n2. Verify variable names and syntax\n3. Ensure all imports are correct\n4. Test with simple inputs first",
    
    project: "Great! I'm here to help with your project. 🚀 What specific area do you need assistance with?\n\n• Planning and architecture\n• Code implementation\n• Testing strategies\n• Performance optimization\n• Best practices",
    
    review: "I'd be happy to review your code! 👨‍💻 Please share the code you'd like me to look at. I can help with:\n\n• Code quality and readability\n• Performance improvements\n• Security considerations\n• Design patterns\n• Best practices",
    
    learn: "Awesome! Learning is the key to growth! 📚 What technology or concept would you like to learn?\n\n• JavaScript/TypeScript\n• React/Node.js\n• Python/Django\n• Data structures\n• System design"
  };
  
  // Find matching response
  for (const [key, response] of Object.entries(responses)) {
    if (lowerMessage.includes(key) || 
        (key === 'error' && lowerMessage.includes('bug')) ||
        (key === 'project' && lowerMessage.includes('help')) ||
        (key === 'review' && lowerMessage.includes('code')) ||
        (key === 'learn' && lowerMessage.includes('tutorial'))) {
      return response;
    }
  }
  
  // Default response
  return "That's interesting! 🤔 Can you provide more details so I can give you a more helpful response? I'm here to assist with coding, debugging, project planning, and learning new technologies.";
};

export const FloatingChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Auto-scroll to bottom when new messages arrive (optimized)
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages.length]); // Only depend on messages length, not entire messages array
  
  // Update unread count when chatbot is closed
  useEffect(() => {
    if (isOpen) {
      setUnreadCount(0);
    }
  }, [isOpen]);
  
  const handleSendMessage = useCallback(async () => {
    if (!input.trim()) return;
    
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: input.trim(),
      sender: 'user',
      timestamp: new Date(),
      type: 'text'
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);
    
    try {
      const botResponse = await generateBotResponse(userMessage.content);
      
      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: botResponse,
        sender: 'bot',
        timestamp: new Date(),
        type: 'text'
      };
      
      setMessages(prev => [...prev, botMessage]);
      
      // Increment unread count if chatbot is closed or minimized
      if (!isOpen || isMinimized) {
        setUnreadCount(prev => prev + 1);
      }
    } catch (error) {
      console.error('Error generating bot response:', error);
      
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: "Sorry, I'm having trouble responding right now. Please try again!",
        sender: 'bot',
        timestamp: new Date(),
        type: 'text'
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  }, [input, isOpen, isMinimized]);
  
  const handleQuickSuggestion = useCallback((suggestion: string) => {
    setInput(suggestion);
  }, []);
  
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  }, [handleSendMessage]);
  
  const toggleChatbot = useCallback(() => {
    setIsOpen(prev => !prev);
    if (!isOpen) {
      setUnreadCount(0);
    }
  }, [isOpen]);
  
  const toggleMinimize = useCallback(() => {
    setIsMinimized(prev => !prev);
  }, []);
  
  // Memoized quick suggestions (only when messages length is 1)
  const quickSuggestionButtons = useMemo(() => {
    if (messages.length !== 1) return null;
    
    return (
      <div className="flex flex-wrap gap-2 mb-3">
        {QUICK_SUGGESTIONS.map((suggestion) => (
          <Button
            key={suggestion}
            variant="outline"
            size="sm"
            className="text-xs"
            onClick={() => handleQuickSuggestion(suggestion)}
          >
            {suggestion}
          </Button>
        ))}
      </div>
    );
  }, [messages.length, handleQuickSuggestion]);
  
  // Memoized message list with optimized rendering
  const messageList = useMemo(() => (
    <div className="flex-1 min-h-0 space-y-2 overflow-y-auto psyduck-scrollbar pr-1">
      {messages.map((message) => (
        <ChatMessage key={message.id} message={message} />
      ))}
      {isTyping && (
        <div className="flex justify-start mb-4">
          <div className="bg-muted rounded-lg px-3 py-2">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse animate-delay-200"></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse animate-delay-400"></div>
            </div>
          </div>
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  ), [messages, isTyping]);

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <Button
          onClick={toggleChatbot}
          className="h-14 w-14 rounded-full bg-psyduck-primary hover:bg-psyduck-primary-hover text-white shadow-lg relative gpu-accelerated floating-interactive"
          size="icon"
        >
          <MessageCircle className="h-6 w-6" />
          {unreadCount > 0 && (
            <Badge 
              className="absolute -top-2 -right-2 h-6 w-6 flex items-center justify-center text-xs p-0 bg-destructive"
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
          )}
        </Button>
      )}

      {/* Chat Interface */}
      {isOpen && (
        <Card className="w-[90vw] max-w-md h-[28rem] md:w-96 md:h-[28rem] flex flex-col shadow-xl animate-in slide-in-from-bottom-5 gpu-accelerated floating-interactive">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 border-b">
            <div className="flex items-center space-x-2">
              <div className="text-lg">🦆</div>
              <CardTitle className="text-lg">Psyduck Assistant</CardTitle>
              <Badge variant="secondary" className="text-xs bg-psyduck-success text-white">
                Online
              </Badge>
            </div>
            
            <div className="flex space-x-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={toggleMinimize}
              >
                {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={toggleChatbot}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>

          {!isMinimized && (
            <CardContent className="flex-1 flex flex-col p-4">
              {/* Quick Suggestions */}
              {quickSuggestionButtons}
              
              {/* Messages */}
              {messageList}

              {/* Input Area */}
              <div className="mt-auto pt-3 border-t">
                <div className="flex space-x-2">
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask me anything about coding..."
                    className="flex-1 min-h-[40px] max-h-24 px-3 py-2 text-sm border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-psyduck-primary"
                    disabled={isTyping}
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!input.trim() || isTyping}
                    className="px-3 bg-psyduck-primary hover:bg-psyduck-primary-hover"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          )}
        </Card>
      )}
    </>
  );
};

export default FloatingChatbot;
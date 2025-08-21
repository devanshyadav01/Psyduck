// Frontend Code Service
import { apiClient, ApiResponse } from '../api/ApiClient';

export interface CodeExecutionRequest {
  code: string;
  language: string;
  input?: string;
  timeout?: number;
}

export interface CodeExecutionResult {
  output?: string;
  error?: string;
  executionTime: number;
  memoryUsage?: number;
  exitCode?: number;
}

export interface CodeSubmission {
  id: string;
  projectId: string;
  stepId: string;
  code: string;
  language: string;
  result?: CodeExecutionResult;
  submittedAt: string;
  status: 'pending' | 'executed' | 'failed';
}

class CodeServiceFrontend {
  private executionHistory: CodeSubmission[] = [];
  private maxHistorySize: number = 50;

  // Set authentication (called by service manager)
  setAuth(token: string | null, user: any | null): void {
    if (!token) {
      this.clearData();
    }
  }

  // Execute code
  async executeCode(request: CodeExecutionRequest): Promise<ApiResponse<CodeExecutionResult>> {
    try {
      // Add to execution history immediately
      const submission: CodeSubmission = {
        id: `exec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        projectId: 'current_project',
        stepId: 'current_step',
        code: request.code,
        language: request.language,
        submittedAt: new Date().toISOString(),
        status: 'pending'
      };

      this.addToHistory(submission);

      const response = await apiClient.post<CodeExecutionResult>('/code/execute', request);

      // Update submission with result
      if (response.success && response.data) {
        submission.result = response.data;
        submission.status = 'executed';
      } else {
        submission.status = 'failed';
        submission.result = {
          output: undefined,
          error: response.message,
          executionTime: 0
        };
      }

      return response;
    } catch (error) {
      console.error('CodeService execute code error:', error);
      return {
        data: null,
        success: false,
        message: error instanceof Error ? error.message : 'Code execution failed'
      };
    }
  }

  // Get supported languages
  getSupportedLanguages(): string[] {
    return [
      'javascript',
      'python',
      'java',
      'cpp',
      'c',
      'typescript',
      'go',
      'rust',
      'php',
      'ruby',
      'swift',
      'kotlin',
      'scala',
      'r',
      'sql'
    ];
  }

  // Get language configuration
  getLanguageConfig(language: string) {
    const configs: Record<string, any> = {
      javascript: {
        name: 'JavaScript',
        extension: '.js',
        template: 'console.log("Hello, World!");',
        comment: '//',
        supportsInput: true
      },
      python: {
        name: 'Python',
        extension: '.py',
        template: 'print("Hello, World!")',
        comment: '#',
        supportsInput: true
      },
      java: {
        name: 'Java',
        extension: '.java',
        template: 'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}',
        comment: '//',
        supportsInput: true
      },
      cpp: {
        name: 'C++',
        extension: '.cpp',
        template: '#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Hello, World!" << endl;\n    return 0;\n}',
        comment: '//',
        supportsInput: true
      },
      typescript: {
        name: 'TypeScript',
        extension: '.ts',
        template: 'console.log("Hello, World!");',
        comment: '//',
        supportsInput: true
      }
    };

    return configs[language] || {
      name: language.charAt(0).toUpperCase() + language.slice(1),
      extension: `.${language}`,
      template: `// ${language} code`,
      comment: '//',
      supportsInput: false
    };
  }

  // Get execution history
  getExecutionHistory(): CodeSubmission[] {
    return [...this.executionHistory].reverse(); // Most recent first
  }

  // Get execution history for specific language
  getExecutionHistoryByLanguage(language: string): CodeSubmission[] {
    return this.executionHistory
      .filter(submission => submission.language === language)
      .reverse();
  }

  // Get last execution for language
  getLastExecution(language: string): CodeSubmission | null {
    const history = this.getExecutionHistoryByLanguage(language);
    return history[0] || null;
  }

  // Add submission to history
  private addToHistory(submission: CodeSubmission): void {
    this.executionHistory.push(submission);
    
    // Maintain history size limit
    if (this.executionHistory.length > this.maxHistorySize) {
      this.executionHistory.shift();
    }
  }

  // Clear execution history
  clearExecutionHistory(): void {
    this.executionHistory = [];
  }

  // Save code submission for project
  async saveCodeSubmission(
    projectId: string,
    stepId: string,
    code: string,
    language: string
  ): Promise<ApiResponse<any>> {
    try {
      // For now, just store locally
      const submission: CodeSubmission = {
        id: `save_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        projectId,
        stepId,
        code,
        language,
        submittedAt: new Date().toISOString(),
        status: 'executed'
      };

      this.addToHistory(submission);

      return {
        data: submission,
        success: true,
        message: 'Code submission saved successfully'
      };
    } catch (error) {
      console.error('CodeService save submission error:', error);
      return {
        data: null,
        success: false,
        message: error instanceof Error ? error.message : 'Failed to save code submission'
      };
    }
  }

  // Get code templates for different scenarios
  getCodeTemplate(language: string, scenario: string = 'basic'): string {
    const templates: Record<string, Record<string, string>> = {
      javascript: {
        basic: 'console.log("Hello, World!");',
        function: 'function greet(name) {\n    return `Hello, ${name}!`;\n}\n\nconsole.log(greet("World"));',
        class: 'class Person {\n    constructor(name) {\n        this.name = name;\n    }\n\n    greet() {\n        return `Hello, ${this.name}!`;\n    }\n}\n\nconst person = new Person("World");\nconsole.log(person.greet());',
        async: 'async function fetchData() {\n    try {\n        // Simulate API call\n        const data = await new Promise(resolve => \n            setTimeout(() => resolve("Hello, World!"), 1000)\n        );\n        console.log(data);\n    } catch (error) {\n        console.error("Error:", error);\n    }\n}\n\nfetchData();'
      },
      python: {
        basic: 'print("Hello, World!")',
        function: 'def greet(name):\n    return f"Hello, {name}!"\n\nprint(greet("World"))',
        class: 'class Person:\n    def __init__(self, name):\n        self.name = name\n\n    def greet(self):\n        return f"Hello, {self.name}!"\n\nperson = Person("World")\nprint(person.greet())',
        datastructure: 'numbers = [1, 2, 3, 4, 5]\nsquares = [x**2 for x in numbers]\nprint(f"Numbers: {numbers}")\nprint(f"Squares: {squares}")'
      }
    };

    return templates[language]?.[scenario] || this.getLanguageConfig(language).template;
  }

  // Validate code syntax (basic client-side validation)
  validateCodeSyntax(code: string, language: string): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Basic validation rules
    if (code.trim().length === 0) {
      errors.push('Code cannot be empty');
    }

    // Language-specific validation
    switch (language) {
      case 'javascript':
      case 'typescript':
        // Check for basic syntax issues
        if (code.includes('console.log(') && !code.includes(');')) {
          errors.push('Missing closing parenthesis and semicolon');
        }
        break;
      case 'python':
        // Check for basic indentation issues
        const lines = code.split('\n');
        let hasIndentationIssue = false;
        lines.forEach((line, index) => {
          if (line.trim().endsWith(':') && index < lines.length - 1) {
            const nextLine = lines[index + 1];
            if (nextLine.trim() && !nextLine.startsWith('    ') && !nextLine.startsWith('\t')) {
              hasIndentationIssue = true;
            }
          }
        });
        if (hasIndentationIssue) {
          errors.push('Indentation error detected');
        }
        break;
      case 'java':
        // Check for basic class structure
        if (!code.includes('public class') && !code.includes('class ')) {
          errors.push('Java code should contain a class definition');
        }
        break;
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Get execution statistics
  getExecutionStats() {
    const total = this.executionHistory.length;
    const successful = this.executionHistory.filter(s => s.status === 'executed' && !s.result?.error).length;
    const failed = this.executionHistory.filter(s => s.status === 'failed' || s.result?.error).length;

    const languageStats: Record<string, number> = {};
    this.executionHistory.forEach(submission => {
      languageStats[submission.language] = (languageStats[submission.language] || 0) + 1;
    });

    const averageExecutionTime = this.executionHistory
      .filter(s => s.result?.executionTime)
      .reduce((sum, s) => sum + (s.result?.executionTime || 0), 0) / 
      this.executionHistory.filter(s => s.result?.executionTime).length || 0;

    return {
      total,
      successful,
      failed,
      successRate: total > 0 ? (successful / total) * 100 : 0,
      languageStats,
      averageExecutionTime: Math.round(averageExecutionTime)
    };
  }

  // Clear all data
  clearData(): void {
    this.executionHistory = [];
  }
}

// Create singleton instance
export const codeServiceFrontend = new CodeServiceFrontend();

// Export for use in components and hooks
export default codeServiceFrontend;
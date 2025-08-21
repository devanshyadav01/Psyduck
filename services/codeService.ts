import { apiService } from './apiService';

export interface CodeSubmission {
  projectId: string;
  milestoneId?: string;
  language: string;
  code: string;
  input?: string;
  testCases?: TestCase[];
}

export interface TestCase {
  input: any;
  expected: any;
  description?: string;
}

export interface ExecutionResult {
  id: string;
  success: boolean;
  output: string;
  executionTime: number;
  memoryUsage: number;
  status: 'completed' | 'error' | 'timeout';
  errorMessage?: string;
  testResults?: TestResult[];
}

export interface TestResult {
  testCase: number;
  passed: boolean;
  input: any;
  expected: any;
  actual: any;
  error?: string;
}

export interface CodeHistory {
  id: string;
  projectId: string;
  milestoneId?: string;
  language: string;
  code: string;
  executionResult?: ExecutionResult;
  createdAt: string;
}

export interface SupportedLanguage {
  language: string;
  version: string;
  extensions: string[];
  template: string;
  examples: Record<string, string>;
}

class CodeService {
  // Code execution
  async executeCode(submission: CodeSubmission): Promise<ExecutionResult> {
    const resp: any = await apiService.post('/code/execute', submission);

    // Handle standard ApiResponse shape
    if (resp && typeof resp === 'object' && ('success' in resp || 'data' in resp)) {
      const apiSuccess = Boolean((resp as any).success);
      const apiMessage = (resp as any).message as string | undefined;
      const payload = (resp as any).data;

      // Error from server (e.g., unauthorized, validation, execution error)
      if (!apiSuccess) {
        return {
          id: String(Date.now()),
          success: false,
          output: '',
          executionTime: 0,
          memoryUsage: 0,
          status: 'error',
          errorMessage: apiMessage || 'Code execution failed',
        };
      }

      // If payload already conforms to ExecutionResult
      if (payload && typeof payload === 'object' && 'id' in payload && 'output' in payload) {
        const result = payload as ExecutionResult;
        // Ensure required fields with fallbacks
        return {
          id: String(result.id || Date.now()),
          success: Boolean(result.success),
          output: String(result.output ?? ''),
          executionTime: Number(result.executionTime ?? 0),
          memoryUsage: Number(result.memoryUsage ?? 0),
          status: (result.status as any) || (result.success ? 'completed' : 'error'),
          errorMessage: result.errorMessage || undefined,
          testResults: result.testResults,
        };
      }

      // Normalize simple payloads { output, error, executionTime }
      if (payload && typeof payload === 'object') {
        const output = (payload as any).output ? String((payload as any).output) : '';
        const errorMessage = (payload as any).error ? String((payload as any).error) : undefined;
        const executionTime = Math.round(Number((payload as any).executionTime || 0));

        return {
          id: String(Date.now()),
          success: !errorMessage,
          output,
          executionTime,
          memoryUsage: Number((payload as any).memoryUsage || 0),
          status: errorMessage ? 'error' : 'completed',
          errorMessage,
        };
      }
    }

    // Fallback: unknown shape, surface a generic error rather than pretending success
    return {
      id: String(Date.now()),
      success: false,
      output: '',
      executionTime: 0,
      memoryUsage: 0,
      status: 'error',
      errorMessage: 'Unexpected response from server',
    };
  }

  async getExecutionResult(executionId: string): Promise<ExecutionResult> {
    return apiService.get<ExecutionResult>(`/code/executions/${executionId}`);
  }

  // Code saving and history
  async saveCode(
    projectId: string, 
    milestoneId: string, 
    language: string, 
    code: string
  ): Promise<{ message: string }> {
    return apiService.post('/code/save', {
      projectId,
      milestoneId,
      language,
      code
    });
  }

  async getCodeHistory(projectId: string): Promise<CodeHistory[]> {
    return apiService.get<CodeHistory[]>(`/code/history/${projectId}`);
  }

  async getLatestCode(projectId: string, milestoneId: string): Promise<{
    code: string;
    language: string;
    lastModified: string;
  }> {
    return apiService.get(`/code/latest/${projectId}/${milestoneId}`);
  }

  // Language support
  async getSupportedLanguages(): Promise<SupportedLanguage[]> {
    return apiService.get<SupportedLanguage[]>('/code/languages');
  }

  async getLanguageTemplate(language: string): Promise<{ template: string }> {
    return apiService.get(`/code/languages/${language}/template`);
  }

  // Code validation and analysis
  async validateCode(
    language: string, 
    code: string
  ): Promise<{
    isValid: boolean;
    errors: Array<{
      line: number;
      column: number;
      message: string;
      severity: 'error' | 'warning';
    }>;
    suggestions: string[];
  }> {
    return apiService.post('/code/validate', { language, code });
  }

  async analyzeCode(
    language: string, 
    code: string
  ): Promise<{
    complexity: number;
    linesOfCode: number;
    qualityScore: number;
    suggestions: string[];
    bestPractices: Array<{
      rule: string;
      message: string;
      severity: 'info' | 'warning' | 'error';
    }>;
  }> {
    return apiService.post('/code/analyze', { language, code });
  }

  // Code sharing and collaboration
  async shareCode(
    projectId: string, 
    milestoneId: string, 
    code: string, 
    language: string
  ): Promise<{ shareUrl: string; shareId: string }> {
    return apiService.post('/code/share', {
      projectId,
      milestoneId,
      code,
      language
    });
  }

  async getSharedCode(shareId: string): Promise<{
    code: string;
    language: string;
    projectTitle: string;
    milestoneTitle: string;
    sharedBy: string;
    sharedAt: string;
  }> {
    return apiService.get(`/code/shared/${shareId}`);
  }

  // Code snippets and templates
  async getCodeSnippets(language: string): Promise<Array<{
    id: string;
    title: string;
    description: string;
    code: string;
    tags: string[];
  }>> {
    return apiService.get(`/code/snippets/${language}`);
  }

  async createCodeSnippet(data: {
    title: string;
    description: string;
    language: string;
    code: string;
    tags: string[];
    isPublic: boolean;
  }): Promise<{ id: string; message: string }> {
    return apiService.post('/code/snippets', data);
  }

  // Code submission for milestone completion
  async submitMilestoneCode(
    projectId: string,
    milestoneId: string,
    submission: {
      code: string;
      language: string;
      description?: string;
    }
  ): Promise<{
    success: boolean;
    xpAwarded: number;
    feedback?: string;
    nextMilestone?: string;
  }> {
    return apiService.post(`/projects/${projectId}/milestones/${milestoneId}/submit`, submission);
  }

  // AI-powered code assistance
  async getCodeSuggestions(
    language: string, 
    code: string, 
    cursor: { line: number; column: number }
  ): Promise<{
    suggestions: Array<{
      text: string;
      description: string;
      insertText: string;
    }>;
  }> {
    return apiService.post('/code/suggestions', { language, code, cursor });
  }

  async explainCode(
    language: string, 
    code: string
  ): Promise<{
    explanation: string;
    keyFeatures: string[];
    improvements: string[];
  }> {
    return apiService.post('/code/explain', { language, code });
  }
}

export const codeService = new CodeService();
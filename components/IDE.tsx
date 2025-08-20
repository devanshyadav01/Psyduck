import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Card, CardContent } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { FileText, Terminal } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { codeService, type CodeSubmission, type ExecutionResult, type SupportedLanguage } from '../services/codeService';
import { config } from '../config/environment';
import { IDEHeader } from './ide/IDEHeader';
import { ExecutionResultPanel } from './ide/ExecutionResult';
import { SidePanel } from './ide/SidePanel';
import CodeEditor from './ide/CodeEditor';
import { getMonacoLanguage, getDefaultCode, downloadCode } from './ide/helpers';
import { MONACO_EDITOR_CONFIG } from './ide/constants';

// Monaco Editor type declarations
declare global {
  interface Window {
    monaco: any;
    require: any;
    MonacoEnvironment?: any;
  }
}

interface IDEProps {
  projectId?: string;
  milestoneId?: string;
  initialLanguage?: string;
  initialCode?: string;
}

export function IDE({ 
  projectId = 'demo-project', 
  milestoneId = 'demo-milestone',
  initialLanguage = 'javascript',
  initialCode = ''
}: IDEProps) {
  const [isMonacoLoaded, setIsMonacoLoaded] = useState(false);
  const [monacoLoadError, setMonacoLoadError] = useState<string | null>(null);
  const [useBasicEditor, setUseBasicEditor] = useState(false);
  const [editor, setEditor] = useState<any>(null);
  const [editorModel, setEditorModel] = useState<any>(null);
  const [editorReady, setEditorReady] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState(initialLanguage);
  const [code, setCode] = useState(initialCode);
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionResult, setExecutionResult] = useState<ExecutionResult | null>(null);
  const [activeTab, setActiveTab] = useState('editor');
  const [initializationAttempts, setInitializationAttempts] = useState(0);
  
  const editorRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();
  const monacoInitRef = useRef(false);
  const editorInitRef = useRef(false);

  // Load supported languages with better error handling
  const { 
    data: supportedLanguagesData, 
    isLoading: isLoadingLanguages,
    error: languagesError 
  } = useQuery({
    queryKey: ['supported-languages'],
    queryFn: async () => {
      try {
        const languages = await codeService.getSupportedLanguages();
        console.log('✅ Loaded supported languages:', languages);
        return Array.isArray(languages) ? languages : [];
      } catch (error) {
        console.error('❌ Failed to load supported languages:', error);
        // Return default languages on error
        return [
          { language: 'javascript', version: '18.x', extensions: ['js'], template: '', examples: {} },
          { language: 'python', version: '3.11', extensions: ['py'], template: '', examples: {} },
          { language: 'java', version: '17', extensions: ['java'], template: '', examples: {} },
          { language: 'cpp', version: 'C++17', extensions: ['cpp'], template: '', examples: {} },
        ] as SupportedLanguage[];
      }
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
  });

  // Load latest code for this project/milestone
  const { data: latestCode, isLoading: isLoadingCode } = useQuery({
    queryKey: ['latest-code', projectId, milestoneId],
    queryFn: async () => {
      try {
        return await codeService.getLatestCode(projectId, milestoneId);
      } catch (error) {
        console.error('❌ Failed to load latest code:', error);
        return null;
      }
    },
    enabled: !!projectId && !!milestoneId,
    retry: 1,
  });

  // Log error if languages failed to load
  useEffect(() => {
    if (languagesError) {
      console.error('🚨 Supported languages query failed:', languagesError);
      toast.error('Failed to load supported languages. Using defaults.');
    }
  }, [languagesError]);

  // Utility functions for safe Monaco operations
  const isEditorValid = useCallback((editorInstance?: any): boolean => {
    const targetEditor = editorInstance || editor;
    return !!(
      targetEditor &&
      typeof targetEditor.getModel === 'function' &&
      (!targetEditor.isDisposed || !targetEditor.isDisposed())
    );
  }, [editor]);

  const getValidModel = useCallback((editorInstance?: any): any | null => {
    try {
      const targetEditor = editorInstance || editor;
      if (!isEditorValid(targetEditor)) {
        console.log('🔍 Editor is not valid for model retrieval');
        return null;
      }

      const model = targetEditor.getModel();
      if (!model) {
        console.log('🔍 Editor model is null');
        return null;
      }

      // Check if model has required methods
      if (typeof model.getLanguageId !== 'function' && typeof model.getModeId !== 'function') {
        console.log('🔍 Model lacks language identification methods');
        return null;
      }

      console.log('✅ Valid model retrieved');
      return model;
    } catch (error) {
      console.error('❌ Error getting model:', error);
      return null;
    }
  }, [editor, isEditorValid]);

  // FIXED: Improved Monaco Editor loading with proper NLS configuration
  useEffect(() => {
    const loadMonaco = async () => {
      if (window.monaco) {
        console.log('✅ Monaco Editor already loaded');
        setIsMonacoLoaded(true);
        setMonacoLoadError(null);
        return;
      }

      if (monacoInitRef.current) {
        console.log('🔄 Monaco Editor already loading...');
        return;
      }

      monacoInitRef.current = true;
      console.log('🔄 Loading Monaco Editor from:', config.monaco.cdnUrl);

      // Add comprehensive error suppression for worker-related errors
      const originalWindowError = window.onerror;
      const originalUnhandledRejection = window.onunhandledrejection;
      
      window.onerror = function(message, source, lineno, colno, error) {
        const msgStr = String(message);
        if (msgStr.includes('Worker') || 
            msgStr.includes('cannot be accessed from origin') ||
            msgStr.includes('Failed to construct') ||
            msgStr.includes('web worker')) {
          return true; // Prevent the error from being logged
        }
        return originalWindowError ? originalWindowError.call(this, message, source, lineno, colno, error) : false;
      };
      
      window.onunhandledrejection = function(event) {
        const reason = String(event.reason);
        if (reason.includes('Worker') || 
            reason.includes('cannot be accessed from origin') ||
            reason.includes('Failed to construct') ||
            reason.includes('web worker')) {
          event.preventDefault();
          return;
        }
        return originalUnhandledRejection ? originalUnhandledRejection.call(this, event) : undefined;
      };

      try {
        // FIXED: Comprehensive Monaco Environment setup for iframe compatibility
        window.MonacoEnvironment = {
          getWorkerUrl: function () {
            // Always return a no-op worker to prevent CORS issues
            return `data:text/javascript;charset=utf-8,${encodeURIComponent(`
              // No-op worker implementation to prevent loading errors
              self.addEventListener('message', function(e) {
                // Echo back success to prevent hangs
                if (e.data && e.data.id) {
                  self.postMessage({
                    id: e.data.id,
                    result: null,
                    error: null
                  });
                }
              });
            `)}`;
          },
          getWorker: function () {
            // Create a minimal worker that prevents errors
            try {
              return new Worker(`data:text/javascript;charset=utf-8,${encodeURIComponent(`
                // Minimal worker to prevent Monaco errors
                self.addEventListener('message', function(e) {
                  // Always respond to prevent hangs
                  self.postMessage(e.data);
                });
              `)}`);
            } catch (error) {
              // If worker creation fails, return a mock worker
              return {
                postMessage: function() {},
                terminate: function() {},
                addEventListener: function() {},
                removeEventListener: function() {}
              } as any;
            }
          }
        };

        let loaderScript = document.querySelector('script[src*="loader.js"]') as HTMLScriptElement | null;
        
        if (!loaderScript) {
          loaderScript = document.createElement('script');
          loaderScript.src = `${config.monaco.cdnUrl}/loader.js`;
          loaderScript.async = true;
          
          const loadPromise = new Promise<void>((resolve, reject) => {
            loaderScript!.onload = () => {
              console.log('✅ Monaco loader script loaded');
              resolve();
            };
            loaderScript!.onerror = (error) => {
              console.error('❌ Failed to load Monaco loader script:', error);
              reject(new Error('Failed to load Monaco loader script'));
            };
          });

          document.head.appendChild(loaderScript);
          await loadPromise;
        }

        if (window.require) {
          // FIXED: Comprehensive RequireJS configuration to prevent all loading errors
          window.require.config({ 
            paths: { 
              vs: config.monaco.cdnUrl 
            },
            // FIXED: Disable NLS and worker loading to prevent all iframe issues
            'vs/nls': {
              availableLanguages: {}
            },
            // Disable web workers entirely in iframe environments
            'vs/editor/editor.worker': 'vs/editor/editor.worker.noop',
            'vs/language/typescript/ts.worker': 'vs/language/typescript/ts.worker.noop',
            'vs/language/json/json.worker': 'vs/language/json/json.worker.noop',
            'vs/language/css/css.worker': 'vs/language/css/css.worker.noop',
            'vs/language/html/html.worker': 'vs/language/html/html.worker.noop'
          });
          
          await new Promise<void>((resolve, reject) => {
            const timeout = setTimeout(() => {
              reject(new Error('Monaco Editor loading timeout'));
            }, 20000);

            // FIXED: Load editor with proper error handling for NLS
            window.require(['vs/editor/editor.main'], () => {
              clearTimeout(timeout);
              
              // FIXED: Additional safety check and NLS override
              if (window.monaco) {
                try {
                  // Override any NLS configuration that might cause issues
                  if (window.monaco.editor && window.monaco.editor.setTheme) {
                    console.log('✅ Monaco Editor modules loaded successfully');
                  }
                } catch (nlsError) {
                  console.warn('⚠️ NLS warning (non-critical):', nlsError);
                }
              }
              
              console.log('✅ Monaco Editor loaded successfully');
              setIsMonacoLoaded(true);
              setMonacoLoadError(null);
              resolve();
            }, (error: any) => {
              clearTimeout(timeout);
              console.error('❌ Failed to load Monaco Editor modules:', error);
              reject(error);
            });
          });
        } else {
          throw new Error('RequireJS not available');
        }
      } catch (error) {
        console.error('❌ Failed to load Monaco Editor:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        setMonacoLoadError(errorMessage);
        toast.error(`Failed to load code editor: ${errorMessage}`);
      } finally {
        // Restore original error handlers
        window.onerror = originalWindowError;
        window.onunhandledrejection = originalUnhandledRejection;
        monacoInitRef.current = false;
      }
    };

    loadMonaco();
  }, []);

  // Monaco Editor initialization with better error handling
  useEffect(() => {
    // Only proceed if Monaco is loaded and we have a container
    if (!isMonacoLoaded || !editorRef.current || editorInitRef.current) {
      return;
    }

    // Prevent multiple initialization attempts
    if (initializationAttempts >= 3) {
      console.error('❌ Maximum initialization attempts reached');
      setMonacoLoadError('Failed to initialize editor after multiple attempts');
      return;
    }

    editorInitRef.current = true;
    console.log(`🔄 Initializing Monaco Editor (attempt ${initializationAttempts + 1})`);

    const initializeEditor = async () => {
      try {
        // Clear any existing state
        setEditor(null);
        setEditorModel(null);
        setEditorReady(false);

        // Small delay to ensure DOM is ready
        await new Promise(resolve => setTimeout(resolve, 50));

        if (!editorRef.current) {
          throw new Error('Editor container not available');
        }

        const initialValue = (code && code.length > 0 ? code : '') || latestCode?.code || getDefaultCode(currentLanguage);
        const initialLanguage = getMonacoLanguage(currentLanguage);

        console.log('🔄 Creating Monaco Editor with:', { initialLanguage, hasInitialValue: !!initialValue });

        // FIXED: Create editor with additional error suppression
        const monacoEditor = window.monaco.editor.create(editorRef.current, {
          value: initialValue,
          language: initialLanguage,
          ...MONACO_EDITOR_CONFIG,
          // FIXED: Additional options to prevent NLS-related issues
          automaticLayout: true,
          theme: 'vs-dark',
          // Suppress some potential error sources
          'semanticHighlighting.enabled': false,
          'suggest.showStatusBar': false,
        });

        // Wait a bit for editor to fully initialize
        await new Promise(resolve => setTimeout(resolve, 100));

        // Validate the editor was created successfully
        if (!monacoEditor) {
          throw new Error('Monaco Editor creation returned null');
        }

        // Get and validate the model
        const model = monacoEditor.getModel();
        if (!model) {
          throw new Error('Monaco Editor model is null after creation');
        }

        console.log('✅ Monaco Editor and model created successfully');

        // Ensure local code state matches what the editor shows initially
        try {
          if (!code || code.trim().length === 0) {
            setCode(initialValue || '');
          }
        } catch {}

        // Set up event handlers
        const disposable = monacoEditor.onDidChangeModelContent(() => {
          try {
            const value = monacoEditor.getValue();
            setCode(value);
          } catch (error) {
            console.warn('⚠️ Error getting editor value:', error);
          }
        });

        // Set up resize observer
        const resizeObserver = new ResizeObserver(() => {
          try {
            if (monacoEditor && !monacoEditor.isDisposed?.()) {
              monacoEditor.layout();
            }
          } catch (error) {
            console.warn('⚠️ Layout error (likely disposed editor):', error);
          }
        });
        resizeObserver.observe(editorRef.current);

        // Update state
        setEditor(monacoEditor);
        setEditorModel(model);
        setEditorReady(true);
        setInitializationAttempts(0); // Reset attempts on success

        console.log('✅ Monaco Editor fully initialized and ready');

        // Cleanup function
        return () => {
          console.log('🧹 Cleaning up Monaco Editor');
          setEditorReady(false);
          setEditorModel(null);
          editorInitRef.current = false;
          disposable?.dispose();
          resizeObserver?.disconnect();
          if (monacoEditor && !monacoEditor.isDisposed?.()) {
            monacoEditor.dispose();
          }
          setEditor(null);
        };

      } catch (error) {
        console.error('❌ Failed to initialize Monaco Editor:', error);
        
        // Increment attempts and retry if not at max
        const newAttempts = initializationAttempts + 1;
        setInitializationAttempts(newAttempts);
        editorInitRef.current = false;

        if (newAttempts < 3) {
          console.log('🔄 Retrying Monaco Editor initialization...');
          // Retry after a delay
          setTimeout(() => {
            if (!editorInitRef.current) {
              setInitializationAttempts(newAttempts);
            }
          }, 1000);
        } else {
          const errorMessage = error instanceof Error ? error.message : 'Initialization failed';
          setMonacoLoadError(`Initialization failed: ${errorMessage}`);
          toast.error('Failed to initialize code editor');
        }
      }
    };

    const cleanup = initializeEditor();
    return () => {
      cleanup?.then(cleanupFn => cleanupFn?.());
    };
  }, [isMonacoLoaded, initializationAttempts]);

  // Recreate editor when switching tabs back to Editor
  useEffect(() => {
    if (!isMonacoLoaded || !editorRef.current) return;
    // If editor is not ready but container exists, try initializing once more
    if (!editorReady && !editor && !editorInitRef.current) {
      // Trigger another init pass
      setInitializationAttempts((n) => n + 1);
    } else if (editor && editorReady) {
      try {
        editor.layout();
      } catch {}
    }
  }, [editorReady, editor, isMonacoLoaded]);

  // Update editor when latest code is loaded
  useEffect(() => {
    if (latestCode && editor && editorReady && !code && !isLoadingCode) {
      try {
        editor.setValue(latestCode.code);
        setCurrentLanguage(latestCode.language);
        setCode(latestCode.code);
        console.log('✅ Latest code loaded into editor');
      } catch (error) {
        console.error('❌ Failed to load code into editor:', error);
      }
    }
  }, [latestCode, editor, editorReady, isLoadingCode]);

  // Safe language update function
  const updateEditorLanguage = useCallback((newLanguage: string): boolean => {
    console.log('🔄 Attempting to update editor language to:', newLanguage);

    // Validate inputs
    if (!newLanguage || typeof newLanguage !== 'string') {
      console.error('❌ Invalid language provided');
      return false;
    }

    // Check if editor is ready
    if (!editorReady || !editor) {
      console.log('🔄 Editor not ready for language update');
      return false;
    }

    // Check Monaco availability
    if (!window.monaco || !window.monaco.editor) {
      console.error('❌ Monaco Editor not available');
      return false;
    }

    try {
      // Get a fresh model reference
      const model = getValidModel();
      if (!model) {
        console.error('❌ Cannot get valid editor model for language update');
        return false;
      }

      const monacoLanguage = getMonacoLanguage(newLanguage);
      
      // Get current language safely
      let currentModelLanguage: string;
      try {
        if (typeof model.getLanguageId === 'function') {
          currentModelLanguage = model.getLanguageId();
        } else if (typeof model.getModeId === 'function') {
          currentModelLanguage = model.getModeId();
        } else {
          currentModelLanguage = 'unknown';
        }
      } catch (error) {
        console.warn('⚠️ Could not get current model language:', error);
        currentModelLanguage = 'unknown';
      }
      
      // Only update if language actually changed
      if (currentModelLanguage === monacoLanguage) {
        console.log('🔄 Language already set to:', monacoLanguage);
        return true;
      }

      // Check if setModelLanguage is available
      if (typeof window.monaco.editor.setModelLanguage !== 'function') {
        console.error('❌ setModelLanguage method not available');
        return false;
      }

      // Attempt to set the language
      window.monaco.editor.setModelLanguage(model, monacoLanguage);
      
      // Verify the change was successful
      const updatedLanguage = model.getLanguageId?.() || model.getModeId?.();
      if (updatedLanguage === monacoLanguage) {
        console.log('✅ Editor language successfully updated to:', newLanguage);
        // Update our model reference
        setEditorModel(model);
        return true;
      } else {
        console.warn('⚠️ Language update may not have been successful');
        return false;
      }

    } catch (error) {
      console.error('❌ Failed to update editor language:', error);
      
      // Try fallback: recreate the model
      try {
        console.log('🔄 Attempting fallback: model recreation');
        
        if (!editor || !isEditorValid()) {
          throw new Error('Editor not valid for fallback');
        }

        const currentValue = editor.getValue();
        const monacoLanguage = getMonacoLanguage(newLanguage);
        
        if (window.monaco.editor.createModel && typeof window.monaco.editor.createModel === 'function') {
          const newModel = window.monaco.editor.createModel(currentValue, monacoLanguage);
          editor.setModel(newModel);
          setEditorModel(newModel);
          console.log('✅ Editor language updated via model recreation:', newLanguage);
          return true;
        }
      } catch (fallbackError) {
        console.error('❌ Fallback language update also failed:', fallbackError);
      }
      
      return false;
    }
  }, [editor, editorReady, getValidModel, isEditorValid]);

  // Language change effect
  useEffect(() => {
    if (currentLanguage && editorReady && editor) {
      const success = updateEditorLanguage(currentLanguage);
      if (!success) {
        console.warn('⚠️ Language update failed, but continuing...');
      }
    }
  }, [currentLanguage, editorReady, editor, updateEditorLanguage]);

  // Save code mutation
  const saveCodeMutation = useMutation({
    mutationFn: (payload: { code: string; language: string }) =>
      codeService.saveCode(projectId, milestoneId, payload.language, payload.code),
    onSuccess: () => {
      toast.success('Code saved successfully!');
      queryClient.invalidateQueries({ queryKey: ['latest-code', projectId, milestoneId] });
    },
    onError: (error) => {
      toast.error('Failed to save code');
      console.error('❌ Save error:', error);
    },
  });

  // Execute code mutation
  const executeCodeMutation = useMutation({
    mutationFn: async (submission: CodeSubmission) => {
      setIsExecuting(true);
      try {
        const result = await codeService.executeCode(submission);
        setExecutionResult(result);
        return result;
      } catch (error) {
        setIsExecuting(false);
        throw error;
      }
    },
    onSuccess: (result) => {
      setIsExecuting(false);
      setActiveTab('output');
      toast.success('Code executed successfully!');
    },
    onError: (error) => {
      setIsExecuting(false);
      toast.error('Code execution failed');
      console.error('❌ Execution error:', error);
    },
  });

  // Event handlers
  const handleSave = useCallback(() => {
    let effectiveCode = code;
    try {
      if ((!effectiveCode || !effectiveCode.trim()) && editor && typeof editor.getValue === 'function') {
        effectiveCode = editor.getValue();
        setCode(effectiveCode);
      }
    } catch {}

    if (!effectiveCode?.trim()) {
      toast.error('Cannot save empty code');
      return;
    }
    saveCodeMutation.mutate({ code: effectiveCode, language: currentLanguage });
  }, [code, editor, currentLanguage, saveCodeMutation]);

  const handleRun = useCallback(() => {
    let effectiveCode = code;
    try {
      if ((!effectiveCode || !effectiveCode.trim()) && editor && typeof editor.getValue === 'function') {
        effectiveCode = editor.getValue();
        setCode(effectiveCode);
      }
    } catch {}

    if (!effectiveCode?.trim()) {
      toast.error('Cannot execute empty code');
      return;
    }

    const submission: CodeSubmission = {
      projectId,
      milestoneId,
      language: currentLanguage,
      code: effectiveCode,
    };

    executeCodeMutation.mutate(submission);
  }, [code, editor, currentLanguage, projectId, milestoneId, executeCodeMutation]);

  // Add keyboard shortcuts for IDE actions
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ctrl+S or Cmd+S to save
      if ((event.ctrlKey || event.metaKey) && event.key === 's') {
        event.preventDefault();
        handleSave();
      }
      // Ctrl+Enter or Cmd+Enter to run
      else if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
        event.preventDefault();
        handleRun();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleSave, handleRun]);

  const handleLanguageChange = useCallback((language: string) => {
    console.log('🔄 Language change requested:', language);
    
    if (!language || language === currentLanguage) {
      console.log('🔄 Language unchanged or invalid:', language);
      return;
    }
    
    setCurrentLanguage(language);
    
    // If editor exists and ready, set default template for new language if no code
    if (editor && editorReady && (!code?.trim() || code === getDefaultCode(currentLanguage))) {
      try {
        const defaultCode = getDefaultCode(language);
        editor.setValue(defaultCode);
        setCode(defaultCode);
        console.log('✅ Default code set for language:', language);
      } catch (error) {
        console.error('❌ Failed to set default code:', error);
      }
    }
  }, [editor, editorReady, code, currentLanguage]);

  const handleDownload = useCallback(() => {
    if (code?.trim()) {
      downloadCode(code, currentLanguage);
    } else {
      toast.error('No code to download');
    }
  }, [code, currentLanguage]);

  // Ensure supportedLanguages is always an array and handle all possible states
  const supportedLanguages: SupportedLanguage[] = React.useMemo(() => {
    if (Array.isArray(supportedLanguagesData) && supportedLanguagesData.length > 0) {
      return supportedLanguagesData;
    }
    
    // Return default languages if API data is not available
    return [
      { language: 'javascript', version: '18.x', extensions: ['js'], template: '', examples: {} },
      { language: 'python', version: '3.11', extensions: ['py'], template: '', examples: {} },
      { language: 'java', version: '17', extensions: ['java'], template: '', examples: {} },
      { language: 'cpp', version: 'C++17', extensions: ['cpp'], template: '', examples: {} },
    ];
  }, [supportedLanguagesData]);

  // Render loading state
  const renderLoadingState = () => (
    <div className="h-full flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-psyduck-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">
          {monacoLoadError ? 'Failed to load editor' : 'Loading Monaco Editor...'}
        </p>
        {initializationAttempts > 0 && initializationAttempts < 3 && (
          <p className="text-xs text-muted-foreground mt-1">
            Initialization attempt {initializationAttempts + 1}/3
          </p>
        )}
        {isLoadingLanguages && (
          <p className="text-xs text-muted-foreground mt-2">Loading supported languages...</p>
        )}
        <div className="flex items-center justify-center gap-3 mt-4">
          <button 
            onClick={() => {
              setInitializationAttempts(0);
              setMonacoLoadError(null);
              editorInitRef.current = false;
            }}
            className="text-xs underline hover:no-underline"
          >
            Retry
          </button>
          <button 
            onClick={() => window.location.reload()} 
            className="text-xs underline hover:no-underline"
          >
            Reload Page
          </button>
          <button
            onClick={() => {
              if (!code || !code.trim()) {
                const fallback = getDefaultCode(currentLanguage);
                setCode(fallback);
              }
              setUseBasicEditor(true);
            }}
            className="text-xs underline hover:no-underline text-psyduck-primary"
          >
            Use basic editor
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <IDEHeader
        currentLanguage={currentLanguage}
        supportedLanguages={supportedLanguages}
        isExecuting={isExecuting}
        isSaving={saveCodeMutation.isPending}
        onLanguageChange={handleLanguageChange}
        onSave={handleSave}
        onDownload={handleDownload}
        onRun={handleRun}
        projectId={projectId}
        milestoneId={milestoneId}
      />

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Editor Panel */}
        <div className="flex-1 flex flex-col">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
            <TabsList className="w-fit m-4 mb-0">
              <TabsTrigger value="editor" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Editor
                {isMonacoLoaded && !editorReady && (
                  <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse ml-1" title="Initializing..."></div>
                )}
                {editorReady && (
                  <div className="w-2 h-2 bg-green-500 rounded-full ml-1" title="Ready"></div>
                )}
              </TabsTrigger>
              <TabsTrigger value="output" className="flex items-center gap-2">
                <Terminal className="h-4 w-4" />
                Output
                {executionResult && (
                  <Badge variant={executionResult.success ? "default" : "destructive"} className="ml-1">
                    {executionResult.success ? 'Success' : 'Error'}
                  </Badge>
                )}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="editor" className="flex-1 m-4 mt-2" forceMount>
              <Card className="h-full">
                <CardContent className="p-0 h-full">
                  {isMonacoLoaded && !monacoLoadError && !useBasicEditor ? (
                    <>
                      <div ref={editorRef} className="hidden" />
                      <CodeEditor
                        value={code}
                        language={currentLanguage}
                        className="h-full w-full"
                        onChange={setCode}
                        onReady={() => setEditorReady(true)}
                      />
                    </>
                  ) : useBasicEditor ? (
                    <CodeEditor
                      value={code}
                      language={currentLanguage}
                      className="h-full w-full"
                      onChange={setCode}
                    />
                  ) : (
                    renderLoadingState()
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="output" className="flex-1 m-4 mt-2" forceMount>
              <Card className="h-full">
                <CardContent className="p-4 h-full">
                  <ScrollArea className="h-full">
                    <ExecutionResultPanel result={executionResult} />
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Side Panel */}
        <SidePanel
          projectId={projectId}
          milestoneId={milestoneId}
          currentLanguage={currentLanguage}
        />
      </div>
    </div>
  );
}
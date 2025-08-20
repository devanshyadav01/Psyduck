import React from 'react';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { CheckCircle, XCircle, Clock, Terminal } from 'lucide-react';
import { type ExecutionResult } from '../../services/codeService';

interface ExecutionResultPanelProps {
  result: ExecutionResult | null;
}

export function ExecutionResultPanel({ result }: ExecutionResultPanelProps) {
  if (!result) {
    return (
      <div className="text-center text-muted-foreground py-8">
        <Terminal className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <p>Run your code to see output here</p>
      </div>
    );
  }

  const { success, output, executionTime, memoryUsage, status, errorMessage, testResults } = result;

  return (
    <div className="space-y-4">
      {/* Execution Status */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {success ? (
            <CheckCircle className="h-5 w-5 text-psyduck-success" />
          ) : (
            <XCircle className="h-5 w-5 text-destructive" />
          )}
          <span className="font-medium">
            {success ? 'Execution Successful' : 'Execution Failed'}
          </span>
        </div>
        <div className="flex gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            {executionTime}ms
          </span>
          <span>{Math.round(memoryUsage / 1024)}KB</span>
        </div>
      </div>

      {/* Output */}
      <div>
        <h4 className="font-medium mb-2">Output:</h4>
        <Card>
          <CardContent className="p-3">
            <pre className="text-sm font-mono whitespace-pre-wrap">
              {output || 'No output generated'}
            </pre>
          </CardContent>
        </Card>
      </div>

      {/* Error Message */}
      {errorMessage && (
        <div>
          <h4 className="font-medium mb-2 text-destructive">Error:</h4>
          <Card className="border-destructive">
            <CardContent className="p-3">
              <pre className="text-sm font-mono whitespace-pre-wrap text-destructive">
                {errorMessage}
              </pre>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Test Results */}
      {testResults && testResults.length > 0 && (
        <div>
          <h4 className="font-medium mb-2">Test Results:</h4>
          <div className="space-y-2">
            {testResults.map((result, index) => (
              <Card key={index} className={result.passed ? 'border-psyduck-success' : 'border-destructive'}>
                <CardContent className="p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">Test Case {result.testCase}</span>
                    {result.passed ? (
                      <CheckCircle className="h-4 w-4 text-psyduck-success" />
                    ) : (
                      <XCircle className="h-4 w-4 text-destructive" />
                    )}
                  </div>
                  <div className="text-sm space-y-1">
                    <div>Input: <code className="bg-muted px-1 rounded">{JSON.stringify(result.input)}</code></div>
                    <div>Expected: <code className="bg-muted px-1 rounded">{JSON.stringify(result.expected)}</code></div>
                    <div>Actual: <code className="bg-muted px-1 rounded">{JSON.stringify(result.actual)}</code></div>
                    {result.error && (
                      <div className="text-destructive">Error: {result.error}</div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
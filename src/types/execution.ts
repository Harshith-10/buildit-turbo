// Types for Turbo code execution system integration

export interface TurboTestCase {
  id: number;
  input: string;
  output: string;
}

export interface TurboSubmitRequest {
  user_id: string;
  language: string;
  code: string;
  testcases: TurboTestCase[];
}

export interface TurboTestResult {
  id: number;
  worker_id: string;
  passed: boolean;
  actual_output: string;
  error: string;
  time: string;
  memory: string;
}

export interface TurboSubmitResponse {
  passed: boolean;
  results: TurboTestResult[];
  error: string | null;
}

export interface ExecutionResult {
  success: boolean;
  passed: boolean;
  totalTests: number;
  passedTests: number;
  results: TurboTestResult[];
  compilationError?: string;
  systemError?: string;
  executionTime?: string;
}

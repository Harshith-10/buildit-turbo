// Types for BuildIT Agent integration

export interface AgentTestCase {
  id: number;
  input: string;
  expected?: string;
  timeout_ms?: number;
}

export interface AgentExecuteRequest {
  language: string;
  code: string;
  testcases: AgentTestCase[];
}

export interface AgentCaseResult {
  id: number;
  ok: boolean;
  passed: boolean;
  input: string;
  expected?: string;
  stdout: string;
  stderr: string;
  timed_out: boolean;
  duration_ms: number;
  memory_kb: number;
  exit_code?: number;
  term_signal?: number;
}

export interface AgentExecuteResponse {
  compiled: boolean;
  language: string;
  status?: 'success' | 'error' | 'timeout' | 'compile_error' | 'runtime_error' | 'unsupported_language';
  message?: string;
  results: AgentCaseResult[];
  total_duration_ms: number;
}

export interface AgentJobStatus {
  status: 'queued' | 'running' | 'completed' | 'error';
  result?: AgentExecuteResponse;
  error?: string;
}

export interface AgentSubmitResponse {
  id: number;
}

// Legacy types for backward compatibility
export interface TurboTestCase extends AgentTestCase {
  output?: string;
}

export interface TurboTestResult {
  id: number;
  worker_id: string;
  passed: boolean;
  actual_output: string;
  expected_output?: string;
  error: string;
  time: string;
  memory: string;
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

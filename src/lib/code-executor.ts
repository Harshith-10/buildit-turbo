import type {
  ExecutionResult,
  AgentTestCase,
  AgentExecuteRequest,
  AgentExecuteResponse,
  AgentJobStatus,
  AgentSubmitResponse,
  TurboTestResult,
} from "@/types/execution";

const AGENT_API_URL = process.env.AGENT_API_URL || "http://localhost:8910";
const USE_LOCAL_EXECUTION = process.env.USE_LOCAL_EXECUTION === "true";

/**
 * Execute code using the BuildIT Agent OR local execution
 * 
 * @param userId - Student/user identifier (not sent to agent)
 * @param language - Programming language ("java", "python", "rust", "javascript")
 * @param code - Source code to execute
 * @param testCases - Array of test cases with input/expected output
 * @param timeout - Request timeout in seconds (default: 120)
 * @returns ExecutionResult with detailed test case results
 */
export async function executeCode(
  userId: string,
  language: string,
  code: string,
  testCases: { id: number; input: string; expected: string }[],
  timeout = 120,
): Promise<ExecutionResult> {
  console.log("[executeCode] USE_LOCAL_EXECUTION:", USE_LOCAL_EXECUTION);
  console.log("[executeCode] Language:", language, "Test cases:", testCases.length);
  
  // Use local execution if enabled
  if (USE_LOCAL_EXECUTION) {
    console.log("[executeCode] Using local execution");
    try {
      const { executeCodeLocally } = await import("./local-code-executor");
      const result = await executeCodeLocally(userId, language, code, testCases);
      console.log("[executeCode] Local execution result:", result);
      return result;
    } catch (error) {
      console.error("[executeCode] Local execution error:", error);
      return {
        success: false,
        passed: false,
        totalTests: testCases.length,
        passedTests: 0,
        results: [],
        systemError: `Local execution error: ${error instanceof Error ? error.message : String(error)}`,
      };
    }
  }

  // Use BuildIT Agent for execution
  try {
    // Convert test cases to Agent format
    const agentTestCases: AgentTestCase[] = testCases.map((tc) => ({
      id: tc.id,
      input: tc.input,
      expected: tc.expected,
      timeout_ms: 5000, // 5 second timeout per test case
    }));

    // Prepare request payload (agent doesn't need user_id)
    const payload: AgentExecuteRequest = {
      language: language.toLowerCase(),
      code,
      testcases: agentTestCases,
    };

    console.log("[executeCode] Submitting to BuildIT Agent...");

    // Submit to Agent API
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout * 1000);

    const submitResponse = await fetch(`${AGENT_API_URL}/execute`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    // Handle non-200 responses
    if (!submitResponse.ok) {
      const errorData = await submitResponse.json().catch(() => ({ error: "Unknown error" }));
      return {
        success: false,
        passed: false,
        totalTests: testCases.length,
        passedTests: 0,
        results: [],
        systemError: `Agent error: ${errorData.error || "Failed to submit code"}`,
      };
    }

    // Get job ID
    const submitData: AgentSubmitResponse = await submitResponse.json();
    console.log("[executeCode] Job submitted, ID:", submitData.id);

    // Poll for job completion
    const result = await pollJobStatus(submitData.id, timeout);

    // Convert agent response to our format
    return mapAgentResponseToExecutionResult(result, testCases.length);
  } catch (error) {
    // Handle timeout or network errors
    if (error instanceof Error) {
      if (error.name === "AbortError") {
        return {
          success: false,
          passed: false,
          totalTests: testCases.length,
          passedTests: 0,
          results: [],
          systemError: `Execution timeout (>${timeout}s)`,
        };
      }

      return {
        success: false,
        passed: false,
        totalTests: testCases.length,
        passedTests: 0,
        results: [],
        systemError: `Network error: ${error.message}`,
      };
    }

    return {
      success: false,
      passed: false,
      totalTests: testCases.length,
      passedTests: 0,
      results: [],
      systemError: "Unknown error occurred",
    };
  }
}

/**
 * Poll job status until completion
 */
async function pollJobStatus(
  jobId: number,
  timeoutSeconds: number
): Promise<AgentExecuteResponse> {
  const startTime = Date.now();
  const maxTime = timeoutSeconds * 1000;

  while (true) {
    // Check timeout
    if (Date.now() - startTime > maxTime) {
      throw new Error("Job polling timeout");
    }

    try {
      const response = await fetch(`${AGENT_API_URL}/status/${jobId}`, {
        method: "GET",
        signal: AbortSignal.timeout(5000),
      });

      if (!response.ok) {
        throw new Error(`Failed to get job status: ${response.status}`);
      }

      const status: AgentJobStatus = await response.json();
      console.log("[pollJobStatus] Status:", status.status);

      if (status.status === "completed" && status.result) {
        return status.result;
      }

      if (status.status === "error") {
        throw new Error(status.error || "Job execution failed");
      }

      // Still running, wait before polling again
      await new Promise((resolve) => setTimeout(resolve, 500));
    } catch (error) {
      if (error instanceof Error && error.message.includes("timeout")) {
        continue; // Retry on timeout
      }
      throw error;
    }
  }
}

/**
 * Map BuildIT Agent response to our ExecutionResult format
 */
function mapAgentResponseToExecutionResult(
  agentResponse: AgentExecuteResponse,
  totalTests: number
): ExecutionResult {
  console.log("[mapAgentResponse] Full agent response:", JSON.stringify(agentResponse, null, 2));
  
  // Check for compilation errors (only if status explicitly says compile_error)
  // Note: compiled=false is normal for interpreted languages like Python
  if (agentResponse.status === "compile_error") {
    console.log("[mapAgentResponse] Compilation error detected");
    
    // Try to extract error details from message or results
    let errorMessage = agentResponse.message || "";
    
    if (!errorMessage && agentResponse.results.length > 0) {
      // Check if there's stderr in the first result
      const firstResult = agentResponse.results[0];
      if (firstResult.stderr) {
        errorMessage = firstResult.stderr;
      }
    }
    
    return {
      success: true,
      passed: false,
      totalTests,
      passedTests: 0,
      results: [],
      compilationError: errorMessage || "Compilation failed (no details provided)",
      executionTime: `${agentResponse.total_duration_ms}ms`,
    };
  }

  // Handle other errors
  if (agentResponse.status === "error" || agentResponse.status === "unsupported_language") {
    console.log("[mapAgentResponse] System error detected:", agentResponse.status);
    return {
      success: false,
      passed: false,
      totalTests,
      passedTests: 0,
      results: [],
      systemError: agentResponse.message || `Execution error: ${agentResponse.status}`,
      executionTime: `${agentResponse.total_duration_ms}ms`,
    };
  }

  // Convert agent results to our format
  const results: TurboTestResult[] = agentResponse.results.map((caseResult) => {
    const actualOutput = caseResult.stdout.trim();
    const expectedOutput = caseResult.expected;
    
    // Do our own comparison after trimming (agent compares before trimming)
    // This handles Windows line endings (\r\n) and other whitespace issues
    const ourPassed = expectedOutput 
      ? actualOutput === expectedOutput.trim()
      : caseResult.passed;
    
    // Debug logging for mismatches between agent and our comparison
    if (caseResult.passed !== ourPassed) {
      console.log(`[Test ${caseResult.id}] Agent said: ${caseResult.passed}, We say: ${ourPassed}`);
      console.log('  Expected:', JSON.stringify(expectedOutput));
      console.log('  Actual (trimmed):', JSON.stringify(actualOutput));
      console.log('  Stdout (raw):', JSON.stringify(caseResult.stdout));
    }
    
    return {
      id: caseResult.id,
      worker_id: "buildit-agent",
      passed: ourPassed, // Use our comparison result, not the agent's
      actual_output: actualOutput,
      expected_output: expectedOutput,
      error: caseResult.stderr || (caseResult.timed_out ? "Timeout" : ""),
      time: `${caseResult.duration_ms}ms`,
      memory: `${(caseResult.memory_kb / 1024).toFixed(2)}MB`,
    };
  });

  const passedTests = results.filter((r) => r.passed).length;
  const allPassed = passedTests === totalTests;

  console.log("[mapAgentResponse] Converted results:", {
    totalTests,
    passedTests,
    allPassed,
    resultCount: results.length
  });

  return {
    success: true,
    passed: allPassed,
    totalTests,
    passedTests,
    results,
    executionTime: `${agentResponse.total_duration_ms}ms`,
  };
}

/**
 * Map internal language names to agent language identifiers
 */
export function mapLanguageToTurbo(language: string): string {
  const languageMap: Record<string, string> = {
    java: "java",
    python: "python",
    python3: "python",
    javascript: "javascript",
    js: "javascript",
    rust: "rust",
    cpp: "cpp",
    "c++": "cpp",
  };

  return languageMap[language.toLowerCase()] || language.toLowerCase();
}

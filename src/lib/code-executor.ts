import type {
  ExecutionResult,
  TurboSubmitRequest,
  TurboSubmitResponse,
  TurboTestCase,
} from "@/types/execution";

const TURBO_API_URL = process.env.TURBO_API_URL || "http://localhost:3001";
const USE_LOCAL_EXECUTION = process.env.USE_LOCAL_EXECUTION === "true";

/**
 * Execute code using the Turbo distributed execution system OR local execution
 * 
 * @param userId - Student/user identifier
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

  // Use Turbo API for distributed execution
  try {
    // Convert test cases to Turbo format
    const turboTestCases: TurboTestCase[] = testCases.map((tc) => ({
      id: tc.id,
      input: tc.input,
      output: tc.expected,
    }));

    // Prepare request payload
    const payload: TurboSubmitRequest = {
      user_id: userId,
      language: language.toLowerCase(),
      code,
      testcases: turboTestCases,
    };

    // Submit to Turbo API
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout * 1000);

    const response = await fetch(`${TURBO_API_URL}/submit`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    // Handle non-200 responses (worker errors)
    if (!response.ok) {
      const errorText = await response.text();
      return {
        success: false,
        passed: false,
        totalTests: testCases.length,
        passedTests: 0,
        results: [],
        systemError: `HTTP ${response.status}: ${errorText}`,
      };
    }

    // Parse successful response
    const data: TurboSubmitResponse = await response.json();

    // Check for compilation errors
    if (data.error) {
      return {
        success: true,
        passed: false,
        totalTests: testCases.length,
        passedTests: 0,
        results: [],
        compilationError: data.error,
      };
    }

    // Calculate pass/fail statistics
    const passedTests = data.results.filter((r) => r.passed).length;

    // Extract execution time (use max time from all test cases)
    const maxTime = data.results.reduce((max, r) => {
      const time = parseExecutionTime(r.time);
      return time > max ? time : max;
    }, 0);

    return {
      success: true,
      passed: data.passed,
      totalTests: testCases.length,
      passedTests,
      results: data.results,
      executionTime: `${maxTime}ms`,
    };
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
 * Parse execution time string to milliseconds
 * @param timeStr - Time string like "0ms", "50ms", "1s"
 */
function parseExecutionTime(timeStr: string): number {
  if (!timeStr) return 0;

  const match = timeStr.match(/^(\d+(?:\.\d+)?)(ms|s)?$/);
  if (!match) return 0;

  const value = Number.parseFloat(match[1]);
  const unit = match[2];

  if (unit === "s") return value * 1000;
  return value; // default to ms
}

/**
 * Check if Turbo execution system is available
 * @returns true if system is healthy
 */
export async function checkTurboHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${TURBO_API_URL}/health`, {
      method: "GET",
      signal: AbortSignal.timeout(5000),
    });

    return response.ok && (await response.text()).trim() === "OK";
  } catch {
    return false;
  }
}

/**
 * Map internal language names to Turbo language identifiers
 */
export function mapLanguageToTurbo(language: string): string {
  const languageMap: Record<string, string> = {
    java: "java",
    python: "python",
    python3: "python",
    rust: "rust",
  };

  return languageMap[language.toLowerCase()] || language.toLowerCase();
}

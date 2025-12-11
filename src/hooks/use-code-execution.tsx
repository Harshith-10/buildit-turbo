"use client";

import { useState } from "react";
import { toast } from "sonner";
import type { ExecutionResult } from "@/types/execution";

interface UseCodeExecutionOptions {
  onRunSuccess?: (result: ExecutionResult) => void;
  onRunError?: (error: Error) => void;
  onSubmitSuccess?: (result: { passed: boolean; totalTests: number; passedTests: number }) => void;
  onSubmitError?: (error: Error) => void;
}

export function useCodeExecution(options: UseCodeExecutionOptions = {}) {
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [testResult, setTestResult] = useState<ExecutionResult | null>(null);

  /**
   * Run code against sample test cases (for practice/debugging)
   * Used by "Run Tests" button
   */
  const runTests = async (
    runAction: () => Promise<ExecutionResult>,
  ) => {
    setIsRunning(true);
    setTestResult(null);

    try {
      const result = await runAction();
      setTestResult(result);

      // Show toast notifications
      if (result.systemError) {
        toast.error(`System Error: ${result.systemError}`);
      } else if (result.compilationError) {
        toast.error("Compilation failed - check results below");
      } else if (result.passed) {
        toast.success(
          `All sample tests passed! (${result.passedTests}/${result.totalTests})`,
        );
      } else {
        toast.warning(
          `${result.passedTests}/${result.totalTests} sample tests passed`,
        );
      }

      options.onRunSuccess?.(result);
      return result;
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      toast.error("Failed to run tests");
      console.error("Run tests error:", error);
      options.onRunError?.(err);
      throw err;
    } finally {
      setIsRunning(false);
    }
  };

  /**
   * Submit code for final evaluation (runs against all test cases including hidden)
   * Used by "Submit" button
   */
  const submitCode = async (
    submitAction: () => Promise<{
      success: boolean;
      executionResult?: {
        passed: boolean;
        totalTests: number;
        passedTests: number;
        compilationError?: string;
        systemError?: string;
      };
    }>,
  ) => {
    setIsSubmitting(true);
    setTestResult(null);

    try {
      const result = await submitAction();

      if (result.executionResult) {
        const {
          passed,
          passedTests,
          totalTests,
          compilationError,
          systemError,
        } = result.executionResult;

        // Show toast notifications
        if (systemError) {
          toast.error(`System Error: ${systemError}`);
        } else if (compilationError) {
          toast.error(
            `Compilation Error: ${compilationError.slice(0, 100)}...`,
          );
        } else if (passed) {
          toast.success(
            `✅ Solution Accepted! (${passedTests}/${totalTests} tests passed)`,
          );
        } else {
          toast.error(
            `❌ Wrong Answer (${passedTests}/${totalTests} tests passed)`,
          );
        }

        options.onSubmitSuccess?.(result.executionResult);
      } else {
        toast.success("Solution submitted successfully");
      }

      return result;
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      toast.error("Failed to submit solution");
      console.error("Submit error:", error);
      options.onSubmitError?.(err);
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Clear current test results
   */
  const clearResults = () => {
    setTestResult(null);
  };

  return {
    // State
    isRunning,
    isSubmitting,
    testResult,
    isExecuting: isRunning || isSubmitting,

    // Actions
    runTests,
    submitCode,
    clearResults,
  };
}

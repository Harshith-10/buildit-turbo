"use server";

import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { db } from "@/db";
import { problems, submissions } from "@/db/schema";
import { auth } from "@/lib/auth";
import { executeCode, mapLanguageToTurbo } from "@/lib/code-executor";
import type { ExecutionResult } from "@/types/execution";

/**
 * Run code against sample (visible) test cases for practice problems
 * Used for testing/debugging during practice
 */
export async function runPracticeSampleTests(
  problemId: string,
  code: string,
  language: string,
): Promise<ExecutionResult> {
  console.log("[runPracticeSampleTests] Called with:", { problemId, language, codeLength: code.length });
  
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error("Unauthorized");
  }

  // Fetch problem
  const problem = await db.query.problems.findFirst({
    where: eq(problems.id, problemId),
  });

  if (!problem) {
    throw new Error("Problem not found");
  }

  // Filter only non-hidden test cases (sample test cases)
  const sampleTestCases = problem.testCases.filter((tc) => !tc.hidden);
  console.log("[runPracticeSampleTests] Sample test cases:", sampleTestCases.length);

  if (sampleTestCases.length === 0) {
    throw new Error("No sample test cases available");
  }

  // Execute code against sample test cases only
  console.log("[runPracticeSampleTests] Executing code...");
  const result = await executeCode(
    session.user.id,
    mapLanguageToTurbo(language),
    code,
    sampleTestCases,
  );
  console.log("[runPracticeSampleTests] Result:", result);
  return result;
}

/**
 * Submit code for practice problem (runs against all test cases including hidden)
 * Saves submission to database
 */
export async function submitPracticeProblem(
  problemId: string,
  code: string,
  language: string,
): Promise<{
  success: boolean;
  submissionId?: string;
  executionResult?: {
    passed: boolean;
    totalTests: number;
    passedTests: number;
    compilationError?: string;
    systemError?: string;
  };
}> {
  console.log("[submitPracticeProblem] Called with:", { problemId, language, codeLength: code.length });
  
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error("Unauthorized");
  }

  // Fetch problem with all test cases
  const problem = await db.query.problems.findFirst({
    where: eq(problems.id, problemId),
  });

  if (!problem) {
    throw new Error("Problem not found");
  }

  // Execute code against ALL test cases (including hidden)
  console.log("[submitPracticeProblem] Executing against all test cases:", problem.testCases.length);
  const result = await executeCode(
    session.user.id,
    mapLanguageToTurbo(language),
    code,
    problem.testCases,
  );

  // Determine status based on execution result
  let status: "accepted" | "wrong_answer" | "compilation_error" | "runtime_error" =
    "wrong_answer";
  
  if (result.compilationError) {
    status = "compilation_error";
  } else if (result.systemError) {
    status = "runtime_error";
  } else if (result.passed) {
    status = "accepted";
  }

  // Save submission to database
  console.log("[submitPracticeProblem] Saving submission with status:", status);
  const [submission] = await db
    .insert(submissions)
    .values({
      userId: session.user.id,
      problemId,
      code,
      language,
      status,
      testCaseResults: result.results,
      totalTests: result.totalTests,
      passedTests: result.passedTests,
      compilationError: result.compilationError,
      executionError: result.systemError,
    })
    .returning({ id: submissions.id });

  console.log("[submitPracticeProblem] Submission saved:", submission.id);

  return {
    success: true,
    submissionId: submission.id,
    executionResult: {
      passed: result.passed,
      totalTests: result.totalTests,
      passedTests: result.passedTests,
      compilationError: result.compilationError,
      systemError: result.systemError,
    },
  };
}

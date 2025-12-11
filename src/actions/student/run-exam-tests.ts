"use server";

import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { db } from "@/db";
import { problems } from "@/db/schema";
import { auth } from "@/lib/auth";
import { executeCode, mapLanguageToTurbo } from "@/lib/code-executor";
import type { ExecutionResult } from "@/types/execution";

/**
 * Run code against sample (visible) test cases only for exam problems
 * Used for testing/debugging during exam
 */
export async function runExamSampleTests(
  sessionId: string,
  problemId: string,
  code: string,
  language: string,
): Promise<ExecutionResult> {
  console.log("[runExamSampleTests] Called with:", { sessionId, problemId, language, codeLength: code.length });
  
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error("Unauthorized");
  }

  // Verify exam session exists
  const examSession = await db.query.examSessions.findFirst({
    where: (examSessions, { eq }) => eq(examSessions.id, sessionId),
  });

  if (!examSession) {
    throw new Error("Session not found");
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
  console.log("[runExamSampleTests] Sample test cases:", sampleTestCases.length);

  if (sampleTestCases.length === 0) {
    throw new Error("No sample test cases available");
  }

  // Execute code against sample test cases only
  console.log("[runExamSampleTests] Executing code...");
  const result = await executeCode(
    session.user.id,
    mapLanguageToTurbo(language),
    code,
    sampleTestCases,
  );
  console.log("[runExamSampleTests] Result:", result);
  return result;
}

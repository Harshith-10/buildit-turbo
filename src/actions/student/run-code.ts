"use server";

import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { db } from "@/db";
import { problems } from "@/db/schema";
import { auth } from "@/lib/auth";
import { executeCode, mapLanguageToTurbo } from "@/lib/code-executor";
import type { ExecutionResult } from "@/types/execution";

/**
 * Run code against sample (visible) test cases only
 * Used for testing/debugging before submission
 */
export async function runSampleTests(
  problemId: string,
  code: string,
  language: string,
): Promise<ExecutionResult> {
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

  if (sampleTestCases.length === 0) {
    throw new Error("No sample test cases available");
  }

  // Execute code against sample test cases
  return await executeCode(
    session.user.id,
    mapLanguageToTurbo(language),
    code,
    sampleTestCases,
  );
}

/**
 * Run code against ALL test cases (including hidden)
 * Used for final submission and grading
 */
export async function runAllTests(
  problemId: string,
  code: string,
  language: string,
): Promise<ExecutionResult> {
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

  // Execute against ALL test cases
  return await executeCode(
    session.user.id,
    mapLanguageToTurbo(language),
    code,
    problem.testCases,
  );
}

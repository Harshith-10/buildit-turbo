"use server";

import { and, eq, inArray, sql } from "drizzle-orm";
import { headers } from "next/headers";
import { db } from "@/db";
import { 
  examSessions, 
  exams, 
  examQuestions, 
  studentExamQuestions,
  examCollections 
} from "@/db/schema/exams";
import { collectionProblems, problems } from "@/db/schema";
import { submissions } from "@/db/schema/submissions";
import { auth } from "@/lib/auth";
import { executeCode, mapLanguageToTurbo } from "@/lib/code-executor";

// Helper function to assign questions to a student based on exam distribution
async function assignQuestionsToStudent(sessionId: string, examId: string) {
  const exam = await db.query.exams.findFirst({
    where: eq(exams.id, examId),
  });

  if (!exam) return;

  // Check if questions are already assigned for this session
  const existingQuestions = await db.query.studentExamQuestions.findFirst({
    where: eq(studentExamQuestions.sessionId, sessionId),
  });

  // If questions already assigned, skip
  if (existingQuestions) return;

  console.log('Exam distribution settings:', {
    questionCount: exam.questionCount,
    allowedDistributions: exam.allowedDistributions,
    marksPerDifficulty: exam.marksPerDifficulty
  });

  // If questionCount and allowedDistributions are set, use dynamic distribution
  if (exam.questionCount && exam.allowedDistributions && exam.allowedDistributions.length > 0) {
    // Get a random allowed distribution
    const distribution = exam.allowedDistributions[
      Math.floor(Math.random() * exam.allowedDistributions.length)
    ];

    console.log('Selected distribution:', distribution);

    // Fetch all available questions from examQuestions (the pool)
    const availableQuestions = await db
      .select({
        problemId: examQuestions.problemId,
        difficulty: problems.difficulty,
      })
      .from(examQuestions)
      .innerJoin(problems, eq(examQuestions.problemId, problems.id))
      .where(eq(examQuestions.examId, examId));

    // Group by difficulty
    const questionsByDifficulty = {
      easy: availableQuestions.filter(q => q.difficulty === 'easy'),
      medium: availableQuestions.filter(q => q.difficulty === 'medium'),
      hard: availableQuestions.filter(q => q.difficulty === 'hard'),
    };

    // Randomly select questions according to distribution
    const selectedQuestions: { problemId: string; difficulty: 'easy' | 'medium' | 'hard' }[] = [];
    
    // Select easy questions
    const easyQuestions = questionsByDifficulty.easy
      .sort(() => Math.random() - 0.5)
      .slice(0, distribution.easy);
    selectedQuestions.push(...easyQuestions);

    // Select medium questions
    const mediumQuestions = questionsByDifficulty.medium
      .sort(() => Math.random() - 0.5)
      .slice(0, distribution.medium);
    selectedQuestions.push(...mediumQuestions);

    // Select hard questions
    const hardQuestions = questionsByDifficulty.hard
      .sort(() => Math.random() - 0.5)
      .slice(0, distribution.hard);
    selectedQuestions.push(...hardQuestions);

    console.log('Selected questions count:', selectedQuestions.length);
    console.log('Questions by difficulty:', {
      easy: easyQuestions.length,
      medium: mediumQuestions.length, 
      hard: hardQuestions.length
    });

    // Insert into studentExamQuestions
    if (selectedQuestions.length > 0) {
      await db.insert(studentExamQuestions).values(
        selectedQuestions.map((q, index) => ({
          sessionId,
          problemId: q.problemId,
          difficulty: q.difficulty,
          points: exam.marksPerDifficulty?.[q.difficulty] || 10,
          order: index + 1,
        }))
      );
      console.log('Successfully assigned', selectedQuestions.length, 'questions to student');
    } else {
      console.error('No questions selected! This should not happen.');
    }
  } else {
    // No dynamic distribution - assign all questions from examQuestions
    const allQuestions = await db
      .select({
        problemId: examQuestions.problemId,
        points: examQuestions.points,
        order: examQuestions.order,
        difficulty: problems.difficulty,
      })
      .from(examQuestions)
      .innerJoin(problems, eq(examQuestions.problemId, problems.id))
      .where(eq(examQuestions.examId, examId));

    if (allQuestions.length > 0) {
      await db.insert(studentExamQuestions).values(
        allQuestions.map((q) => ({
          sessionId,
          problemId: q.problemId,
          difficulty: q.difficulty,
          points: q.points || 10,
          order: q.order,
        }))
      );
      console.log('Assigned all', allQuestions.length, 'questions to student (no distribution settings)');
    } else {
      console.error('No questions available in examQuestions table!');
    }
  }
}

export async function startExamSession(examSlug: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error("Unauthorized");
  }

  const userId = session.user.id;

  // Fetch exam by slug first
  const exam = await db.query.exams.findFirst({
    where: eq(exams.slug, examSlug),
  });

  if (!exam) {
    throw new Error("Exam not found");
  }

  // Check if session already exists
  const existingSession = await db.query.examSessions.findFirst({
    where: and(
      eq(examSessions.userId, userId),
      eq(examSessions.examId, exam.id),
    ),
  });

  if (existingSession) {
    return { success: true, sessionId: existingSession.id };
  }

  // Validate exam availability based on status
  if (exam.status === "draft") {
    throw new Error("This exam is not yet published");
  }

  if (exam.status === "completed" || exam.status === "missed") {
    throw new Error("This exam has ended");
  }

  // Only validate dates for upcoming/live exams if dates are set
  if (exam.startDate && exam.endDate) {
    const now = new Date();
    
    if (exam.status === "upcoming" && exam.startDate > now) {
      throw new Error("Exam has not started yet");
    }

    if (exam.status === "live" && exam.endDate < now) {
      throw new Error("Exam has ended");
    }
  }

  // Create new session
  const [newSession] = await db
    .insert(examSessions)
    .values({
      userId,
      examId: exam.id,
      startTime: new Date(),
    })
    .returning();

  // Assign questions to the student based on distribution settings
  await assignQuestionsToStudent(newSession.id, exam.id);

  return { success: true, sessionId: newSession.id };
}

export async function logMalpractice(sessionId: string, type: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error("Unauthorized");
  }

  const examSession = await db.query.examSessions.findFirst({
    where: eq(examSessions.id, sessionId),
  });

  if (!examSession) {
    throw new Error("Session not found");
  }

  const currentAttempts =
    (examSession.malpracticeAttempts as {
      type: string;
      count: number;
      events: { timestamp: number }[];
    }[]) || [];

  // Find if this type already exists
  const existingTypeIndex = currentAttempts.findIndex((a) => a.type === type);

  const newAttempts = [...currentAttempts];

  if (existingTypeIndex >= 0) {
    newAttempts[existingTypeIndex] = {
      ...newAttempts[existingTypeIndex],
      count: newAttempts[existingTypeIndex].count + 1,
      events: [
        ...newAttempts[existingTypeIndex].events,
        { timestamp: Date.now() },
      ],
    };
  } else {
    newAttempts.push({
      type,
      count: 1,
      events: [{ timestamp: Date.now() }],
    });
  }

  // Calculate total count across all malpractice types
  const totalCount = newAttempts.reduce((sum, attempt) => sum + attempt.count, 0);

  // Check if we need to auto-submit (more than 3 warnings)
  const shouldAutoSubmit = totalCount > 3;

  // Update the session
  await db
    .update(examSessions)
    .set({
      malpracticeAttempts: newAttempts,
      ...(shouldAutoSubmit && {
        terminationType: "terminated" as const,
        finishTime: new Date(),
      }),
    })
    .where(eq(examSessions.id, sessionId));

  return { success: true, totalCount, shouldAutoSubmit };
}

export async function submitExamProblem(
  sessionId: string,
  problemId: string,
  code: string,
  language: string,
) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error("Unauthorized");
  }

  const examSession = await db.query.examSessions.findFirst({
    where: eq(examSessions.id, sessionId),
  });

  if (!examSession) {
    throw new Error("Session not found");
  }

  // Fetch problem details including test cases
  const problem = await db.query.problems.findFirst({
    where: eq(problems.id, problemId),
  });

  if (!problem) {
    throw new Error("Problem not found");
  }

  // Execute code against ALL test cases (including hidden) for submission
  const executionResult = await executeCode(
    session.user.id,
    mapLanguageToTurbo(language),
    code,
    problem.testCases, // All test cases including hidden ones
  );

  // Determine submission status based on execution result
  let status: "accepted" | "wrong_answer" | "compilation_error" | "runtime_error" | "pending" = "pending";
  
  if (!executionResult.success) {
    status = "runtime_error";
  } else if (executionResult.compilationError) {
    status = "compilation_error";
  } else if (executionResult.passed) {
    status = "accepted";
  } else {
    status = "wrong_answer";
  }

  // Upsert submission with execution results
  await db
    .insert(submissions)
    .values({
      userId: session.user.id,
      examId: examSession.examId,
      problemId: problemId,
      code,
      language,
      status,
      runtime: executionResult.executionTime,
      memory: "0MB", // Turbo currently returns 0MB
      testCaseResults: executionResult.results,
      totalTests: executionResult.totalTests,
      passedTests: executionResult.passedTests,
      compilationError: executionResult.compilationError || null,
      executionError: executionResult.systemError || null,
    })
    .onConflictDoUpdate({
      target: [submissions.userId, submissions.problemId, submissions.examId],
      set: {
        code,
        language,
        status,
        runtime: executionResult.executionTime,
        memory: "0MB",
        testCaseResults: executionResult.results,
        totalTests: executionResult.totalTests,
        passedTests: executionResult.passedTests,
        compilationError: executionResult.compilationError || null,
        executionError: executionResult.systemError || null,
        createdAt: new Date(),
      },
    });

  // Return submission result with limited info (hide specific test case details for hidden tests)
  return { 
    success: true, 
    executionResult: {
      passed: executionResult.passed,
      totalTests: executionResult.totalTests,
      passedTests: executionResult.passedTests,
      compilationError: executionResult.compilationError,
      systemError: executionResult.systemError,
      // Don't expose individual test case results for submissions (security)
      // Full results are stored in DB for faculty review
    }
  };
}

export async function finishExam(sessionId: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error("Unauthorized");
  }

  const examSession = await db.query.examSessions.findFirst({
    where: eq(examSessions.id, sessionId),
  });

  if (!examSession) {
    throw new Error("Session not found");
  }

  await db
    .update(examSessions)
    .set({
      finishTime: new Date(),
      terminationType: "completed",
      status: "completed",
    })
    .where(eq(examSessions.id, sessionId));

  return { success: true };
}

// Helper function to reset an exam session (for testing/debugging)
export async function resetExamSession(examSlug: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error("Unauthorized");
  }

  const exam = await db.query.exams.findFirst({
    where: eq(exams.slug, examSlug),
  });

  if (!exam) {
    throw new Error("Exam not found");
  }

  const examSession = await db.query.examSessions.findFirst({
    where: and(
      eq(examSessions.userId, session.user.id),
      eq(examSessions.examId, exam.id),
    ),
  });

  if (examSession) {
    // Delete student questions first
    await db
      .delete(studentExamQuestions)
      .where(eq(studentExamQuestions.sessionId, examSession.id));

    // Delete the session
    await db
      .delete(examSessions)
      .where(eq(examSessions.id, examSession.id));
  }

  return { success: true };
}

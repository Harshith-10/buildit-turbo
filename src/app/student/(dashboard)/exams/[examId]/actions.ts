"use server";

import { db } from "@/db";
import { examSessions } from "@/db/schema/exams";
import { submissions } from "@/db/schema/submissions";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { eq, and } from "drizzle-orm";

export async function startExamSession(examId: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error("Unauthorized");
  }

  const userId = session.user.id;

  // Check if session already exists
  const existingSession = await db.query.examSessions.findFirst({
    where: and(
      eq(examSessions.userId, userId),
      eq(examSessions.examId, examId),
    ),
  });

  if (existingSession) {
    return { success: true, sessionId: existingSession.id };
  }

  // Create new session
  const [newSession] = await db
    .insert(examSessions)
    .values({
      userId,
      examId,
      startTime: new Date(),
    })
    .returning();

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

  const currentAttempts = (examSession.malpracticeAttempts as any[]) || [];

  // Find if this type already exists
  const existingTypeIndex = currentAttempts.findIndex((a) => a.type === type);

  let newAttempts = [...currentAttempts];

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

  await db
    .update(examSessions)
    .set({
      malpracticeAttempts: newAttempts,
    })
    .where(eq(examSessions.id, sessionId));

  return { success: true };
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

  // Upsert submission
  await db
    .insert(submissions)
    .values({
      userId: session.user.id,
      examId: examSession.examId,
      problemId: problemId,
      code,
      language,
      status: "pending",
    })
    .onConflictDoUpdate({
      target: [submissions.userId, submissions.problemId, submissions.examId],
      set: {
        code,
        language,
        status: "pending",
        createdAt: new Date(),
      },
    });

  return { success: true };
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
    })
    .where(eq(examSessions.id, sessionId));

  return { success: true };
}

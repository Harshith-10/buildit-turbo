"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { db } from "@/db";
import { examSessions, studentExamQuestions } from "@/db/schema";
import { auth } from "@/lib/auth";

// Helper to check faculty permission
async function checkFacultyAccess() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || session.user.role !== "faculty") {
    throw new Error("Unauthorized: Faculty access required");
  }

  return session.user;
}

export async function revokeExamSession(sessionId: string) {
  await checkFacultyAccess();

  // Get session details before deletion for revalidation
  const session = await db.query.examSessions.findFirst({
    where: eq(examSessions.id, sessionId),
    with: {
      exam: true,
    },
  });

  // Delete in a transaction to ensure both session and related questions are removed
  await db.transaction(async (tx) => {
    // Delete student's assigned questions for this session
    await tx
      .delete(studentExamQuestions)
      .where(eq(studentExamQuestions.sessionId, sessionId));

    // Delete the exam session
    await tx.delete(examSessions).where(eq(examSessions.id, sessionId));
  });

  // Revalidate relevant paths
  revalidatePath("/faculty/exams");
  if (session?.exam) {
    revalidatePath(`/faculty/exams/${session.exam.slug}`);
    revalidatePath(`/student/exams/${session.exam.slug}`);
  }
  revalidatePath("/student/exams/take-exam");
  revalidatePath("/student/exams/past");
  
  return { success: true };
}

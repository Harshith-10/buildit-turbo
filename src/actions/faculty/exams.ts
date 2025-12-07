"use server";

import {
  and,
  desc,
  eq,
  ilike,
  inArray,
  isNotNull,
  isNull,
  or,
  sql,
} from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { db } from "@/db";
import {
  examCollections,
  examQuestions,
  examSessions,
  exams,
  problems,
} from "@/db/schema";
import { auth } from "@/lib/auth";
import type { Distribution, MarksPerDifficulty } from "@/lib/exam-utils";

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

// Helper to generate slug
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

// ============================================================================
// Input Types
// ============================================================================

export type CreateExamInput = typeof exams.$inferInsert & {
  questions?: { problemId: string; points?: number }[];
  collections?: { collectionId: string; count?: number }[];
  // Dynamic distribution options
  questionCount?: number;
  totalMarks?: number;
  marksPerDifficulty?: MarksPerDifficulty;
  allowedDistributions?: Distribution[];
};

export type UpdateExamInput = Partial<typeof exams.$inferInsert> & {
  questions?: { problemId: string; points?: number }[];
  collections?: { collectionId: string; count?: number }[];
  // Dynamic distribution options
  questionCount?: number;
  totalMarks?: number;
  marksPerDifficulty?: MarksPerDifficulty;
  allowedDistributions?: Distribution[];
};

export async function getExams(
  page: number = 1,
  limit: number = 10,
  search?: string,
) {
  await checkFacultyAccess();
  const offset = (page - 1) * limit;

  const whereClause = and(
    isNull(exams.deletedAt),
    search
      ? or(
          ilike(exams.title, `%${search}%`),
          ilike(exams.description, `%${search}%`),
        )
      : undefined,
  );

  const [data, countResult] = await Promise.all([
    db
      .select()
      .from(exams)
      .where(whereClause)
      .limit(limit)
      .offset(offset)
      .orderBy(desc(exams.createdAt)),
    db.select({ count: sql<number>`count(*)` }).from(exams).where(whereClause),
  ]);

  return {
    data,
    total: Number(countResult[0]?.count || 0),
    page,
    limit,
    totalPages: Math.ceil(Number(countResult[0]?.count || 0) / limit),
  };
}

export async function getDeletedExams(
  page: number = 1,
  limit: number = 10,
  search?: string,
) {
  await checkFacultyAccess();
  const offset = (page - 1) * limit;

  const whereClause = and(
    isNotNull(exams.deletedAt),
    search
      ? or(
          ilike(exams.title, `%${search}%`),
          ilike(exams.description, `%${search}%`),
        )
      : undefined,
  );

  const [data, countResult] = await Promise.all([
    db
      .select()
      .from(exams)
      .where(whereClause)
      .limit(limit)
      .offset(offset)
      .orderBy(desc(exams.deletedAt)),
    db.select({ count: sql<number>`count(*)` }).from(exams).where(whereClause),
  ]);

  return {
    data,
    total: Number(countResult[0]?.count || 0),
    page,
    limit,
    totalPages: Math.ceil(Number(countResult[0]?.count || 0) / limit),
  };
}

export async function getExam(id: string) {
  await checkFacultyAccess();

  const exam = await db.query.exams.findFirst({
    where: and(eq(exams.id, id), isNull(exams.deletedAt)),
  });

  if (!exam) {
    throw new Error("Exam not found");
  }

  // Fetch questions in this exam
  const items = await db
    .select({
      problem: problems,
      order: examQuestions.order,
      points: examQuestions.points,
    })
    .from(examQuestions)
    .innerJoin(problems, eq(examQuestions.problemId, problems.id))
    .where(eq(examQuestions.examId, id))
    .orderBy(examQuestions.order);

  return {
    ...exam,
    questions: items.map((item) => ({
      ...item.problem,
      order: item.order,
      points: item.points,
    })),
  };
}

export async function getExamBySlug(slug: string) {
  await checkFacultyAccess();

  const exam = await db.query.exams.findFirst({
    where: and(eq(exams.slug, slug), isNull(exams.deletedAt)),
  });

  if (!exam) {
    throw new Error("Exam not found");
  }

  // Fetch questions in this exam
  const items = await db
    .select({
      problem: problems,
      points: examQuestions.points,
      order: examQuestions.order,
    })
    .from(examQuestions)
    .innerJoin(problems, eq(examQuestions.problemId, problems.id))
    .where(eq(examQuestions.examId, exam.id))
    .orderBy(examQuestions.order);

  return {
    ...exam,
    questions: items.map((item) => ({
      ...item.problem,
      order: item.order,
      points: item.points,
    })),
  };
}

export async function getExamSessions(examId: string) {
  await checkFacultyAccess();

  const sessions = await db.query.examSessions.findMany({
    where: eq(examSessions.examId, examId),
    with: {
      user: true,
    },
    orderBy: desc(examSessions.createdAt),
  });

  return sessions;
}

export async function createExam(data: CreateExamInput) {
  try {
    await checkFacultyAccess();

    const { questions, collections, ...examData } = data;

    const slug = generateSlug(examData.title);

    const result = await db.transaction(async (tx) => {
      const [newExam] = await tx
        .insert(exams)
        .values({
          ...examData,
          slug,
          totalQuestions: questions?.length || 0, // Initial count only includes direct questions
        })
        .returning();

      // Add directly specified questions
      if (questions && questions.length > 0) {
        // Fetch difficulty for each question to assign default points if needed
        const problemIds = questions.map((q) => q.problemId);
        await tx
          .select({ id: problems.id, difficulty: problems.difficulty })
          .from(problems)
          .where(inArray(problems.id, problemIds));

        await tx.insert(examQuestions).values(
          questions.map((q, index) => ({
            examId: newExam.id,
            problemId: q.problemId,
            order: index + 1,
            points: q.points || 10, // Default points, will be overridden by dynamic distribution if used
          })),
        );
      }

      // Link collections
      if (collections && collections.length > 0) {
        await tx.insert(examCollections).values(
          collections.map((col) => ({
            examId: newExam.id,
            collectionId: col.collectionId,
          })),
        );
      }

      return newExam;
    });

    revalidatePath("/faculty/exams");
    return { success: true, data: result };
  } catch (error) {
    console.error("Failed to create exam:", error);
    return { success: false, error: "Failed to create exam" };
  }
}

export async function updateExam(id: string, data: UpdateExamInput) {
  try {
    await checkFacultyAccess();

    const { questions, collections, ...examData } = data;

    const result = await db.transaction(async (tx) => {
      // Only update totalQuestions if we're changing questions
      // Note: totalQuestions in DB now represents "questions available in pool" roughly,
      // but for dynamic exams, 'questionCount' is the source of truth for exam length.
      const shouldUpdateQuestions = questions !== undefined;

      const [updatedExam] = await tx
        .update(exams)
        .set({
          ...examData,
          updatedAt: new Date(),
          ...(shouldUpdateQuestions && {
            totalQuestions: questions?.length || 0,
          }),
        })
        .where(eq(exams.id, id))
        .returning();

      if (shouldUpdateQuestions) {
        // Delete existing questions
        await tx.delete(examQuestions).where(eq(examQuestions.examId, id));

        // Insert new questions
        if (questions && questions.length > 0) {
          await tx.insert(examQuestions).values(
            questions.map((q, index) => ({
              examId: id,
              problemId: q.problemId,
              order: index + 1,
              points: q.points || 10,
            })),
          );
        }
      }

      if (collections !== undefined) {
        // Delete existing collections
        await tx.delete(examCollections).where(eq(examCollections.examId, id));

        // Insert new collections
        if (collections.length > 0) {
          await tx.insert(examCollections).values(
            collections.map((col) => ({
              examId: id,
              collectionId: col.collectionId,
            })),
          );
        }
      }

      return updatedExam;
    });

    revalidatePath("/faculty/exams");
    revalidatePath(`/faculty/exams/${id}`);
    return { success: true, data: result };
  } catch (error) {
    console.error("Failed to update exam:", error);
    return { success: false, error: "Failed to update exam" };
  }
}

export async function deleteExam(id: string) {
  await checkFacultyAccess();

  await db.update(exams).set({ deletedAt: new Date() }).where(eq(exams.id, id));

  revalidatePath("/faculty/exams");
  revalidatePath("/faculty/recycle-bin");
  return { success: true };
}

export async function restoreExam(id: string) {
  await checkFacultyAccess();

  await db.update(exams).set({ deletedAt: null }).where(eq(exams.id, id));

  revalidatePath("/faculty/exams");
  revalidatePath("/faculty/recycle-bin");
  return { success: true };
}

export async function permanentlyDeleteExam(id: string) {
  await checkFacultyAccess();

  await db.delete(exams).where(eq(exams.id, id));

  revalidatePath("/faculty/recycle-bin");
  return { success: true };
}

/*
// ============================================================================
// Dynamic Question Distribution Functions (Future Implementation)
// ============================================================================

/*
function shuffle<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export async function assignQuestionsToStudent(
  sessionId: string,
  examId: string,
) {
  // TODO: Implement with new schema (examCollections + examQuestions pool)
  throw new Error("Not implemented yet");
}

export async function getStudentExamQuestions(sessionId: string) {
  // TODO: Implement with new schema
  throw new Error("Not implemented yet");
}

export async function validateExamDistribution(
  questionCount: number,
  totalMarks: number,
  allowedDifficulties: any[],
) {
  // TODO: Implement if needed, or use client-side util
  return { valid: true, distributions: [] };
}
*/

"use server";

import { and, desc, eq, ilike, isNotNull, isNull, or, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { db } from "@/db";
import { problems, problemTags } from "@/db/schema";
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

export type CreateQuestionInput = typeof problems.$inferInsert & {
  tags?: string[];
};

export type UpdateQuestionInput = Partial<typeof problems.$inferInsert> & {
  tags?: string[];
};

export async function getQuestions(
  page: number = 1,
  limit: number = 10,
  search?: string,
) {
  await checkFacultyAccess();
  const offset = (page - 1) * limit;

  const whereClause = and(
    isNull(problems.deletedAt),
    search
      ? or(
          ilike(problems.title, `%${search}%`),
          ilike(problems.slug, `%${search}%`),
        )
      : undefined,
  );

  const [data, countResult] = await Promise.all([
    db
      .select()
      .from(problems)
      .where(whereClause)
      .limit(limit)
      .offset(offset)
      .orderBy(desc(problems.createdAt)),
    db
      .select({ count: sql<number>`count(*)` })
      .from(problems)
      .where(whereClause),
  ]);

  return {
    data,
    total: Number(countResult[0]?.count || 0),
    page,
    limit,
    totalPages: Math.ceil(Number(countResult[0]?.count || 0) / limit),
  };
}

export async function getDeletedQuestions(
  page: number = 1,
  limit: number = 10,
  search?: string,
) {
  const user = await checkFacultyAccess();
  const offset = (page - 1) * limit;

  const whereClause = and(
    isNotNull(problems.deletedAt),
    eq(problems.creatorId, user.id), // Only show own deleted items
    search
      ? or(
          ilike(problems.title, `%${search}%`),
          ilike(problems.slug, `%${search}%`),
        )
      : undefined,
  );

  const [data, countResult] = await Promise.all([
    db
      .select()
      .from(problems)
      .where(whereClause)
      .limit(limit)
      .offset(offset)
      .orderBy(desc(problems.deletedAt)),
    db
      .select({ count: sql<number>`count(*)` })
      .from(problems)
      .where(whereClause),
  ]);

  return {
    data,
    total: Number(countResult[0]?.count || 0),
    page,
    limit,
    totalPages: Math.ceil(Number(countResult[0]?.count || 0) / limit),
  };
}

export async function getQuestion(id: string) {
  await checkFacultyAccess();

  const question = await db.query.problems.findFirst({
    where: and(eq(problems.id, id), isNull(problems.deletedAt)),
  });

  if (!question) {
    throw new Error("Question not found");
  }

  const tags = await db
    .select()
    .from(problemTags)
    .where(eq(problemTags.problemId, id));

  return {
    ...question,
    tags: tags.map((t) => t.tag),
  };
}

export async function getQuestionBySlug(slug: string) {
  await checkFacultyAccess();

  const question = await db.query.problems.findFirst({
    where: and(eq(problems.slug, slug), isNull(problems.deletedAt)),
  });

  if (!question) {
    throw new Error("Question not found");
  }

  const tags = await db
    .select()
    .from(problemTags)
    .where(eq(problemTags.problemId, question.id));

  return {
    ...question,
    tags: tags.map((t) => t.tag),
  };
}

export async function createQuestion(data: CreateQuestionInput) {
  const user = await checkFacultyAccess();

  const { tags, ...problemData } = data;

  const result = await db.transaction(async (tx) => {
    // Get the next serial number
    const maxSerialResult = await tx
      .select({ max: sql<number>`COALESCE(MAX(${problems.serialNumber}), 0)` })
      .from(problems);
    const nextSerial = (maxSerialResult[0]?.max || 0) + 1;

    const [newQuestion] = await tx
      .insert(problems)
      .values({
        ...problemData,
        serialNumber: nextSerial,
        creatorId: user.id,
      })
      .returning();

    if (tags && tags.length > 0) {
      await tx.insert(problemTags).values(
        tags.map((tag) => ({
          problemId: newQuestion.id,
          tag,
        })),
      );
    }

    return newQuestion;
  });

  revalidatePath("/faculty/questions");
  return result;
}

export async function updateQuestion(id: string, data: UpdateQuestionInput) {
  await checkFacultyAccess();

  const { tags, ...problemData } = data;

  const result = await db.transaction(async (tx) => {
    const [updatedQuestion] = await tx
      .update(problems)
      .set({
        ...problemData,
        updatedAt: new Date(),
      })
      .where(eq(problems.id, id))
      .returning();

    if (tags) {
      // Delete existing tags
      await tx.delete(problemTags).where(eq(problemTags.problemId, id));

      // Insert new tags
      if (tags.length > 0) {
        await tx.insert(problemTags).values(
          tags.map((tag) => ({
            problemId: id,
            tag,
          })),
        );
      }
    }

    return updatedQuestion;
  });

  revalidatePath("/faculty/questions");
  revalidatePath(`/faculty/questions/${id}`);
  return result;
}

export async function deleteQuestion(id: string) {
  await checkFacultyAccess();

  await db
    .update(problems)
    .set({ deletedAt: new Date() })
    .where(eq(problems.id, id));

  revalidatePath("/faculty/questions");
  revalidatePath("/faculty/recycle-bin");
  return { success: true };
}

export async function restoreQuestion(id: string) {
  await checkFacultyAccess();

  await db.update(problems).set({ deletedAt: null }).where(eq(problems.id, id));

  revalidatePath("/faculty/questions");
  revalidatePath("/faculty/recycle-bin");
  return { success: true };
}

export async function permanentlyDeleteQuestion(id: string) {
  await checkFacultyAccess();

  await db.delete(problems).where(eq(problems.id, id));

  revalidatePath("/faculty/recycle-bin");
  return { success: true };
}

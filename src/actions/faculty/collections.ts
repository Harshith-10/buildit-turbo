"use server";

import { and, desc, eq, ilike, isNotNull, isNull, or, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { db } from "@/db";
import { collectionProblems, collections, problems } from "@/db/schema";
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

export type CreateCollectionInput = typeof collections.$inferInsert & {
  problemIds?: string[];
};

export type UpdateCollectionInput = Partial<typeof collections.$inferInsert> & {
  problemIds?: string[];
};

export async function getCollections(
  page: number = 1,
  limit: number = 10,
  search?: string,
) {
  await checkFacultyAccess();
  const offset = (page - 1) * limit;

  const whereClause = and(
    isNull(collections.deletedAt),
    search
      ? or(
          ilike(collections.title, `%${search}%`),
          ilike(collections.description, `%${search}%`),
        )
      : undefined,
  );

  const [data, countResult] = await Promise.all([
    db
      .select()
      .from(collections)
      .where(whereClause)
      .limit(limit)
      .offset(offset)
      .orderBy(desc(collections.createdAt)),
    db
      .select({ count: sql<number>`count(*)` })
      .from(collections)
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

export async function getDeletedCollections(
  page: number = 1,
  limit: number = 10,
  search?: string,
) {
  const user = await checkFacultyAccess();
  const offset = (page - 1) * limit;

  const whereClause = and(
    isNotNull(collections.deletedAt),
    eq(collections.creatorId, user.id), // Only show own deleted items
    search
      ? or(
          ilike(collections.title, `%${search}%`),
          ilike(collections.description, `%${search}%`),
        )
      : undefined,
  );

  const [data, countResult] = await Promise.all([
    db
      .select()
      .from(collections)
      .where(whereClause)
      .limit(limit)
      .offset(offset)
      .orderBy(desc(collections.deletedAt)),
    db
      .select({ count: sql<number>`count(*)` })
      .from(collections)
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

export async function getCollection(id: string) {
  await checkFacultyAccess();

  const collection = await db.query.collections.findFirst({
    where: and(eq(collections.id, id), isNull(collections.deletedAt)),
  });

  if (!collection) {
    throw new Error("Collection not found");
  }

  // Fetch problems in this collection
  const items = await db
    .select({
      problem: problems,
      order: collectionProblems.order,
    })
    .from(collectionProblems)
    .innerJoin(problems, eq(collectionProblems.problemId, problems.id))
    .where(eq(collectionProblems.collectionId, id))
    .orderBy(collectionProblems.order);

  return {
    ...collection,
    problems: items.map((item) => ({ ...item.problem, order: item.order })),
  };
}

export async function getCollectionBySlug(slug: string) {
  await checkFacultyAccess();

  const collection = await db.query.collections.findFirst({
    where: and(eq(collections.slug, slug), isNull(collections.deletedAt)),
  });

  if (!collection) {
    throw new Error("Collection not found");
  }

  // Fetch problems in this collection
  const items = await db
    .select({
      problem: problems,
      order: collectionProblems.order,
    })
    .from(collectionProblems)
    .innerJoin(problems, eq(collectionProblems.problemId, problems.id))
    .where(eq(collectionProblems.collectionId, collection.id))
    .orderBy(collectionProblems.order);

  return {
    ...collection,
    problems: items.map((item) => ({ ...item.problem, order: item.order })),
  };
}

export async function createCollection(data: CreateCollectionInput) {
  const user = await checkFacultyAccess();

  const { problemIds, ...collectionData } = data;

  const result = await db.transaction(async (tx) => {
    const [newCollection] = await tx
      .insert(collections)
      .values({
        ...collectionData,
        creatorId: user.id,
        totalQuestions: problemIds?.length || 0,
      })
      .returning();

    if (problemIds && problemIds.length > 0) {
      await tx.insert(collectionProblems).values(
        problemIds.map((problemId, index) => ({
          collectionId: newCollection.id,
          problemId,
          order: index + 1,
        })),
      );
    }

    return newCollection;
  });

  revalidatePath("/faculty/collections");
  return result;
}

export async function updateCollection(
  id: string,
  data: UpdateCollectionInput,
) {
  await checkFacultyAccess();

  const { problemIds, ...collectionData } = data;

  const result = await db.transaction(async (tx) => {
    const [updatedCollection] = await tx
      .update(collections)
      .set({
        ...collectionData,
        updatedAt: new Date(),
        totalQuestions: problemIds ? problemIds.length : undefined, // Update count if problems change
      })
      .where(eq(collections.id, id))
      .returning();

    if (problemIds) {
      // Delete existing problems
      await tx
        .delete(collectionProblems)
        .where(eq(collectionProblems.collectionId, id));

      // Insert new problems
      if (problemIds.length > 0) {
        await tx.insert(collectionProblems).values(
          problemIds.map((problemId, index) => ({
            collectionId: id,
            problemId,
            order: index + 1,
          })),
        );
      }
    }

    return updatedCollection;
  });

  revalidatePath("/faculty/collections");
  revalidatePath(`/faculty/collections/${id}`);
  return result;
}

export async function deleteCollection(id: string) {
  await checkFacultyAccess();

  await db
    .update(collections)
    .set({ deletedAt: new Date() })
    .where(eq(collections.id, id));

  revalidatePath("/faculty/collections");
  revalidatePath("/faculty/recycle-bin");
  return { success: true };
}

export async function restoreCollection(id: string) {
  await checkFacultyAccess();

  await db
    .update(collections)
    .set({ deletedAt: null })
    .where(eq(collections.id, id));

  revalidatePath("/faculty/collections");
  revalidatePath("/faculty/recycle-bin");
  return { success: true };
}

export async function permanentlyDeleteCollection(id: string) {
  await checkFacultyAccess();

  await db.delete(collections).where(eq(collections.id, id));

  revalidatePath("/faculty/recycle-bin");
  return { success: true };
}

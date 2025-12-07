"use server";

import { and, desc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { db } from "@/db";
import { user } from "@/db/schema/auth";
import { collectionProblems, collections } from "@/db/schema/collections";
import { auth } from "@/lib/auth";

export async function createCollection(data: {
  title: string;
  description: string;
  isPrivate: boolean;
  type?: "personal" | "practice_sheet" | "company";
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error("Unauthorized");
  }

  const { title, description, isPrivate, type = "personal" } = data;

  // Generate slug: username-title-random
  const username = session.user.username || session.user.id.slice(0, 8);
  const slugBase = `${username}-${title}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  const randomSuffix = Math.random().toString(36).substring(2, 6);
  const slug = `${slugBase}-${randomSuffix}`;

  // Generate secret if private
  const shareSecret = isPrivate
    ? Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15)
    : null;

  const [newCollection] = await db
    .insert(collections)
    .values({
      title,
      description,
      slug,
      creatorId: session.user.id,
      isPrivate,
      isPublic: !isPrivate, // Keeping sync for now
      shareSecret,
      type,
    })
    .returning();

  revalidatePath("/student/collections");
  return newCollection;
}

export async function getCollections(
  type: "personal" | "practice_sheet" | "company" = "personal",
) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error("Unauthorized");
  }

  if (type === "personal") {
    return db
      .select()
      .from(collections)
      .where(
        and(
          eq(collections.type, "personal"),
          eq(collections.creatorId, session.user.id),
        ),
      )
      .orderBy(desc(collections.createdAt));
  } else {
    // For practice sheets and companies, we might want to show all public ones
    // or ones created by admins/faculty. For now, showing all of that type.
    return db
      .select()
      .from(collections)
      .where(eq(collections.type, type))
      .orderBy(desc(collections.createdAt));
  }
}

export async function getCollectionBySlug(slug: string, secret?: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const [collection] = await db
    .select({
      id: collections.id,
      title: collections.title,
      description: collections.description,
      slug: collections.slug,
      creatorId: collections.creatorId,
      isPrivate: collections.isPrivate,
      shareSecret: collections.shareSecret,
      type: collections.type,
      totalQuestions: collections.totalQuestions,
      updatedAt: collections.updatedAt,
      creatorName: user.name,
      creatorUsername: user.username,
      creatorImage: user.image,
    })
    .from(collections)
    .leftJoin(user, eq(collections.creatorId, user.id))
    .where(eq(collections.slug, slug))
    .limit(1);

  if (!collection) {
    return null;
  }

  // Access control
  const isCreator = session?.user.id === collection.creatorId;
  const isPublic = !collection.isPrivate;
  const hasValidSecret = secret && collection.shareSecret === secret;

  if (!isCreator && !isPublic && !hasValidSecret) {
    throw new Error("Unauthorized access to private collection");
  }

  // Fetch problems
  const problems = await db.query.collectionProblems.findMany({
    where: eq(collectionProblems.collectionId, collection.id),
    with: {
      problem: true, // Assuming relation exists
    },
    orderBy: (collectionProblems, { asc }) => [asc(collectionProblems.order)],
  });

  return {
    ...collection,
    problems: problems.map((p) => p.problem),
    isCreator,
  };
}

export async function duplicateCollection(slug: string, secret?: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error("Unauthorized");
  }

  const sourceCollection = await getCollectionBySlug(slug, secret);
  if (!sourceCollection) {
    throw new Error("Collection not found");
  }

  // Create new collection
  const newTitle = `${sourceCollection.title} (Copy)`;
  const newCollection = await createCollection({
    title: newTitle,
    description: sourceCollection.description,
    isPrivate: true,
    type: "personal",
  });

  // Copy problems
  // We need to fetch the problem IDs from the source collection
  // getCollectionBySlug returns problems, so we can use that.

  if (sourceCollection.problems.length > 0) {
    const values = sourceCollection.problems.map((p, index) => ({
      collectionId: newCollection.id,
      problemId: p.id,
      order: index,
    }));

    await db.insert(collectionProblems).values(values);

    // Update total questions count
    await db
      .update(collections)
      .set({ totalQuestions: sourceCollection.problems.length })
      .where(eq(collections.id, newCollection.id));
  }

  revalidatePath("/student/collections");
  return newCollection;
}

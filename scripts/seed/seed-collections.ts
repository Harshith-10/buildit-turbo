import { eq } from "drizzle-orm";
import { db } from "@/db";
import { collectionProblems, collections } from "@/db/schema";

const collectionsData = [
  {
    title: "Blind 75",
    slug: "blind-75",
    description:
      "75 Essential LeetCode problems curated for interview preparation.",
    isPublic: true,
    isPrivate: false,
    topics: ["Arrays", "DP", "Graphs", "Trees"],
    totalQuestions: 75,
    type: "practice_sheet" as const,
  },
  {
    title: "Frontend Interview Prep",
    slug: "frontend-interview-prep",
    description:
      "Common frontend challenges focusing on JavaScript, React, and CSS.",
    isPublic: true,
    isPrivate: false,
    topics: ["JavaScript", "React", "CSS", "DOM"],
    totalQuestions: 30,
    type: "practice_sheet" as const,
  },
  {
    title: "Dynamic Programming Mastery",
    slug: "dp-mastery",
    description: "Comprehensive DP problems from basic to advanced patterns.",
    isPublic: true,
    isPrivate: false,
    topics: ["Dynamic Programming", "Memoization", "Tabulation"],
    totalQuestions: 50,
    type: "practice_sheet" as const,
  },
  {
    title: "Google Interview Questions",
    slug: "google-interview-questions",
    description: "Top asked questions at Google interviews across all levels.",
    isPublic: true,
    isPrivate: false,
    topics: ["Graphs", "DP", "Trees", "System Design"],
    totalQuestions: 50,
    type: "company" as const,
  },
  {
    title: "Amazon SDE 1",
    slug: "amazon-sde-1",
    description:
      "Preparation for Amazon SDE 1 role with focus on data structures.",
    isPublic: true,
    isPrivate: false,
    topics: ["Arrays", "Strings", "Trees", "OOP"],
    totalQuestions: 40,
    type: "company" as const,
  },
  {
    title: "Meta Frontend",
    slug: "meta-frontend",
    description:
      "Frontend-focused questions commonly asked at Meta interviews.",
    isPublic: true,
    isPrivate: false,
    topics: ["React", "JavaScript", "Performance", "Accessibility"],
    totalQuestions: 35,
    type: "company" as const,
  },
  {
    title: "Microsoft SDE 2",
    slug: "microsoft-sde-2",
    description: "Mid-level engineering questions from Microsoft interviews.",
    isPublic: true,
    isPrivate: false,
    topics: ["System Design", "Algorithms", "OOP", "Databases"],
    totalQuestions: 45,
    type: "company" as const,
  },
  {
    title: "My Personal Favorites",
    slug: "my-personal-favorites",
    description: "My curated collection of interesting problems to revisit.",
    isPublic: false,
    isPrivate: true,
    topics: ["Misc"],
    totalQuestions: 10,
    type: "personal" as const,
  },
];

export async function seedCollections(
  userId: string,
  problemIds: string[],
): Promise<string[]> {
  console.log("Seeding collections...");
  const collectionIds: string[] = [];

  for (const col of collectionsData) {
    const existingCol = await db.query.collections.findFirst({
      where: eq(collections.slug, col.slug),
    });

    let colId: string;
    if (!existingCol) {
      console.log(`Creating collection: ${col.title}`);
      const [insertedCol] = await db
        .insert(collections)
        .values({ ...col, creatorId: userId })
        .returning({ id: collections.id });
      colId = insertedCol.id;

      // Add problems to collection
      if (problemIds.length > 0) {
        const shuffled = [...problemIds].sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, Math.min(5, problemIds.length));
        await db.insert(collectionProblems).values(
          selected.map((pid, idx) => ({
            collectionId: colId,
            problemId: pid,
            order: idx + 1,
          })),
        );
      }
    } else {
      console.log(`Collection already exists: ${col.title}`);
      colId = existingCol.id;
    }
    collectionIds.push(colId);
  }

  return collectionIds;
}

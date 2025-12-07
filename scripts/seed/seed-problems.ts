import { eq } from "drizzle-orm";
import { db } from "@/db";
import { problems, problemTags } from "@/db/schema";
import { seedData } from "./data/problems";

export async function seedProblems(userId: string): Promise<string[]> {
  console.log("Seeding problems...");
  const problemIds: string[] = [];

  for (const p of seedData) {
    const slug = p.title
      .toLowerCase()
      .replace(/ /g, "-")
      .replace(/[^\w-]/g, "");

    const existingProblem = await db.query.problems.findFirst({
      where: eq(problems.slug, slug),
    });

    let problemId: string;

    if (!existingProblem) {
      console.log(`Creating problem: ${p.title}`);
      const [insertedProblem] = await db
        .insert(problems)
        .values({
          serialNumber: p.serialNumber,
          title: p.title,
          slug: slug,
          difficulty: p.difficulty,
          category: p.category,
          description: p.description,
          acceptance: parseFloat((Math.random() * (80 - 30) + 30).toFixed(1)),
          submissions: Math.floor(Math.random() * 10000),
          likes: Math.floor(Math.random() * 500),
          examples: p.examples,
          constraints: p.constraints,
          starterCode: p.starterCode,
          driverCode: p.driverCode,
          testCases: p.testCases,
          creatorId: userId,
        })
        .returning({ id: problems.id });
      problemId = insertedProblem.id;

      if (p.tags && p.tags.length > 0) {
        await db.insert(problemTags).values(
          p.tags.map((tag) => ({
            problemId: problemId,
            tag: tag,
          })),
        );
      }
    } else {
      console.log(`Problem already exists: ${p.title}`);
      problemId = existingProblem.id;
    }
    problemIds.push(problemId);
  }

  return problemIds;
}

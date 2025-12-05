import "dotenv/config";
import { db } from "../src/db";
import { problems, problemTags } from "../src/db/schema";
import { problems as mockProblems } from "../src/lib/mock-data";

async function seed() {
  console.log("Seeding database...");

  try {
    for (const p of mockProblems) {
      console.log(`Seeding problem: ${p.title}`);

      // Create slug from title
      const slug = p.title
        .toLowerCase()
        .replace(/ /g, "-")
        .replace(/[^\w-]/g, "");

      const [insertedProblem] = await db
        .insert(problems)
        .values({
          title: p.title,
          slug: slug,
          difficulty: p.difficulty,
          category: p.category,
          description: p.description,
          acceptance: p.acceptance,
          submissions: p.submissions,
          examples: p.examples,
          constraints: p.constraints,
          starterCode: p.starterCode,
          testCases: p.testCases,
        })
        .returning({ id: problems.id });

      if (p.tags && p.tags.length > 0) {
        await db.insert(problemTags).values(
          p.tags.map((tag) => ({
            problemId: insertedProblem.id,
            tag: tag,
          })),
        );
      }
    }
    console.log("Seeding complete.");
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
  process.exit(0);
}

seed();

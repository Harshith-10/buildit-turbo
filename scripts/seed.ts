import "dotenv/config";
import { mockProblems } from "../src/components/dashboard/mock-data";
import { db } from "../src/db";
import { problems, problemTags, exams } from "../src/db/schema";

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
          testCases: p.testCases.map((tc, index) => ({
            ...tc,
            id: index + 1,
          })),
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

    console.log("Seeding exams...");
    const examData = [
      {
        title: "Introduction to React",
        description: "Basics of React, Components, and Props",
        duration: 60,
        totalQuestions: 20,
        difficulty: "easy" as const,
        category: "development",
        status: "upcoming" as const,
        scheduledDate: new Date(Date.now() + 86400000 * 2), // 2 days from now
        startTime: new Date(Date.now() + 86400000 * 2),
        endTime: new Date(Date.now() + 86400000 * 2 + 3600000),
        rating: 0,
        ratingCount: 0,
      },
      {
        title: "Advanced TypeScript",
        description: "Generics, Utility Types, and Advanced Patterns",
        duration: 90,
        totalQuestions: 30,
        difficulty: "hard" as const,
        category: "development",
        status: "upcoming" as const,
        scheduledDate: new Date(Date.now() + 86400000 * 5), // 5 days from now
        startTime: new Date(Date.now() + 86400000 * 5),
        endTime: new Date(Date.now() + 86400000 * 5 + 5400000),
        rating: 0,
        ratingCount: 0,
      },
      {
        title: "UI/UX Design Principles",
        description: "Color Theory, Typography, and Layout",
        duration: 45,
        totalQuestions: 15,
        difficulty: "medium" as const,
        category: "design",
        status: "live" as const,
        scheduledDate: new Date(Date.now() - 1800000), // Started 30 mins ago
        startTime: new Date(Date.now() - 1800000),
        endTime: new Date(Date.now() + 1800000), // Ends in 30 mins
        rating: 0,
        ratingCount: 0,
      },
      {
        title: "Marketing Fundamentals",
        description: "SEO, Content Marketing, and Social Media",
        duration: 60,
        totalQuestions: 25,
        difficulty: "easy" as const,
        category: "marketing",
        status: "completed" as const,
        scheduledDate: new Date(Date.now() - 86400000 * 2), // 2 days ago
        startTime: new Date(Date.now() - 86400000 * 2),
        endTime: new Date(Date.now() - 86400000 * 2 + 3600000),
        rating: 20, // 4.0 average
        ratingCount: 5,
      },
      {
        title: "Data Structures & Algorithms",
        description: "Arrays, Linked Lists, Trees, and Graphs",
        duration: 120,
        totalQuestions: 50,
        difficulty: "hard" as const,
        category: "development",
        status: "missed" as const,
        scheduledDate: new Date(Date.now() - 86400000 * 5), // 5 days ago
        startTime: new Date(Date.now() - 86400000 * 5),
        endTime: new Date(Date.now() - 86400000 * 5 + 7200000),
        rating: 0,
        ratingCount: 0,
      },
    ];

    for (const exam of examData) {
      console.log(`Seeding exam: ${exam.title}`);
      await db.insert(exams).values(exam);
    }

    console.log("Seeding complete.");
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
  process.exit(0);
}

seed();

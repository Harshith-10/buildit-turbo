import "dotenv/config";
import { mockProblems } from "../src/components/dashboard/mock-data";
import { db } from "../src/db";
import {
  problems,
  problemTags,
  exams,
  user,
  collections,
  collectionProblems,
  resources,
  notifications,
  submissions,
  examQuestions,
  userExamStatus,
  userProblemStatus,
} from "../src/db/schema";
import { and, eq } from "drizzle-orm";

async function seed() {
  console.log("Seeding database...");

  try {
    // 1. Create Seed User
    const SEED_USER_EMAIL = "harshu@buildit.com";
    let seedUser = await db.query.user.findFirst({
      where: eq(user.email, SEED_USER_EMAIL),
    });

    if (!seedUser) {
      console.log("Creating seed user...");
      [seedUser] = await db
        .insert(user)
        .values({
          id: "sJ1OCvw7YEJWJtAYySoUSw9njWGOwx8p",
          name: "Harshith Doddipalli",
          email: SEED_USER_EMAIL,
          role: "student",
          username: "harshu",
          emailVerified: true,
          image: "",
          rank: 1200,
          problemsSolved: 15,
          totalProblems: 50,
          examsPassed: 2,
          totalExams: 5,
          streak: 3,
        })
        .returning();
    } else {
      console.log("Seed user already exists.");
    }

    const userId = seedUser.id;

    // 2. Seed Problems
    console.log("Seeding problems...");
    const problemIds: string[] = [];

    let serialCounter = 1;
    for (const p of mockProblems) {
      // Check if problem exists to avoid duplicates if run multiple times
      // Using slug as unique identifier
      const slug = p.title
        .toLowerCase()
        .replace(/ /g, "-")
        .replace(/[^\w-]/g, "");

      let existingProblem = await db.query.problems.findFirst({
        where: eq(problems.slug, slug),
      });

      let problemId: string;

      if (!existingProblem) {
        console.log(`Creating problem: ${p.title}`);
        const [insertedProblem] = await db
          .insert(problems)
          .values({
            serialNumber: serialCounter++,
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
            creatorId: userId, // Assign to seed user
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

    // 3. Seed Exams
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

    const examIds: string[] = [];

    for (const exam of examData) {
      // Check existence by title for simplicity
      const existingExam = await db.query.exams.findFirst({
        where: eq(exams.title, exam.title),
      });

      let examId: string;
      if (!existingExam) {
        console.log(`Creating exam: ${exam.title}`);
        const [insertedExam] = await db
          .insert(exams)
          .values(exam)
          .returning({ id: exams.id });
        examId = insertedExam.id;
      } else {
        console.log(`Exam already exists: ${exam.title}`);
        examId = existingExam.id;
      }
      examIds.push(examId);

      // Link random problems to this exam (Exam Questions)
      // Only if not already linked
      const existingQuestions = await db.query.examQuestions.findFirst({
        where: eq(examQuestions.examId, examId),
      });

      if (!existingQuestions && problemIds.length > 0) {
        console.log(`Adding questions to exam: ${exam.title}`);
        // Pick 3 random problems
        const shuffled = [...problemIds].sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, 3);

        await db.insert(examQuestions).values(
          selected.map((pid, idx) => ({
            examId: examId,
            problemId: pid,
            order: idx + 1,
            points: 10,
          })),
        );
      }
    }

    // 4. Seed Collections
    console.log("Seeding collections...");
    const collectionsData = [
      {
        title: "Blind 75",
        slug: "blind-75",
        description: "75 Essential LeetCode problems",
        isPublic: true,
        creatorId: userId,
        topics: ["Arrays", "DP", "Graphs"],
        totalQuestions: 75,
      },
      {
        title: "Frontend Interview Prep",
        slug: "frontend-interview-prep",
        description: "Common frontend challenges",
        isPublic: true,
        creatorId: userId,
        topics: ["JavaScript", "React", "CSS"],
        totalQuestions: 30,
      },
    ];

    for (const col of collectionsData) {
      const existingCol = await db.query.collections.findFirst({
        where: eq(collections.slug, col.slug),
      });

      let colId: string;
      if (!existingCol) {
        console.log(`Creating collection: ${col.title}`);
        const [insertedCol] = await db
          .insert(collections)
          .values(col)
          .returning({ id: collections.id });
        colId = insertedCol.id;

        // Add problems to collection
        if (problemIds.length > 0) {
          const shuffled = [...problemIds].sort(() => 0.5 - Math.random());
          const selected = shuffled.slice(0, 5);
          await db.insert(collectionProblems).values(
            selected.map((pid, idx) => ({
              collectionId: colId,
              problemId: pid,
              order: idx + 1,
            })),
          );
        }
      }
    }

    // 5. Seed Resources
    console.log("Seeding resources...");
    const resourcesData = [
      {
        title: "System Design Primer",
        url: "https://github.com/donnemartin/system-design-primer",
        type: "link",
        uploadedBy: userId,
      },
      {
        title: "React Documentation",
        url: "https://react.dev",
        type: "link",
        uploadedBy: userId,
      },
      {
        title: "Introduction to Algorithms (CLRS)",
        url: "https://example.com/clrs.pdf",
        type: "pdf",
        uploadedBy: userId,
      },
    ];

    for (const res of resourcesData) {
      // Simple check to avoid massive duplication
      const existingRes = await db.query.resources.findFirst({
        where: eq(resources.title, res.title),
      });
      if (!existingRes) {
        await db.insert(resources).values(res);
      }
    }

    // 6. Seed Notifications
    console.log("Seeding notifications...");
    const notificationsData = [
      {
        userId: userId,
        title: "Welcome!",
        message: "Welcome to the platform. Start solving problems now!",
        type: "info" as const,
        isRead: false,
      },
      {
        userId: userId,
        title: "Exam Reminder",
        message: "Your 'Introduction to React' exam is starting soon.",
        type: "warning" as const,
        isRead: false,
      },
      {
        userId: userId,
        title: "New Problem Added",
        message:
          "Check out the new problem 'Count Partitions with Even Sum Difference'.",
        type: "info" as const,
        isRead: false,
      },
      {
        userId: userId,
        title: "Streak Maintained",
        message: "You have maintained your 3-day streak! Keep it up!",
        type: "success" as const,
        isRead: false,
      },
      {
        userId: userId,
        title: "System Maintenance",
        message: "Scheduled maintenance on Sunday at 2:00 AM UTC.",
        type: "warning" as const,
        isRead: false,
      },
      {
        userId: userId,
        title: "New Badge Earned",
        message: "You earned the 'Problem Solver' badge!",
        type: "success" as const,
        isRead: false,
      },
      {
        userId: userId,
        title: "Course Recommendation",
        message:
          "Based on your recent activity, we recommend 'Advanced React Patterns'.",
        type: "info" as const,
        isRead: false,
      },
      {
        userId: userId,
        title: "Profile Update",
        message: "Don't forget to update your profile with your latest skills.",
        type: "info" as const,
        isRead: false,
      },
      {
        userId: userId,
        title: "Community Challenge",
        message: "Join the weekly coding challenge and win prizes!",
        type: "info" as const,
        isRead: false,
      },
      {
        userId: userId,
        title: "Feedback Request",
        message: "How was your experience with the last exam? Let us know!",
        type: "info" as const,
        isRead: false,
      },
    ];

    // Insert notifications if they don't exist
    for (const notif of notificationsData) {
      const existing = await db.query.notifications.findFirst({
        where: and(
          eq(notifications.userId, userId),
          eq(notifications.title, notif.title),
        ),
      });
      if (!existing) {
        await db.insert(notifications).values(notif);
      }
    }

    // 7. Seed Submissions & User Status
    console.log("Seeding submissions and user status...");
    if (problemIds.length > 0) {
      const solvedProblemId = problemIds[0];
      const attemptedProblemId = problemIds[1];

      // Check if submission exists
      const existingSub = await db.query.submissions.findFirst({
        where: eq(submissions.userId, userId),
      });

      if (!existingSub) {
        // Solved Submission
        await db.insert(submissions).values({
          userId: userId,
          problemId: solvedProblemId,
          code: "function solution() { return true; }",
          language: "javascript",
          status: "accepted",
          runtime: "50ms",
          memory: "10MB",
        });

        // Failed Submission
        await db.insert(submissions).values({
          userId: userId,
          problemId: attemptedProblemId,
          code: "function solution() { return false; }",
          language: "javascript",
          status: "wrong_answer",
          runtime: "45ms",
          memory: "12MB",
        });
      }

      // User Problem Status
      await db
        .insert(userProblemStatus)
        .values([
          {
            userId: userId,
            problemId: solvedProblemId,
            isSolved: true,
            isBookmarked: true,
            lastAttemptAt: new Date(),
          },
          {
            userId: userId,
            problemId: attemptedProblemId,
            isSolved: false,
            isBookmarked: false,
            lastAttemptAt: new Date(),
          },
        ])
        .onConflictDoNothing(); // In case we run seed again
    }

    if (examIds.length > 0) {
      const examId = examIds[0];
      await db
        .insert(userExamStatus)
        .values({
          userId: userId,
          examId: examId,
          status: "upcoming",
          score: 0,
          maxScore: 100,
          passed: false,
        })
        .onConflictDoNothing();
    }

    console.log("Seeding complete.");
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
  process.exit(0);
}

seed();

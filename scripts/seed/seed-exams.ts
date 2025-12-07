import { eq } from "drizzle-orm";
import { db } from "@/db";
import { examQuestions, exams } from "@/db/schema";

const examData = [
  {
    title: "Introduction to React",
    slug: "introduction-to-react",
    description:
      "Test your knowledge of React fundamentals. Props, and State management fundamentals for beginners.",
    duration: 60,
    totalQuestions: 20,
    difficulty: "easy" as const,
    category: "development",
    status: "upcoming" as const,
    startDate: new Date(Date.now() + 86400000 * 2),
    endDate: new Date(Date.now() + 86400000 * 2 + 3600000),
    topics: ["React", "Components", "Props", "State"],
    rating: 0,
    ratingCount: 0,
    questionCount: 20,
    totalMarks: 100,
    marksPerDifficulty: { easy: 5, medium: 10, hard: 15 },
    allowedDistributions: [{ easy: 20, medium: 0, hard: 0 }],
  },
  {
    title: "Advanced TypeScript",
    slug: "advanced-typescript",
    description:
      "Deep dive into TypeScript types and generics. Utility Types, Advanced Patterns, and Type Inference in TypeScript.",
    duration: 90,
    totalQuestions: 30,
    difficulty: "hard" as const,
    category: "development",
    status: "upcoming" as const,
    startDate: new Date(Date.now() + 86400000 * 5),
    endDate: new Date(Date.now() + 86400000 * 5 + 5400000),
    topics: ["TypeScript", "Generics", "Utility Types"],
    rating: 0,
    ratingCount: 0,
    questionCount: 30,
    totalMarks: 150,
    marksPerDifficulty: { easy: 5, medium: 10, hard: 15 },
    allowedDistributions: [{ easy: 0, medium: 0, hard: 10 }],
  },
  {
    title: "UI/UX Design Principles",
    slug: "ui-ux-design-principles",
    description:
      "Core concepts of user interface and experience design.raphy, Layout, and User Experience best practices.",
    duration: 45,
    totalQuestions: 15,
    difficulty: "medium" as const,
    category: "design",
    status: "live" as const,
    startDate: new Date(Date.now() - 1800000),
    endDate: new Date(Date.now() + 1800000),
    topics: ["Color Theory", "Typography", "Layout"],
    rating: 0,
    ratingCount: 0,
    questionCount: 15,
    totalMarks: 75,
    marksPerDifficulty: { easy: 5, medium: 10, hard: 15 },
    allowedDistributions: [{ easy: 5, medium: 5, hard: 0 }],
  },
  {
    title: "Marketing Fundamentals",
    slug: "marketing-fundamentals",
    description:
      "Basics of digital marketing and strategy. Social Media Strategy, and Analytics.",
    duration: 60,
    totalQuestions: 25,
    difficulty: "easy" as const,
    category: "marketing",
    status: "completed" as const,
    startDate: new Date(Date.now() - 86400000 * 2),
    endDate: new Date(Date.now() - 86400000 * 2 + 3600000),
    topics: ["SEO", "Content Marketing", "Social Media"],
    rating: 20,
    ratingCount: 5,
    questionCount: 25,
    totalMarks: 125,
    marksPerDifficulty: { easy: 5, medium: 10, hard: 15 },
    allowedDistributions: [{ easy: 25, medium: 0, hard: 0 }],
  },
  {
    title: "Data Structures & Algorithms",
    slug: "data-structures-algorithms",
    description:
      "Essential DSA concepts for interviews. Trees, Graphs, and Time Complexity Analysis.",
    duration: 120,
    totalQuestions: 50,
    difficulty: "hard" as const,
    category: "development",
    status: "missed" as const,
    startDate: new Date(Date.now() - 86400000 * 5),
    endDate: new Date(Date.now() - 86400000 * 5 + 7200000),
    topics: ["Arrays", "Trees", "Graphs", "Algorithms"],
    rating: 0,
    ratingCount: 0,
    questionCount: 50,
    totalMarks: 250,
    marksPerDifficulty: { easy: 5, medium: 10, hard: 15 },
    allowedDistributions: [{ easy: 10, medium: 20, hard: 20 }],
  },
  {
    title: "Python for Data Science",
    slug: "python-for-data-science",
    description:
      "Introduction to Python libraries for data analysis. and basic machine learning concepts.",
    duration: 75,
    totalQuestions: 25,
    difficulty: "medium" as const,
    category: "development",
    status: "completed" as const,
    startDate: new Date(Date.now() - 86400000 * 7),
    endDate: new Date(Date.now() - 86400000 * 7 + 4500000),
    topics: ["Python", "NumPy", "Pandas", "ML Basics"],
    rating: 42,
    ratingCount: 10,
    questionCount: 25,
    totalMarks: 125,
    marksPerDifficulty: { easy: 5, medium: 10, hard: 15 },
    allowedDistributions: [{ easy: 5, medium: 10, hard: 10 }],
  },
  {
    title: "System Design Basics",
    slug: "system-design-basics",
    description: "Scalability, load balancing, and database design. patterns.",
    duration: 90,
    totalQuestions: 20,
    difficulty: "hard" as const,
    category: "development",
    status: "draft" as const,
    startDate: new Date(Date.now() + 86400000 * 10),
    endDate: new Date(Date.now() + 86400000 * 10 + 3600000),
    topics: ["Scalability", "Caching", "Database Design"],
    rating: 0,
    ratingCount: 0,
    questionCount: 20,
    totalMarks: 100,
    marksPerDifficulty: { easy: 5, medium: 10, hard: 15 },
    allowedDistributions: [{ easy: 0, medium: 10, hard: 10 }],
  },
  {
    title: "JavaScript Fundamentals",
    slug: "javascript-fundamentals",
    description:
      "Core concepts of JavaScript language. Functions, Closures, Promises, and ES6+ features.",
    duration: 45,
    totalQuestions: 30,
    difficulty: "easy" as const,
    category: "development",
    status: "upcoming" as const,
    startDate: new Date(Date.now() + 86400000 * 1),
    endDate: new Date(Date.now() + 86400000 * 1 + 2700000),
    topics: ["JavaScript", "ES6", "Async/Await"],
    rating: 0,
    ratingCount: 0,
    questionCount: 30,
    totalMarks: 150,
    marksPerDifficulty: { easy: 5, medium: 10, hard: 15 },
    allowedDistributions: [{ easy: 30, medium: 0, hard: 0 }],
  },
];

export async function seedExams(problemIds: string[]): Promise<string[]> {
  console.log("Seeding exams...");
  const examIds: string[] = [];

  for (const exam of examData) {
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

    // Link random problems to this exam
    const existingQuestions = await db.query.examQuestions.findFirst({
      where: eq(examQuestions.examId, examId),
    });

    if (!existingQuestions && problemIds.length > 0) {
      console.log(`Adding questions to exam: ${exam.title}`);
      const shuffled = [...problemIds].sort(() => 0.5 - Math.random());
      const selected = shuffled.slice(0, Math.min(5, problemIds.length));

      await db.insert(examQuestions).values(
        selected.map((pid, idx) => ({
          examId: examId,
          problemId: pid,
          order: idx + 1,
          points: 10 + idx * 5,
        })),
      );
    }
  }

  return examIds;
}

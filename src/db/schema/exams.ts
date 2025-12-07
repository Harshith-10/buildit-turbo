import { relations } from "drizzle-orm";
import {
  boolean,
  integer,
  jsonb,
  pgTable,
  primaryKey,
  text,
  timestamp,
  unique,
  uuid,
} from "drizzle-orm/pg-core";
import { user } from "./auth";
import { collections } from "./collections";
import { difficultyEnum, examStatusEnum } from "./enums";
import { problems } from "./problems";

export const exams = pgTable("exams", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description").notNull(),
  duration: integer("duration").notNull(), // in minutes
  totalQuestions: integer("total_questions").notNull(),
  difficulty: difficultyEnum("difficulty").notNull(),
  category: text("category").notNull(),

  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  status: examStatusEnum("status").default("draft").notNull(),

  topics: jsonb("topics").$type<string[]>().default([]),

  // Dynamic distribution configuration
  questionCount: integer("question_count"), // Number of questions per student
  totalMarks: integer("total_marks"), // Total marks for the exam

  marksPerDifficulty: jsonb("marks_per_difficulty")
    .$type<{ easy: number; medium: number; hard: number }>()
    .default({ easy: 0, medium: 0, hard: 0 }),

  allowedDistributions: jsonb("allowed_distributions")
    .$type<{ easy: number; medium: number; hard: number }[]>()
    .default([]),

  rating: integer("rating").default(0),
  ratingCount: integer("rating_count").default(0),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  deletedAt: timestamp("deleted_at"),
});

export const examCollections = pgTable(
  "exam_collections",
  {
    examId: uuid("exam_id")
      .references(() => exams.id, { onDelete: "cascade" })
      .notNull(),
    collectionId: uuid("collection_id")
      .references(() => collections.id, { onDelete: "cascade" })
      .notNull(),
  },
  (t) => [primaryKey({ columns: [t.examId, t.collectionId] })],
);

export const examQuestions = pgTable(
  "exam_questions",
  {
    examId: uuid("exam_id")
      .references(() => exams.id, { onDelete: "cascade" })
      .notNull(),
    problemId: uuid("problem_id")
      .references(() => problems.id, { onDelete: "cascade" })
      .notNull(),
    order: integer("order").notNull(),
    points: integer("points").default(10),
  },
  (t) => [primaryKey({ columns: [t.examId, t.problemId] })],
);

export const examSessions = pgTable(
  "exam_sessions",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: text("user_id")
      .references(() => user.id, { onDelete: "cascade" })
      .notNull(),
    examId: uuid("exam_id")
      .references(() => exams.id, { onDelete: "cascade" })
      .notNull(),
    status: examStatusEnum("status").default("upcoming"),
    score: integer("score"),
    maxScore: integer("max_score"),
    passed: boolean("passed").default(false),
    startTime: timestamp("start_time"),
    finishTime: timestamp("finish_time"),
    terminationType: text("termination_type", {
      enum: ["completed", "terminated"],
    }),
    malpracticeAttempts: jsonb("malpractice_attempts")
      .$type<
        {
          type: string;
          count: number;
          events: { timestamp: number; duration?: number }[];
        }[]
      >()
      .default([]),
    rated: boolean("rated").default(false),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => [unique().on(t.userId, t.examId)],
);

// Per-student question assignments for dynamic distribution
export const studentExamQuestions = pgTable(
  "student_exam_questions",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    sessionId: uuid("session_id")
      .references(() => examSessions.id, { onDelete: "cascade" })
      .notNull(),
    problemId: uuid("problem_id")
      .references(() => problems.id, { onDelete: "cascade" })
      .notNull(),
    difficulty: difficultyEnum("difficulty").notNull(),
    points: integer("points").notNull(),
    order: integer("order").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => [unique().on(t.sessionId, t.problemId)],
);

export const examsRelations = relations(exams, ({ many }) => ({
  questions: many(examQuestions),
  collections: many(examCollections),
  sessions: many(examSessions),
}));

export const examCollectionsRelations = relations(
  examCollections,
  ({ one }) => ({
    exam: one(exams, {
      fields: [examCollections.examId],
      references: [exams.id],
    }),
    collection: one(collections, {
      fields: [examCollections.collectionId],
      references: [collections.id],
    }),
  }),
);

export const examSessionsRelations = relations(
  examSessions,
  ({ one, many }) => ({
    user: one(user, {
      fields: [examSessions.userId],
      references: [user.id],
    }),
    exam: one(exams, {
      fields: [examSessions.examId],
      references: [exams.id],
    }),
    studentQuestions: many(studentExamQuestions),
  }),
);

export const studentExamQuestionsRelations = relations(
  studentExamQuestions,
  ({ one }) => ({
    session: one(examSessions, {
      fields: [studentExamQuestions.sessionId],
      references: [examSessions.id],
    }),
    problem: one(problems, {
      fields: [studentExamQuestions.problemId],
      references: [problems.id],
    }),
  }),
);

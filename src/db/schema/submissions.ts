import { relations } from "drizzle-orm";
import {
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  unique,
  uuid,
} from "drizzle-orm/pg-core";
import { user } from "./auth";
import { submissionStatusEnum } from "./enums";
import { exams } from "./exams";
import { problems } from "./problems";

export const submissions = pgTable(
  "submissions",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: text("user_id")
      .references(() => user.id, { onDelete: "cascade" })
      .notNull(),
    problemId: uuid("problem_id")
      .references(() => problems.id, { onDelete: "cascade" })
      .notNull(),
    examId: uuid("exam_id").references(() => exams.id, {
      onDelete: "set null",
    }),

    code: text("code").notNull(),
    language: text("language").notNull(),
    status: submissionStatusEnum("status").default("pending").notNull(),

    runtime: text("runtime"), // e.g. "50ms"
    memory: text("memory"), // e.g. "14.2MB"

    // Execution results from Turbo system
    testCaseResults: jsonb("test_case_results").$type<
      {
        id: number;
        passed: boolean;
        actual_output: string;
        error: string;
        time: string;
        memory: string;
      }[]
    >(),
    totalTests: integer("total_tests"),
    passedTests: integer("passed_tests"),
    compilationError: text("compilation_error"),
    executionError: text("execution_error"),

    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => [unique().on(t.userId, t.problemId, t.examId)],
);

export const submissionsRelations = relations(submissions, ({ one }) => ({
  user: one(user, {
    fields: [submissions.userId],
    references: [user.id],
  }),
  problem: one(problems, {
    fields: [submissions.problemId],
    references: [problems.id],
  }),
  exam: one(exams, {
    fields: [submissions.examId],
    references: [exams.id],
  }),
}));

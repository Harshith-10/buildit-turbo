import { relations } from "drizzle-orm";
import {
  boolean,
  integer,
  jsonb,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { user } from "./auth";
import { difficultyEnum, examStatusEnum } from "./enums";
import { problems } from "./problems";

export const exams = pgTable("exams", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  duration: integer("duration").notNull(), // in minutes
  totalQuestions: integer("total_questions").notNull(),
  difficulty: difficultyEnum("difficulty").notNull(),
  category: text("category").notNull(),

  scheduledDate: timestamp("scheduled_date"),
  startTime: timestamp("start_time"),
  endTime: timestamp("end_time"),
  status: examStatusEnum("status").default("draft").notNull(),

  topics: jsonb("topics").$type<string[]>().default([]),

  rating: integer("rating").default(0),
  ratingCount: integer("rating_count").default(0),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

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

export const userExamStatus = pgTable(
  "user_exam_status",
  {
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
    startedAt: timestamp("started_at"),
    completedAt: timestamp("completed_at"),
  },
  (t) => [primaryKey({ columns: [t.userId, t.examId] })],
);

export const examsRelations = relations(exams, ({ many }) => ({
  questions: many(examQuestions),
  userStatuses: many(userExamStatus),
}));

export const userExamStatusRelations = relations(userExamStatus, ({ one }) => ({
  user: one(user, {
    fields: [userExamStatus.userId],
    references: [user.id],
  }),
  exam: one(exams, {
    fields: [userExamStatus.examId],
    references: [exams.id],
  }),
}));

import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { submissionStatusEnum } from "./enums";
import { exams } from "./exams";
import { problems } from "./problems";
import { users } from "./users";

export const submissions = pgTable("submissions", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  problemId: uuid("problem_id")
    .references(() => problems.id, { onDelete: "cascade" })
    .notNull(),
  examId: uuid("exam_id").references(() => exams.id, { onDelete: "set null" }),

  code: text("code").notNull(),
  language: text("language").notNull(),
  status: submissionStatusEnum("status").default("pending").notNull(),

  runtime: text("runtime"), // e.g. "50ms"
  memory: text("memory"), // e.g. "14.2MB"

  createdAt: timestamp("created_at").defaultNow().notNull(),
});

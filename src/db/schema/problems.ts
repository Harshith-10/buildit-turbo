import {
  boolean,
  integer,
  jsonb,
  pgTable,
  primaryKey,
  real,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { user } from "./auth";
import { difficultyEnum } from "./enums";

export const problems = pgTable("problems", {
  id: uuid("id").defaultRandom().primaryKey(),
  serialNumber: integer("serial_number").notNull().unique(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  difficulty: difficultyEnum("difficulty").notNull(),
  category: text("category").notNull(),
  description: text("description").notNull(),

  creatorId: text("creator_id").references(() => user.id, {
    onDelete: "set null",
  }),
  isPublic: boolean("is_public").default(true).notNull(),

  acceptance: real("acceptance").default(0),
  submissions: integer("submissions").default(0),

  examples: jsonb("examples")
    .$type<{ input: string; output: string; explanation?: string }[]>()
    .notNull(),
  constraints: jsonb("constraints").$type<string[]>().notNull(),
  starterCode: jsonb("starter_code").$type<Record<string, string>>().notNull(),
  testCases: jsonb("test_cases")
    .$type<{ id: number; input: string; expected: string }[]>()
    .notNull(),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const problemTags = pgTable(
  "problem_tags",
  {
    problemId: uuid("problem_id")
      .references(() => problems.id, { onDelete: "cascade" })
      .notNull(),
    tag: text("tag").notNull(),
  },
  (t) => [primaryKey({ columns: [t.problemId, t.tag] })],
);

export const userProblemStatus = pgTable(
  "user_problem_status",
  {
    userId: text("user_id")
      .references(() => user.id, { onDelete: "cascade" })
      .notNull(),
    problemId: uuid("problem_id")
      .references(() => problems.id, { onDelete: "cascade" })
      .notNull(),
    isSolved: boolean("is_solved").default(false),
    isBookmarked: boolean("is_bookmarked").default(false),
    lastAttemptAt: timestamp("last_attempt_at"),
  },
  (t) => [primaryKey({ columns: [t.userId, t.problemId] })],
);

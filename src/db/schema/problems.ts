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
import { difficultyEnum } from "./enums";
import { users } from "./users";

export const problems = pgTable("problems", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  difficulty: difficultyEnum("difficulty").notNull(),
  category: text("category").notNull(),
  description: text("description").notNull(),

  creatorId: uuid("creator_id").references(() => users.id, {
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
    userId: uuid("user_id")
      .references(() => users.id, { onDelete: "cascade" })
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

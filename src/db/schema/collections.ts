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
import { problems } from "./problems";

export const collections = pgTable("collections", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description").notNull(),

  creatorId: text("creator_id")
    .references(() => user.id, { onDelete: "cascade" })
    .notNull(),
  isPublic: boolean("is_public").default(false).notNull(),

  topics: jsonb("topics").$type<string[]>().default([]),
  totalQuestions: integer("total_questions").default(0),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const collectionProblems = pgTable(
  "collection_problems",
  {
    collectionId: uuid("collection_id")
      .references(() => collections.id, { onDelete: "cascade" })
      .notNull(),
    problemId: uuid("problem_id")
      .references(() => problems.id, { onDelete: "cascade" })
      .notNull(),
    order: integer("order").notNull(),
  },
  (t) => [primaryKey({ columns: [t.collectionId, t.problemId] })],
);

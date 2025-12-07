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
import { collectionTypeEnum } from "./enums";
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
  isPrivate: boolean("is_private").default(true).notNull(),
  shareSecret: text("share_secret").unique(),
  type: collectionTypeEnum("type").default("personal").notNull(),

  topics: jsonb("topics").$type<string[]>().default([]),
  totalQuestions: integer("total_questions").default(0),

  likes: integer("likes").default(0),
  shares: integer("shares").default(0),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  deletedAt: timestamp("deleted_at"),
});

export const collectionLikes = pgTable(
  "collection_likes",
  {
    collectionId: uuid("collection_id")
      .references(() => collections.id, { onDelete: "cascade" })
      .notNull(),
    userId: text("user_id")
      .references(() => user.id, { onDelete: "cascade" })
      .notNull(),
  },
  (t) => [primaryKey({ columns: [t.collectionId, t.userId] })],
);

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

export const collectionsRelations = relations(collections, ({ one, many }) => ({
  creator: one(user, {
    fields: [collections.creatorId],
    references: [user.id],
  }),
  items: many(collectionProblems),
}));

export const collectionProblemsRelations = relations(
  collectionProblems,
  ({ one }) => ({
    collection: one(collections, {
      fields: [collectionProblems.collectionId],
      references: [collections.id],
    }),
    problem: one(problems, {
      fields: [collectionProblems.problemId],
      references: [problems.id],
    }),
  }),
);

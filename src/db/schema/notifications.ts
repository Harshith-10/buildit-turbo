import { boolean, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { notificationTypeEnum } from "./enums";
import { users } from "./users";

export const notifications = pgTable("notifications", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  title: text("title").notNull(),
  message: text("message").notNull(),
  type: notificationTypeEnum("type").default("info").notNull(),
  isRead: boolean("is_read").default(false).notNull(),

  createdAt: timestamp("created_at").defaultNow().notNull(),
});

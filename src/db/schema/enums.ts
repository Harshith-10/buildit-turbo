import { pgEnum } from "drizzle-orm/pg-core";

export const userRoleEnum = pgEnum("user_role", [
  "student",
  "faculty",
  "admin",
]);

export const difficultyEnum = pgEnum("difficulty", ["easy", "medium", "hard"]);

export const examStatusEnum = pgEnum("exam_status", [
  "draft",
  "upcoming",
  "live",
  "completed",
]);

export const submissionStatusEnum = pgEnum("submission_status", [
  "accepted",
  "wrong_answer",
  "time_limit",
  "runtime_error",
  "compilation_error",
  "pending",
]);

export const notificationTypeEnum = pgEnum("notification_type", [
  "info",
  "warning",
  "success",
  "error",
]);

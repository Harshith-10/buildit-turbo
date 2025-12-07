import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { notifications } from "@/db/schema";

const notificationsData = [
  {
    title: "Welcome!",
    message: "Welcome to the platform. Start solving problems now!",
    type: "info" as const,
    isRead: false,
  },
  {
    title: "Exam Reminder",
    message: "Your 'Introduction to React' exam is starting in 2 days.",
    type: "warning" as const,
    isRead: false,
  },
  {
    title: "New Problem Added",
    message:
      "Check out the new problem 'Count Partitions with Even Sum Difference'.",
    type: "info" as const,
    isRead: false,
  },
  {
    title: "Streak Maintained",
    message: "You have maintained your 3-day streak! Keep it up!",
    type: "success" as const,
    isRead: false,
  },
  {
    title: "System Maintenance",
    message: "Scheduled maintenance on Sunday at 2:00 AM UTC.",
    type: "warning" as const,
    isRead: true,
  },
  {
    title: "New Badge Earned",
    message: "Congratulations! You earned the 'Problem Solver' badge!",
    type: "success" as const,
    isRead: false,
  },
  {
    title: "Course Recommendation",
    message: "Based on your activity, we recommend 'Advanced React Patterns'.",
    type: "info" as const,
    isRead: true,
  },
  {
    title: "Exam Results Available",
    message: "Your 'Marketing Fundamentals' exam results are now available.",
    type: "success" as const,
    isRead: false,
  },
  {
    title: "Failed Submission Alert",
    message: "Your submission for 'Two Sum' failed. Check the error details.",
    type: "error" as const,
    isRead: false,
  },
  {
    title: "Community Challenge",
    message: "Join the weekly coding challenge and win prizes!",
    type: "info" as const,
    isRead: true,
  },
];

export async function seedNotifications(userId: string): Promise<number> {
  console.log("Seeding notifications...");

  for (const notif of notificationsData) {
    const existing = await db.query.notifications.findFirst({
      where: and(
        eq(notifications.userId, userId),
        eq(notifications.title, notif.title),
      ),
    });
    if (!existing) {
      console.log(`Creating notification: ${notif.title}`);
      await db.insert(notifications).values({ ...notif, userId });
    } else {
      console.log(`Notification already exists: ${notif.title}`);
    }
  }

  return notificationsData.length;
}

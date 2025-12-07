"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { db } from "@/db";
import { examSessions } from "@/db/schema";
import { auth } from "@/lib/auth";

// Helper to check faculty permission
async function checkFacultyAccess() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || session.user.role !== "faculty") {
    throw new Error("Unauthorized: Faculty access required");
  }

  return session.user;
}

export async function revokeExamSession(sessionId: string) {
  await checkFacultyAccess();

  await db.delete(examSessions).where(eq(examSessions.id, sessionId));

  revalidatePath("/faculty/exams");
  return { success: true };
}

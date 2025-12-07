"use server";

import { eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { exams } from "@/db/schema/exams";

export async function submitExamRating(examId: string, rating: number) {
  if (rating < 1 || rating > 5) {
    throw new Error("Invalid rating");
  }

  await db
    .update(exams)
    .set({
      rating: sql`${exams.rating} + ${rating}`,
      ratingCount: sql`${exams.ratingCount} + 1`,
    })
    .where(eq(exams.id, examId));

  revalidatePath("/student/exams/take-exams");
}

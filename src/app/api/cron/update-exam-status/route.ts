import { and, eq, gt, lte } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { exams } from "@/db/schema";

export async function GET() {
  try {
    const now = new Date();

    // 1. Mark 'upcoming' exams as 'live' if start_date <= now
    const examsToStart = await db
      .update(exams)
      .set({ status: "live" })
      .where(
        and(
          eq(exams.status, "upcoming"),
          lte(exams.startDate, now),
          gt(exams.endDate, now),
        ),
      )
      .returning({ id: exams.id, title: exams.title });

    // 2. Mark 'live' exams as 'completed' if end_date <= now
    const examsToEnd = await db
      .update(exams)
      .set({ status: "completed" })
      .where(and(eq(exams.status, "live"), lte(exams.endDate, now)))
      .returning({ id: exams.id, title: exams.title });

    // 3. Mark 'draft' exams as 'upcoming' if start_date > now (optional, but good for auto-publishing if we had a 'published' flag, here we assume draft needs manual publish, but let's say we only touch upcoming/live/completed transitions for now. Actually, let's keep it simple: Drafts stay drafts until manually published to Upcoming. Once Upcoming, the cron takes over.)

    return NextResponse.json({
      success: true,
      started: examsToStart.length,
      ended: examsToEnd.length,
      details: {
        started: examsToStart.map((e) => e.title),
        ended: examsToEnd.map((e) => e.title),
      },
    });
  } catch (error) {
    console.error("Error updating exam statuses:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update exam statuses" },
      { status: 500 },
    );
  }
}

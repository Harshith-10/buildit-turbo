import { and, isNotNull, lt } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { collections, exams, problems } from "@/db/schema";

export async function GET(request: Request) {
  try {
    // Check for authorization (optional but recommended)
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      // Allow running without secret in development
      if (process.env.NODE_ENV !== "development") {
        return new NextResponse("Unauthorized", { status: 401 });
      }
    }

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Delete questions
    const deletedQuestions = await db
      .delete(problems)
      .where(
        and(
          isNotNull(problems.deletedAt),
          lt(problems.deletedAt, thirtyDaysAgo),
        ),
      )
      .returning({ id: problems.id });

    // Delete collections
    const deletedCollections = await db
      .delete(collections)
      .where(
        and(
          isNotNull(collections.deletedAt),
          lt(collections.deletedAt, thirtyDaysAgo),
        ),
      )
      .returning({ id: collections.id });

    // Delete exams
    const deletedExams = await db
      .delete(exams)
      .where(
        and(isNotNull(exams.deletedAt), lt(exams.deletedAt, thirtyDaysAgo)),
      )
      .returning({ id: exams.id });

    return NextResponse.json({
      success: true,
      deleted: {
        questions: deletedQuestions.length,
        collections: deletedCollections.length,
        exams: deletedExams.length,
      },
    });
  } catch (error) {
    console.error("Cleanup failed:", error);
    return NextResponse.json(
      { success: false, error: "Cleanup failed" },
      { status: 500 },
    );
  }
}

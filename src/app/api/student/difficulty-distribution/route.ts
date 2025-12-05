import { and, countDistinct, eq } from "drizzle-orm";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { problems, submissions } from "@/db/schema";
import { auth } from "@/lib/auth";

export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const solvedByDifficulty = await db
      .select({
        difficulty: problems.difficulty,
        count: countDistinct(submissions.problemId),
      })
      .from(submissions)
      .innerJoin(problems, eq(submissions.problemId, problems.id))
      .where(
        and(
          eq(submissions.userId, session.user.id),
          eq(submissions.status, "accepted"),
        ),
      )
      .groupBy(problems.difficulty);

    const colors = {
      easy: "#10b981", // emerald-500
      medium: "#f59e0b", // amber-500
      hard: "#ef4444", // red-500
    };

    const result = solvedByDifficulty.map((item) => ({
      name: item.difficulty.charAt(0).toUpperCase() + item.difficulty.slice(1),
      value: item.count,
      color: colors[item.difficulty as keyof typeof colors] || "#64748b",
    }));

    return NextResponse.json(result);
  } catch (error) {
    console.error("[STUDENT_DIFFICULTY_DISTRIBUTION_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

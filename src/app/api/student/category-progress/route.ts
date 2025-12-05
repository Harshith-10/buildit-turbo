import { and, count, countDistinct, eq } from "drizzle-orm";
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

    // Get total problems by category
    const totalProblems = await db
      .select({
        category: problems.category,
        count: count(problems.id),
      })
      .from(problems)
      .groupBy(problems.category);

    // Get solved problems by category
    const solvedProblems = await db
      .select({
        category: problems.category,
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
      .groupBy(problems.category);

    const result = totalProblems.map((tp) => {
      const solved = solvedProblems.find((sp) => sp.category === tp.category);
      return {
        category: tp.category,
        total: tp.count,
        solved: solved ? solved.count : 0,
      };
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("[STUDENT_CATEGORY_PROGRESS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

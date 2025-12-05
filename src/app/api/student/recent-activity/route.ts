import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { submissions } from "@/db/schema";
import { auth } from "@/lib/auth";

export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const recentSubmissions = await db.query.submissions.findMany({
      where: eq(submissions.userId, session.user.id),
      orderBy: (submissions, { desc }) => [desc(submissions.createdAt)],
      limit: 5,
      with: {
        problem: true,
      },
    });

    const formattedSubmissions = recentSubmissions.map((sub) => ({
      id: sub.id,
      problemId: sub.problemId,
      status: sub.status,
      language: sub.language,
      runtime: sub.runtime || "N/A",
      memory: sub.memory || "N/A",
      timestamp: sub.createdAt.toISOString(),
      problemTitle: sub.problem.title,
    }));

    return NextResponse.json(formattedSubmissions);
  } catch (error) {
    console.error("[STUDENT_RECENT_ACTIVITY_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

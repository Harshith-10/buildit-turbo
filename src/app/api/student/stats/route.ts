import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { user } from "@/db/schema";
import { auth } from "@/lib/auth";

export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const userData = await db.query.user.findFirst({
      where: eq(user.id, session.user.id),
      columns: {
        problemsSolved: true,
        totalProblems: true,
        examsPassed: true,
        totalExams: true,
        streak: true,
        rank: true,
      },
    });

    if (!userData) {
      return new NextResponse("User not found", { status: 404 });
    }

    return NextResponse.json(userData);
  } catch (error) {
    console.error("[STUDENT_STATS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

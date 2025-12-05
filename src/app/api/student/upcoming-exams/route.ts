import { and, eq } from "drizzle-orm";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { userExamStatus } from "@/db/schema";
import { auth } from "@/lib/auth";

export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const upcomingExams = await db.query.userExamStatus.findMany({
      where: and(
        eq(userExamStatus.userId, session.user.id),
        eq(userExamStatus.status, "upcoming"),
      ),
      with: {
        exam: true,
      },
      limit: 3,
    });

    const formattedExams = upcomingExams.map((status) => ({
      ...status.exam,
      status: status.status,
    }));

    return NextResponse.json(formattedExams);
  } catch (error) {
    console.error("[STUDENT_UPCOMING_EXAMS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

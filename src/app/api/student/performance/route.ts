import { and, eq, gte } from "drizzle-orm";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { submissions, userExamStatus } from "@/db/schema";
import { auth } from "@/lib/auth";

export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    // Fetch submissions
    const userSubmissions = await db.query.submissions.findMany({
      where: and(
        eq(submissions.userId, session.user.id),
        eq(submissions.status, "accepted"),
        gte(submissions.createdAt, sixMonthsAgo),
      ),
      columns: {
        createdAt: true,
      },
    });

    // Fetch exam statuses
    const userExams = await db.query.userExamStatus.findMany({
      where: and(
        eq(userExamStatus.userId, session.user.id),
        gte(userExamStatus.completedAt, sixMonthsAgo),
      ),
      columns: {
        completedAt: true,
        score: true,
      },
    });

    // Aggregate data
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const currentMonth = new Date().getMonth();

    interface PerformanceEntry {
      month: string;
      problemsSolved: number;
      examScore: number;
      rawMonth: number;
      rawYear: number;
    }

    // Initialize last 6 months
    const performanceData: PerformanceEntry[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(currentMonth - i);
      const monthName = months[d.getMonth()];
      performanceData.push({
        month: monthName,
        problemsSolved: 0,
        examScore: 0,
        rawMonth: d.getMonth(),
        rawYear: d.getFullYear(),
      });
    }

    userSubmissions.forEach((sub) => {
      const date = new Date(sub.createdAt);
      const month = date.getMonth();
      const year = date.getFullYear();
      const entry = performanceData.find(
        (p) => p.rawMonth === month && p.rawYear === year,
      );
      if (entry) {
        entry.problemsSolved++;
      }
    });

    userExams.forEach((exam) => {
      if (!exam.completedAt) return;
      const date = new Date(exam.completedAt);
      const month = date.getMonth();
      const year = date.getFullYear();
      const entry = performanceData.find(
        (p) => p.rawMonth === month && p.rawYear === year,
      );
      if (entry && exam.score) {
        entry.examScore += exam.score;
      }
    });

    // Clean up raw fields
    const finalData = performanceData.map(
      ({ month, problemsSolved, examScore }) => ({
        month,
        problemsSolved,
        examScore,
      }),
    );

    return NextResponse.json(finalData);
  } catch (error) {
    console.error("[STUDENT_PERFORMANCE_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

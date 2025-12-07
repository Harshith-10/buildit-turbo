import { db } from "@/db";
import { examSessions } from "@/db/schema";

export async function seedExamSessions(
  userId: string,
  examIds: string[],
): Promise<number> {
  console.log("Seeding exam sessions...");

  if (examIds.length < 5) {
    console.log("Not enough exams to seed exam sessions");
    return 0;
  }

  const sessionData = [
    {
      examId: examIds[0],
      status: "upcoming" as const,
      score: null,
      maxScore: 100,
      passed: false,
    },
    {
      examId: examIds[1],
      status: "upcoming" as const,
      score: null,
      maxScore: 150,
      passed: false,
    },
    {
      examId: examIds[2],
      status: "live" as const,
      score: null,
      maxScore: 75,
      passed: false,
    },
    {
      examId: examIds[3],
      status: "completed" as const,
      score: 88,
      maxScore: 100,
      passed: true,
      rated: true,
      startTime: new Date(Date.now() - 86400000 * 2),
      finishTime: new Date(Date.now() - 86400000 * 2 + 3000000),
      terminationType: "completed" as const,
      malpracticeAttempts: [],
    },
    {
      examId: examIds[4],
      status: "missed" as const,
      score: null,
      maxScore: 200,
      passed: false,
    },
    {
      examId: examIds[5],
      status: "completed" as const,
      score: 72,
      maxScore: 100,
      passed: true,
      rated: true,
      startTime: new Date(Date.now() - 86400000 * 7),
      finishTime: new Date(Date.now() - 86400000 * 7 + 4000000),
      terminationType: "completed" as const,
      malpracticeAttempts: [
        {
          type: "tab_switch",
          count: 2,
          events: [
            { timestamp: Date.now() - 86400000 * 7 + 1000000 },
            { timestamp: Date.now() - 86400000 * 7 + 2000000 },
          ],
        },
      ],
    },
  ];

  for (const session of sessionData) {
    await db
      .insert(examSessions)
      .values({
        userId: userId,
        examId: session.examId,
        status: session.status,
        score: session.score,
        maxScore: session.maxScore,
        passed: session.passed,
        rated: session.rated,
        startTime: session.startTime,
        finishTime: session.finishTime,
        terminationType: session.terminationType,
        malpracticeAttempts: session.malpracticeAttempts,
      })
      .onConflictDoNothing();
  }

  return sessionData.length;
}

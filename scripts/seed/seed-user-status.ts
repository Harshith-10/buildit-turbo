import { db } from "@/db";
import { userProblemStatus } from "@/db/schema";

export async function seedUserProblemStatus(
  userId: string,
  problemIds: string[],
): Promise<number> {
  console.log("Seeding user problem status...");

  if (problemIds.length < 6) {
    console.log("Not enough problems to seed user problem status");
    return 0;
  }

  const statusData = [
    { problemId: problemIds[0], isSolved: true, isBookmarked: true },
    { problemId: problemIds[1], isSolved: true, isBookmarked: true },
    { problemId: problemIds[2], isSolved: false, isBookmarked: false },
    { problemId: problemIds[3], isSolved: false, isBookmarked: true },
    { problemId: problemIds[4], isSolved: true, isBookmarked: false },
    { problemId: problemIds[5], isSolved: false, isBookmarked: false },
  ];

  for (const status of statusData) {
    await db
      .insert(userProblemStatus)
      .values({
        userId: userId,
        problemId: status.problemId,
        isSolved: status.isSolved,
        isBookmarked: status.isBookmarked,
        lastAttemptAt: new Date(),
      })
      .onConflictDoNothing();
  }

  return statusData.length;
}

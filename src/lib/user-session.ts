import { db } from "@/db";
import { session, user } from "@/db/schema/auth";
import { eq, ne, and } from "drizzle-orm";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import bcrypt from "bcryptjs";

export type SecurityQuestion = {
  question: string;
  answerHash: string;
};

export type SecurityMetadata = {
  questions: SecurityQuestion[];
};

export async function getSecurityQuestions(
  userId: string,
): Promise<string[] | null> {
  const userRecord = await db.query.user.findFirst({
    where: eq(user.id, userId),
    columns: {
      securityMetadata: true,
    },
  });

  if (!userRecord?.securityMetadata) {
    return null;
  }

  try {
    const metadata = JSON.parse(
      userRecord.securityMetadata,
    ) as SecurityMetadata;
    return metadata.questions.map((q) => q.question);
  } catch (e) {
    console.error("Failed to parse security metadata", e);
    return null;
  }
}

export async function setupSecurityQuestions(
  userId: string,
  questionsAndAnswers: { question: string; answer: string }[],
) {
  const questions: SecurityQuestion[] = [];

  for (const qa of questionsAndAnswers) {
    const sanitizedAnswer = qa.answer.trim().toLowerCase();
    const hash = await bcrypt.hash(sanitizedAnswer, 10);
    questions.push({
      question: qa.question,
      answerHash: hash,
    });
  }

  const metadata: SecurityMetadata = { questions };

  await db
    .update(user)
    .set({ securityMetadata: JSON.stringify(metadata) })
    .where(eq(user.id, userId));
}

export async function verifySecurityAnswer(
  userId: string,
  answers: { questionIndex: number; answer: string }[],
): Promise<boolean> {
  const userRecord = await db.query.user.findFirst({
    where: eq(user.id, userId),
    columns: {
      securityMetadata: true,
    },
  });

  if (!userRecord?.securityMetadata) {
    return false;
  }

  try {
    const metadata = JSON.parse(
      userRecord.securityMetadata,
    ) as SecurityMetadata;

    for (const ans of answers) {
      if (
        ans.questionIndex < 0 ||
        ans.questionIndex >= metadata.questions.length
      ) {
        return false;
      }
      const storedHash = metadata.questions[ans.questionIndex].answerHash;
      const sanitizedAnswer = ans.answer.trim().toLowerCase();
      const isValid = await bcrypt.compare(sanitizedAnswer, storedHash);
      if (!isValid) {
        return false;
      }
    }

    return true;
  } catch (e) {
    console.error("Failed to verify security answer", e);
    return false;
  }
}

export async function getActiveSessions(userId: string) {
  return await db.query.session.findMany({
    where: eq(session.userId, userId),
  });
}

export async function terminateOtherSessions(
  userId: string,
  currentSessionId: string,
) {
  await db
    .delete(session)
    .where(and(eq(session.userId, userId), ne(session.id, currentSessionId)));
}

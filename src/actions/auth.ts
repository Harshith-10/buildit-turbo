"use server";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import {
  getActiveSessions,
  getSecurityQuestions,
  setupSecurityQuestions,
  terminateOtherSessions,
  verifySecurityAnswer,
} from "@/lib/user-session";

export interface SecurityStatusResult {
  hasSecurityQuestions: boolean;
  questions: string[];
  hasMultipleSessions: boolean;
  otherSessionsCount: number;
}

export async function getSecurityStatus(): Promise<SecurityStatusResult | null> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return null;
  }

  const questions = await getSecurityQuestions(session.user.id);
  const activeSessions = await getActiveSessions(session.user.id);

  const otherSessions = activeSessions.filter(
    (s) => s.id !== session.session.id,
  );

  return {
    hasSecurityQuestions: !!questions,
    questions: questions || [],
    hasMultipleSessions: otherSessions.length > 0,
    otherSessionsCount: otherSessions.length,
  };
}

export interface SaveSecurityQuestionsResult {
  success: boolean;
  error?: string;
}

export async function saveSecurityQuestions(
  questionsAndAnswers: { question: string; answer: string }[],
): Promise<SaveSecurityQuestionsResult> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return { success: false, error: "Unauthorized" };
  }

  if (
    !questionsAndAnswers ||
    !Array.isArray(questionsAndAnswers) ||
    questionsAndAnswers.length !== 3
  ) {
    return {
      success: false,
      error: "Invalid input. Must provide 3 questions and answers.",
    };
  }

  await setupSecurityQuestions(session.user.id, questionsAndAnswers);

  return { success: true };
}

export interface VerifyAndTerminateResult {
  success: boolean;
  error?: string;
}

export async function verifyAndTerminateSessions(
  answers: { questionIndex: number; answer: string }[],
): Promise<VerifyAndTerminateResult> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return { success: false, error: "Unauthorized" };
  }

  if (!answers || !Array.isArray(answers)) {
    return { success: false, error: "Invalid input" };
  }

  const isValid = await verifySecurityAnswer(session.user.id, answers);

  if (!isValid) {
    return { success: false, error: "Incorrect answers" };
  }

  await terminateOtherSessions(session.user.id, session.session.id);

  return { success: true };
}

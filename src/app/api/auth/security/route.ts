import { auth } from "@/lib/auth";
import {
  getSecurityQuestions,
  setupSecurityQuestions,
  terminateOtherSessions,
  verifySecurityAnswer,
  getActiveSessions,
} from "@/lib/user-session";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const questions = await getSecurityQuestions(session.user.id);
  const activeSessions = await getActiveSessions(session.user.id);

  // Filter out current session from active sessions count if needed,
  // but for "multiple sessions" check, we just need the count.
  // We can also return if the current session is the only one.
  const otherSessions = activeSessions.filter(
    (s) => s.id !== session.session.id,
  );

  return NextResponse.json({
    hasSecurityQuestions: !!questions,
    questions: questions || [],
    hasMultipleSessions: otherSessions.length > 0,
    otherSessionsCount: otherSessions.length,
  });
}

export async function POST(req: Request) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { questionsAndAnswers } = body;

  if (
    !questionsAndAnswers ||
    !Array.isArray(questionsAndAnswers) ||
    questionsAndAnswers.length !== 3
  ) {
    return NextResponse.json(
      { error: "Invalid input. Must provide 3 questions and answers." },
      { status: 400 },
    );
  }

  await setupSecurityQuestions(session.user.id, questionsAndAnswers);

  return NextResponse.json({ success: true });
}

export async function PUT(req: Request) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { answers } = body;

  if (!answers || !Array.isArray(answers)) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const isValid = await verifySecurityAnswer(session.user.id, answers);

  if (!isValid) {
    return NextResponse.json({ error: "Incorrect answers" }, { status: 403 });
  }

  await terminateOtherSessions(session.user.id, session.session.id);

  return NextResponse.json({ success: true });
}

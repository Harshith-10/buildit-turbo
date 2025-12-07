import { and, asc, eq } from "drizzle-orm";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { ExamWrapper } from "@/components/student/exams/exam-wrapper";
import { db } from "@/db";
import { examQuestions, examSessions, exams } from "@/db/schema/exams";
import { problems } from "@/db/schema/problems";
import { auth } from "@/lib/auth";
import { ExamInterface } from "./exam-interface";

interface PageProps {
  params: Promise<{
    examId: string;
  }>;
}

export default async function ExamTakePage(props: PageProps) {
  const params = await props.params;
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/auth");
  }

  const exam = await db.query.exams.findFirst({
    where: eq(exams.slug, params.examId),
  });

  if (!exam) {
    notFound();
  }

  const examSession = await db.query.examSessions.findFirst({
    where: and(
      eq(examSessions.userId, session.user.id),
      eq(examSessions.examId, exam.id),
    ),
  });

  if (!examSession) {
    redirect(`/student/exams/${exam.slug}/onboarding`);
  }

  if (
    examSession.terminationType === "completed" ||
    examSession.terminationType === "terminated"
  ) {
    redirect(`/student/exams/${exam.slug}/results`);
  }

  // Fetch questions
  const questions = await db
    .select({
      problemId: examQuestions.problemId,
      order: examQuestions.order,
      points: examQuestions.points,
      title: problems.title,
      difficulty: problems.difficulty,
      description: problems.description,
      starterCode: problems.starterCode,
    })
    .from(examQuestions)
    .innerJoin(problems, eq(examQuestions.problemId, problems.id))
    .where(eq(examQuestions.examId, exam.id))
    .orderBy(asc(examQuestions.order));

  // Calculate finish time
  const startTime = examSession.startTime || new Date();
  const finishTime = new Date(startTime.getTime() + exam.duration * 60 * 1000);

  return (
    <ExamWrapper examId={params.examId} sessionId={examSession.id}>
      <ExamInterface
        exam={exam}
        session={examSession}
        questions={questions}
        finishTime={finishTime}
      />
    </ExamWrapper>
  );
}

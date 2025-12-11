import { and, asc, eq } from "drizzle-orm";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { ExamWrapper } from "@/components/student/exams/exam-wrapper";
import { db } from "@/db";
import { studentExamQuestions, examSessions, exams } from "@/db/schema/exams";
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

  const now = new Date();
  const examEnded = exam.endDate ? new Date(exam.endDate) < now : false;

  const examSession = await db.query.examSessions.findFirst({
    where: and(
      eq(examSessions.userId, session.user.id),
      eq(examSessions.examId, exam.id),
    ),
  });

  // No session exists → redirect to onboarding
  if (!examSession) {
    redirect(`/student/exams/${exam.slug}/onboarding`);
  }

  const isCompleted =
    examSession.terminationType === "completed" ||
    examSession.terminationType === "terminated" ||
    examSession.status === "completed" ||
    examSession.status === "missed";

  // If exam is completed → show results
  if (isCompleted) {
    redirect(`/student/exams/${exam.slug}/results`);
  }

  // Check if exam period has ended
  if (examEnded) {
    // Mark as missed if not completed and redirect to results
    if (examSession.status !== "missed") {
      await db
        .update(examSessions)
        .set({
          status: "missed",
          terminationType: "terminated",
          finishTime: new Date(),
        })
        .where(eq(examSessions.id, examSession.id));
    }
    redirect(`/student/exams/${exam.slug}/results?missed=true`);
  }

  // Check if individual session time has expired
  if (examSession.startTime) {
    const sessionFinishTime = new Date(
      examSession.startTime.getTime() + exam.duration * 60 * 1000
    );
    if (now > sessionFinishTime) {
      // Auto-complete the exam
      await db
        .update(examSessions)
        .set({
          status: "completed",
          terminationType: "completed",
          finishTime: new Date(),
        })
        .where(eq(examSessions.id, examSession.id));
      redirect(`/student/exams/${exam.slug}/results`);
    }
  }

  // Exam is valid and in progress → continue

  // Fetch student-specific questions
  const questions = await db
    .select({
      problemId: studentExamQuestions.problemId,
      order: studentExamQuestions.order,
      points: studentExamQuestions.points,
      title: problems.title,
      difficulty: problems.difficulty,
      description: problems.description,
      starterCode: problems.starterCode,
      examples: problems.examples,
      constraints: problems.constraints,
      testCases: problems.testCases,
    })
    .from(studentExamQuestions)
    .innerJoin(problems, eq(studentExamQuestions.problemId, problems.id))
    .where(eq(studentExamQuestions.sessionId, examSession.id))
    .orderBy(asc(studentExamQuestions.order));

  // Calculate finish time
  const startTime = examSession.startTime || new Date();
  const finishTime = new Date(startTime.getTime() + exam.duration * 60 * 1000);

  // Calculate initial malpractice count
  const initialMalpracticeCount = Array.isArray(examSession.malpracticeAttempts)
    ? (examSession.malpracticeAttempts as { type: string; count: number; events: { timestamp: number }[] }[])
        .reduce((sum, attempt) => sum + attempt.count, 0)
    : 0;

  return (
    <ExamWrapper 
      examId={params.examId} 
      sessionId={examSession.id}
      initialMalpracticeCount={initialMalpracticeCount}
    >
      <ExamInterface
        exam={exam}
        session={examSession}
        questions={questions}
        finishTime={finishTime}
      />
    </ExamWrapper>
  );
}

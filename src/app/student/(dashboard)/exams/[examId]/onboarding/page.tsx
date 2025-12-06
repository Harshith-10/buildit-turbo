import { auth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/db";
import { examSessions, exams } from "@/db/schema/exams";
import { and, eq } from "drizzle-orm";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { StartExamButton } from "./start-exam-button";

interface PageProps {
  params: Promise<{
    examId: string;
  }>;
}

export default async function ExamOnboardingPage(props: PageProps) {
  const params = await props.params;
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/auth/sign-in");
  }

  const exam = await db.query.exams.findFirst({
    where: eq(exams.id, params.examId),
  });

  if (!exam) {
    notFound();
  }

  // Check if session already exists
  const existingSession = await db.query.examSessions.findFirst({
    where: and(
      eq(examSessions.userId, session.user.id),
      eq(examSessions.examId, params.examId),
    ),
  });

  if (existingSession) {
    if (
      existingSession.terminationType === "completed" ||
      existingSession.terminationType === "terminated"
    ) {
      redirect(`/student/exams/${params.examId}/results`);
    }
    redirect(`/student/exams/${params.examId}/take`);
  }

  return (
    <div className="container mx-auto flex max-w-3xl flex-col gap-6 py-10">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">
            Exam Onboarding: {exam.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="grid gap-2">
            <h3 className="font-semibold">Instructions</h3>
            <ul className="list-inside list-disc space-y-1 text-muted-foreground">
              <li>The exam duration is {exam.duration} minutes.</li>
              <li>You must remain in fullscreen mode throughout the exam.</li>
              <li>
                Switching tabs or exiting fullscreen will be recorded as
                malpractice.
              </li>
              <li>Ensure you have a stable internet connection.</li>
            </ul>
          </div>

          <div className="rounded-lg border border-yellow-500/50 bg-yellow-500/10 p-4 text-yellow-600 dark:text-yellow-400">
            <p className="text-sm font-medium">
              Warning: Exiting fullscreen mode or switching tabs multiple times
              may lead to termination of your exam session.
            </p>
          </div>

          <div className="mt-4 flex justify-end">
            <StartExamButton examId={params.examId} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

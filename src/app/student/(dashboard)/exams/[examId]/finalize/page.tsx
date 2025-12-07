import { and, eq } from "drizzle-orm";
import { CheckCircle } from "lucide-react";
import { headers } from "next/headers";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/db";
import { examSessions, exams } from "@/db/schema/exams";
import { auth } from "@/lib/auth";

interface PageProps {
  params: Promise<{
    examId: string;
  }>;
}

export default async function ExamFinalizePage(props: PageProps) {
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
    examSession.terminationType !== "completed" &&
    examSession.terminationType !== "terminated"
  ) {
    // If not finished, redirect back to exam
    redirect(`/student/exams/${exam.slug}/take`);
  }

  return (
    <div className="container mx-auto flex max-w-3xl flex-col gap-6 py-10 items-center justify-center min-h-[60vh]">
      <Card className="w-full">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl">
            Exam Submitted Successfully!
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-6 text-center">
          <p className="text-muted-foreground">
            You have successfully completed the exam{" "}
            <strong>{exam.title}</strong>. Your responses have been recorded.
          </p>

          <div className="grid grid-cols-2 gap-4 text-left">
            <div className="rounded-lg border p-4">
              <div className="text-sm font-medium text-muted-foreground">
                Start Time
              </div>
              <div className="font-medium">
                {examSession.startTime
                  ? new Date(examSession.startTime).toLocaleString()
                  : "-"}
              </div>
            </div>
            <div className="rounded-lg border p-4">
              <div className="text-sm font-medium text-muted-foreground">
                Finish Time
              </div>
              <div className="font-medium">
                {examSession.finishTime
                  ? new Date(examSession.finishTime).toLocaleString()
                  : "-"}
              </div>
            </div>
          </div>

          <div className="flex justify-center gap-4">
            <Button asChild variant="outline">
              <Link href="/student/exams/take-exam">Back to Exams</Link>
            </Button>
            <Button asChild>
              <Link href={`/student/exams/${exam.slug}/results`}>
                View Results
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

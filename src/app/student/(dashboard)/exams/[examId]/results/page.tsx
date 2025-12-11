import { and, eq } from "drizzle-orm";
import { Award, Calendar, CheckCircle, Clock, XCircle } from "lucide-react";
import type { Metadata } from "next";
import { headers } from "next/headers";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { db } from "@/db";
import { examSessions, exams } from "@/db/schema/exams";
import { auth } from "@/lib/auth";
import { MissedExamToast } from "./missed-exam-toast";

export const metadata: Metadata = {
  title: "Exam Results | Student Portal",
  description: "View your exam results and performance",
};

interface PageProps {
  params: Promise<{
    examId: string;
  }>;
  searchParams: Promise<{
    missed?: string;
  }>;
}

export default async function ExamResultsPage(props: PageProps) {
  const params = await props.params;
  const searchParams = await props.searchParams;
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
    // No session exists → redirect to onboarding
    redirect(`/student/exams/${exam.slug}/onboarding`);
  }

  const isCompleted =
    examSession.terminationType === "completed" ||
    examSession.terminationType === "terminated" ||
    examSession.status === "completed" ||
    examSession.status === "missed";

  if (!isCompleted) {
    // Exam not completed yet → redirect to take page
    redirect(`/student/exams/${exam.slug}/take`);
  }

  const isMissed = examSession.status === "missed";
  const showMissedToast = searchParams.missed === "true";

  const score = examSession.score ?? 0;
  const maxScore = examSession.maxScore ?? exam.totalMarks ?? 100;
  const percentage = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;
  const passed = examSession.passed ?? percentage >= 60;

  const startTime = examSession.startTime
    ? new Date(examSession.startTime)
    : null;
  const finishTime = examSession.finishTime
    ? new Date(examSession.finishTime)
    : null;
  const timeTaken =
    startTime && finishTime
      ? Math.round((finishTime.getTime() - startTime.getTime()) / 60000)
      : null;

  return (
    <div className="container mx-auto flex max-w-4xl flex-col gap-6 py-10">
      {showMissedToast && <MissedExamToast />}
      
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Exam Results</h1>
        <p className="text-muted-foreground">{exam.title}</p>
      </div>

      {isMissed ? (
        <Card className="md:col-span-2 border-orange-500">
          <CardHeader className="text-center pb-2">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-orange-100">
              <XCircle className="h-10 w-10 text-orange-600" />
            </div>
            <CardTitle className="text-2xl text-orange-600">
              Exam Missed
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-muted-foreground">
              You did not attempt this exam within the scheduled time period.
            </p>
            <Badge variant="outline" className="text-orange-600 border-orange-600">
              Missed
            </Badge>
            <div className="pt-4">
              <Link href="/student/exams/upcoming">
                <Button>Browse Upcoming Exams</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid gap-6 md:grid-cols-2">
            {/* Score Card */}
            <Card className="md:col-span-2">
              <CardHeader className="text-center pb-2">
                <div
                  className={`mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full ${
                    passed ? "bg-green-100" : "bg-red-100"
                  }`}
                >
                  {passed ? (
                    <CheckCircle className="h-10 w-10 text-green-600" />
                  ) : (
                    <XCircle className="h-10 w-10 text-red-600" />
                  )}
                </div>
                <CardTitle className="text-2xl">
                  {passed
                    ? "Congratulations! You Passed!"
                    : "Better Luck Next Time"}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
            <div className="mb-6">
              <div className="text-5xl font-bold mb-2">{percentage}%</div>
              <p className="text-muted-foreground">
                {score} / {maxScore} points
              </p>
            </div>
            <Progress
              value={percentage}
              className="h-3 w-full max-w-md mx-auto"
            />
            <div className="mt-4">
              <Badge
                variant="outline"
                className={`text-lg px-4 py-1 ${
                  passed
                    ? "bg-green-500/10 text-green-600 border-green-500/50"
                    : "bg-red-500/10 text-red-600 border-red-500/50"
                }`}
              >
                {passed ? "PASSED" : "FAILED"}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Time Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Clock className="h-5 w-5" />
              Time Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Started</span>
              <span className="font-medium">
                {startTime ? startTime.toLocaleString() : "-"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Finished</span>
              <span className="font-medium">
                {finishTime ? finishTime.toLocaleString() : "-"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Time Taken</span>
              <span className="font-medium">
                {timeTaken !== null ? `${timeTaken} minutes` : "-"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Allocated Time</span>
              <span className="font-medium">{exam.duration} minutes</span>
            </div>
          </CardContent>
        </Card>

        {/* Exam Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Award className="h-5 w-5" />
              Exam Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total Questions</span>
              <span className="font-medium">{exam.totalQuestions}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Difficulty</span>
              <Badge
                variant="secondary"
                className={`capitalize ${
                  exam.difficulty === "easy"
                    ? "bg-emerald-500/10 text-emerald-500"
                    : exam.difficulty === "medium"
                      ? "bg-amber-500/10 text-amber-500"
                      : "bg-rose-500/10 text-rose-500"
                }`}
              >
                {exam.difficulty}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Category</span>
              <span className="font-medium capitalize">{exam.category}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Completion</span>
              <Badge
                variant="outline"
                className={
                  examSession.terminationType === "completed"
                    ? "bg-green-500/10 text-green-600 border-green-500/50"
                    : "bg-amber-500/10 text-amber-600 border-amber-500/50"
                }
              >
                {examSession.terminationType === "completed"
                  ? "Completed"
                  : "Terminated"}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <div className="flex justify-center gap-4">
        <Button asChild variant="outline">
          <Link href="/student/exams/past">Back to Past Exams</Link>
        </Button>
        <Button asChild>
          <Link href="/student/exams/upcoming">Browse Upcoming Exams</Link>
        </Button>
      </div>
      </>
      )}
    </div>
  );
}

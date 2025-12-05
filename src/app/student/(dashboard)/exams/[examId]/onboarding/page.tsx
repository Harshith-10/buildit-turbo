import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { db } from "@/db";
import { exams } from "@/db/schema/exams";
import { eq } from "drizzle-orm";
import {
  AlertTriangle,
  Calendar,
  CheckCircle2,
  Clock,
  FileText,
  ShieldAlert,
  Trophy,
} from "lucide-react";
import { Metadata } from "next";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Exam Onboarding | Student Portal",
  description: "Read instructions before starting the exam",
};

interface PageProps {
  params: Promise<{
    examId: string;
  }>;
}

export default async function ExamOnboardingPage(props: PageProps) {
  const params = await props.params;
  const exam = await db.query.exams.findFirst({
    where: eq(exams.id, params.examId),
  });

  if (!exam) {
    notFound();
  }

  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="container max-w-4xl py-10 space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">{exam.title}</h1>
          <p className="text-muted-foreground">{exam.description}</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Instructions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h3 className="font-medium">Before you begin:</h3>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                    <li>Ensure you have a stable internet connection.</li>
                    <li>Close all other tabs and applications.</li>
                    <li>Do not refresh the page during the exam.</li>
                    <li>
                      Make sure your webcam and microphone are working (if
                      required).
                    </li>
                  </ul>
                </div>
                <Separator />
                <div className="space-y-2">
                  <h3 className="font-medium">During the exam:</h3>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                    <li>
                      You cannot pause the timer once the exam has started.
                    </li>
                    <li>
                      Switching tabs or windows may be recorded as a violation.
                    </li>
                    <li>Submit your answers before the timer runs out.</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card className="border-destructive/50 bg-destructive/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-destructive">
                  <ShieldAlert className="h-5 w-5" />
                  Security Checks
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <span className="text-sm">Browser compatibility check</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <span className="text-sm">Webcam access check</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <span className="text-sm">Microphone access check</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <span className="text-sm">Fullscreen mode check</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Exam Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground flex items-center gap-2">
                    <Clock className="h-4 w-4" /> Duration
                  </span>
                  <span className="font-medium">{exam.duration} mins</span>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground flex items-center gap-2">
                    <Trophy className="h-4 w-4" /> Questions
                  </span>
                  <span className="font-medium">{exam.totalQuestions}</span>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground flex items-center gap-2">
                    <Calendar className="h-4 w-4" /> Scheduled
                  </span>
                  <span className="font-medium">
                    {exam.scheduledDate
                      ? exam.scheduledDate.toLocaleDateString()
                      : "Flexible"}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Difficulty
                  </span>
                  <Badge variant="secondary" className="capitalize">
                    {exam.difficulty}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-4">
              <div className="bg-amber-500/10 text-amber-600 p-4 rounded-lg text-sm flex gap-2 items-start">
                <AlertTriangle className="h-5 w-5 shrink-0" />
                <p>
                  Once you click "Start Exam", the timer will begin and cannot
                  be paused.
                </p>
              </div>
              <Button size="lg" className="w-full font-bold text-lg">
                Start Exam
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

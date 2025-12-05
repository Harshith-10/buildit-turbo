import { FinalizeView } from "@/components/student/exams/results-view";
import { db } from "@/db";
import { exams, userExamStatus } from "@/db/schema/exams";
import { and, eq } from "drizzle-orm";
import { Metadata } from "next";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Exam Submitted | Student Portal",
  description: "Exam submission confirmation",
};

interface PageProps {
  params: Promise<{
    examId: string;
  }>;
}

export default async function ExamResultsPage(props: PageProps) {
  const params = await props.params;

  // Mock user ID for now, in real app get from session
  const userId = "user_2pGg9vX7sZ5mK3nL8qW4rY6t";

  const exam = await db.query.exams.findFirst({
    where: eq(exams.id, params.examId),
  });

  if (!exam) {
    notFound();
  }

  // Find the user status for this exam
  let status = await db.query.userExamStatus.findFirst({
    where: and(
      eq(userExamStatus.examId, params.examId),
      // eq(userExamStatus.userId, userId) // Commented out for now
    ),
  });

  // If no status found, default to unrated
  const rated = status?.rated ?? false;

  return (
    <div className="flex w-full h-full items-center justify-center">
      <FinalizeView exam={exam} rated={rated} />
    </div>
  );
}

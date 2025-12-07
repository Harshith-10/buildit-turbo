import { notFound } from "next/navigation";
import { getExamBySlug } from "@/actions/faculty/exams";
import { ExamForm } from "@/components/faculty/exams/exam-form";

export default async function UpdateExamPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  try {
    const exam = await getExamBySlug(slug);

    const formattedExam = {
      ...exam,
      questions: exam.questions.map((q) => ({
        ...q,
        points: q.points ?? 10,
      })),
    };

    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Update Exam</h1>
          <p className="text-muted-foreground">
            Edit exam details and questions.
          </p>
        </div>
        <ExamForm initialData={formattedExam} isEditing />
      </div>
    );
  } catch {
    notFound();
  }
}

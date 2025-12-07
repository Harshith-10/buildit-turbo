import { ExamForm } from "@/components/faculty/exams/exam-form";

export default function CreateExamPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Create Exam</h1>
        <p className="text-muted-foreground">
          Schedule a new exam and add questions.
        </p>
      </div>
      <ExamForm />
    </div>
  );
}

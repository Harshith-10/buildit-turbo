import { notFound } from "next/navigation";
import { getQuestionBySlug } from "@/actions/faculty/questions";
import { QuestionForm } from "@/components/faculty/questions/question-form";

export default async function UpdateQuestionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  try {
    const question = await getQuestionBySlug(slug);

    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Update Question</h1>
          <p className="text-muted-foreground">Edit the question details.</p>
        </div>
        <QuestionForm initialData={question} isEditing />
      </div>
    );
  } catch {
    notFound();
  }
}

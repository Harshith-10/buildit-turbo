import { notFound } from "next/navigation";
import { getQuestion } from "@/actions/faculty/questions";
import { QuestionForm } from "@/components/faculty/questions/question-form";

export default async function UpdateQuestionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug: id } = await params; // Route param is named 'slug' but it's actually the ID
  
  try {
    const question = await getQuestion(id);

    if (!question) {
      console.error(`[UpdateQuestionPage] Question not found with ID: ${id}`);
      notFound();
    }

    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Update Question</h1>
          <p className="text-muted-foreground">Edit the question details.</p>
        </div>
        <QuestionForm initialData={question} isEditing />
      </div>
    );
  } catch (error) {
    console.error(`[UpdateQuestionPage] Error loading question with ID: ${id}`, error);
    notFound();
  }
}

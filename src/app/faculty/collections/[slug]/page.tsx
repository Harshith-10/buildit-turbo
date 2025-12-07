import { notFound } from "next/navigation";
import { getCollectionBySlug } from "@/actions/faculty/collections";
import { QuestionsSelectorWrapper } from "@/components/faculty/collections/questions-selector-wrapper";

export default async function UpdateCollectionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  try {
    const collection = await getCollectionBySlug(slug);

    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Update Collection
          </h1>
          <p className="text-muted-foreground">
            Edit collection details and manage questions.
          </p>
        </div>
        <QuestionsSelectorWrapper collection={collection} />
      </div>
    );
  } catch {
    notFound();
  }
}

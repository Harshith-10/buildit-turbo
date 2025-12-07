import { CollectionForm } from "@/components/faculty/collections/collection-form";

export default function CreateCollectionPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Create Collection</h1>
        <p className="text-muted-foreground">
          Create a new collection of problems.
        </p>
      </div>
      <CollectionForm />
    </div>
  );
}

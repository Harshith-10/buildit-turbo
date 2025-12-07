"use client";

import { useState } from "react";
import { CollectionForm } from "./collection-form";
import { QuestionsSelector } from "./questions-selector";

interface CollectionWithProblems {
  id: string;
  title: string;
  slug: string;
  description: string;
  type: "personal" | "practice_sheet" | "company";
  isPrivate: boolean;
  problems?: { id: string }[];
}

interface QuestionsSelectorWrapperProps {
  collection: CollectionWithProblems;
}

export function QuestionsSelectorWrapper({
  collection,
}: QuestionsSelectorWrapperProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>(
    collection.problems?.map((p) => p.id) || [],
  );

  return (
    <CollectionForm
      initialData={collection}
      isEditing
      selectedProblemIds={selectedIds}
    >
      <QuestionsSelector
        selectedIds={selectedIds}
        onSelectionChange={setSelectedIds}
      />
    </CollectionForm>
  );
}

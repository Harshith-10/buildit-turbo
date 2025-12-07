"use client";

import { FacultyQuestionsTable } from "@/components/faculty/questions/faculty-questions-table";

interface Problem {
  id: string;
  serialNumber: number;
  title: string;
  category: string;
  difficulty: "easy" | "medium" | "hard";
  acceptance: number;
  slug: string;
}

interface FacultyQuestionsViewProps {
  problems: Problem[];
}

export function FacultyQuestionsView({ problems }: FacultyQuestionsViewProps) {
  if (problems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center border rounded-lg bg-muted/10 border-dashed">
        <p className="text-lg font-medium">No problems found</p>
        <p className="text-sm text-muted-foreground">
          Try adjusting your filters or create a new question.
        </p>
      </div>
    );
  }

  return <FacultyQuestionsTable problems={problems} />;
}

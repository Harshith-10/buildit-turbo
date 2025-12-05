"use client";

import { ProblemsTable } from "@/components/student/problems/problems-table";

interface Problem {
  id: string;
  serialNumber: number;
  title: string;
  category: string;
  difficulty: "easy" | "medium" | "hard";
  acceptance: number;
  isSolved: boolean;
  slug: string;
}

interface ProblemsViewProps {
  problems: Problem[];
}

export function ProblemsView({ problems }: ProblemsViewProps) {
  if (problems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center border rounded-lg bg-muted/10 border-dashed">
        <p className="text-lg font-medium">No problems found</p>
        <p className="text-sm text-muted-foreground">
          Try adjusting your filters or check back later.
        </p>
      </div>
    );
  }

  return <ProblemsTable problems={problems} />;
}

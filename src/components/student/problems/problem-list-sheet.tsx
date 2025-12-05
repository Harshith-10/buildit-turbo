"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { List } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface ProblemSummary {
  id: string;
  title: string;
  difficulty: "easy" | "medium" | "hard";
  isSolved: boolean;
}

interface ProblemListSheetProps {
  problems: ProblemSummary[];
  currentProblemId: string;
}

export function ProblemListSheet({
  problems,
  currentProblemId,
}: ProblemListSheetProps) {
  const difficultyColor = {
    easy: "text-emerald-500",
    medium: "text-amber-500",
    hard: "text-rose-500",
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon">
          <List className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[400px] sm:w-[540px] p-0">
        <SheetHeader className="p-6 border-b">
          <SheetTitle>Problem List</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col overflow-y-auto h-[calc(100vh-80px)]">
          {problems.map((problem, index) => (
            <Link
              key={problem.id}
              href={`/student/problems/${problem.id}`}
              className={cn(
                "flex items-center justify-between p-4 hover:bg-muted/50 transition-colors",
                index % 2 === 0 ? "bg-background" : "bg-muted/20",
                problem.id === currentProblemId &&
                  "bg-primary/10 border-l-4 border-primary",
              )}
            >
              <div className="flex items-center gap-3">
                <span className="text-muted-foreground w-6">{index + 1}.</span>
                <span className="font-medium truncate max-w-[250px]">
                  {problem.title}
                </span>
              </div>
              <span
                className={cn(
                  "text-xs font-medium capitalize",
                  difficultyColor[problem.difficulty],
                )}
              >
                {problem.difficulty}
              </span>
            </Link>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
}

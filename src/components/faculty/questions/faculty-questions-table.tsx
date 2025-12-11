"use client";

import { Edit } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

interface Problem {
  id: string;
  serialNumber: number;
  title: string;
  category: string;
  difficulty: "easy" | "medium" | "hard";
  acceptance: number;
  slug: string;
}

interface FacultyQuestionsTableProps {
  problems: Problem[];
}

export function FacultyQuestionsTable({
  problems,
}: FacultyQuestionsTableProps) {
  const difficultyColor = {
    easy: "bg-emerald-500/10 text-emerald-500",
    medium: "bg-amber-500/10 text-amber-500",
    hard: "bg-rose-500/10 text-rose-500",
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">#</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Difficulty</TableHead>
            <TableHead>Acceptance</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {problems.map((problem) => (
            <TableRow key={problem.id}>
              <TableCell className="font-medium text-muted-foreground">
                {problem.serialNumber}
              </TableCell>
              <TableCell className="font-medium">
                <Link
                  href={`/faculty/questions/${problem.id}`}
                  className="hover:underline"
                >
                  {problem.title}
                </Link>
              </TableCell>
              <TableCell className="capitalize">{problem.category}</TableCell>
              <TableCell>
                <Badge
                  variant="secondary"
                  className={cn(
                    "capitalize",
                    difficultyColor[problem.difficulty],
                  )}
                >
                  {problem.difficulty}
                </Badge>
              </TableCell>
              <TableCell>{problem.acceptance ?? 0}%</TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="icon" asChild>
                  <Link href={`/faculty/questions/${problem.id}`}>
                    <Edit className="h-4 w-4" />
                    <span className="sr-only">Edit {problem.title}</span>
                  </Link>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

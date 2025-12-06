"use client";

import { ArrowRight, CheckCircle2 } from "lucide-react";
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
  isSolved: boolean;
  slug: string;
}

interface ProblemsTableProps {
  problems: Problem[];
}

export function ProblemsTable({ problems }: ProblemsTableProps) {
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
            <TableHead className="w-[50px]">Status</TableHead>
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
              <TableCell>
                {problem.isSolved ? (
                  <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                ) : (
                  <div className="h-5 w-5 rounded-full border-2 border-muted" />
                )}
              </TableCell>
              <TableCell className="font-medium text-muted-foreground">
                {problem.serialNumber}
              </TableCell>
              <TableCell className="font-medium">
                <Link
                  href={`/student/problems/${problem.id}`}
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
              <TableCell>{problem.acceptance}%</TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="icon" asChild>
                  <Link href={`/student/problems/${problem.id}`}>
                    <ArrowRight className="h-4 w-4" />
                    <span className="sr-only">Solve {problem.title}</span>
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

"use client";

import { ArrowRight, Eye, Play } from "lucide-react";
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

interface Exam {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  duration: number;
  totalQuestions: number;
  difficulty: "easy" | "medium" | "hard";
  category: string;
  startDate?: Date | null;
  status: "draft" | "upcoming" | "live" | "completed" | "missed";
  expiryDate?: Date | null;
}

interface ExamTableProps {
  exams: Exam[];
  actionLabel: string;
  onAction?: (exam: Exam) => void;
  actionLinkPrefix?: string;
  actionLinkSuffix?: string;
}

export function ExamTable({
  exams,
  actionLabel,
  onAction,
  actionLinkPrefix,
  actionLinkSuffix = "",
}: ExamTableProps) {
  const difficultyColor = {
    easy: "bg-emerald-500/10 text-emerald-500",
    medium: "bg-amber-500/10 text-amber-500",
    hard: "bg-rose-500/10 text-rose-500",
  };

  const statusColor: Record<string, string> = {
    draft: "bg-gray-500/10 text-gray-500",
    upcoming: "bg-blue-500/10 text-blue-500",
    live: "bg-green-500/10 text-green-500",
    completed: "bg-gray-500/10 text-gray-500",
    missed: "bg-red-500/10 text-red-500",
  };

  const getActionIcon = (label: string) => {
    if (label.toLowerCase().includes("start"))
      return <Play className="h-4 w-4" />;
    if (label.toLowerCase().includes("view"))
      return <Eye className="h-4 w-4" />;
    return <ArrowRight className="h-4 w-4" />;
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Difficulty</TableHead>
            <TableHead>Duration</TableHead>
            <TableHead>Questions</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {exams.map((exam) => (
            <TableRow key={exam.id}>
              <TableCell className="font-medium">{exam.title}</TableCell>
              <TableCell className="capitalize">{exam.category}</TableCell>
              <TableCell>
                <Badge
                  variant="secondary"
                  className={cn("capitalize", difficultyColor[exam.difficulty])}
                >
                  {exam.difficulty}
                </Badge>
              </TableCell>
              <TableCell>{exam.duration} mins</TableCell>
              <TableCell>{exam.totalQuestions}</TableCell>
              <TableCell>
                {exam.startDate ? exam.startDate.toLocaleDateString() : "-"}
              </TableCell>
              <TableCell>
                <Badge
                  variant="outline"
                  className={cn(
                    "capitalize border-0",
                    statusColor[exam.status],
                  )}
                >
                  {exam.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                {actionLinkPrefix ? (
                  <Button variant="ghost" size="icon" asChild>
                    <Link
                      href={`${actionLinkPrefix}/${exam.slug}${actionLinkSuffix}`}
                    >
                      {getActionIcon(actionLabel)}
                      <span className="sr-only">{actionLabel}</span>
                    </Link>
                  </Button>
                ) : (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onAction?.(exam)}
                  >
                    {getActionIcon(actionLabel)}
                    <span className="sr-only">{actionLabel}</span>
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

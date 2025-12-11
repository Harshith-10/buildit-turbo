"use client";

import { Calendar, Clock, Trophy } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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

interface ExamCardProps {
  exam: Exam;
  viewMode: "grid" | "list";
  actionLabel: string;
  onAction?: (exam: Exam) => void;
  actionLink?: string;
}

export function ExamCard({
  exam,
  viewMode,
  actionLabel,
  onAction,
  actionLink,
}: ExamCardProps) {
  const isGrid = viewMode === "grid";

  const difficultyColor = {
    easy: "bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20",
    medium: "bg-amber-500/10 text-amber-500 hover:bg-amber-500/20",
    hard: "bg-rose-500/10 text-rose-500 hover:bg-rose-500/20",
  };

  const statusColor: Record<string, string> = {
    draft: "bg-gray-500/10 text-gray-500",
    upcoming: "bg-blue-500/10 text-blue-500",
    live: "bg-green-500/10 text-green-500",
    completed: "bg-gray-500/10 text-gray-500",
    missed: "bg-red-500/10 text-red-500",
  };

  if (isGrid) {
    return (
      <Card className="flex flex-col h-full transition-all hover:shadow-md">
        <CardHeader>
          <div className="flex justify-between items-start mb-2">
            <Badge
              variant="secondary"
              className={cn("capitalize", difficultyColor[exam.difficulty])}
            >
              {exam.difficulty}
            </Badge>
            <Badge
              variant="outline"
              className={cn("capitalize border-0", statusColor[exam.status])}
            >
              {exam.status}
            </Badge>
          </div>
          <CardTitle className="line-clamp-1">{exam.title}</CardTitle>
          <CardDescription className="line-clamp-2">
            {exam.description}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1">
          <div className="flex flex-col gap-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>{exam.duration} mins</span>
            </div>
            <div className="flex items-center gap-2">
              <Trophy className="h-4 w-4" />
              <span>{exam.totalQuestions} Questions</span>
            </div>
            {exam.startDate && (
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{exam.startDate.toLocaleDateString()}</span>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter>
          {actionLink ? (
            <Button asChild className="w-full">
              <Link href={actionLink}>{actionLabel}</Link>
            </Button>
          ) : (
            <Button className="w-full" onClick={() => onAction?.(exam)}>
              {actionLabel}
            </Button>
          )}
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="flex flex-col sm:flex-row transition-all hover:shadow-md">
      <div className="flex-1 p-6">
        <div className="flex justify-between items-start mb-2">
          <div className="space-y-1">
            <CardTitle>{exam.title}</CardTitle>
            <CardDescription className="line-clamp-1">
              {exam.description}
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Badge
              variant="secondary"
              className={cn("capitalize", difficultyColor[exam.difficulty])}
            >
              {exam.difficulty}
            </Badge>
            <Badge
              variant="outline"
              className={cn("capitalize border-0", statusColor[exam.status])}
            >
              {exam.status}
            </Badge>
          </div>
        </div>
        <div className="flex gap-4 mt-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>{exam.duration} mins</span>
          </div>
          <div className="flex items-center gap-2">
            <Trophy className="h-4 w-4" />
            <span>{exam.totalQuestions} Questions</span>
          </div>
          {exam.startDate && (
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>{exam.startDate.toLocaleDateString()}</span>
            </div>
          )}
        </div>
      </div>
      <div className="p-6 pt-0 sm:pt-6 flex items-center justify-end sm:border-l">
        {actionLink ? (
          <Button asChild className="w-full sm:w-auto">
            <Link href={actionLink}>{actionLabel}</Link>
          </Button>
        ) : (
          <Button className="w-full sm:w-auto" onClick={() => onAction?.(exam)}>
            {actionLabel}
          </Button>
        )}
      </div>
    </Card>
  );
}

"use client";

import axios from "axios";
import { ArrowRight, Calendar, Clock, PencilLine } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { EmptyOutline } from "@/components/common/empty-outline";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Exam } from "./mock-data";

const difficultyColors = {
  easy: "bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20",
  medium: "bg-amber-500/10 text-amber-500 hover:bg-amber-500/20",
  hard: "bg-red-500/10 text-red-500 hover:bg-red-500/20",
};

interface UpcomingExamsWidgetProps {
  exams?: Exam[];
}

export function UpcomingExamsWidget({
  exams: initialExams,
}: UpcomingExamsWidgetProps) {
  const [exams, setExams] = useState<Exam[]>(initialExams || []);

  useEffect(() => {
    if (!initialExams) {
      axios.get("/api/student/upcoming-exams").then((response) => {
        setExams(response.data);
      });
    }
  }, [initialExams]);

  const upcomingExams = exams
    .filter((e) => e.status === "upcoming")
    .slice(0, 3);

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Upcoming Exams</CardTitle>
          <CardDescription>Your scheduled exams</CardDescription>
        </div>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/exams/upcoming">
            View all <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent className="h-full space-y-4">
        {!upcomingExams.length && (
          <EmptyOutline
            title="No exams scheduled"
            description="You have no exams scheduled."
            icon={<PencilLine />}
          />
        )}
        {upcomingExams.map((exam) => (
          <div
            key={exam.id}
            className="flex items-center justify-between rounded-lg border border-border p-4 transition-colors hover:bg-accent/50"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h4 className="font-medium">{exam.title}</h4>
                <Badge
                  variant="secondary"
                  className={difficultyColors[exam.difficulty]}
                >
                  {exam.difficulty}
                </Badge>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  {exam.scheduledDate}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  {exam.duration} min
                </div>
              </div>
            </div>
            <Button size="sm" variant="outline">
              Details
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

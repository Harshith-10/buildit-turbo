"use client";

import { LayoutGrid, List, Table as TableIcon } from "lucide-react";
import { useQueryState } from "nuqs";
import {
  Tabs,
  TabsContent,
  TabsContents,
  TabsList,
  TabsTrigger,
} from "@/components/animate-ui/components/radix/tabs";
import { ExamCard } from "@/components/student/exams/exam-card";
import { ExamTable } from "@/components/student/exams/exam-table";

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
  status: "draft" | "upcoming" | "live" | "completed" | "missed" | "ongoing";
  expiryDate?: Date | null;
}

interface ExamsViewProps {
  exams: Exam[];
  actionLabel: string;
  actionLinkPrefix?: string;
  actionLinkSuffix?: string;
  onAction?: (exam: Exam) => void;
  defaultView?: "grid" | "list" | "table";
}

export function ExamsView({
  exams,
  actionLabel,
  actionLinkPrefix,
  actionLinkSuffix = "",
  onAction,
  defaultView = "grid",
}: ExamsViewProps) {
  const [view, setView] = useQueryState("view", {
    defaultValue: defaultView,
    parse: (v) => v as "grid" | "list" | "table",
  });

  // Ensure view is one of the valid options
  const currentView =
    view === "grid" || view === "list" || view === "table" ? view : "grid";

  return (
    <Tabs
      value={currentView}
      onValueChange={(v) => setView(v as "grid" | "list" | "table")}
      className="w-full"
    >
      <div className="flex justify-end mb-4">
        <TabsList>
          <TabsTrigger value="grid" aria-label="Grid View">
            <LayoutGrid className="h-4 w-4" />
          </TabsTrigger>
          <TabsTrigger value="list" aria-label="List View">
            <List className="h-4 w-4" />
          </TabsTrigger>
          <TabsTrigger value="table" aria-label="Table View">
            <TableIcon className="h-4 w-4" />
          </TabsTrigger>
        </TabsList>
      </div>

      <TabsContents>
        <TabsContent value="grid">
          {exams.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center border rounded-lg bg-muted/10 border-dashed">
              <p className="text-lg font-medium">No exams found</p>
              <p className="text-sm text-muted-foreground">
                Try adjusting your filters or check back later.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {exams.map((exam) => (
                <ExamCard
                  key={exam.id}
                  exam={exam}
                  viewMode="grid"
                  actionLabel={actionLabel}
                  actionLink={
                    actionLinkPrefix
                      ? `${actionLinkPrefix}/${exam.slug}${actionLinkSuffix}`
                      : undefined
                  }
                  onAction={onAction}
                />
              ))}
            </div>
          )}
        </TabsContent>
        <TabsContent value="list">
          {exams.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center border rounded-lg bg-muted/10 border-dashed">
              <p className="text-lg font-medium">No exams found</p>
              <p className="text-sm text-muted-foreground">
                Try adjusting your filters or check back later.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {exams.map((exam) => (
                <ExamCard
                  key={exam.id}
                  exam={exam}
                  viewMode="list"
                  actionLabel={actionLabel}
                  actionLink={
                    actionLinkPrefix
                      ? `${actionLinkPrefix}/${exam.slug}${actionLinkSuffix}`
                      : undefined
                  }
                  onAction={onAction}
                />
              ))}
            </div>
          )}
        </TabsContent>
        <TabsContent value="table">
          {exams.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center border rounded-lg bg-muted/10 border-dashed">
              <p className="text-lg font-medium">No exams found</p>
              <p className="text-sm text-muted-foreground">
                Try adjusting your filters or check back later.
              </p>
            </div>
          ) : (
            <ExamTable
              exams={exams}
              actionLabel={actionLabel}
              actionLinkPrefix={actionLinkPrefix}
              actionLinkSuffix={actionLinkSuffix}
              onAction={onAction}
            />
          )}
        </TabsContent>
      </TabsContents>
    </Tabs>
  );
}

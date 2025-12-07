import { and, asc, desc, eq, ilike, or, type SQL } from "drizzle-orm";
import { Plus } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { FacultyExamsFilterBar } from "@/components/faculty/exams/faculty-exams-filter-bar";
import { ExamsView } from "@/components/student/exams/exams-view";
import { Button } from "@/components/ui/button";
import { db } from "@/db";
import { exams } from "@/db/schema/exams";

export const metadata: Metadata = {
  title: "Exams | Faculty Portal",
  description: "Manage and create exams",
};

interface PageProps {
  searchParams: Promise<{
    q?: string;
    view?: string;
    sort?: string;
    category?: string;
    difficulty?: string;
    status?: string;
  }>;
}

export default async function FacultyExamsPage(props: PageProps) {
  const searchParams = await props.searchParams;
  const q = searchParams.q || "";
  const view = (searchParams.view as "grid" | "list" | "table") || "grid";
  const sort = searchParams.sort || "latest";
  const category = searchParams.category || "all";
  const difficulty = searchParams.difficulty || "all";
  const status = searchParams.status || "all";

  const whereConditions = [];

  if (q) {
    whereConditions.push(
      or(
        ilike(exams.title, `%${q}%`),
        ilike(exams.description, `%${q}%`),
      ) as SQL<unknown>,
    );
  }

  if (category !== "all") {
    whereConditions.push(eq(exams.category, category));
  }

  if (difficulty !== "all" && ["easy", "medium", "hard"].includes(difficulty)) {
    whereConditions.push(
      eq(exams.difficulty, difficulty as "easy" | "medium" | "hard"),
    );
  }

  if (status !== "all") {
    whereConditions.push(
      eq(exams.status, status as "draft" | "upcoming" | "live" | "completed"),
    );
  }

  let orderBy = desc(exams.createdAt);
  switch (sort) {
    case "oldest":
      orderBy = asc(exams.createdAt);
      break;
    case "expiry":
      orderBy = asc(exams.startDate);
      break;
  }

  const examsData = await db.query.exams.findMany({
    where: and(...whereConditions),
    orderBy: orderBy,
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Exams</h1>
            <p className="text-muted-foreground">
              Manage and create examinations.
            </p>
          </div>
          <Button asChild>
            <Link href="/faculty/exams/create">
              <Plus className="mr-2 h-4 w-4" />
              New Exam
            </Link>
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex-1">
          <FacultyExamsFilterBar />
        </div>
      </div>

      <ExamsView
        exams={examsData}
        actionLabel="Edit Exam"
        actionLinkPrefix="/faculty/exams"
        defaultView={view}
      />
    </div>
  );
}

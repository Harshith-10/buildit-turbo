import { and, asc, desc, eq, ilike, inArray, or, type SQL } from "drizzle-orm";
import type { Metadata } from "next";
import { ExamsView } from "@/components/student/exams/exams-view";
import { FilterBar } from "@/components/student/exams/filter-bar";
import { db } from "@/db";
import { exams } from "@/db/schema/exams";

export const metadata: Metadata = {
  title: "Past Exams | Student Portal",
  description: "View results and history of your past exams",
};

interface PageProps {
  searchParams: Promise<{
    q?: string;
    view?: string;
    sort?: string;
    category?: string;
    difficulty?: string;
  }>;
}

export default async function PastExamsPage(props: PageProps) {
  const searchParams = await props.searchParams;
  const q = searchParams.q || "";
  const view = (searchParams.view as "grid" | "list" | "table") || "grid";
  const sort = searchParams.sort || "latest";
  const category = searchParams.category || "all";
  const difficulty = searchParams.difficulty || "all";

  // Past exams are completed or missed (not upcoming/live/draft)
  const whereConditions = [inArray(exams.status, ["completed", "missed"])];

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

  let orderBy = desc(exams.createdAt);
  switch (sort) {
    case "oldest":
      orderBy = asc(exams.createdAt);
      break;
    case "expiry":
      orderBy = asc(exams.endDate);
      break;
  }

  const examsData = await db.query.exams.findMany({
    where: and(...whereConditions),
    orderBy: orderBy,
  });

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Past Exams</h1>
        <p className="text-muted-foreground">
          Review your performance and results from previous exams.
        </p>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex-1">
          <FilterBar />
        </div>
      </div>

      <ExamsView
        exams={examsData}
        actionLabel="View Results"
        actionLinkPrefix="/student/exams"
        actionLinkSuffix="/results"
        defaultView={view}
      />
    </div>
  );
}

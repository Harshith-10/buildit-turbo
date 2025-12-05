import { FilterBar } from "@/components/student/exams/filter-bar";
import { ExamsView } from "@/components/student/exams/exams-view";
import { db } from "@/db";
import { exams } from "@/db/schema/exams";
import { SQL, and, asc, desc, eq, ilike, or } from "drizzle-orm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Upcoming Exams | Student Portal",
  description: "View and register for upcoming exams",
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

export default async function UpcomingExamsPage(props: PageProps) {
  const searchParams = await props.searchParams;
  const q = searchParams.q || "";
  const view = (searchParams.view as "grid" | "list" | "table") || "grid";
  const sort = searchParams.sort || "latest";
  const category = searchParams.category || "all";
  const difficulty = searchParams.difficulty || "all";

  const whereConditions = [eq(exams.status, "upcoming")];

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
      orderBy = asc(exams.scheduledDate);
      break;
  }

  const examsData = await db.query.exams.findMany({
    where: and(...whereConditions),
    orderBy: orderBy,
  });

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Upcoming Exams</h1>
        <p className="text-muted-foreground">
          Browse and register for upcoming examinations.
        </p>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex-1">
          <FilterBar />
        </div>
      </div>

      <ExamsView
        // @ts-ignore - type mismatch with DB result and component props
        exams={examsData}
        actionLabel="View Details"
        actionLinkPrefix="/student/exams"
        actionLinkSuffix="/onboarding"
        defaultView={view}
      />
    </div>
  );
}

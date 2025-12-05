import { FilterBar } from "@/components/student/exams/filter-bar";
import { ViewToggle } from "@/components/student/exams/view-toggle";
import { ExamCard } from "@/components/student/exams/exam-card";
import { ExamTable } from "@/components/student/exams/exam-table";
import { db } from "@/db";
import { exams } from "@/db/schema/exams";
import { and, asc, desc, eq, gte, ilike, or } from "drizzle-orm";
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
      or(ilike(exams.title, `%${q}%`), ilike(exams.description, `%${q}%`)),
    );
  }

  if (category !== "all") {
    whereConditions.push(eq(exams.category, category));
  }

  if (difficulty !== "all") {
    // @ts-ignore - difficulty enum type mismatch
    whereConditions.push(eq(exams.difficulty, difficulty));
  }

  let orderBy;
  switch (sort) {
    case "oldest":
      orderBy = asc(exams.createdAt);
      break;
    case "expiry":
      orderBy = asc(exams.scheduledDate);
      break;
    case "latest":
    default:
      orderBy = desc(exams.createdAt);
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
        <ViewToggle />
      </div>

      {examsData.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center border rounded-lg bg-muted/10 border-dashed">
          <p className="text-lg font-medium">No upcoming exams found</p>
          <p className="text-sm text-muted-foreground">
            Try adjusting your filters or check back later.
          </p>
        </div>
      ) : view === "table" ? (
        <ExamTable
          // @ts-ignore - type mismatch with DB result and component props
          exams={examsData}
          actionLabel="View Details"
          actionLinkPrefix="/student/exams"
        />
      ) : (
        <div
          className={
            view === "grid"
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              : "flex flex-col gap-4"
          }
        >
          {examsData.map((exam) => (
            <ExamCard
              key={exam.id}
              // @ts-ignore - type mismatch with DB result and component props
              exam={exam}
              viewMode={view}
              actionLabel="View Details"
              actionLink={`/student/exams/${exam.id}/onboarding`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

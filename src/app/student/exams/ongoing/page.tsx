import { FilterBar } from "@/components/student/exams/filter-bar";
import { ViewToggle } from "@/components/student/exams/view-toggle";
import { ExamCard } from "@/components/student/exams/exam-card";
import { ExamTable } from "@/components/student/exams/exam-table";
import { db } from "@/db";
import { exams } from "@/db/schema/exams";
import { and, asc, desc, eq, ilike, or } from "drizzle-orm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ongoing Exams | Student Portal",
  description: "View and take your ongoing exams",
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

export default async function OngoingExamsPage(props: PageProps) {
  const searchParams = await props.searchParams;
  const q = searchParams.q || "";
  const view = (searchParams.view as "grid" | "list" | "table") || "grid";
  // Default sort for ongoing is expiry (sooner first) if not specified
  const sort = searchParams.sort || "expiry";
  const category = searchParams.category || "all";
  const difficulty = searchParams.difficulty || "all";

  const whereConditions = [eq(exams.status, "live")];

  if (q) {
    whereConditions.push(
      or(ilike(exams.title, `%${q}%`), ilike(exams.description, `%${q}%`)),
    );
  }

  if (category !== "all") {
    whereConditions.push(eq(exams.category, category));
  }

  if (difficulty !== "all") {
    // @ts-ignore
    whereConditions.push(eq(exams.difficulty, difficulty));
  }

  let orderBy;
  switch (sort) {
    case "oldest":
      orderBy = asc(exams.createdAt);
      break;
    case "expiry":
      // Sort by end time / expiry
      orderBy = asc(exams.endTime);
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
        <h1 className="text-3xl font-bold tracking-tight">Ongoing Exams</h1>
        <p className="text-muted-foreground">
          Continue your exams that are currently in progress.
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
          <p className="text-lg font-medium">No ongoing exams found</p>
          <p className="text-sm text-muted-foreground">
            You don't have any active exams at the moment.
          </p>
        </div>
      ) : view === "table" ? (
        <ExamTable
          // @ts-ignore
          exams={examsData}
          actionLabel="Start Exam"
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
              // @ts-ignore
              exam={exam}
              viewMode={view}
              actionLabel="Start Exam"
              actionLink={`/student/exams/${exam.id}/onboarding`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

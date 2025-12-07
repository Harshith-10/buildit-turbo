import { and, asc, count, desc, eq, ilike, or, type SQL } from "drizzle-orm";
import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { FacultyQuestionsFilterBar } from "@/components/faculty/questions/faculty-questions-filter-bar";
import { FacultyQuestionsView } from "@/components/faculty/questions/faculty-questions-view";
import { PaginationControl } from "@/components/student/problems/pagination-control";
import { db } from "@/db";
import { problems } from "@/db/schema/problems";
import { auth } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Questions | Faculty Portal",
  description: "Manage coding problems",
};

interface PageProps {
  searchParams: Promise<{
    q?: string;
    sort?: string;
    category?: string;
    difficulty?: string;
    page?: string;
  }>;
}

const PAGE_SIZE = 10;

export default async function FacultyQuestionsPage(props: PageProps) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user?.id) {
    redirect("/auth");
  }

  const searchParams = await props.searchParams;
  const q = searchParams.q || "";
  const sort = searchParams.sort || "serial_asc";
  const category = searchParams.category || "all";
  const difficulty = searchParams.difficulty || "all";
  const page = Number(searchParams.page) || 1;
  const offset = (page - 1) * PAGE_SIZE;

  const whereConditions = [];

  if (q) {
    whereConditions.push(
      or(
        ilike(problems.title, `%${q}%`),
        ilike(problems.description, `%${q}%`),
      ) as SQL<unknown>,
    );
  }

  if (category !== "all") {
    whereConditions.push(eq(problems.category, category));
  }

  if (difficulty !== "all" && ["easy", "medium", "hard"].includes(difficulty)) {
    whereConditions.push(
      eq(problems.difficulty, difficulty as "easy" | "medium" | "hard"),
    );
  }

  let orderBy = asc(problems.serialNumber);

  if (sort === "oldest") {
    orderBy = asc(problems.createdAt);
  } else if (sort === "difficulty-asc") {
    orderBy = asc(problems.difficulty);
  } else if (sort === "difficulty-desc") {
    orderBy = desc(problems.difficulty);
  } else if (sort === "acceptance-asc") {
    orderBy = asc(problems.acceptance);
  } else if (sort === "acceptance-desc") {
    orderBy = desc(problems.acceptance);
  } else if (sort === "newest") {
    orderBy = desc(problems.createdAt);
  }

  const data = await db
    .select({
      id: problems.id,
      serialNumber: problems.serialNumber,
      title: problems.title,
      slug: problems.slug,
      category: problems.category,
      difficulty: problems.difficulty,
      acceptance: problems.acceptance,
      createdAt: problems.createdAt,
    })
    .from(problems)
    .where(and(...whereConditions))
    .orderBy(orderBy)
    .limit(PAGE_SIZE)
    .offset(offset);

  const [totalCountResult] = await db
    .select({ count: count() })
    .from(problems)
    .where(and(...whereConditions));

  const totalCount = totalCountResult?.count || 0;

  const formattedProblems = data.map((p) => ({
    ...p,
    acceptance: p.acceptance ?? 0,
  }));

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Questions</h1>
        <p className="text-muted-foreground">
          Manage and create coding problems.
        </p>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex-1">
          <FacultyQuestionsFilterBar />
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <FacultyQuestionsView problems={formattedProblems} />
        <PaginationControl
          totalCount={totalCount}
          pageSize={PAGE_SIZE}
          currentPage={page}
        />
      </div>
    </div>
  );
}
